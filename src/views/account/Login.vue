<template>
  <div id="login">
      
    <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="12"
            md="5"
            lg="4"
            xl="3"
            xs="12"
            class="ma-0 pa-0"
          >
            <v-card class="elevation-3 ma-0 pa-0">
              <v-container class="ma-0 pa-0">
                <v-row class="ma-0 pa-0">
                  <v-col md="12" xs="12" style="padding: 40px" class="text-center">
                    <!--  <v-toolbar
                        color="primary"
                        dark
                        flat
                      >
                    <v-toolbar-title>Login form</v-toolbar-title>
                    </v-toolbar> -->
                    <v-card-text>
                      
                      <h2>Sign in to App</h2>
                      <br>
                      <div class="text-center">
                        <img src="@/assets/img/skood.png" style="width: 90px" />
                      </div>
                      <p>To keep connect with us please login with your personal info.</p>
                      <div v-if="error" style="margin-bottom: 20px">
                        <div
                          class="ma-2 pa-4"
                          style="margin-bottom: 20px; background-color: red; color: white; border-radius: 25px"
                        >
                          {{error_message}}
                        </div>
                      </div>
                      <v-flex align="center" class="justify-center">
                        <form @submit.prevent="logIn">
                          <v-text-field
                            outlined
                            rounded
                            v-model="user.email"
                            label="Enter you email"
                            prepend-inner-icon="mdi-account"
                          ></v-text-field>

                          <v-text-field
                              outlined
                              rounded
                              v-model="user.password"
                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="[rules.required, rules.min]"
                              :type="show1 ? 'text' : 'password'"
                              name="input-10-1"
                              prepend-inner-icon="mdi-lock"
                              label="Enter your password"
                              hint="At least 8 characters"
                              @click:append="show1 = !show1"
                            ></v-text-field>
                            <v-btn type="submit" color="#004660" rounded block x-large style="color: white">Sign in</v-btn><br>
                        </form>
                        <span>--or sign in with--</span><br><br><br>
                      </v-flex>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import * as firebase from 'firebase/app';
import { db } from '../../firebase';
import 'firebase/auth';


export default {
  name: 'login',
  props: {
    source: String,
  },

  components: {
   /*  HelloWorld, */
  },

  data: () => ({
    show1: false,
    show2: true,
    show3: false,
    show4: false,
    user: {
      email: '',
      password: '',
    },
    error: false,
    error_message: '',
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => ('The email and password you entered don\'t match'),
    },
  }),

  methods: {
    async logIn(){
      try{
        const session = await firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        console.log("NAKALOGIN :" +session.user.uid)
        db.collection('employees').doc(session.user.uid).get().then(snapshot => {
            if(snapshot.data().accountType === 'Supervisor') {
              this.$store.commit("setIsAdmin", true);
              this.$router.replace({name: 'Dashboard'});
            } else if(snapshot.data().accountType === 'Dispatcher') {
              this.$store.commit("setIsDispatcher", true);
              this.$router.replace({name: 'Orders'});
            }
        });
        
      }catch(err){
        console.log("Exact message: " +err.message)
        this.error = true
        this.error_message = err.message
      }
    }
  },
};
</script>

<style>

</style>