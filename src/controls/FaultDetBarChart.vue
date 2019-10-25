<template>
  <v-card flat style="width : 100%; height:100%;">
    <v-card-title style="height:20%;" primary class="title">{{ dataChart.arrangements.name }}</v-card-title>
    <v-card-actions fill-height :style="'width : 100%; height: 80%;'">      
      <!-- <v-responsive style="width : 100%;" > -->
        <v-flex d-flex style="width : 100%;height:100%;">
          <p><em>{{ dataChart.arrangements.yaxis}}</em> </p>
          <dx-chart
            id="chart"
            ref='chart'
            style="width : 100%;height:100%;"
            :data-source="dataChart.values"
            :customize-point="customizePoint"
          >
            <dx-animation :enabled="false"/>
            <dx-series
              argument-field="arg"
              value-field="value"
              type="bar"
            >
            </dx-series>
            <dx-value-axis
              :showZero="true"        
            >
              <dx-tick :visible="false"/>
              <dx-minor-tick :visible="false"/>              
              <dx-grid color="rgb(67,67,67)"/>
            </dx-value-axis>

            <dx-crosshair
              :horizontal-line="false"
              :enabled="true"
              color="#949494"
              :width="1"
              dashStyle="solid">

            </dx-crosshair>

            <dx-tooltip
              :enabled="true">
            </dx-tooltip>

            <dx-legend :visible="false"/>
          </dx-chart>
        <!-- <div style="margin-right: 20px; text-align: right"><em> {{ dataChart.arrangements.xaxis}} </em></div> -->
        
        </v-flex>
      <!-- </v-responsive> -->
    </v-card-actions>          
  </v-card>
</template>

<script>
  import {
    DxChart, DxSeries, DxLabel, DxValueAxis,
    DxGrid, DxTitle, DxLegend, DxTooltip,
    DxCrosshair, DxCrosshairLabel, DxTick, DxMinorTick, DxAnimation
  } from 'devextreme-vue/chart';

  export default {
    name: "FaultDetBarChart",
    components: {
      DxChart, DxSeries, DxLabel, DxCrosshair,
      DxCrosshairLabel, DxValueAxis, DxGrid, DxTitle,
      DxLegend, DxTooltip, DxTick, DxMinorTick, DxAnimation
    },
    props: {
      dataChart: Object,
      counter: Number,
      active: Boolean
    },
    methods: {
      customizePoint(arg) {
        if (arg.tag === 0) {
          return { color:'rgb(60, 171, 48)', hoverStyle: { color: 'rgb(60, 171, 48)' } };
        }
        else if (arg.tag === 1) {
          return { color: 'rgb(205, 57, 64)', hoverStyle: { color: 'rgb(205, 57, 64)'} };
        }
        else if (arg.tag === 2) {
          return { color: 'rgb(51, 82, 128)', hoverStyle: { color: 'rgb(51, 82, 128)'} };
        }
      }, 
      onResize(event)
      {
          setTimeout(() => {
              this.$refs['chart'].instance.render();
          });
      },

      customizeTooltip (arg) {
        return { html:  '<span style="height:8px; width:8px;background-color:green;" >'  + '</span>' +  ' Cylinder ' + arg.argumentText + ' : ' + arg.valueText.toFixed(2)  +  ' '} ;
      }
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
       
        
        setTimeout(() => {
            this.$refs['chart'].instance.render();
        });   

    },  
    watch:
    {
        counter : function(c)
        {
              setTimeout(() => {
                this.$refs['chart'].instance.render();
            });  
        },
        active:function()
        {
            if (this.active)
            {
                setTimeout(() => {
                    this.$refs['chart'].instance.render();
                });  
            }
        }
    }
  }
</script>

<style scoped>
  #chart {
    height: 170px;
    width: 500%;
  }
  p {
    text-align: end;
    writing-mode: vertical-rl ;
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
  }

</style>



