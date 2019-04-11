<template>
    <div class="card add-list bogus grey lighten-3" style="margin-top: 60px;">
        <h2 class="center-align cyan-text text-darken-4">New List</h2>
        <form @submit.prevent="AddList">
            <div class="field title">
                <label for="title">List Title</label>
                <v-text-field
                    single-line
                    v-model="title"
                    placeholder="Title"
                    autofocus="true"
                    color="cyan darken-4"
                    class="text-white"
                    label="List Title"
                    name="title"
                    @keydown.enter.prevent=""
                ></v-text-field>
            </div>
            <draggable v-model="itemsAndQuantities" handle=".handle" ghost-class="ghost">
                <div v-for="(itemPair,index) in itemsAndQuantities" :key="index" class="field">
                    <label for="item">Item:</label>
                    <span class="item-display">
                        <v-icon class="handle">drag_handle</v-icon>
                        <!-- Bind to the position in items array -->
                        <!-- Updates in the list display update elements in the items array -->
                        <input placeholder="Item Name" type="text" name="item" @keydown.enter.prevent="addAll"  @change="addAll" v-model="itemPair.item">
                        
                        <v-btn fab white small @click="adjustExistingQuantity(itemPair.item, -1)" color="cyan darken-4" class="subtract">
                            <v-icon dark color="white">remove</v-icon>
                        </v-btn>
                        <input placeholder="Quantity" class="quantity" type="text" name="add-quantity" v-model="itemPair.quantity">
                        <v-btn fab white small @click="adjustExistingQuantity(itemPair.item, 1)" color="cyan darken-4" class="add">
                            <v-icon dark color="white">add</v-icon>
                        </v-btn>
                    </span> 
                </div>
            </draggable>
            <div class="field">
                <label for="add-list">Add a list item:</label>
                <span>
                    <input placeholder="Item Name" type="text" name="add-list" @keydown.enter.prevent="addAll" @change="addAll" v-model="item">
                <v-btn fab white small @click="adjustQuantity(-1)" color="cyan darken-4" class="subtract">
                    <v-icon dark color="white">remove</v-icon>
                </v-btn>
                <input placeholder="Quantity" class="quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" @change="addAll" v-model="quantity">
                <v-btn fab white small @click="adjustQuantity(1)" color="cyan darken-4" class="add">
                    <v-icon dark color="white">add</v-icon>
                </v-btn>
                </span>
            </div>
            <div v-if="item" class="field">
                <label for="add-list">Add a list item:</label>
                    <span>
                        <input placeholder="Item Name" type="text" name="add-list" @keydown.enter.prevent="addAll" @change="addAll" v-model="item">
                    <v-btn fab white small @click="adjustQuantity(-1)" color="cyan darken-4" class="subtract">
                        <v-icon dark color="white">remove</v-icon>
                    </v-btn>
                    <input placeholder="Quantity" class="quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" @change="addAll" v-model="quantity">
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
                <button v-else class="btn orange" @click="submit = true">Add List</button>
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
    name: 'AddList',
    data() {
        return {
            title: null,
            item: '',
            item2: ' ',
            quantity: 1,
            quantity2: null,
            price: 1,
            items: [],
            prices: [],
            productNames:[],
            vendors: [],
            urls: [],
            total: 0,
            quantities: [],
            feedback: null,
            slug: null,
            id: null,
            submit: false,
            itemDetails: [],
            itemsAndQuantities: [],

            states: [
                'Alabama', 'Alaska', 'American Samoa', 'Arizona',
                'Arkansas', 'California', 'Colorado', 'Connecticut',
                'Delaware', 'District of Columbia', 'Federated States of Micronesia',
                'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho',
                'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                'Louisiana', 'Maine', 'Marshall Islands', 'Maryland',
                'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
                'Missouri', 'Montana', 'Nebraska', 'Nevada',
                'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
                'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
                'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
                'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
                'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia',
                'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
            ]
        }
    },
    components: {
        draggable,
    },
    created() {
        let ref = db.collection('users')
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.id = user.data().user_id
        })

        this.itemsAndQuantities = this.combinedItemsAndQuantities()
    },
    methods: {
        AddList() {
            if(this.title) {
                this.feedback = null
                this.updateIndividualItemsAndQuantities()
                // Create slug using slugify
                // replacement replaces all spaces with specified char
                this.slug = slugify(this.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g, //regex remove symbols for sanitizing,
                    lower: true //capital -> lower-case,
                });
                
                let promises = [];

                this.items.forEach(item => {
                    let itemURL = 'http://us-central1-makerslist-7f3d8.cloudfunctions.net/centralQueue/api/append?name=' + item + '&key=whatever'
                    promises.push(axios.get(itemURL))
                })

                // SOMEHOW MAKE THIS RETURN A PROMISE - or put this back in addAll
                axios.all(promises).catch(err => {
                    console.log(err)
                })

                this.items.forEach((item,index) => {
                    this.itemDetails.push({
                                description: "Loading...",
                                imageUrl: "Loading...",
                                price: "Loading...",
                                productName: "Loading...",
                                supplierName: "Loading...",
                                url: "Loading..."
                                })
                })


                db.collection('items').get().then(snapshot => {
                    snapshot.forEach(item => {
                        this.items.forEach((listItem,index) => {
                          if(item.id === listItem) {
                            // console.log("Found", listItem, "Pairing With", item.data())
                            this.itemDetails[index] = (item.data())
                            }
                        })
                    })
                }).then(() => {
                    db.collection('lists').add({
                        title: this.title,
                        items: this.items,
                        itemDetails: this.itemDetails,
                        quantities: this.quantities,
                        slug: this.slug,
                        total: Number(0),
                        user_id: this.id,
                    }).then(() => {
                        this.$router.push({name: 'Index'})
                    }).catch( err => {
                        console.log(err)
                    })
                })
            } else {
                this.feedback = 'Please enter a title'
            }
        },
        addAll() {
            if(this.item) {
                if(!isNaN(this.quantity) && this.quantity >= 1) {
                    this.items.push(this.item)

                    // Update the item value which re-renders the field to be blank
                    // console.log("1:" + this.item + ",Q" + this.quantity + "2:" + this.item2 + ",Q" + this.quantity2 + "ALL: " + this.items)
                    this.item = null
                    this.feedback = null

                    this.quantities.push(this.quantity)

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
            this.items.forEach((item,index) => {
                itemQuantityPairs.push({
                    item: item,
                    quantity: this.quantities[index],
                })
            })
            return itemQuantityPairs;
        },
        updateIndividualItemsAndQuantities() {
            this.items = []
            this.quantities = []
            this.itemsAndQuantities.forEach((itemPair) => {
                this.items.push(itemPair.item)
                this.quantities.push(itemPair.quantity)
            })
        },
    },
}
</script>

