<template>
<!-- container makes a central column on the page so text doesn't hug the browser edges -->
  <div class="index container">
    <div class="card orange" v-for="list in lists" :key="list.id">
      <div class="card-content">
        <h2 class="white-text">{{list.title}}</h2>
        <ul class="items">
          <li v-for="(item,index) in list.items" :key="index"><span class="chip">{{item}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      lists: [
        // slug: is a URL friendly version of the title.
        {title: 'Drone Parts', slug: 'drone-parts', items: ['carbon fiber frame', 'motors', 'props', 'cc3d', 'pdb'], id:'1'},
        {title: 'Robot Parts', slug: 'robot-parts', items: ['plexiglass', 'motors', 'raspberry pi'], id:'2'},
      ]
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
</style>
