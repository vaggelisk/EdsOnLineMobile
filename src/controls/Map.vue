<template>
    <v-card flat fill-height style="height:100%;">
        <v-card-actions fill-height style="height:100%;">  
            <MglMap ref="map" :accessToken="accessToken" :mapStyle="style" :zoom="zoom" :center="center" @movestart="moveStart" @moveend="moveEnd" @mousedown="select"> 
                <MglNavigationControl position="top-right" /> 
                <MglGeojsonLayer :layer="geoJsonlayer"/>   
                <MglMarker v-for="(point,index) in points" :key="point" :coordinates="point.coords"  anchor="bottom"
                    @click="navTo(point)" @mouseenter="showMarkerPopUp(point)" @mouseleave="hideMarkerPopUp()"  >
                    <v-icon v-if="index==0" v-show="showMarkers" slot="marker" color="rgb(51,82,128)">directions_boat</v-icon>
                    <v-icon v-else-if="index==pointA || index == pointB" v-show="showMarkers" size=16 slot="marker" color="rgb(51,82,128)">lens</v-icon>
                    <v-icon v-else-if="pointB!=-1 && index<pointA && index > pointB" v-show="showMarkers" size=10 slot="marker" color="rgb(51,82,128)">lens</v-icon>
                    <v-icon v-else size=10 v-show="showMarkers" slot="marker" :color="getColor(point.color)" >lens</v-icon>
                </MglMarker>           
            </MglMap>          
        </v-card-actions>
    </v-card>
</template>

