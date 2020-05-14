<template>
    <v-container fluid grid-list-md fill-height style="padding:0px 10px 5px 10px;width:100%;  background-color: white">
        <v-layout column style="background-color: white">
            <v-flex>
                <v-card>
                    <v-card-title primary class="title" style="height:5%;">Fault list</v-card-title>
                    <v-card-text style="height:90%;">
                        <v-layout v-if="enginefaults.length>0" column fill-height style="overflow:auto;">
                            <div class="slides">
                                <div class="slide" v-for="fault in enginefaults" :key="fault">
                                    <FaultCard v-on:faultChange="selFaultChange" v-bind:currentFault="fault" v-bind:kpi="kpi" v-bind:selFaultId="selectedFaultId"/>
                                </div>
                            </div>
                        </v-layout>
                        <v-layout row v-if="enginefaults.length > 1" style="padding-top: 5px;">
                            <div  style="width: 50%; text-align: center;">
                                <a href="#" @click="slideBackward">
                                    <i class="material-icons">chevron_left</i>
                                </a>
                            </div>
                            <div  style="width: 50%; text-align: center;">
                                <a href="#" @click="slideForward">
                                    <i class="material-icons">chevron_right</i>
                                </a>
                            </div>
                        </v-layout>
                        <div v-if="enginefaults.length < 1" class="title" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;color:rgb(219,219,219);">No Faults Detected</div>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex style="background-color: white; max-height: 80% !important; overflow-y: scroll !important;">
                <v-tabs v-model="active" slider-color="rgb(51,82,128)" style="height:100%;width:100%;">
                    <v-tab v-for="title in tabTitles" :key="title" ripple active-class='activeTab' style="text-transform:none;color:rgb(192,192,192);">
                        <span>{{title}}</span>
                    </v-tab>
                    <v-tab-item class="tabItem">
                        <EngineFaultsData v-bind:fault="selFault" v-bind:active="tabActive[0]"/>
                    </v-tab-item>
                    <v-tab-item class="tabItem">
                        <EngineFaultsDetails v-bind:fault="selFault" v-bind:active="tabActive[1]"/>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import EngineFaultsData from "./EngineFaultsData"
    import EngineFaultsDetails from "./EngineFaultsDetails"
    import FaultCard from '../controls/FaultCard'
    import {globalStore} from "../main.js"
    import axios from 'axios';

    export default {
        name: 'EngineFaults',
        components: {
            EngineFaultsData,
            EngineFaultsDetails,
            FaultCard
        },
        props: {},
        data() {
            return {
                active: parseInt(this.$route.query.tab),
                tabTitles: ['Fault Data', 'Details'],
                kpi: {},
                selectedFaultId: -1,
                tabActive: [true, false],
                showDialog: false,
                ticketModels: {},
                profileFields: ['displayName', 'email'],
                labels: ['Username', 'Email', 'Title'],
            }
        },
        created() {
            this.tabActive[parseInt(this.$route.query.tab)] = true;

            for (let i = 0; i < this.profileFields.length; i++) {
                this.ticketModels[this.labels[i]] = globalStore.userProfile[this.profileFields[i]];
            }

            this.ticketModels['Type'] = ['Support'];
            this.ticketModels['Message'] = '';
            this.ticketModels['Title'] = '';
        },
        mounted() {
        },
        methods: {
            selFaultChange(event) {
                this.selectedFaultId = event;
            },
            sendTicket() {
                var bodyFormData = new FormData();
                bodyFormData.set("name", this.ticketModels['Username']);
                bodyFormData.set("from", 'customer@wingd.com');//this.ticketModels['Email'] );
                bodyFormData.set("type", "1");
                bodyFormData.set("vessel", globalStore.selectedVessel);
                bodyFormData.set("engine", 'W-6X72');//'X-72' );
                bodyFormData.set("subject", this.ticketModels['Title']);
                bodyFormData.set("reply", this.ticketModels['Message']);
                bodyFormData.set("component", this.selFault['subComponent']);
                bodyFormData.set("subsystem", this.selFault['component']);
                bodyFormData.set("id", this.selFault['id']);

                axios({
                    method: 'post',
                    url: 'http://wingdservice.propulsionanalytics.com' + '/en/customer/create-ticket/',
                    data: bodyFormData,
                    config: {headers: {'Content-Type': 'multipart/form-data'}}
                })
                    .then(function (response) {
                        //handle success
                    })
                    .catch(function (error) {
                    });

                this.showDialog = false;
            },
            cancelDialog() {
                this.showDialog = false;
            },
            slideBackward(event) {
                var obj = event.path[0],
                    container = event.path[4],
                    slider = container.getElementsByClassName('slides')[0];

                slider.scrollLeft -= slider.querySelectorAll('.slide')[0].clientWidth;
            },
            slideForward(event) {
                var obj = event.path[0],
                    container = event.path[4],
                    slider = container.getElementsByClassName('slides')[0];

                slider.scrollLeft += slider.querySelectorAll('.slide')[0].clientWidth;
            },
        },
        computed: {
            selFault: function () {
                var selected = this.enginefaults.filter(function (item) {
                    return item.Id == this.selectedFaultId;
                }, this);

                return selected[0];
            },
            enginefaults: function () {
                return globalStore.faults;
            }
        },
        watch: {
            active: function () {
                for (let i = 0; i < this.tabActive.length; i++) {
                    if (i == this.active)
                        this.tabActive[i] = true;
                    else
                        this.tabActive[i] = false;
                }
            },
            showDialog: function () {
                if (this.showDialog == true) {
                    this.ticketModels['Title'] = this.selFault.fault;
                }
            },
            currentFaults: function () {
                if (this.currentFaults.length > 0) {
                    this.selectedFaultId = this.currentFaults[0].Id;
                }
            }
        }
    }
</script>

<style scoped>
    .tabItem {
        /*height: calc(100vh - 157px);*/
        height: 600px;
        background-color: white;
    }

    .slides {
        display: -webkit-box;
        display: flex;

        overflow-x: auto;
        -ms-scroll-snap-type: x mandatory;
        scroll-snap-type: x mandatory;

        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
    }

    .slides > div {
        width: 100%;
        scroll-snap-align: start;
        flex-shrink: 0;
        -webkit-transform-origin: center center;
        transform-origin: center center;
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transition: -webkit-transform 0.5s;
        transition: -webkit-transform 0.5s;
        transition: transform 0.5s;
        transition: transform 0.5s, -webkit-transform 0.5s;
        position: relative;

        display: -webkit-box;

        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
    }
</style>

<style>
    .slides .hoverCard {
        width: 100% !important;
    }
</style>
