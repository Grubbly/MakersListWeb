<template>
    <v-container fluid grid-list-sm>
        <v-layout row wrap>
        <v-flex d-flex xs12 sm3 offset-sm2>
            <v-card>
                <v-container grid-list-sm fluid grey lighten-3>
                <v-layout row wrap>
                    <v-flex v-for="n in 9" :key="n" xs4 d-flex>
                    <v-card flat tile class="d-flex">
                        <v-img
                        :src="`https://picsum.photos/500/300?image=${Math.floor(n * (Math.random()*100) + 50)}`"
                        :lazy-src="`https://picsum.photos/10/6?image=${Math.floor(n * (Math.random()*100) + 50)}`"
                        aspect-ratio="1"
                        class="cyan darken-4"
                        >
                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                            <v-progress-circular indeterminate color="cyan"></v-progress-circular>
                        </v-layout>
                        </v-img>
                    </v-card>
                    </v-flex>
                </v-layout>
                </v-container>
            </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm5>
            <v-card color="grey lighten-3" dark tile>
            <h2 class="cyan-text text-darken-4 center">List-View</h2>
            <v-card-text class="grey-text text-darken-1">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat ex voluptate sit repudiandae officia 
                ea consequatur quo possimus! Commodi ex vitae, eaque eum tempore corrupti aut culpa perferendis molestias repellendus.</v-card-text>
            </v-card>
        </v-flex>
        </v-layout>
  </v-container>
</template>

<script>
import db from '@/firebase/init'

export default {
    name: 'ListView',
    data() {
        return {
            list: null,
        }
    },
    created() {
        let list = db.collection('lists').where('slug', '==', this.$route.params.list_slug)
        list.get().then(snapshot => {
            snapshot.forEach(doc => {
                this.list = doc.data()
            })
        })
    }
}
</script>

<style>
.listview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
    max-width: 80%;
}

.listview .gallery {
    margin-bottom: 60px;
}

.listview h2 {
    font-size: 10em;
}
</style>

