<template>
    <v-card flat fill-height style="height:100%;">
        <v-card-title primary class="title" style="height:10%;">Subsystems state</v-card-title>
        <v-card-actions fill-height style="height:90%;">
            <v-container  fill-height grid-list-md style="padding:20px;">
                <v-layout row>
                    <v-flex >
                        <v-layout fill-height column>
                            <v-layout v-for="sys in data[0]" :key="sys" row>
                                <v-flex  style="justify-content:center;align-items:center;">
                                    <v-avatar>
                                        <img v-if="sys.value==20" :src=red>
                                        <img v-else-if="sys.value==10" :src=orange>
                                        <img v-else :src=green>
                                    </v-avatar>
                                </v-flex>
                                <v-flex d-flex style="align-items:center;justify-content:left;font-size:14px;width: 100%;">{{sys.system}}</v-flex>
                            </v-layout>
                        </v-layout>
                    </v-flex>
                    <v-flex >
                        <v-layout fill-height column>
                            <v-layout v-for="sys in data[1]" :key="sys" row>
                                 <v-flex style="justify-content:center;align-items:center;">
                                    <v-avatar style="height:5px;width:5px;" >
                                        <img v-if="sys.value==20" :src=red>
                                        <img v-else-if="sys.value==10" :src=orange>
                                        <img v-else :src=green>
                                    </v-avatar>
                                </v-flex>
                                <v-flex d-flex style="align-items:center;justify-content:left;font-size:14px;width: 100%">{{sys.system}}</v-flex>
                            </v-layout>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script>

    export default {
        name: "SubsystemState",
        components: {
        },
        props: {
            data:Array
        },
        data: function () {
            return {
                red:require('../assets/RedLight.png'),
                orange:require('../assets/OrangeLight.png'),
                green:require('../assets/GreenLight.png')

            }
        },
        methods: {
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
