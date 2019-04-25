<template>
    <v-btn @click="toggleFav" v-if="favorited" flat icon :color="active">
        <v-icon>favorite</v-icon>
    </v-btn>
    <v-btn @click="toggleFav" v-else flat icon :color="disabled">
        <v-icon>favorite</v-icon>
    </v-btn>
</template>
 
<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Favorite',
    data() {
        return {
            favorited: false,
            disabled: 'grey',
            active: 'pink',
        }
    },
    props: {
      list: null,
    },
    methods:{
      toggleFav(){
        this.favorited = !this.favorited
        this.$emit('toggleFav', this.$props.list.id)
      }
    },
    created() {
      firebase.auth().onAuthStateChanged((user) => {
          if(user) {
            db.collection('users').where('user_id', '==', user.uid).get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                if(doc.data().favorites !== undefined) {
                  doc.data().favorites.forEach(fav => {
                    if(fav === this.$props.list.id) {
                      this.favorited = true
                    }
                  })
                }
              });
            });
          }
      })
    }
}
</script>