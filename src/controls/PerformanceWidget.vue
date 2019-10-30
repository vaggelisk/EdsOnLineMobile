<template>
    <v-card flat fill-height style="height:100%;">
        <v-card-title style="height:10%;cursor:pointer;"
                v-on:click="navTo()"
                v-on:mouseleave="color='rgb(95,158,239)'"
                v-on:mouseover="color='rgb(51,82,128)'">
            <div primary class="title" :style="'color:'+color+';'">
                Engine Performance
            </div>
            <v-icon :color="color">play_arrow</v-icon>
        </v-card-title>
        <v-card-actions fill-height style="height:90%;">
            <v-container fluid fill-height grid-list-md style="padding:5px;">
                <v-layout column fill-height>
                    <v-flex d-flex md6  style="max-height:50%;">
                        <v-layout row>
                            <v-flex d-flex md6>
                                <Card
                                   v-bind:cardData="cardData['pcomp']"/>
                            </v-flex>
                            <v-flex d-flex md6>
                                <Card
                                   v-bind:cardData="cardData['tcspeed']"/>
                            </v-flex>

                        </v-layout>
                    </v-flex>
                    <v-flex d-flex md6  style="max-height:50%;">
                        <v-layout row>
                            <v-flex d-flex md4>
                                <Card
                                        v-bind:cardData="cardData['pscav']"/>
                            </v-flex>
                            <v-flex d-flex md4>
                                <Card
                                        v-bind:cardData="cardData['tTurbIn']"/>
                            </v-flex>

                        </v-layout>
                    </v-flex>
                     <v-flex d-flex md6  style="max-height:50%;">
                         <v-layout row>
                            <v-flex d-flex md4>
                                <Card
                                   v-bind:cardData="cardData['pmax']"/>
                            </v-flex>
                            <v-flex d-flex md4>
                                <Card
                                   v-bind:cardData="cardData['bsfc']"/>
                            </v-flex>

                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script>

    import Card from  './Card'
    import Gauge from './Gauge'

    export default {
        name: "PerformanceWidget",
        components: {
            Card,
            Gauge
        },
        props: {
            cardData:Object,
            gaugeData:Object
        },
        data: function () {
            return {
                color:'rgb(95,158,239)'
            }
        },
        methods: {
            navTo()
            {
                this.$router.push( { name:  'Engine Performance' } )
            }

        },
        mounted() {
        },
        watch:
        {
        }
    }
</script>

<style scoped>
</style>


