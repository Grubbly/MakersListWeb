<template>
<!-- container makes a central column on the page so text doesn't hug the browser edges -->
  <div class="index container">
    <div class="card orange" v-for="list in lists" :key="list.id">
      <div class="card-content">
        <i class="material-icons delete" @click="deleteList(list.id)">delete</i>
        <h2 class="white-text">{{list.title}}</h2>
        <ul class="items">
          <li v-for="(item,index) in list.items" :key="index"><span class="chip">{{item}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import db from '@/firebase/init'

export default {
  name: 'Index',
  data () {
    return {
      lists: [
        // slug: is a URL friendly version of the title.
      ]
    }
  },
  methods: {
    deleteList(id) {
      this.lists = this.lists.filter(list => {
        return list.id !== id
      })
    }
  },
  created() {
    // fetch data from firestore
    // snapshot refers to the state of the lists collection at a certain point in time
    db.collection('lists').get().then(snapshot => {
      snapshot.forEach(dbList => {
        let list = dbList.data()
        list.id = dbList.id
        this.lists.push(list)
      })
    })
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
  margin-top: 60px;
}

.index h2 {
  font-size: 2em;
  text-align: center;
  margin-top: 0px;
}

.index .items {
  margin: 30px auto;
}

.index .items li {
  display: inline-block;
}

.index .delete {
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    color:#f9e4e4;
    font-size: 2em;
}
</style>
