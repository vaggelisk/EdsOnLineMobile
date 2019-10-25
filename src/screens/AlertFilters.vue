<template>
    <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;height:100%;width:100%;background-color:white;">
        <v-layout column fill-height>
            <v-layout row style="padding-top:15px;">
                <dx-data-grid
                    id="alertTable"
                    ref='alTable'
                    :data-source="alerts"
                    :selection="{ mode: 'single' }"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :show-borders="false"
                    :word-wrap-enabled="true"
                    :row-alternation-enabled="false"
                    :column-auto-width="true"
                    @selection-changed="setSelected">
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
                <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="addNew">
                   Add
                </v-btn>
                <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="editSelected">
                    Edit
                </v-btn>
                <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="delSelected">
                    Delete
                </v-btn>
                <v-spacer/>
            </v-layout>
            <v-dialog v-model="showDialog" width="500" height="650">
                <v-card style="width:500px;height:650px;">
                <v-card-title v-if=" dialogMode=='add'" primary class="title" style="height:5%;">
                    Add Alert Filter
                </v-card-title>
                <v-card-title v-if=" dialogMode=='edit'" primary class="title" style="height:5%;">
                    Edit Alert Filter
                </v-card-title>
                <v-card-text  style="height:85%;overflow:auto;">
                    <v-layout column fill-height>
                        <v-flex d-flex v-for="field in fields" v-bind:key="field">
                            <v-layout row>
                                <v-flex d-flex xs4 style="align-items:center;justify-content:flex-end;padding-right: 30px;font-size: 16px;">
                                    {{field}}:
                                </v-flex>
                                <v-flex d-flex xs8>
                                    <v-autocomplete
                                        v-model="dialogAlert[field]"
                                        :items="alertsFields[field]"/>
                                    <!-- <v-select
                                        v-model="selected[index]"
                                        :items="signalFieldsOverall"
                                        :value="s"
                                        item-text="title"
                                        item-value="param"
                                        v-on:change="theListChanged( index, s , selected[index])"/> -->
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex d-flex>
                            <v-layout row>
                                <v-flex d-flex xs4 style="align-items:center;justify-content:flex-end;padding-right: 30px;font-size: 16px;">
                                    Active:
                                </v-flex>
                                <v-flex d-flex xs8>
                                    <v-checkbox
                                        v-model="active"
                                        color="rgb(51,82,128)"/>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions style="height:10%;">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="cancelDialog">
                        Cancel
                    </v-btn>
                    <v-btn style="color:white; background-color: rgb(51,82,128);" @click="okDialog">
                        OK
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>

