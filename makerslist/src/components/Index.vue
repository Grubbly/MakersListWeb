<template>
<!-- container=bogus makes a central column on the page so text doesn't hug the browser edges -->
  <div class="index bogus2">
    <div class="card cyan darken-4" v-for="list in lists" :key="list.id">
      <div class="card-content">
        <i class="material-icons delete" @click="deleteList(list.id)">delete</i>
        <!-- !!!!! NEED TO ENSURE SLUGS ARE UNIQUE !!!!! -->
        <router-link :to="{name: 'ListView', params: {list_slug: list.slug}}"><h2 class="white-text">{{list.title}}</h2><h6 class="green-text text-lighten-2">${{list.total}}</h6></router-link>
        <ul class="items">
          <div>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-for="(item, index) in list.items" :key="index">
                <div slot="header">
                  <span> {{item}} </span>
                  <span class="cyan-text text-darken-4"> ({{list.quantities[index]}}) </span>
                </div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                      <div class="collection">
                        <a v-for="(item,priceIndex) in 3" :key="priceIndex" :href="list.urls[3*index + priceIndex]" 
                          class="collection-item cyan-text text-darken-4">
                          <h5 class="orange-text">{{list.supplierNames[index]}}</h5> 
                          {{list.productNames[3*index + priceIndex]}} 
                          <p class="green-text">${{list.prices[3*index + priceIndex]}}</p>
                        </a>
                      </div>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
        </ul>
      </div>
      <!-- <span class="totalPrice">
          <h2 class="green-text text-lighten-3">${{list.total}}</h2>
      </span> -->
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
    // fetch data from firestore
    // snapshot refers to the state of the lists collection at a certain point in time

    if(this.filter) {
      db.collection('lists').where('user_id', '==', this.filter).get().then(snapshot => {
        snapshot.forEach(dbList => {
          let list = dbList.data()
          list.id = dbList.id
          this.lists.push(list)
        })
      })
    } else {
      db.collection('lists').get().then(snapshot => {
        snapshot.forEach(dbList => {
          let list = dbList.data()
          list.id = dbList.id
          this.lists.push(list)
        })
      })
    }
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
  max-width: 80%;
}

.bogus2 {
    margin:60px auto;
    max-width: 1250px;
    width:90%
}

.index h2 {
  font-size: 2em;
  text-align: center;
  margin-top: 0px;
}

.index h5 {
  font-size: 1em;
  text-align: left;
}

.index h6 {
  font-size: 1em;
  text-align: center;
  margin-top: -15px;
}

.index .items {
  margin: 30px auto;
}

.first li {
  display: inline-block;
}

.first i {
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
    bottom: -10px;
    left: 40%;
    text-align: center;
    cursor: pointer;
    
}

.first .btn-large {
  text-transform: none;
  background-color:springgreen;
}

.first .btn-large:hover {
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
