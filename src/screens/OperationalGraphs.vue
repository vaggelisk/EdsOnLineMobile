<template>
 <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;width:100%;height:100%;background-color:white;">
    <v-layout column fill-height>
      <v-flex d-flex md6>
        <highcharts v-if="load" style="height:100%;width:100%;" :options="chartOptions1"></highcharts>
      </v-flex>
      <v-flex d-flex md6>        
        <highcharts v-if="load" style="height:100%;width:100%;" :options="chartOptions2"></highcharts>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script> 

import {Chart} from 'highcharts-vue'
import More from 'highcharts/highcharts-more'
import Highcharts from 'highcharts'

import {globalStore} from "../main.js"

More(Highcharts)
    
export default {
    name: "OperationalGraphs",
    components: {
          highcharts: Chart 
    },
    data() {
      return {
        chartOptions1:
        {   
          credits:{
            enabled:false
          },
          time:{
            useUTC:false
          },       
          chart: {
            zoomType: 'xy'
          },
          title: {
            text: undefined
          },
          tooltip:{
            formatter: function () {
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
            },
            shared:true
          },
          yAxis:{
             title: {
              text: '[kn]',
              align:'high'}
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
          exporting:{
            enabled : false
          },
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            floating: true,
          },
          series: []
        },
        chartOptions2:
        {   
          credits:{
            enabled:false
          },
          time:{
            useUTC:false
          },       
          chart: {
            zoomType: 'xy'
          },
          title: {
            text: undefined
          },
          tooltip:{
            formatter: function () {
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
            },
            shared:true
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
          yAxis:[],
          exporting:{
            enabled : false
          },
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            floating: true,
          },
          series: []
        },
        parameters1:['SOG','STW','Wind_Speed'],
        parameters2:['ME_Power_perc','ensp','Wind_direction_relative'],
        load: false   
      
      };
    },
    mounted()
    {
      
     // window.addEventListener('resize', this.onResize);

      setTimeout(() => {
        this.setData();});   
    },
    methods: 
    {
      // onResize(event)
      // {
      //     setTimeout(() => {
      //         this.chartOptions.chart.height =this.$refs['chartContainer'].clientHeight;
      //        });
      // },
      setData()
      {
        this.load=false;

        this.chartOptions1.series=[];
        
        this.chartOptions2.series=[];
        this.chartOptions2.yAxis=[];

        let timeStamps = Object.keys(globalStore.signals);

        let useLoad = false;

        if (globalStore.signals[timeStamps[timeStamps.length-1]]['ME_Power_perc']==-1000)
          useLoad = true;

        if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);

        for (let p=0;p<this.parameters1.length;p++)
        {
          var item={  
              name:globalStore.mapping[this.parameters1[p]],                      
              type:'spline',
              data:[],
              marker:{
                  enabled:false
              },
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
          };

          for (let i=0;i<timeStamps.length;i++)
          {
            let val = globalStore.signals[timeStamps[i]][this.parameters1[p]];

            if(val!=-1000)
              item.data.push([new Date(timeStamps[i]).getTime(),val]); 
          }       

          this.chartOptions1.series.push(item);

        }

        for (let p=0;p<this.parameters2.length;p++)
        {
          var axis={ 
            labels: {
              // style: {
              //   color: Highcharts.getOptions().colors[p]
              // }
            },
            title: {
              text: globalStore.mapping[this.parameters2[p]]+' ['+globalStore.units[this.parameters2[p]]+']',
              align:'high',
              // style: {
              //   color: Highcharts.getOptions().colors[p]
              // }
            },
          };

          this.chartOptions2.yAxis.push(axis);

          var item={  
              name:globalStore.mapping[this.parameters2[p]],                      
              type:'spline',
              data:[],
              marker:{
                  enabled:false
              },
              yAxis:p,
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
          };

          for (let i=0;i<timeStamps.length;i++)
          {
            let val;
            
            if ((this.parameters2[p]=='ME_Power_perc')&&(useLoad)&&(globalStore.signals[timeStamps[i]]['load']!=-1000)) val = globalStore.signals[timeStamps[i]]['load']*100;
            else  val = globalStore.signals[timeStamps[i]][this.parameters2[p]];

            if(val!=-1000)
              item.data.push([new Date(timeStamps[i]).getTime(),val]); 
          }       

          this.chartOptions2.series.push(item);

        }
        
        this.load=true;
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
};
</script>

<style scoped>
</style>

