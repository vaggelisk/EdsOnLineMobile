<template>
    <v-card flat fill-height style="height:320px;margin:5px;" >
        <v-card-title v-if="cardData.engineState.nav" style="height:10%;cursor:pointer;"
                v-on:click="navTo(cardData.name)"
                v-on:mouseleave="color='rgb(95,158,239)'"
                v-on:mouseover ="color='rgb(51,82,128)'">
            <div primary class="title" :style="'color:'+color+';'">
                {{cardData.name}}
            </div>
            <v-icon :color="color">play_arrow</v-icon>
            <v-spacer/>
            <div style="font-size:15px;color:rgb(33,33,33);">
                Last update: {{cardData.lastUpdate}}
            </div>
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

                        <v-layout column fill-height >
                            <v-flex  v-for="item in cardData" :key="item" style="min-height:0px;font-size:13px;">
                                <v-layout row v-if="item.label">
                                    <v-flex style="align-content: start" align- start justify-start >{{item.label}}:</v-flex>
                                    <v-flex  v-if="item.value==-1000" d-flex>- {{item.unit}}</v-flex>
                                    <v-flex  v-else-if="item.format!=null" style="text-align: left;  align-content: end">{{item.value.toFixed(item.format)}} {{item.unit}}</v-flex>
                                    <v-flex v-else style="text-align-all: left">{{item.value}} {{item.unit}}</v-flex>
                                </v-layout>
                            </v-flex>

                        </v-layout>
                    </v-flex>
                    <!--<v-flex d-flex md3>-->
                        <!--<v-layout column fill-height>-->
                            <!--<v-flex md1 d-flex>-->
                                <!--<div v-if="cardData.engineKPI<0" style="color:rgb(117,117,117);display:flex;align-items:center;justify-content:center;font-size:28px;">-</div>-->
                                <!--<div v-else-if="cardData.engineColor==20" style="color:rgb(205, 57, 64);display:flex;align-items:center;justify-content:center;font-size:28px;">{{cardData.engineKPI}} %</div>-->
                                <!--<div v-else style="color:rgb(117,117,117);display:flex;align-items:center;justify-content:center;font-size:28px;" >{{cardData.engineKPI}} %</div>-->
                            <!--</v-flex>-->
                            <!--<v-flex md10 d-flex style="align-items:center;">-->
                                <!--<div v-if="cardData.engineColor==0" :style="'height:30px; border:none; color:rgb(60, 171, 48); background-color:rgb(60, 171, 48); width:' + cardData.engineKPI+ '%;' " />-->
                                <!--<div v-if="cardData.engineColor==10" :style="'height:30px; border:none; color:rgb(255, 184, 29); background-color:rgb(255, 184, 29); width:' + cardData.engineKPI+ '%;' " />-->
                                <!--<div v-if="cardData.engineColor==20" :style="'height:30px; border:none; color:rgb(205, 57, 64); background-color:rgb(205, 57, 64); width:' + cardData.engineKPI+ '%;' " />-->
                                <!--<div :style="'height:30px; border:none; color:rgb(244,244,244);  background-color:rgb(244,244,244); width:' + (100-cardData.engineKPI)+ '%;' " />-->
                            <!--</v-flex>-->
                            <!--<v-flex md1 d-flex style="align-items:center;justify-content:center;font-size:16px;">Engine KPI</v-flex>-->
                        <!--</v-layout>-->
                    <!--</v-flex>-->
                    <!--<v-flex d-flex md3>-->
                        <!--<Trendline v-on:dblclick.native="changeSFOC()"-->
                            <!--v-bind:trendData="cardData[param]"/>        -->
                    <!--</v-flex>-->
                    <!--<v-flex d-flex md3 >-->
                        <!--<Trendline-->
                            <!--v-bind:trendData="cardData['sloc']"/>-->
                    <!--</v-flex>-->
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
            cardData:Object
        },
        data: function () {
            return {
                // titles:[//'Last update',
                // 'Latitude','Longitude','Power','RPM','Speed','Engine State'] ,
                keys:['LAT','LON','ME_Power_perc','ensp','STW','engineState', 'version'],
                color:'rgb(95,158,239)',
                param:'bsfc'
            }
        },
        methods: {
            navTo(vesselName)
            {
                //this.color='rgb(95,158,239)';
                globalStore.selectedVessel = vesselName;
                globalStore.selectedIMO = this.cardData.imo;


                this.$router.push( { path: `/vessel-view/${globalStore.selectedVessel}` });
            },
            changeSFOC()
            {
                //console.log('double click');

                if (this.param=='bsfc') this.param ='fcon';
                else this.param = 'bsfc';
            }
        },
        mounted() {
        },
        watch:
        {
            cardData : function()
            {
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


