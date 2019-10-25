<template>
    <v-card fill-height :flat="flat" style="height:100%;width:100%;">
        <v-card-title  primary class="title" style="height:15%;width:100%;padding-top:5px;padding-bottom:5px;">{{title}}</v-card-title>
        <v-card-actions  ref="chartContainer"  fill-height style="height:85%;width:100%;padding-top:0px;padding-bottom:0px;">
            <highcharts v-if="load" style="height:100%;width:100%;" :options="chartOptions"></highcharts>
        </v-card-actions>
    </v-card>
</template>

<script>

    import {Chart} from 'highcharts-vue'
    import More from 'highcharts/highcharts-more'
    import Highcharts from 'highcharts'
    import Exporting from 'highcharts/modules/exporting'

    Exporting(Highcharts)

    More(Highcharts)

    export default {
        name: "BarChart",
        components: {
             highcharts: Chart
        },
        props: {
            chartOptions:Object,
            active:Boolean,
            title:String,
            flat:Boolean
        },
        data: function () {
            return {
                load:false

            }
        },
        methods: {
            onResize(event)
            {
                this.load = false;

                setTimeout(() => {
                    this.chartOptions.chart.height =this.$refs['chartContainer'].clientHeight;
                    this.load=true;});
            }
        },
        mounted() {
            window.addEventListener('resize', this.onResize);

           //this.load = false;
        },
        watch:
        {
            active : function()
            {
                this.load = false;

                setTimeout(() => {
                    this.chartOptions.chart.height =this.$refs['chartContainer'].clientHeight;
                    this.load=true;});

            },
            chartOptions:function()
            {
                this.load = false;

                setTimeout(() => {
                    this.chartOptions.chart.height =this.$refs['chartContainer'].clientHeight;
                    this.load=true;});

            }
        }
    }
</script>

<style scoped>

</style>
