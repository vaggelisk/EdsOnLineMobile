<template>
    <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;width:100%;height:100%;background-color:white;">
        <v-layout row>
            <v-flex d-flex md6>
                <v-card>
                    <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">ISO - corrected curves vs. engine speed</v-card-title>
                    <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                        <v-layout column fill-height style="overflow:auto;">
                            <v-flex v-for="param in params['ensp']" :key="param" style="min-height:250px;">
                                <BarChart
                                    v-if="chartData['ensp'][param[0]]"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['ensp'][param[0]]"
                                    v-bind:flat="true"
                                    title=""/>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex d-flex md6>
                <v-card>
                    <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">ISO - corrected curves vs. engine load</v-card-title>
                    <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                        <v-layout column fill-height style="overflow:auto;">
                            <v-flex v-for="param in params['shaftP']" :key="param" style="min-height:250px;">
                                <BarChart
                                    v-if="chartData['shaftP'][param[0]]"
                                    v-bind:active="active"
                                    v-bind:chartOptions="chartData['shaftP'][param[0]]"
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
    name: "EnginePerformanceCurves",
    components: {
        BarChart
    },
    data () {
      return {
        chartData:{},
        titles:{},
        params:{
            'ensp':[["pmax_ISO","pcomp_ISO"],["tTurbIn_ISO", "tTurbO_ISO"], ["tcspeed_ISO"], ["pscav_ISO"], ["fCmd"], ["shaftP"], ["bsfc_ISO"]],
            'shaftP':[["pmax_ISO","pcomp_ISO"],["tTurbIn_ISO", "tTurbO_ISO"], ["tcspeed_ISO"], ["pscav_ISO"], ["fCmd"], ["ensp"], ["bsfc_ISO"]]}
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
            let xAxis = ['ensp','shaftP'];

            for (let x=0;x<xAxis.length;x++)
            {
                // if (xAxis[x]=='ensp') this.params[this.params.length-2]= ['shaftP'];
                // else this.params[this.params.length-2]= ['ensp'];

                let keys = Object.keys(globalStore.chartData.shopTestDataTier2);

                this.$set(this.chartData,xAxis[x],{});

                for (let i=0;i<this.params[xAxis[x]].length;i++)
                {
                    let show = false, opposite = false, marginLeft=15, marginRight=15 ;

                    if (i==this.params[xAxis[x]].length-1) show = true;

                    if (i%2 == 1)
                    {
                        opposite = true;
                        marginLeft=80;
                    }
                    else marginRight =80;

                    this.$set(this.chartData[xAxis[x]],this.params[xAxis[x]][i][0], {
                        credits:{enabled:false},
                        chart:{
                            backgroundColor:'transparent',
                            spacingLeft:marginLeft,
                            spacingRight:marginRight,                                    
                            zoomType: 'xy'
                        },
                        legend:{
                            enabled:show,
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'},
                        title:{ text:undefined },
                        xAxis: {
                            crosshair:true,
                            title:{
                                text:globalStore.mapping[xAxis[x]] +" ["+globalStore.units[xAxis[x]]+"]",
                                align:'high'
                            },
                            visible:show
                        },
                        yAxis: {
                            labels:{ enabled:true },
                            title:{
                                text:globalStore.mapping[this.params[xAxis[x]][i][0].replace('_ISO','')] +" ["+globalStore.units[this.params[xAxis[x]][i][0].replace('_ISO','')]+"]",
                                align:'high'
                            }, opposite:opposite
                        },
                        exporting:{
                            enabled : false
                        },
                        series: [{
                            name:'Shoptest',
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
                            name:'Measured',
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
                        }]
                    });

                    if (this.params[xAxis[x]][i].length>1)
                    {
                        this.chartData[xAxis[x]][this.params[xAxis[x]][i][0]].yAxis.title.text =
                            globalStore.mapping[this.params[xAxis[x]][i][0].replace('_ISO','')] +" / "
                            +globalStore.mapping[this.params[xAxis[x]][i][1].replace('_ISO','')] +" ["
                            +globalStore.units[this.params[xAxis[x]][i][0].replace('_ISO','')]+"]";

                        this.chartData[xAxis[x]][this.params[xAxis[x]][i][0]].series.push({
                            name:'Shoptest',
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
                        });


                    }
                    
                    if (globalStore.units[this.params[xAxis[x]][i][0].replace('_ISO','')]==null)
                        this.chartData[xAxis[x]][this.params[xAxis[x]][i][0]].yAxis.title.text =
                                globalStore.mapping[this.params[xAxis[x]][i][0].replace('_ISO','')] +" [-]";
                }

                let timestamps = Object.keys(globalStore.signals);
                let last = timestamps[timestamps.length-1];

                
                for (let lp=0;lp<this.params[xAxis[x]].length;lp++)
                {    
                    let xLast = globalStore.signals[last][xAxis[x]];

                    if ((xLast==-1000)&&(xAxis[x]=='shaftP'))
                    {
                        let mcr = globalStore.loadDiagram['otVal1'];

                        if (globalStore.signals[last]['ME_Power_kW']!=-1000) xLast =  globalStore.signals[last]['ME_Power_kW'];
                        else if (globalStore.signals[last]['load']!=-1000) xLast =  globalStore.signals[last]['load']*mcr;
                        
                    }

                    if ((xLast!=-1000)&&(globalStore.signals[last][this.params[xAxis[x]][lp][0].replace('_ISO','')]!=-1000))
                        this.chartData[xAxis[x]][this.params[xAxis[x]][lp][0]].series[1].data.push([
                            xLast, globalStore.signals[last][this.params[xAxis[x]][lp][0].replace('_ISO','')]
                        ]);
                    else if ((this.params[xAxis[x]][lp][0].replace('_ISO','')=='shaftP')&&(globalStore.signals[last][this.params[xAxis[x]][lp][0].replace('_ISO','')]==-1000))
                    {
                        let mcr = globalStore.loadDiagram['otVal1'];
                        let yVal = -1000;

                        if (globalStore.signals[last]['ME_Power_kW']!=-1000) yVal =  globalStore.signals[last]['ME_Power_kW'];
                        else if (globalStore.signals[last]['load']!=-1000) yVal =  globalStore.signals[last]['load']*mcr;

                        if (yVal !=-1000)
                            this.chartData[xAxis[x]][this.params[xAxis[x]][lp][0]].series[1].data.push([
                                xLast, yVal
                            ]);
                    }

                    if (this.params[xAxis[x]][lp].length>1)
                    {
                        if ((xLast!=-1000)&&(globalStore.signals[last][this.params[xAxis[x]][lp][1].replace('_ISO','')]!=-1000))                            
                            this.chartData[xAxis[x]][this.params[xAxis[x]][lp][0]].series[1].data.push([
                                xLast, globalStore.signals[last][this.params[xAxis[x]][lp][1].replace('_ISO','')]
                            ]);

                    }

                    for (let i=0;i<keys.length;i++)
                    {
                        let xValue = Number(globalStore.chartData.shopTestDataTier2[keys[i]][xAxis[x]]);

                        this.chartData[xAxis[x]][this.params[xAxis[x]][lp][0]].series[0].data.push([
                            xValue, Number(globalStore.chartData.shopTestDataTier2[keys[i]][this.params[xAxis[x]][lp][0]])
                        ]);

                        if (this.params[xAxis[x]][lp].length>1)
                        {
                            this.chartData[xAxis[x]][this.params[xAxis[x]][lp][0]].series[2].data.push([
                                xValue, Number(globalStore.chartData.shopTestDataTier2[keys[i]][this.params[xAxis[x]][lp][1]])
                            ]);
                        }

                        
                    }


                }


            }

        }

    },
    computed: {
        dataLoaded: function () { return globalStore.type; }
    },
    watch: {
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
