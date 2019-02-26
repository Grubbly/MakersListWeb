<template>
    <div class="add-list bogus">
        <h2 class="center-align cyan-text text-darken-4">Add New List</h2>
        <form @submit.prevent="AddList">
            <div class="field title">
                <label for="title">List Title</label>
                <input placeholder="Title" type="text" name="title" @keydown.enter.prevent="" v-model="title">
            </div>
            <div v-for="(item, index) in items" :key="index" class="field">
                <label for="item">Item:</label>
                <span class="item-display">
                    <!-- Bind to the position in items array -->
                    <!-- Updates in the list display update elements in the items array -->
                    <input placeholder="Item Name" type="text" name="item" @keydown.enter.prevent="addAll" v-model="items[index]">
                    <input placeholder="Quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" v-model="quantities[index]">
                    <i class="material-icons delete" @click="deleteItem(item)">delete</i>
                </span> 
            </div>
            <div class="field">
                <label for="add-list">Add a list item:</label>
                <span>
                    <input placeholder="Item Name" type="text" name="add-list" @keydown.enter.prevent="addAll" v-model="item">
                    <input placeholder="Quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" v-model="quantity">
                </span>
                <i class="material-icons add" @click="addAll">add</i>
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <button class="btn orange">Add List</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'
import axios from 'axios'

export default {
    name: 'AddList',
    data() {
        return {
            title: null,
            item: '',
            quantity: null,
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
        }
    },
    created() {
        let ref = db.collection('users')
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.id = user.data().user_id
        })
    },
    methods: {
        AddList() {
            if(this.title) {
                this.feedback = null
                // Create slug using slugify
                // replacement replaces all spaces with specified char
                this.slug = slugify(this.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g, //regex remove symbols for sanitizing,
                    lower: true //capital -> lower-case,
                });
                
                let promises = [];

                this.items.forEach(item => {
                    let itemURL = 'https://us-central1-makerslist-7f3d8.cloudfunctions.net/findPrice?name=' + item
                    promises.push(axios.get(itemURL))
                })

                // SOMEHOW MAKE THIS RETURN A PROMISE - or put this back in addAll
                axios.all(promises).then(results => {
                results.forEach(priceInfo => {
                    
                    // console.log(priceInfo.data.name)
                    // console.log(priceInfo.data.suppliers.prices[0].url)
                    // console.log(priceInfo.data.suppliers.prices[0].price)
                    
                    this.vendors.push(priceInfo.data.suppliers.supplierName)

                    priceInfo.data.suppliers.prices.forEach(product => {
                        this.prices.push(product.price)
                        this.urls.push(product.url)
                        this.productNames.push(product.productName)
                        this.total += Number(product.price)
                    })

                    console.log(this.prices)
                    console.log(this.total)
                    })
                }).then(() => {
                    console.log("PRICES: " + this.prices)
                    db.collection('lists').add({
                    title: this.title,
                    slug: this.slug,
                    items: this.items,
                    prices: this.prices,
                    total: this.total,
                    urls: this.urls,
                    supplierNames: this.vendors,
                    productNames: this.productNames,
                    quantities: this.quantities,
                    user_id: this.id,
                    }).then(() => {
                        this.$router.push({name: 'Index'})
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

                    this.items.push(this.item)

                    // Update the item value which re-renders the field to be blank
                    this.item = null
                    this.feedback = null

                    this.quantities.push(this.quantity)

                    // Update the item value which re-renders the field to be blank
                    this.quantity = 1
                    this.feedback = null
                } else {
                    this.feedback = 'Please enter a valid quantity.'
                }
            } else {
                this.feedback = 'A list item cannot be blank!'
            }
        },
        deleteItem(item) {
            var deleteIndex
            this.items = this.items.filter((_item,index) => {
                if (_item === item)
                    deleteIndex = index

                return _item !== item 
            })
            this.quantities = this.quantities.filter((quantity, index) => {
                return index !== deleteIndex
            })
        }
    }
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
    position: absolute;
    cursor: pointer;
    right: 0px;
    bottom: 16px;
    color: orange;
}

.add-list span {
    display: grid;
    grid-template-columns: 5fr 1fr;
    grid-gap: 10px;
}

.add-list .item-display {
    display: grid;
    grid-template-columns: 5fr 1fr;
    grid-gap: 10px;
}
</style>
