<template>
  <v-container fluid grid-list-md fill-height style="padding:0px 10px 5px 10px;width:100%;">
    <v-layout row>
      <v-flex d-flex md4>
          <v-card  >
            <v-card-title  primary class="title" style="height:5%;">Fault list</v-card-title>
            <v-card-text style="height:90%;">
              <v-layout v-if="currentFaults.length>0" column fill-height style="overflow:auto;">
                <FaultCard v-for="fault in currentFaults" :key="fault" v-on:faultChange="selFaultChange"
                  v-bind:currentFault="fault"
                  v-bind:kpi="kpi"
                  v-bind:selFaultId="selectedFaultId"/>
              </v-layout>
              <div v-else class="title"  style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;color:rgb(219,219,219);">No Faults Detected</div>
            </v-card-text>
            <v-card-actions style="height:5%;">
              <v-btn style="color:white; background-color: rgb(51,82,128);" @click="showDialog=true">
                Request Remote Support
              </v-btn>
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
      <v-dialog v-model="showDialog" width="400" height="600">
        <v-card style="width:400px;height:600px;">
          <v-card-title primary class="title" style="height:10%;">
            Create A Ticket
          </v-card-title>
          <v-card-text  style="height:80%;">
            <v-layout column fill-height>
              <v-flex>
                <v-layout row>
                  <v-flex d-flex md4 style="font-size: 16px !important;
                    font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;align-items:center;">
                    Type
                  </v-flex>
                  <v-flex d-flex md8 style="font-size: 16px !important;
                    font-weight: 300; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;align-items:center;">
                    <v-select
                      :items="ticketModels['Type']"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex v-for="(field) in labels" :key="field">
                <v-layout row>
                  <v-flex d-flex md4 style="font-size: 16px !important;
                    font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;align-items:center;">
                    {{field}}
                  </v-flex>
                  <v-flex d-flex md8 style="font-size: 16px !important;
                    font-weight: 300; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;align-items:center;">
                    <v-text-field v-model="ticketModels[field]"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex style="min-height:100px;">
                <v-layout row style="width:100%;height:100%;">
                  <v-flex d-flex md4 style="font-size: 16px !important;
                    font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;">
                    Message
                  </v-flex>
                  <v-flex d-flex md8 style="font-size: 16px !important;
                    font-weight: 300; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;align-items:center;">
                    <v-textarea auto-grow outline v-model="ticketModels['Message']"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions style="height:10%;">
            <v-spacer/>
            <v-btn color="primary" flat @click="cancelDialog">
              Cancel
            </v-btn>
            <v-btn style="color:white; background-color: rgb(51,82,128);" @click="sendTicket">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>

  import EngineFaultsData     from "./EngineFaultsData"
  import EngineFaultsDetails  from "./EngineFaultsDetails"

  import FaultCard from '../controls/FaultCard'


  import {globalStore} from "../main.js"

  import axios from 'axios';

export default {
  name: 'EngineFaults',
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
        currentFaults:[],
        kpi:{},
        selectedFaultId:-1,
        tabActive:[false, false],
        showDialog:false,
        ticketModels:{},
        profileFields:['displayName','email'],
        labels:['Username', 'Email','Title']
    }
  },
  created() {

    this.tabActive[ parseInt( this.$route.query.tab )] = true;

    for (let i=0;i<this.profileFields.length;i++)
    {
      this.ticketModels[this.labels[i]]= globalStore.userProfile[this.profileFields[i]];
    }

    this.ticketModels['Type'] = ['Support'];
    this.ticketModels['Message'] = '';
    this.ticketModels['Title'] = '';
  },
  mounted() {

    this.currentFaults = globalStore.faults;
    // console.log( this.currentFaults);

    // axios.get('http://eds2.propulsionanalytics.com'+'/fault/fakeFaults').then(response => {

    //   this.currentFaults = JSON.parse(response.data).aggrEvents;

    //   // if (Object.keys(this.$route.params).includes('id')) this.selectedFaultId = this.$route.params.id;
    //   // else
    //   this.selectedFaultId = this.currentFaults[0].Id;
    //   console.log( this.currentFaults);
    //   console.log( this.selectedFaultId);

    // });
  },
  methods:
  {
    // loadFaultData:function(item)
    // {
    //   console.log(item.Id);
    // }
    selFaultChange(event)
    {
     // console.log(event);
      this.selectedFaultId=event;
    },
    sendTicket()
    {
      //console.log(this.ticketModels);
      var bodyFormData = new FormData();
      bodyFormData.set( "name", this.ticketModels['Username'] );
      bodyFormData.set( "from", 'customer@wingd.com');//this.ticketModels['Email'] );
      bodyFormData.set( "type", "1" );
      bodyFormData.set( "vessel", globalStore.selectedVessel);
      bodyFormData.set( "engine", 'W-6X72');//'X-72' );
      bodyFormData.set( "subject", this.ticketModels['Title']);
      bodyFormData.set( "reply", this.ticketModels['Message'] );
      bodyFormData.set( "component", this.selFault['subComponent'] );
      bodyFormData.set( "subsystem", this.selFault['component'] );      
      bodyFormData.set( "id", this.selFault['id'] );

      axios({
          method: 'post',
          url: 'http://wingdservice.propulsionanalytics.com'+'/en/customer/create-ticket/',
          data: bodyFormData,
          config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then(function (response) {
          //handle success
          console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });

      this.showDialog = false;
    },
    cancelDialog()
    {
      this.showDialog = false;
    }
  },
  computed:
  {
    selFault:function()
    {
      var selected = this.currentFaults.filter(function(item){
          return item.Id == this.selectedFaultId;
        }, this);

      return selected[0];
    }
  },
  watch:
  {
    active : function()
    {
      for (let i=0;i<this.tabActive.length;i++)
      {
        if (i==this.active) this.tabActive[i]=true;
        else this.tabActive[i]=false;
      }
    },
    showDialog: function()
    {
      if (this.showDialog == true)
      {
        this.ticketModels['Title'] = this.selFault.fault;
      }
    }
  }

}
</script>

<style scoped>

.tabItem
{
  height: calc(100vh - 157px)
}


</style>
