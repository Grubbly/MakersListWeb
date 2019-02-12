<template>
    <div class="view-profile container">
        <div v-if="profile" class="card">
            <h2 class="cyan-text text-darken-4 center">{{profile.alias}}'s Profile</h2>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'

export default {
    name: 'ViewProfile',
    data() {
        return{
            profile: null
        }
    },
    created() {
        let ref = db.collection('users')
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
        })
    }
}
</script>

<style>
.view-profile {
    max-width: 600px;
    margin-top: 60px;
}

.view-profile h2 {
    font-size: 2.4em;
}
</style>


