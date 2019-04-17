<template>
    <div v-if="list" class="card grey lighten-3 edit-list bogus" style="margin-top: 60px;">
        <h2 class="cyan-text text-darken-4 center-align">{{ list.title }}</h2>
        <form @submit.prevent="EditList">
            <div class="field title">
                <label for="title">List Title</label>
                <v-text-field
                    single-line
                    v-model="list.title"
                    placeholder="Title"
                    autofocus
                    color="cyan darken-4"
                    class="text-white"
                    label="List Title"
                    name="title"
                    @keydown.enter.prevent=""
                ></v-text-field>
                <!-- <input autofocus="true" placeholder="Title" type="text" name="title" @keydown.enter.prevent="" v-model="list.title"> -->
            </div>
            <draggable v-model="itemsAndQuantities" handle=".handle" ghost-class="ghost">
                <div v-for="(itemPair, index) in itemsAndQuantities" :key="index" class="field">
                    <label for="item">Item:</label>
                    <span class="item-display">
                        <v-icon dark color="grey" class="handle">drag_handle</v-icon>
                        <!-- Bind to the position in items array -->
                        <!-- Updates in the list display update elements in the items array -->
                        <input placeholder="Item Name" type="text" name="item" @keydown.enter.prevent="" @change="addAll" v-model="itemPair.item">

                        <v-btn fab white small @click="adjustExistingQuantity(itemPair.item, -1)" color="cyan darken-4" class="subtract">
                            <v-icon dark color="white">remove</v-icon>
                        </v-btn>
                        <div class="quantity">
                            <input class="quantity" type="number" autocomplete="off" name="add-quantity" @keydown.enter.prevent="addAll" @change="addAll" v-model="itemPair.quantity">
                        </div>
                        <v-btn fab white small @click="adjustExistingQuantity(itemPair.item, 1)" color="cyan darken-4" class="add">
                            <v-icon dark color="white">add</v-icon>
                        </v-btn>
                    </span>
                </div>
            </draggable>
            <div class="field">
                <label for="add-list">Add a list item:</label>
                <span>
                    <input placeholder="Item Name" type="text" name="add-list" @keydown.enter.prevent="addAll"  @change="addAll" v-model="item">

                    <v-btn fab white small @click="adjustQuantity(-1)" color="cyan darken-4" class="subtract">
                        <v-icon dark color="white">remove</v-icon>
                    </v-btn>
                    <div class="quantity">
                        <input class="quantity" type="number" autocomplete="off" name="add-quantity" @keydown.enter.prevent="addAll" @change="addAll" v-model="quantity">
                    </div>
                    <v-btn fab white small @click="adjustQuantity(1)" color="cyan darken-4" class="add">
                        <v-icon dark color="white">add</v-icon>
                    </v-btn>
                </span>
            </div>
            <div v-if="item" class="field">
                <label for="add-list">Add a list item:</label>
                <span>
                    <input placeholder="Item Name" type="text" name="add-list" @keydown.enter.prevent="addAll" v-model="item2">

                    <v-btn fab white small @click="adjustQuantity(-1)" color="cyan darken-4" class="subtract">
                        <v-icon dark color="white">remove</v-icon>
                    </v-btn>

                    <div class="quantity">
                        <input class="quantity" autocomplete="off" type="number" name="add-quantity" @keydown.enter.prevent="addAll" v-model="quantity2">
                    </div>

                    <v-btn fab white small @click="adjustQuantity(1)" color="cyan darken-4" class="add">
                        <v-icon dark color="white">add</v-icon>
                    </v-btn>
                </span>
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <div v-if="submit && !feedback" class="preloader-wrapper small active">
                    <div class="spinner-layer spinner-cyan-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                        <div class="circle"></div>
                    </div><div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                    </div>
                </div>
                <button v-else class="btn orange" @click="submit = true">Update List</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'
import axios from 'axios'
import vue from 'vue'
import draggable from 'vuedraggable'

