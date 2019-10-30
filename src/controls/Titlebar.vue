<template>
    <v-toolbar fixed flat id="titleBar" :height=40 style="top:60px;">
        <!--<div v-show="showBreadCrumb" v-for="(item,index) in breadCrumbList" v-bind:key="item">-->
            <!--<div class="titleBtn" v-if="index>0">></div>-->

            <!--<v-btn flat class="titleBtn" v-show="userLogged" v-if="item=='Vessel View'" v-on:click="navTo(item)">{{selVessel}}</v-btn>-->
            <!--<v-btn flat class="titleBtn"  v-show="userLogged" v-else v-on:click="navTo(item)"> {{item}}</v-btn>-->
        <!--</div>-->
        <div v-show="!showBreadCrumb">
            <v-btn flat class="titleBtn" v-on:click="goBack()">
                <v-icon dark left>arrow_back</v-icon>Back
            </v-btn>
            <v-btn flat class="titleBtn"  v-show="userLogged" v-on:click="navTo(breadCrumbList[breadCrumbList.length-1])"> {{breadCrumbList[breadCrumbList.length-1]}}</v-btn>
        </div>
        <v-spacer />
        <v-btn flat v-show="userLogged" v-if="this.$route.name == 'Engine Faults'" v-on:click="navTo('Faults History')">Faults History</v-btn>
        <v-select v-show="userLogged" dark v-model="select" :items="dropDownList" flat solo primary
            background-color='rgb(51,82,128)'
            style="height:100%; max-width:200px; margin-top:15px; margin-bottom:5px; font-size:18px;">
        </v-select>
        <div v-show="userLogged" class="timeStamp">{{timeStamp}}</div>
        <v-dialog v-model="dialog" max-width="200px">
            <v-date-picker
                v-model="datePicked"
                color='rgb(51,82,128)'
                full-width/>
            <v-alert
                class='alert'
                :value="alert"
                type="info"
                transition="scale-transition"
                color='rgb(51,82,128)'
                outline
                dismissible
                @input="closeAlert">
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
    components: {
    },
    props:
    {
    },
    created()
    {
        apiService = new getData(globalStore.userProfile);

        this.select='Last Update';
      // console.log(globalStore);

        var temp = Object.keys(globalStore.signals);

        if (temp.indexOf('average')>-1)
            temp.splice(temp.indexOf('average'),1);

        this.timeStamp = temp[temp.length-1];

        let name = this.$route.name;



        if (this.screensForBack.includes(name)) this.showBreadCrumb=false;
        else this.showBreadCrumb = true;


        if (this.breadCrumbList.includes(name))
        {
            let index = this.breadCrumbList.indexOf(name);

            this.breadCrumbList = this.breadCrumbList.slice(0,index+1);
        }
        else
        {
            this.breadCrumbList.push(name);
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
            showBreadCrumb:true
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
        mapDate: function () { return globalStore.mapDate; }
    },
    watch: {
        currPath : function() {

            let name = this.$route.name;

            // if ((name=='Dashboard')||(name=='User Settings'))
            // {
            //     this.breadCrumbList =[];
            //     this.breadCrumbList.push(name);
            // }
            // else

            if (this.screensForBack.includes(name)) this.showBreadCrumb=false;
            else this.showBreadCrumb = true;


            if (this.breadCrumbList.includes(name))
            {
                let index = this.breadCrumbList.indexOf(name);

                this.breadCrumbList = this.breadCrumbList.slice(0,index+1);
            }
            else
            {
                this.breadCrumbList.push(name);
            }

        },
        select:function()
        {
            if (this.select!='')
            {
                if (this.select=='Select Date')
                {
                    // if (this.datePicked=='')
                    //     this.datePicked = '2019-04-18';

                    this.dialog=true;
                }
                else
                {
                    if (this.select=='Last Update') apiService.getLastUpdate(globalStore.selectedIMO);
                    else apiService.getToday(globalStore.selectedIMO);

                    // setTimeout(() => {
                    //     var temp = Object.keys(globalStore.reference);

                    //     if (temp.indexOf('average')>-1)
                    //         temp.splice(temp.indexOf('average'),1);

                    //     this.timeStamp = temp[temp.length-1];}, 400);
                }

                this.placeholder = this.select;

                this.select = '';
            }
        },
        selVessel:function()
        {
            apiService.getVesselConstants(globalStore.selectedIMO);

            //console.log(this.placeholder);

            if (this.placeholder=='Last Update') apiService.getLastUpdate(globalStore.selectedIMO);
            else if (this.placeholder=='Today')  apiService.getToday(globalStore.selectedIMO);

        },
        mapDate:function()
        {
            this.datePicked = this.mapDate;
        },
        datePicked:function()
        {
            //this.check =
            //console.log(this.datePicked);
            apiService.checkDate(this.datePicked, globalStore.selectedIMO);

        },
        dataLoaded : function()
        {
            setTimeout(() => {
                var temp = Object.keys(globalStore.signals);

                if (temp.length>0)
                {
                    if (temp.indexOf('average')>-1)
                        temp.splice(temp.indexOf('average'),1);

                    if ((globalStore.type=='today') || (globalStore.type=='last')) this.timeStamp = temp[temp.length-1];
                    else this.timeStamp = new Date(temp[temp.length-2]).toISOString().slice(0, 10);

                }

            });
        },
        checkedDate(check)
        {
            if (check)
            {
                if (globalStore.validDate)
                {
                    apiService.getDate(this.datePicked, globalStore.selectedIMO);

                    this.dialog=false;
                }
                else
                {
                    this.alert = true;
                }
            }
        }
    },
    methods:
    {
        closeAlert(v) {
            this.alert = false;
        },
        navTo(screen)
        {
            this.$router.push( { name: screen  } )
        },
        goBack()
        {
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
#titleBar
{
  background-color:rgb(244,244,244);
  padding:0px;
  font-size: 24px;
  color:rgb(51,82,128);
}

.titleBtn
{
  color:rgb(51,82,128);
  font-size:10px;
  text-transform: none;
  display: inline-block;
  height:100%;
}

.timeStamp
{
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
    margin-bottom:13px;
}
</style>

<style>

.v-input__slot
{
    min-height:0px;
}

.alert
 {
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
