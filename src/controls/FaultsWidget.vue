<template>
    <v-card flat fill-height style="height:100%;width:100%;">
        <v-card-title v-if="navigation" style="height:10%;cursor:pointer;" v-on:click="navTo()" v-on:mouseleave="color='rgb(95,158,239)'" v-on:mouseover ="color='rgb(51,82,128)'">
            <div primary class="title" :style="'color:'+color+';'">Engine Faults</div>
            <v-icon :color="color">play_arrow</v-icon>
        </v-card-title>
        <v-card-title v-else style="height:10%;">
            <div primary class="title"> Engine Faults</div>
        </v-card-title>
        <v-card-actions fill-height style="height:90%;">
            <v-container fluid  fill-height style="padding:0px 10px 5px 10px;width:100%;">
                <v-layout column style="height:100%;width:100%;">
                    <v-flex >
                        <v-layout column>
                            <v-flex d-flex md3 style="justify-content:center;align-items:center;font-size:80px;background-color:rgb(219,219,219);margin:5px;">{{faults.length}}</v-flex>
                            <v-flex d-flex md2 style="color:rgb(115,115,115);text-align:center;font-size:13px;margin:5px;">Individual issues detected</v-flex>
                            <v-flex d-flex md7>
                                <v-layout column>
                                    <v-flex v-for="el in elements" :key="el" style="font-size:16px;justify-content:center;align-items:center;max-height:35px;background-color:rgb(219,219,219);margin:5px;border-radius:25px;">{{el}}</v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex >
                        <dx-data-grid id="table" style="width:100%;height:100%;" :data-source="faults" :show-column-lines="true" :show-row-lines="true" :show-borders="false" :word-wrap-enabled="true" :row-alternation-enabled="true" :column-auto-width="false" @cellClick="navTo()">
                            <dx-column data-field="fault" caption="Description"/>
                            <dx-column data-field="endDate" caption="Date"/>
                        </dx-data-grid>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script>

import { DxDataGrid, DxColumn, DxPaging, DxScrolling} from 'devextreme-vue/data-grid';

import {globalStore} from "../main.js"

    export default {
        name: "FaultsWidget",
        components: {
            DxDataGrid,
            DxColumn,
            DxPaging,
            DxScrolling
        },
        props: {
            navigation:Boolean
        },
        data: function () {
            return {
                color:'rgb(95,158,239)',
            }
        },
        methods: {
            navTo() {
                this.$router.push( { name:  'Engine Faults' } )
            }
        },
        mounted() {
            this.faults =  globalStore.faults;
            this.elements = this.faults.map(x => x.element+' '+x.index).filter((item, i, ar) => ar.indexOf(item) === i);
        },
        watch: {},
        computed: {
            faults: function () {
                if (globalStore.faults.length < 1)
                    return globalStore.faults;

                var newFaults = globalStore.faults.map(function (item) {
                    item.endDate = item.endDate.replace('T',' ');

                    return item;
                });

                return newFaults;
            },
            elements: function () { return this.faults.map(x => x.element+' '+x.index).filter((item, i, ar) => ar.indexOf(item) === i);}
        }
    }
</script>

<style scoped>

#table{
  font-size: 16px;
  font-family:'Roboto', 'sans seriff';
}

</style>


