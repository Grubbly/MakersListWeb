<template>
    <div v-if="list" class="edit-list container">
        <h2>Edit {{ list.title }} List</h2>
        <form @submit.prevent="EditList">
            <div class="field title">
                <label for="title">List Title</label>
                <input type="text" name="title" @keydown.enter.prevent="" v-model="list.title">
            </div>
            <div v-for="(item, index) in list.items" :key="index" class="field">
                <label for="item">Item:</label>
                <!-- Bind to the position in items array -->
                <!-- Updates in the list display update elements in the items array -->
                <input type="text" name="item" @keydown.enter.prevent="" v-model="list.items[index]">
                <i class="material-icons delete" @click="deleteItem(item)">delete</i>
            </div>
            <div class="field add-list">
                <label for="add-list">Add a list item:</label>
                <input type="text" name="add-list" @keydown.enter.prevent="addItem" v-model="item">
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

                db.collection('lists').doc(this.list.id).update({
                    title: this.list.title,
                    slug: this.list.slug,
                    items: this.list.items, 
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
                this.list.items.push(this.item)

                // Update the item value which re-renders the field to be blank
                this.item = null
                this.feedback = null
            } else {
                this.feedback = 'A list item cannot be blank!'
            }
        },
        deleteItem(item) {
            this.list.items = this.list.items.filter(_item => {
                return _item !== item 
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
    max-width: 500px;
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
</style>

