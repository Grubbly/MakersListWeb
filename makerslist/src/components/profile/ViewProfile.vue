<template>
    <div class="view-profile container">
        <div v-if="profile" class="card title">
            <h2 class="cyan-text text-darken-4 center">{{profile.alias}}'s Profile</h2>
        </div>
        <Index v-if="profile" :filter="profile.user_id"/>
    </div>
</template>

<script>
import db from '@/firebase/init'
import Index from '@/components/Index.vue'

export default {
    name: 'ViewProfile',
    data() {
        return{
            profile: null
        }
    },
    components: {
        Index,
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
    max-width: 1500px;
    margin-top: 60px;
}

.view-profile h2 {
    font-size: 2.4em;
}

.view-profile .title {
    max-width: 100%;
}
</style>


