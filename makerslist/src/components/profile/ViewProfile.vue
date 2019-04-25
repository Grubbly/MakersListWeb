<template>
  <div class="view-profile bogus2">
        <!-- <div v-if="profile" class="card title">
            <h2 class="cyan-text text-darken-4 center">{{profile.alias}}'s Profile</h2>
        </div> -->

    <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        xs12
        md8
      >
        <v-card class="cyan darken-4" hover @click="$vuetify.goTo(target, options)">
            <v-card-title primary-title>
                <div>
                  <div class="headline white-text">{{profile.first}} {{profile.last}}</div>
                  <span class="grey-text text-lighten-2">Profile details</span>
                </div>
              </v-card-title>
        </v-card>
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    label="Company"
                    :value="profile.company"
                    v-model="profile.company"
                    />
                </v-flex>
                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    class="purple-input"
                    label="User Name"
                    :value="profile.alias"
                    v-model="profile.alias"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    label="Email Address"
                    class="purple-input"
                    :value="profile.email"
                    v-model="profile.email"/>
                </v-flex>
                <v-flex
                  xs12
                  md6
                >
                  <v-text-field
                    label="First Name"
                    class="purple-input"
                    :value="profile.first"
                    v-model="profile.first"/>
                </v-flex>
                <v-flex
                  xs12
                  md6
                >
                  <v-text-field
                    label="Last Name"
                    class="purple-input"
                    :value="profile.last"
                    v-model="profile.last"/>
                </v-flex>
                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    label="Adress"
                    class="purple-input"
                    :value="profile.address"
                    v-model="profile.address"/>
                </v-flex>
                <v-flex
                  xs12
                  md4>
                  <v-text-field
                    label="City"
                    class="purple-input"
                    :value="profile.city"
                    v-model="profile.city"/>
                </v-flex>
                <v-flex
                  xs12
                  md4>
                  <v-text-field
                    label="Country"
                    class="purple-input"
                    :value="profile.country"
                    v-model="profile.country"/>
                </v-flex>
                <v-flex
                  xs12
                  md4>
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"
                    :value="profile.postalCode"
                    v-model="profile.postalCode"/>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    :value="profile.about"
                    v-model="profile.about"
                  />
                </v-flex>
                <v-flex
                  xs12
                  text-xs-right
                  class="save-btn"
                >
                  <v-btn
                    class="mx-0 font-weight-light cyan darken-4"
                    color="success"
                    @click="updateProfile()"
                  >
                    Save
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
      </v-flex>
      <v-flex
        xs12
        md4
      >
        <material-card class="v-card-profile">
          <v-avatar
            slot="offset"
            class="mx-auto d-block"
            size="200"
          >
            <img
              :src="test"
            >
          </v-avatar>
          <v-card-text class="text-xs-center">
            <h4 class="card-title font-weight-light">{{profile.alias}}</h4>
            <h6 class="category text-gray font-weight-thin mb-3">MakersList Premium Member</h6>
            <p class="card-description font-weight-light">{{this.profile.about}}</p>
            <v-btn
              color="success"
              round
              class="font-weight-light cyan darken-4"
            >Follow</v-btn>
          </v-card-text>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import db from '@/firebase/init'
import Index from '@/components/Index.vue'
import * as easings from 'vuetify/es5/util/easing-patterns'

export default {
    name: 'ViewProfile',
    data() {
        return{
            test: "https://images.unsplash.com/photo-1497316730643-415fac54a2af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
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
    computed: {
      target () {
        const value = 400
        if (!isNaN(value)) return Number(value)
        else return value
      },
      options () {
        return {
          duration: 500,
          offset: 400,
          easing: 'easeInOutCubic'
        }
      },
    },
    methods: {
        updateProfile() {
            let ref = db.collection('users')
            ref.doc(this.$route.params.id).update({
                alias: this.profile.alias,
                user_id: this.profile.user_id,
                company: this.profile.company,
                email: this.profile.email,
                first: this.profile.first,
                last: this.profile.last,
                address: this.profile.address,
                city: this.profile.city,
                country: this.profile.country,
                postalCode: this.profile.postalCode,
                about: this.profile.about,
            })
        }
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
