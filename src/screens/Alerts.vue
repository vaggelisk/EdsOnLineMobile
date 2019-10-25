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
            <dx-paging :page-size="10"/>
        </dx-data-grid>   
      </v-layout>
      <v-layout row style="max-height:50px;padding-left:20px;">
        <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="dismissSelected()">
          Dismiss Selected
        </v-btn>
        <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="dismissAll()">
          Dismiss All
        </v-btn>
        <v-spacer/>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>

  import { DxDataGrid, DxColumn, DxPaging, DxScrolling} from 'devextreme-vue/data-grid';

  import {globalStore} from "../main.js"

  export default {
    name: "Alerts",
    components: {
        DxDataGrid,
        DxColumn,
        DxPaging,
        DxScrolling
    },
    data () {
      return {
        selectedAlert:{}
      }
    },
    computed:
    {
     alerts: function () { return globalStore.alerts; },
    },
    created() {     
    },
    mounted() {
    },
    methods: {
      setSelected({ selectedRowsData }) {
        const data = selectedRowsData[0];

        this.selectedAlert = data;
      },
      dismissAll()
      {
        globalStore.alerts = [];
      },
      dismissSelected()
      {
        if (globalStore.alerts.indexOf(this.selectedAlert)>=0)
        {
          globalStore.alerts.splice(globalStore.alerts.indexOf(this.selectedAlert),1);
          this.selectedAlert = {};
        }
      }

    },
    watch:
    {
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
