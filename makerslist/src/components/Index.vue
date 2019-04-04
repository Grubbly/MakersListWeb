<template>
<!-- container=bogus makes a central column on the page so text doesn't hug the browser edges -->
  <div class="bogus2 card grey lighten-3" style="padding-top: 0.01px;">
    <nav class="cyan grey lighten-4" style="max-width: 90%; margin-left: 5%;">
      <div class="navbar grey lighten-4">
        <div class="bogus2">
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
        </div>
      </div>
    </nav>
    <div class="index bogus2">
    <div v-for="(list,index) in filteredLists.slice((this.page-1)*6, this.page*6 < filteredLists.length ? this.page*6 : filteredLists.length)" :key="list.id">
      <div class="card-content">
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            class="mx-auto"
            color="grey lighten-4"
            max-width="600"
          >
            <v-carousel
              hide-delimiters="true"
              delimiter-icon="stop"
              prev-icon="mdi-arrow-left"
              next-icon="mdi-arrow-right"
              height="200px"
            >
            <v-carousel-item
              v-for="(item,i) in getPics(list)"
              :key="i"
              :src="item"
            >
            </v-carousel-item>

            <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="cyan"></v-progress-circular>
            </v-layout>
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text text-lighten-4"
                  style="height: 100%;"
                >
                  ${{list.total}}
                </div>
              </v-expand-transition>
           </v-carousel>
            <v-card-text
              class="pt-4"
              style="position: relative;"
            >


            <!-- Drop down menu for edit and delete options here? -->


            <!-- <router-link :to="{name: 'EditList', params: {list_slug: list.slug} }">
              <v-btn
                absolute
                color="orange"
                class="white--text"
                fab
                large
                right
                top
              >
                <i class="material-icons edit">edit</i>
              </v-btn>
              </router-link> -->
              <RadialButton class="edit" v-on:delete="deleteList($event)" :list="list"/>
              <div class="font-weight-light grey--text title mb-2">Quick Description</div>
              <router-link :to="{name: 'ListView', params: {list_slug: list.slug}}">
                <h3 class="display-1 font-weight-light orange--text mb-2">{{list.title}}</h3>
                <h6 class="green-text text-lighten-2">${{list.total}}</h6>
              </router-link>

                <!-- Maybe take this out? -->
                <!-- <div class="font-weight-light grey--text title mb-2">Items:</div> -->

                <v-expansion-panel expand>
                  <v-expansion-panel-content class="grey lighten-2">
                    <div slot="header">
                      <span> Items </span>
                    </div>
                    <v-expansion-panel expand>
                      <v-expansion-panel-content v-for="(item, index) in list.items" :key="index">
                        <div slot="header">
                          <span> {{item}} </span>
                          <span class="cyan-text text-darken-4"> ({{list.quantities[index]}}) </span>
                        </div>
                        <v-card>
                          <v-card-text class="grey lighten-3">
                              <div class="collection">
                                <a v-for="(itemDetail, detailIndex) in list.itemDetails[index]" :key="detailIndex" :href="itemDetail.url" 
                                  class="collection-item cyan-text text-darken-4">
                                  <h5 class="orange-text">{{itemDetail.supplierName}}</h5> 
                                  {{itemDetail.productName}} 
                                  <p class="green-text">${{itemDetail.price}}</p>
                                </a>
                              </div>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card-text>
          </v-card>
        </v-hover>
        <!-- !!!!! NEED TO ENSURE SLUGS ARE UNIQUE !!!!! -->
      </div>
      <!-- <span class="totalPrice">
          <h2 class="green-text text-lighten-3">${{list.total}}</h2>
      </span> -->
      </div>
    </div>
      <div class="text-xs-center">
        <v-pagination
          v-model="page"
          :length="Math.ceil(lists.length/6)"
          :total-visible="7"
          color="cyan darken-4"
        ></v-pagination>
      </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import RadialButton from '@/components/RadialButton'
import Vue from 'vue'

export default {
  name: 'Index',
  props: ['filter'],
  data () {
    return {
      lists: [
        // slug: is a URL friendly version of the title.
      ],
      search: '',
      page: 1,
    }
  },
  components: {
    RadialButton,
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
    },

    totalPrice(itemDetails, quantities) {
      if(itemDetails[0] === undefined)
        return 0

      let sum = 0
      itemDetails.forEach((item,index) => {
        if(item[0] === undefined || item[1] === undefined || item[2] === undefined)
          return 0

        // console.log(itemDetails, " ---- ", quantities, " ---- min: ", Math.min(Number(item[0].price),Number(item[1].price),Number(item[2].price)), " quantity: ", Number(quantities[index]), "TOTAL:", Math.min(Number(item[0].price),Number(item[1].price),Number(item[2].price))*Number(quantities[index]))
        sum += Math.min(Number(item[0].price),Number(item[1].price),Number(item[2].price))*Number(quantities[index])
      })
      return Math.round(sum*100)/100
    },

    getPics(list) {
      let images = []
      list.itemDetails.forEach(item => {
          for (let index = 0; index < 3; index++) {
              if(item[index] !== undefined) {
                  images.push(item[index].imageUrl)
              }
          }
      })
      return images
    }
  },
  created() {
    // fetch data from firestore
    // snapshot refers to the state of the lists collection at a certain point in time

    let itemsReference = db.collection('items')
    let listsReference = db.collection('lists')

    itemsReference.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          listsReference.get().then(snapshot => {
              snapshot.forEach(dbList => {
                let newItems = dbList.data().itemDetails
                dbList.data().items.forEach((item, index) => {
                  if(item === change.doc.id) {
                    // console.log(dbList.data().title, "item update with change.id", change.doc.id)
                    newItems[index] = change.doc.data()
                    
                      let keysSorted = Object.keys(newItems[index]).sort(function(a,b){
                      let price1 = Number(newItems[index][a].price)
                      let price2 = Number(newItems[index][b].price)

                      if(price1 < price2)
                        return -1
                      if(price1 > price2)
                        return 1
                      return -1
                    })
                    
                    let temp = newItems[index]
                    
                    keysSorted.forEach((key,keyIndex) => {
                      temp[keyIndex] = newItems[index][key]
                    })
                    newItems[index] = temp
                  }
                })
                if(newItems !== undefined) {
                  listsReference.doc(dbList.id).update({
                      itemDetails: newItems,
                      total: this.totalPrice(newItems, dbList.data().quantities),
                  }).catch( err => {
                      console.log(err)
                  })
                }
              })
          }).catch( err => {
              console.log(err)
          })
        });
    })

    // Listen for changes in the lists collection
    // Every CUD operation on the database calls this function
    // docChanges() returns a snapshot of the whole database
    listsReference.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type !== "removed") {
            this.lists.forEach((list,index) => {
              if(list.title == change.doc.data().title) {
                Vue.set(this.lists, index, change.doc.data())
              }
            })
          }
        });
    })

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
  computed: {
    filteredLists: function() {
      return this.lists.filter((list) => {
        return list.title.toLowerCase().match(this.search.toLowerCase())
      })
    }
  }
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
  text-align: left;
  margin-top: -10px;
  margin-bottom: 20px;
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
    top: 32px;
    right: 32px;
    cursor: pointer;
    color:#f9e4e4;
    font-size: 2em;
}

.index .edit{
    position: absolute;
    right: 15px;
    top: -25px;
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

.index .v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
</style>
