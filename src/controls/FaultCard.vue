<template>
    <v-card class="hoverCard" fill-height :style="'height:200px;margin:5px;background-color:'+color+';'" 
        v-on:click="select(currentFault)"        
        v-on:mouseleave="mouseLeave"
        v-on:mouseover ="color='rgb(219,219,219)'">
        <v-container fluid grid-list-md style="padding:5px;height:100%;">
            <v-layout row fill-height>
                <v-flex d-flex md9>
                    <v-layout column>
                        <v-flex d-flex md3 style="align-items:center;">
                            <img style="max-height:25px;max-width:25px;" :src="img" alt=""> 
                            <div style="display:flex;align-items:center;margin-left:5px;font-size:22px;"> {{ currentFault.fault }}</div>
                        </v-flex>
                        <v-flex d-flex md3>
                            <div style="margin-left:30px;color:rgb(115,115,115);">Fault</div>
                        </v-flex>
                        <v-flex d-flex md4>
                            <v-layout row>
                                <v-flex d-flex md4 style="margin-left:30px;font-size:30px;align-items:flex-end;">
                                    {{currentFault.events.length}}
                                </v-flex>
                                <v-flex d-flex md8 style="font-size:16px;align-items:flex-end;">
                                     {{ currentFault.startDate | dateFormatter   }}
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex d-flex md2>
                            <v-layout row>
                                <v-flex d-flex md4 style="margin-left:30px;color:rgb(115,115,115);">
                                    Occurences
                                </v-flex>
                                <v-flex d-flex md8 style="color:rgb(115,115,115);">
                                    First appeared
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex d-flex md3>
                    <v-layout column>
                        <v-flex d-flex md6>
                            <!-- <CircGauge v-if="currentFault.index>0"
                                v-bind:value="kpi[currentFault.element][currentFault.index-1][0]*100"
                                v-bind:labelText="currentFault.index.toString()"
                                v-bind:color="kpi[currentFault.element][currentFault.index-1][1]"
                                v-bind:fontSize="20"/>
                            <CircGauge v-else
                                v-bind:value="kpi[currentFault.element][0]*100"
                                labelText="-"
                                v-bind:color="kpi[currentFault.element][1]"
                                v-bind:fontSize="20" />   -->
                        </v-flex>
                        
                        <v-flex d-flex md4 style="font-size:16px;align-items:flex-end;">
                            {{ currentFault.component }} 
                        </v-flex>
                        <v-flex d-flex md2 style="color:rgb(115,115,115);">
                            Subsystem
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>                           

</template>

<script>
   import CircGauge                from  "./CircGauge";
  import { DxCircularGauge,
    DxSize,
    DxValueIndicator,
    DxGeometry,
    DxScale,
    DxRangeContainer,
    DxRange,
    DxTitle,
    DxLabel
  } from "devextreme-vue/circular-gauge";

    export default {
      name: "FaultCard",
      components: {
        DxCircularGauge,
        DxSize,
        DxValueIndicator,
        DxGeometry,
        DxScale,
        DxRangeContainer,
        DxRange,
        DxTitle,
        DxLabel,
        CircGauge
      },
      props:  {
        currentFault: Object,
        kpi: Object,
        selFaultId:Number
      },
      data() {
        return {
          red:require('../assets/colordotsred.png'),
          orange:require('../assets/colordotsorange.png'),
          color:'rgb(255,255,255)'
        }
      },
      mounted() 
      {
        if (this.selFaultId==this.currentFault.Id) this.color = 'rgb(219,219,219)';
        else this.color= 'rgb(255,255,255)';

      },
      computed: {
        img: function () {
                if (this.currentFault.color==20) return this.red;
                else return this.orange;
        },        
      },
      filters: {
        dateFormatter: function (value) {
          if (!value) return '';
          let d = new Date(value);
          return d.toLocaleString();
        }
      },
      methods:
      {
        select:function(fault)
        {
            this.$emit('faultChange',fault.Id);
        }, 
        mouseLeave:function()
        {
            if (this.selFaultId==this.currentFault.Id) this.color = 'rgb(219,219,219)';
            else this.color= 'rgb(255,255,255)';
        }
      },
      watch:
      {
          selFaultId()
          {
             // console.log('change');
              if (this.selFaultId==this.currentFault.Id) this.color = 'rgb(219,219,219)';
              else this.color= 'rgb(255,255,255)';
          }

      }
    }
</script>

<style scoped>

.hoverCard:hover
{
    background-color:rgb(219,219,219);
}

</style>
