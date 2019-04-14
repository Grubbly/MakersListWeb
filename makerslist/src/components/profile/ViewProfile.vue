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
        <material-card
          color="green"
          title="Edit Profile"
          text="Complete your profile"
        >
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    label="Company"
                    />
                </v-flex>
                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    class="purple-input"
                    label="User Name"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    label="Email Address"
                    class="purple-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md6
                >
                  <v-text-field
                    label="First Name"
                    class="purple-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md6
                >
                  <v-text-field
                    label="Last Name"
                    class="purple-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    label="Adress"
                    class="purple-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md4>
                  <v-text-field
                    label="City"
                    class="purple-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md4>
                  <v-text-field
                    label="Country"
                    class="purple-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md4>
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"/>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-flex>
                <v-flex
                  xs12
                  text-xs-right
                >
                  <v-btn
                    class="mx-0 font-weight-light cyan darken-4"
                    color="success"
                  >
                    Update Profile
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
      <v-flex
        xs12
        md4
      >
        <material-card class="v-card-profile">
          <v-avatar
            slot="offset"
            class="mx-auto d-block"
            size="130"
          >
            <img
              :src="test"
            >
          </v-avatar>
          <v-card-text class="text-xs-center">
            <h6 class="category text-gray font-weight-thin mb-3">MakersList Premium Member</h6>
            <h4 class="card-title font-weight-light">{{profile.alias}}</h4>
            <p class="card-description font-weight-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae in consectetur dignissimos, quidem quis unde facere distinctio ut expedita at non maxime vel aperiam labore, vitae deserunt dolore rem nisi?</p>
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
            test: "https://images.unsplash.com/photo-1497316730643-415fac54a2af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
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


