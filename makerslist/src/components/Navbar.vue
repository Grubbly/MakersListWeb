<template>
    <div class="navbar">
        <!-- Position nav at top of page -->
        <nav class="nav-extended cyan darken-4">
            <div class="nav-content">
                <router-link :to="{name: 'Index'}">
                    <img  src='/static/DepthLogo.png' width=120px height=100px style="vertical-align: middle;"/>
                    <span class="nav-title">
                        MakersList
                    </span>
                </router-link>

                <ul class="right">
                    <li v-if="!user"><router-link :to="{ name: 'Signup'}">Signup</router-link></li>
                    <li v-if="!user"><router-link :to="{name: 'Login'}">Login</router-link></li>
                    <li v-if="user && id"><router-link :to="{name: 'ViewProfile', params: {id: this.id}}">{{user.email}}</router-link></li>
                    <li v-if="user && id"><a @click="logout">Logout</a></li>
                </ul>

                <!-- halfway-fab pushes button halfway beyond nav boundary -->
                <a v-if="user" href="" class="btn-floating btn-large halfway-fab orange">
                    <router-link v-if="user && id" :to="{name: 'AddList', params: {id: this.id}}">
                        <!-- <i> for icon "add" is the name of the icon -->
                        <i class="material-icons">add</i>
                    </router-link>
                </a>
            </div>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Navbar',
    data() {
        return {
            user: null,
            id: null,
        }
    },
    methods: {
        logout() {
            firebase.auth().signOut().then(() => {
                this.$router.push({name: 'Login'})
            })
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.user = user
                db.collection('users').get().then(users => {
                    users.docs.forEach(doc => {
                        // In case of (impossible?) collision this needs better redundancy
                        this.id = doc.id
                    });
                })
            } else {
                this.user = null
            }
        })
    }
}
</script>

<style>
.navbar nav {
    padding: 0 20px;
}

.navbar router-link {
    font-size: 2.4em;
}
</style>
