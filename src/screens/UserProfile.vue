<template>
    <v-container fluid fill-height grid-list-md style="padding:0px 10px 5px 10px;height:100%;width:100%;background-color:white;">
        <v-layout column fill-height>
            <v-layout row style="padding-top:15px;">
                <v-flex md2>
                    <div style="text-align: center">
                        <v-avatar :size="120">
                            <img :src="user" alt="avatar">
                        </v-avatar>
                        </div>
                        <!-- <div style="color:rgb(51,82,128); text-align: center">
                            <br/>
                            <div>New logo</div>
                        </div> -->
                </v-flex>
                <v-flex md10>
                    <v-layout column>
                        <v-flex style="color:rgb(51,82,128); padding:5px; font-size: 36px !important;
                            font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; color:rgb(51,82,128);">
                            Enterprise Shipping & Trading S.A.
                        </v-flex>
                        <v-flex v-for="(field, index) in fields" :key="field" style="padding-top:15px;">
                            <v-layout row>
                                <v-flex md1 style="font-size: 16px !important;
                                    font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;">
                                    {{labels[index]}} :
                                </v-flex>
                                <v-flex md11 style="font-size: 16px !important;
                                    font-weight: 300; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;">
                                    {{profile[field]}}
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!--<v-layout row style="max-height:50px;padding-left:20px;">-->
                <!--<v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="showEditDialog">-->
                   <!--Edit Profile-->
                <!--</v-btn>-->
                <!--<v-btn flat style="color:white; background-color: rgb(51,82,128);height:30px;" @click="showPasswordDialog">-->
                    <!--Change Password-->
                <!--</v-btn>-->
                <!--<v-spacer/>-->
            <!--</v-layout>-->
            <v-dialog v-model="editDialog" width="400" height="350">
                <v-card style="width:400px;height:450px;">
                <v-card-title primary class="title" style="height:15%;">
                    Edit Profile
                </v-card-title>
                <v-card-text  style="height:70%;">
                    <v-layout column fill-height>
                        <v-flex v-for="(field, index) in editFields" :key="field">
                            <v-layout row>
                                <v-flex d-flex md4 style="font-size: 16px !important;
                                    font-weight: 500; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;align-items:center;">
                                    {{labels[index]}}
                                </v-flex>
                                <v-flex d-flex md8 style="font-size: 16px !important;
                                    font-weight: 300; line-height: 1 !important;letter-spacing: 0.02em !important; padding 5px;align-items:center;">
                                    <v-text-field v-model="editModels[field]"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions style="height:15%;">
                    <v-spacer/>
                    <v-btn color="primary" flat @click="cancelDialog">
                        Cancel
                    </v-btn>
                    <v-btn style="color:white; background-color: rgb(51,82,128);" @click="editProfile">
                        OK
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="passwordDialog" width="500" height="350">
                <v-card style="width:500px;height:350px;">
                    <v-card-title primary class="title" style="height:10%;">
                        Change Password
                    </v-card-title>
                    <v-card-text  style="height:75%;overflow:auto;">
                        <v-layout column fill-height>
                            <v-flex d-flex md6>
                                <v-text-field
                                    v-model="password"
                                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                                    :type="showPassword ? 'text' : 'password'"
                                    label="Password"
                                    @click:append="showPassword = !showPassword">
                                </v-text-field>
                            </v-flex>
                            <v-flex d-flex md6>
                                <v-text-field
                                    v-model="passwordConfirmation"
                                    :append-icon="showConfirmation ? 'visibility' : 'visibility_off'"
                                    :type="showConfirmation ? 'text' : 'password'"
                                    label="Password Confirmation"
                                    @click:append="showConfirmation = !showConfirmation">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions style="height:15%;">
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click="cancelDialog">
                            Cancel
                        </v-btn>
                        <v-btn style="color:white; background-color: rgb(51,82,128);" @click="changePassword">
                            OK
                        </v-btn>
                    </v-card-actions>
                    <v-alert
                        class='alert'
                        :value="alert"
                        type="error"
                        transition="scale-transition"
                        color='rgb(205, 57, 64)'
                        outline
                        dismissible
                        @input="closeAlert">
                        The password and the password confirmation do not match.
                    </v-alert>
                </v-card>
            </v-dialog>

        </v-layout>
    </v-container>
</template>

<script>

import {globalStore} from "../main.js"

import axios from 'axios'

  export default {
    name: "UserProfile",
    components: {
    },
    data () {
      return {
            editDialog:false,
            passwordDialog:false,
            editModels:{},
            editFields:['firstname','lastname','displayName'],
            password:'',
            showPassword:false,
            passwordConfirmation:'',
            showConfirmation:false,
            user: require('../assets/estLogo.png'),
            fields:['firstname','lastname','displayName','email'],
            labels:['First Name','Last Name','Username', 'Email'],
            alert:false
      }
    },
    created() {
        for (let i=0;i<this.editFields.length;i++)
        {
            this.editModels[this.editFields[i]]= this.profile[this.editFields[i]];
        }

        if (globalStore.userProfile.company =="Berge Bulk") this.user = require('../assets/bbLogo.png');
        else if (globalStore.userProfile.company =="Win GD") this.user = require('../assets/wingdLogo.jpg');

    },
    mounted() {
    },
    computed: {
      profile: function() {return globalStore.userProfile}
    },
    methods: {
        closeAlert(v) {
            this.alert = false;
        },
        showEditDialog()
        {
            this.editDialog = true;
        },
        showPasswordDialog()
        {
            this.passwordDialog = true;
        },
        cancelDialog()
        {
            if (this.editDialog) this.editDialog = false;
            else if (this.passwordDialog) this.passwordDialog =false;
        },
        editProfile()
        {
            axios.post('http://eds2.propulsionanalytics.com/profile/edit', {
                    firstname:this.editModels['firstname'],
                    lastname:this.editModels['lastname'],
                    displayName:this.editModels['displayName']
                },  {withCredentials: true}
            )
            .then(
                (response) => {
                    for (let i=0;i<this.editFields.length;i++)
                    {
                        globalStore.userProfile[this.editFields[i]]= response.data.user[this.editFields[i]];
                    }
                },
                (error) => {
                }
            );

            this.editDialog = false;
        },
        changePassword()
        {
            if (this.password == this.passwordConfirmation)
            {
                axios.post('http://eds2.propulsionanalytics.com/user/changePassword', {
                        password: this.password,
                        password_confirmation: this.passwordConfirmation
                        },  {withCredentials: true}
                    )
                    .then(
                        (response) => {
                        },
                        (error) => {
                        }
                    );

                this.passwordDialog =false;
            }
            else
            {
                this.alert = true;
            }

        }
    },
    watch:
    {
    }

  }

</script>

<style scoped>

</style>
