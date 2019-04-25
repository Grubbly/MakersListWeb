<template>
    <div class="yourLists">
        <Index v-if="profile" :filter="profile.user_id"/>
    </div>
</template>

<script>
import db from '@/firebase/init'
import Index from '@/components/Index.vue'

export default {
    name: 'yourlists',
    data() {
        return {
            profile: null,
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
    },
}
</script>

<style>

</style>

