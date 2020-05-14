<template>
  <v-container fluid grid-list-md fill-height style="padding:0px 10px 5px 10px;width:100%;">
    <v-layout row>
      <v-flex d-flex md4>
          <v-card >
            <v-card-title  primary class="title" style="height:5%;">Fault list</v-card-title>
            <v-card-actions fill-height style="height:95%;">
              <v-layout v-if="currentFaults.length>0" column fill-height>    
                 <v-flex d-flex md1>
                    <v-layout row>
                      <v-flex d-flex md6>
                        <v-menu
                          v-model="startMenu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="startDate"
                              label="From"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="startDate" @input="startMenu = false"></v-date-picker>
                        </v-menu>
                      </v-flex>                      
                      <v-flex d-flex md6>
                        <v-menu
                          v-model="endMenu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="endDate"
                              label="To"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="endDate" @input="endMenu = false"></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-flex>       
                  <v-flex d-flex md1>
                     <v-autocomplete
                        v-model="filter['Fault']"
                        :items="allFaults"
                        placeholder='Fault'
                        v-on:change="filterFaults()"/>
                  </v-flex> 
                  <v-flex d-flex md1>
                    <v-layout row>
                      <v-flex d-flex md6>
                        <v-autocomplete
                          v-model="filter['Component']"
                          :items="allComponents"
                          placeholder='Component'
                          v-on:change="filterFaults()"/>
                      </v-flex>                      
                      <v-flex d-flex md6>
                        <v-autocomplete
                          v-model="filter['Subsystem']"
                          :items="allSubsystems"
                          placeholder='Subsystem'
                          v-on:change="filterFaults()"/>
                      </v-flex>
                    </v-layout>
                  </v-flex> 
                  <v-flex d-flex md9 style="overflow:auto;">                                
                    <!-- <div v-for="fault in visibleFaults" :key="fault">
                      {{fault}}
                    </div> -->
                  </v-flex>     
              </v-layout>
              <div v-else class="title"  style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;color:rgb(219,219,219);">No Faults Detected</div>         
            </v-card-actions> 
          </v-card>
      </v-flex>
      <v-flex d-flex md8>
        <v-tabs v-model="active" slider-color="rgb(51,82,128)" style="height:100%;width:100%;">
          <v-tab v-for="title in tabTitles" :key="title" ripple active-class='activeTab' style="text-transform:none;color:rgb(192,192,192);">
            <span>{{title}}</span>
          </v-tab>
          <v-tab-item class="tabItem">
            <EngineFaultsData
              v-bind:fault="selFault"
              v-bind:active="tabActive[0]"/>
          </v-tab-item>
          <v-tab-item class="tabItem">
            <EngineFaultsDetails
              v-bind:fault="selFault"
              v-bind:active="tabActive[1]"/>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout> 
  </v-container>
</template>

