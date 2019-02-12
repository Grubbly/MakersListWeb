<template>
    <div class="add-list container">
        <h2 class="center-align cyan-text text-darken-4">Add New List</h2>
        <form @submit.prevent="AddList">
            <div class="field title">
                <label for="title">List Title</label>
                <input type="text" name="title" @keydown.enter.prevent="" v-model="title">
            </div>
            <div v-for="(item, index) in items" :key="index" class="field">
                <span>
                    <label for="item">Item:</label>
                    <!-- Bind to the position in items array -->
                    <!-- Updates in the list display update elements in the items array -->
                    <input type="text" name="item" @keydown.enter.prevent="" v-model="items[index]">
                    <input placeholder="Quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" v-model="quantities[index]">
                    <i class="material-icons delete" @click="deleteItem(item)">delete</i>
                </span> 
            </div>
            <div class="field add-list">
                <span>
                    <label for="add-list">Add a list item:</label>
                    <input placeholder="Name" type="text" name="add-list" @keydown.enter.prevent="addAll" v-model="item">
                    <i class="class material-icons add" @click="addAll">add</i>
                    <input placeholder="Quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" v-model="quantity">
                </span>
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

export default {
    name: 'AddList',
    data() {
        return {
            title: null,
            item: '',
            quantity: 1,
            price: 1,
            items: [],
            prices: [],
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

                let temp = 0
                this.prices.forEach(price => {
                    temp += Number(price)
                });
                this.total = temp

                db.collection('lists').add({
                    title: this.title,
                    slug: this.slug,
                    items: this.items,
                    prices: this.prices,
                    total: this.total,
                    quantities: this.quantities,
                    user_id: this.id,
                }).then(() => {
                    this.$router.push({name: 'Index'})
                }).catch( err => {
                    console.log(err)
                })
            } else {
                this.feedback = 'Please enter a title'
            }
        },
        addItem() {
            if(this.item) {
                this.items.push(this.item)

                // Update the item value which re-renders the field to be blank
                this.item = null
                this.feedback = null
            } else {
                this.feedback = 'A list item cannot be blank!'
            }
        },
        addQuantity() {
            if(!isNaN(this.quantity) && this.quantity >= 1) {
                this.quantities.push(Number(this.quantity))

                // Update the item value which re-renders the field to be blank
                this.quantity = 1
                this.feedback = null
            } else {
                this.feedback = 'Please enter a valid quantity.'
            }
        },
        addAll() {
            if(this.item) {
                if(!isNaN(this.quantity) && this.quantity >= 1) {
                    

                    // ************ DEBUG **************** //

                        this.prices.push(100)

                    // ************ CHANGE PRICE ********* //


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
            this.prices = this.prices.filter((price, index) => {
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
    right: 10px;
    bottom: 40px;
    color: orange;
}

.add-list span {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    grid-gap: 10px;
}
</style>
