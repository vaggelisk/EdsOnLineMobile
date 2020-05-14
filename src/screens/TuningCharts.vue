<template>
    <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;width:100%;height:100%;background-color:white;">
        <v-layout row>
            <v-flex d-flex md4>                
                <v-card> 
                    <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">Rail Pressures</v-card-title>
                    <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                        <v-layout column style="height:100%;width:100%;">
                            <v-flex d-flex md6>
                                <BarChart
                                    v-if="chartData['loadvfRailPres']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['loadvfRailPres']"
                                    v-bind:flat="true"
                                    title=""/>
                                </v-flex>
                            <v-flex d-flex md6>
                                <BarChart
                                    v-if="chartData['loadvsoPresDispl']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['loadvsoPresDispl']"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                        </v-layout>
                    </v-card-actions> 
                </v-card>
            </v-flex>
            <v-flex d-flex md4>
                <v-card> 
                    <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">Electronic VIT</v-card-title>
                    <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                        <v-layout column style="height:100%;width:100%;">
                            <v-flex d-flex md4>
                                <BarChart
                                    v-if="chartData['pscav_relvvit_a']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['pscav_relvvit_a']"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                            <v-flex d-flex md4>
                                <BarChart
                                    v-if="chartData['ensp_relvvit_b']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['ensp_relvvit_b']"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                            <v-flex d-flex md4>
                                <BarChart
                                    v-if="chartData['fRailPresvvit_c']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['fRailPresvvit_c']"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                        </v-layout>
                    </v-card-actions> 
                </v-card>
            </v-flex>
            <v-flex d-flex md4>
                <v-card> 
                    <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">Electronic VEC / VEO</v-card-title>
                    <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                        <v-layout column style="height:100%;width:100%;">
                            <v-flex d-flex md4>
                                <BarChart
                                    v-if="chartData['ensp_relvvec']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['ensp_relvvec']"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                            <v-flex d-flex md4>
                                <BarChart
                                    v-if="chartData['pscav_relvvec']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['pscav_relvvec']"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                            <v-flex d-flex md4>
                                <BarChart
                                    v-if="chartData['ensp_relvveo']"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['ensp_relvveo']"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>  
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>       
</template>

<script>

