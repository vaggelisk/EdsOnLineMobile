<template>
    <v-card flat fill-height style="width:400px;background-color:rgb(244,244,244);">
        <v-card-title class="title" style="color:rgb(51,82,128);height:55px;">Alerts</v-card-title>
        <v-card-text style="overflow:auto;padding:8px;max-height:400px;">  
            <v-container fluid fill-height grid-list-md style="padding:5px;">
                <v-layout fill-height column>
                    <v-flex v-for="item in alerts" :key="item">
                        <v-card flat class="hoverCard" fill-height       
                            style="background-color:rgb(219,219,219);">
                            <v-container fluid grid-list-md style="padding:5px;height:100%;">
                                <v-layout row fill-height>
                                    <v-flex d-flex md4>
                                        <v-layout column fill-height>
                                            <v-flex d-flex v-for="param in parameters" :key="param" style="padding-left:10px;">
                                                {{param}} :
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex d-flex md5> 
                                        <v-layout column fill-height>
                                            <v-flex d-flex v-for="param in parameters" :key="param">
                                                <div v-if="param=='Fault'" class="hoverTitle" v-on:click="select(item)" style="width:100%;height:100%;">{{item[param]}}</div>
                                                <div v-else style="width:100%;height:100%;">{{item[param]}}</div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex d-flex md3>
                                        {{item.Date.slice(0,10)}}<br>{{item.Date.slice(11,19)}}
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>                           
                    </v-flex>                
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions style="height:70px;padding:8px;">
            <v-layout row style="width:100%;height:100%;">
                <v-flex d-flex md4>                    
                    <v-btn flat @click="goToAlerts()" style="width:100%;height:100%;">
                        Go to Alerts
                    </v-btn>
                </v-flex>                
                <v-flex d-flex md4>            
                    <v-btn flat style="width:100%;height:100%;">
                        Dismiss Selected
                    </v-btn>
                </v-flex>                
                <v-flex d-flex md4>                        
                    <v-btn flat @click="dismissAll()" style="width:100%;height:100%;">
                        Dismiss All
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card-actions>
    </v-card>
</template>

<script>
  
  import {globalStore} from "../main.js"

  export default {
    name: "AlertMenu",
    components: {
    },
    data () {
      return {
          parameters:['Vessel','Component', 'Subsystem', 'Fault']          
      }
    },
    created() {     
    },
    computed: {    
      alerts: function() {return globalStore.alerts}
    },
    mounted() {
    },
    methods: {
        goToAlerts()
        {
            this.$router.push( { path:  'alerts' } );
        },
        dismissAll()
        {
            globalStore.alerts = [];
        },
        select(item)
        {
           // console.log('selected item '+item.Id);
            globalStore.selectedVessel = item.Vessel;
            this.$router.push( { name:  'Engine Faults' , params: { id: item.Id } });
        }
    },
    watch:
    {
     
    }

  }

</script>

<style scoped>
.hoverTitle
{
    color:rgb(95,158,239);
}
.hoverTitle:hover
{
    color:rgb(51,82,128);
}
</style>

