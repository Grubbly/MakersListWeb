<template>
    <div class="add-list container">
        <h2 class="center-align cyan-text">Add New List</h2>
        <form @submit.prevent="AddList">
            <div class="field title">
                <label for="title">List Title</label>
                <input type="text" name="title" @keydown.enter.prevent="" v-model="title">
            </div>
            <div v-for="(item, index) in items" :key="index">
                <label for="item">Items:</label>
                <!-- Bind to the position in items array -->
                <!-- Updates in the list display update elements in the items array -->
                <input type="text" name="item" @keydown.enter.prevent="" v-model="items[index]">
            </div>
            <div class="field add-list">
                <label for="add-list">Add a list item:</label>
                <input type="text" name="add-list" @keydown.enter.prevent="addItem" v-model="item">
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <button class="btn orange">Add List</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'AddList',
    data() {
        return {
            title: null,
            item: null,
            items: [],
            feedback: '',
        }
    },
    methods: {
        AddList() {
            console.log(this.title, this.items)
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
}
</style>
