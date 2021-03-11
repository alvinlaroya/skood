<template>
  <div>
    <v-toolbar dark color="teal">
      <v-icon>mdi-home-search-outline</v-icon>
      <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        cache-items
        class="mx-4"
        flat
        hide-no-data
        hide-details
        @change="searchedRestaurant()"
        label="What restaurant are you looking for?"
        solo-inverted
      ></v-autocomplete>
      <v-btn
        large
        elevation="0"
        style="font-size: 12px; color: #ffffff; border-radius: 0; background-color: transparent"
        height="60"
        @click="$router.replace('/dashboard')"
      >
        <v-icon>mdi-view-dashboard-outline</v-icon>
      </v-btn>
      <v-btn
        large
        elevation="0"
        style="font-size: 12px; color: #ffffff; border-radius: 0; background-color: transparent"
        nudge-width="150px"
        height="60"
        @click="openAddDialog"
      >
        <v-icon>mdi-plus-circle-outline</v-icon
        ><span style="margin-left: 5px">New Restaurant</span>
      </v-btn>
    </v-toolbar>

    <v-dialog v-model="mapDialog" width="1400">
      <v-btn height="50" width="50" icon color="white" @click="mapDialog = false" style="position: fixed; top: 10px; right: 10px">
        <v-icon size="35">mdi-close</v-icon>
      </v-btn>
      <span style="font-size: 13px; color: white">LAT: {{ addRestoData.lat }}</span>
      <span style="font-size: 13px; color: white; margin-left: 20px">LONG: {{ addRestoData.long }}</span>
      <gmap-map ref="mymap" :center="{lat: center.lat, lng: center.long}" :zoom="15" style="width: 100%; height: 800px;" map-type-id="terrain">
          <gmap-marker :position="{lat: center.lat, lng: center.long}" :draggable="true" @drag="updateCoordinates" @click="center = m.position" />
      </gmap-map>
    </v-dialog>
    <v-dialog v-model="addRestoDialog" width="1200">
      <v-card style="overflow-x: hidden">
        <v-card-title style="color: white; background-color: #004660" class="headline">
          <v-icon style="font-size: 30px; color: white; margin-right: 10px;"
            >mdi-silverware-fork-knife</v-icon
          >Add Restaurant
        </v-card-title>
        <v-img :src="imageUrl" height="400"> </v-img>
          <v-container>
            <div style="margin-top: -60px;" class="text-center">
              <v-btn
                class="mx-2"
                fab
                style="width: 100px; height: 100px; box-shadow: none"
                color="white"
                @click="onPickFile"
              >
                <v-icon style="font-size: 80px;" color="primary"
                  >mdi-camera-outline</v-icon
                >
              </v-btn>
              <p style="margin-top: 4px; font-size: 13px">Select Restaurant Photo</p>
              <input
                type="file"
                accept="image/*"
                @change="onFilePicked"
                ref="fileInput"
                style="display: none"
              />
            </div>
          </v-container>
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step
                  :complete="e1 > 1"
                  step="1"
                >
                  Step 1
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  :complete="e1 > 2"
                  step="2"
                >
                  Step 2
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">
                  Step 3
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-form
                      ref="form1"
                      v-model="valid"
                      lazy-validation
                  >
                    <v-container>
                      <v-row>
                        <v-col>
                          <span style="font-weight: bold">Restaurant Coordinates: </span>
                          <span>{{addRestoData.lat}}, {{addRestoData.long}}</span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-row>
                            <v-col cols="12" lg="9">
                               <vuetify-google-autocomplete
                                id="map"
                                clearable
                                classname="form-control"
                                placeholder="Enter Restaurant / Establishment"
                                v-on:placechanged="getAddressData"
                                country="ph"
                                :rules="[rules.required]"
                                types="establishment"
                                prepend-icon="mdi-map-marker"
                              >
                              </vuetify-google-autocomplete>
                            </v-col>
                            <v-col cols="12" lg="3">
                              <v-text-field
                                label="Discount Percentage"
                                v-model="addRestoData.discountPercentage"
                                prepend-inner-icon="mdi-percent"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                      </v-row>
                      <v-row style="margin-top: -20px">
                        <v-col cols="12" lg="6" style="margin-top: 31px">
                        </v-col>
                        <v-col cols="12" lg="6" style="margin-top: 20px">
                          <v-row>
                            <v-col cols="4">
                              <v-chip color="#004660" style="color: white; margin-top: 17px" v-if="addRestoData.isFreeDelivery">Free Delivery</v-chip>
                              <v-chip v-else style="margin-top: 17px">Not Free Delivery</v-chip>
                            </v-col>
                            <v-col cols="2" class="text-right">
                              <v-switch
                                  large
                                  v-model="addRestoData.isFreeDelivery"
                                  style="margin-left: 20px"
                              ></v-switch>
                            </v-col>
                            <v-col cols="4">
                              <v-chip color="#004660" style="color: white; margin-top: 17px" v-if="addRestoData.specialCase == true">Special Case</v-chip>
                              <v-chip v-else style="margin-top: 17px">Special Case</v-chip>
                            </v-col>
                            <v-col cols="2" class="text-right">
                              <v-switch
                                  large
                                  v-model="addRestoData.specialCase"
                                  style="margin-left: 20px"
                              ></v-switch>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row style="margin-top: -30px;">
                        <v-col cols="12" lg="4">
                          <v-text-field
                            label="Name of Restaurant"
                            v-model="addRestoData.name"
                            :rules="[rules.required]"
                            prepend-inner-icon="mdi-silverware-fork-knife"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4">
                          <v-text-field
                            label="Name of Owner"
                            v-model="addRestoData.owner"
                            :rules="[rules.required]"
                            prepend-inner-icon="mdi-account-circle"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4">
                          <v-text-field
                            label="Owner's Email"
                            v-model="addRestoData.email"
                            :rules="[rules.required, rules.email]"
                            prepend-inner-icon="mdi-email"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                  <div class="text-right">
                    <v-btn color="primary" text @click="mapDialog = true">
                      Show Map
                    </v-btn>
                    <v-btn color="primary" text @click="[addRestoDialog = false, $refs.form1.reset()]">
                      Close
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="submitForm1(2)"
                    >
                      Continue
                    </v-btn>
                  </div>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-form
                      ref="form2"
                      v-model="valid"
                      lazy-validation
                  >
                    <v-container>
                      <v-row style="margin-top: 0px; margin-bottom: -40px">
                        <v-col cols="12" lg="6">
                          <v-container>
                            <v-row>
                              <v-col cols="6" class="text-left">
                                <span>Opening Time: {{ addRestoData.openingTime }}</span>
                              </v-col>
                              <v-col cols="6" class="text-right">
                                <v-btn color="primary" text @click="openingDialog = true" style="margin-top: -10px">
                                  Select Opening Time
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-container>
                            <v-row>
                              <v-col cols="6" class="text-left">
                                <span>Closing Time: {{ addRestoData.closingTime }}</span>
                              </v-col>
                              <v-col cols="6" class="text-right">
                                <v-btn color="primary" text @click="closingDialog = true" style="margin-top: -10px">
                                  Select Closing Time
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-col>
                      </v-row>
                      <v-row style="padding: 10px">
                        <v-col cols="12" lg="12">
                          <v-textarea
                            row-height="9"
                            v-model="addRestoData.desc"
                            :rules="[rules.required, rules.counter]"
                            maxlength="201"
                            prepend-inner-icon="mdi-text"
                            label="Restaurant Description"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                  <div class="text-right" style="margin-top: 15px">
                    <v-btn color="primary" text @click="[addRestoDialog = false, $refs.form2.reset()]">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="submitForm2(3)"
                    >
                      Continue
                    </v-btn>

                    <v-btn text @click="e1 = 1">
                      Back
                    </v-btn>
                  </div>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-form
                      ref="form3"
                      v-model="valid"
                      lazy-validation
                  >
                  <v-container>
                    <v-row>
                      <v-col cols="12" lg="4">
                        <v-text-field
                          label="Contact Number"
                          v-model="addRestoData.contact"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-phone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="4">
                        <v-text-field
                          label="Website"
                          v-model="addRestoData.website"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-web"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="4">
                        <v-text-field
                          label="Cusine"
                          v-model="addRestoData.cuisine"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-silverware-fork-knife"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  </v-form>
                  <div class="text-right">
                    <v-btn color="primary" text @click="[addRestoDialog = false, $refs.form3.reset()]">
                      Close
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="onCreateRestaurant"
                      :loading="loadingAddingResto"
                      :disabled="loadingAddingResto"
                    >
                      Save Changes
                    </v-btn>

                    <v-btn text @click="e1 = 2">
                      Back
                    </v-btn>
                  </div>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
      <!--     <v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="mapDialog = true">
                Show Map
              </v-btn>
              <v-btn color="primary" text @click="addRestoDialog = false">
                Cancel
              </v-btn>
              <v-btn color="primary" text @click="onCreateRestaurant">
                Save Changes
              </v-btn>
            </v-card-actions>
          </v-container> -->
      </v-card>
    </v-dialog>
    <v-dialog v-model="openingDialog" width="300">
      <v-btn height="50" width="50" icon color="white" @click="openingDialog= false" style="position: fixed; top: 10px; right: 10px">
        <v-icon size="35">mdi-close</v-icon>
      </v-btn>
      <v-time-picker
        v-model="addRestoData.openingTime"
        scrollable
      ></v-time-picker>
    </v-dialog>
    <v-dialog v-model="closingDialog" width="300">
      <v-btn height="50" width="50" icon color="white" @click="closingDialog= false" style="position: fixed; top: 10px; right: 10px">
        <v-icon size="35">mdi-close</v-icon>
      </v-btn>
      <v-time-picker
        v-model="addRestoData.closingTime"
        scrollable
      ></v-time-picker>
    </v-dialog>
    <v-snackbar
      v-model="addRestoSnackbar"
      color="success"
      left
      multi-line
    >
      {{ addRestoSnackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="addRestoSnackbar = false"
        >
          <v-icon>
              mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import { db } from "../firebase";
import Geohash from '../../src/assets/latlong';
import 'firebase/storage';

var config = {apiKey: "AIzaSyByqKVpzNLKDy4qGE_VpVX6qTimVX_xKsQ",
    authDomain: "ordering-app-ph.firebaseapp.com",
    databaseURL: "https://ordering-app-ph.firebaseio.com"};
var secondaryApp = firebase.initializeApp(config, "Secondary2");

export default {
  data: () => ({
    valid: null,
    rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 100 || 'Max 200 characters',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
        },
    },
    e1: 1,
    mapDialog: false,
    loading: false,
    items: [],
    search: null,
    select: null,
    imageUrl: "https://semantic-ui.com/images/wireframe/image.png",
    restaurants: [],
    addRestoDialog: false,
    openingDialog: false,
    closingDialog: false,
    addRestoSnackbar: false,
    addRestoSnackbarText: '',
    addRestoData: {
      lat: 10,
      long: 10,
      address: "aasfawfafawfaw",
      name: "",
      owner: "",
      email: "",
      desc: "",
      contact: "",
      website: "",
      cuisine: "",
      openingTime: null,
      closingTime: null,
      isFreeDelivery: false,
      specialCase: false,
      discountPercentage: 0,
    },
    center: {
      lat: 0,
      long: 0,
    },
    precision: 9,
    loadingAddingResto: false,
  }),
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  mounted(){
    this.getLocation();
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((response) => {
          this.center.lat = response.coords.latitude
          this.center.long = response.coords.longitude
        })
      }
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.restaurants.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    searchedRestaurant() {
      db.collection("restaurants")
      .where("name", "==", this.select)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.$router.push({
                name: 'SelectedRestaurant',
                params: {
                    id: doc.id,
                },
            });
        });
      });
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      this.imageData = event.target.files[0];
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please pick valid image");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
        console.log(this.imageUrl);
      });
      fileReader.readAsDataURL(files[0]);
    },
    getAddressData: function(establishmentData, placeResultData) {
      this.addRestoData.address = placeResultData.formatted_address;
      this.addRestoData.lat = establishmentData.latitude;
      this.addRestoData.long = establishmentData.longitude;
    },
    submitForm1(num) {
      if(this.addRestoData.address !== "" && this.addRestoData.name !== "" &&
        this.addRestoData.owner !== "" && this.addRestoData.email !== "" && this.imageUrl !== "https://semantic-ui.com/images/wireframe/image.png") {
          this.e1 = num
      } else {
        this.$swal.fire(
            `Opss.`,
            `Please upload Restaurant Image`,
            'warning'
        )
        this.$refs.form1.validate()
      }
    },
    submitForm2(num) {
      if(this.addRestoData.desc !== "") {
          this.e1 = num
      } else {
        this.$refs.form2.validate()
      }
    },
    onCreateRestaurant() {
      if(
        this.addRestoData.address !== "" && this.addRestoData.name !== "" &&
        this.addRestoData.owner !== "" && this.addRestoData.email !== "" &&
        this.addRestoData.desc !== "" && this.addRestoData.contact !== "" &&
        this.addRestoData.website !== "" && this.addRestoData.cuisine !== "" &&
        this.addRestoData.openingTime !== null && this.addRestoData.closingTime !== null
      ) {
        var self = this
        this.loadingAddingResto = true;
        var date = Math.round(new Date().getTime() / 1000);
        const storageRef = firebase
          .storage()
          .ref(`images/${this.imageData.name}` + date)
          .put(this.imageData);
        storageRef.on(
          "state_changed",
          (snapshot) => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error.message);
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {

              try{
                secondaryApp.auth().createUserWithEmailAndPassword(self.addRestoData.email, 'TaraPhilippines!123').then(cred => {
                  console.log("ID ITO: " +cred.user.uid);
                  var restaurantData = {
                    id: cred.user.uid,
                    email: self.addRestoData.email,
                    hasLoggedIn: false,
                    isPasswordChanged: false,
                    contactNo: self.addRestoData.contact,
                    cuisine: self.addRestoData.cuisine,
                    description: self.addRestoData.desc,
                    isDisplayed: false,
                    g: {
                      geohash: Geohash.encode(self.addRestoData.lat, self.addRestoData.long, self.precision),
                      geopoint: new firebase.firestore.GeoPoint(
                        self.addRestoData.lat,
                        self.addRestoData.long
                      )
                    },
                    geopoint: new firebase.firestore.GeoPoint(
                        self.addRestoData.lat,
                        self.addRestoData.long
                    ),
                    location: self.addRestoData.address,
                    name: self.addRestoData.name,
                    orderNo: 0,
                    owner: self.addRestoData.owner,
                    openingTime: self.addRestoData.openingTime,
                    closingTime: self.addRestoData.closingTime,
                    restaurantStatus: 2,
                    restaurantCtr: 0,
                    restaurantImage: url,
                    restaurantRating: 0,
                    restaurantReviewCtr: 0,
                    restaurantSales: 0,
                    website: self.addRestoData.website,
                    discountPercentage: Number(self.addRestoData.discountPercentage),
                    isFreeDelivery: self.addRestoData.isFreeDelivery,
                    specialCase: self.addRestoData.specialCase,
                    isOnPeakHours: false,
                    isForceClosed: false,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                    dateOfIssue: firebase.firestore.Timestamp.fromDate(new Date(parseInt(new Date().getTime()) + 604800000)),
                  };

                  db.collection("restaurants")
                  .doc(cred.user.uid)
                  .set(restaurantData)
                  .then(function() {
                    self.loadingAddingResto = false;
                  })
                  .catch(function(error) {
                    console.error("Error writing document: ", error);
                  });
                  self.addRestoSnackbar = true
                  self.addRestoSnackbarText = `Restaurant ${self.addRestoData.name} Added.`
                  self.addRestoData = {
                      lat: null,
                      long: null,
                      address: "",
                      name: "",
                      owner: "",
                      email: "",
                      desc: "",
                      contact: "",
                      website: "",
                      cuisine: "",
                      isFreeDelivery: false,
                      discountPercentage: 0,
                      specialCase: false,
                      openingTime: null,
                      closingTime: null,
                  }
                  this.$refs.form1.reset()
                  this.$refs.form2.reset()
                  this.$refs.form3.reset()
                  self.imageUrl = "https://semantic-ui.com/images/wireframe/image.png"
                  self.e1 = 1
                  
                    
                  secondaryApp.auth().signOut();
                });
              }catch(err){
                console.log(err)
              }
              this.addRestoDialog = false;
            });
          }
        );
      } else {
        this.$refs.form3.validate()
      }
    },
    openAddDialog() {
      this.addRestoDialog = true;
    },
    // *********** METHODS FOR MAP ****************
    updateCoordinates(location) {
      console.log(location)
      this.addRestoData.lat = location.latLng.lat()
      this.addRestoData.long = location.latLng.lng()
    },
  },
  created() {
    db.collection("restaurants").onSnapshot((querySnapshot) => {
      var arrayMenu = [];
      querySnapshot.forEach((doc) => {
        arrayMenu.push(doc.data().name);
      });
      this.restaurants = arrayMenu;
    });
  },
};
</script>

<style></style>
