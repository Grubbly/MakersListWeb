<template>
    <div class="yourLists">
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
            >
                <span>Your Lists</span>
                <v-icon>account_circle</v-icon>
            </v-btn>

            <v-btn
                color="cyan darken-4"
                flat
                value="favorites"
            >
                <span>Favorites</span>
                <v-icon>favorite</v-icon>
            </v-btn>
            </v-bottom-nav>
        </v-card>
        <Index v-if="profile && bottomNav == 'yourlists'" :filter="profile.user_id"/>
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
            bottomNav: 'favorites',
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

