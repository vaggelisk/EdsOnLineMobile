<template>
    <div v-if="typeof data != 'undefined'">
        <v-card flat style="height:100%;width:100%">
            <v-card-title  primary class="title" style="font-height:10%;padding-top:5px;padding-bottom:5px;">{{data.title}} {{data.unit}}</v-card-title>
            <v-card-actions fill-height style="height:90%;padding:0px;">
                <dx-circular-gauge style="width:95%;height:60%;" :value="data.value" :redraw-on-resize="true">
                    <dx-value-indicator spindleGapSize=60 type="rectangleNeedle" width=1 spindleSize=65 offset=7 />
                    <dx-geometry :start-angle="225" :end-angle="315" />
                    <dx-scale :start-value="data.startValue" :end-value="data.endValue" :custom-ticks="data.customTicks">
                        <dx-label :use-range-colors="true" />
                        <dx-tick :length="15" />
                    </dx-scale>
                    <dx-range-container :width="15" background-color="transparent">
                        <dx-range :start-value="data.startValue" :end-value="data.rangeLimit" color= "rgb(60, 171, 48)"/>
                        <dx-range :start-value="data.rangeLimit" :end-value="data.endValue" color="rgb(205, 57, 64)"/>
                    </dx-range-container>
                </dx-circular-gauge>
                <span v-if="data.value!=-1000" class="gaugeTitle" :style="'font-size: 16px;'"> {{data.value.toFixed(1)}} </span>
                <span v-else class="gaugeTitle" :style="'font-size: 16px;'"> - </span>
            </v-card-actions>
        </v-card>
    </div>
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
    DxFont,
    DxLabel,
    DxTick,
    DxSubvalueIndicator,
    DxText
  } from "devextreme-vue/circular-gauge";

export default {
    name: 'Gauge',
    components: {
        DxCircularGauge,
        DxSize,
        DxValueIndicator,
        DxGeometry,
        DxScale,
        DxRangeContainer,
        DxRange,
        DxLabel,
        DxTick,
        DxTitle,
        DxFont,
        DxSubvalueIndicator,
        DxText
    },
    props:
    {
        data:Object,
        // value: Number,
        // rangeLimit: Number,
        // startValue : Number,
        // endValue : Number,
        // tickInterval : Number,
        // unit : String,
        // format : Number,
        // title: String
    },
    data () {
        return {
        }
    },
    computed: {
    },
    watch: {

    },
    methods:
    {
    }
}
</script>

<style scoped>
.gaugeTitle
 {
    margin: 0;
    position: absolute;
    top: 60%;
    left: 47%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: rgb(33,33,33);
    background-color:transparent;
}
</style>
