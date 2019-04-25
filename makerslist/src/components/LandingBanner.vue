<template>
  <section class="landingBanner">
    <v-carousel
      height="340px"
    >
    <v-carousel-item
      v-for="(item,i) in getLandingBanners()"
      :key="i"
      :src="item"
    >
    </v-carousel-item>
   </v-carousel>
  </section>
</template>


<script>
import db from '@/firebase/init'

export default {
  name: 'LandingBanner',
  components: {
  },
  props: {
      list: null,
  },
  data () {
    return {
    }
  },
  methods: {
    getLandingBanners(index) {
      return ["/static/img/logo.svg", "/static/img/logo.svg", "/static/img/logo.svg"]
    }
  },
}
</script>
