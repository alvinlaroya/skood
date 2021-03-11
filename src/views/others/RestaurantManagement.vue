<template>
  <div class="Assign">
    <v-container style="padding: 20px">
        <h3 style="font-weight: 400">Hi, Welcome Back!</h3>
        <span style="font-size: 13px">Welcome to Skood Admin Dashboard</span>
        <!-- <br>ASSIGNED RESTAURANTS: <span>{{ assignedRestaurants }}</span>
        <br><br>ASSIGNED ORDERS: <div v-for="(res, r) in samples" :key="r">
            <span>orderNo: {{ res.orderNo }}</span> / 
            <span>qty: {{ res.qty }} | </span>
        </div> -->
        <v-row>
            <v-col cols="12" lg="12">
                <v-card>
                    <v-card-title>
                    Restaurants
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        style="width: 20px"
                        hide-details
                    ></v-text-field>
                    </v-card-title>
                    <v-data-table
                      :headers="headers"
                      :items="restaurants"
                      :search="search"
                      single-expand
                      :expanded.sync="expanded"
                      item-key="id"
                      show-expand
                      dense
                      aria-setsize="2px"
                      class="elevation-1"
                    >
                        <template v-slot:item.restaurantImage="{ item }">
                          <v-img
                              class="white--text align-end"
                              height="67px"
                              width="67px"
                              :src="item.restaurantImage"
                              style="border-radius: 50%; margin: 20px;"
                          >
                          </v-img>
                        </template>
                        <template v-slot:item.descriptionSlot="{ item }">
                            <span v-if="item.dispatchers != null">
                                <span v-for="(user, i) in item.dispatchers" :key="i">
                                    <span v-for="(peps, p) in people" :key="p">
                                        <span v-if="user == peps.id">
                                            <v-icon color="#004c4c" size="21">mdi-account-tie</v-icon>
                                        </span>
                                    </span>
                                </span>
                            </span>
                            <span v-else>
                                No Dispatcher yet
                            </span>
                        </template>
                        <template v-slot:item.status="{ item }">
                            <span v-if="item.isDisplayed == true">
                                <v-chip color="#004660" style="color: white; font-size: 12px">
                                    Displayed
                                </v-chip>
                            </span>
                            <span v-else>
                                <v-chip style="font-size: 12px">
                                    Not displayed
                                </v-chip>
                            </span>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-menu transition="slide-x-transition">
                                <template v-slot:activator="{ on, attrs }   ">
                                    <v-icon
                                        small
                                        v-bind="attrs"
                                        v-on="on"
                                        class="mr-2"
                                    >
                                    mdi-dots-vertical
                                    </v-icon>
                                </template>
                                <v-list>
                                    <v-list-item
                                        @click="explore(item.id)"
                                    >
                                        <v-icon size="16">mdi-clipboard-account-outline</v-icon><v-list-item-title style="font-size: 11px; margin-left: 5px">Go to {{ item.name }}</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                        @click="assignDispatcher(item)"
                                    >
                                        <v-icon size="16">mdi-clipboard-account-outline</v-icon><v-list-item-title style="font-size: 11px; margin-left: 5px">Assign Dispatcher</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                        @click="onSelectedRestaurant(item)"
                                    >
                                        <v-icon size="16">mdi-clipboard-account-outline</v-icon><v-list-item-title style="font-size: 11px; margin-left: 5px">Update {{ item.name }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            
                        </template>
                        <template v-slot:expanded-item="{ item }">
                            <td colspan="5">
                                <v-container style="padding: 30px">
                                    <v-row>
                                        <v-col cols="12" lg="12">
                                            <span style="font-size: 17px; font-weight: bold">
                                                More info about {{ item.name }}
                                            </span>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="12">
                                            <span style="font-size: 14px; font-weight: bold">
                                                Rating: <v-rating color="warning" full-icon="mdi-heart" background-color="dimgray" empty-icon="mdi-heart-outline" dense v-model="item.restaurantRating" readonly size="16"></v-rating>
                                            </span>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="12">
                                            <span style="font-size: 14px; font-weight: bold">
                                                Restaurant Description:
                                            </span><br>
                                            {{ item.description }}
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="12">
                                            <span style="font-size: 14px; font-weight: bold">
                                                Contact No:
                                            </span><br>
                                            {{ item.contactNo }}
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="12">
                                            <span style="font-size: 14px; font-weight: bold">
                                                Website:
                                            </span><br>
                                            <a :href="item.website">{{ item.website }}</a>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                    <v-col cols="12" lg="12">
                                            <span style="font-size: 14px; font-weight: bold">
                                                Dispatcher:
                                            </span><br>
                                            <span v-if="item.dispatchers != null">
                                                <span v-for="(user, i) in item.dispatchers" :key="i">
                                                    <span v-for="(peps, p) in people" :key="p">
                                                        <span v-if="user == peps.id">
                                                            {{ peps.firstName }} {{ peps.lastName }}<span style="font-weight: bold">,</span> 
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                            <span v-else>
                                                No Dispatcher Yet
                                            </span>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog
      v-model="assignDispatcherDialog"
      width="600"
    >
      <v-card>
        <v-card-title style="color: white;" class="headline primary">
          <v-icon style="font-size: 20px; color: white; margin-right: 10px;">mdi-account-tie</v-icon><span style="font-size: 15px">Add dispatcher to {{ restaurantAssignedName }}</span>
        </v-card-title>

        <v-container>
            <v-img
                :src="restaurantAssignedImage"
                height="205"
            >
            </v-img>
        </v-container>
        <v-container>
            <v-row style="margin-top: -10px;">
                <v-col cols="12" lg="12">
                     <v-autocomplete
                        v-model="currentDispatchers"
                        :items="people"
                        chips
                        color="blue-grey lighten-2"
                        label="Tag Dispatchers"
                        item-text="firstName"
                        item-value="id"
                        multiple
                        cache-items
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click="data.select"
                                @click:close="remove(data.item)"
                            >
                            <v-avatar left>
                                <v-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQQFf2kDj61zTkFgdvuLwKVAFcnGIkFz3aFJQ&usqp=CAU"></v-img>
                            </v-avatar>
                            {{ data.item.firstName }} {{ data.item.lastName }}
                            </v-chip>
                        </template>
                        <template v-slot:item="data">
                            <template v-if="typeof data.item !== 'object'">
                            <v-list-item-content v-text="data.item"></v-list-item-content>
                            </template>
                            <template v-else>
                            <v-list-item-avatar>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQQFf2kDj61zTkFgdvuLwKVAFcnGIkFz3aFJQ&usqp=CAU'">
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{ data.item.firstName }} {{ data.item.lastName }}</v-list-item-title>
                                <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                            </v-list-item-content>
                            </template>
                        </template>
                        </v-autocomplete>
                </v-col>
            </v-row>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn
            color="primary"
            text
            @click="assignDispatcherDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="saveDispatching"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="updateRestoDialog" width="900">
      <v-card>
        <v-card-title style="color: white; background-color: #004660" class="headline">
          <v-icon style="font-size: 30px; color: white; margin-right: 10px;"
            >mdi-silverware-fork-knife</v-icon
          > {{ currentRestaurant.name }}
        </v-card-title>
        <v-img :src="currentRestaurant.restaurantImage" height="255"> </v-img>
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
            <p style="margin-top: 4px; font-size: 12px">Change Restaurant Photo</p>
            <input
              type="file"
              accept="image/*"
              @change="onFilePicked"
              ref="fileInput"
              style="display: none"
            />
          </div>
        </v-container>
        <v-container>
          <v-row style="margin-top: -50px;">
            <v-col cols="12" lg="6">
              <v-text-field
                label="Name of Restaurant"
                v-model="currentRestaurant.name"
                prepend-inner-icon="mdi-silverware-fork-knife"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                label="Name of Owner"
                v-model="currentRestaurant.owner"
                prepend-inner-icon="mdi-account-outline"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row style="margin-top: -25px;">
            <v-col cols="12" lg="12">
              <v-textarea
                v-model="currentRestaurant.description"
                prepend-inner-icon="mdi-order-alphabetical-descending"
                label="Restaurant Description"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row style="margin-top: -20px;">
            <v-col cols="12" lg="4">
              <v-text-field
                label="Contact Number"
                v-model="currentRestaurant.contactNo"
                prepend-inner-icon="mdi-phone-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                label="Website"
                v-model="currentRestaurant.website"
                prepend-inner-icon="mdi-web"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                label="Cusine"
                v-model="currentRestaurant.cuisine"
                prepend-inner-icon="mdi-silverware-fork-knife"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="updateRestoDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="onUpdateRestaurant">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      left
      color="green"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */

