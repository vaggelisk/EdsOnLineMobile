<template>
    <v-card flat fill-height style="width:400px;background-color:rgb(244,244,244);">
        <v-card-title class="title" style="color:rgb(51,82,128);height:40px;">Alerts</v-card-title>
        <v-card-text style="overflow:auto;padding:8px;max-height:400px; max-width:73%">
            <v-container fluid fill-height grid-list-md style="padding:5px;">
                <v-layout fill-height column>
                    <v-flex v-for="item in alerts" :key="item">
                        <v-card flat class="hoverCard" fill-height
                                style="background-color:rgb(219,219,219);">
                            <v-container fluid grid-list-md style="padding:5px;height:100%;">
                                <v-layout row fill-height>
                                    <v-flex d-flex md4>
                                        <v-layout column fill-height>
                                            <v-flex d-flex v-for="param in parameters" :key="param"
                                                    style="padding-left:10px;">
                                                {{param}} :
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex d-flex md5>
                                        <v-layout column fill-height>
                                            <v-flex d-flex v-for="param in parameters" :key="param">
                                                <div v-if="param=='Fault'" class="hoverTitle" v-on:click="select(item)"
                                                     style="width:100%;height:100%;">{{item[param]}}
                                                </div>
                                                <div v-else style="width:100%;height:100%;">{{item[param]}}</div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex d-flex md3>
                                        {{item.faultDatetime.slice(0,10)}}<br>{{item.faultDatetime.slice(11,19)}}
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import {globalStore} from "../main.js"
    import {getData} from "../getData.js";
    import axios from 'axios'

    var apiService;

    export default {
        name: "AlertMenu",
        components: {},
        data() {
            return {
                parameters: ['Vessel', 'Component', 'Subsystem', 'Fault']
            }
        },
        created() {
            apiService = new getData(globalStore.userProfile);

            setTimeout(function () {
                axios.get('http://eds2.propulsionanalytics.com/getUserNotifications', {withCredentials: true})
                    .then((response) => {
                            if (response.status === 200) {
                                globalStore.alerts = response.data.data;
                            }
                        },
                        (error) => {
                            if (error.response.status == 500) {
                                globalStore.userLogged = false;
                                window.$cookies.remove('user');
                                location.reload(true);
                            }
                        });
            },600);
        },
        computed: {
            alerts: function () {
                return globalStore.alerts;
            }
        },
        mounted() {},
        methods: {
            goToAlerts() {
                this.$router.push({path: 'alerts'});
            },
            dismissAll() {
                globalStore.alerts = [];
            },
            select(item) {
                if (typeof globalStore.previousType == 'undefined' || globalStore.previousType.length < 1)
                    globalStore.previousType = globalStore.type

                globalStore.selectedVessel = item.Vessel;
                globalStore.selectedVesselFaultDate = item.faultDatetime.slice(0,10);

                this.loadDateFaults(item.faultDatetime.slice(0,10));
                this.$router.push({name: 'Engine Faults', params: {id: item.Id}});
            },
            loadDateFaults (date) {
                if (globalStore.selectedVessel.length) {
                    var vessel = globalStore.userProfile.vessels.filter(function (vessel) {
                        if (vessel.name == globalStore.selectedVessel) {
                            return vessel;
                        }
                    });

                    if (vessel.length) {
                        var imo = vessel[0].imo;

                        apiService.getData(date, imo);
                    }
                }
            }
        },
        watch: {}
    }
</script>

<style scoped>
    .hoverTitle {
        color: rgb(95, 158, 239);
    }

    .hoverTitle:hover {
        color: rgb(51, 82, 128);
    }
</style>