export default {
    name: 'EditList',
    data() {
        return {
            list: null,
            item: null,
            item2: null,
            quantity: 1,
            quantity2: 1,
            feedback: null,
            submit: false,
            itemsAndQuantities: [],
        }
    },
    components: {
        draggable,
    },
    methods: {
        EditList() {
            if(this.list.title) {
                this.feedback = null
                this.updateIndividualItemsAndQuantities()
                // Create slug using slugify
                // replacement replaces all spaces with specified char
                this.list.slug = slugify(this.list.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g, //regex remove symbols for sanitizing,
                    lower: true //capital -> lower-case,
                });

                let promises = [];

                this.list.items.forEach(item => {
                    let itemURL = 'http://us-central1-makerslist-7f3d8.cloudfunctions.net/centralQueue/api/append?name=' + item + '&key=whatever'
                    promises.push(axios.get(itemURL))
                })

                // SOMEHOW MAKE THIS RETURN A PROMISE - or put this back in addAll
                axios.all(promises).catch(err => {
                    console.log(err)
                })

                this.list.items.forEach((item,index) => {
                    this.list.itemDetails.push({
                        description: "Loading...",
                        imageUrl: "Loading...",
                        price: "Loading...",
                        productName: "Loading...",
                        supplierName: "Loading...",
                        url: "Loading"
                    })
                })

                db.collection('items').get().then(snapshot => {
                    snapshot.forEach(item => {
                        this.list.items.forEach((listItem,index) => {
                          if(item.id === listItem) {
                            // console.log("Found", listItem, "Pairing With", item.data())
                            this.list.itemDetails[index] = (item.data())
                            }
                        })
                    })
                }).then(() => {
                    // console.log("PRICES: " + this.list.prices)
                    db.collection('lists').doc(this.list.id).update({
                        title: this.list.title,
                        items: this.list.items,
                        itemDetails: this.list.itemDetails,
                        quantities: this.list.quantities,
                        slug: this.list.slug,
                        total: Number(0),
                        user_id: this.list.id,
                    }).then(() => {
                        this.$router.go(-1)
                    }).catch( err => {
                        console.log(err)
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            } else {
                this.feedback = 'Please enter a title'
            }

        },
        addAll() {
            if(this.item) {
                if(!isNaN(this.quantity) && this.quantity >= 1) {

                    this.list.items.push(this.item)

                    // Update the item value which re-renders the field to be blank
                    this.item = null
                    this.feedback = null

                    this.list.quantities.push(this.quantity)

                    // Update the item value which re-renders the field to be blank
                    this.quantity = 1
                    this.feedback = null

                    this.itemsAndQuantities = this.combinedItemsAndQuantities();
                } else {
                    this.feedback = 'Please enter a valid quantity.'
                }
            } else {
                this.feedback = 'A list item cannot be blank!'
            }
        },
        deleteItem(item) {
            this.itemsAndQuantities = this.itemsAndQuantities.filter((itemPair,index) => {
                return itemPair.item !== item
            })
        },
        clearScrapeFields() {
            this.list.vendors = []
            this.list.prices = []
            this.list.urls = []
            this.list.productNames = []
            this.list.total = 0
        },
        adjustQuantity(val) {
            this.quantity = Number(this.quantity)
            this.quantity += val

            if(this.quantity <= 0) {
                this.quantity = null
                this.item = null
                return
            }
        },
        adjustExistingQuantity(item,val) {
            var itemIndex
            this.itemsAndQuantities.filter((itemPair,index) => {
                if (itemPair.item === item)
                    itemIndex = index
            })
            let newVal = Number(this.itemsAndQuantities[itemIndex].quantity) + val

            if(newVal <= 0) {
                newVal = null
                this.deleteItem(item)
                return
            }

            vue.set(this.itemsAndQuantities, itemIndex, {
                item: this.itemsAndQuantities[itemIndex].item,
                quantity: newVal,
            })
        },
        combinedItemsAndQuantities() {
            let itemQuantityPairs = [];
            this.list.items.forEach((item,index) => {
                itemQuantityPairs.push({
                    item: item,
                    quantity: this.list.quantities[index],
                })
            })
            return itemQuantityPairs;
        },
        updateIndividualItemsAndQuantities() {
            this.list.items = []
            this.list.quantities = []
            this.itemsAndQuantities.forEach((itemPair) => {
                this.list.items.push(itemPair.item)
                this.list.quantities.push(itemPair.quantity)
            })
        },
    },
    created() {
        let list = db.collection('lists').where('slug', '==', this.$route.params.list_slug)
        list.get().then(snapshot => {
            snapshot.forEach(doc => {
                this.list = doc.data()
                this.list.id = doc.id
                this.clearScrapeFields()
            })
        }).then(() => {
            this.itemsAndQuantities = this.combinedItemsAndQuantities()
        })
    }
}
</script>

<style>
.edit-list {
    margin-top: 60px;
    padding: 20px;
}
.edit-list h2 {
    font-size: 40px;
    margin: 20px auto;
}

.edit-list .field {
    margin: 20px auto;
    position: relative;
}

.edit-list .delete {
    position: absolute;
    right: 0px;
    bottom: 16px;
    cursor: pointer;
    color:#f9e4e4;
}

.edit-list .add {
    cursor: pointer;
    bottom: 0px;
    color: orange;
}

.edit-list .subtract {
    cursor: pointer;
    right: 0px;
    bottom: 0px;
    color: orange;
}

.edit-list span {
    display: grid;
    grid-template-columns: 100fr .1fr 10fr .1fr;
    grid-gap: 10px;
}

.edit-list .item-display {
    display: grid;
    grid-template-columns: .1fr 100fr .1fr 10fr .1fr;
    grid-gap: 10px;
}

.edit-list .quantity {
    text-align: center;
    font-size: 35px;
}

  .edit-list .handle {
    float: left;
    padding-top: 8px;
    padding-bottom: 8px;
    cursor: grab;
  }

  .edit-list .ghost {
    opacity: 0.5;
    background: #006064;
  }
</style>
