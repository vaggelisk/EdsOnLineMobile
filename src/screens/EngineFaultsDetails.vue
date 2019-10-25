<template>
  <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;height:100%;width:100%;background-color:white;"> 
    <v-layout v-if="fault!=undefined" column fill-height>
        <div style="width:100%;height:48px;display:flex;align-items:center;">
          <v-radio-group v-model="dataType" row style="display:flex;justify-content:flex-end;align-items:center;">
            <v-radio flat value="values" label="Values" color="rgb(51,82,128)"/>
            <v-radio flat value="diff" label="Diff. %" color="rgb(51,82,128)"/>
          </v-radio-group>
        </div>
        <v-layout row>
          <v-flex d-flex md6>
            <v-layout column fill-height>
              <v-flex ref="tlChart" v-for="n in 3" :key="n" d-flex md4 style="max-height:33%;">           
                <TimelineChart 
                  v-if="active"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData[params[n-1]]"
                  v-bind:title="titles[params[n-1]]" />
              </v-flex>              
            </v-layout>
          </v-flex>
          <v-flex d-flex md6>
            <v-layout column fill-height>
              <v-flex v-for="n in 3" :key="n" d-flex md4 style="max-height:33%;">  
                <TimelineChart 
                  v-if="active"
                  v-bind:active="active"
                  v-bind:chartOptions="chartData[params[n+2]]"
                  v-bind:title="titles[params[n+2]]" />
              </v-flex>              
            </v-layout>
          </v-flex>
        </v-layout>
    </v-layout>     
    <div v-else style="width:100%;height:100%;background-color:white;display:flex;justify-content:center;align-items:center;">
      <v-img
        :src="require('../assets/check-mark-circle3.png')" contain height="200"></v-img>
    </div>            
  </v-container>
</template>

<script>

import TimelineChart from  '../controls/TimelineChart'

import {globalStore} from "../main.js"

export default {
  name: 'EngineFaultsDetails',
    components: {
    TimelineChart
  },
  props:{
    active:Boolean,
    fault:Object
  },
  data () {
    return {
      chartData:{},
      dataType:'values',
      titles:{},
      params:[]
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

      let code = this.fault.events[0].code;
      let index =this.fault.index;

      this.params=['tExhC'+index,'pcomp'+index,'tcspeed', 'pmax'+index, 'fRailPres', 'pscav']; 

      let mapParams=['tExhC','pcomp','tcspeed', 'pmax', 'fRailPres', 'pscav']; 
      
      for (let p=0;p<mapParams.length;p++)
      {
        if((mapParams[p]=='tExhC')||(mapParams[p]=='pcomp')||(mapParams[p]== 'pmax'))
          this.$set(this.titles,this.params[p],globalStore.mapping[mapParams[p]]+' Cylinder '+index);    
        else this.$set(this.titles,this.params[p],globalStore.mapping[mapParams[p]]);     
      }      

      if (this.dataType=='values') this.setValuesData();
      else this.setDiffData();      
    },
    setValuesData()
    {
      let cylCount=6;
      let tcCount=1;
      let index =this.fault.index;

      let timeStamps = Object.keys(globalStore.signals);

      if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);
 
      let mapParams=['tExhC','pcomp','tcspeed', 'pmax', 'fRailPres', 'pscav']; 
      let elCount=[0,0, tcCount,0,0,0];
      let refs =['tExhC'+index,'pcomp'+index,'tcspeed', 'pmax'+index, 'fRailPresSet','pscav'];
      
      for (let p=0;p<this.params.length;p++)
      {
        this.$set(this.chartData,this.params[p],{
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
              text:'['+globalStore.units[mapParams[p]]+']',
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
                },'<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
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
          if (elCount[p]==0) val= globalStore.signals[timeStamps[i]][this.params[p]];
          else val = this.average(this.params[p], elCount[p],globalStore.signals,timeStamps[i]);

          if (this.params[p]=='fRailPres') rfr =  globalStore.signals[timeStamps[i]][refs[p]];
          else if (Object.keys(globalStore.reference).includes(timeStamps[i])) 
          {
            if (elCount[p]==0) rfr = globalStore.reference[timeStamps[i]][refs[p]];
            else rfr = this.average(refs[p], elCount[p],globalStore.reference,timeStamps[i]);
          }
          else rfr =-1000;

          let color = 'rgb(51,82,128)';

          let dt = new Date(timeStamps[i]);

          if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(mapParams[p])))
          {
            let minLimit = globalStore.limits[mapParams[p]][0], maxLimit = globalStore.limits[mapParams[p]][1];
            
            if ((minLimit!=null)&&(maxLimit!=null))
            {

              let temp = ( (val -  rfr)/val) * 100;

              if ((temp > minLimit) && (temp < maxLimit)) color='rgb(60, 171, 48)';
              else color ='rgb(205, 57, 64)';

              let min = rfr/(1 - minLimit/100);
              let max = rfr/(1 - maxLimit/100);

              this.chartData[this.params[p]].series[1].data.push({
                x:dt,
                low:min,
                high:max});
            }
          }

          if (val!=-1000)
            this.chartData[this.params[p]].series[0].data.push({
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
      let index =this.fault.index;

      let timeStamps = Object.keys(globalStore.signals);

      if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);

      let mapParams=['tExhC','pcomp','tcspeed', 'pmax', 'fRailPres', 'pscav']; 
      let elCount=[0,0, tcCount,0,0,0];
      let refs =['tExhC'+index,'pcomp'+index,'tcspeed', 'pmax'+index, 'fRailPresSet','pscav'];

      for (let p=0;p<this.params.length;p++)
      {
        this.$set(this.chartData,this.params[p],{
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
          if (elCount[p]==0) val= globalStore.signals[timeStamps[i]][this.params[p]];
          else val = this.average(this.params[p], elCount[p],globalStore.signals,timeStamps[i]);

          if (this.params[p]=='fRailPres') rfr =  globalStore.signals[timeStamps[i]][refs[p]];
          else if (Object.keys(globalStore.reference).includes(timeStamps[i])) 
          {
            if (elCount[p]==0) rfr = globalStore.reference[timeStamps[i]][refs[p]];
            else rfr = this.average(refs[p], elCount[p],globalStore.reference,timeStamps[i]);
          }
          else rfr =-1000;

          let color = 'rgb(51,82,128)';

          let dt = new Date(timeStamps[i]);

          if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(mapParams[p])))
          {
            let minLimit = globalStore.limits[mapParams[p]][0], maxLimit = globalStore.limits[mapParams[p]][1];
            
            let temp = ( (val -  rfr)/val) * 100;

            if ((minLimit!=null)&&(maxLimit!=null))
            {

              if ((temp > minLimit) && (temp < maxLimit)) color='rgb(60, 171, 48)';
              else color ='rgb(205, 57, 64)';

              this.chartData[this.params[p]].series[1].data.push({
                x:dt,
                low:minLimit,
                high:maxLimit});

            }         
            

            this.chartData[this.params[p]].series[0].data.push({
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
    fault:function()
    {
      this.setData();
    },
    dataType: function()
    {
      this.setData();
    },
    dataLoaded : function()
    {
      setTimeout(() => {
        this.setData();}); 
    }
    ,
    active : function()
    {
      setTimeout(() => {
        this.setData();}); 
    }
  }
}
</script>

<style scoped>

</style>