import {globalStore} from "../main.js"
import BarChart from  '../controls/BarChart'

  export default {
    name: "TuningCharts",
    components: {
        BarChart
    },
    data () {
      return {
        chartData:{}
      }
    },    
    props:{
        active:Boolean        
    },
    created() {     
    },
    mounted() {
        setTimeout(() => {
            this.setData();
        }, 400);
    },
    methods: {
        setData()
        {            
            let keys = Object.keys(globalStore.chartData['controlLawsTier2']);
            
            let timestamps = Object.keys(globalStore.signals);
            let last = timestamps[timestamps.length-1];

            for (let i=0;i<keys.length;i++)
            {                
                let paramKeys = Object.keys(globalStore.chartData['controlLawsTier2'][keys[i]]);

                this.$set(this.chartData,keys[i], {
                    credits:{enabled:false},
                    chart:{ 
                        backgroundColor:'transparent',                                    
                        zoomType: 'xy'},
                    legend:{
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'},
                    title:{ text:undefined },
                    xAxis: { 
                        crosshair:true,
                        title:{ 
                            text:globalStore.mapping[paramKeys[0].replace('_rel','')] +" ["+globalStore.units[paramKeys[0].replace('_rel','')]+"]",
                            align:'high'
                        }
                    },
                    yAxis: {
                        labels:{ enabled:true },
                        title:{ 
                            text:globalStore.mapping[paramKeys[1].replace('_rel','')] +" ["+globalStore.units[paramKeys[1].replace('_rel','')]+"]",
                            align:'high'
                        }
                    },
                    exporting:{
                        enabled : false
                    },
                    series: [{
                        name:'Theoretical setting',
                        type:'line',
                        data:[],
                        color:'rgb(144,170,218)',
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
                        name:'Measured values',
                        type:'scatter',
                        data:[],
                        color: 'rgb(51,82,128)',
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
                        name:'Average',
                        type:'scatter',
                        marker: {
                            radius: 5,
                            symbol: 'circle'
                        },
                        data:[],
                        color: 'rgb(118,118,118)',
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

                if (paramKeys[0]=="load") 
                    this.chartData[keys[i]].xAxis.title.text = 'Engine Load [%]';
                else if (paramKeys[0]=="pscav_rel") 
                    this.chartData[keys[i]].xAxis.title.text = 'Scavenge Receiver Pressure [-]';
                else if (paramKeys[0]=="ensp_rel") 
                    this.chartData[keys[i]].xAxis.title.text = 'Crank Shaft Rotational Speed [%]';
                    
                
                if (paramKeys[1]=='vec')                
                    this.chartData[keys[i]].yAxis.title.text = 'VEC [deg]';
                else  if (paramKeys[1]=='veo')                
                    this.chartData[keys[i]].yAxis.title.text = 'VEO [deg]';

                
                for (let j=0;j<globalStore.chartData['controlLawsTier2'][keys[i]][paramKeys[0]].length;j++)
                {
                    this.chartData[keys[i]].series[0].data.push(
                    [
                        globalStore.chartData['controlLawsTier2'][keys[i]][paramKeys[0]][j],
                        globalStore.chartData['controlLawsTier2'][keys[i]][paramKeys[1]][j]
                    ]);     
                    
                    if ((globalStore.type!='today') && (globalStore.type!='last')) 
                    {
                        for (let t=0;t<timestamps.length-1;t++)
                        {
                            if (paramKeys[1]=="vec")
                            {
                                if (paramKeys[0]=='pscav_rel')
                                {
                                    if((globalStore.signals[timestamps[t]]['pAmb1']!=-1000)&&(globalStore.signals[timestamps[t]]['pAmb2']!=-1000)&&(globalStore.signals[timestamps[t]]['pscav']!=-1000)&&(globalStore.signals[timestamps[t]]['pscav_cmcr']!=-1000)&&(globalStore.signals[timestamps[t]]['vec_'+paramKeys[0].replace('_rel','')]!=-1000))
                                    {
                                        let aBar = 0.5*(globalStore.signals[timestamps[t]]['pAmb1']+globalStore.signals[timestamps[t]]['pAmb2']);

                                        this.chartData[keys[i]].series[1].data.push(
                                        [
                                            (globalStore.signals[timestamps[t]]['pscav']+aBar)/(globalStore.signals[timestamps[t]]['pscav_cmcr']+aBar),
                                            globalStore.signals[timestamps[t]][ 'vec_'+paramKeys[0].replace('_rel','')]
                                        ]);
                                    }

                                }
                                else
                                    if ((globalStore.signals[timestamps[t]][paramKeys[0]]!=-1000)&&(globalStore.signals[timestamps[t]][ 'vec_'+paramKeys[0].replace('_rel','')]!=-1000)) 
                                        this.chartData[keys[i]].series[1].data.push(
                                        [
                                            globalStore.signals[timestamps[t]][paramKeys[0]],
                                            globalStore.signals[timestamps[t]][ 'vec_'+paramKeys[0].replace('_rel','')]
                                        ]);                        
                                
                            }
                            else if (paramKeys[0]=="load")
                            {
                                if ((globalStore.signals[timestamps[t]][paramKeys[0]]!=-1000)&&(globalStore.signals[timestamps[t]][paramKeys[1]]!=-1000))
                                    this.chartData[keys[i]].series[1].data.push(
                                    [
                                        100*globalStore.signals[timestamps[t]][paramKeys[0]],
                                        globalStore.signals[timestamps[t]][paramKeys[1]]
                                    ]);

                            }
                            else if (paramKeys[1]=="vit_a")
                            {
                                if ((globalStore.signals[timestamps[t]][paramKeys[1]]!=-1000)&&(globalStore.signals[timestamps[t]]['pscav']!=-1000)&&(globalStore.signals[timestamps[t]]['pscav_cmcr']!=-1000)&&(globalStore.signals[timestamps[t]]['pAmb1']!=-1000)&&(globalStore.signals[timestamps[t]]['pAmb2']!=-1000))
                                {
                                    let aBar = 0.5*(globalStore.signals[timestamps[t]]['pAmb1']+globalStore.signals[timestamps[t]]['pAmb2']);

                                    this.chartData[keys[i]].series[1].data.push(
                                    [
                                        (globalStore.signals[timestamps[t]]['pscav']+aBar)/(globalStore.signals[timestamps[t]]['pscav_cmcr']+aBar),
                                        globalStore.signals[timestamps[t]][paramKeys[1]]
                                    ]);
                                }
                            }
                            else 
                            {
                                if ((globalStore.signals[timestamps[t]][paramKeys[0]]!=-1000)&&(globalStore.signals[timestamps[t]][paramKeys[1]]!=-1000))
                                    this.chartData[keys[i]].series[1].data.push(
                                    [
                                        globalStore.signals[timestamps[t]][paramKeys[0]],
                                        globalStore.signals[timestamps[t]][paramKeys[1]]
                                    ]);

                            }

                        }
                    }

                    if (paramKeys[1]=="vec")
                    {
                        if (paramKeys[0]=='pscav_rel')
                        {
                            if((globalStore.signals[last]['pAmb1']!=-1000)&&(globalStore.signals[last]['pAmb2']!=-1000)&&(globalStore.signals[last]['pscav']!=-1000)&&(globalStore.signals[last]['pscav_cmcr']!=-1000)&&(globalStore.signals[last]['vec_'+paramKeys[0].replace('_rel','')]!=-1000))
                            {
                                let aBar = 0.5*(globalStore.signals[last]['pAmb1']+globalStore.signals[last]['pAmb2']);

                                this.chartData[keys[i]].series[2].data.push(
                                [
                                    (globalStore.signals[last]['pscav']+aBar)/(globalStore.signals[last]['pscav_cmcr']+aBar),
                                    globalStore.signals[last][ 'vec_'+paramKeys[0].replace('_rel','')]
                                ]);
                            }

                        }
                        else
                            if ((globalStore.signals[last][paramKeys[0]]!=-1000)&&(globalStore.signals[last][ 'vec_'+paramKeys[0].replace('_rel','')]!=-1000)) 
                                this.chartData[keys[i]].series[2].data.push(
                                [
                                    globalStore.signals[last][paramKeys[0]],
                                    globalStore.signals[last][ 'vec_'+paramKeys[0].replace('_rel','')]
                                ]);                        
                        
                    }
                    else if (paramKeys[0]=="load")
                    {
                        if ((globalStore.signals[last][paramKeys[0]]!=-1000)&&(globalStore.signals[last][paramKeys[1]]!=-1000))
                            this.chartData[keys[i]].series[2].data.push(
                            [
                                100*globalStore.signals[last][paramKeys[0]],
                                globalStore.signals[last][paramKeys[1]]
                            ]);

                    }
                    else if (paramKeys[1]=="vit_a")
                    {
                        if ((globalStore.signals[last][paramKeys[1]]!=-1000)&&(globalStore.signals[last]['pscav']!=-1000)&&(globalStore.signals[last]['pscav_cmcr']!=-1000)&&(globalStore.signals[last]['pAmb1']!=-1000)&&(globalStore.signals[last]['pAmb2']!=-1000))
                        {
                            let aBar = 0.5*(globalStore.signals[last]['pAmb1']+globalStore.signals[last]['pAmb2']);

                            this.chartData[keys[i]].series[2].data.push(
                            [
                                (globalStore.signals[last]['pscav']+aBar)/(globalStore.signals[last]['pscav_cmcr']+aBar),
                                globalStore.signals[last][paramKeys[1]]
                            ]);
                        }
                    }
                    else 
                    {
                        if ((globalStore.signals[last][paramKeys[0]]!=-1000)&&(globalStore.signals[last][paramKeys[1]]!=-1000))
                            this.chartData[keys[i]].series[2].data.push(
                            [
                                globalStore.signals[last][paramKeys[0]],
                                globalStore.signals[last][paramKeys[1]]
                            ]);

                    }

                    

                    
                    
                }
            }          

        }
    },
    computed: {
        dataLoaded: function () { return globalStore.type; }
    },
    watch:
    {
        dataLoaded : function()
        {
            setTimeout(() => {
                this.setData();
                
               });
        }
    }

  }

</script>

<style scoped>

</style>
