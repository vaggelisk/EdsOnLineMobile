<template>
    <v-card flat fill-height style="height:100%;width:100%;">
        <v-card-title  primary class="title" style="height:10%;width:100%;">Chart Title</v-card-title>
        <v-card-actions fill-height style="height:90%;width:100%;">  
             <dx-chart style="height:100%;width:100%;" v-show="load" 
                        :dataSource="datapoints" 
                        >
                <dx-legend :visible="false"/>
                <dx-series
                        type="scatter"
                        argument-field="date"
                        value-field="val"
                        name="Values">
                </dx-series>
            </dx-chart>
        </v-card-actions>
    </v-card>
</template>

<script>
    import DxChart, {
        DxArgumentAxis,
        DxSeries,
        DxPoint,
        DxValueAxis,
        DxAnimation,
        DxLegend,        
        DxLabel,
        DxCommonAxisSettings, 
        DxGrid,
        DxTickInterval,
        DxBorder
    } from 'devextreme-vue/chart';

    export default {
        name: "TimelineChartDX",
        components: {
            DxChart,
            DxArgumentAxis,
            DxSeries,
            DxPoint,
            DxValueAxis,
            DxAnimation,
            DxLegend,
            DxLabel,
            DxCommonAxisSettings, 
            DxGrid,
            DxTickInterval,
            DxBorder
        },
        props: {
            chartData:Object
        },
        data: function () {
            return {
                load:false,
                datapoints:[]
            }
        },
        methods: {
        },
        created() {

            for (let i=0;i<5000;i++)
            {
                let arg = Math.random()*1000;
                let val = Math.random()*1000;


                this.datapoints.push({
                    'date':arg,
                    'val':val});
            }

            this.load= true;

        }, 
        watch:
        {
        }
    }
</script>

<style scoped>
</style>
