<template>
  <div id="app">
    <radial-menu
      class = "orange"
      style="background-color: white"
      :itemSize="50"
      :radius="100"
      :angle-restriction="180">
        <radial-menu-item 
          v-for="(item, index) in items" 
          :key="index" 
          class = "cyan darken-4"
          @click="() => handleClick(item)">
          <span><v-icon dark color="white">{{item}}</v-icon></span>
        </radial-menu-item>
      </radial-menu>
  </div>
</template>

<script>
import RadialMenu from '@/components/RadialMenu'
import RadialMenuItem from '@/components/RadialMenuItem'
import db from '@/firebase/init'

export default {
  name: 'app',
  components: {
    RadialMenu,
    RadialMenuItem
  },
  props: {
      list: null,
  },
  data () {
    return {
      items: ['edit', 'delete', 'list_alt'],
      lastClicked: 'click on something!'
    }
  },
  methods: {
    handleClick (item) {
      if(item == 'edit') {
          this.$router.push({name: 'EditList', params: {list_slug: this.$props.list.slug} })
      } else if(item == "delete") {
          this.$emit('delete', this.$props.list.id)
      } else if (item == 'list_alt') {
          this.$router.push({name: 'ListView', params: {list_slug: this.$props.list.slug} })
      }
    },
  },
}
</script>