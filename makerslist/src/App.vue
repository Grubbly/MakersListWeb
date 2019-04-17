<template>
  <div id="app">
    <Navbar />
    <router-view/>
    <footer>&copy; 2019 MakersList</footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar,
  }
}
</script>

<style>

</style>
