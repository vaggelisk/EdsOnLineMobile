<template>
    <v-card v-if="typeof cardData != 'undefined'" fill-height :flat="flat" style="height:100%;background-color:transparent;">
        <v-container fluid fill-height grid-list-md style="padding:5px;">
            <v-layout column fill-height>
                <v-flex d-flex md3 style="max-height:25%;justify-content:center;align-items:center;font-size:16px;">
                    {{cardData.title}}
                </v-flex>

                <v-flex v-if="typeof cardData.value == 'undefined' || cardData.value==-1000" d-flex md4 style="max-height:33%;justify-content:center;align-items:center;font-size:30px;font-weight:bold;">
                    -
                </v-flex>
                <v-flex v-else-if="cardData.color==0" d-flex md4 style="max-height:33%;justify-content:center;align-items:center;font-size:30px;font-weight:bold;color:rgb(60, 171, 48)">
                    {{cardData.value.toFixed(cardData.format)}}
                </v-flex>
                <v-flex v-else-if="cardData.color==20" d-flex md4 style="max-height:33%;justify-content:center;align-items:center;font-size:30px;font-weight:bold;color:rgb(205, 57, 64)">
                    {{cardData.value.toFixed(cardData.format)}}
                </v-flex>
                <v-flex v-else d-flex md4 style="max-height:33%;justify-content:center;align-items:center;font-size:30px;font-weight:bold;">
                    {{cardData.value.toFixed(cardData.format)}}
                </v-flex>

                <v-flex d-flex md1 style="max-height:8%;justify-content:center;align-items:center;font-size:16px;">
                    [{{cardData.unit}}]
                </v-flex>

                <!--<v-flex d-flex md2 style="max-height:16%;align-items:flex-end;font-size:16px;font-weight: bold;">-->
                <v-flex d-flex md2 style="max-height:16%; font-size:16px; font-weight: bold; text-align: center">
                    <span>
                        {{ ((typeof cardData.ref == 'undefined' || cardData.ref==-1000) ? '-' : cardData.ref.toFixed(cardData.format)) }}
                    </span>
                </v-flex>
                <v-flex d-flex md2 style="max-height:16%;align-items:center;">Reference</v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>

    export default {
        name: "Card",
        components: {},
        props: {
            cardData: Object,
            flat: Boolean
        },
        data: function () {
            return {}
        },
        methods: {},
        mounted() {},
        watch: {}
    }
</script>

<style scoped>
</style>
