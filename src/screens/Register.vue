<template>
    <div>
        <h4>Register</h4>
        <h4>{{$store.getters.loggedIn}}</h4>
        <h4>{{auth}}</h4>
        <form>
            <label for="email" >E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>
            <div>
                <label for="password" >Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                <button type="submit" @click="handleSubmit">
                    Login
                </button>
            </div>
        </form>
        <div>
            <button  @click="bringProfile">
                Bring Profile
            </button>
        </div>
    </div>
</template>

<script>
    const auth = localStorage.auth;

    export default {
        name: 'Register',
        data(){
            return {
                auth: auth,
                email : "",
                password : "",
                bodyFormData : { email: 'ek@oa.com', password: 'Ek2018!@' },
            }
        },
        methods : {
            handleSubmit(e){
                e.preventDefault();
                if (this.password.length > 0) {
                    this.$http.post('http://localhost:8000/login', {
                            email: this.email,
                            password: this.password,
                        },
                        {withCredentials: true  }
                    )
                        .then(response => {
                            console.log(response)
                            console.log(response.data)
                            console.log(window.csrf_token)
                            if (response.status===200) {
                                // router.replace('/dashboard')

                            }
                        })
                        .catch(function (error) {
                            console.error(error.response);
                        });
                }
            },
            bringProfile(){
                // this.$http.post('http://localhost:8000/profile', {},  { withCredentials: true  , headers: { Cookie: 'jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozLCJlbWFpbCI6ImVrQHBhLmNvbSIsImV4cCI6MTU1NjE5MzcyNX0.SeNzpcFeFaieDYUuLku9ZTqcCB0u6Q22mbXUPpOm1EU'}})
                this.$http.post('http://localhost:8000/profile', {},  { withCredentials: true   })
                    .then(response => {
                        console.log("the profile is: ")
                        console.log(response.data)
                    })
            }

        }
    }
</script>

<style lang="css">
    body {
        background: #605B56;
    }

    .login-wrapper {
        background: #fff;
        width: 70%;
        margin: 12% auto;
    }

    .form-signin {
        max-width: 330px;
        padding: 10% 15px;
        margin: 0 auto;
    }
    .form-signin .form-signin-heading,
    .form-signin .checkbox {
        margin-bottom: 10px;
    }
    .form-signin .checkbox {
        font-weight: normal;
    }
    .form-signin .form-control {
        position: relative;
        height: auto;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 10px;
        font-size: 16px;
    }
    .form-signin .form-control:focus {
        z-index: 2;
    }
    .form-signin input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
    .form-signin input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
</style>


