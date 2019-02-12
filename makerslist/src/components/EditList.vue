<template>
    <div v-if="list" class="edit-list container">
        <h2 class="cyan-text text-darken-4">Edit {{ list.title }} List</h2>
        <form @submit.prevent="EditList">
            <div class="field title">
                <label for="title">List Title</label>
                <input type="text" name="title" @keydown.enter.prevent="" v-model="list.title">
            </div>
            <div v-for="(item, index) in list.items" :key="index" class="field">
                <span>
                    <label for="item">Item:</label>
                    <!-- Bind to the position in items array -->
                    <!-- Updates in the list display update elements in the items array -->
                    <input type="text" name="item" @keydown.enter.prevent="" v-model="list.items[index]">
                    <input placeholder="Quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" v-model="list.quantities[index]">
                    <i class="material-icons delete" @click="deleteItem(item)">delete</i>
                </span>
            </div>
            <div class="field add-list">
                <span>
                    <label for="add-list">Add a list item:</label>
                    <input type="text" name="add-list" @keydown.enter.prevent="addAll" v-model="item">
                    <i class="material-icons add" @click="addAll">add</i>
                    <input placeholder="Quantity" type="text" name="add-quantity" @keydown.enter.prevent="addAll" v-model="quantity">
                </span>
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <button class="btn orange">Update List</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'EditList',
    data() {
        return {
            list: null,
            item: null,
            quantity: 1,
            feedback: null,
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

                let temp = 0
                this.list.prices.forEach(price => {
                    temp += Number(price)
                });
                this.list.total = temp

                db.collection('lists').doc(this.list.id).update({
                    title: this.list.title,
                    slug: this.list.slug,
                    items: this.list.items, 
                    prices: this.list.prices,
                    total: this.list.total,
                    quantities: this.list.quantities
                }).then(() => {
                    this.$router.go(-1)
                }).catch( err => {
                    console.log(err)
                })
            } else {
                this.feedback = 'Please enter a title'
            }
        },
        addItem() {
            if(this.item) {
                this.list.items.push(this.item)

                // Update the item value which re-renders the field to be blank
                this.item = null
                this.feedback = null
            } else {
                this.feedback = 'A list item cannot be blank!'
            }
        },
        addQuantity() {
            if(!isNaN(this.quantity) && this.quantity >= 1) {
                this.list.quantities.push(Number(this.quantity))

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

                        this.list.prices.push(100)

                    // ************ CHANGE PRICE ********* //


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
            this.list.prices = this.list.prices.filter((price, index) => {
                return index !== deleteIndex
            })
        }
    },
    created() {
        let list = db.collection('lists').where('slug', '==', this.$route.params.list_slug)
        list.get().then(snapshot => {
            snapshot.forEach(doc => {
                this.list = doc.data()
                this.list.id = doc.id
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
    right: 20px;
    bottom: 40px;
    color: orange;
}

.edit-list span {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    grid-gap: 10px;
}
</style>