<style>
.add-list {
    margin-top: 60px;
    padding: 20px;
}
.add-list h2 {
    font-size: 40px;
    margin: 20px auto;
}

.add-list .field {
    margin: 20px auto;
    position: relative;
}

.add-list .delete {
    position: absolute;
    right: 0px;
    bottom: 16px;
    cursor: pointer;
    color:#f9e4e4; 
}

.add-list .add {
    cursor: pointer;
    bottom: 16px;
    color: orange;
}

.add-list .subtract {
    cursor: pointer;
    right: 0px;
    bottom: 16px;
    color: orange;
}

.add-list span {
    display: grid;
    grid-template-columns: 100fr .1fr 10fr .1fr;
    grid-gap: 10px;
}

.add-list .item-display {
    display: grid;
    grid-template-columns: .1fr 100fr .1fr 10fr .1fr;
    grid-gap: 10px;
}

.add-list .quantity {
    text-align: center;
    font-size: 35px;
}

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  .add-list .loading-circle {
      margin-top: 5px;
      margin-bottom: 5px;
  }

  .add-list .handle {
    float: left;
    padding-top: 8px;
    padding-bottom: 8px;
    cursor: grab;
  }

  .add-list .ghost {
    opacity: 0.5;
    background: #006064;
  }
</style>
