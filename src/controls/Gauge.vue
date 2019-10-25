<template>
    <v-card flat style="height:100%;width:100%">
        <v-card-title  primary class="title" style="height:10%;padding-top:5px;padding-bottom:5px;">{{data.title}} {{data.unit}}</v-card-title>
        <v-card-actions fill-height style="height:90%;padding:0px;">
            <dx-circular-gauge   style="width:100%;height:100%;"
                            :value="data.value"
                            :redraw-on-resize="true" >
                <dx-value-indicator
                    spindleGapSize=60
                    type="rectangleNeedle"
                    width=2
                    spindleSize=65 
                    offset=7 />
                <!-- <dx-subvalue-indicator
                    color="rgb(51,82,128)"
                    type="textCloud">                    
                    <dx-text >
                        <dx-font size=13 />
                    </dx-text >
                </dx-subvalue-indicator> -->
                <dx-geometry
                    :start-angle="225"
                    :end-angle="315"
                />
                <dx-scale
                    :start-value="data.startValue"
                    :end-value="data.endValue"
                    :tick-interval="data.tickInterval">
                    <dx-label :use-range-colors="true" />
                    <dx-tick :length="15" />
                </dx-scale>
                <dx-range-container :width="15" background-color="transparent">
                <dx-range :start-value="data.startValue"
                            :end-value="data.rangeLimit"
                            color= "rgb(60, 171, 48)"/>                        
                <dx-range :start-value="data.rangeLimit"
                            :end-value="data.endValue"
                            color="rgb(205, 57, 64)"/>
                </dx-range-container>           
            </dx-circular-gauge> 
            <span v-if="data.value!=-1000" class="gaugeTitle" :style="'font-size: 26px;'"> {{data.value.toFixed(1)}} </span>
            <span v-else class="gaugeTitle" :style="'font-size: 26px;'"> - </span>
        </v-card-actions>
    </v-card>
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
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: rgb(33,33,33);
    background-color:transparent;
}
</style>