<template>
    <v-toolbar v-show="userLogged" fixed flat id="titleBar" :height=40 style="top:60px;">
        <v-spacer />
        <div v-if="showTitle" style="margin-bottom: -16px; font-size: 20px; position: fixed; left: 26px;">{{ selVessel }}</div>
        <v-select dark v-model="select" :items="dropDownList" flat  primary background-color='rgb(51,82,128)' style=" max-width:112px; margin-top:15px;  font-size:14px;"></v-select>
        <div v-show="timeStamp" class="timeStamp">{{timeStamp}}</div>
        <v-dialog v-model="dialog" max-width="300px">
            <v-date-picker v-model="datePicked" color='rgb(51,82,128)' full-width/>
        </v-dialog>
        <v-dialog v-model="alert" max-width="200px">
            <v-alert class='alert' :value="alert" type="info" transition="scale-transition" color='rgb(51,82,128)' outline>
                There is no available data for this date.
            </v-alert>
        </v-dialog>
    </v-toolbar>
</template>

<script>
    import {globalStore} from "../main.js"
    import {getData} from "../getData.js";

    var apiService;

    export default {
        name: 'Titlebar',
        components: {},
        props: {},
        created() {
            if (! globalStore.is_mobile()) {
                window.location.href = "http://edsonline.propulsionanalytics.com/";
            } else {
                apiService = new getData(globalStore.userProfile);

                this.select = 'Last Update';

                let name = this.$route.name;

                if (this.screensForBack.includes(name))
                    this.showBreadCrumb = false;
                else
                    this.showBreadCrumb = true;

                if (this.breadCrumbList.includes(name)) {
                    let index = this.breadCrumbList.indexOf(name);

                    this.breadCrumbList = this.breadCrumbList.slice(0, index + 1);
                } else {
                    this.breadCrumbList.push(name);
                }
            }
        },
        data () {
            return {
                breadCrumbList:['Dashboard'],
                dropDownList:['Last Update','Today','Select Date'],
                screensForBack:['Settings','Alerts','Faults History','Report'],
                select:'',
                dialog:false ,
                datePicked: '',
                timeStamp:'',
                placeholder:'',
                alert:false,
                check:undefined,
                showBreadCrumb:true,
                vesselName:''
            }
        },
        computed: {
            currPath: function () {
                return  this.$route.path;
            },
            selVessel: function () { return globalStore.selectedVessel; },
            userLogged: function () { return globalStore.userLogged; },
            dataLoaded: function () { return globalStore.type; },
            checkedDate: function () { return globalStore.checkedDate; },
            mapDate: function () { return globalStore.mapDate; },
            showTitle: function () {
                var pages = [
                    'Vessel View',
                    'Engine Performance',
                    'Engine Faults'
                ];

                return pages.indexOf(this.$route.name) >= 0;
            }
        },
        watch: {
            currPath : function() {
                let name = this.$route.name;

                if (this.screensForBack.includes(name))
                    this.showBreadCrumb=false;
                else
                    this.showBreadCrumb = true;

                if (this.breadCrumbList.includes(name)) {
                    let index = this.breadCrumbList.indexOf(name);

                    this.breadCrumbList = this.breadCrumbList.slice(0,index+1);
                } else {
                    this.breadCrumbList.push(name);
                }
            },
            select:function() {
                if (this.select!='') {
                    if (this.select=='Select Date') {
                        this.dialog=true;
                    } else {
                        if (this.select=='Last Update')
                            apiService.checkDate('last',globalStore.selectedIMO);
                        else
                            apiService.checkDate('today',globalStore.selectedIMO);
                    }

                    this.placeholder = this.select;

                    this.select = '';
                }
            },
            selVessel:function() {
                apiService.getVesselConstants(globalStore.selectedIMO);

                if (this.placeholder=='Last Update')
                    apiService.getData('last',globalStore.selectedIMO);
                else if (this.placeholder=='Today')
                    apiService.getData('today',globalStore.selectedIMO);
                else
                    apiService.getData(this.datePicked, globalStore.selectedIMO);
            },
            mapDate:function() {
                this.datePicked = this.mapDate;
            },
            datePicked:function() {
                apiService.checkDate(this.datePicked, globalStore.selectedIMO);
            },
            dataLoaded : function() {
                if (globalStore.type!='') {
                    if ((globalStore.type=='today') || (globalStore.type=='last'))
                        this.timeStamp = '';
                    else
                        this.timeStamp = globalStore.type;
                }
            },
            checkedDate(check) {
                if (check) {
                    if (globalStore.validDate) {
                        if (this.placeholder=='Select Date') {
                            apiService.getData(this.datePicked, globalStore.selectedIMO);
                            this.dialog=false;
                        } else if (this.placeholder=='Last Update')
                            apiService.getData('last',globalStore.selectedIMO);
                        else
                            apiService.getData('today',globalStore.selectedIMO);
                    } else {
                        this.alert = true;
                    }
                }
            },
            // '$route.params.name': {
            '$route.name': {
                handler: function(name) {
                    if (name == 'Vessel View') {
                        this.vesselName = this.$route.params.vessel;
                    } else {
                        this.vesselName = '';
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            navTo(screen) {
                this.$router.push( { name: screen  } )
            },
            goBack() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>

#titleBar {
  background-color:rgb(244,244,244);
  padding:0px;
  font-size: 20px;
  color:rgb(51,82,128);
}

.titleBtn {
  color:rgb(51,82,128);
  font-size:10px;
  text-transform: none;
  display: inline-block;
  height:100%;
}

.timeStamp {
    color:rgb(51,82,128);
    font-size:10px;
    text-transform: none;
    display: flex;
    align-items:center;
    border-style:solid;
    border-color:rgb(51,82,128);
    border-width: 1px;
    padding-left:4px;
    padding-right:10px;
    height:32px;
    margin-top:15px;
    margin-bottom:8px;
}

.v-input__slot {
    min-height:20px;
}

.alert {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width:250px;
    height:100px;
    background-color:white;
}

</style>
