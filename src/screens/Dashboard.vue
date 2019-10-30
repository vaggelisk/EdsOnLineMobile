<template>
  <v-container fluid style="padding:0px 10px 5px 10px;background-color: rgb(244,244,244)" >
  <!--<v-container fluid grid-list-md fill-height style="padding:0px 10px 5px 10px;width:100%;height:100%">-->
    <v-layout column v-if="userLogged">
        <v-flex style="height: 300px">
            <!--<v-layout >-->
            <Map
                v-if="mapData[vesselList[vesselList.length-1].name]"
                v-bind:points="mapData[vesselList[vesselList.length-1].name]"
                v-bind:zoom="2"/>
            <!--</v-layout>-->
        </v-flex>

        <v-flex>
            <v-layout >
                <DashboardCard
                        v-for="vessel in vesselList" :key="vessel"
                        v-bind:cardData="cardData[vessel.name]">
                </DashboardCard>
            </v-layout>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import axios from 'axios'
import DashboardCard from '../controls/DashboardCard'
import Map from '../controls/Map'

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {globalStore} from "../main.js"

export default {
  name: "Dashboard",
  components: {
      DashboardCard,
      Map
   },
   data: function ()
   {
        return {
            cardData:{},
            mapData:{},
            email:'',
            password:'',
            show: false,
            alert:false
        }
    },
    created()
    {
    },
    computed: {
        userLogged: function () { return globalStore.userLogged; },
        dataLoaded: function () { return globalStore.type; },
        vesselList: function () { return globalStore.userProfile.vessels;}
    },
    mounted()
    {
        try
        {
            setTimeout(() => {
                this.setDatawDashData();
            }, 600);
        }
        catch(err)
        {
            console.log('error '+err);
            setTimeout(() => {
                this.setDatawDashData();
            }, 600);
        }
    },
    methods: {
        setDatawDashData()
        {
            for(let v=0;v<this.vesselList.length;v++)
            {
                let vessel = this.vesselList[v];
                let vessDash = globalStore.dashboard[vessel.name];

                var cardDict={};

                this.$set(cardDict, 'name', vessel.name);
                this.$set(cardDict, 'imo', vessel.imo);

                this.$set(cardDict, 'lastUpdate', vessDash.date.slice(0, 10));


                let params=['LAT','LON']

                for (let p=0;p<params.length;p++)
                {
                    this.$set(cardDict,params[p],{
                        label:globalStore.mapping[params[p]],
                        value:vessDash[params[p]],
                        unit:'',
                        format:4
                    });
                }

                params=['ME_Power_perc','ensp','STW'];

                for (let p=0;p<params.length;p++)
                {
                    this.$set(cardDict,params[p],{
                        label:globalStore.mapping[params[p]],
                        value:vessDash[params[p]],
                        unit:'['+globalStore.units[params[p]]+']',
                        format:2
                    });
                }

                if ((cardDict['ME_Power_perc'].value==-1000)&&(vessDash['load']!=-1000))
                    cardDict['ME_Power_perc'].value = vessDash['load']*100;


                let nvg = true;
                let stateText = vessDash['engineStateText'];

                if (stateText==undefined)
                {
                    if (vessDash['engineState']==-1000) nvg=false;
                }
                else
                {
                    if ((stateText!='Running')&&(stateText!='Slowdown')) nvg= false;
                }

                this.$set(cardDict,'engineState',{
                    label:'Engine State',
                    value:stateText,
                    unit:'',
                    format:null,
                    nav:nvg
                });

                this.$set(cardDict,'faults',{
                    label:'Faults',
                    value:vessDash['Faults'],
                    unit:'',
                    format:null
                });

                this.$set(cardDict,'bsfc',{
                    title:globalStore.mapping['bsfc'],
                    unit:globalStore.units['bsfc'],
                    value: vessDash['bsfc'][vessDash['bsfc'].length-1],
                    format: 1
                });

                this.$set(cardDict.bsfc,'chartOptions', {
                    credits:{enabled:false},
                    chart:{ backgroundColor:'transparent'},
                    tooltip:{
                        formatter: function () {
                            return this.points.reduce(function (s, point) {
                                return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                            },'');
                        },
                        shared:true
                    },
                    legend:{
                        enabled:true,
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal', },
                    title:{ text:undefined },
                    xAxis: {
                        labels:{ enabled:false},
                        crosshair:true
                    },
                    yAxis: {
                        labels:{ enabled:false },
                        title:{ text:undefined}},
                    exporting:{
                        enabled : false
                    },
                    series: [{
                        name:'Values',
                        type:'line',
                        data:[],
                        marker:{
                            enabled:false
                        },
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    },
                    {
                        name:'Ref',
                        type:'line',
                        data:[],
                        marker:{
                            enabled:false
                        },
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    }]
                });

                for (let i=0;i<vessDash['bsfcRef'].length;i++)
                {
                    if (vessDash['bsfc'][i]!=-1000)
                        cardDict.bsfc.chartOptions.series[0].data.push([i, vessDash['bsfc'][i]]);

                    if (vessDash['bsfcRef'][i]!=-1000)
                        cardDict.bsfc.chartOptions.series[1].data.push([i,vessDash['bsfcRef'][i]]);
                }

                this.$set(cardDict,'fcon',{
                    title:globalStore.mapping['fcon'],
                    unit:globalStore.units['fcon'],
                    value: vessDash['fcon'][vessDash['fcon'].length-1],
                    format: 1
                });

                this.$set(cardDict.fcon,'chartOptions', {
                    credits:{enabled:false},
                    chart:{ backgroundColor:'transparent'},
                    tooltip:{
                        formatter: function () {
                            return this.points.reduce(function (s, point) {
                                return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                            },'');
                        },
                        shared:true
                    },
                    legend:{
                        enabled:true,
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal', },
                    title:{ text:undefined },
                    xAxis: {
                        labels:{ enabled:false},
                        crosshair:true
                    },
                    yAxis: {
                        labels:{ enabled:false },
                        title:{ text:undefined}},
                    exporting:{
                        enabled : false
                    },
                    series: [{
                        name:'Values',
                        type:'line',
                        data:[],
                        marker:{
                            enabled:false
                        },
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    },
                    {
                        name:'Ref',
                        type:'line',
                        data:[],
                        marker:{
                            enabled:false
                        },
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    }]
                });

                for (let i=0;i<vessDash['fconRef'].length;i++)
                {
                    if (vessDash['fcon'][i]!=-1000)
                        cardDict.fcon.chartOptions.series[0].data.push([i, vessDash['fcon'][i]]);

                    if (vessDash['fconRef'][i]!=-1000)
                        cardDict.fcon.chartOptions.series[1].data.push([i, vessDash['fconRef'][i]]);
                }

                this.$set(cardDict,'sloc',{
                    title:'SLOC setting',
                    unit:globalStore.units['sloc'],
                    value: vessDash['sloc'][vessDash['sloc'].length-1],
                    format: 1
                });

                this.$set(cardDict.sloc,'chartOptions', {
                    credits:{enabled:false},
                    chart:{ backgroundColor:'transparent'},
                    tooltip:{
                        formatter: function () {
                            return this.points.reduce(function (s, point) {
                                return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                            },'');
                        },
                        shared:true
                    },
                    legend:{
                        enabled:true,
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal', },
                    title:{ text:undefined },
                    xAxis: {
                        labels:{ enabled:false},
                        crosshair:true
                    },
                    yAxis: {
                        labels:{ enabled:false },
                        title:{ text:undefined}},
                    exporting:{
                        enabled : false
                    },
                    series: [{
                        name:'Values',
                        type:'line',
                        data:[],
                        marker:{
                            enabled:false
                        },
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    }
                    ]
                });

                for (let i=0;i<vessDash['sloc'].length;i++)
                {
                    if (vessDash['sloc'][i]!=-1000)
                        cardDict.sloc.chartOptions.series[0].data.push([i, vessDash['sloc'][i]]);
                }

                // if (globalStore.type == 'last')
                // {
                var points= [];

                let currDate = vessDash.date.slice(0,10);

                params=['ME_Power_perc','ensp','STW'];
                let html ='<b>'+currDate+' '+vessel.name+'</b><br>';


                for (let p=0;p<params.length;p++)
                {
                    if (vessDash[params[p]]!=-1000)
                        html += globalStore.mapping[params[p]]+': '+ vessDash[params[p]].toFixed(2)+' ['+globalStore.units[params[p]]+']<br>';
                    else if ((params[p]=='ME_Power_perc')&&(vessDash['load']!=-1000))
                        html += globalStore.mapping[params[p]]+': '+  (vessDash['load']*100).toFixed(2)+' ['+globalStore.units[params[p]]+']<br>';
                    else html += globalStore.mapping[params[p]]+': - ['+globalStore.units[params[p]]+']<br>';
                }

                html +='Faults: '+vessDash['Faults'];

                points.push({
                    'date':currDate.replace(/-/g,''),
                    'coords':[vessDash['LON'], vessDash['LAT']],
                    'color':0,
                    'html':html,
                    'status':stateText,
                    'vessel':vessel.name,
                    'imo' :vessel.imo
                });


                //let now = new Date(globalStore.dashboard.date);
                let dates = Object.keys(globalStore.mapData[vessel.name]);

                for (let i=dates.length-1;i>=0;i--)
                {
                    let currDate = dates[i];//now.toISOString().substring(0,10);

                    let temp = globalStore.mapData[vessel.name][currDate];

                    html ='<b>'+currDate+' '+vessel.name+'</b><br>';

                    for (let p=0;p<params.length;p++)
                    {
                        if (temp[params[p]]!=-1000)
                            html += globalStore.mapping[params[p]]+': '+ temp[params[p]].toFixed(2)+' ['+globalStore.units[params[p]]+']<br>';
                        else if ((params[p]=='ME_Power_perc')&&(temp['load']!=-1000))
                            html += globalStore.mapping[params[p]]+': '+  (temp['load']*100).toFixed(2)+' ['+globalStore.units[params[p]]+']<br>';
                        else html += globalStore.mapping[params[p]]+': - ['+globalStore.units[params[p]]+']<br>';
                    }

                    html +='Faults: '+temp['Faults'];

                    points.push({
                        'date':currDate.replace(/-/g,''),
                        'coords':[temp['LON'],temp['LAT']],
                        'color':temp['mapColor'],
                        'html':html,
                        'status':'running',
                        'vessel':vessel.name,
                        'imo' :vessel.imo
                    });

                }
                //console.log(points);
                this.$set(this.mapData, vessel.name,points);

                //}

                this.$set(cardDict, 'engineColor', vessDash['eng_KPI_color']);

                let kpi = vessDash['eng_KPI']*100;

                if (kpi.toFixed(1)!='100.0') this.$set(cardDict, 'engineKPI',kpi.toFixed(1));
                else this.$set(cardDict, 'engineKPI',kpi.toFixed(0));

                this.$set(this.cardData,vessel.name,cardDict);
            }

            document.body.style.cursor = 'default';

        },
        average: function(param, count, data, timestamp)
        {
            let sum =0;

            for (let i=1;i<=count;i++)
            {
                if (data[timestamp][param+i]!=-1000) sum+=data[timestamp][param+i];
                else count--;
            }

            if ((sum==0)||(count==0)) return -1000;
            else return sum/count;
        },
        // setAlerts(notif)
        // {
        //     if (notif!=null)
        //     {
        //         axios.get('http://eds2.propulsionanalytics.com/fault/fakeFaults').then(response => {
        //             globalStore.faults = JSON.parse(response.data).aggrEvents;

        //             for (let i=0;i<notif.length;i++)
        //             {
        //                 var sel =  globalStore.faults.filter(function(item){
        //                     return item.fault == notif[i].faultName;
        //                 }).filter(function(item){
        //                     return (item.element+" "+item.index) == notif[i].faultComponent;
        //                 });

        //                 if (sel.length>0)
        //                 {
        //                     for (let s=0;s<sel.length;s++)
        //                         globalStore.alerts.push({
        //                             Id:sel[s].Id,
        //                             Vessel:notif[i].faultVessel,
        //                             Engine:notif[i].faultEngine,
        //                             Component:notif[i].faultComponent,
        //                             Subsystem:sel[s].component,
        //                             Fault:notif[i].faultName,
        //                             Date:notif[i].faultDatetime.date
        //                         });

        //                 }
        //             }
        //         })

        //     }

        // }
    },
    watch: {
        dataLoaded : function()
        {
           try
            {
                setTimeout(() => {
                    this.setDatawDashData();
                }, 600);
            }
            catch(err)
            {
                console.log('error '+err);
                setTimeout(() => {
                    this.setDatawDashData();
                }, 600);
            }
        }
    }
}
</script>

<style scoped>
.alert
 {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width:300px;
    height:100px;
    background-color:white;
    /* color: rgb(33,33,33);
    background-color:transparent; */
}

</style>
