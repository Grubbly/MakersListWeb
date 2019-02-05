<template>
    <div class="add-list container">
        <h2 class="center-align cyan-text text-darken-4">Add New List</h2>
        <form @submit.prevent="AddList">
            <div class="field title">
                <label for="title">List Title</label>
                <input type="text" name="title" @keydown.enter.prevent="" v-model="title">
            </div>
            <div v-for="(item, index) in items" :key="index" class="field">
                <label for="item">Item:</label>
                <!-- Bind to the position in items array -->
                <!-- Updates in the list display update elements in the items array -->
                <input type="text" name="item" @keydown.enter.prevent="" v-model="items[index]">
                <i class="material-icons delete" @click="deleteItem(item)">delete</i>
            </div>
            <div class="field add-list">
                <label for="add-list">Add a list item:</label>
                <input type="text" name="add-list" @keydown.enter.prevent="addItem" v-model="item">
                <i class="class material-icons add" @click="addItem">add</i>
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
            item: null,
            items: [],
            prices: [],
            quantity: null,
            feedback: null,
            slug: null,
        }
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

                db.collection('lists').add({
                    title: this.title,
                    slug: this.slug,
                    items: this.items, 
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
        deleteItem(item) {
            this.items = this.items.filter(_item => {
                return _item !== item 
            })
        }
    }
}
</script>

<style>
.add-list {
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
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
    right: 20px;
    bottom: 40px;
    color: orange;
}

.add-list span {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 10px;
}
</style>
