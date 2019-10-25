<template>
    <v-card flat class="hoverCard" fill-height style="height:250px;margin:5px;" v-on:click="navTo(cardData.name)">
        <v-card-title primary class="title" style="height:10%;color:rgb(51,82,128);" >
                {{cardData.name}}
        </v-card-title>

        <v-card-actions fill-height style="height:90%;">  
            <v-container fluid grid-list-md style="padding:5px;height:100%;">
                <v-layout column fill-height>
                    <v-flex d-flex md9>
                        <v-layout row fill-height>
                            <v-flex d-flex md3>
                                <v-layout column fill-height>                            
                                    <v-flex md5 d-flex style="align-items:flex-end;justify-content:center;font-size:18px;">
                                        {{cardData.lastUpdate.toLocaleDateString()}}
                                    </v-flex>
                                    <v-flex md6 d-flex style="align-items:flex-start;justify-content:center;font-size:18px;">
                                        {{cardData.lastUpdate.toLocaleTimeString()}}
                                    </v-flex>
                                    <v-flex md1 d-flex style="align-items:center;justify-content:center;font-size:16px;">Last update</v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex d-flex md3>
                                <v-layout column fill-height>                            
                                    <v-flex md1 d-flex>
                                        <div v-if="cardData.engineColor==20" style="color:rgb(205, 57, 64);display:flex;align-items:center;justify-content:center;font-size:28px;">{{cardData.engineKPI}} %</div>
                                        <div v-else style="color:rgb(117,117,117);display:flex;align-items:center;justify-content:center;font-size:28px;" >{{cardData.engineKPI}} %</div>
                                    </v-flex>                            
                                    <v-flex md10 d-flex style="align-items:center;">        
                                        <div v-if="cardData.engineColor==0" :style="'height:30px; border:none; color:rgb(60, 171, 48); background-color:rgb(60, 171, 48); width:' + cardData.engineKPI+ '%;' " />
                                        <div v-if="cardData.engineColor==10" :style="'height:30px; border:none; color:rgb(255, 184, 29); background-color:rgb(255, 184, 29); width:' + cardData.engineKPI+ '%;' " />
                                        <div v-if="cardData.engineColor==20" :style="'height:30px; border:none; color:rgb(205, 57, 64); background-color:rgb(205, 57, 64); width:' + cardData.engineKPI+ '%;' " />
                                        <div :style="'height:30px; border:none; color:rgb(244,244,244);  background-color:rgb(244,244,244); width:' + (100-cardData.engineKPI)+ '%;' " />
                                    </v-flex>
                                    <v-flex md1 d-flex style="align-items:center;justify-content:center;font-size:16px;">Engine KPI</v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex d-flex md3>
                                <Trendline
                                    v-bind:trendData="cardData['bsfc']"/>
                            </v-flex>
                            <v-flex d-flex md3 >
                                <Trendline
                                    v-bind:trendData="cardData['sloc']"/>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex d-flex md3>
                        <v-layout row fill-height>
                            <v-flex d-flex v-for="(title,index) in titles" :key="title" style="min-height:0px;font-size:13px;color:rgb(117,117,117);">
                                <v-layout column fill-height>
                                    <v-flex md6 d-flex style="justify-content:center;align-items:center;">{{title}}</v-flex>
                                    <v-flex md6 d-flex style="justify-content:center;align-items:center;">{{cardData[keys[index]]}}</v-flex>
                                </v-layout>
                            </v-flex>
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
        name: "DashboardCardHor",
        components: {
            Trendline
        },
        props: {
            cardData:Object
        },
        data: function () {
            return {  
                titles:[//'Last update',
                'Latitude','Longitude','Power','RPM','Speed','Draft', 'Engine State'] ,
                keys:[//'lastUpdate',
                'latitude','longitude','power','rpm','speed','draft', 'engineState']                 
            }
        },
        methods: {
            navTo(vesselName)
            {
                this.$router.push( { path:  'vessel-view'} );
                globalStore.selectedVessel = vesselName;

            }

        },
        mounted() {
        }, 
        watch:
        {
        }
    }
</script>

<style scoped>
.hoverCard:hover
{
    background-color:rgb(219,219,219);
}
</style>


