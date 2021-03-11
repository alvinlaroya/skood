<template>
  <div class="riderregistration">
      <v-container style="padding: 20px" fluid>
        <h3 style="font-weight: 400">Hi, Welcome Back!</h3>
        <span style="font-size: 13px">Welcome to Skood Admin Dashboard</span>
        <v-row>
            <v-col cols="12" xl="7" lg="7">
                <h4>Rider Registration Form</h4>
                <v-stepper v-model="e6" vertical>
                    <v-stepper-step :complete="e6 > 1" step="1">
                    Please enter rider information
                    <small>First Name, Last Name, Email, Contact No.</small>
                    </v-stepper-step>

                    <v-stepper-content step="1">
                    <v-card elevation="0" class="mb-12" height="120px">
                         <v-card-text>
                           <v-container>
                                <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                >
                                    <v-row style="margin-top: -30px">
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                                    dense
                                                    id="styled-input"
                                                    class="styled-input"
                                                    outlined
                                                    v-model="rider.firstName"
                                                    :rules="[rules.required, rules.counter]"
                                                    label="Enter your First Name"
                                                    prepend-inner-icon="mdi-account"
                                                    required
                                                ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                                    dense
                                                    id="styled-input"
                                                    class="styled-input"
                                                    outlined
                                                    v-model="rider.lastName"
                                                    :rules="[rules.required, rules.counter]"
                                                    label="Enter your Last Name"
                                                    prepend-inner-icon="mdi-account"
                                                ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6" style="margin-top: -10px">
                                            <v-text-field
                                                    dense
                                                    id="styled-input"
                                                    class="styled-input"
                                                    outlined
                                                    v-model="rider.email"
                                                    :rules="[rules.required, rules.counter, rules.email]"
                                                    label="Enter your Email"
                                                    prepend-inner-icon="mdi-email"
                                                ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6" style="margin-top: -10px">
                                            <v-text-field
                                                    dense
                                                    id="styled-input"
                                                    class="styled-input"
                                                    outlined
                                                    v-model="rider.contactNo"
                                                    :rules="[rules.required, rules.contactCounter]"
                                                    label="Enter your Contact No."
                                                    prepend-inner-icon="mdi-phone"
                                                ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-form>
                           </v-container>
                         </v-card-text>
                    </v-card>
                  <!--   <v-btn color="primary" @click="nextForm1(2)">Continue</v-btn> -->
                    <v-btn color="primary" @click="nextForm1(2)">Continue</v-btn>
                    </v-stepper-content>

                    <v-stepper-step :complete="e6 > 2" step="2">Upload Rider's Driver License</v-stepper-step>

                    <v-stepper-content step="2">
                    <v-card elevation="0" class="mb-12" height="100%">
                        <v-form
                            ref="form2"
                            v-model="valid"
                            lazy-validation
                            style="margin-bottom: -30px"
                        >
                            <v-img :src="rider.driverLicense"> </v-img>
                            <v-container class="text-center">
                            <div style="margin-top: -50px" class="text-center">
                                <v-btn
                                    class="mx-2"
                                    fab
                                    style="width: 90px; height: 90px; box-shadow: none"
                                    color="white"
                                    @click="onMenuPickFileDriverLicense"
                                >
                                <v-icon style="font-size: 80px;" color="primary"
                                    >mdi-camera-outline</v-icon
                                >
                                </v-btn>
                                <p style="margin-top: 4px;">Select Driver License</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    @change="onMenuFilePickedDriverLicense"
                                    ref="DriverLicenseFileInput"
                                    style="display: none"
                                />
                            </div>
                            </v-container>
                        </v-form>
                    </v-card>
                   <!--  <v-btn color="primary" @click="nextForm2(3)">Continue</v-btn> -->
                    <v-btn color="primary" @click="nextForm2(3)">Continue</v-btn>
                    <v-btn text @click="e6 = 1">Back</v-btn>
                    </v-stepper-content>

                    <v-stepper-step :complete="e6 > 3" step="3">Upload Rider's NBI Clearance</v-stepper-step>

                    <v-stepper-content step="3">
                    <v-card elevation="0" class="mb-12" height="100%">
                        <v-form style="margin-bottom: -30px">
                            <v-img :src="rider.nbiClearance"> </v-img>
                            <v-container class="text-center">
                            <div style="margin-top: -50px" class="text-center">
                                <v-btn
                                    class="mx-2"
                                    fab
                                    style="width: 90px; height: 90px; box-shadow: none"
                                    color="white"
                                    @click="onMenuPickFileNbiClearance"
                                >
                                <v-icon style="font-size: 80px;" color="primary"
                                    >mdi-camera-outline</v-icon
                                >
                                </v-btn>
                                <p style="margin-top: 4px;">Select Rider NBI Clearance</p>
                                <input
                                type="file"
                                accept="image/*"
                                @change="onMenuFilePickedNbiClearance"
                                ref="NbiClearanceFileInput"
                                style="display: none"
                                />
                            </div>
                            </v-container>
                        </v-form>
                    </v-card>
                    <!-- <v-btn color="primary" @click="nextForm3(4)">Continue</v-btn> -->
                    <v-btn color="primary" @click="nextForm3(4)">Continue</v-btn>
                    <v-btn text @click="e6 = 2">Back</v-btn>
                    </v-stepper-content>
                    <!-- <v-stepper-step step="4">Assigned rider to restaurants</v-stepper-step>
                    <v-stepper-content step="4">
                    <v-card elevation="0" class="mb-12 text-center" height="100%">
                        <v-form style="margin-bottom: -30px" class="text-center">
                            <v-img :src="rider.riderImage" height="220" width="220" class="center"> </v-img>
                            <v-container class="text-center">
                                <div style="margin-top: -50px" class="text-center">
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        style="width: 70px; height: 70px; box-shadow: none"
                                        color="white"
                                        @click="onMenuPickFileRiderImage"
                                    >
                                    <v-icon style="font-size: 40px;" color="primary"
                                        >mdi-camera-outline</v-icon
                                    >
                                    </v-btn>
                                    <p style="margin-top: 4px;">Select Rider Picture</p>
                                    <input
                                    type="file"
                                    accept="image/*"
                                    @change="onMenuFilePickedRiderImage"
                                    ref="RiderFileInput"
                                    style="display: none"
                                    />
                                </div>
                            </v-container>
                        </v-form>
                    </v-card>
                    <v-btn color="primary" @click="onRiderRegister">Continue</v-btn>
                    <v-btn text @click="e6 = 3">Back</v-btn>
                    </v-stepper-content> -->
                    <v-stepper-step step="4">Upload Rider Profile Image</v-stepper-step>
                    <v-stepper-content step="4">
                    <v-card elevation="0" class="mb-12 text-center" height="100%">
                        <v-form style="margin-bottom: -30px" class="text-center">
                            <v-img :src="rider.riderImage" height="220" width="220" class="center"> </v-img>
                            <v-container class="text-center">
                                <div style="margin-top: -50px" class="text-center">
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        style="width: 70px; height: 70px; box-shadow: none"
                                        color="white"
                                        @click="onMenuPickFileRiderImage"
                                    >
                                    <v-icon style="font-size: 40px;" color="primary"
                                        >mdi-camera-outline</v-icon
                                    >
                                    </v-btn>
                                    <p style="margin-top: 4px;">Select Rider Picture</p>
                                    <input
                                    type="file"
                                    accept="image/*"
                                    @change="onMenuFilePickedRiderImage"
                                    ref="RiderFileInput"
                                    style="display: none"
                                    />
                                </div>
                            </v-container>
                        </v-form>
                    </v-card>
                    <v-btn color="primary" @click="onRiderRegister">Continue</v-btn>
                    <v-btn text @click="e6 = 4">Back</v-btn>
                    </v-stepper-content>
                </v-stepper>
            </v-col>
            <v-col cols="12" xl="5" lg="5">
                <h4>Rider Profile</h4>
                <v-card class="mb-12 text-center">
                    <v-container>
                        <v-img :src="rider.riderImage" height="130" width="130" class="center"> </v-img>
                    </v-container>
                    <v-container>
                        <v-row>
                            <v-col cols="12" lg="12">
                                <p style="font-size: 25px; line-height: 2px; font-weight: 600">
                                    {{ rider.firstName }} {{ rider.lastName }}
                                </p>
                            </v-col>
                            <v-col cols="12" lg="12">
                                <p style="font-size: 20px; line-height: 2px">
                                    {{ rider.email }}
                                </p>
                            </v-col>
                            <v-col cols="12" lg="12">
                                <p style="font-size: 20px; line-height: 2px">
                                    {{ rider.contactNo }}
                                </p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" lg="6">
                                <v-img :src="rider.driverLicense" height="140" width="250" class="center-2"> </v-img>
                                <span>Driver's License</span>
                            </v-col>
                             <v-col cols="12" lg="6">
                                <v-img :src="rider.nbiClearance" height="140" width="250" class="center-2"> </v-img>
                                <span>NBI Clearance</span>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
      </v-container>
    
      <v-overlay :value="overlayLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import * as firebase from 'firebase/app';
