<template>
    <div v-if="list" class="edit-list bogus">
        <h2 class="cyan-text text-darken-4 center-align">{{ list.title }}</h2>
        <form @submit.prevent="EditList">
            <div class="field title">
                <label for="title">List Title</label>
                <input placeholder="Title" type="text" name="title" @keydown.enter.prevent="" v-model="list.title">
            </div>
            <div v-for="(item, index) in list.items" :key="index" class="field">
                <label for="item">Item:</label>
                <span>
                    <!-- Bind to the position in items array -->
                    <!-- Updates in the list display update elements in the items array -->
                    <input placeholder="Item Name" type="text" name="item" @keydown.enter.prevent="" v-model="list.items[index]">
                    <input placeholder="Quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" v-model="list.quantities[index]">
                </span>
                <i class="material-icons delete" @click="deleteItem(item)">delete</i>
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

export default {
    name: 'EditList',
    data() {
        return {
            list: null,
            item: null,
            quantity: null,
            feedback: null,
            submit: false,
        }
    },
    methods: {
        EditList() {
            if(this.list.title) {
                this.feedback = null
                // Create slug using slugify
                // replacement replaces all spaces with specified char
                this.list.slug = slugify(this.list.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g, //regex remove symbols for sanitizing,
                    lower: true //capital -> lower-case,
                });
                
                let promises = [];

                this.list.items.forEach(item => {
                    let itemURL = 'https://us-central1-makerslist-7f3d8.cloudfunctions.net/findPrice?name=' + item
                    promises.push(axios.get(itemURL))
                })

                axios.all(promises).then(results => {
                results.forEach(priceInfo => {
                    
                    // console.log(priceInfo.data.name)
                    // console.log(priceInfo.data.suppliers.prices[0].url)
                    // console.log(priceInfo.data.suppliers.prices[0].price)
                    
                    this.list.vendors.push(priceInfo.data.suppliers.supplierName)

                    this.total += priceInfo.data.suppliers.prices[0].price;
                    priceInfo.data.suppliers.prices.forEach(product => {
                        this.list.prices.push(product.price)
                        this.list.urls.push(product.url)
                        this.list.productNames.push(product.productName)
                        // this.list.total += Number(product.price)
                    })

                    // console.log(this.list.prices)
                    // console.log(this.list.total)
                    })
                }).then(() => {
                    // console.log("PRICES: " + this.list.prices)
                    db.collection('lists').doc(this.list.id).update({
                    title: this.list.title,
                    slug: this.list.slug,
                    items: this.list.items,
                    prices: this.list.prices,
                    total: Math.round(this.list.total*100)/100,
                    urls: this.list.urls,
                    supplierNames: this.list.vendors,
                    productNames: this.list.productNames,
                    quantities: this.list.quantities,
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
                } else {
                    this.feedback = 'Please enter a valid quantity.'
                }
            } else {
                this.feedback = 'A list item cannot be blank!'
            }
        },
        deleteItem(item) {
            var deleteIndex
            this.list.items = this.list.items.filter((_item,index) => {
                if (_item === item)
                    deleteIndex = index

                return _item !== item 
            })
            this.list.quantities = this.list.quantities.filter((quantity, index) => {
                return index !== deleteIndex
            })
        },
        clearScrapeFields() {
            this.list.vendors = []
            this.list.prices = []
            this.list.urls = []
            this.list.productNames = []
            this.list.total = 0
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
    position: absolute;
    cursor: pointer;
    right: 0px;
    bottom: 16px;
    color: orange;
}

.edit-list span {
    display: grid;
    grid-template-columns: 5fr 1fr;
    grid-gap: 10px;
}
</style>

