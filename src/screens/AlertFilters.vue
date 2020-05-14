<template>
    <v-container fluid fill-height grid-list-md
                 style="padding:0px 10px 5px 10px;height:100%;width:100%;background-color:white;">
        <v-layout column fill-height>
            <v-layout row style="padding-top:15px;">
                <dx-data-grid id="alertTable" ref='alTable' :data-source="alerts" :selection="{ mode: 'single' }" :show-column-lines="true" :show-row-lines="true" :show-borders="false" :word-wrap-enabled="true" :row-alternation-enabled="false" :column-auto-width="true" @selection-changed="setSelected">
                    <dx-paging :page-size="20"/>
                    <dx-column data-field="Vessel"/>
                    <dx-column data-field="Engine"/>
                    <dx-column data-field="Component"/>
                    <dx-column data-field="Subsystem"/>
                    <dx-column data-field="Fault"/>
                    <dx-column data-field="Status"/>
                </dx-data-grid>
            </v-layout>
            <v-layout row style="max-height:50px;padding-left:20px;">
                <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="addNew">Add</v-btn>
                <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="editSelected">Edit</v-btn>
                <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="delSelected">Delete</v-btn>
                <v-spacer/>
            </v-layout>
            <v-dialog v-model="showDialog" width="300" height="300">
                <v-card style="width:500px;height:650px;">
                    <v-card-title v-if=" dialogMode=='add'" primary class="title" style="height:5%;">Add Alert Filter</v-card-title>
                    <v-card-title v-if=" dialogMode=='edit'" primary class="title" style="height:5%;">Edit Alert Filter</v-card-title>
                    <v-card-text style="height:85%;overflow:auto;">
                        <v-layout column fill-height>
                            <v-flex d-flex v-for="field in fields" v-bind:key="field">
                                <v-layout row>
                                    <v-flex d-flex xs4 style="align-items:center;justify-content:flex-end;padding-right: 30px;font-size: 16px;"> {{field}}:</v-flex>
                                    <v-flex d-flex xs8>
                                        <v-autocomplete v-model="dialogAlert[field]" :items="alertsFields[field]"/>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex d-flex>
                                <v-layout row>
                                    <v-flex d-flex xs4 style="align-items:center;justify-content:flex-end;padding-right: 30px;font-size: 16px;">Active:</v-flex>
                                    <v-flex d-flex xs8>
                                        <v-checkbox v-model="active" color="rgb(51,82,128)"/>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions style="height:10%;">
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click="cancelDialog">Cancel</v-btn>
                        <v-btn style="color:white; background-color: rgb(51,82,128);" @click="okDialog">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import {DxDataGrid, DxColumn, DxPaging, DxScrolling} from 'devextreme-vue/data-grid';
    import axios from 'axios';
    import {globalStore} from "../main.js"

    const API_URL_REMOTE = 'http://eds2.propulsionanalytics.com';

    export default {
        name: "AlertFilters",
        components: {
            DxDataGrid,
            DxColumn,
            DxPaging,
            DxScrolling
        },
        data() {
            return {
                alerts: [],
                selectedAlert: {},
                dialogAlert: {
                    Vessel: 'All',
                    Engine: 'All',
                    Component: 'All',
                    Subsystem: 'All',
                    Fault: 'All',
                    Status: true
                },
                alertsFields: {},
                showDialog: false,
                dialogMode: 'add',
                fields: ['Vessel', 'Engine', 'Component', 'Subsystem', 'Fault'],
                active: true
            }
        },
        created() {
            axios.get('http://eds2.propulsionanalytics.com/getAlertSettings', {withCredentials: true}).then(response => {
                this.alertsFields['Vessel'] = ['All'].concat(response.data.data.vesselsSettings);
                this.alertsFields['Engine'] = ['All'].concat(response.data.data.enginesSettings);
                this.alertsFields['Component'] = ['All'].concat(response.data.data.componentsSettings);
                this.alertsFields['Subsystem'] = ['All'].concat(response.data.data.subsystemsSettings);
                this.alertsFields['Fault'] = ['All'].concat(response.data.data.faultsSettings);
            });
            //  this.alertsFields['Status']=['Active','Inactive'];
            this.alerts = globalStore.alertFilters;
        },
        mounted() {
        },
        methods: {
            setSelected({selectedRowsData}) {
                const data = selectedRowsData[0];

                this.selectedAlert = data;
            },
            addNew() {
                this.dialogAlert = {
                    Vessel: 'All',
                    Engine: 'All',
                    Component: 'All',
                    Subsystem: 'All',
                    Fault: 'All',
                    Status: true
                };

                this.active = true;

                this.dialogMode = 'add';
                this.showDialog = true;
            },
            editSelected() {
                if (Object.keys(this.selectedAlert).length > 0) {
                    this.dialogAlert = Object.assign({}, this.selectedAlert);

                    this.active = this.dialogAlert.Status;

                    this.dialogMode = 'edit';
                    this.showDialog = true;
                }
            },
            delSelected() {
                if (Object.keys(this.selectedAlert).length > 0) {
                    var delItem = this.filterItems(this.alerts, this.selectedAlert.Id)[0];

                    axios.delete(API_URL_REMOTE + '/rule/' + this.selectedAlert.Id);

                    this.alerts.splice(this.alerts.indexOf(delItem), 1);

                    this.selectedAlert = {};
                }
            },
            filterItems(arr, id) {
                return arr.filter(function (el) {
                    return el.Id == id;
                })
            },
            cancelDialog() {
                this.showDialog = false;
            },
            okDialog() {
                if (this.dialogMode == 'add') {
                    var newAlert = Object.assign({}, this.dialogAlert);

                    newAlert.email = globalStore.userProfile.email;

                    axios.post(API_URL_REMOTE + '/rule/new', newAlert).then(response => {
                        if (response.statusText = "Created" && Object.keys(response.data).indexOf('new_id') > -1) {
                            newAlert.Id = response.data.new_id;
                            this.alerts.push(newAlert);
                        }
                    });
                } else {
                    var editAlert = this.filterItems(this.alerts, this.dialogAlert.Id)[0],
                        newAlerts = Object.assign({}, this.dialogAlert);

                    axios.post(API_URL_REMOTE + '/rule/' + this.dialogAlert.Id + '/edit', this.dialogAlert).then(response => {
                        if (Object.keys(response.data).indexOf('alertRule') > -1) {
                            this.alerts[this.alerts.indexOf(editAlert)] = newAlerts;
                            this.selectedAlert = newAlerts;

                            this.$refs['alTable'].instance.refresh();
                        }
                    });
                }

                this.showDialog = false;
            }
        },
        watch: {
            active: function () {
                this.dialogAlert['Status'] = this.active;
                // if (this.active) this.dialogAlert['Status'] = 'Active';
                // else this.dialogAlert['Status'] = 'Inactive';
            }
        }
    }
</script>

<style scoped>

    #alertTable {
        font-size: 16px;
        font-family: 'Roboto', 'sans seriff';
        height: 100% !important;
    }

</style>