<script>

  import EngineFaultsData     from "./EngineFaultsData"
  import EngineFaultsDetails  from "./EngineFaultsDetails"

  import FaultCard from '../controls/FaultCard'

  
  import {globalStore} from "../main.js"

  export default {
    name: 'FaultsHistory',
    components: {
      EngineFaultsData ,  
      EngineFaultsDetails,
      FaultCard
    },
    data () {
      return {
          active: parseInt( this.$route.query.tab ),
          tabTitles: [
            'Fault Data','Details'
          ],
          currentFaults:[
            {
              Id:1,
              Vessel:'Energy Triumph',
              Engine:'Energy Triumph ME',
              Component:'Cylinder 4',
              Subsystem:'Servo Oil',
              Fault:'Fault 5',
              Date:'2019/03/05'
            },
            {
              Id:2,
              Vessel:'Energy Triumph',
              Engine:'Energy Triumph ME',
              Component:'Cylinder 2',
              Subsystem:'Fuel Injection',
              Fault:'Fault 3',
              Date:'2019/01/23'
            },
            {
              Id:3,
              Vessel:'Energy Triumph',
              Engine:'Energy Triumph ME',
              Component:'Cylinder 6',
              Subsystem:'Exhaust Gas',
              Fault:'Fault 1',
              Date:'2019/01/12'
            }
          ],
          visibleFaults:[],
          allFaults:['Exhaust Valve/Servo Oil Rail Signal Oscillations','Exhaust Valve early opening','Exhaust Valve late opening','Exhaust Valve does not close completely','Exhaust Valve opens less than maximum stroke','Exhaust Valve closes too slow','Exhaust Valve closes too fast','Exhaust Valve early closing','Exhaust Valve late closing','Exhaust Valve seat','Exhaust Valve stem','Exhaust valve early opening & closure in cylinder','Servo Oil Pump Controller fault','Servo Oil Pump Cable fault','Servo Oil Pump Rectifier Block fault','Servo Oil Pump Safety Valve fault','VCU Solenoid fault','VCU Pilot Valve fault','Poor Injection','Fuel Injector Needle  fault','Fuel Injector Valve Plate fault','Fuel Injector Spindle fault','Fuel Injector Issue','Fuel Injector Trigger Plate fault','Fuel Injector Control Valve fault','Fuel Injector Valve Plate  fault','Fuel Oil Pump Delivery valve fault','Fuel Oil Pump Plunger fault','Defective Fuel Oil Pump','Fuel Rail Controller/Sensor Failure','Fuel Rail Valve','Fuel Rail PCV (Pressure Control Valve)','Injection System Start of injection early','Injection System Start of injection late','Injection System Fault','Injection System Early fuel Injection','Injection System Reduced fuel injected quantity','Injection System Increased fuel injected quantity','Injection System Balancing','Compression Issue','Turbine Issue/Fouling','Compressor Fouling','Air Cooler Fouling Water Side','Air Cooler Fouling Air Side','Air Filter Fouling','Gas Admission Valve Fault - GAV late opening','Knock Sensor fault','Gas Concentration sensor fault','Pilot fuel Injector fault','Scavenge Air Ports','Auxiliary Blower Air Flaps','Compressor operates near Surge region','Waste Gate partially open','Waste Gate stuck closed','Turbine lubrication','Potential Piston ring damage','Scuffing','Exhaust Valve leaking','Gas Admission Valve Fault - GAV early opening','Gas Admission Valve Fault - GAV stays open for too long','Gas Admission Valve Fault - GAV stays open for too short','Gas Admission Valve Fault - GAV does not open','Fuel Injector Fault','Fuel Injector Plate Fault','Fuel Oil Pump or Delivery Plate Fault','Fuel Rail Fault'],
          allComponents:['Cylinder 1', 'Cylinder 2', 'Cylinder 3', 'Cylinder 4', 'Cylinder 5', 'Cylinder 6', 'Turbine 1', 'Compressor 1', 'Air Cooler 1', 'Air Filter 1'],
          allSubsystems:['Servo Oil', 'Fuel Injection','Exhaust Gas','Scavenge Air', 'Piston Runnning'],
          kpi:{},
          selectedFaultId:-1,        
          tabActive:[false, false],
          filter:
          {
            Component:'',
            Subsystem:'',
            Fault:'',
            StartDate:'',
            EndDate:''  
          },
          startDate: '',
          startMenu: false,
          endDate: '',
          endMenu: false
      }
    },
    created() {     
      
      //this.tabActive[ parseInt( this.$route.query.tab )] = true;
      this.visibleFaults = this.currentFaults;

    },
    mounted() {

      //this.selectedFaultId = this.currentFaults[0].Id;
    },
    methods:
    {
      filterFaults: function()
      {
        var temp = this.currentFaults;

        let component = this.filter['Component'];

        if (this.filter['Component']!='') temp = temp.filter(function(item,component) {
          return item.Component == component;
        }); 

        this.visibleFaults = temp;
        
      }
    },
    computed:
    {
    },
    watch:
    {
    }

  }
</script>

<style scoped>

.tabItem
{
  height: calc(100vh - 157px)
}


</style>