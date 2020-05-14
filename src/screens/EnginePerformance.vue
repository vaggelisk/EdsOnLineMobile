<template>
    <v-tabs v-model="active" slider-color="rgb(51,82,128)" style="height:100%;width:100%;">
        <v-tab v-for="title in tabTitles" :key="title" ripple active-class='activeTab' style="text-transform:none;color:rgb(192,192,192);">
            <span>{{title}}</span>
        </v-tab>
        <v-tab-item class="tabItem">
            <EngineParameters v-bind:active="tabActive[0]"/>
        </v-tab-item>
    </v-tabs>
</template>

<script>
    import EngineGraphs from "./EngineGraphs"
    import EngineParameters from "./EngineParameters"
    import EngineRaw from "./EngineRaw"
    import OperationalGraphs from "./OperationalGraphs"

    import EnginePerformanceCurves from "./EnginePerformanceCurves"
    import EnginePerformanceTable from "./EnginePerformanceTable"
    import TuningCharts from "./TuningCharts"
    import ElectronicVIT from "./ElectronicVIT"
    import ElectronicVEC from "./ElectronicVEC"

    import {globalStore} from "../main.js"

    export default {
        name: "EnginePerformance",
        components: {
            EngineParameters,
            EngineRaw,
            EngineGraphs,
            OperationalGraphs,
            EnginePerformanceCurves,
            EnginePerformanceTable,
            TuningCharts,
            ElectronicVIT,
            ElectronicVEC
        },

        data() {
            return {
                active: parseInt(this.$route.query.tab),
                tabActive: [false, false, false, false, false, false, false, false, false],
                tabTitles: ['Performance Parameters'],
                addTab: 3
            }
        },
        created() {
            this.tabActive[parseInt(this.$route.query.tab)] = true;

            if (!this.showAdditional) {
                let forDel = ['Performance Data Table', 'Data Curves ISO', 'Tunings'];

                for (let i = 0; i < forDel.length; i++) {
                    let index = this.tabTitles.indexOf(forDel[i]);

                    this.tabTitles.splice(index, 1);
                    this.tabActive.splice(index, 1);
                }

                this.addTab = 0;
            }
        },
        mounted() {
        },
        methods: {},
        watch: {
            active: function () {
                for (let i = 0; i < this.tabActive.length; i++) {
                    if (i == this.active)
                        this.tabActive[i] = true;
                    else
                        this.tabActive[i] = false;
                }
            }
        },
        computed: {
            showAdditional: function () {
                if (globalStore.userProfile.roles.includes('ROLE_WINGD_USER')) return true;
                else return false;
            }
        }
    }
</script>

<style scoped>

    .tabItem {
        height: calc(100vh - 148px)
    }

</style>

<style>

    .activeTab {
        color: rgb(51, 82, 128) !important;
        opacity: 1 !important;
    }

</style>

