<template>
    <v-container fluid fill-height grid-list-md style="padding:0px;">
        <v-layout column fill-height style="padding:0px;">   
            <v-flex v-if="trendData.value==-1000" d-flex md1 style="align-items:center;justify-content:center;font-size:28px;">
                {{0.0.toFixed(trendData.format)}}
            </v-flex>         
            <v-flex v-else d-flex md1 style="align-items:center;justify-content:center;font-size:28px;">
                {{trendData.value.toFixed(trendData.format)}}                   
            </v-flex>
            <v-flex d-flex md10>
                <highcharts style="height:100%;width:100%;" :options="chartOptions"></highcharts>
            </v-flex>
            <v-flex d-flex md1 style="align-items:center;justify-content:center;font-size:16px;">
                {{trendData.title}} [{{trendData.unit}}]
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    import {Chart} from 'highcharts-vue'

    export default {
        name: "Trendline",
        components: {
            highcharts: Chart 
        },
        props: {
            trendData:Object
        },
        data: function () {
            return { 
                chartOptions:{}                  
            }
        },
        methods: {
        },
        mounted() {

            this.chartOptions = JSON.parse(JSON.stringify(this.trendData.chartOptions));
            this.chartOptions.title = { text:undefined };
            this.chartOptions.yAxis= {
                    labels:{ enabled:false },
                    title:{ text:undefined}};
            this.chartOptions.time= { useUTC:false };
            this.chartOptions.tooltip= {
                    formatter: function () {
                        return this.points.reduce(function (s, point) {
                            return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                        //}, '<b>' + this.x + '</b>');
                        }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
                    },
                    shared:true
                };
        },         
        watch:
        {
            trendData:function()
            {
                this.chartOptions = JSON.parse(JSON.stringify(this.trendData.chartOptions));
                this.chartOptions.title = { text:undefined };
                this.chartOptions.yAxis= {
                    labels:{ enabled:false },
                    title:{ text:undefined}};
                this.chartOptions.time= { useUTC:false };
                this.chartOptions.tooltip= {
                    formatter: function () {
                        return this.points.reduce(function (s, point) {
                            return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                        //}, '<b>' + this.x + '</b>');
                        }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
                    },
                    shared:true
                };

            }
        }
    }
</script>

<style scoped>
</style>
