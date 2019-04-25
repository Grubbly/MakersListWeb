<template>
    <div class="navbar">
        <div class="navbar-fixed cyan darken-4">
            <nav class="cyan darken-4">
            <div class="nav-wrapper" style="max-width=">
              <div class="brand">
                <router-link :to="{name: 'Index'}" class="brand-logo">
                    <img src='/static/img/logo.svg' width=50px height=50px/>
                </router-link>
                <router-link :to="{name: 'Index'}" class="brand-logo text-title">
                    MakersList
                </router-link>
              </div>
                <nav class="search">
                  <v-text-field
                    hide-details
                    prepend-icon="search"
                    single-line
                    v-model="search"
                    placeholder="Search Lists"
                    color="cyan darken-4"
                    class="text-white"
                    @change="searchChange"
                    @input="searchChange"
                  ></v-text-field>
                </nav>
                <ul class="right">
                    <li v-if="!user"><router-link :to="{name: 'Signup'}">Signup</router-link></li>
                    <li v-if="!user"><router-link :to="{name: 'Login'}">Login</router-link></li>
                    <li class="create"><router-link v-if="user && id" :to="{name: 'AddList', params: {id: this.alias}}">
                        CREATE
                    </router-link></li>
                    <li v-if="user && id && alias"><router-link :to="{name: 'ViewProfile', params: {id: this.alias}}">
                      <img class="account" src='/static/img/placeholder.png'/>Account</router-link>
                    </li>
                    <li v-if="user && id && alias"><a @click="logout">Logout</a></li>
                </ul>
            </div>
            </nav>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import { EventBus } from '../event.js'

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
            this.$router.push({name: 'Index'})
          })
        },

        searchChange() {
          EventBus.$emit('searchChange', this.search)
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
