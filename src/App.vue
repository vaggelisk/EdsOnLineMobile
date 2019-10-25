<template>
  <v-app>
    <Topbar v-if="userLogged"
        v-bind:userName="userName"
        v-bind:companyName="companyName"/>

    <v-content fluid style="background-color:rgb(244,244,244);height:100vh;">
      <Titlebar  v-if="userLogged"/>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Topbar from './controls/Topbar'
import Titlebar from './controls/Titlebar'

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

import {globalStore}            from "./main.js"

export default {
  name: 'App',
  components: {
    Topbar,
    Titlebar
  },
  data () {
    return {
      //
    }
  },
  created()
  {

    window.addEventListener('beforeunload', this.beforeUnload);
    if (window.$cookies.isKey('user'))
    {
      globalStore.userProfile = window.$cookies.get('user');
      globalStore.userLogged = true;
      (user);


      //console.log('app create');
     // console.log(this.$route);
      // console.log(window.$cookies.isKey('user'));
      // console.log(window.$cookies.isKey('vessel'));
      if (window.$cookies.isKey('faultId'))
      {
        let vesselName = window.$cookies.get('vessel');
        globalStore.selectedVessel = vesselName;

        let faultId = window.$cookies.get('faultId');
        //console.log(faultId);

        this.$router.push( { path: `/engine-faults/${faultId}` });

      }
      else if (window.$cookies.isKey('vessel'))
      {
        let vesselName = window.$cookies.get('vessel');

        globalStore.selectedVessel = vesselName;

        // this.$router.push( { path: `/vessel-view/${vesselName}` });// 'vessel-view'} );
         this.$router.push( { path: `/vessel-view/${vesselName}` });

      }
      else this.$router.push( { path:  '/dashboard' } );
    }

  },
  mounted()
  {
    window.$cookies.remove('vessel');
  },
  methods:{
    beforeUnload: function()
    {
      window.$cookies.remove('vessel');
    }
  },
  computed: {
      userName: function() {return globalStore.userProfile.displayName;},      
      companyName: function() {return globalStore.userProfile.company;},
      userLogged: function() {return globalStore.userLogged;}
  }
}
</script>

<style scoped>

</style>

