<template>
    <v-card flat fill-height style="height:100%;">
        <v-card-title primary class="title" style="height:10%;">Subsystems state</v-card-title>
        <v-card-actions fill-height style="height:90%;">
            <v-container fluid fill-height grid-list-md style="padding:10px;">
                <v-layout row>
                    <v-flex d-flex md6>
                        <v-layout fill-height column>
                            <v-layout v-for="sys in data[0]" :key="sys" row>
                                <v-flex  d-flex md3 style="justify-content:center;align-items:center;">
                                    <v-avatar style="height: 5px;width: 5px;" flat>
                                        <img v-if="sys.value==20" :src=red>
                                        <img v-else-if="sys.value==10" :src=orange>
                                        <img v-else :src=green>
                                    </v-avatar>
                                </v-flex>
                                <v-flex md9 d-flex style="align-items:center;font-size:14px;">{{sys.system}}</v-flex>
                            </v-layout>
                        </v-layout>
                    </v-flex>
                    <v-flex d-flex md6>
                        <v-layout fill-height column>
                            <v-layout v-for="sys in data[1]" :key="sys" row>
                                 <v-flex  d-flex md3 style="justify-content:center;align-items:center;">
                                    <v-avatar style="height: 5px;width: 5px;" flat>
                                        <img v-if="sys.value==20" :src=red>
                                        <img v-else-if="sys.value==10" :src=orange>
                                        <img v-else :src=green>
                                    </v-avatar>
                                </v-flex>
                                <v-flex md9 d-flex style="align-items:center;font-size:14px;">{{sys.system}}</v-flex>
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
