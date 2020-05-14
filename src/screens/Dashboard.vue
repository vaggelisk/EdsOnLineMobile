<template>
    <v-container fluid style="padding:0px 10px 5px ;background-color: rgb(244,244,244)">
        <!--<v-container fluid grid-list-md fill-height style="padding:0px 10px 5px 10px;width:100%;height:100%">-->
        <v-layout column v-if="userLogged">
            <v-flex style="height: 300px">
                <v-layout style="height :100%;">
                    <Map
                            v-if="mapLoad"
                            v-bind:showDict="showVesselPoints"
                            v-bind:points="mapData"
                            v-bind:zoom="2"/>
                </v-layout>
            </v-flex>

            <v-flex>
                <v-layout>
                    <v-layout v-if="Object.keys(companyDict).length==1" column fill-height style="overflow:auto;">
                        <DashboardCard @click.native="changeSelected(vessel.name)"
                                       v-for="vessel in vesselList" :key="vessel"
                                       v-bind:cardData="cardData[vessel.name]"
                                       v-bind:flat="!showVesselPoints[vessel.name]"
                        />
                    </v-layout>
                    <v-layout v-else column fill-height style="overflow:auto;">
                        <!-- <v-layout column fill-height style="overflow:auto;">                -->
                        <v-expansion-panel v-model="panel">
                            <v-expansion-panel-content v-for="(value, name) in companyDict" :key="name" lazy>
                                <template v-slot:header>
                                    <div class="title">{{name}}</div>
                                </template>
                                <template v-slot:default>
                                    <v-layout column fill-height
                                              style="overflow:auto;background-color:rgb(244,244,244);">
                                        <DashboardCard @click.native="changeSelected(vessel.name)"
                                                       v-for="vessel in value" :key="vessel"
                                                       v-bind:cardData="cardData[vessel.name]"
                                                       v-bind:flat="!showVesselPoints[vessel.name]"
                                        />
                                    </v-layout>
                                </template>

                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-layout>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import DashboardCard from '../controls/DashboardCard'
    import Map from '../controls/Map'
    import {globalStore} from "../main.js"
    import {getData} from "../getData.js";

    var apiService;

    export default {
        name: "Dashboard",
        components: {
            DashboardCard,
            Map
        },
        data: function () {
            return {
                cardData: {},
                mapData: [],
                mapLoad: false,
                email: '',
                password: '',
                show: false,
                alert: false,
                showVesselPoints: {},
                panel: null
            }
        },
        created() {
            apiService = new getData(globalStore.userProfile);
        },
        computed: {
            dashChanged: function () {
                return globalStore.dashboard;
            },
            mapChanged: function () {
                return globalStore.mapData;
            },
            userLogged: function () {
                return globalStore.userLogged;
            },
            dataLoaded: function () {
                return globalStore.type;
            },
            vesselList: function () {
                var vList = globalStore.userProfile.vessels.filter(function (item) {
                    return globalStore.availableVessels.includes(item.imo);
                });

                return vList;
            },
            companyDict: function () {
                var dict = {};

                var companies = [...new Set(globalStore.userProfile.vessels.map(function (item) {
                    return item.company;
                }))];

                for (let c = 0; c < companies.length; c++) {
                    var vList = globalStore.userProfile.vessels.filter(function (item) {
                        return item.company == companies[c];
                    });

                    dict[companies[c]] = vList;
                }

                return dict;
            }
        },
        mounted() {
            this.checkOnMount();

            globalStore.selectedIMO = '';
            globalStore.selectedVessel = '';
            this.setDatawDashData();
        },
        methods: {
            checkOnMount() {
                if (typeof globalStore.previousType != 'undefined' && globalStore.previousType.length > 0) {
                    globalStore.type = globalStore.previousType;
                    globalStore.previousType = '';

                    if (globalStore.dateTo.length < 1)
                        apiService.getData(globalStore.type);
                    else
                        apiService.getData(globalStore.type, '', globalStore.dateTo);
                } else {
                    this.redirectByCookie();
                }
            },
            setDatawDashData() {
                this.mapLoad = false;
                this.cardData = {};

                for (let v = 0; v < this.vesselList.length; v++) {
                    let vessel = this.vesselList[v];
                    let vessDash = globalStore.dashboard[vessel.name];

                    if (typeof vessDash == 'undefined') {
                        continue;
                    }

                    var cardDict = {};

                    this.$set(cardDict, 'name', vessel.name);
                    this.$set(cardDict, 'imo', vessel.imo);

                    if (typeof vessDash.date != 'undefined')
                        this.$set(cardDict, 'lastUpdate', vessDash.date.slice(0, 10));

                    let params = ['LAT', 'LON'];

                    for (let p = 0; p < params.length; p++) {
                        this.$set(cardDict, params[p], {
                            label: globalStore.mapping[params[p]],
                            value: vessDash[params[p]],
                            unit: '',
                            format: 3
                        });
                    }

                    params = ['ME_Power_perc', 'ensp', 'STW'];

                    for (let p = 0; p < params.length; p++) {
                        this.$set(cardDict, params[p], {
                            label: globalStore.mapping[params[p]],
                            value: vessDash[params[p]],
                            unit: '[' + globalStore.units[params[p]] + ']',
                            format: 2
                        });
                    }

                    if ((cardDict['ME_Power_perc'].value == -1000) && (vessDash['load'] != -1000))
                        cardDict['ME_Power_perc'].value = vessDash['load'] * 100;


                    let nvg = true;
                    let stateText = vessDash['engineStateText'];

                    if (stateText == undefined) {
                        if (vessDash['engineState'] == -1000) nvg = false;
                    } else {
                        if ((stateText != 'Running') && (stateText != 'Slowdown')) nvg = false;
                    }

                    this.$set(cardDict, 'engineState', {
                        label: 'Engine State',
                        value: stateText,
                        unit: '',
                        format: null,
                        nav: nvg
                    });

                    this.$set(cardDict, 'faults', {
                        label: 'Faults',
                        value: vessDash['Faults'],
                        unit: '',
                        format: null
                    });

                    this.$set(cardDict, 'bsfc', {
                        title: globalStore.mapping['bsfc'],
                        unit: globalStore.units['bsfc'],
                        value: vessDash['bsfc'][vessDash['bsfc'].length - 1],
                        format: 1
                    });

                    this.$set(cardDict.bsfc, 'chartOptions', {
                        credits: {enabled: false},
                        chart: {backgroundColor: 'transparent'},
                        tooltip: {
                            formatter: function () {
                                return this.points.reduce(function (s, point) {
                                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                                }, '');
                            },
                            shared: true
                        },
                        legend: {
                            enabled: true,
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                        },
                        title: {text: undefined},
                        xAxis: {
                            labels: {enabled: false},
                            crosshair: true
                        },
                        yAxis: {
                            labels: {enabled: false},
                            title: {text: undefined}
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            name: 'Values',
                            type: 'line',
                            data: [],
                            marker: {
                                enabled: false
                            },
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal: {
                                    animation: false
                                },
                                inactive: {
                                    opacity: 1
                                }
                            }
                        },
                            {
                                name: 'Ref',
                                type: 'line',
                                data: [],
                                marker: {
                                    enabled: false
                                },
                                states: {
                                    hover: {
                                        enabled: false
                                    },
                                    normal: {
                                        animation: false
                                    },
                                    inactive: {
                                        opacity: 1
                                    }
                                }
                            }]
                    });

                    for (let i = 0; i < vessDash['bsfcRef'].length; i++) {
                        if (vessDash['bsfc'][i] != -1000)
                            cardDict.bsfc.chartOptions.series[0].data.push([i, vessDash['bsfc'][i]]);

                        if (vessDash['bsfcRef'][i] != -1000)
                            cardDict.bsfc.chartOptions.series[1].data.push([i, vessDash['bsfcRef'][i]]);
                    }

                    this.$set(cardDict, 'fcon', {
                        title: globalStore.mapping['fcon'],
                        unit: globalStore.units['fcon'],
                        value: vessDash['fcon'][vessDash['fcon'].length - 1],
                        format: 1
                    });

                    this.$set(cardDict.fcon, 'chartOptions', {
                        credits: {enabled: false},
                        chart: {backgroundColor: 'transparent'},
                        tooltip: {
                            formatter: function () {
                                return this.points.reduce(function (s, point) {
                                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                                }, '');
                            },
                            shared: true
                        },
                        legend: {
                            enabled: true,
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                        },
                        title: {text: undefined},
                        xAxis: {
                            labels: {enabled: false},
                            crosshair: true
                        },
                        yAxis: {
                            labels: {enabled: false},
                            title: {text: undefined}
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            name: 'Values',
                            type: 'line',
                            data: [],
                            marker: {
                                enabled: false
                            },
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal: {
                                    animation: false
                                },
                                inactive: {
                                    opacity: 1
                                }
                            }
                        },
                            {
                                name: 'Ref',
                                type: 'line',
                                data: [],
                                marker: {
                                    enabled: false
                                },
                                states: {
                                    hover: {
                                        enabled: false
                                    },
                                    normal: {
                                        animation: false
                                    },
                                    inactive: {
                                        opacity: 1
                                    }
                                }
                            }]
                    });

                    for (let i = 0; i < vessDash['fconRef'].length; i++) {
                        if (vessDash['fcon'][i] != -1000)
                            cardDict.fcon.chartOptions.series[0].data.push([i, vessDash['fcon'][i]]);

                        if (vessDash['fconRef'][i] != -1000)
                            cardDict.fcon.chartOptions.series[1].data.push([i, vessDash['fconRef'][i]]);
                    }

                    this.$set(cardDict, 'sloc', {
                        title: 'SLOC setting',
                        unit: globalStore.units['sloc'],
                        value: vessDash['sloc'][vessDash['sloc'].length - 1],
                        format: 1
                    });

                    this.$set(cardDict.sloc, 'chartOptions', {
                        credits: {enabled: false},
                        chart: {backgroundColor: 'transparent'},
                        tooltip: {
                            formatter: function () {
                                return this.points.reduce(function (s, point) {
                                    return s + '<br/>' + point.series.name + ': ' + point.y.toFixed(2);
                                }, '');
                            },
                            shared: true
                        },
                        legend: {
                            enabled: true,
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                        },
                        title: {text: undefined},
                        xAxis: {
                            labels: {enabled: false},
                            crosshair: true
                        },
                        yAxis: {
                            labels: {enabled: false},
                            title: {text: undefined}
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            name: 'Values',
                            type: 'line',
                            data: [],
                            marker: {
                                enabled: false
                            },
                            states: {
                                hover: {
                                    enabled: false
                                },
                                normal: {
                                    animation: false
                                },
                                inactive: {
                                    opacity: 1
                                }
                            }
                        }
                        ]
                    });

                    for (let i = 0; i < vessDash['sloc'].length; i++) {
                        if (vessDash['sloc'][i] != -1000)
                            cardDict.sloc.chartOptions.series[0].data.push([i, vessDash['sloc'][i]]);
                    }

                    this.$set(cardDict, 'engineColor', vessDash['eng_KPI_color']);

                    let kpi = vessDash['eng_KPI'] * 100;

                    if (kpi.toFixed(1) != '100.0') this.$set(cardDict, 'engineKPI', kpi.toFixed(1));
                    else this.$set(cardDict, 'engineKPI', kpi.toFixed(0));

                    this.$set(this.cardData, vessel.name, cardDict);
                }

                this.setMapData();

                this.mapLoad = true;

                document.body.style.cursor = 'default';
            },
            setMapData() {
                let vessList = globalStore.userProfile.vessels;

                if (this.panel != null) {
                    let shipCo = Object.keys(this.companyDict)[this.panel];

                    vessList = this.companyDict[shipCo];
                }

                this.mapData = [];
                this.showVesselPoints = {};

                for (let v = 0; v < vessList.length; v++) {
                    let vessel = vessList[v];
                    var points = [];
                    this.showVesselPoints[vessel.name] = false;

                    if (Object.keys(globalStore.mapData).includes(vessel.name)) {
                        let dates = Object.keys(globalStore.mapData[vessel.name]);

                        let params = ['ME_Power_perc', 'ensp', 'STW'];

                        let last = true;

                        for (let i = dates.length - 1; i >= 0; i--) {
                            let currDate = dates[i];//now.toISOString().substring(0,10);

                            let temp = globalStore.mapData[vessel.name][currDate];

                            let html = '<b>' + currDate + ' ' + vessel.name + '</b><br>';

                            for (let p = 0; p < params.length; p++) {
                                if (temp[params[p]] != -1000)
                                    html += globalStore.mapping[params[p]] + ': ' + temp[params[p]].toFixed(2) + ' [' + globalStore.units[params[p]] + ']<br>';
                                else if ((params[p] == 'ME_Power_perc') && (temp['load'] != -1000))
                                    html += globalStore.mapping[params[p]] + ': ' + (temp['load'] * 100).toFixed(2) + ' [' + globalStore.units[params[p]] + ']<br>';
                                else html += globalStore.mapping[params[p]] + ': - [' + globalStore.units[params[p]] + ']<br>';
                            }

                            html += 'Faults: ' + temp['Faults'];

                            points.push({
                                'date': currDate,//.replace(/-/g,''),
                                'coords': [temp['LON'], temp['LAT']],
                                'color': temp['mapColor'],
                                'html': html,
                                'status': temp['engineStateText'],
                                'vessel': vessel.name,
                                'imo': vessel.imo,
                                'last': last
                            });

                            last = false;

                        }

                        //this.$set(this.mapData, vessel.name,points);
                        this.mapData = this.mapData.concat(points);

                    }
                }
            },
            average: function (param, count, data, timestamp) {
                let sum = 0;

                for (let i = 1; i <= count; i++) {
                    if (data[timestamp][param + i] != -1000) sum += data[timestamp][param + i];
                    else count--;
                }

                if ((sum == 0) || (count == 0))
                    return -1000;
                else
                    return sum / count;
            },
            changeSelected(selVessel) {
                this.showVesselPoints = {};

                for (let v = 0; v < globalStore.userProfile.vessels.length; v++) {
                    let vessel = globalStore.userProfile.vessels[v];

                    if (vessel.name == selVessel)
                        this.showVesselPoints[vessel.name] = true;
                    else
                        this.showVesselPoints[vessel.name] = false;
                }
            },
            redirectByCookie() {
                //Redirect to vessel on dashboard load
                var value = "; " + document.cookie,
                    parts = value.split("; request-vessel="),
                    request_vessel = '';

                if (parts.length >= 1) {
                    request_vessel = parts.pop().split(";");

                    if (request_vessel.length && request_vessel[0].length) {
                        window.$cookies.remove('request-vessel');

                        globalStore.selectedVessel = decodeURI(request_vessel[0]);

                        var vessel = globalStore.userProfile.vessels.filter(function (item) {
                            return item.name == globalStore.selectedVessel;
                        })[0];

                        globalStore.selectedIMO = vessel.imo;
                        this.$router.push({path: `/vessel-view/${globalStore.selectedVessel}`});
                    }
                }
            }
        },
        watch: {
            mapChanged: {
                handler: function () {
                    this.setMapData();
                },
                deep: true,
                immediate: true
            },
            dashChanged: {
                handler: function () {
                    this.setDatawDashData();
                },
                deep: true,
                immediate: true
            },
            dataLoaded: function () {
                //    try
                //     {
                //         setTimeout(() => {
                //             if (this.dataLoaded!='')
                //                 this.setDatawDashData();
                //         }, 600);
                //     }
                //     catch(err)
                //     {
                //         console.log('error '+err);
                //         setTimeout(() => {
                //             if (this.dataLoaded!='')
                //                 this.setDatawDashData();
                //         }, 600);
                //     }
            },
            vesselList: function () {
                this.setDatawDashData();
                //    try
                //     {
                //         setTimeout(() => {
                //             this.setDatawDashData();
                //         }, 600);
                //     }
                //     catch(err)
                //     {
                //         console.log('error '+err);
                //         setTimeout(() => {
                //             this.setDatawDashData();
                //         }, 600);
                //     }
            },
            panel: function () {
                this.setMapData();
            }
        }
    }
</script>

<style scoped>
    .alert {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 300px;
        height: 100px;
        background-color: white;
        /* color: rgb(33,33,33);
        background-color:transparent; */
    }

</style>
