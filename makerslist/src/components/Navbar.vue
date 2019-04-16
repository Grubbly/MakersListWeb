<template>
    <div class="navbar">
        <div class="navbar-fixed cyan darken-4">
            <nav class="cyan darken-4">
            <div class="nav-wrapper" style="max-width=">
                <router-link :to="{name: 'Index'}" class="brand-logo">
                    <img src='/static/DepthLogo.png' width=80px height=80px/>
                </router-link>
                <router-link :to="{name: 'Index'}" class="brand-logo">
                    MakersList
                </router-link>
                <nav class="search">
                  <v-text-field
                    hide-details
                    prepend-icon="search"
                    single-line
                    v-model="search"
                    placeholder="Search Lists"
                    autofocus="true"
                    color="cyan darken-4"
                    class="text-white"
                  ></v-text-field>
                </nav>
                <ul class="right hide-on-med-and-down">
                    <li v-if="!user"><router-link :to="{name: 'Signup'}">Signup</router-link></li>
                    <li v-if="!user"><router-link :to="{name: 'Login'}">Login</router-link></li>
                    <li><router-link :to="{name: 'About'}">About</router-link></li>
                    <li v-if="user && id && alias"><router-link :to="{name: 'ViewProfile', params: {id: this.alias}}">{{user.email}}</router-link></li>
                    <li v-if="user && id && alias"><a @click="logout">Logout</a></li>
                </ul>

                <a v-if="user" href="" class="btn-floating btn-large halfway-fab orange">
                    <router-link v-if="user && id" :to="{name: 'AddList', params: {id: this.alias}}">
                        <!-- <i> for icon "add" is the name of the icon -->
                        <i class="material-icons">add</i>
                    </router-link>
                </a>
            </div>
            </nav>
        </div>
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
        alias: null,
        id: null,
        search: ''
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
            this.id = user.uid;
            db.collection('users').where('user_id', '==', user.uid).get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                this.alias = doc.id
              });
            });
          }
          else {
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
