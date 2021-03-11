<template>
  <div id="signup">
      
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
            md="6"
            xs="12"
            lg="5"
            xl="6"
            class="ma-0 pa-0"
          >
            <v-card class="elevation-3 ma-0 pa-0">
              <v-container class="ma-0 pa-0">
                <v-row class="ma-0 pa-0">
                  <v-col md="6" xs="12" lg="12" xl="6" class="ma-0 pa-0">
                    <v-img src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/healthy-food-background-by-iuliia-malivanchuk-iuliia-malivanchuk.jpg" style="width: 100%; height: 100%">
                    </v-img>
                  </v-col>
                  <v-col md="6" xs="12" lg="12" xl="6" style="padding: 35px" class="text-center">
                    <!--  <v-toolbar
                        color="primary"
                        dark
                        flat
                      >
                    <v-toolbar-title>Login form</v-toolbar-title>
                    </v-toolbar> -->
                    <form @submit.prevent="signup">
                      <v-card-text>
                      <h1 style="color: #004660">Welcome Back</h1>
                      <br>
                      <div v-if="user.error">{{ user.error }}</div>
                        <p>To keep connect with us please login with your personal info.</p>
                        <v-flex align="center" class="justify-center">
                          <v-form>
                          <v-text-field
                            id="styled-input"
                            class="styled-input"
                            dense
                            outlined
                            rounded
                            v-model="user.firstName"
                            label="Enter your firstname"
                            prepend-inner-icon="mdi-account"
                          ></v-text-field>
                          <v-text-field
                            id="styled-input"
                            class="styled-input"
                            dense
                            outlined
                            rounded
                            v-model="user.lastName"
                            label="Enter your lastname"
                            prepend-inner-icon="mdi-account"
                          ></v-text-field>
                          <v-text-field
                            id="styled-input"
                            class="styled-input"
                            dense
                            outlined
                            rounded
                            v-model="user.contactNo"
                            label="Enter your contact no."
                            prepend-inner-icon="mdi-account"
                          ></v-text-field>
                          <v-text-field
                            id="styled-input"
                            class="styled-input"
                            dense
                            outlined
                            rounded
                            v-model="user.email"
                            label="Enter your email"
                            prepend-inner-icon="mdi-account"
                          ></v-text-field>
                          <v-text-field
                            id="styled-input"
                            class="styled-input"
                            dense
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
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                          <v-select
                            id="styled-input"
                            class="styled-input"
                            dense
                            v-model="user.accountType"
                            rounded
                            :items="items"
                            label="Account Type"
                            prepend-inner-icon="mdi-account"
                            outlined
                          ></v-select>
                        </v-form>
                        <v-btn type="submit" color="#004660" rounded block x-large style="color: white">Sign Up</v-btn><br>
                        <span>--or sign in with--</span><br><br>
                        Don't have an account? <router-link to="/" style="color: #004660">Sign in</router-link>
                      <!--  <v-container>
                          <v-row>
                            <v-col cols="6">
                              <v-btn color="primary" style="width: 100%" rounded x-large @click="$router.replace('/dashboard')">facebook</v-btn><br>
                            </v-col>
                            <v-col cols="6">
                              <v-btn color="red" style="width: 100%" rounded x-large @click="$router.replace('/dashboard')">Google</v-btn>
                            </v-col>
                          </v-row>
                        </v-container> -->
                        
                        
                        </v-flex>
                    </v-card-text>
                    </form>
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
import 'firebase/auth';
require('firebase/firestore');

import {db} from '../../firebase';


export default {
  name: 'signup',
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
      id: null,
      firstName: '',
      lastName: '',
      contactNo: null,
      email: null,
      password: '',
      accountType: null,
      accountStatus: 0,
      stripedId: null,
      totalTrans: null,
    },
    error: null,
    items: ['Supervisor', 'Dispatcher', 'Accounting', 'Registrar', 'Support'],
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => ('The email and password you entered don\'t match'),
    },
  }),

  methods: {
    async signup(){
      try{
        firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password).then(cred => {
          console.log(cred.user.uid);
          let userData = {
            id: cred.user.uid,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            contactNo: this.user.contactNo,
            email: this.user.email,
            accountType: this.user.accountType,
            accountStatus: 0,
            stripedId: null,
            totalTrans: null,
          }

          db.collection("employees").doc(cred.user.uid).set(userData)
          .then(function() {
              console.log("Document successfully written!");
          })
          .catch(function(error) {
              console.error("Error writing document: ", error);
          }); 

        });

        this.$router.replace({name: 'Dashboard'});
      }catch(err){
        console.log(err)
      }
    },
  },
};
</script>

<style>
#styled-input {
  height: 15px;
  font-size: 12px;
}
.styled-input label[for] {
  height: 20px;
  font-size: 15px;
}
</style>