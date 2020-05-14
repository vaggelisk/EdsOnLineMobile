import axios from 'axios';
import router from './router'
import {globalStore} from "./main.js"

//const API_URL = 'http://localhost:8092';
const API_URL_REMOTE = 'http://eds2.propulsionanalytics.com';

export class getData {

    constructor(userProfile) {
        this.getFilterAlerts();
        this.getConstants();
    }

    getFilterAlerts() {
        if (!window.$cookies.isKey('alertCheck'))
            axios.get(API_URL_REMOTE + '/rule').then(response => {
                console.log(globalStore.alertFilters);
                globalStore.alertFilters = response.data;
                window.$cookies.set('alertCheck', true);
            })
    }

    getConstants() {
        axios.get(API_URL_REMOTE + '/GetWiDEDataWithDashes/const/limits').then(response => {
            globalStore.limits = JSON.parse(response.data.data.limits);
        });

        axios.get(API_URL_REMOTE + '/GetWiDEDataWithDashes/const/mapping').then(response => {
            globalStore.mapping = JSON.parse(response.data.data.mapping);
            globalStore.ehcMapping = JSON.parse(response.data.data.ehcMapping);
        });

        axios.get(API_URL_REMOTE + '/GetWiDEDataWithDashes/const/faultParameter').then(response => {
            globalStore.faultMapping = JSON.parse(response.data.data.faultParams);
        });

        axios.get(API_URL_REMOTE + '/GetWiDEDataWithDashes/const/units').then(response => {
            globalStore.units = JSON.parse(response.data.data.units);
        });
    }

    getVesselConstants(imo) {
        if (typeof imo == "undefined" || !!!imo || imo.toString().length < 1)
            return;

        axios.get(API_URL_REMOTE + '/GetWiDEDataWithDashesPerVessel/' + imo + '/const/loadDiagram').then(response => {
            globalStore.loadDiagram = JSON.parse(response.data.data.loadDiagram);
        });

        axios.get(API_URL_REMOTE + '/GetWiDEChartDataPerVessel/' + imo).then(response => {
            let keys = Object.keys(response.data.data);
            keys.splice(keys.indexOf('elementNo'), 1);

            for (let i = 0; i < keys.length; i++) {
                globalStore.chartData[keys[i]] = JSON.parse(response.data.data[keys[i]]);
            }

            let elementNo = JSON.parse(response.data.data.elementNo);

            globalStore.cylCount = elementNo.cylNo;
            globalStore.tcCount = elementNo.tcNo;
        });
    }

    async getDashboardData(date, dateTo) {
        let tempDash = {}, tempMap ={};

        for (let i = 0; i < globalStore.userProfile.vessels.length; i++) {
            let vessel = globalStore.userProfile.vessels[i];

            if (globalStore.availableVessels.includes(vessel.imo)) {
                var dashboardUrl = API_URL_REMOTE + '/GetWiDEDataDashboardPerVessel/' + vessel.imo + '/' + date;

                if (typeof dateTo == 'string' && dateTo.length) {

                }

                let response = await axios.get(dashboardUrl).catch(error => {console.log(error)});

                if (response.status==200) {
                    tempDash[vessel.name]= JSON.parse(response.data.data);
                    tempDash[vessel.name].date = new Date().toISOString();
                }

                response = await axios.get(API_URL_REMOTE + '/GetWiDEDataWithDashesPerVessel/' + vessel.imo + '/const/map');

                if ((response.status == 200) && (response.data.data.sigs != undefined))
                    tempMap[vessel.name] = JSON.parse(response.data.data.sigs);
            }
        }

        globalStore.dashboard = tempDash;
        globalStore.mapData = tempMap;
    }

    async getFaults(type, imo) {
        let response = await axios.get(API_URL_REMOTE+'/GetWiDEFaultDataPerVessel/'+imo+'/'+type);

        if ((response.status==200)&&(Object.keys(response.data.data).length>0))  {
            let faultDict = JSON.parse(response.data.data);

            if (Object.keys(faultDict).length) {
                globalStore.faults = Object.values(faultDict).map(function (item) {
                    return JSON.parse(item);
                });
            } else {
                globalStore.faults = [];
            }
        } else
            globalStore.faults = [];
    }

