<template>
  <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;height:100%;width:100%;background-color:white;"> 
    <v-layout column fill-height>
        <div style="width:100%;height:48px;display:flex;align-items:center;">
          <v-radio-group v-model="dataType" row style="display:flex;justify-content:flex-end;align-items:center;">
            <v-radio flat value="values" label="Values" color="rgb(51,82,128)"/>
            <v-radio flat value="diff" label="Diff. %" color="rgb(51,82,128)"/>
          </v-radio-group>
        </div>
        <v-layout row>
          <v-flex d-flex md6>
            <v-layout column fill-height>
              <!-- <v-flex d-flex md3 style="max-height:25%;">            
                <TimelineChart
                  v-if="chartData['ensp']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['ensp']"
                  v-bind:title="titles['ensp']"/>
              </v-flex> -->
              <v-flex ref="tlChart" d-flex md3 style="max-height:25%;">             
                <TimelineChart 
                  v-if="chartData['pcomp']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['pcomp']"
                  v-bind:title="titles['pcomp']" />
              </v-flex>
              <v-flex d-flex md3 style="max-height:25%;">            
                <TimelineChart
                  v-if="chartData['pmax']"              
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['pmax']"
                  v-bind:title="titles['pmax']"/>
              </v-flex>
              <v-flex d-flex md3 style="max-height:25%;">            
                <TimelineChart
                  v-if="chartData['tTurbIn']"              
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['tTurbIn']"
                  v-bind:title="titles['tTurbIn']"/>
              </v-flex>
              <v-flex d-flex md3 style="max-height:25%;">             
                <TimelineChart
                  v-if="chartData['tcspeed']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['tcspeed']"
                  v-bind:title="titles['tcspeed']"/>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex d-flex md6>
            <v-layout column fill-height>
              <!-- <v-flex d-flex md3 style="max-height:25%;">            
                <TimelineChart
                  v-if="chartData['load']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['load']"
                  v-bind:title="titles['load']"/>
              </v-flex> -->
              <v-flex d-flex md3 style="max-height:25%;">            
                <TimelineChart
                  v-if="chartData['pscav']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['pscav']"
                  v-bind:title="titles['pscav']"/>
              </v-flex>
              <v-flex d-flex md3 style="max-height:25%;">            
                <TimelineChart
                  v-if="chartData['tscav']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['tscav']"
                  v-bind:title="titles['tscav']"/>
              </v-flex>
              <v-flex d-flex md3 style="max-height:25%;">             
                <TimelineChart
                  v-if="chartData['soPresDispl']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['soPresDispl']"
                  v-bind:title="titles['soPresDispl']"/>
              </v-flex>
              <v-flex d-flex md3 style="max-height:25%;">             
                <TimelineChart
                  v-if="chartData['fRailPres']"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData['fRailPres']"
                  v-bind:title="titles['fRailPres']"/>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
    </v-layout>       
  </v-container>
  
</template>

<script>

import TimelineChart from  '../controls/TimelineChart'

import {globalStore} from "../main.js"

