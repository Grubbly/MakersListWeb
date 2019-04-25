<template>
    <v-container v-if="list" fluid grid-list-sm>
        <v-layout row wrap>
        <v-flex d-flex xs12 sm3 offset-sm2>
            <v-card class="listview-grid">
                <v-container grid-list-sm fluid grey lighten-3>
                <v-layout row wrap>
                    <v-flex v-for="n in 9" :key="n" xs4 d-flex>
                    <v-card flat tile class="d-flex">
                        <v-img
                        :src=randomPic()
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

                <v-tabs v-model="tab" color="cyan darken-4" grow slider-color="orange">
                    <v-tabs-slider color="orange"></v-tabs-slider>
                    <v-tab
                    v-for="view in viewTypes"
                    :key="view" class="white-text"
                    >
                    {{ view }}
                    </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                <v-tab-item>

                <v-container id="photoView" grid-list-xl fluid grey lighten-3>
                <v-layout row wrap>
                    <v-flex v-for="(item,index) in list.items" :key="index" xs3 d-flex>
                          <v-card class="card">
                            <div class="card-image">
                                <v-img
                                    :src="itemPic(list.itemDetails[index])"
                                    :lazy-src="`https://picsum.photos/10/6?image=${Math.floor(index * (Math.random()*20) + 50)}`"
                                    aspect-ratio="1"
                                    class="cyan darken-4"
                                    >
                                    <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
                                    </v-layout>
                                </v-img>
                            </div>
                            <div class="card-content">
                                <span class="card-title activator cyan-text text-darken-4">{{item}} ({{list.quantities[index]}})<i class="material-icons right">more_vert</i></span>
                                <h6 class="green-text text-lighten-1">Starting at: ${{minPrice(list.itemDetails[index])}}</h6>

                            <div class="text-xs-left">
                                <v-dialog
                                v-model="dialog[index]"
                                width="500"
                                >
                                <v-btn
                                    slot="activator"
                                    color="cyan darken-3"
                                    dark
                                >
                                    Puchasing options
                                </v-btn>

                                <v-card class="white-text">
                                    <v-card-title
                                    class="headline cyan darken-4"
                                    primary-title
                                    >
                                    Puchasing Options
                                    </v-card-title>

                                    <v-card-text class="grey-text text-darken-1">
                                        <div class="collection">
                                            <a v-for="(detail,detailIndex) in detailList(list.itemDetails[index])" :key="detailIndex" :href="detail.url"
                                            class="collection-item cyan-text text-darken-4">
                                            <h5 class="orange-text">{{detail.productName}} </h5>
                                            {{detail.supplierName}}
                                            <p class="green-text">${{detail.price}}</p>
                                            </a>
                                        </div>
                                    </v-card-text>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary"
                                        flat
                                        @click="resetDialog(index)"
                                    >
                                        Exit
                                    </v-btn>
                                    </v-card-actions>
                                </v-card>
                                </v-dialog>
                            </div>
                            </div>
                            <div class="card-reveal">
                                <span class="card-title cyan-text text-darken-4">{{item}}<i class="material-icons right">close</i></span>
                                <p>{{itemDescription(list.itemDetails[index])}}</p>
                            </div>
                        </v-card>
                    </v-flex>
                    </v-layout>
                </v-container>
                </v-tab-item>

                <v-tab-item>
                   <v-expansion-panel expand>
                    <v-expansion-panel-content v-for="(item, index) in list.items" :key="index">
                        <div slot="header">
                        <span> {{item}} </span>
                        <span class="cyan-text text-darken-4"> ({{list.quantities[index]}}) </span>
                        </div>
                        <v-card>
                        <v-card-text class="grey lighten-3">
                            <div class="collection">
                                <a v-for="(detail,detailIndex) in list.itemDetails[index]" :key="detailIndex" :href="detail.url"
                                class="collection-item cyan-text text-darken-4">
                                <h5 class="orange-text">{{detail.supplierName}}</h5>
                                {{detail.productName}}
                                <p class="green-text">${{parseFloat(detail.price).toFixed(2)}}</p>
                                </a>
                            </div>
                        </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-tab-item>
            </v-tabs-items>
            </v-card>
        </v-flex>
        </v-layout>
  </v-container>
</template>

<script>
import db from '@/firebase/init'
import Vue from 'vue'

export default {
    name: 'ListView',
    data() {
        return {
            list: null,
            grid: true,
            viewTypes: ['Photo Grid', 'Icon List'],
            tab: null,
            dialog: []
        }
    },
    methods: {
        randomPic() {
            let images = []
            this.list.itemDetails.forEach(item => {
                for (let index = 0; index < 3; index++) {
                    if(item[index] !== undefined) {
                        images.push(item[index].imageUrl)
                    }
                }
            })
            return images[Math.floor(Math.random()*images.length)]
        },
        itemPic(item) {
            let url
            if(item !== undefined)
            Object.values(item).forEach(detail => {
                if(detail.imageUrl !== undefined && detail.imageUrl !== null) {
                    url = detail.imageUrl
                }
            })
            return url === undefined ? "/static/img/logo.svg" : url
        },
        minPrice(item) {
            let price = Infinity
            if(item !== undefined)
                Object.values(item).forEach(detail => {
                    if(detail.price !== undefined && detail.price !== null) {
                        price = Math.min(detail.price,price)
                    }
                })
            return price === Infinity ? parseFloat(0).toFixed(2) : parseFloat(price).toFixed(2)
        },
        itemDescription(item) {
            let desc = ''
            if(item !== undefined)
            Object.values(item).forEach(detail => {
                if(detail.description !== undefined && detail.description !== null) {
                    desc = detail.description
                }
            })
            return desc === undefined ? '' : desc
        },
        detailList(item) {
            let detailList = []
            if(item !== undefined)
            Object.values(item).forEach(detail => {
                if(detail.description !== undefined && detail.description !== null) {
                    detailList.push(detail)
                }
            })
            return detailList
        },
        resetDialog(index) {
            Vue.set(this.dialog, index, false)
        }
    },
    created() {
        let list = db.collection('lists').where('slug', '==', this.$route.params.list_slug)
        list.get().then(snapshot => {
            snapshot.forEach(doc => {
                this.list = doc.data()
            })
        }).then(() => {
            this.list.itemDetails.forEach(item => {
                this.dialog.push(false)
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