<script>

    import axios from 'axios'
    import Mapbox from "mapbox-gl";
    import { MglMap, MglNavigationControl, MglGeojsonLayer, MglMarker, MglPopup  } from "vue-mapbox";
    
    import {globalStore} from "../main.js"
    
    export default {
        name: "Map",
        components: {
            Mapbox,
            MglMap,
            MglNavigationControl,
            MglGeojsonLayer,
            MglMarker,
            MglPopup 
        },
        props: {
            points:Array,
            route:Array, 
            zoom:Number,
            //center:Object
        },
        data: function () {
            return {                
                dot:require('../assets/blueDot.png'),
                dotRoute:require('../assets/blueDotRoute.png'),
                accessToken:'pk.eyJ1IjoicHJvcHVsc2lvbmFuYWx5dGljcyIsImEiOiJjanZ4eDRsbWcwNXFnM3lwMTRxdjY5ZzJhIn0.Oh-dFes1bd77Wnl68NoT9g',
                style: 'mapbox://styles/mapbox/streets-v10',
                showMarkers:false,
                geoJsonlayer:{
                    "id": "route",
                    "type": "line",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "LineString",
                                "coordinates": []
                            }
                        }
                    },
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    "paint": {
                        "line-color": "rgb(51,82,128)",
                        "line-width": 4
                    }
                },
                pointA:-1,
                pointB:-1,
                center:[0,0]

            }
        },
        methods: {
            select(me)
            {
                var e = window.event;

                if (e.which==3) 
                {
                    let lngLat = me.mapboxEvent.lngLat;

                    let minLat = lngLat.lat-1, maxLat = lngLat.lat+1, minLng = lngLat.lng-1, maxLng = lngLat.lng+1;

                    let nearPoints = this.points.filter(function(item) {                        
                        return item.coords[0]>minLng && item.coords[0]<maxLng && item.coords[1]>minLat && item.coords[1]<maxLat;
                    });

                    if (nearPoints.length>0) 
                    {                        
                        let index = this.points.indexOf(nearPoints[0]);

                        if (this.pointA == -1) this.pointA = index;                        
                        else if (index == this.pointA) this.pointA=-1;
                        else if (index == this.pointB) this.pointB = -1;
                        else if (index<this.pointA) this.pointB = index;
                        else if (index>this.pointA)
                        {
                            this.pointB = this.pointA;
                            this.pointA = index;
                        }
                    }

                    if ((this.pointA!=-1)&&(this.pointB!=-1)) this.showAtoBPopUp();
                }

                
            },
            navTo(point)
            {       
                this.$refs['map'].map.getCanvas().style.cursor = 'progress';
                
                globalStore.mapDate = point.date;
                            
                setTimeout(() => {
                    globalStore.selectedVessel = point.vessel;
                    this.$router.push( { path: `/vessel-view/${point.vessel}` });}, 1000); 
            }, 
            moveStart()
            {
                this.showMarkers = false;
            }, 
            moveEnd()
            {
                this.showMarkers = true;
            },
            getColor(clr)
            {
                if (clr==0) return 'rgb(60, 171, 48)';
                else if (clr==10) return 'rgb(255, 184, 29)';
                else return 'rgb(205, 57, 64)';

            },
            showAtoBPopUp()
            {
                if (Object.keys(this.$refs).includes('abPopup'))
                    this.$refs['abPopup'].remove();

                var popup = new mapboxgl.Popup({
                    maxWidth:'500px',
                    anchor:'top',
                    closeButton: false,
                    closeOnClick: true
                });
                
                let A = this.points[this.pointA], B = this.points[this.pointB];

                let coords = [(A.coords[0]+B.coords[0])/2,(A.coords[1]+B.coords[1])/2];

                let html = '<b>From '+A.html.slice(3,13)+' to '+B.html.slice(3,13)+'</b><br>';
                
                axios.get('http://eds2.propulsionanalytics.com/GetWiDEDataForPeriodPerVessel/'+A.imo+'/'+A.html.slice(3,13)+'/'+B.html.slice(3,13)).then(response => {

                    var tags = Object.keys(response.data.data);
                    for (let i=0;i<tags.length;i++)
                    {
                        let temp = response.data.data[tags[i]];

                        html+= globalStore.mapping[tags[i]] +" ("+temp.type+") :";

                        if (temp.value!=-1000) html+= temp.value.toFixed(2)+" ["+globalStore.units[tags[i]]+"]<br>";
                        else html+= "- ["+globalStore.units[tags[i]]+"]<br>";

                        //console.log(temp);
                    }

                    
                    popup.setLngLat(coords)
                        .setHTML(html)
                        .addTo(this.$refs['map'].map);
        
                    this.$refs['abPopup']= popup;
                })

            },
            showMarkerPopUp(marker)
            {
                var popup = new mapboxgl.Popup({
                    maxWidth:'500px',
                    anchor:'top',
                    closeButton: false,
                    closeOnClick: false
                });

                popup.setLngLat(marker.coords)
                    .setHTML(marker.html)
                    .addTo(this.$refs['map'].map);
    
                this.$refs['markerPopup']= popup;
            },
            hideMarkerPopUp()
            {
                this.$refs['markerPopup'].remove();
                
            }
        },
        created()
        {
            this.mapbox = Mapbox;          
            
        },
        mounted() {

            if ((this.route!=undefined)&&(this.route.length>0))
            {
                var data =  
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: []
                    }
                };

                // data.geometry.coordinates=this.route.map(function (item) {
                //     return item.coords;
                // });

                for (let i=0;i<this.route.length;i++)
                {
                    let item = this.route[i].coords;

                    if (i>0)
                    {
                        let previous = this.route[i-1].coords;

                        //console.log((item[0]>previous[0]-1)+" "+(item[0]<previous[0]+1)+" "+(item[1]>previous[1]-1)+" "+(item[1]<previous[1]+1));

                        if ((item[0]>previous[0]-1) && (item[0]<previous[0]+1) && (item[1]>previous[1]-1) && (item[1]<previous[1]+1))
                            data.geometry.coordinates.push(item);
                    }
                    else data.geometry.coordinates.push(item);                    
                }

                console.log(data);
                
                 setTimeout(() => {
                     this.$refs['map'].map.getSource('route').setData(data);},2000);             

            }

            this.center = this.points[0].coords;
            
            this.showMarkers = true;
            // setTimeout(() => {
            //     this.$refs['map'].map.panTo(this.points[0].coords);},2000);            
            
        }, 
        watch:
        {
            points: function ()
            {
                this.center = this.points[0].coords;
                
                this.showMarkers = true;
                // setTimeout(() => {
                //     this.$refs['map'].map.panTo(this.points[0].coords);});

            },
            route: function ()
            {
                var data =  
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: []
                    }
                };

                for (let i=0;i<this.route.length;i++)
                {
                    let item = this.route[i].coords;

                    if (i>0)
                    {
                        let previous = this.route[i-1].coords;

                        //console.log((item[0]>previous[0]-1)+" "+(item[0]<previous[0]+1)+" "+(item[1]>previous[1]-1)+" "+(item[1]<previous[1]+1));

                        if ((item[0]>previous[0]-1) && (item[0]<previous[0]+1) && (item[1]>previous[1]-1) && (item[1]<previous[1]+1))
                            data.geometry.coordinates.push(item);
                    }
                    else data.geometry.coordinates.push(item);

                    
                }

                // data.geometry.coordinates=this.route.map(function (item) {
                //     return item.coords;
                // });
                console.log(data);

                this.$refs['map'].map.getSource('route').setData(data);
                this.center = this.points[0].coords;
                
                this.showMarkers = true;
                ///this.$refs['map'].map.panTo(data.geometry.coordinates[data.geometry.coordinates.length-1]);
               
            }
        }
    }
</script>

<style scoped>

</style>


 