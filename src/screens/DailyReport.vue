<template>
    <div style="overflow:auto;height:100%;">
        <v-container fluid fill-height grid-list-md style="padding:5px;width:80%;">
            <v-layout fill-height column>
                <v-flex style="height:50px;">
                    <v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="createPDF()">
                        Export PDF
                    </v-btn>
                </v-flex>
                <v-flex style="min-height:400px;">
                    <v-layout row fill-height>
                        <v-flex d-flex md3>
                             <v-card flat fill-height style="height:100%;width:100%;">
                                <v-card-actions fill-height style="height:100%;padding:0px;">
                                    <v-layout column fill-height>
                                        <v-flex d-flex md6  style="padding:0px;">
                                            <Gauge
                                                v-bind:data="gaugeData['ensp']"/>
                                        </v-flex>
                                        <v-flex d-flex md6 style="padding:0px;">
                                            <Gauge
                                                v-bind:data="gaugeData['load']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                        <v-flex d-flex md3>
                            <EngineState
                                v-bind:data="engineData"/>
                        </v-flex>
                        <v-flex d-flex md6>
                            <SubsystemState
                                v-bind:data="subSystemData"/>
                        </v-flex>
                    </v-layout>
                </v-flex>
                 <v-flex style="min-height:400px;">
                    <v-layout row fill-height>
                        <v-flex d-flex md7>
                            <FaultsWidget
                                v-bind:navigation="false"/>
                        </v-flex>
                        <v-flex d-flex m5>
                            <LoadDiagram
                                v-if="active"
                                v-bind:repClass="'report'"
                                v-bind:flat="true"
                                v-bind:active="active"
                                v-bind:chartData="loadDiagram" />
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex style="min-height:1000px;">
                    <v-card flat style="height:100%;">
                        <v-card-title  style="height:5%;width:100%;padding-top:5px;padding-bottom:5px; font-size: 24px !important;
                                                        font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(51,82,128);">Engine</v-card-title>
                        <v-card-actions fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                            <v-layout fill-height column>
                                <v-flex d-flex md3>
                                    <v-layout row fill-height>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['ensp']"
                                                v-bind:title="titles['ensp']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['load']"
                                                v-bind:title="titles['load']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex d-flex md3>
                                    <v-layout row fill-height>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['shaftP']"
                                                v-bind:title="titles['shaftP']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['bsfc']"
                                                v-bind:title="titles['bsfc']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex d-flex md3>
                                    <v-layout row fill-height>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['pscav']"
                                                v-bind:title="titles['pscav']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['tscav']"
                                                v-bind:title="titles['tscav']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex d-flex md3>
                                    <v-layout row fill-height>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['soPresDispl']"
                                                v-bind:title="titles['soPresDispl']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['fRailPres']"
                                                v-bind:title="titles['fRailPres']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex v-for="n in cylCount" :key="n" style="min-height:500px;">
                    <v-card flat style="height:100%;">
                        <v-card-title  style="height:10%;width:100%;padding-top:5px;padding-bottom:5px; font-size: 24px !important;
                                                        font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(51,82,128);">Cylinder {{n}}</v-card-title>
                        <v-card-actions fill-height style="height:90%;width:100%;padding-top:0px;padding-bottom:0px;">
                            <v-layout column fill-height>
                                <v-flex d-flex md6>
                                    <v-layout row>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['pcomp'+n]"
                                                v-bind:title="titles['pcomp']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['pmax'+n]"
                                                v-bind:title="titles['pmax']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex d-flex md6>
                                    <v-layout row>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['pmaxPcomp'+n]"
                                                v-bind:title="titles['pmaxPcomp']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['tExhC'+n]"
                                                v-bind:title="titles['tExhC']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>

                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex v-for="n in tcCount" :key="n" style="min-height:500px;">
                    <v-card flat style="height:100%;">
                        <v-card-title  style="height:10%;width:100%;padding-top:5px;padding-bottom:5px; font-size: 24px !important;
                                                        font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(51,82,128);">T/C {{n}}</v-card-title>
                        <v-card-actions fill-height style="height:90%;width:100%;padding-top:0px;padding-bottom:0px;">
                            <v-layout column fill-height>
                                <v-flex d-flex md6>
                                    <v-layout row>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['tcspeed'+n]"
                                                v-bind:title="titles['tcspeed']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['tTurbIn'+n]"
                                                v-bind:title="titles['tTurbIn']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex d-flex md6>
                                    <v-layout row>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['tcTbroilIn'+n]"
                                                v-bind:title="titles['tcTbroilIn']"/>
                                        </v-flex>
                                        <v-flex d-flex md6>
                                            <TimelineChart
                                                v-bind:repClass="'report'"
                                                v-bind:active="active"
                                                v-bind:chartOptions="chartData['tcTbroilO'+n]"
                                                v-bind:title="titles['tcTbroilO']"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>


                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex v-if="showAdditional" style="min-height:1900px;">
                    <v-card flat style="height:100%;">
                        <v-card-title  style="height:3%;width:100%;padding-top:5px;padding-bottom:5px; font-size: 24px !important;
                                                        font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(51,82,128);">Data Curves ISO</v-card-title>
                        <v-card-actions fill-height style="height:97%;width:100%;padding-top:0px;padding-bottom:0px;">
                            <v-layout row style="height:100%;width:100%;">
                                <v-flex d-flex md6>
                                    <v-card style="height:100%;width:100%;">
                                        <v-card-title  primary class="title" style="height:2%;width:100%;padding-top:5px;padding-bottom:5px;">ISO - corrected curves vs. engine speed</v-card-title>
                                        <v-card-actions  fill-height style="height:98%;width:100%;padding-top:0px;padding-bottom:0px;">                                            
                                            <v-layout column style="height:100%;width:100%;">
                                                <v-flex v-for="isoParam in isoParams['ensp']" :key="isoParam" style="min-height:250px;">
                                                    <BarChart
                                                        v-if="isoData['ensp'][isoParam[0]]"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="isoData['ensp'][isoParam[0]]"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-actions>
                                    </v-card>
                                </v-flex>
                                <v-flex d-flex md6>
                                    <v-card style="height:100%;width:100%;">
                                        <v-card-title  primary class="title" style="height:2%;width:100%;padding-top:5px;padding-bottom:5px;">ISO - corrected curves vs. engine load</v-card-title>
                                        <v-card-actions  fill-height style="height:98%;width:100%;padding-top:0px;padding-bottom:0px;">
                                            <v-layout column style="height:100%;width:100%;">
                                                <v-flex v-for="isoParam in isoParams['shaftP']" :key="isoParam" style="min-height:250px;">
                                                    <BarChart
                                                        v-if="isoData['shaftP'][isoParam[0]]"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="isoData['shaftP'][isoParam[0]]"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-actions>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-actions>
                    </v-card>                            
                </v-flex>
                <v-flex v-if="showAdditional" style="min-height:1000px;">
                    <v-card flat style="height:100%;">
                        <v-card-title  style="height:5%;width:100%;padding-top:5px;padding-bottom:5px; font-size: 24px !important;
                                                        font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(51,82,128);">Tunings</v-card-title>
                        <v-card-actions fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                            <v-layout row style="height:100%;width:100%;">
                                <v-flex d-flex md4>                
                                    <v-card style="height:100%;width:100%;"> 
                                        <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">Rail Pressures</v-card-title>
                                        <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                                            <v-layout column style="height:100%;width:100%;">
                                                <v-flex d-flex md6>
                                                    <BarChart
                                                        v-if="tuningData['loadvfRailPres']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['loadvfRailPres']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                    </v-flex>
                                                <v-flex d-flex md6>
                                                    <BarChart
                                                        v-if="tuningData['loadvsoPresDispl']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['loadvsoPresDispl']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-actions> 
                                    </v-card>
                                </v-flex>
                                <v-flex d-flex md4>
                                     <v-card style="height:100%;width:100%;"> 
                                        <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">Electronic VIT</v-card-title>
                                        <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                                            <v-layout column style="height:100%;width:100%;">
                                                <v-flex d-flex md4>
                                                    <BarChart
                                                        v-if="tuningData['pscav_relvvit_a']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['pscav_relvvit_a']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                                <v-flex d-flex md4>
                                                    <BarChart
                                                        v-if="tuningData['ensp_relvvit_b']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['ensp_relvvit_b']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                                <v-flex d-flex md4>
                                                    <BarChart
                                                        v-if="tuningData['fRailPresvvit_c']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['fRailPresvvit_c']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-actions> 
                                    </v-card>
                                </v-flex>
                                <v-flex d-flex md4>
                                    <v-card> 
                                        <v-card-title  primary class="title" style="height:5%;width:100%;padding-top:5px;padding-bottom:5px;">Electronic VEC / VEO</v-card-title>
                                        <v-card-actions  fill-height style="height:95%;width:100%;padding-top:0px;padding-bottom:0px;">
                                            <v-layout column style="height:100%;width:100%;">
                                                <v-flex d-flex md4>
                                                    <BarChart
                                                        v-if="tuningData['ensp_relvvec']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['ensp_relvvec']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                                <v-flex d-flex md4>
                                                    <BarChart
                                                        v-if="tuningData['pscav_relvvec']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['pscav_relvvec']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                                <v-flex d-flex md4>
                                                    <BarChart
                                                        v-if="tuningData['ensp_relvveo']"
                                                        v-bind:active="active"
                                                        v-bind:chartOptions="tuningData['ensp_relvveo']"
                                                        v-bind:flat="true"
                                                        title=""/>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-actions>  
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex v-if="showAdditional" style="min-height:1000px;">
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
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>

