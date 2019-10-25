<template>
  <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;width:100%;height:100%;background-color:white;">
    <v-layout column fill-height>        
        <dx-data-grid 
            id="rawTable"
            ref='sigTable'
            :data-source="signals"
            :show-column-lines="true"
            :show-row-lines="true"
            :show-borders="false"
            :word-wrap-enabled="true"
            :row-alternation-enabled="true"
            :column-auto-width="true"
            :customizeColumns="customColumns"
            @cellPrepared="customCell">
            <dx-paging :page-size="12"/>
        </dx-data-grid>   

    </v-layout>
   </v-container>
</template>

<script>

import { DxDataGrid, DxColumn, DxPaging, DxScrolling} from 'devextreme-vue/data-grid';

import {globalStore} from "../main.js"

export default {
  name: "EngineRawTable",
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxScrolling
  },
  props:
  {
   signalFields:Array   
  },
  data() {
    return {
        signals:[],
        dialog: false,
        gridShow:false
   };
  },
 computed: {
    dataLoaded: function () { return globalStore.type; },
  },
  created()
  {
    this.setData();
  },
  mounted()
  {
   
  },
  methods:
  {
    customColumns(columns)
    {
        for (let i=1;i<columns.length;i++)
        {
            if (Object.keys(globalStore.mapping).includes(this.signalFields[i-1]))
                columns[i].caption=globalStore.mapping[this.signalFields[i-1].replace('1','')] +" ["+globalStore.units[this.signalFields[i-1].replace('1','')]+"]";
            else
            {
                let param = this.signalFields[i-1].substring(0,this.signalFields[i-1].length-1);

                columns[i].caption= globalStore.mapping[param]+" "+this.signalFields[i-1].substring(this.signalFields[i-1].length-1)
                +" ["+globalStore.units[param]+"]";
            }
        }
    },
    setData()
    {
        this.gridShow = false;

        let timeStamps = Object.keys(globalStore.signals);

        let useLoad = false;
        
        let mcr = globalStore.loadDiagram['otVal1'];

        if (globalStore.signals[timeStamps[timeStamps.length-1]]['ME_Power_perc']==-1000)
          useLoad = true;
      
        if (timeStamps.indexOf('average')>-1)
          timeStamps.splice(timeStamps.indexOf('average'),1);

        this.signals=[];

        for (let i=0;i<timeStamps.length;i++)
        {
            let item= {timeStamp:timeStamps[i]};

            for (let s=0;s<this.signalFields.length;s++)
            {
                if (globalStore.signals[timeStamps[i]][this.signalFields[s]]!=-1000)
                    item[this.signalFields[s]]= Number(globalStore.signals[timeStamps[i]][this.signalFields[s]]).toFixed(2);
                else if((this.signalFields[s]=='ME_Power_perc')&&(useLoad)&&(globalStore.signals[timeStamps[i]]['load']!=-1000))
                     item[this.signalFields[s]]= Number(globalStore.signals[timeStamps[i]]['load']*100).toFixed(2);
                else if((this.signalFields[s]=='ME_Power_kW')&&(useLoad)&&(globalStore.signals[timeStamps[i]]['load']!=-1000))
                    item[this.signalFields[s]]= Number(globalStore.signals[timeStamps[i]]['load']*mcr).toFixed(2);
                else item[this.signalFields[s]]='N/A';
            }
            this.signals.push(item);
            //this.signals.push(globalStore.signals[timeStamps[i]]);
        }

           
        this.gridShow = true;   

    }

  },

  watch: {
    dataLoaded : function()
    {        
        setTimeout(() => {
            this.setData();}); 
    },
    signalFields : function()
    {        
        setTimeout(() => {
            this.setData();}); 
    }
  }


};
</script>

<style scoped>

#rawTable{
  font-size: 16px;
  font-family:'Roboto', 'sans seriff';
  height:100% !important;
}
</style>
<style>

.dx-datagrid-headers .dx-header-row
{
    background-color:rgb(51,82,128);
    color:white;
}

</style>

