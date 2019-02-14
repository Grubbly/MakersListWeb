<template>
    <v-container v-if="list" fluid grid-list-sm>
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
            <h2 class="cyan-text text-darken-4 center">{{list.title}}</h2>
            <v-card-text class="cyan-text text-darken-4">Summary: 
                <v-card-text class="grey-text text-darken-1">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat ex voluptate sit repudiandae officia 
                ea consequatur quo possimus! Commodi ex vitae, eaque eum tempore corrupti aut culpa perferendis molestias repellendus.</v-card-text>
            </v-card-text>
            </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm8 offset-sm2 class="itempanel">
            <v-card>
                <v-container grid-list-xl fluid grey lighten-3>
                <v-layout row wrap>
                    <v-flex v-for="(item,index) in list.items" :key="index" xs3 d-flex>
                          <v-card class="card">
                            <div class="card-image">
                                <img class="activator" :src="`https://picsum.photos/500/300?image=${Math.floor(n * (Math.random()*30))}`">
                            </div>
                            <div class="card-content">
                                <span class="card-title activator cyan-text text-darken-4">{{item}}<i class="material-icons right">more_vert</i></span>
                            <p><a href="#">Buy it now</a></p>
                            </div>
                            <div class="card-reveal">
                                <span class="card-title cyan-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                <p>Here is some more information about this product that is only revealed once clicked on.</p>
                            </div>
                        </v-card>
                    </v-flex>
                    </v-layout>
                </v-container>
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

.itempanel {
    margin-top: 30px;
}
</style>

