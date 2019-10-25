<template>
    <v-card flat fill-height style="height:100%;">
        <v-card-title  primary class="title" style="height:5%;">Vessel Info</v-card-title>

        <v-card-actions fill-height style="height:95%;">  
            <v-container fluid fill-height grid-list-md style="padding:5px;">
                <v-layout fill-height column>
                    <v-flex d-flex md7>
                        <v-layout column fill-height>
                            <v-layout v-for="item in vesselData" :key="item" row>
                                <v-flex md7 v-if="item.label" d-flex>{{item.label}}: </v-flex>
                                <v-flex md5 v-if="item.value==-1000" d-flex>- {{item.unit}}</v-flex>                  
                                <v-flex md5 v-else-if="item.format!=null" d-flex>{{item.value.toFixed(item.format)}} {{item.unit}}</v-flex>                             
                                <v-flex md5 v-else-if="item.value" d-flex>{{item.value}} {{item.unit}}</v-flex>
                            </v-layout>
                        </v-layout>
                    </v-flex>
                    <v-flex d-flex md5>
                         <!-- <baidu-map style="width:100%; height:100%;"  ak="YOUR_APP_KEY"
                            :center="{lng: points[points.length-1].lng, lat: points[points.length-1].lat}" :zoom="3" :scroll-wheel-zoom="true">
                            <bm-polyline 
                                :path="points" 
                                stroke-color="rgb(51,82,128)" 
                                :stroke-opacity="0.5" 
                                :stroke-weight="2"/>
                            <bm-label
                                :content="points[points.length-1].text"
                                :position="{lng: points[points.length-1].lng, lat: points[points.length-1].lat}"                    
                                :offset="{width: 5, height: 5}"
                                :labelStyle="{color: 'white', fontSize : '14px', border: 'rgb(51,82,128)', background: 'rgb(51,82,128)', padding:'5px'}"/>
                        </baidu-map> -->
                        <Map 
                            v-if="vesselData['route']"
                            v-bind:points="vesselData['points']"
                            v-bind:route="vesselData['route']"
                            v-bind:zoom="4"/>
                    </v-flex>                   
                </v-layout>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script>

    // import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    // import {BmPolyline,BmPointCollection, BmLabel} from 'vue-baidu-map'
    
    import Map from './Map'

    export default {
        name: "DashboardCard",
        components: {
            Map
            // BaiduMap, 
            // BmPolyline,
            // BmPointCollection, 
            // BmLabel
        },
        props: {
            vesselData:Object
        },
        data: function () {
            return { 
                parameters:['ME_Torque_perc','ME_Power_perc','ensp','STW','SOG','Slip_STW','Slip_SOG' ,'COG','Wind_Speed','Wind_direction_relative','Water_Depth','Rudder_angle']
            }
        },
        methods: {
        },
        mounted() {
            
        }, 
        watch:
        {
        }
    }
</script>

<style scoped>
</style>


