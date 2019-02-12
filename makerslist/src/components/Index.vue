<template>
<!-- container makes a central column on the page so text doesn't hug the browser edges -->
  <div class="index container">
    <div class="card cyan darken-4" v-for="list in lists" :key="list.id">
      <div class="card-content">
        <i class="material-icons delete" @click="deleteList(list.id)">delete</i>
        <h2 class="white-text">{{list.title}}</h2>
        <ul class="items">
          <div>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-for="(item, index) in list.items" :key="index">
                <div slot="header">
                  <span class="cyan-text text-darken-4"> ({{list.quantities[index]}}) </span>
                  <span> {{item}} </span>
                </div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    <ul>
                      <!-- !!!!! THIS IS TEMPORARY DEBUG CHANGE ME !!!!! -->
                      <span v-for="(item,index) in list.items" :key="index" class="first">
                        <li class="chip waves-effect waves-green btn-large">
                          <i class="material-icons">attach_money</i> Amazon: ${{list.prices[index]}}</li>
                      </span>
                      <!-- <span class="second"><li class="chip waves-effect waves-light btn-large">Earbay: ${{list.prices[index]}}</li></span>
                      <span class="third"><li class="chip waves-effect waves-light btn-large">OldEgg: ${{list.prices[index]}}</li></span> -->
                    </ul>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
        </ul>
      </div>
      <span class="totalPrice" style="position: absolute;">
          <h2 class="green-text text-darken-2 chip">${{list.total}}</h2>
      </span>
      <span class="btn-floating btn-large halfway-fab orange">
        <router-link :to="{name: 'EditList', params: {list_slug: list.slug} }">
          <i class="material-icons edit">edit</i>
        </router-link>
      </span>
    </div>
  </div>
</template>

<script>

import db from '@/firebase/init'

export default {
  name: 'Index',
  props: ['filter'],
  data () {
    return {
      lists: [
        // slug: is a URL friendly version of the title.
      ],
    }
  },
  methods: {
    deleteList(id) {
      // Delete from firestore

      // Get a reference to the doc
      // When the doc is deleted, fire the .then to update the frontend
      db.collection('lists').doc(id).delete().then(() => {
        this.lists = this.lists.filter (list => {
          return list.id !== id
        })
      })
    }
  },
  created() {
    console.log(this.filter)
    // fetch data from firestore
    // snapshot refers to the state of the lists collection at a certain point in time
    db.collection('lists').get().then(snapshot => {
      snapshot.forEach(dbList => {
        let list = dbList.data()
        list.id = dbList.id
        this.lists.push(list)
      })
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.index {
  /* display items side by side with three items per row */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-top: 60px;
  max-width: 80%;
}

.index h2 {
  font-size: 2em;
  text-align: center;
  margin-top: 0px;
}

.index .items {
  margin: 30px auto;
}

.index .first li {
  display: inline-block;
}

.index .first i {
  vertical-align: middle;
}

.index .delete {
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    color:#f9e4e4;
    font-size: 2em;
}

.index .totalPrice {
    position: absolute;
    bottom: 4px;
    left: 5px;
    cursor: pointer;
}

.index .first .btn-large {
  text-transform: none;
  background-color:springgreen;
}

.index .first .btn-large:hover {
  background-color: chartreuse
}

.index .second .btn-large {
  text-transform: none;
  background-color: orange;
}

.index .second .btn-large:hover {
  background-color: yellow;
}

.index .third .btn-large {
  text-transform: none;
  background-color: tomato;
}

.index .third .btn-large:hover {
  background-color:red;
}

</style>
