<template>
    <div class="signup container">
        <form @submit.prevent="signup" class="card-panel">
            <h2 class="center cyan-text text-darken-4">Signup</h2>
            <div class="field">
                <label for="email">Email:</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <div class="field">
                <label for="alias">Username:</label>
                <input type="text" name="alias" v-model="alias">
            </div>
            <p class="red-text center" v-if="feedback">{{feedback}}</p>
            <div class="field center">
                <button class="btn cyan darken-4">Signup</button>
            </div>
        </form>
    </div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Signup',
    data() {
        return {
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null,
        }
    },
    methods: {
        signup() {
            if(this.alias && this.email && this.password) {
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })

                // Grab reference to document in user collection with name this.slug
                let ref = db.collection('users').doc(this.slug)
                ref.get().then(doc => {
                    if(doc.exists) {
                        this.feedback = 'This username already exists'
                    } else {
                        // Create the user
                        firebase.auth().createUserWithEmailAndPassword(
                            this.email,
                            this.password
                        ).then(cred => {
                            ref.set({
                                alias: this.alias,
                                user_id: cred.user.uid
                            })
                        }).then(() => {
                            this.$router.push({ name: 'Index' })
                        }).catch(err => {
                            this.feedback = err.message
                        })
                    }
                })
            } else {
                this.feedback = "Please fill out all fields"
            }
        }
    }
}
</script>

<style>
.signup {
    max-width: 400px;
    margin-top: 60px;
}

.signup h2 {
    font-size: 2.4em;
}

.signup .field {
    margin-bottom: 16px;
}
</style>
