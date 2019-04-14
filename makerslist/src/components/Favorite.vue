<template>
    <v-btn @click="toggleFav" v-if="favorited" flat icon :color="active">
        <v-icon>favorite</v-icon>
    </v-btn>
    <v-btn @click="toggleFav" v-else flat icon :color="disabled">
        <v-icon>favorite</v-icon>
    </v-btn>
</template>
 
<script>
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
    }
}
</script>