import { DxDataGrid, DxColumn, DxPaging, DxScrolling} from 'devextreme-vue/data-grid';
import axios         from 'axios';
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
    data () {
      return {
          alerts:[],
          selectedAlert:{},
          dialogAlert:
          {
            Vessel:'All',
            Engine:'All',
            Component:'All',
            Subsystem:'All',
            Fault:'All',
            Status: true
          },
          alertsFields:{},
          showDialog:false,
          dialogMode:'add',
          fields:['Vessel','Engine','Component','Subsystem','Fault'],
          active:true
      }
    },
    created() {
        this.alertsFields['Vessel']=['All','Energy Triumph'];
        this.alertsFields['Engine']=['All', 'Energy Triumph ME'];
        this.alertsFields['Component']=['All', 'Cylinder 1', 'Cylinder 2', 'Cylinder 3', 'Cylinder 4', 'Cylinder 5', 'Cylinder 6', 'Turbine 1', 'Compressor 1', 'Air Cooler 1', 'Air Filter 1'];
        this.alertsFields['Subsystem']=['All', 'Servo Oil', 'Fuel Injection','Exhaust Gas','Scavenge Air', 'Piston Runnning'];
        this.alertsFields['Fault']=['All', 'Exhaust Valve/Servo Oil Rail Signal Oscillations','Exhaust Valve early opening','Exhaust Valve late opening','Exhaust Valve does not close completely','Exhaust Valve opens less than maximum stroke','Exhaust Valve closes too slow','Exhaust Valve closes too fast','Exhaust Valve early closing','Exhaust Valve late closing','Exhaust Valve seat','Exhaust Valve stem','Exhaust valve early opening & closure in cylinder','Servo Oil Pump Controller fault','Servo Oil Pump Cable fault','Servo Oil Pump Rectifier Block fault','Servo Oil Pump Safety Valve fault','VCU Solenoid fault','VCU Pilot Valve fault','Poor Injection','Fuel Injector Needle  fault','Fuel Injector Valve Plate fault','Fuel Injector Spindle fault','Fuel Injector Issue','Fuel Injector Trigger Plate fault','Fuel Injector Control Valve fault','Fuel Injector Valve Plate  fault','Fuel Oil Pump Delivery valve fault','Fuel Oil Pump Plunger fault','Defective Fuel Oil Pump','Fuel Rail Controller/Sensor Failure','Fuel Rail Valve','Fuel Rail PCV (Pressure Control Valve)','Injection System Start of injection early','Injection System Start of injection late','Injection System Fault','Injection System Early fuel Injection','Injection System Reduced fuel injected quantity','Injection System Increased fuel injected quantity','Injection System Balancing','Compression Issue','Turbine Issue/Fouling','Compressor Fouling','Air Cooler Fouling Water Side','Air Cooler Fouling Air Side','Air Filter Fouling','Gas Admission Valve Fault - GAV late opening','Knock Sensor fault','Gas Concentration sensor fault','Pilot fuel Injector fault','Scavenge Air Ports','Auxiliary Blower Air Flaps','Compressor operates near Surge region','Waste Gate partially open','Waste Gate stuck closed','Turbine lubrication','Potential Piston ring damage','Scuffing','Exhaust Valve leaking','Gas Admission Valve Fault - GAV early opening','Gas Admission Valve Fault - GAV stays open for too long','Gas Admission Valve Fault - GAV stays open for too short','Gas Admission Valve Fault - GAV does not open','Fuel Injector Fault','Fuel Injector Plate Fault','Fuel Oil Pump or Delivery Plate Fault','Fuel Rail Fault'];
      //  this.alertsFields['Status']=['Active','Inactive'];

        this.alerts = globalStore.alertFilters;
    },
    mounted() {
    },
    methods: {
        setSelected({ selectedRowsData }) {
            const data = selectedRowsData[0];

            this.selectedAlert = data;
        },
        addNew()
        {
            this.dialogAlert =  {
                Vessel:'All',
                Engine:'All',
                Component:'All',
                Subsystem:'All',
                Fault:'All',
                Status:true
            };

            this.active= true;

            this.dialogMode ='add';
            this.showDialog = true;
        },
        editSelected()
        {
            if(Object.keys(this.selectedAlert).length>0)
            {
                this.dialogAlert = Object.assign({},this.selectedAlert);

                // if (this.dialogAlert.Status=='Active') this.active = true;
                // else this.active = false;

                this.active =this.dialogAlert.Status;

                this.dialogMode ='edit';
                this.showDialog = true;
            }
        },
        delSelected()
        {
            if(Object.keys(this.selectedAlert).length>0)
            {
                var delItem = this.filterItems(this.alerts, this.selectedAlert.Id)[0];
                
                axios.delete(API_URL_REMOTE+'/rule/'+this.selectedAlert.Id);

                this.alerts.splice(this.alerts.indexOf(delItem),1);

                this.selectedAlert = {};

            }
        },
        filterItems(arr, id) {
            return arr.filter(function(el) {
                return el.Id == id;
            })
        },
        cancelDialog() {
            this.showDialog = false;
        },
        okDialog() {

            if (this.dialogMode == 'add')
            {
                var newAlert = Object.assign({},this.dialogAlert);

                newAlert.Id = this.alerts.map(function (item) {
                    return item.Id;
                }).reduce(function(a, b) {
                    return Math.max(a, b);
                }) + 1;

                this.alerts.push(newAlert);

                axios.post(API_URL_REMOTE+'/rule/new', newAlert ).then(response => {
                    //console.log(response);
                });
            }
            else
            {
               // axios.put(API_URL_REMOTE+'/rule/3/edit',  );

                var editAlert = this.filterItems(this.alerts, this.dialogAlert.Id)[0] ;

                this.alerts[this.alerts.indexOf(editAlert)] = Object.assign({},this.dialogAlert);

                this.selectedAlert = Object.assign({},this.dialogAlert);

                axios.post(API_URL_REMOTE+'/rule/'+this.dialogAlert.Id+'/edit', this.dialogAlert ).then(response => {
                   // console.log(response);
                });

                this.$refs['alTable'].instance.refresh();
            }
            this.showDialog = false;
        }
    },
    watch:
    {
        active:function()
        {

            this.dialogAlert['Status'] = this.active;
            // if (this.active) this.dialogAlert['Status'] = 'Active';
            // else this.dialogAlert['Status'] = 'Inactive';
        }
    }

  }

</script>

<style scoped>

#alertTable{
  font-size: 16px;
  font-family:'Roboto', 'sans seriff';
  height:100% !important;
}

</style>