import 'firebase/auth';
require('firebase/firestore');
import { db } from '../../firebase';
import 'firebase/storage';

var config = {apiKey: "AIzaSyByqKVpzNLKDy4qGE_VpVX6qTimVX_xKsQ",
    authDomain: "ordering-app-ph.firebaseapp.com",
    databaseURL: "https://ordering-app-ph.firebaseio.com"};
var secondaryApp = firebase.initializeApp(config, "Secondary");

export default {
  name: 'RiderRegistration',
  components: {
    //
  },
  data:() => ({
       e6: 1,
       overlayLoading: false,
       rules: {
            required: value => !!value || 'Required.',
            counter: value => value.length <= 20 || 'Max 20 characters',
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            },
            contactCounter: value => value.length <= 11 && value.length >= 11 || 'Contact number must be 11 digits'
        },
       rider: {
           firstName: '',
           lastName: '',
           email: '',
           password: 'TaraPhilippines123!',
           contactNo: '',
           driverLicense: 'https://www.liberaldictionary.com/wp-content/uploads/2018/11/license.png',
           nbiClearance: 'https://www.liberaldictionary.com/wp-content/uploads/2018/11/license.png',
           riderImage: 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png',
       },
       restaurants: [],
       currentRestaurants: [],
       imageData: '',
       imageData1: '',
       imageData2: '',
       uploadValue: 0,
       finalRiderImage: '',
       finalLicenseImage: '',
       finalClearanceImage: '',
       assignRestoDialog: false,
  }),
  firestore: {
      restaurants: db.collection("restaurants")
  },
  methods: {
     // METHOD FOR RIDER IMAGE
    nextForm1(event) {
        if(this.rider.firstName !== '' &&  this.rider.lastName !== '' && this.rider.email !== '' && this.rider.contactNo !== '') {
            this.e6 = event
        } else {
            this.$refs.form.validate()
        }
    },
    nextForm2(event) {
        if(this.rider.driverLicense === 'https://www.liberaldictionary.com/wp-content/uploads/2018/11/license.png') {
            this.$swal.fire(
                `Opss.`,
                `Please upload driver's license`,
                'warning'
            )
        } else {
            this.e6 = event
        }
    },
    nextForm3(event) {
        if(this.rider.nbiClearance === 'https://www.liberaldictionary.com/wp-content/uploads/2018/11/license.png') {
            this.$swal.fire(
                `Opss.`,
                `Please upload NBI clearance`,
                'warning'
            )
        } else {
            this.e6 = event
        }
    },
    remove (item) {
        const index = this.currentDispatchers.indexOf(item.id)
        if (index >= 0) this.currentDispatchers.splice(index, 1)

        db.collection("riders").doc(this.currentData.restaurantId).update({
            dispatchers: this.currentDispatchers,
        }).then(function() {
            console.log("Document successfully updated!");
        });
    },
    onMenuFilePickedRiderImage(event) {
      this.imageData = event.target.files[0];
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please pick valid image");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.rider.riderImage = fileReader.result;
        console.log(this.imageUrl);
      });
      fileReader.readAsDataURL(files[0]);
    },

    onMenuPickFileRiderImage() {
      this.$refs.RiderFileInput.click();
    },


    // Method for DRIVER LICENSE
    onMenuFilePickedDriverLicense(event) {
      this.imageData1 = event.target.files[0];
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please pick valid image");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.rider.driverLicense = fileReader.result;
        console.log(this.imageUrl);
      });
      fileReader.readAsDataURL(files[0]);
    },

    onMenuPickFileDriverLicense() {
      this.$refs.DriverLicenseFileInput.click();
    },

    // Method for NBI CLEARANCE
    onMenuFilePickedNbiClearance(event) {
      this.imageData2 = event.target.files[0];
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please pick valid image");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.rider.nbiClearance = fileReader.result;
        console.log(this.imageUrl);
      });
      fileReader.readAsDataURL(files[0]);
    },

    onMenuPickFileNbiClearance() {
      this.$refs.NbiClearanceFileInput.click();
    },
    async onRiderRegister(){
        var self = this
        this.overlayLoading = true
        try{
            secondaryApp.auth().createUserWithEmailAndPassword(this.rider.email, this.rider.password).then(cred => {
                console.log(cred.user.uid);
                var date = Math.round(new Date().getTime() / 1000);
                const storageRef1 = firebase
                    .storage()
                    .ref(`images/${this.imageData.name}` + date)
                    .put(this.imageData);
                    storageRef1.on(
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
                    storageRef1.snapshot.ref.getDownloadURL().then((urlRiderImage) => {
                        this.finalRiderImage = urlRiderImage
                    });
                    }
                );

                const storageRef2 = firebase
                    .storage()
                    .ref(`images/${this.imageData1.name}` + date)
                    .put(this.imageData1);
                storageRef2.on(
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
                    storageRef2.snapshot.ref.getDownloadURL().then((urlLicenseImage) => {
                        this.finalLicenseImage = urlLicenseImage
                    });
                    }
                );

                const storageRef3 = firebase
                    .storage()
                    .ref(`images/${this.imageData2.name}` + date)
                    .put(this.imageData2);
                storageRef3.on(
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
                    storageRef3.snapshot.ref.getDownloadURL().then((urlClearanceImage) => {
                        this.finalClearanceImage = urlClearanceImage
                    });
                    }
                );

                setTimeout(function(){ 
                    let riderData = {
                        id: cred.user.uid,
                        firstName: self.rider.firstName,
                        lastName: self.rider.lastName,
                        contactNo: self.rider.contactNo,
                        email: self.rider.email,
                        hasLoggedIn: false,
                        isPasswordChanged: false,
                        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                    }

                    db.collection("riders").doc(cred.user.uid).set(riderData)
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });

                    db.collection('riders').doc(cred.user.uid).collection('rider_profile').doc(cred.user.uid).set({
                        riderImage: self.finalRiderImage,
                        nbi_clearance: self.finalClearanceImage,
                        driver_license: self.finalLicenseImage,
                    })

                    db.collection("driver_status").doc(cred.user.uid).set({
                        driverId: cred.user.uid,
                        driverStatus: 0,
                        isOnline: false,
                        hasPending: false,
                    })
                    .then(function() {
                        console.log("Document successfully written POTANGINA!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });


                    db.collection("employees").doc(cred.user.uid).set({
                            id: cred.user.uid,
                            firstName: self.rider.firstName,
                            lastName: self.rider.lastName,
                            contactNo: self.rider.contactNo,
                            email: self.rider.email,
                            accountType: 'Rider',
                            totalTrans: null,
                            stripedId: null,
                        }
                    )
                    .then(function() {
                        console.log("Document successfully written!");
                        this.rider = {}
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    }); 

                     self.overlayLoading = false
                     self.rider = {
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: 'TaraPhilippines123!',
                        contactNo: '',
                        driverLicense: 'https://www.liberaldictionary.com/wp-content/uploads/2018/11/license.png',
                        nbiClearance: 'https://www.liberaldictionary.com/wp-content/uploads/2018/11/license.png',
                        riderImage: 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png'
                     }
                     self.e6 = 1

                   
                }, 15000);
                secondaryApp.auth().signOut();
            });
        }catch(err){
            console.log(err)
        }
    },
  }
}
</script>

<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  border-radius: 50%
}
.center-2{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  border-radius: 3px;
}
</style>
