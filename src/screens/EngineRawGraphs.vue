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
    name: "EngineRawGraphs",
    components: {
      highcharts: Chart 
    },
    props:
    {
      parameters1:Array,
      parameters2:Array
    },
    data() {
      return {
        chartOptions1:
        { 
          credits:{enabled:false},  
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
          yAxis: [],
          exporting:{
            enabled : false
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
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
          },
          series: []
        },
        chartOptions2:
        {   
          credits:{enabled:false},
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
          yAxis: [],
          exporting:{
            enabled : false
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
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
          },
          series: []
        },
        load: false,
        axisDict:{}   
      
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
        this.chartOptions1.yAxis=[];

        this.chartOptions2.series=[];
        this.chartOptions2.yAxis=[];

        let timeStamps = Object.keys(globalStore.signals);

        let useLoad = false;
        
        let mcr = globalStore.loadDiagram['otVal1'];

        if (globalStore.signals[timeStamps[timeStamps.length-1]]['ME_Power_perc']==-1000)
          useLoad = true;

        if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);

        for (let p=0;p<this.parameters1.length;p++)
        {
          let opp = false;

          if (p%2==1) opp = true;

          let yText='';

          let tag = this.parameters1[p].replace(/[0-9]/g, ''), index =  this.parameters1[p].match(/[0-9]+/g);
          //console.log(tag+' '+index);

          // if (Object.keys(globalStore.mapping).includes(this.parameters1[p]))
          // {
          //   yText=globalStore.mapping[this.parameters1[p].replace('1','')]+' ['+ globalStore.units[this.parameters1[p]]+']';
          // }
          // else
          // {
          //   let param = this.parameters1[p].substring(0,this.parameters1[p].length-1);

          //   yText= globalStore.mapping[param]+" "+this.parameters1[p].substring(this.parameters1[p].length-1)+' ['+globalStore.units[param]+']';
          // }

          if (index==null)
            yText = globalStore.mapping[tag]+' ['+ globalStore.units[tag]+']';
          else             
            yText = globalStore.mapping[tag]+' '+index+' ['+ globalStore.units[tag]+']';

           let axisIndex;

          if (Object.keys(this.axisDict).includes(tag))
          {
            axisIndex = this.axisDict[tag] ;        
            
            this.chartOptions1.yAxis[axisIndex].title.text = globalStore.mapping[tag]+' ['+ globalStore.units[tag]+']';   
          }
          else 
          {
            var axis={
              title: {
                text: yText,
                align:'high'
              },
              opposite:opp
            };          

            this.chartOptions1.yAxis.push(axis);

            axisIndex = this.chartOptions1.yAxis.length -1;
            this.axisDict[tag]= axisIndex;
          }

          var item={  
              name:yText,                      
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
            
            if ((this.parameters1[p]=='ME_Power_perc')&&(useLoad)&&(globalStore.signals[timeStamps[i]]['load']!=-1000)) val = globalStore.signals[timeStamps[i]]['load']*100;
            else if ((this.parameters1[p]=='ME_Power_kW')&&(useLoad)&&(globalStore.signals[timeStamps[i]]['load']!=-1000)) val = globalStore.signals[timeStamps[i]]['load']*mcr;
            else val = globalStore.signals[timeStamps[i]][this.parameters1[p]];

            if(val!=-1000)
              item.data.push([new Date(timeStamps[i]).getTime(),val]); 
          }       

          this.chartOptions1.series.push(item);

        }

        this.axisDict={};

        for (let p=0;p<this.parameters2.length;p++)
        {
          let opp = false;

          if (p%2==1) opp = true;
          
          let yText='';

          let tag = this.parameters2[p].replace(/[0-9]/g, ''), index =  this.parameters2[p].match(/[0-9]+/g);
          //console.log(tag+' '+index);

          // if (Object.keys(globalStore.mapping).includes(this.parameters2[p]))
          // {
          //   yText=globalStore.mapping[this.parameters2[p].replace('1','')]+' ['+ globalStore.units[this.parameters2[p]]+']';
          // }
          // else
          // {
          //   let param = this.parameters2[p].substring(0,this.parameters2[p].length-1);

          //   yText= globalStore.mapping[param]+" "+this.parameters2[p].substring(this.parameters2[p].length-1)+' ['+globalStore.units[param]+']';
          // }
           if (index==null)
            yText = globalStore.mapping[tag]+' ['+ globalStore.units[tag]+']';
          else             
            yText = globalStore.mapping[tag]+' '+index+' ['+ globalStore.units[tag]+']';

          let axisIndex;

          if (Object.keys(this.axisDict).includes(tag))
          {
            axisIndex = this.axisDict[tag] ;        
            
            this.chartOptions2.yAxis[axisIndex].title.text = globalStore.mapping[tag]+' ['+ globalStore.units[tag]+']';   
          }
          else 
          {
            var axis={
              title: {
                text: yText,
                align:'high'
              },
              opposite:opp
            };          

            this.chartOptions2.yAxis.push(axis);

            axisIndex = this.chartOptions2.yAxis.length -1;
            this.axisDict[tag]= axisIndex;
          }

          
          var item={  
              name:yText,                    
              type:'spline',
              data:[],
              marker:{
                  enabled:false
              },
              yAxis:axisIndex,
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
            else if ((this.parameters2[p]=='ME_Power_kW')&&(useLoad)&&(globalStore.signals[timeStamps[i]]['load']!=-1000)) val = globalStore.signals[timeStamps[i]]['load']*mcr;
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
      },
      parameters1 : function()
      {        
          setTimeout(() => {
              this.setData();}); 
      },
      parameters2 : function()
      {        
          setTimeout(() => {
              this.setData();}); 
      },
    }
};
</script>

<style scoped>
</style>

