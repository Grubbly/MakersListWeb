<template>
    <div class="yourLists" v-if="profile">
        <v-card  class="bogus2" height="0px" flat>
            <div class="headline text-xs-center pa-5">
            </div>
            <v-bottom-nav
            :active.sync="bottomNav"
            :value="true"
            absolute
            color="transparent"
            >
            <v-btn
                color="cyan darken-4"
                flat
                value="yourlists"
                @click="toggle = true"
            >
                <span>My Lists</span>
                <v-icon>account_circle</v-icon>
            </v-btn>

            <v-btn
                color="pink"
                flat
                value="favorites"
                @click="toggle = false"
            >
                <span>Favorites</span>
                <v-icon>favorite</v-icon>
            </v-btn>
            </v-bottom-nav>
        </v-card>

        <Index v-if="profile" :filter="toggle ? profile.user_id : profile.favorites" :filterType="toggle ? 'profile' : 'favorites'"/>

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
            bottomNav: 'yourlists',
            toggle: true,
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
    .yourLists .contain {
        max-width: 1250px;
        width:90%
    }
</style>