import * as firebase from "firebase/app";
import { db } from "../../firebase";
import { fb } from '../../firebase';

export default {
  name: 'Assign',
  components: {
    //
  },
  data: () => ({
        snackbar: false,
        snackbarText: '',
        samples: [],
        assignDispatcherDialog: false,
        updateRestoDialog: false,
        restaurantAssignedImage: '',
        restaurantAssignedName: '',
        assignedRestaurants: [],
        search: '',
        expanded: [],
        singleExpand: false,
        headers: [
            { text: 'Restaurant Image', value: 'restaurantImage',  align: 'start'},
            {
                text: 'Name',
                sortable: true,
                value: 'name',
            },
            { text: 'Dispatchers', value: 'descriptionSlot', sortable: true},
            { text: 'Cuisine', value: 'cuisine', sortable: true},
            { text: 'Owner', value: 'owner', sortable: true},
            { text: 'Location', value: 'location', sortable: true},
            { text: 'Display Status', value: 'status', sortable: true},
            { text: 'Action', value: 'actions' },
            { text: '', value: 'data-table-expand' },
        ],
        restaurants: [],
        arrayDispatchers: [],
        currentDispatchers: [],
        currentRestaurant: {},
        currentData: {
            restaurantId: '',
            dispatchers: [],
        },
        people: [],
        selectedItem: {},
        uploadValue: 0,
        fuseItems: [],
        fuseCategories: [],
        imageChange: false,
  }),
  firestore: {
    restaurants: db.collection('restaurants'),
    
  },  
  methods: {
    onSelectedRestaurant(item){
        this.currentRestaurant = item
        this.updateRestoDialog = true

        db.collection("items").where("restaurantId", "==", this.currentRestaurant.id)
            .onSnapshot((querySnapshot)=>  {
                querySnapshot.forEach((doc) => {
                    this.fuseItems.push(doc.id)
                    
                });
                    
            });

        db.collection("categories").where("restaurantId", "==", this.currentRestaurant.id)
        .onSnapshot((querySnapshot)=>  {
            querySnapshot.forEach((doc) => {
                this.fuseCategories.push(doc.id)
                    
            });
        });

    },
    explore(restaurantId){
        this.$router.push({
            name: 'SelectedRestaurant',
            params: {
                id: restaurantId,
            },
        });
    },
    deleteItem(i){
      console.log(i)
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
        this.imageChange = true
        this.imageData = event.target.files[0];
        const files = event.target.files;
        let filename = files[0].name;
        if (filename.lastIndexOf(".") <= 0) {
            return alert("Please pick valid image");
        }
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            this.currentRestaurant.restaurantImage = fileReader.result;
        });
        fileReader.readAsDataURL(files[0]);
    },
    onUpdateRestaurant() {
      var self = this
      if(this.imageChange) {
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
                    this.updateRestoDialog = false;

                    db.collection("restaurants").doc(this.currentRestaurant.id).update({
                        contactNo: this.currentRestaurant.contactNo,
                        cuisine: this.currentRestaurant.cuisine,
                        description: this.currentRestaurant.description,
                        isDisplayed: this.currentRestaurant.isDisplayed,
                        name: this.currentRestaurant.name,
                        owner: this.currentRestaurant.owner,
                        restaurantImage: url,
                        website: this.currentRestaurant.website,
                    }).then(function() {
                        console.log("Document successfully written!");
                    });
                });
            }
        );
      } else {
          db.collection("restaurants").doc(this.currentRestaurant.id).update({
                contactNo: this.currentRestaurant.contactNo,
                cuisine: this.currentRestaurant.cuisine,
                description: this.currentRestaurant.description,
                isDisplayed: this.currentRestaurant.isDisplayed,
                name: this.currentRestaurant.name,
                owner: this.currentRestaurant.owner,
                website: this.currentRestaurant.website,
            }).then(function() {
                console.log("Document successfully written!");
                self.snackbar = true
                self.snackbarText = `Restaurant ${self.currentRestaurant.name} succesfully updated!`
                this.currentRestaurant = {}
            });
            this.updateRestoDialog = false;
      }

        db.collection("restaurants").doc(this.currentRestaurant.id).update({
            isDisplayed: this.currentRestaurant.isDisplayed,
        }).then(function() {
            //
        });

        this.fuseAllItems()
        this.fuseAllCategories()

        this.fuseItems = []
        this.fuseCategories = []
    },

    assignDispatcher(item){
        this.currentDispatchers = []
        this.selectedItem = item
        this.restaurantAssignedImage = item.restaurantImage
        this.restaurantAssignedName = item.name
        this.assignDispatcherDialog = true
        this.currentData.restaurantId = item.id

        db.collection('restaurants').doc(item.id).get().then(snapshot => {
            this.currentDispatchers = snapshot.data().dispatchers
        }); 
    },
    saveDispatching(){
        db.collection("restaurants").doc(this.currentData.restaurantId).update({
            dispatchers: this.currentDispatchers,
        }).then(function() {
            console.log("Document successfully written!");
        });

        this.currentDispatchers = []
        this.assignDispatcherDialog = false
    },

    remove (item) {
        const index = this.currentDispatchers.indexOf(item.id)
        if (index >= 0) this.currentDispatchers.splice(index, 1)

        db.collection("restaurants").doc(this.currentData.restaurantId).update({
            dispatchers: this.currentDispatchers,
        }).then(function() {
            console.log("Document successfully updated!");
        });
    },

    fetchOrders(){
        db.collection("restaurant_orders")
        .onSnapshot((querySnapshot)=>  {
            var arrayDispatcher1 = []
            querySnapshot.forEach((doc) => {
                var i;
                for(i=0; i<this.assignedRestaurants.length; i++){
                    if(doc.data().restaurantId == this.assignedRestaurants[i]) {
                        arrayDispatcher1.push(doc.data());
                    }
                }
                
            });
            this.samples = arrayDispatcher1
        });
    },
  },
  created(){
    var user = fb.auth().currentUser;
    if (user != null) {
        db.collection("restaurants")
        .onSnapshot((querySnapshot)=>  {
            let restaurants = []
            querySnapshot.forEach((doc) => {
                if(doc.data().dispatchers != null) {
                    var x;
                    for(x=0; x<doc.data().dispatchers.length; x++){
                        if(doc.data().dispatchers[x] == user.uid) {
                            restaurants.push(doc.id)
                        }
                    }
                }
            });
            this.assignedRestaurants = restaurants
            this.fetchOrders() //================> Call Fetching restaurant_orders every updating the assigned restaurants <=================/
            
        });
    }

    
    this.fetchOrders() //================> Fetching restaurant_orders collection base on session assigned restaurants <=================/


    this.$bind('restaurants', db.collection('restaurants').orderBy('createdAt'))

    db.collection("employees")
    .where("accountType", "==", "Dispatcher")
    .onSnapshot((querySnapshot)=>  {
        var arrayDispatcher = []
        querySnapshot.forEach((doc) => {
            arrayDispatcher.push(doc.data());
        });
        this.people = arrayDispatcher
    });

  }
}
</script>
