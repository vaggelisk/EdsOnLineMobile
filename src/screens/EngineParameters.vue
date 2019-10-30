<template>
  <v-container ref="pdfContent" fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;width:100%;background-color:white;">
    <v-layout >
      <v-flex d-flex >
        <v-layout column >

          <v-flex d-flex md3 style="max-height:50%;">
            <BarChart
              v-if="chartData['pcomp']"
              v-bind:active="active"
              v-bind:chartOptions="chartData['pcomp']"
              v-bind:title="titles['pcomp']"/>
          </v-flex>
          <v-flex d-flex md3 style="max-height:100%;">
            <BarChart
              v-if="chartData['pmax']"
              v-bind:active="active"
              v-bind:chartOptions="chartData['pmax']"
              v-bind:title="titles['pmax']"/>
          </v-flex>
          <v-flex d-flex md3 style="max-height:20%;">
            <BarChart
              v-if="chartData['tExhC']"
              v-bind:active="active"
              v-bind:chartOptions="chartData['tExhC']"
              v-bind:title="titles['tExhC']"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>

import Card from  '../controls/Card'
import BarChart from  '../controls/BarChart'
import LoadDiagram from  '../controls/LoadDiagram'

import {globalStore} from "../main.js"

export default {
  name: 'EngineParameters',
  components: {
    Card,
    BarChart,
    LoadDiagram
  },
  props:{
    active:Boolean
  },
  data () {
    return {
      cardData: {} ,
      chartData:{},
      titles:{},
      loadDiagram:{}
    }
  },
  mounted()
  {
    this.setData();
  },
  methods: {
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
    setData()
    {
      let cylCount=6;
      let tcCount=1;


      if (globalStore.selectedVessel!='Energy Triumph') tcCount =2;

      let refLength = Object.keys(globalStore.reference).length;
      let sigLength = Object.keys(globalStore.signals).length;

      var temp ;

      if (refLength>sigLength) temp = Object.keys(globalStore.signals);
      else temp = Object.keys(globalStore.reference);

      let timestamp = temp[temp.length-1];

      let params=['pcomp', 'pmax', 'pmaxPcomp','tcspeed', 'tscav','tTurbO','tTurbIn','pscav','soPresDispl','fRailPres'];
      let refs = ['pcomp', 'pmax','pmaxPcomp', 'tcspeed', 'tscav','tTurbO','tTurbIn','pscav','soPresSetpoint','fRailPresSet'];
      let elCount=[cylCount,cylCount,cylCount,  tcCount,0, tcCount,tcCount,0,0,0];

      for (let p=0;p<params.length;p++)
      {
        let val, rfr;

        if (elCount[p]>0)
            val = this.average(params[p], elCount[p], globalStore.signals, timestamp);
        else
            val = globalStore.signals[timestamp][params[p]];

        if (params[p]=='fRailPres') rfr = globalStore.signals[timestamp][refs[p]];
        else if (params[p]=='soPresDispl') rfr = -1000;
        else if (elCount[p]>0)
            rfr = this.average(refs[p], elCount[p], globalStore.reference, timestamp);
        else
            rfr = globalStore.reference[timestamp][refs[p]];

        let color =-10;

        if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(params[p])))
        {
          let minLimit = globalStore.limits[params[p]][0], maxLimit = globalStore.limits[params[p]][1];

          if ((minLimit!=null)&&(maxLimit!=null))
          {
            let temp = ( (val -  rfr)/val) * 100;

            if ((temp > minLimit) && (temp < maxLimit)) color=0;
            else color =20;

          }
        }

        this.$set(this.cardData,params[p],{
            value:val,
            ref: rfr,
            title:globalStore.mapping[params[p]],
            unit:globalStore.units[params[p]],
            format:2,
            color:color
        });

      }


      let aft = this.average('tlineraft', 6, globalStore.signals,timestamp);
      let fore = this.average('tlinerfore', 6, globalStore.signals,timestamp);

      this.$set(this.cardData,'tliner',{
          value:(aft+fore)/2,
          ref: -1000,
          title:'Liner Wall Temperature',
          unit:'deg C',
          format:2,
          color:-10
      });

      let chartParams = ['pmax', 'pcomp', 'tExhC'];
      let chartRefs = ['pmax','pcomp','tExhC'];

      for (let p=0;p<params.length;p++)
      {
        this.$set(this.chartData, chartParams[p], {
          credits:{enabled:false},
          chart:{
            height:0,
            zoomType: 'xy'
          },
          legend:{
            enabled:false
          },
          tooltip:{
            formatter: function () {
                return 'Cylinder '+this.x+': '+this.point.y.toFixed(2)+'<br>Reference : '+this.point.ref.toFixed(2);
            }
          },
          xAxis:{
            title:
            {
              text:'Cylinders',
              align:'high'
            },
            crosshair:true
          },
          yAxis:{
            title:
            {
              text:'['+globalStore.units[chartParams[p]]+']',
              align:'high'
            }
          },
          exporting:{
            enabled : false
          },
          title:{
              text:undefined
          },
          series: [{
              type:'column',
              animation: false,
              data:[],
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
        })

        for (let i=1;i<=cylCount;i++)
        {
          let color = 'rgb(51,82, 128)';

          let val= globalStore.signals[timestamp][chartParams[p]+i];

            let rfr = globalStore.reference[timestamp][chartRefs[p]+i];

          if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(chartParams[p])))
          {
            let minLimit = globalStore.limits[chartParams[p]][0], maxLimit = globalStore.limits[chartParams[p]][1];

            let temp = ( (val -  rfr)/val) * 100;

            if ((temp > minLimit) && (temp < maxLimit)) color = 'rgb(60, 171, 48)';
            else color ='rgb(205, 57, 64)';
          }
          else if (val==-1000) val = null;

          this.chartData[chartParams[p]].series[0].data.push({
              x:i,
              y:val,
              ref:rfr,
              color:color
          });

          this.$set(this.titles,chartParams[p],globalStore.mapping[chartParams[p]]);

        }
      }

      this.setLoadDiagram();

    }
    ,
    setLoadDiagram()
    {
       this.loadDiagram = {
          credits:{enabled:false},
          chart:{
            height:0,
            zoomType: 'xy'
          },
          legend:{
              enabled:true
          },
          tooltip:{
            formatter: function () {
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(0);
                }, '<b>' + this.x + ' rpm</b>');
            },
            shared:true
          },
          title:{
              text:undefined
          },
          xAxis:
          {
            title:
            {
              text:'Engine speed [rpm]',
              align:'high'
            },
            crosshair:true
          },
          yAxis:{
            title:
            {
              text:'Shaft power [kW]',
              align:'high'
            }
          },
          exporting:{
            enabled : false
          },
          series: [{
              name:'Measured',
              type:'scatter',
              data:[],
              animation: false,
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
              name:'Reference',
              type:'scatter',
              data: [],
              animation: false,
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
              name:'Shop Tests',
              type:'spline',
              data:[],
              animation: false,
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
              name:'Sea Trials',
              type:'line',
              data:[],
              animation: false,
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
              name:'Engine Limit',
              type:'line',
              data: [] ,
              animation: false,
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
      }

      let refLength = Object.keys(globalStore.reference).length;
      let sigLength = Object.keys(globalStore.signals).length;

      let mcr =    globalStore.loadDiagram['otVal1'];

      var temp ;

      if (refLength>sigLength) temp = Object.keys(globalStore.signals);
      else temp = Object.keys(globalStore.reference);

      let timestamp = temp[temp.length-1];

      if (globalStore.signals[timestamp]['ensp']!=-1000)
      {

        if(globalStore.signals[timestamp]['shaftP']!=-1000)
            this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.signals[timestamp]['shaftP']]];
        else if (globalStore.signals[timestamp]['ME_Power_kW']!=-1000)
            this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.signals[timestamp]['ME_Power_kW']]];
        else  if (globalStore.signals[timestamp]['load']!=-1000)
            this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.signals[timestamp]['load']*mcr]];


        if (globalStore.reference[timestamp]['shaftP']!=-1000)
            this.loadDiagram.series[1].data =[[globalStore.signals[timestamp]['ensp'],globalStore.reference[timestamp]['shaftP']]];
        else if (globalStore.reference[timestamp]['ME_Power_kW']!=-1000)
            this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.reference[timestamp]['ME_Power_kW']]];
        else  if (globalStore.reference[timestamp]['load']!=-1000)
            this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.reference[timestamp]['load']*mcr]];

      }

      this.loadDiagram.series[2].data=[];
      for (let i=0;i<globalStore.loadDiagram.spVal1.length;i++)
      {
         this.loadDiagram.series[2].data.push([globalStore.loadDiagram['spVal1'][i],globalStore.loadDiagram['spVal7'][i]])
      }

      this.loadDiagram.series[3].data=[];

      for (let i=0;i<globalStore.loadDiagram.stVal1.length;i++)
      {
         this.loadDiagram.series[3].data.push([globalStore.loadDiagram['stVal1'][i],globalStore.loadDiagram['stVal2'][i]])
      }

      this.loadDiagram.series[4].data=[];

      let rpmMin = globalStore.loadDiagram['otVal3'];
      let rpmMcr = globalStore.loadDiagram['otVal2'];
      let mcr97 =  globalStore.loadDiagram['otVal4'];
      let rpm105 = globalStore.loadDiagram['otVal5'];

      let RPMStep = 5.0;

      let load = globalStore.signals[timestamp]['load'] * 100;

      this.loadDiagram.series[4].data.push([rpmMin, 0]);

      let aPWR;
      let aRPM = rpmMin;

      do
      {
          aPWR = mcr97 * Math.pow((aRPM / (0.97 * rpmMcr)), 2.0);
          this.loadDiagram.series[4].data.push([aRPM, aPWR ]);
          aRPM = aRPM + RPMStep;
      } while (aRPM <= 0.97 * rpmMcr);

      this.loadDiagram.series[4].data.push([ 0.97 * rpmMcr, mcr97 ]);
      this.loadDiagram.series[4].data.push([ rpmMcr, mcr ]);

      this.loadDiagram.series[4].data.push([ rpm105, mcr ]);

      this.loadDiagram.series[4].data.push([ rpm105, 0 ]);


    }
  },
  computed: {
      dataLoaded: function () { return globalStore.type; }
  },
  watch: {
    dataLoaded : function()
    {
      setTimeout(() => {
          this.setData();});
    }
  }

}
</script>

<style scoped>

</style>
