<template>
    <v-card v-if="typeof cardData != 'undefined'" flat fill-height style="height:320px;margin:5px;">
        <v-card-title v-if="cardData.engineState.nav" style="height:10%;cursor:pointer;" v-on:click="navTo(cardData.name)" v-on:mouseleave="color='rgb(95,158,239)'" v-on:mouseover="color='rgb(51,82,128)'">
            <div primary class="title" :style="'color:'+color+';'">
                {{cardData.name}}
            </div>
            <v-icon :color="color">play_arrow</v-icon>
            <v-spacer/>
            <div style="font-size:15px;color:rgb(33,33,33);"> Last update: {{cardData.lastUpdate}}</div>
        </v-card-title>
        <v-card-title v-else style="height:10%;color:rgb(51,82,128);">
            <div primary class="title">
                {{cardData.name}}
            </div>
            <v-spacer/>
            <div style="font-size:15px;color:rgb(33,33,33);padding-bottom:15px">
                Last update: {{cardData.lastUpdate}}
            </div>
        </v-card-title>
        <v-card-actions fill-height style="height:90%;">
            <v-container fluid style="padding:0;height:100%;">
                <v-layout row fill-height>
                    <v-flex>
                        <v-layout column fill-height>
                            <v-flex v-for="item in cardData" :key="item" style="min-height:0px;font-size:14px; justify-content: right">
                                <v-layout row v-if="item.label" style="justify-content: space-between">
                                    <span>{{item.label}}:</span>
                                    <span v-if="item.value==-1000" d-flex> - {{item.unit}}</span>
                                    <span v-else-if="item.format!=null">{{item.value.toFixed(item.format)}} {{item.unit}}</span>
                                    <span v-else>{{item.value}} {{item.unit}}</span>

                                </v-layout>
                            </v-flex>


                        </v-layout>
                    </v-flex>

                </v-layout>
                <v-layout style="margin-top: -45px">
                    <v-flex>
                        <v-layout style="justify-content: space-between">
                            <span>Engine KPI: </span>
                            <span v-if="cardData.engineKPI<0" style="color:rgb(117,117,117);align-items:center;justify-content:right;font-size:18px;">-</span>
                            <span v-else-if="cardData.engineColor==20" style="color:rgb(205, 57, 64);font-size:18px; padding-right: 100px">{{cardData.engineKPI}} %</span>
                            <span v-else style="color:rgb(117,117,117);align-items:flex-end;justify-content:flex-end;font-size:18px; padding-left: 120px;">{{cardData.engineKPI}} %</span>
                        </v-layout>

                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script>

    import Trendline from './Trendline'
    import {globalStore} from "../main.js"

    export default {
        name: "DashboardCard",
        components: {
            Trendline
        },
        props: {
            cardData: Object
        },
        data: function () {
            return {
                keys: ['LAT', 'LON', 'ME_Power_perc', 'ensp', 'STW', 'engineState', 'version', 'engineKPI'],
                color: 'rgb(95,158,239)',
                param: 'bsfc'
            }
        },
        methods: {
            navTo(vesselName) {
                if (typeof vesselName != 'undefined' && vesselName != 'undefined') {
                    globalStore.selectedVessel = vesselName;
                    globalStore.selectedIMO = this.cardData.imo;

                    this.$router.push({path: `/vessel-view/${globalStore.selectedVessel}`});
                }
            },
            changeSFOC() {
                if (this.param == 'bsfc')
                    this.param = 'fcon';
                else
                    this.param = 'bsfc';
            }
        },
        mounted() {
        },
        watch: {
            cardData: function () {
            }
        }
    }
</script>

<style scoped>
    /* .hoverTitle
    {
        color:rgb(51,82,128);
    }
    .hoverTitle:hover
    {
        color:rgb(95,158,239);
    } */
</style>