import { DxDataGrid, DxColumn, DxPaging, DxScrolling} from 'devextreme-vue/data-grid';

import TimelineChart from  '../controls/TimelineChart'
import BarChart from  '../controls/BarChart'
import LoadDiagram from  '../controls/LoadDiagram'

import EngineState from '../controls/EngineState'
import SubsystemState from '../controls/SubsystemState'
import FaultsWidget from '../controls/FaultsWidget'
import Gauge from '../controls/Gauge'

import {globalStore} from "../main.js"

import axios         from 'axios';

import Highcharts from 'highcharts'
import {Chart} from 'highcharts-vue'
import More from 'highcharts/highcharts-more'

More(Highcharts)

  export default {
    name: "Daily Report",
    components: {
        TimelineChart,
        LoadDiagram,
        EngineState,
        SubsystemState,
        FaultsWidget,
        Gauge,
        BarChart,        
        DxDataGrid,
        DxColumn,
        DxPaging,
        DxScrolling
        // Highcharts
    },
    data () {
      return {
        chartData:{},
        tuningData:{},
        titles:{},
        isoData:{},
        isoParams:{
            'ensp':[["pmax_ISO","pcomp_ISO"],["tTurbIn_ISO", "tTurbO_ISO"], ["tcspeed_ISO"], ["pscav_ISO"], ["fCmd"], ["shaftP"], ["bsfc_ISO"]],
            'shaftP':[["pmax_ISO","pcomp_ISO"],["tTurbIn_ISO", "tTurbO_ISO"], ["tcspeed_ISO"], ["pscav_ISO"], ["fCmd"], ["ensp"], ["bsfc_ISO"]]},
        subSystemData:[],
        engineData:{
            cylinders:[],
            elements:[],
            engineKPI:0,
            engineColor:0
        },
        loadDiagram:{},
        gaugeData:{},
        cylCount:6,
        tcCount:1,
        active:false,fields:['load','ensp','shaftP','fCmd','vol_inj','tors','vit_a','vit_b','vit_c','vit_d','soi_com','off_inj','fqs','pscav',
        //'pscav_rel',
        'pscav_cmcr','soPresDispl','soPresSetpoint','fRailPres','fRailPresSet','vitOn','analWasteGatePos','activeInjNozzles','tcspeed','tcPbroilIn1','bsfc','ftemp'],
        avgFields:['EC_Inj_DurationCyl','evo','evcAngleSet','JCWOut','sloc'],
        cylFields:['pcomp','pmax','tExhC'],
        tcFields:['tTurbIn','tTurbO','tcPbroilIn','tcTbroilIn', 'tcTbroilO','cwAcIn', 'cwAcOu'],
        meanFields:['pAmb','tbli','tscav'],
        signalsLeft:[],
        signalsRight:[]
      }
    },
    created() {
    },
    computed: {
        dataLoaded: function () { return globalStore.type; },
        showAdditional: function () 
        {
            if (globalStore.userProfile.roles.includes('ROLE_WINGD_USER')) return true;
            else return false;}
        
        // active: function()
        // {
        //     if (this.$route.name=="Daily Report")
        //     {
        //         console.log('true');
        //         return true;
        //     }
        //     else
        //     {
        //         console.log('false');
        //          return false;}
        // }
    },
    mounted() {
        
        // if (!globalStore.userLogged)
        //     this.$router.push( { path:  'dashboard'} );


        let params=['ensp','shaftP','load','pscav','tscav','soPresDispl','fRailPres','bsfc',
        'pcomp', 'pmax','pmaxPcomp','tExhC','tcspeed', 'tTurbIn', 'tcTbroilIn', 'tcTbroilO'];

        for (let p=0;p<params.length;p++)
        {
            // for (let c=1;c<=this.cylCount;c++)
            // {
                this.$set(this.titles,params[p]/*+c*/,globalStore.mapping[params[p]]/*+' '+c*/);
            //}

        }

        setTimeout(() => {
            this.setData();}, 600);

    },
    methods: {
        setData()
        {
         
            if (globalStore.selectedVessel!='Energy Triumph') this.tcCount =2;   
            
            this.active = false;

            let timeStamps = Object.keys(globalStore.signals);

            let timestamp = timeStamps[timeStamps.length-1];

            if (timeStamps.indexOf('average')>-1)
                timeStamps.splice(timeStamps.indexOf('average'),1);

            this.$set(this.engineData, 'engineColor',globalStore.reference[timestamp]['eng_KPI_color']);

            let kpi = globalStore.reference[timestamp]['eng_KPI']*100;

            if (kpi.toFixed(1)!='100.0') this.$set(this.engineData, 'engineKPI',kpi.toFixed(1));
            else this.$set(this.engineData, 'engineKPI',kpi.toFixed(0));

            this.engineData.cylinders=[];

            for (let c=1;c<=this.cylCount;c++)
                this.engineData.cylinders.push(globalStore.reference[timestamp]['cyl'+c+'_KPI_color']);

            let names = ['Turbines','Compressors','A/F','A/C'];
            let tags = ['turb','comp','ac','af'];

            this.engineData.elements=[];

            for (let el=0;el<names.length;el++)
            {
                let sum=0;

                for (let t=1;t<=this.tcCount;t++)
                {
                    sum+=globalStore.reference[timestamp][tags[el]+t+'_KPI_color'];
                }

                this.engineData.elements.push({
                            name:names[el],
                            color:sum/this.tcCount});
            }

            names = [['Servo Oil','Exhaust Gas','Piston Running'],['Fuel Injection','Scavenge Air','Automation & Control']];
            tags = [['so_KPI_color','egs_KPI_color','pr_KPI_color'],['fi_KPI_color','sac_KPI_color','ca_KPI_color']];

            for (let col =0;col<names.length;col++)
            {
                let column = [];

                for (let sys =0;sys<names[col].length;sys++)
                {
                    column.push({
                        system:names[col][sys],
                        value:globalStore.reference[timestamp][tags[col][sys]]});
                }

                this.subSystemData.push(column);
            }

            let params=['ensp','shaftP','load','bsfc','pscav','tscav','soPresDispl','fRailPres'];
            let refs = ['','shaftP','','bsfc','pscav','tscav','soPresSetpoint','fRailPresSet'];

            for (let p=0;p<params.length;p++)
            {
                this.$set(this.chartData,params[p],{
                    credits:{enabled:false},
                    time:{
                        useUTC:false
                    },
                    chart:{
                        height:500,
                        zoomType: 'xy'
                    },
                    xAxis:{
                        type:'datetime',
                        title:
                        {
                            text:'Time',
                            align:'high'
                        },
                        labels: {
                        format: '{value:%H:%M}'
                        },
                        crosshair:true
                    },
                    yAxis:{
                        title:
                        {
                        text:'['+globalStore.units[params[p]]+']',
                        align:'high'
                        }
                    },
                    exporting:{
                        enabled : false
                    },
                    tooltip:{
                        formatter: function () {
                            return this.points.reduce(function (s, point) {
                            if (point.series.type=='line')
                            {
                                return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                            }
                            else
                            {
                                return s + '<br/>' + point.series.name + ': ' + point.point.low.toFixed(2) + ' - ' + point.point.high.toFixed(2);
                            }
                            }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
                        },
                        shared:true
                    },
                    legend:{
                        enabled:false
                    },
                    title:{
                        text:undefined
                    },
                    series: [{
                        name:'Value',
                        type:'line',
                        color:'transparent',
                        animation: false,
                        data:[],
                        marker:
                        {
                            radius:2
                        },
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    },
                    {
                        name:'Acceptable Range',
                        type:'arearange',
                        animation: false,
                        data:[],
                        marker:{
                            enabled:false
                        },
                        color:'rgb(219, 219, 219)',
                        fillOpacity: 0.6,
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    }]
                });

                for (let i=0;i<timeStamps.length;i++)
                {
                    let val,rfr ;

                    val= globalStore.signals[timeStamps[i]][params[p]];

                    if ((val==-1000)&&(params[p]=='shaftP'))
                    {
                        let mcr = globalStore.loadDiagram['otVal1'];

                        if (globalStore.signals[timeStamps[i]]['ME_Power_kW']!=-1000) val =  globalStore.signals[timeStamps[i]]['ME_Power_kW'];
                        else if (globalStore.signals[timeStamps[i]]['load']!=-1000) val =  globalStore.signals[timeStamps[i]]['load']*mcr;
                        
                    }

                    if (params[p]=='fRailPres') rfr =  globalStore.signals[timeStamps[i]][refs[p]];
                    else if ((Object.keys(globalStore.reference).includes(timeStamps[i]))&&(refs[p]!=''))
                    {
                        rfr = globalStore.reference[timeStamps[i]][refs[p]];
                    }
                    else rfr =-1000;

                    let color = 'rgb(51,82,128)';

                    let dt = new Date(timeStamps[i]);

                    if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(params[p])))
                    {
                        let minLimit = globalStore.limits[params[p]][0], maxLimit = globalStore.limits[params[p]][1];

                        if ((minLimit!=null)&&(maxLimit!=null))
                        {

                            let temp = ( (val -  rfr)/val) * 100;

                            if ((temp > minLimit) && (temp < maxLimit)) color='rgb(60, 171, 48)';
                            else color ='rgb(205, 57, 64)';

                            let min = rfr/(1 - minLimit/100);
                            let max = rfr/(1 - maxLimit/100);

                            this.chartData[params[p]].series[1].data.push({
                                x:dt,
                                low:min,
                                high:max});
                        }
                    }

                    if (val!=-1000)
                        this.chartData[params[p]].series[0].data.push({
                            x:dt,
                            y:val,
                            color:color
                        });


                    }

            }

            params=['pcomp', 'pmax','pmaxPcomp','tExhC'];
            refs =['pcomp', 'pmax','pmaxPcomp','tExhC'];

            for (let c=1;c<=this.cylCount;c++)
            {
                for (let p=0;p<params.length;p++)
                {
                    this.$set(this.chartData,params[p]+c,{
                        credits:{enabled:false},
                        time:{
                            useUTC:false
                        },
                        chart:{
                            height:500,
                            zoomType: 'xy'
                        },
                        xAxis:{
                            type:'datetime',
                            title:
                            {
                                text:'Time',
                                align:'high'
                            },
                            labels: {
                            format: '{value:%H:%M}'
                            },
                            crosshair:true
                        },
                        yAxis:{
                            title:
                            {
                            text:'['+globalStore.units[params[p]]+']',
                            align:'high'
                            }
                        },
                        exporting:{
                            enabled : false
                        },
                        tooltip:{
                            formatter: function () {
                                return this.points.reduce(function (s, point) {
                                if (point.series.type=='line')
                                {
                                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                                }
                                else
                                {
                                    return s + '<br/>' + point.series.name + ': ' + point.point.low.toFixed(2) + ' - ' + point.point.high.toFixed(2);
                                }
                                }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
                            },
                            shared:true
                        },
                        legend:{
                            enabled:false
                        },
                        title:{
                            text:undefined
                        },
                        series: [{
                            name:'Value',
                            type:'line',
                            color:'transparent',
                            animation: false,
                            data:[],
                            marker:
                            {
                                radius:2
                            },
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal:{
                                animation:false
                                },
                                inactive:{
                                opacity: 1
                                }
                            }
                        },
                        {
                            name:'Acceptable Range',
                            type:'arearange',
                            animation: false,
                            data:[],
                            marker:{
                                enabled:false
                            },
                            color:'rgb(219, 219, 219)',
                            fillOpacity: 0.6,
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal:{
                                animation:false
                                },
                                inactive:{
                                opacity: 1
                                }
                            }
                        }]
                    });

                    for (let i=0;i<timeStamps.length;i++)
                    {
                        let val,rfr ;

                        val= globalStore.signals[timeStamps[i]][params[p]+c];

                        if (Object.keys(globalStore.reference).includes(timeStamps[i]))
                            rfr = globalStore.reference[timeStamps[i]][refs[p]+c];
                        else rfr =-1000;

                        // if (params[p]=='fRailPres') rfr =  globalStore.signals[timeStamps[i]][refs[p]];
                        // else if (Object.keys(globalStore.reference).includes(timeStamps[i]))
                        // {
                        //     if (elCount[p]==0) rfr = globalStore.reference[timeStamps[i]][refs[p]];
                        //     else rfr = this.average(refs[p], elCount[p],globalStore.reference,timeStamps[i]);
                        // }

                        let color = 'rgb(51,82,128)';

                        let dt = new Date(timeStamps[i]);

                        if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(params[p])))
                        {
                            let minLimit = globalStore.limits[params[p]][0], maxLimit = globalStore.limits[params[p]][1];

                            if ((minLimit!=null)&&(maxLimit!=null))
                            {

                                let temp = ( (val -  rfr)/val) * 100;

                                if ((temp > minLimit) && (temp < maxLimit)) color='rgb(60, 171, 48)';
                                else color ='rgb(205, 57, 64)';

                                let min = rfr/(1 - minLimit/100);
                                let max = rfr/(1 - maxLimit/100);

                                this.chartData[params[p]+c].series[1].data.push({
                                    x:dt,
                                    low:min,
                                    high:max});
                            }
                        }

                        if (val!=-1000)
                            this.chartData[params[p]+c].series[0].data.push({
                                x:dt,
                                y:val,
                                color:color
                            });


                        }

                    }

            }

            params=['tcspeed', 'tTurbIn', 'tcTbroilIn', 'tcTbroilO'];
            refs =['tcspeed', 'tTurbIn', 'tcTbroilIn', 'tcTbroilO'];

            for (let c=1;c<=this.tcCount;c++)
            {
                for (let p=0;p<params.length;p++)
                {
                    this.$set(this.chartData,params[p]+c,{
                        credits:{enabled:false},
                        time:{
                            useUTC:false
                        },
                        chart:{
                            height:500,
                            zoomType: 'xy'
                        },
                        xAxis:{
                            type:'datetime',
                            title:
                            {
                                text:'Time',
                                align:'high'
                            },
                            labels: {
                            format: '{value:%H:%M}'
                            },
                            crosshair:true
                        },
                        yAxis:{
                            title:
                            {
                            text:'['+globalStore.units[params[p]]+']',
                            align:'high'
                            }
                        },
                        exporting:{
                            enabled : false
                        },
                        tooltip:{
                            formatter: function () {
                                return this.points.reduce(function (s, point) {
                                if (point.series.type=='line')
                                {
                                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                                }
                                else
                                {
                                    return s + '<br/>' + point.series.name + ': ' + point.point.low.toFixed(2) + ' - ' + point.point.high.toFixed(2);
                                }
                                }, '<b>' + new Date(this.x).toTimeString().substring(0,5) + '</b>');
                            },
                            shared:true
                        },
                        legend:{
                            enabled:false
                        },
                        title:{
                            text:undefined
                        },
                        series: [{
                            name:'Value',
                            type:'line',
                            color:'transparent',
                            animation: false,
                            data:[],
                            marker:
                            {
                                radius:2
                            },
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal:{
                                animation:false
                                },
                                inactive:{
                                opacity: 1
                                }
                            }
                        },
                        {
                            name:'Acceptable Range',
                            type:'arearange',
                            animation: false,
                            data:[],
                            marker:{
                                enabled:false
                            },
                            color:'rgb(219, 219, 219)',
                            fillOpacity: 0.6,
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal:{
                                animation:false
                                },
                                inactive:{
                                opacity: 1
                                }
                            }
                        }]
                    });

                    for (let i=0;i<timeStamps.length;i++)
                    {
                        let val,rfr ;

                        val= globalStore.signals[timeStamps[i]][params[p]+c];

                        if (Object.keys(globalStore.reference).includes(timeStamps[i]))
                            rfr = globalStore.reference[timeStamps[i]][refs[p]+c];
                        else rfr =-1000;

                        // if (params[p]=='fRailPres') rfr =  globalStore.signals[timeStamps[i]][refs[p]];
                        // else if (Object.keys(globalStore.reference).includes(timeStamps[i]))
                        // {
                        //     if (elCount[p]==0) rfr = globalStore.reference[timeStamps[i]][refs[p]];
                        //     else rfr = this.average(refs[p], elCount[p],globalStore.reference,timeStamps[i]);
                        // }

                        let color = 'rgb(51,82,128)';

                        let dt = new Date(timeStamps[i]);

                        if ((val!=-1000)&&(rfr!=-1000)&&(Object.keys(globalStore.limits).includes(params[p])))
                        {
                            let minLimit = globalStore.limits[params[p]][0], maxLimit = globalStore.limits[params[p]][1];

                            if ((minLimit!=null)&&(maxLimit!=null))
                            {

                                let temp = ( (val -  rfr)/val) * 100;

                                if ((temp > minLimit) && (temp < maxLimit)) color='rgb(60, 171, 48)';
                                else color ='rgb(205, 57, 64)';

                                let min = rfr/(1 - minLimit/100);
                                let max = rfr/(1 - maxLimit/100);

                                this.chartData[params[p]+c].series[1].data.push({
                                    x:dt,
                                    low:min,
                                    high:max});
                            }
                        }

                        if (val!=-1000)
                            this.chartData[params[p]+c].series[0].data.push({
                                x:dt,
                                y:val,
                                color:color
                            });


                        }

                    }

            }

            this.setLoadDiagram();

             this.$set(this.gaugeData, 'load', {
                value:globalStore.signals[timestamp]['ME_Power_perc'],
                rangeLimit:100,
                startValue:10,
                endValue:110,
                tickInterval:10,
                format:1,
                unit:'['+globalStore.units['ME_Power_perc']+']',
                title:globalStore.mapping['ME_Power_perc']
            });

            if ((this.gaugeData['load'].value==-1000)&&(globalStore.signals[timestamp]['load']!=-1000))
                this.gaugeData['load'].value = globalStore.signals[timestamp]['load']*100;


            this.$set(this.gaugeData, 'ensp', {
                value:globalStore.signals[timestamp]['ensp'],
                rangeLimit:75,
                startValue:15,
                endValue:90,
                tickInterval:15,
                format:1,
                unit:'[rpm]',
                title:'Engine Speed'
            });

            let xAxis = ['ensp','shaftP'];

            for (let x=0;x<xAxis.length;x++)
            {
                let keys = Object.keys(globalStore.chartData.shopTestDataTier2);

                this.$set(this.isoData,xAxis[x],{});

                for (let i=0;i<this.isoParams[xAxis[x]].length;i++)
                {
                    let show = false, opposite = false, marginLeft=15, marginRight=15 ;

                    if (i==this.isoParams[xAxis[x]].length-1) show = true;

                    if (i%2 == 1)
                    {
                        opposite = true;
                        marginLeft=80;
                    }
                    else marginRight =80;

                    this.$set(this.isoData[xAxis[x]],this.isoParams[xAxis[x]][i][0], {
                        credits:{enabled:false},
                        chart:{
                            backgroundColor:'transparent',
                            spacingLeft:marginLeft,
                            spacingRight:marginRight,                                    
                            zoomType: 'xy'},
                        legend:{
                            enabled:show,
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'},
                        title:{ text:undefined },
                        xAxis: {
                            crosshair:true,
                            title:{
                                text:globalStore.mapping[xAxis[x]] +" ["+globalStore.units[xAxis[x]]+"]",
                                align:'high'
                            },
                            visible:show
                        },
                        yAxis: {
                            labels:{ enabled:true },
                            title:{
                                text:globalStore.mapping[this.isoParams[xAxis[x]][i][0].replace('_ISO','')] +" ["+globalStore.units[this.isoParams[xAxis[x]][i][0].replace('_ISO','')]+"]",
                                align:'high'
                            }, opposite:opposite
                        },
                        exporting:{
                            enabled : false
                        },
                        series: [{
                            name:'Shoptest',
                            type:'line',
                            data:[],
                            color:'rgb(144,170,218)',
                            marker:{
                                enabled:false
                            },
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal:{
                                animation:false
                                },
                                inactive:{
                                opacity: 1
                                }
                            }
                        },
                        {
                            name:'Measured',
                            type:'scatter',
                            data:[],
                            color: 'rgb(51,82,128)',
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal:{
                                animation:false
                                },
                                inactive:{
                                opacity: 1
                                }
                            }
                        }]
                    });

                    if (this.isoParams[xAxis[x]][i].length>1)
                    {
                        this.isoData[xAxis[x]][this.isoParams[xAxis[x]][i][0]].yAxis.title.text =
                            globalStore.mapping[this.isoParams[xAxis[x]][i][0].replace('_ISO','')] +" / "
                            +globalStore.mapping[this.isoParams[xAxis[x]][i][1].replace('_ISO','')] +" ["
                            +globalStore.units[this.isoParams[xAxis[x]][i][0].replace('_ISO','')]+"]";

                        this.isoData[xAxis[x]][this.isoParams[xAxis[x]][i][0]].series.push({
                            name:'Shoptest',
                            type:'line',
                            data:[],
                            color:'rgb(144,170,218)',
                            marker:{
                                enabled:false
                            },
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal:{
                                animation:false
                                },
                                inactive:{
                                opacity: 1
                                }
                            }
                        });


                    }
                     
                    if (globalStore.units[this.isoParams[xAxis[x]][i][0].replace('_ISO','')]==null)
                        this.isoData[xAxis[x]][this.isoParams[xAxis[x]][i][0]].yAxis.title.text =
                                globalStore.mapping[this.isoParams[xAxis[x]][i][0].replace('_ISO','')] +" [-]";
                }

                let timestamps = Object.keys(globalStore.signals);
                let last = timestamps[timestamps.length-1];

               

                for (let lp=0;lp<this.isoParams[xAxis[x]].length;lp++)
                {                    
                    let xLast = globalStore.signals[last][xAxis[x]];

                    if ((xLast==-1000)&&(xAxis[x]=='shaftP'))
                    {
                        let mcr = globalStore.loadDiagram['otVal1'];

                        if (globalStore.signals[last]['ME_Power_kW']!=-1000) xLast =  globalStore.signals[last]['ME_Power_kW'];
                        else if (globalStore.signals[last]['load']!=-1000) xLast =  globalStore.signals[last]['load']*mcr;
                        
                    }

                    if ((xLast!=-1000)&&(globalStore.signals[last][this.isoParams[xAxis[x]][lp][0].replace('_ISO','')]!=-1000))
                        this.isoData[xAxis[x]][this.isoParams[xAxis[x]][lp][0]].series[1].data.push([
                           xLast, globalStore.signals[last][this.isoParams[xAxis[x]][lp][0].replace('_ISO','')]
                        ]);
                    else if ((this.isoParams[xAxis[x]][lp][0].replace('_ISO','')=='shaftP')&&(globalStore.signals[last][this.isoParams[xAxis[x]][lp][0].replace('_ISO','')]==-1000))
                    {
                        let mcr = globalStore.loadDiagram['otVal1'];
                        let yVal = -1000;

                        if (globalStore.signals[last]['ME_Power_kW']!=-1000) yVal =  globalStore.signals[last]['ME_Power_kW'];
                        else if (globalStore.signals[last]['load']!=-1000) yVal =  globalStore.signals[last]['load']*mcr;

                        if (yVal !=-1000)
                            this.isoData[xAxis[x]][this.isoParams[xAxis[x]][lp][0]].series[1].data.push([
                                xLast, yVal
                            ]);
                    }

                    if (this.isoParams[xAxis[x]][lp].length>1)
                    {
                        
                        if ((xLast!=-1000)&&(globalStore.signals[last][this.isoParams[xAxis[x]][lp][1].replace('_ISO','')]!=-1000))      
                            this.isoData[xAxis[x]][this.isoParams[xAxis[x]][lp][0]].series[1].data.push([
                                xLast, globalStore.signals[last][this.isoParams[xAxis[x]][lp][1].replace('_ISO','')]
                            ]);
                    }

                    for (let i=0;i<keys.length;i++)
                    {
                        let xValue = Number(globalStore.chartData.shopTestDataTier2[keys[i]][xAxis[x]]);
                        
                            this.isoData[xAxis[x]][this.isoParams[xAxis[x]][lp][0]].series[0].data.push([
                            xValue, Number(globalStore.chartData.shopTestDataTier2[keys[i]][this.isoParams[xAxis[x]][lp][0]])
                        ]);

                        if (this.isoParams[xAxis[x]][lp].length>1)
                        {
                            this.isoData[xAxis[x]][this.isoParams[xAxis[x]][lp][0]].series[2].data.push([
                                xValue, Number(globalStore.chartData.shopTestDataTier2[keys[i]][this.isoParams[xAxis[x]][lp][1]])
                            ]);
                           
                        }
                    }

                }

            }

            let keys = Object.keys(globalStore.chartData['controlLawsTier2']);
            
            let timestamps = Object.keys(globalStore.signals);
            let last = timestamps[timestamps.length-1];
            //console.log(globalStore.chartData['controlLawsTier2']);
                

            for (let i=0;i<keys.length;i++)
            {
                
                let paramKeys = Object.keys(globalStore.chartData['controlLawsTier2'][keys[i]]);

                this.$set(this.tuningData,keys[i], {
                    credits:{enabled:false},
                    chart:{ 
                        backgroundColor:'transparent',                                    
                        zoomType: 'xy'},
                    legend:{
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'},
                    title:{ text:undefined },
                    xAxis: { 
                        crosshair:true,
                        title:{ 
                            text:globalStore.mapping[paramKeys[0].replace('_rel','')] +" ["+globalStore.units[paramKeys[0].replace('_rel','')]+"]",
                            align:'high'
                        }
                    },
                    yAxis: {
                        labels:{ enabled:true },
                        title:{ 
                            text:globalStore.mapping[paramKeys[1].replace('_rel','')] +" ["+globalStore.units[paramKeys[1].replace('_rel','')]+"]",
                            align:'high'
                        }
                    },
                    exporting:{
                        enabled : false
                    },
                    series: [{
                        name:'Theoretical setting',
                        type:'line',
                        data:[],
                        color:'rgb(144,170,218)',
                        marker:{
                            enabled:false
                        },
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    },
                    {
                        name:'Measured values',
                        type:'scatter',
                        data:[],
                        color: 'rgb(51,82,128)',
                        states: {
                            hover: {
                                enabled: false
                            },
                            normal:{
                            animation:false
                            },
                            inactive:{
                            opacity: 1
                            }
                        }
                    }]
                });

                if (paramKeys[0]=="load") 
                    this.tuningData[keys[i]].xAxis.title.text = 'Engine Load [%]';
                else if (paramKeys[0]=="pscav_rel") 
                    this.tuningData[keys[i]].xAxis.title.text = 'Scavenge Receiver Pressure [-]';
                else if (paramKeys[0]=="ensp_rel") 
                    this.tuningData[keys[i]].xAxis.title.text = 'Crank Shaft Rotational Speed [%]';
                    
                
                if (paramKeys[1]=='vec')                
                    this.tuningData[keys[i]].yAxis.title.text = 'VEC [deg]';
                else  if (paramKeys[1]=='veo')                
                    this.tuningData[keys[i]].yAxis.title.text = 'VEO [deg]';

                
                for (let j=0;j<globalStore.chartData['controlLawsTier2'][keys[i]][paramKeys[0]].length;j++)
                {
                    this.tuningData[keys[i]].series[0].data.push(
                    [
                        globalStore.chartData['controlLawsTier2'][keys[i]][paramKeys[0]][j],
                        globalStore.chartData['controlLawsTier2'][keys[i]][paramKeys[1]][j]
                    ]);
                      


                    if (paramKeys[1]=="vec")
                    {
                        
                        if (paramKeys[0]=='pscav_rel')
                        {
                            let aBar = 0.5*(globalStore.signals[last]['pAmb1']+globalStore.signals[last]['pAmb2']);

                            this.tuningData[keys[i]].series[1].data.push(
                            [
                                (globalStore.signals[last]['pscav']+aBar)/(globalStore.signals[last]['pscav_cmcr']+aBar),
                                globalStore.signals[last][ 'vec_'+paramKeys[0].replace('_rel','')]
                            ]);
                        }
                        else 
                            this.tuningData[keys[i]].series[1].data.push(
                            [
                                globalStore.signals[last][paramKeys[0]],
                                globalStore.signals[last][ 'vec_'+paramKeys[0].replace('_rel','')]
                            ]);
                    }
                    else if (paramKeys[0]=="load")
                    {
                        this.tuningData[keys[i]].series[1].data.push(
                        [
                            100*globalStore.signals[last][paramKeys[0]],
                            globalStore.signals[last][paramKeys[1]]
                        ]);

                    }
                    else if (paramKeys[1]=="vit_a")
                    {
                        let aBar = 0.5*(globalStore.signals[last]['pAmb1']+globalStore.signals[last]['pAmb2']);

                        this.tuningData[keys[i]].series[1].data.push(
                        [
                            (globalStore.signals[last]['pscav']+aBar)/(globalStore.signals[last]['pscav_cmcr']+aBar),
                            globalStore.signals[last][paramKeys[1]]
                        ]);
                    }
                    else 
                    {
                        this.tuningData[keys[i]].series[1].data.push(
                        [
                            globalStore.signals[last][paramKeys[0]],
                            globalStore.signals[last][paramKeys[1]]
                        ]);

                    }

                    
                }
            }
            
            this.signalsLeft =[];
            this.signalsRight = [];

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

            setTimeout(() => {
                this.active = true;});



        },
        setLoadDiagram()
        {
            this.loadDiagram = {
                credits:{enabled:false},
                chart:{
                    height:340
                },
                legend:{
                    enabled:true
                },
                tooltip:{
                    formatter: function () {
                        return this.points.reduce(function (s, point) {
                            return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(0);
                        }, '<b>' + this.x + ' rpm</b>');
                    },
                    shared:true
                },
                title:{
                    text:undefined
                },
                xAxis:
                {
                    title:
                    {
                    text:'Engine speed [rpm]',
                    align:'high'
                    },
                    crosshair:true
                },
                yAxis:{
                    title:
                    {
                    text:'Shaft power [kW]',
                    align:'high'
                    }
                },
                exporting:{
                    enabled : false
                },
                series: [{
                    name:'Measured',
                    type:'scatter',
                    data:[],
                    animation: false,
                    states: {
                        hover: {
                            enabled: false
                        },
                        normal:{
                        animation:false
                        },
                        inactive:{
                        opacity: 1
                        }
                    }
                },
                {
                    name:'Reference',
                    type:'scatter',
                    data: [],
                    animation: false,
                    states: {
                        hover: {
                            enabled: false
                        },
                        normal:{
                        animation:false
                        },
                        inactive:{
                        opacity: 1
                        }
                    }
                },
                {
                    name:'Shop Tests',
                    type:'spline',
                    data:[],
                    animation: false,
                    marker:{
                        enabled:false
                    },
                    states: {
                        hover: {
                            enabled: false
                        },
                        normal:{
                        animation:false
                        },
                        inactive:{
                        opacity: 1
                        }
                    }
                },
                {
                    name:'Sea Trials',
                    type:'line',
                    data:[],
                    animation: false,
                    marker:{
                        enabled:false
                    },
                    states: {
                        hover: {
                            enabled: false
                        },
                        normal:{
                        animation:false
                        },
                        inactive:{
                        opacity: 1
                        }
                    }
                },
                {
                    name:'Engine Limit',
                    type:'line',
                    data: [] ,
                    animation: false,
                    marker:{
                        enabled:false
                    },
                    states: {
                        hover: {
                            enabled: false
                        },
                        normal:{
                        animation:false
                        },
                        inactive:{
                        opacity: 1
                        }
                    }
                }]
            }

            let refLength = Object.keys(globalStore.reference).length;
            let sigLength = Object.keys(globalStore.signals).length;
            
            let mcr =    globalStore.loadDiagram['otVal1'];
            
            var temp ;
            
            if (refLength>sigLength) temp = Object.keys(globalStore.signals);
            else temp = Object.keys(globalStore.reference);            
        
            let timestamp = temp[temp.length-1];

            if (globalStore.signals[timestamp]['ensp']!=-1000)
            {

                if(globalStore.signals[timestamp]['shaftP']!=-1000)
                    this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.signals[timestamp]['shaftP']]];
                else if (globalStore.signals[timestamp]['ME_Power_kW']!=-1000)
                    this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.signals[timestamp]['ME_Power_kW']]];
                else  if (globalStore.signals[timestamp]['load']!=-1000)
                    this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.signals[timestamp]['load']*mcr]];
                

                if (globalStore.reference[timestamp]['shaftP']!=-1000)
                    this.loadDiagram.series[1].data =[[globalStore.signals[timestamp]['ensp'],globalStore.reference[timestamp]['shaftP']]];
                else if (globalStore.reference[timestamp]['ME_Power_kW']!=-1000)
                    this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.reference[timestamp]['ME_Power_kW']]];
                else  if (globalStore.reference[timestamp]['load']!=-1000)
                    this.loadDiagram.series[0].data =[[globalStore.signals[timestamp]['ensp'],globalStore.reference[timestamp]['load']*mcr]];
                
            }

            this.loadDiagram.series[2].data=[];
            for (let i=0;i<globalStore.loadDiagram.spVal1.length;i++)
            {
                this.loadDiagram.series[2].data.push([globalStore.loadDiagram['spVal1'][i],globalStore.loadDiagram['spVal7'][i]])
            }

            this.loadDiagram.series[3].data=[];
            for (let i=0;i<globalStore.loadDiagram.stVal1.length;i++)
            {
                this.loadDiagram.series[3].data.push([globalStore.loadDiagram['stVal1'][i],globalStore.loadDiagram['stVal2'][i]])
            }

            this.loadDiagram.series[4].data=[];

            let rpmMin = globalStore.loadDiagram['otVal3'];
            let rpmMcr = globalStore.loadDiagram['otVal2'];
            let mcr97 =  globalStore.loadDiagram['otVal4'];
            let rpm105 = globalStore.loadDiagram['otVal5'];

            let RPMStep = 5.0;

            let load = globalStore.signals[timestamp]['load'] * 100;

            this.loadDiagram.series[4].data.push([rpmMin, 0]);

            let aPWR;
            let aRPM = rpmMin;

            do
            {
                aPWR = mcr97 * Math.pow((aRPM / (0.97 * rpmMcr)), 2.0);
                this.loadDiagram.series[4].data.push([aRPM, aPWR ]);
                aRPM = aRPM + RPMStep;
            } while (aRPM <= 0.97 * rpmMcr);

            this.loadDiagram.series[4].data.push([ 0.97 * rpmMcr, mcr97 ]);
            this.loadDiagram.series[4].data.push([ rpmMcr, mcr ]);

            this.loadDiagram.series[4].data.push([ rpm105, mcr ]);

            this.loadDiagram.series[4].data.push([ rpm105, 0 ]);

        },
        testPDF(){     
            
            let forPDF={
                chartData:this.chartData,
                mapping:globalStore.mapping,
                units:globalStore.units,
                loadDiagram:this.loadDiagram.series.map(function (item) {
                    return item.data;
                })

            };

            axios.post('http://localhost:63662/api/reportinitiate/',forPDF,{ responseType: 'blob'}).then(response => {  
                                          
                var url = window.URL.createObjectURL(new Blob([response.data]));
                var link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
            });


        },
        createPDF()
        {
            document.body.style.cursor = 'progress';

            var Highcharts = require('highcharts');

            var options = Highcharts.merge(Highcharts.getOptions().exporting, { type: 'application/pdf'});

            var svgArr = [], top = 0, width = 0;

            let charts = Highcharts.charts.filter(function (item) {
                if(item!=undefined) return item.renderTo.className == 'report';
            });

            
            // let faults= globalStore.faults;

            // var faultTitle = '<g transform="translate(0,'+top+')" width="500" height="30" ><text x="15" y="15" fill="rgb(33,33,33)" style="font-size: 14px !important;font-weight: 500;line-height: 1 !important;letter-spacing: 0.02em !important;font-family: &quot;Roboto&quot;, sans-serif !important;">Engine Faults : '
            //     +faults.length+'</text></g>';

            //     top+=30;
                                
            //     svgArr.push(faultTitle); 


            // for (let i=0;i<faults.length;i++)
            // {
            //      var faultSvg = '<g transform="translate(0,'+top+')" width="500" height="30" ><text x="15" y="15" fill="rgb(33,33,33)" style="font-size: 12px !important;font-weight: 400;line-height: 1 !important;letter-spacing: 0.02em !important;font-family: &quot;Roboto&quot;, sans-serif !important;">'
            //         +faults[i].fault+' at '+faults[i].element+' '+faults[i].index+ ', '+faults[i].component+' '+ faults[i].subComponent+ ' from '+ 'to '+ faults[i].endDate+'</text></g>';

            //         top+=30;
                                    
            //         svgArr.push(faultSvg); 

            // }


            let prTitle;

            for(let i=0;i<charts.length;i++){

                if (charts[i].container.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling!=prTitle)
                {
                    prTitle = charts[i].container.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling;

                    var overTitle = '<g transform="translate(0,'+top+')" width="'+prTitle.clientWidth+
                    '" height="'+prTitle.clientHeight+'" ><text x="15" y="15" fill="rgb(51,82,128)" style="font-size: 20px !important;font-weight: 500;line-height: 1 !important;letter-spacing: 0.02em !important;font-family: &quot;Roboto&quot;, sans-serif !important;">'+prTitle.innerText+'</text></g>';

                    top+=prTitle.clientHeight;

                    svgArr.push(overTitle);

                }

                var title = charts[i].container.parentElement.parentElement.previousElementSibling;

                var titleSVG = '<g transform="translate(0,'+top+')" width="'+title.clientWidth+
                '" height="'+title.clientHeight+'" ><text x="15" y="15" fill="rgb(33,33,33)" style="font-size: 14px !important;font-weight: 500;line-height: 1 !important;letter-spacing: 0.02em !important;font-family: &quot;Roboto&quot;, sans-serif !important;">'+title.innerText+'</text></g>';

                top+=title.clientHeight;

                svgArr.push(titleSVG);

                var svg = charts[i].getSVG(),
                    svgWidth = +svg.match(
                        /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                    )[1],
                    svgHeight = +svg.match(
                        /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                    )[1];

               // console.log(svgWidth);

                svg = svg.replace(
                    '<svg',
                    '<g transform="translate(0,' + top + ')" '
                );
                svg = svg.replace('</svg>', '</g>');

                top += svgHeight;
                width = Math.max(width, svgWidth);

                svgArr.push(svg);
            }

            let svgFile = '<svg height="' + top + '" width="' + width +
            '" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
            svgArr.join('') + '</svg>';

            var temp = Object.keys(globalStore.reference);

            if (temp.indexOf('average')>-1)
                temp.splice(temp.indexOf('average'),1);

            var dateString ="";

            if ((globalStore.type=='today') || (globalStore.type=='last')) dateString= temp[temp.length-1];
            else dateString = new Date(temp[temp.length-2]).toISOString().slice(0, 10);

            Highcharts.post(options.url, {
                filename:"WiDEReport_"+globalStore.selectedVessel+"_"+dateString,
                width:options.width,
                type: options.type,
                svg: svgFile
            });            

            document.body.style.cursor = 'default';

        }

    },
    watch:
    {
        dataLoaded : function()
        {
            setTimeout(() => {
                this.setData();}, 600);
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