    async checkDate(date, imo) {
        document.body.style.cursor = 'progress';

        globalStore.checkedDate = false;
        globalStore.validDate = false;

        if (imo == '') {
            const response = await axios.get(API_URL_REMOTE + '/checkFleetExistenceData/' + date, {withCredentials: true})
                .catch(error => {
                    let logout = true;

                    if ((date != 'last') && (date != 'today')) {
                        let dt = new Date(date);
                        let today = new Date();

                        if (dt >= today) logout = false
                    }

                    if (logout) {
                        globalStore.userLogged = false;
                        window.$cookies.remove('user');
                        // this.$router.push({path: '/login'});

                        location.reload(true);
                    } else {
                        globalStore.validDate = false;
                        globalStore.checkedDate = true;
                        document.body.style.cursor = 'default';
                    }
                });

            if (response.status == 200) {
                let tmp = response.data.data;

                globalStore.availableVessels = [];

                for (let v = 0; v < Object.keys(tmp).length; v++) {
                    let key = Object.keys(tmp)[v];

                    if (tmp[key])
                        globalStore.availableVessels.push(key);
                }

                if (globalStore.availableVessels.length > 0) {
                    globalStore.validDate = true;
                    globalStore.checkedDate = true;
                    document.body.style.cursor = 'default';
                } else {
                    globalStore.validDate = false;
                    globalStore.checkedDate = true;
                    document.body.style.cursor = 'default';
                }
            }
        } else {
            let response = await axios.get(API_URL_REMOTE + '/checkFleetExistenceData/' + date, {withCredentials: true})
                .catch(error => {
                    let logout = true;

                    if (date != 'last' && date != 'today') {
                        let dt = new Date(date);
                        let today = new Date();

                        if (dt >= today) logout = false
                    }

                    if (logout) {
                        globalStore.userLogged = false;
                        window.$cookies.remove('user');
                        // this.$router.push({path: '/login'});

                        location.reload(true);
                    } else {
                        globalStore.validDate = false;
                        globalStore.checkedDate = true;
                        document.body.style.cursor = 'default';
                    }
                });

            if (response.status == 200) {
                let tmp = response.data.data;

                globalStore.availableVessels = [];

                for (let v = 0; v < Object.keys(tmp).length; v++) {
                    let key = Object.keys(tmp)[v];

                    if (tmp[key])
                        globalStore.availableVessels.push(key);
                }
            }

            response = await axios.get(API_URL_REMOTE + '/checkExistenceData/' + imo + '/' + date)
                .catch(error => {
                    globalStore.validDate = false;
                    globalStore.checkedDate = true;
                    document.body.style.cursor = 'default';
                });

            if (response.status == 200) {
                if (response.data.data) {
                    globalStore.validDate = true;
                    globalStore.checkedDate = true;
                    document.body.style.cursor = 'default';
                } else {
                    globalStore.validDate = false;
                    globalStore.checkedDate = true;
                    document.body.style.cursor = 'default';
                }
            }
        }
    }

    getData(date, imo) {
        if (typeof imo != 'undefined' && imo != '') {
            globalStore.type = '';

            this.getFaults(date, imo);

            this.getVesselData(date, imo);
        } else
            globalStore.type = date;

        this.getDashboardData(date);
    }

    async getVesselData(type, imo) {
        document.body.style.cursor = 'progress';

        let url = API_URL_REMOTE + '/GetWiDEDataWithDashesPerVessel/' + imo + '/' + type + '/';

        let response = await axios.get(url+'_sig');

        if (response.status==200) {
            globalStore.signals = JSON.parse(response.data.data.sigs);

            this.checkEngineStatus();
        }

        response = await axios.get(url+'_ref');

        if (response.status==200)
            globalStore.reference = JSON.parse(response.data.data.reference);

        globalStore.type = type;
        document.body.style.cursor = 'default';
    }

    async getVesselPosition() {
        let tempMap ={};

        for (let i = 0; i < globalStore.userProfile.vessels.length; i++) {
            let vessel = globalStore.userProfile.vessels[i];

            let response = await axios.get(API_URL_REMOTE + '/GetWiDEDataWithDashesPerVessel/' + vessel.imo + '/const/map');

            if ((response.status == 200) && (response.data.data.sigs != undefined))
                tempMap[vessel.name] = JSON.parse(response.data.data.sigs);
        }

        globalStore.mapData = tempMap;
    }

    checkEngineStatus() {
        var temp = Object.keys(globalStore.signals);

        let timestamp = temp[temp.length - 1];

        let stateText = globalStore.signals[timestamp]['engineStateText'];

        if (stateText == undefined) {
            if (globalStore.signals[timestamp]['engineState'] == -1000)
                router.push({path: 'dashboard'});
        } else {
            if ((stateText != 'Running') && (stateText != 'Slowdown'))
                router.push({path: 'dashboard'});
        }
    }
}
