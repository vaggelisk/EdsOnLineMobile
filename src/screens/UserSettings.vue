<template>
    <v-tabs v-model="active" slider-color="rgb(51,82,128)" style="height:100%;width:100%;">
        <v-tab v-for="title in tabTitles" :key="title" ripple active-class='activeTab' style="text-transform:none;color:rgb(192,192,192);">
            <span>{{title}}</span>
        </v-tab>
        <v-tab-item class="tabItem">
            <UserProfile/>
        </v-tab-item>
        <v-tab-item class="tabItem">
            <Reports/>
        </v-tab-item>
        <v-tab-item class="tabItem">
            <AlertFilters/>
        </v-tab-item>
        <!-- <v-tab-item class="tabItem">
            <Customization/>
        </v-tab-item> -->
    </v-tabs>
</template>

<script>
    import UserProfile         from "./UserProfile"
    import Reports  from "./Reports"
    import AlertFilters      from "./AlertFilters"
    import Customization      from "./Customization"
    
    import {globalStore} from "../main.js"

    export default {
        name: 'UserSettings',
        components: {
            UserProfile,
            Reports,
            AlertFilters,
            Customization 
        },
        data() {
            return {
                tabTitles: ["Profile", "Reports", "Alert Filters"],//, "Customization"],
                active:  parseInt( this.$route.query.tab ),
                tabActive:[false, false, false, false]
            }
        },
        mounted() {
        }
    }
</script>


<style scoped>

.tabItem
{
  height: calc(100vh - 148px);
  background-color:white;
}

</style>