export default {
  name: 'EngineGraphs',
  components: {
    TimelineChart
  },
  props:{
    active:Boolean
  },
  data () {
    return {
      chartData:{},
      dataType:'values',
      titles:{}
    }
  }, 
  mounted()
  {    
    let params=['ensp','load','pcomp', 'pmax','tcspeed', 'tscav','tTurbIn','pscav','soPresDispl','fRailPres']; 
    
    for (let p=0;p<params.length;p++)
    {
      this.$set(this.titles,params[p],globalStore.mapping[params[p]]);
    }

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
      if (this.dataType=='values') this.setValuesData();
      else this.setDiffData();
    },
    setValuesData()
    {
      let cylCount=6;
      let tcCount=1;

      if (globalStore.selectedVessel!='Energy Triumph') tcCount =2;

      let timeStamps = Object.keys(globalStore.signals);

      if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);

      let params=['pcomp', 'pmax','tcspeed', 'tscav','tTurbIn','pscav','soPresDispl','fRailPres', 'ensp', 'load'];   
      let elCount=[cylCount, cylCount, tcCount,0,tcCount,0,0,0, 0,0];
      let refs =['pcomp', 'pmax', 'tcspeed', 'tscav','tTurbIn','pscav','soPresSetpoint','fRailPresSet', 'ensp', 'load'];   
      
      for (let p=0;p<params.length;p++)
      {
        this.$set(this.chartData,params[p],{
          credits:{enabled:false},
          time:{
            useUTC:false
          },  
          chart:{
            height:100,            
            zoomType: 'xy'
          },
          xAxis:{
            type:'datetime',
            title:
            {
              text:'Time',
              align:'high'
            }, 
            labels: {
              format: '{value:%H:%M}'
            },
            crosshair:true
          },
          yAxis:{
            title:
            {
              text:'['+globalStore.units[params[p]]+']',
              align:'high'
            }
          },
          exporting:{
            enabled : false
          },
          tooltip:{
            formatter: function () {
                return this.points.reduce(function (s, point) {
                  if (point.series.type=='line')
                  {
                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                  } 
                  else 
                  {
                    return s + '<br/>' + point.series.name + ': ' + point.point.low.toFixed(2) + ' - ' + point.point.high.toFixed(2);
                  }
                }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
            },
            shared:true
          },
          legend:{
            enabled:false
          },
          title:{
              text:undefined
          },
          series: [{  
              name:'Value',                      
              type:'line',
              color:'transparent',
              animation: false,
              data:[],
              marker:
              {
                radius:3
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
              name:'Acceptable Range',
              type:'arearange',            
              animation: false,                      
              data:[],
              marker:{
                  enabled:false
              },
              color:'rgb(219, 219, 219)',
              fillOpacity: 0.6,
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

        for (let i=0;i<timeStamps.length;i++)
        {
          let val,rfr ;
          if (elCount[p]==0) val= globalStore.signals[timeStamps[i]][params[p]];
          else val = this.average(params[p], elCount[p],globalStore.signals,timeStamps[i]);

          if (params[p]=='fRailPres') rfr =  globalStore.signals[timeStamps[i]][refs[p]];
          else if (Object.keys(globalStore.reference).includes(timeStamps[i])) 
          {
            if (elCount[p]==0) rfr = globalStore.reference[timeStamps[i]][refs[p]];
            else rfr = this.average(refs[p], elCount[p],globalStore.reference,timeStamps[i]);
          }
          else rfr =-1000;

          let color = 'rgb(51,82,128)';

          let dt = new Date(timeStamps[i]);

          if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(params[p])))
          {
            let minLimit = globalStore.limits[params[p]][0], maxLimit = globalStore.limits[params[p]][1];
            
            if ((minLimit!=null)&&(maxLimit!=null))
            {

              let temp = ( (val -  rfr)/val) * 100;

              if ((temp > minLimit) && (temp < maxLimit)) color='rgb(60, 171, 48)';
              else color ='rgb(205, 57, 64)';

              let min = rfr/(1 - minLimit/100);
              let max = rfr/(1 - maxLimit/100);

              this.chartData[params[p]].series[1].data.push({
                x:dt,
                low:min,
                high:max});
            }
          }

          if (val!=-1000)
            this.chartData[params[p]].series[0].data.push({
                x:dt,
                y:val,
                color:color
            });

          
        }    

      }
        
    },
    setDiffData()
    {
      let cylCount=6;
      let tcCount=1;  
      
      if (globalStore.selectedVessel!='Energy Triumph') tcCount =2;   

      let timeStamps = Object.keys(globalStore.signals);

      if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);

      let params=['pcomp', 'pmax','tcspeed', 'tscav','tTurbIn','pscav','soPresDispl','fRailPres'];   
      let elCount=[cylCount, cylCount, tcCount,0,tcCount,0,0,0];
      let refs =['pcomp', 'pmax', 'tcspeed', 'tscav','tTurbIn','pscav','soPresSetpoint','fRailPresSet'];
      
      for (let p=0;p<params.length;p++)
      {
        this.$set(this.chartData,params[p],{
          credits:{enabled:false},
          time:{
            useUTC:false
          },  
          chart:{
            height:100,
            zoomType: 'xy'
          },
          xAxis:{
            type:'datetime',
            labels: {
              format: '{value:%H:%M}'
            },
            title:
            {
              text:'Time',
              align:'high'
            },
            crosshair:true
          },
          yAxis:{
            title:
            {
              text:'[%]',
              align:'high'
            }
          },
          exporting:{
            enabled : false
          },
          tooltip:{
            formatter: function () {
                return this.points.reduce(function (s, point) {
                  if (point.series.type=='line')
                  {
                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                  } 
                  else 
                  {
                    return s + '<br/>' + point.series.name + ': ' + point.point.low.toFixed(2) + ' - ' + point.point.high.toFixed(2);
                  }
                }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
            },
            shared:true
          },
          legend:{
            enabled:false
          },
          title:{
              text:undefined
          },
          series: [{  
              name:'Difference %',                      
              type:'line',
              color:'transparent',
              animation: false,
              data:[],
              marker:
              {
                radius:3
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
              name:'Acceptable Range',
              type:'arearange',            
              animation: false,                      
              data:[],
              marker:{
                  enabled:false
              },
              color:'rgb(219, 219, 219)',
              fillOpacity: 0.6,
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

        for (let i=0;i<timeStamps.length;i++)
        {
          let val,rfr ;
          if (elCount[p]==0) val= globalStore.signals[timeStamps[i]][params[p]];
          else val = this.average(params[p], elCount[p],globalStore.signals,timeStamps[i]);

          if (params[p]=='fRailPres') rfr =  globalStore.signals[timeStamps[i]][refs[p]];
          else if (Object.keys(globalStore.reference).includes(timeStamps[i])) 
          {
            if (elCount[p]==0) rfr = globalStore.reference[timeStamps[i]][refs[p]];
            else rfr = this.average(refs[p], elCount[p],globalStore.reference,timeStamps[i]);
          }
          else rfr =-1000;

          let color = 'rgb(51,82,128)';

          let dt = new Date(timeStamps[i]);

          if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(params[p])))
          {
            let minLimit = globalStore.limits[params[p]][0], maxLimit = globalStore.limits[params[p]][1];
            
            let temp = ( (val -  rfr)/val) * 100;

            if ((minLimit!=null)&&(maxLimit!=null))
            {

              if ((temp > minLimit) && (temp < maxLimit)) color='rgb(60, 171, 48)';
              else color ='rgb(205, 57, 64)';

              this.chartData[params[p]].series[1].data.push({
                x:dt,
                low:minLimit,
                high:maxLimit});

            }         
            

            this.chartData[params[p]].series[0].data.push({
              x:dt,
              y:temp,
              color:color});


          }
                
        }    

      }
        
    }
  },
  computed: {
      dataLoaded: function () { return globalStore.type; }
  },
  watch: {
    dataType: function()
    {
      this.setData();
    },
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