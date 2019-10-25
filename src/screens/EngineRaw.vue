<template>
  <!-- <v-tabs v-model="active" style="height:100%;width:100%;">
    <v-tab v-for="title in tabTitles" :key="title" ripple style="text-transform:none;">
      <span >{{title}}</span>
    </v-tab>
    <v-tab-item class="tabItem"><EngineRawTable/></v-tab-item>
    <v-tab-item class="tabItem"><EngineRawGraphs/></v-tab-item>
  </v-tabs> -->
  <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;height:100%;width:100%;background-color:white;"> 
    <v-layout column fill-height>
      <div style="width:100%;height:48px;display:flex;align-items:center;">
        <v-btn v-if="screen=='table'" flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="openDialog">
          Select Columns
        </v-btn>
        <v-btn v-if="screen=='table'" flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="downloadCSV">
          Download
        </v-btn>
        <v-spacer/>
        <v-radio-group v-model="screen" row style="display:flex;justify-content:flex-end;align-items:center;">
          <v-radio flat value="table" label="Table of measurements" color="rgb(51,82,128)"/>
          <v-radio flat value="graphs" label="Graphs" color="rgb(51,82,128)"/>
        </v-radio-group>
      </div>
      <EngineRawTable class="tabItem" v-if="screen=='table'" v-bind:signalFields="signalFields"/>
      <EngineRawGraphs class="tabItem" v-if="screen=='graphs'"
        v-bind:parameters1="signalFields.slice(0,12)"
        v-bind:parameters2="signalFields.slice(12,24)"/>
      <v-dialog v-model="dialog" width="600" height="800">
        <v-card style="width:600px;height:800px;">
          <v-card-title primary class="title" style="height:5%;">
              Select Column
          </v-card-title>
          <v-card-text  style="height:90%;overflow:auto;">
            <v-layout column fill-height>
              <v-flex d-flex v-for="(s, index) in signalFields" v-bind:key="index">
                <v-layout row>
                  <v-flex v-if="index<12" d-flex xs4 style="align-items:center;">
                    Column {{index + 1}} (Upper chart) : 
                  </v-flex>
                  <v-flex v-else d-flex xs4 style="align-items:center;">
                    Column {{index + 1}} (Lower chart) : 
                  </v-flex>
                  <v-flex d-flex xs8>
                    <v-autocomplete
                        v-model="selected[index]"
                        :items="signalFieldsOverall"
                        :value="s"
                        item-text="title"
                        item-value="param"
                        v-on:change="theListChanged( index, s , selected[index])"/>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>                    
          </v-card-text>
          <v-card-actions style="height:5%;">
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
  import EngineRawTable         from "./EngineRawTable"
  import EngineRawGraphs  from "./EngineRawGraphs"
  
  import {globalStore} from "../main.js"

  export default {
    name: "EngineRaw",
    components: {
      EngineRawTable,
      EngineRawGraphs
    },
    props:{
    },
    data () {
      return {
        tabTitles: ['Table of measurements','Graphs'],
        screen:'table',        
        dialog: false,
        signalFields:  ['STW','SOG','ME_Power_kW','ensp','fcon','fTemp','tscav','pscav','fRailPres','soPresDispl','pcomp','pmax',
                'pmaxPcomp', 'ME_Power_perc','tcspeed','tTurbIn','tTurbO1','soi1','evcAngleSet1','evo1','vit_a','vit_b','vit_c','vit_d'],
        selected:  ['STW','SOG','ME_Power_kW','ensp','fcon','fTemp','tscav','pscav','fRailPres','soPresDispl','pcomp','pmax',
                'pmaxPcomp', 'ME_Power_perc','tcspeed','tTurbIn','tTurbO1','soi1','evcAngleSet1','evo1','vit_a','vit_b','vit_c','vit_d'],
        // signalFields:  ['ensp','ME_Power_perc','ME_Power_kW','fcon','STW','SOG','soPresDispl','fRailPres','pscav','tscav','pcomp','pmax','tcspeed1','tTurbIn1','tTurbO1',
        //   'pcomp1','pcomp2','pcomp3','pcomp4','pcomp5','pcomp6','pmax1','pmax2','pmax3','pmax4'],
        // selected:['ensp','ME_Power_perc','ME_Power_kW','fcon','STW','SOG','soPresDispl','fRailPres','pscav','tscav','pcomp','pmax','tcspeed1','tTurbIn1','tTurbO1',
        //   'pcomp1','pcomp2','pcomp3','pcomp4','pcomp5','pcomp6','pmax1','pmax2','pmax3','pmax4'],  
        signalFieldsOverall: [],
        signalFieldsForCancel: []
      }
    },
    created()
    {
      let allSigs = Object.keys(globalStore.signals[Object.keys(globalStore.signals)[0]]);
      for (let i=0;i<allSigs.length;i++)
      {
        if (Object.keys(globalStore.mapping).includes(allSigs[i]))
        {
          this.signalFieldsOverall.push({
              param:allSigs[i],
              title:globalStore.mapping[allSigs[i]]
          });
        }
        else
        {
          let param = allSigs[i].substring(0,allSigs[i].length-1);

          this.signalFieldsOverall.push({
              param:allSigs[i],
              title:globalStore.mapping[param]+" "+allSigs[i].substring(allSigs[i].length-1)
          });
        }
          
      }

    },
    mounted() {
    },
    methods: {
      openDialog() {
        
        this.signalFieldsForCancel = this.signalFields.slice(0);
        this.dialog=true;
      },
      theListChanged(a, b, c) {
        this.signalFields.splice(a, 1, c);
      },
      cancelDialog() {
        this.signalFields= this.signalFieldsForCancel.slice(0);
        
        this.dialog = false;
      },
      okDialog() {
        this.dialog = false;
      },
      downloadCSV()
      {
        // const rows = [
        //     ["name1", "city1", "some other info"],
        //     ["name2", "city2", "more info"]
        // ];

        let csvContent = "data:text/csv;charset=utf-8,";

        // rows.forEach(function(rowArray) {
        //     let row = rowArray.join(",");
        //     csvContent += row + "\r\n";
        // });

        let columns = [];

        columns.push('Timestamp');

        for (let i=0;i<this.signalFields.length;i++)
        {
            if (Object.keys(globalStore.mapping).includes(this.signalFields[i]))
                columns.push(globalStore.mapping[this.signalFields[i].replace('1','')]);
            else
            {
                let param = this.signalFields[i].substring(0,this.signalFields[i].length-1);

                columns.push(globalStore.mapping[param]+" "+this.signalFields[i].substring(this.signalFields[i].length-1));
            }
        }

        csvContent += columns.join(",") + "\r\n";

        let timeStamps = Object.keys(globalStore.signals);
      
        if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);

        this.signals=[];

        for (let i=0;i<timeStamps.length;i++)
        {
            let item= [];
            
            item.push(timeStamps[i]);

            for (let s=0;s<this.signalFields.length;s++)
            {
                if (globalStore.signals[timeStamps[i]][this.signalFields[s]]!=-1000)
                    item.push(Number(globalStore.signals[timeStamps[i]][this.signalFields[s]]).toFixed(2));
                else item.push('N/A');
            }

            csvContent += item.join(",") + "\r\n";
        }

        var dateString ="";

        if ((globalStore.type=='today') || (globalStore.type=='last')) dateString = timeStamps[timeStamps.length-1];
        else dateString = new Date(timeStamps[timeStamps.length-2]).toISOString().slice(0, 10);

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "WiDE_"+globalStore.selectedVessel+"_"+dateString+".csv");
        document.body.appendChild(link); // Required for FF

        link.click();

      }
    },
    watch:
    {
    }

  }

</script>

<style scoped>

.tabItem
{
  height: calc(100vh - 96px);
}

</style>
