<template>
    <v-card flat fill-height style="height:100%;">
        <v-card-title primary class="title">Overall Engine status</v-card-title>
        <v-card-actions fill-height style="height:90%;">
            <v-container fluid fill-height grid-list-md style="padding:5px;">
                <v-layout column fill-height>
                    <v-flex d-flex md1 style="align-items:center;font-size:18px;">
                        Engine KPI
                    </v-flex>
                    <v-flex d-flex md3 style="align-items:center;">
                        <v-layout row>
                            <v-flex d-flex md4>
                                <div v-if="data.engineKPI<0" style="display:flex;align-items:center;justify-content:center;font-size:36px;">-</div>
                                <div v-else-if="data.engineColor==20" style="color:rgb(205, 57, 64);display:flex;align-items:center;justify-content:center;font-size:36px;">{{data.engineKPI}} %</div>
                                <div v-else style="color:rgb(117,117,117);display:flex;align-items:center;justify-content:center;font-size:36px;" >{{data.engineKPI}} %</div>
                            </v-flex>
                            <v-flex d-flex md8 style="align-items:center;justify-content:center;">
                                <div v-if="data.engineColor==0" :style="'height:30px; border:none; color:rgb(60, 171, 48); background-color:rgb(60, 171, 48); width:' + data.engineKPI+ '%;' " />
                                <div v-if="data.engineColor==10" :style="'height:30px; border:none; color:rgb(255, 184, 29); background-color:rgb(255, 184, 29); width:' + data.engineKPI+ '%;' " />
                                <div v-if="data.engineColor==20" :style="'height:30px; border:none; color:rgb(205, 57, 64); background-color:rgb(205, 57, 64); width:' + data.engineKPI+ '%;' " />
                                <div :style="'height:30px; border:none; color:rgb(244,244,244);  background-color:rgb(244,244,244); width:' + (100-data.engineKPI)+ '%;' " />
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex d-flex md2>
                    </v-flex>
                    <v-flex d-flex md1 style="align-items:center;font-size:18px;">
                        Cylinders
                    </v-flex>
                    <v-flex d-flex md2>
                        <v-layout row>
                            <v-flex d-flex v-for="(item,index) in data.cylinders" v-bind:key="item"
                                style="font-size:24px;font-weight:bold;color:white;">
                                <div v-if="item==0" style="display:flex;justify-content:center;align-items:center;background-color:rgb(60, 171, 48);">{{index+1}}</div>
                                <div v-if="item==10" style="display:flex;justify-content:center;align-items:center;background-color:rgb(255, 184, 29);">{{index+1}}</div>
                                <div v-if="item==20" style="display:flex;justify-content:center;align-items:center;background-color:rgb(205, 57, 64);">{{index+1}}</div>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex d-flex md1 style="align-items:center;font-size:18px;">
                        Other Components
                    </v-flex>
                    <v-flex d-flex md2>
                        <v-layout row>
                            <v-flex d-flex v-for="item in data.elements" v-bind:key="item"
                                style="font-size:14px;font-weight:bold;color:white;">
                                <div v-if="item.color==0" style="display:flex;justify-content:center;align-items:center;background-color:rgb(60, 171, 48);">{{item.name}}</div>
                                <div v-if="item.color==10" style="display:flex;justify-content:center;align-items:center;background-color:rgb(255, 184, 29);">{{item.name}}</div>
                                <div v-if="item.color==20" style="display:flex;justify-content:center;align-items:center;background-color:rgb(205, 57, 64);">{{item.name}}</div>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script>

    export default {
        name: "EngineState",
        components: {
        },
        props: {
            data:Object
        },
        data: function () {
            return {

            }
        },
        methods: {
        },
        mounted() {
        },
        watch:
        {
        }
    }
</script>

<style scoped>
</style>
