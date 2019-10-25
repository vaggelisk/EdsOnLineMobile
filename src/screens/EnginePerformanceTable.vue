<template>
  <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;width:100%;height:100%;background-color:white;">
    <v-layout row style="height:100%;width:100%">   
      <v-flex d-flex md6>
        <dx-data-grid 
          class="perfTable"
          :data-source="signalsLeft"
          :show-column-lines="true"
          :show-row-lines="true"
          :show-borders="false"
          :word-wrap-enabled="true"
          :row-alternation-enabled="true"
          :column-auto-width="true">
          <dx-scrolling mode="virtual"/>
        </dx-data-grid> 
      </v-flex>
      <v-flex d-flex md6>
        <dx-data-grid 
          class="perfTable"
          :data-source="signalsRight"
          :show-column-lines="true"
          :show-row-lines="true"
          :show-borders="false"
          :word-wrap-enabled="true"
          :row-alternation-enabled="true"
          :column-auto-width="true">
          <dx-scrolling mode="virtual"/>
        </dx-data-grid> 
      </v-flex>
    </v-layout>     
  </v-container>        
</template>

<script>

import { DxDataGrid, DxColumn, DxPaging, DxScrolling} from 'devextreme-vue/data-grid';

import {globalStore} from "../main.js"

  export default {
    name: "EnginePerformanceTable",
    components: {
      DxDataGrid,
      DxColumn,
      DxPaging,
      DxScrolling
    },
    data () {
      return {
        fields:['load','ensp','shaftP','fCmd','vol_inj','tors','vit_a','vit_b','vit_c','vit_d','soi_com','off_inj','fqs','pscav',
        //'pscav_rel',
        'pscav_cmcr','soPresDispl','soPresSetpoint','fRailPres','fRailPresSet','vitOn','analWasteGatePos','activeInjNozzles','tcspeed','tcPbroilIn1','bsfc','ftemp'],
        avgFields:['EC_Inj_DurationCyl','evo','evcAngleSet','JCWOut','sloc'],
        cylFields:['pcomp','pmax','tExhC'],
        tcFields:['tTurbIn','tTurbO','tcPbroilIn','tcTbroilIn', 'tcTbroilO','cwAcIn', 'cwAcOu'],
        meanFields:['pAmb','tbli','tscav'],
        signalsLeft:[],
        signalsRight:[],
        cylCount:6,
        tcCount:1
      }
    },
    computed: {
        dataLoaded: function () { return globalStore.type; },
      },
    created() {     
      this.setData();
    },
    mounted() {
    },
    methods: {
      setData()
      {
        
        if (globalStore.selectedVessel!='Energy Triumph') this.tcCount =2;

        this.signalsLeft=[];
        this.signalsRight=[];

        let timestamps = Object.keys(globalStore.signals);
        let last = timestamps[timestamps.length-1];

        let available = Object.keys(globalStore.signals[last]);

        let pAmb;

        for (let i=0;i<this.fields.length;i++)
        {
          if (available.includes(this.fields[i]))
          {
            let val; 
          
            if (globalStore.signals[last][this.fields[i]]!=-1000)
              val = globalStore.signals[last][this.fields[i]].toFixed(2) ;
            else if (this.fields[i]=='shaftP')
            {
              let mcr = globalStore.loadDiagram['otVal1'];

              if (globalStore.signals[last]['ME_Power_kW']!=-1000) val =  globalStore.signals[last]['ME_Power_kW'].toFixed(2) ;
              else if (globalStore.signals[last]['load']!=-1000) val =  (globalStore.signals[last]['load']*mcr).toFixed(2) ;
              else val='N/A';                         
            } 
            else val='N/A';

            let item = 
            {
              name:globalStore.mapping[this.fields[i]],
              units:'['+globalStore.units[this.fields[i]]+']',
              value:val
            };

            if (globalStore.units[this.fields[i]]==null)
              item.units = '[-]';

            this.signalsLeft.push(item);

          }        

        }        

        let average = (array) => array.reduce((a, b) => a + b) / array.length;        

        for (let i=0;i<this.avgFields.length;i++)
        {
          let forAvg=[];

          for (let c=1;c<=this.cylCount;c++)
          {
            if ((available.includes(this.avgFields[i]+c))&&(globalStore.signals[last][this.avgFields[i]+c]!=-1000))
              forAvg.push(globalStore.signals[last][this.avgFields[i]+c]);            
          }

          let val;

          if (forAvg.length>0) val = average(forAvg).toFixed(2);
          else val= 'N/A';

          let item = 
          {
            name:globalStore.mapping[this.avgFields[i]],
            units:'['+globalStore.units[this.avgFields[i]]+']',
            value:val
          };

          if (globalStore.units[this.avgFields[i]]==null)
            item.units = '[-]';

          this.signalsLeft.push(item);
        }

        for (let i=0;i<this.cylFields.length;i++)
        {       

          for (let c=1;c<=this.cylCount;c++)
          {
            let val;

            if ((available.includes(this.cylFields[i]+c))&&(globalStore.signals[last][this.cylFields[i]+c]!=-1000))
              val = globalStore.signals[last][this.cylFields[i]+c].toFixed(2);
            else val='N/A';

             let item = 
            {
              name:globalStore.mapping[this.cylFields[i]] +' '+c,
              units:'['+globalStore.units[this.cylFields[i]]+']',
              value:val
            };

            if (globalStore.units[this.cylFields[i]]==null)
              item.units = '[-]';
            
            this.signalsRight.push(item);

          }
         
        }

        for (let i=0;i<this.tcFields.length;i++)
        {         

          for (let tc=1;tc<=this.tcCount;tc++)
          {
            let val;

            if ((available.includes(this.tcFields[i]+tc))&&(globalStore.signals[last][this.tcFields[i]+tc]!=-1000))
              val = globalStore.signals[last][this.tcFields[i]+tc].toFixed(2);
            else val='N/A';

            let item = 
            {
              name:globalStore.mapping[this.tcFields[i]] +' '+tc,
              units:'['+globalStore.units[this.tcFields[i]]+']',
              value:val
            };

            if (globalStore.units[this.tcFields[i]]==null)
              item.units = '[-]';
            

            this.signalsRight.push(item);

          }
         
        }

        for (let i=0;i<this.meanFields.length;i++)
        { 
          let forAvg=[];
          //console.log(this.meanFields[i]);
       
          for (let j=1;j<=2;j++)
          {
            if ((available.includes(this.meanFields[i]+j))&&(globalStore.signals[last][this.meanFields[i]+j]!=-1000))
              forAvg.push(globalStore.signals[last][this.meanFields[i]+j]); 
            // else val='N/A';                       
          }

          let val;

          if (forAvg.length>0)
          {
            val = average(forAvg).toFixed(2);            
            if (this.meanFields[i]=='pAmb') pAmb = average(forAvg);
          }
          else val= 'N/A';

          let item = 
          {
            name:globalStore.mapping[this.meanFields[i]],
            units:'['+globalStore.units[this.meanFields[i]]+']',
            value:val
          };

          if (globalStore.units[this.meanFields[i]]==null)
              item.units = '[-]';
            
          this.signalsRight.push(item);
         
        }

        let pCompScav = 
        {
          name:'Pcomp / pscav',
          units:'[-]',
          value:((globalStore.signals[last]['pcomp']+pAmb)/(globalStore.signals[last]['pscav']+pAmb)).toFixed(2)
        };

        
        this.signalsRight.push(pCompScav);
      }
    },
    watch: {
      dataLoaded : function()
      {        
        setTimeout(() => {
          this.setData();}); 
      }
    }

  }

</script>

<style scoped>

.perfTable{
  font-size: 16px;
  font-family:'Roboto', 'sans seriff';
  height:100% !important;
}

</style>
