<template>
  <v-responsive style="width:100%;height:100%;padding:5px;" contain>
    <div style="width:100%;height:100%;">
      <dx-circular-gauge   style="width:100%;height:100%;"
                      :value.sync="value"
                    :redraw-on-resize="true" >
        <dx-value-indicator
          spindleGapSize=0
          type="disable"
          color="transparent"
        />
        <dx-geometry
          :start-angle="270"
          :end-angle="270"
        />
        <dx-scale
          :start-value="0"
          :end-value="100"
          :tick-interval="100">
          <dx-label :visible="false" />
          <dx-tick :visible="false" />
        </dx-scale>
        <dx-range-container :width="10" background-color="rgb(244,244,244)">
          <dx-range :ref="range" :start-value="0"
                    :end-value.sync="value"
                    :color="colorRGB"
                    ></dx-range>
        </dx-range-container>
      </dx-circular-gauge>
      <span class="gaugeTitle" :style="'font-size: '+fontSize+'px;'"> {{labelText}} </span>
    </div>
  </v-responsive>
</template>

<script>
  import { DxCircularGauge,
    DxSize,
    DxValueIndicator,
    DxGeometry,
    DxScale,
    DxRangeContainer,
    DxRange,
    DxTitle,
    DxLabel,
    DxTick
  } from "devextreme-vue/circular-gauge";

    export default {
      name: "CircGauge",
      components: {
        DxCircularGauge,
        DxSize,
        DxValueIndicator,
        DxGeometry,
        DxScale,
        DxRangeContainer,
        DxRange,
        DxTitle,
        DxLabel,
        DxTick
      },
      props:  {
        labelText: String,
        value: Number,
        color: Number,
        fontSize: Number
      },
      // data() {
      //   return {
      //     colorRGB: 'rgb(60, 171, 48)'
      //   }
      // },
      computed: {
        colorRGB: function () {
          if (this.color===0) return 'rgb(60, 171, 48)';
          else if (this.color===10) return 'rgb(255, 184, 29)';
          else return 'rgb(205, 57, 64)';
        },
      },
      watch:
      {
        color: function(newColor)
        {
          if (this.color==0) this.colorRGB = 'rgb(60, 171, 48)';
          else if (this.color==10) this.colorRGB = 'rgb(255, 184, 29)';
          else this.colorRGB =  'rgb(205, 57, 64)';
        }
      }
    }
</script>

<style scoped>

 .gaugeTitle
 {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

</style>


