<template>
    <div class="login bogus">
        <form @submit.prevent="login" class="card-panel">
            <h2 class="center cyan-text text-darken-4">Login</h2>
            <div class="field">
                <label for="email">Email:</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <p v-if="feedback" class="red-text center">{{feedback}}</p>
            <div class="field center">
                <button class="btn cyan darken-4">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'Login',
    data() {
        return {
            email: null,
            password: null,
            feedback: null,
        }
    },
    methods: {
        login() {
            if(this.email && this.password) {
                firebase.auth().signInWithEmailAndPassword(
                    this.email,
                    this.password
                ).then(cred => {
                    this.$router.push({name: 'Index'})
                }).catch(err => {
                    this.feedback = err.message
                })
                this.feedback = null
            } else {
                this.feedback = "Please fill in both fields"
            }
        }
    }
}
</script>

<style>
.login {
    margin-top: 60px;
}

.bogus {
    margin:0 auto;
    max-width: 600px;
    width:90%
}

.login h2 {
    font-size: 2.4em;
}

.login .field {
    margin-bottom: 16px;
}
</style>

