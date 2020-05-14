<template>
    <v-card flat>
        <v-container fluid grid-list-md fill-height style="padding:0px;width:100%;">
            <v-layout row fill-height>
                <v-flex d-flex md6>
                    <v-layout column>
                        <!--<img  width="280" :src="require('../assets/EDIbWLyb.jpg')" alt="">-->
                        <v-flex d-flex md4>
                            <v-card flat style="margin-right:100px;">
                                <v-card-title>
                                    <v-layout column>
                                        <div style="padding:5px; font-size: 32px !important;
                                                        font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(51,82,128);">
                                            WiDE - WinGD Integrated Digital Expert
                                        </div>
                                        <div style="padding:10px; font-size: 18px !important;
                                                        font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(115, 115, 115);">
                                            Creating value from engine and ship data
                                        </div>
                                    </v-layout>
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout column>
                                            <v-flex md6>
                                                <v-text-field v-model="email" label="Email"></v-text-field>
                                            </v-flex>
                                            <v-flex md6>
                                                <v-text-field
                                                        v-model="password"
                                                        :append-icon="show ? 'visibility' : 'visibility_off'"
                                                        :type="show ? 'text' : 'password'"
                                                        label="Password"
                                                        @click:append="show = !show">
                                                </v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="rgb(51,82,128)" flat @click="userLogin()">Login</v-btn>
                                </v-card-actions>
                                <v-alert
                                        class='alert'
                                        :value="alert"
                                        type="error"
                                        transition="scale-transition"
                                        color='rgb(205, 57, 64)'
                                        outline
                                        dismissible
                                        @input="closeAlert">
                                    The email and password you entered are not correct.
                                </v-alert>
                            </v-card>
                        </v-flex>
                        <v-flex d-flex md4>
                        </v-flex>
                    </v-layout>

                </v-flex>
                <!--<v-flex d-flex md6>-->
                <!--<img :src="require('../assets/EDS online login page.png')"  style="width:100%;height:100%;"  alt="">-->

                <!--</v-flex>-->
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>

    import axios from 'axios'
    import {globalStore} from "../main.js"

    export default {
        name: "Login",
        components: {},
        data() {
            return {
                email: '',
                password: '',
                show: false,
                alert: false
            }
        },
        created() {
            if (! globalStore.is_mobile()) {
                window.location.href = "http://edsonline.propulsionanalytics.com/";
            }
        },
        mounted() {},
        methods: {
            closeAlert(v) {
                this.alert = false;
            },
            userLogin() {
                if (this.password.length <= 0) {
                    this.alert = true;
                } else {
                    axios.post('http://eds2.propulsionanalytics.com/login', {
                        email: this.email,
                        password: this.password,
                    }, {withCredentials: true}).then(
                        (response) => {
                            if (response.status === 200) {

                                //this.setAlerts(response.data.notifications);
                                globalStore.userProfile = response.data;
                                globalStore.userLogged = true;

                                globalStore.alertFilters = response.data.alertFilters;

                                window.$cookies.set('user', response.data);
                                window.$cookies.set('vessel', response.data);

                                this.$router.push({path: 'dashboard'});
                            } else {
                                this.alert = true;
                            }
                        },
                        (error) => {
                            this.alert = true;
                        }
                    );
                }
            },
            setAlerts(notif) {
                if (notif != null) {
                    axios.get('http://eds2.propulsionanalytics.com/fault/fakeFaults').then(response => {
                        globalStore.faults = JSON.parse(response.data).aggrEvents;

                        for (let i = 0; i < notif.length; i++) {
                            var sel = globalStore.faults.filter(function (item) {
                                return item.fault == notif[i].faultName;
                            }).filter(function (item) {
                                return (item.element + " " + item.index) == notif[i].faultComponent;
                            });

                            if (sel.length > 0) {
                                for (let s = 0; s < sel.length; s++)
                                    globalStore.alerts.push({
                                        Id: sel[s].Id,
                                        Vessel: notif[i].faultVessel,
                                        Engine: notif[i].faultEngine,
                                        Component: notif[i].faultComponent,
                                        Subsystem: sel[s].component,
                                        Fault: notif[i].faultName,
                                        Date: notif[i].faultDatetime.date
                                    });

                            }
                        }
                    })
                }
            }
        },
        watch: {}
    }
</script>

<style scoped>

</style>
