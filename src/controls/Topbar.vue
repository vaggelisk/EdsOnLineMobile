<template>
  <v-toolbar extended flat id="topBar" :height=60 :extension-height=40 app>
    <v-container fluid fill-height grid-list-md style="padding:5px;">
      <v-layout row >
        <img height="50" :src=logo alt="">
        <div style="color:white;margin:10px;padding:5px;font-size:36px;font-weight:bold;display:flex;justify-content:center;align-items:center;">WiDE Online</div>  
        <v-spacer></v-spacer>    
        <div v-show="userLogged" style="margin:0px 10px 0px 10px;">
          <div style="color:white;display:flex;justify-content:flex-end;align-items:center;height:50%;">{{userName}}</div>
          <div style="color:rgb(218,218,218);display:flex;justify-content:flex-end;align-items:center;height:50%;">{{companyName}}</div>
        </div>    
        <v-avatar v-show="userLogged" v-on:click="goToSettings()">
          <img style="width:40px;height:40px;" :src="user" alt="">
        </v-avatar> 
        <v-badge overlap color='rgb(205, 57, 64)' v-model="showAlert" ref="alertBadge" style="margin:10px;">
          <template  v-slot:badge>
            <span>{{alertCount}}</span>
          </template>
          <v-avatar tile="true" size="35" v-on:click="alertBadgeClick">
            <img style="width:20px;height:20px;" :src="notif" alt="">
          </v-avatar> 
        </v-badge>
        <v-avatar tile="true" size="35" style="margin:10px;">
            <img style="width:20px;height:20px;" :src="ticket" alt="">
          </v-avatar> 
        <v-menu v-model="alertMenu" 
            :position-x="X"
            :position-y="Y"
            absolute
            offset-y>
          <AlertMenu/>          
        </v-menu>
        <!-- <v-badge overlap color='rgb(205, 57, 64)' v-model="showAlert">
          <template v-slot:badge>
            <span>{{alertCount}}</span>
          </template>
          <v-avatar tile="true">
            <img style="width:20px;height:20px;" :src="notif" alt="">
          </v-avatar> 
        </v-badge>               -->
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on }">            
            <v-avatar tile="true" v-on="on">
              <img style="width:24px;height:24px;" :src="burger" alt="">
            </v-avatar>
          </template>
          <v-list>
            <v-list-tile
              v-for="item in items" :key="item" v-on:click="menuSelect(item)">
              <v-list-tile-title>{{ item }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        
      </v-layout>
    </v-container>
  </v-toolbar>
</template>

<script>

import AlertMenu     from "./AlertMenu"
import {globalStore} from "../main.js"

  export default {
    name: "Topbar",
    components:{
      AlertMenu
    },
    props: {
      userName:String,
      companyName:String
    },
    data: function () {
      return {
        logo: require('../assets/EDIbWLyb.jpg'), 
        burger: require('../assets/burger_active_dark.png'),
        notif : require('../assets/notifications.png'),
        ticket : require('../assets/ticket.png'),
        user: require('../assets/estLogo.png'), 
        items : [ 'Report','Settings','Logout'],
        showAlert: false,
        alertMenu: false,
        X:0,
        Y:0
      }
    },
    created()
    {
      if (globalStore.userProfile.company =="Berge Bulk") this.user = require('../assets/bbLogo.png');
      else if (globalStore.userProfile.company =="Win GD") this.user = require('../assets/wingdLogo.jpg');
    },
    methods:
    {
      menuSelect(menuItem)
      {
        if (menuItem=="Settings")  this.$router.push( { path: '/user-settings' } );
        else if (menuItem=="Report")  this.$router.push( { path: '/report' } )
        else 
        {
          globalStore.userLogged = false;
          window.$cookies.remove('user');
          this.$router.push( { path: '/login' } );
        } 
      },
      alertBadgeClick()
      {
        this.alertMenu = false;
        this.X = this.$refs['alertBadge'].$el.offsetLeft + this.$refs['alertBadge'].$el.clientLeft;
        this.Y = this.$refs['alertBadge'].$el.offsetTop + this.$refs['alertBadge'].$el.clientTop + this.$refs['alertBadge'].$el.clientHeight;
        this.$nextTick(() => {
          this.alertMenu = true;
        });
      }

    }, 
    computed: {    
      userLogged: function () { return globalStore.userLogged; },
      alertCount: function() {return globalStore.alerts.length;}
    },
    watch:
    {
      alertCount:function()
      {
        if (this.alertCount>0) this.showAlert = true;
        else this.showAlert = false;
      }
    }
  }
</script>

<style scoped>
#topBar
{
  background-color:rgb(51,82,128);
  padding:0px;
}


</style>
