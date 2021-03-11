<template>
  <div>
    <v-card>
      <v-card-title>
        Orders in Queue
      </v-card-title>
      <div
        style="color: #004660; font-size: 11px; font-weight: bold; margin-left: 15px; margin-bottom: 8px"
      >
        <span>Pending Orders ({{ restaurant_orders.length }})</span>
        <span style="position: absolute; top: 63px; right: 15px"
          ><a href="">Mark all as opened</a></span
        >
      </div>
      <v-divider></v-divider>
      <v-list two-line max-height="500" style="overflow: auto">
        <v-list-item-group>
          <template
            v-for="(item, index) in restaurant_orders"
            style="height: 20px"
          >
            <v-list-item
              :key="index"
              :class="index === 0 ? 'firstOrder' : ''"
              @click="showOrder(item)"
            >
              <template>
                <v-list-item-content style="height: 80px;">
                  <span v-for="user in customers" :key="user.id">
                    <span v-if="item.userId == user.id">
                      <v-list-item-title
                        style="font-size: 11px; position: absolute; top: 5px; left: 15px;"
                        ><span style="font-weight: bold">Order From:</span>
                        {{ user.firstName }}
                        {{ user.lastName }}</v-list-item-title
                      >
                    </span>
                  </span>
                  <v-list-item-title
                    style="font-size: 11px; position: absolute; top: 20px; left: 15px;"
                    ><span style="font-weight: bold">Order #:</span>
                    {{ item.restaurantOrderNo }}</v-list-item-title
                  >
                  <v-list-item-title
                    style="font-size: 11px; position: absolute; top: 35px; left: 15px;"
                    ><span style="font-weight: bold">Quantity:</span>
                    {{ item.qty }}</v-list-item-title
                  >
                  <span v-for="resto in restaurants" :key="resto.id">
                    <span v-if="item.restaurantId == resto.id">
                      <v-list-item-subtitle
                        style="font-size: 11px; position: absolute; top: 55px; left: 15px;"
                        ><span style="font-weight: bold">Restaurant:</span>
                        {{ resto.name }}</v-list-item-subtitle
                      >
                      <v-img
                        class="white--text align-end"
                        height="50px"
                        width="50px"
                        :src="resto.restaurantImage"
                        style="position: absolute; bottom: 10px; right: 20px;"
                      >
                      </v-img>
                    </span>
                  </span>
                  <span
                    style="font-size: 9px; position: absolute; top: 5px; right: 20px"
                    >{{
                      item.orderCreated.toDate() | moment("h:mm:ss a")
                    }}</span
                  >
                </v-list-item-content>
              </template>
            </v-list-item>
            <v-divider :key="item.id"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <v-dialog v-model="showOrderDialog" persistent max-width="850">
      <v-card class="showOrder" style="overflow: hidden">
        <v-icon
          size="40"
          color="red"
          @click="closeOrder"
          style="position: absolute; top: 10px; right: 10px"
        >
          mdi-close
        </v-icon>
        <v-card-title class="headline">{{ currentOrder.restaurantOrderNo }}</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12" lg="12">
              <span v-for="user in customers" :key="user.id">
                <span v-if="currentOrder.userId == user.id">
                  <v-card-text 
                    class="animate__animated animate__fadeInUp"
                    style="position: absolute; top: 50px; left: 10px; width: 100%"
                    ><span style="font-weight: bold">Order From:</span>
                    {{ user.firstName }} {{ user.lastName }}</v-card-text
                  >
                </span>
              </span>
              <v-card-text
                class="animate__animated animate__fadeInUp"
                style="position: absolute; top: 80px; left: 10px; width: 100%"
                ><span style="font-weight: bold">Total Quantity:</span>
                {{ currentOrder.qty }}</v-card-text
              >
              <span v-for="resto in restaurants" :key="resto.id">
                <span v-if="currentOrder.restaurantId == resto.id">
                  <v-card-text 
                    class="animate__animated animate__fadeInUp"
                    style="position: absolute; top: 110px; left: 10px; width: 100%"
                    ><span style="font-weight: bold">Restaurant:</span>
                    {{ resto.name }}</v-card-text
                  >
                </span>
              </span>
            </v-col>
          </v-row>
          <v-row style="margin-top: 50px">
            <v-col cols="12" lg="6" md="6" class="animate__animated animate__fadeInUp">
              <v-list two-line max-height="500" style="overflow: auto" class="showOrder">
                <v-list-item-group>
                  <div
                    style="color: #004660; font-size: 11px; font-weight: bold; margin-left: 15px; margin-bottom: 8px"
                  >
                    <span>Order Item ({{ currentOrderItem.length }})</span>
                  </div>
                  <template
                    v-for="(item, i) in currentOrderItem"
                    style="height: 20px"
                  >
                    <v-list-item
                      :key="i"
                      style="margin-top: 10px; margin-bottom: 10px"
                      inactive
                    >
                      <template>
                        <v-list-item-content style="height: 80px;">
                          <v-img
                            class="white--text align-end"
                            height="75px"
                            width="75px"
                            :src="item.imgUrl"
                            style="position: absolute; bottom: 0px; left: 15px; border-radius: 5px"
                          >
                          </v-img>
                          <v-list-item-title
                            style="font-size: 11px; position: absolute; top: 10px; left: 100px"
                            ><span style="font-weight: bold">Item:</span>
                            {{ item.itemName }}</v-list-item-title
                          >
                          <v-list-item-subtitle
                            class="text--primary"
                            style="font-size: 11px; position: absolute; top: 25px; left: 100px;"
                            ><span style="font-weight: bold">Order #:</span>
                            {{ item.restaurantOrder }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            class="text--primary"
                            style="font-size: 11px; position: absolute; top: 40px; left: 100px;"
                            ><span style="font-weight: bold">Quantity:</span>
                            {{ item.qty }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle 
                            class="text--primary"
                            style="font-size: 11px; position: absolute; top: 55px; right: 5px;"
                            ><span style="font-weight: bold">Price:</span>
                            &#x20b1;{{ item.itemPrice }}</v-list-item-subtitle
                          >
                          <span
                            v-for="(categ, c) in currentOrderCategory"
                            :key="c"
                          >
                            <span v-if="categ.id == item.categoryId">
                              <v-list-item-subtitle
                                class="text--primary"
                                style="font-size: 11px; position: absolute; top: 55px; left: 100px;"
                              >
                                <span style="font-weight: bold">Category: </span
                                >{{ categ.categoryName }}
                              </v-list-item-subtitle>
                            </span>
                          </span>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col cols="12" lg="6" md="6" class="text-center animate__animated animate__fadeInUp">
              <span v-if="nearbyRider != null">
                <v-list two-line max-height="500" style="overflow: hidden" class="showOrder riderListContainer">
                  <v-list-item-group>
                    <div
                      style="color: #004660; font-size: 11px; font-weight: bold; margin-left: 15px; margin-bottom: 8px"
                    >
                      <span>
                        {{
                          nearbyRider.length > 0 ? nearbyRider.length : "No"
                        }}
                        Nearby Driver
                      </span>
                    </div>
                    <div class="text-center" v-if="findingDriverLoad">
                      <v-progress-circular
                        :size="50"
                        color="#004660"
                        indeterminate
                      ></v-progress-circular
                      ><br />
                      <span style="font-size: 11px; color: #004660"
                        >Looking for a nearby driver within
                        {{ nearbyRiderRadius }}km, Please wait...</span
                      >
                    </div>
                    <div v-else>
                      <template
                        v-for="(rider, index) in nearbyRider"
                        style="height: 20px"
                      >
                        <v-list-item
                          inactive
                          :key="index"
                          style="margin-top: 5px; border-radius: 50px; overflow: hidden"
                          :class="index == riderToDispatchIndex ? 'riderToDispatchIndex' : 'notRiderToDispatchIndex'"
                          class="animate__animated animate__flipInX"
                          @click="dispatchRider(nearbyRider)"
                          :disabled="dispatchRiderIsClicked"
                        >
                          <template>
                            <v-list-item-content style="height: 70px;">
                              <span v-for="user in employees" :key="user.id">
                                <span v-if="rider.driverId == user.id">
                                  <v-img
                                    class="white--text align-end"
                                    height="52px"
                                    width="52px"
                                    src="@/assets/img/driver.png"
                                    style="position: absolute; top: 8px; left: 10px;"
                                  >
                                    <span v-if="rider.driverStatus != 0">
                                      <div
                                        style="height: 15px; width: 15px; border-radius: 50%; border: 2px solid white; background-color: #f26507;"
                                      ></div>
                                    </span>
                                    <span v-else>
                                      <div
                                        style="height: 15px; width: 15px; border-radius: 50%; border: 2px solid white; background-color: #22bf66;"
                                      ></div>
                                    </span>
                                  </v-img>
                                  <v-list-item-title
                                    style="font-size: 12px; position: absolute; top: 5px; left: 70px; font-weight: bold"
                                  >
                                    {{ user.firstName }}
                                    {{ user.lastName }}</v-list-item-title
                                  >
                                  <v-list-item-title
                                    style="font-size: 11px; position: absolute; top: 20px; left: 70px;"
                                  >
                                    {{ user.email }}</v-list-item-title
                                  >
                                  <v-list-item-title
                                    style="font-size: 11px; position: absolute; top: 35px; left: 70px;"
                                  >
                                    {{ user.contactNo }}</v-list-item-title
                                  >
                                  <v-list-item-title
                                    style="font-size: 11px; position: absolute; top: 50px; left: 70px;"
                                  >
                                    {{ rider.distance.toFixed(1) + " km" }}</v-list-item-title
                                  >
                                </span>
                                
                              </span>
                              <v-list-item-subtitle
                                class="text--primary"
                                style="font-size: 11px; position: absolute; top: 50px; right: 25px;"
                              >
                                <span style="font-weight: bold">Status: </span>
                                {{
                                  rider.driverStatus > 0 && rider.isOnline === true ? "On Deliver" : "Available"
                                }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </v-list-item>
                      </template>
                    </div>
                  </v-list-item-group>
                </v-list>
              </span>
              <span v-else>
                <h5>There's no nearby driver</h5>
              </span>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col cols="12" lg="4" md="4">
              <v-btn
                large
                block
                rounded
                outlined
                color="red"
                @click="cancelOrder(currentOrder)"
                class="animate__animated animate__fadeInUp"
              >
                <v-icon left>mdi-food-off</v-icon> Cancel Order
              </v-btn>
            </v-col>
            <v-col cols="12" lg="4" md="4">
              <v-btn
                large
                block
                rounded
                outlined
                color="#004660"
                @click="dispatchRider(nearbyRider)"
                class="animate__animated animate__fadeInUp"
              >
                <v-icon left>mdi-check</v-icon> Dispatch
              </v-btn>
            </v-col>
            <v-col cols="12" lg="4" md="4">
              <v-btn
                :disabled="nearbyRiderRadius > 5 ? true : false"
                large
                block
                rounded
                outlined
                color="#018a36"
                @click="searchMoreKilometer()"
                class="animate__animated animate__fadeInUp"
              >
                <v-icon left>mdi-account-search-outline</v-icon> {{ nearbyRiderRadius }}km of 6km
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dispatchRiderDialog" persistent max-width="500">
      <v-overlay>
        <v-card class="text-center" style="overflow: hidden" width="350">
            <v-container class="text-center">
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-progress-circular
                    :rotate="360"
                    :size="150"
                    :width="15"
                    :value="value"
                    color="#004660"
                  >
                    
                    <v-img
                      class="white--text"
                      height="90px"
                      width="90px"
                      src="@/assets/img/driver.png"
                    >
                    </v-img><br>
                  </v-progress-circular>
                  <span v-for="user in employees" :key="user.id">
                    <div v-if="currentDispatch.driverId == user.id" class="text-center">
                          <h2>
                            <span style="color: #004660; font-size: 26px">
                              {{ value / 10 > 0 ? "Dispatching in " + value / 10 : "" }}
                              
                            </span>
                          </h2>
                          <!-- <vue-text-to-speech>{{value / 10}}</vue-text-to-speech> -->
                          <v-list-item-title
                            style="font-size: 12px; font-weight: bold"
                            :class="value > 0 ? 'animate__animated animate__backInLeft' : 'animate__animated animate__backOutRight'"
                          >
                            {{ user.firstName }}
                            {{ user.lastName }}</v-list-item-title
                          >
                          <v-list-item-title
                            style="font-size: 11px;"
                            :class="value > 0 ? 'animate__animated animate__backInLeft' : 'animate__animated animate__backOutRight'"
                          >
                            {{ user.email }}</v-list-item-title
                          >
                          <v-list-item-title
                            style="font-size: 11px;"
                            :class="value > 0 ? 'animate__animated animate__backInLeft' : 'animate__animated animate__backOutRight'"
                          >
                            {{ currentDispatch.distance.toFixed(1) + " km" }}</v-list-item-title
                          >
                    </div>
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
      </v-overlay>

      
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import * as firebase from "firebase/app";
import { db } from "../firebase";
import { fb } from "../firebase";
import { GeoFirestore } from "../firebase";
import axios from 'axios';
import { EventBus } from '@/bus.js';


export default {
  name: "OrderQueue",
  components: {
    //
  },
  data: () => ({
    loader: null,
    loading3: false,
    noNearbyDriver: false,
    findingDriverLoad: true,
    dispatchRiderDialog: false,
    dispatchRiderIsClicked: false,
    showOrderDialog: false,
    restaurant_orders: [],
    restaurants: [],
    orders: [],
    employees: [],
    customers: [],
    currentOrder: {},
    currentDispatch: {},
    currentOrderItem: {},
    currentOrderCategory: {},
    currentDocDeliver: '',
    riderToDispatchIndex: 0,
    nearbyRider: [],
    nearbyRiderRadius: 2,
    riders: {},
    currentRestaurantsLat: null,
    currentRestaurantsLong: null,
    riderLocations: [],
    interval: {},
    value: 150,
    currentDriverDispatch: null,
  }),
  firestore: {
    restaurants: db.collection("restaurants"),
    employees: db.collection("employees"),
    customers: db.collection("customers"),
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    fetchOrders() {
      const unsubscribe = db.collection("orders")
      .where("orderStatus", "==", 1)
      .where("isAccepted", "==", false)
      .where("hasDispatcher", "==", false)
      .orderBy("orderCreated")
      .onSnapshot(querySnapshot => {
        querySnapshot.docs.map((documentSnapshot) => {
          this.loadNearbyDriverAI(documentSnapshot.data().geoPoint["Pa"], documentSnapshot.data().geoPoint["Ra"], documentSnapshot.id, documentSnapshot.data())
   /*       console.log(documentSnapshot.data().g.geopoint["Pa"]) */
        })

      });

      return () => unsubscribe();
    },

    loadNearbyDriver() {
      
      // Create a GeoCollection reference
      const geocollection = GeoFirestore.collection("driver_status");

      // Create a GeoQuery based on a location
      geocollection
        .near({
          center: new firebase.firestore.GeoPoint(
            this.currentRestaurantsLong,
            this.currentRestaurantsLat
          ),
          radius: this.nearbyRiderRadius,
        })
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          var tempObj = {};
          querySnapshot.forEach((doc) => {
            if (doc.data().isOnline === true && doc.data().hasPending === false) {
              tempObj = {
                  driverId: doc.data().driverId,
                  driverStatus: doc.data().driverStatus,
                  isOnline: doc.data().isOnline,
                  distance: doc.distance,
                };
                doc.data().driverStatus == 0 ? arrayItems.unshift(tempObj) : arrayItems.push(tempObj);
              console.log(doc);
            }
          });

          this.nearbyRider = arrayItems;
          this.nearbyRider != null
            ? (this.noNearbyDriver = false)
            : (this.noNearbyDriver = true);
        });
    },

  /* FOR AI */
    loadNearbyDriverAI(restoLong, restoLat, orderId, currentOrder) {
      // Create a GeoCollection reference
      const geocollection = GeoFirestore.collection("driver_status");

      // Create a GeoQuery based on a location
      geocollection
        .near({
          center: new firebase.firestore.GeoPoint(
            restoLat,
            restoLong
          ),
          radius: /* this.nearbyRiderRadius */50,
        })
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          var tempObj = {};
          querySnapshot.forEach(async (doc) => {
            if (doc.data().isOnline === true && doc.data().hasPending === false) {
              tempObj = {
                  driverId: doc.data().driverId,
                  driverStatus: doc.data().driverStatus,
                  isOnline: doc.data().isOnline,
                  distance: doc.distance,
                };
                doc.data().driverStatus == 0 ? arrayItems.unshift(tempObj) : arrayItems.push(tempObj);
                
            } else {
              /* console.log("NO NEARBY RIDERS") */
            }
          });
          this.nearbyRider = arrayItems;
          this.dispatchRider(this.nearbyRider, currentOrder, orderId);
          this.nearbyRider != null
            ? (this.noNearbyDriver = false)
            : (this.noNearbyDriver = true);
        });
    },

    searchMoreKilometer() {
      this.nearbyRiderRadius += 2;
      this.nearbyRider = [];
      this.findingDriverLoad = true;
      setTimeout(() => {
        this.loadNearbyDriver();
        this.findingDriverLoad = false;
      }, 2000);
    },

    showOrder(item) {
      
      console.log(item)
      console.log(fb.auth().currentUser.uid)
      db.collection("orders").doc(item.id).update({
        hasDispatcher: true,
        assignedDispatcherId: fb.auth().currentUser.uid
      })
      this.showOrderDialog = true;
      this.currentOrder = item;

      db.collection("restaurants")
        .doc(item.restaurantId)
        .get()
        .then((snapshot) => {
          this.currentRestaurantsLat = snapshot.data().geopoint["Pa"];
          this.currentRestaurantsLong = snapshot.data().geopoint["Ra"];
        });

      setTimeout(() => {
        this.loadNearbyDriver();
        this.findingDriverLoad = false;
      }, 2000);

       db.collection("orders").doc(item.id).collection("order_items")
   /*      .where("restaurantId", "==", item.restaurantId)
        .where("restaurantOrder", "==", item.restaurantOrderNo) */
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          querySnapshot.forEach((doc) => {
            arrayItems.push(doc.data());
          });
          this.currentOrderItem = arrayItems;
          console.log(arrayItems)
        });

      db.collection("categories")
        .where("categoryStatus", "==", 1)
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          let tempObj = {};
          querySnapshot.forEach((doc) => {
            tempObj = {
              id: doc.id,
              categoryName: doc.data().categoryName,
              tag: doc.data().tag,
            };
            arrayItems.push(tempObj);
          });
          this.currentOrderCategory = arrayItems;
        });

      db.collection("employees")
        .where("accountType", "==", "Rider")
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          let tempObj = {};
          querySnapshot.forEach((doc) => {
            tempObj = {
              id: doc.id,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              userId: doc.data().id,
              email: doc.data().email,
              contactNo: doc.data().contactNo,
            };
            arrayItems.push(tempObj);
          });
          this.riders = arrayItems;
        });
    },

    async dispatchRider(rider, currentOrder, orderId) {
      console.log("LENGTH: " +this.nearbyRider.length)
     /*  console.log(currentOrder) */
      this.dispatchRiderIsClicked = this.nearbyRider.length;
      var self = this
      if(this.riderToDispatchIndex < this.nearbyRider.length) {

        /* let execute = rider[this.riderToDispatchIndex].driverStatus == 0 ? 0 : 1; */

        /* console.log(this.currentOrder); */
        this.currentDriverDispatch = rider[this.riderToDispatchIndex].driverId;
        console.log("RIDER NA NAUNA: " +rider[this.riderToDispatchIndex].driverId)
        console.log("CURRRENT ORDER ID: " +currentOrder.restaurantId)

        const orderRef = db.collection("orders");
        const snapshot = await orderRef
        .where("restaurantId", "==", currentOrder.restaurantId)
        .where("restaurantOrderNo", "==", currentOrder.restaurantOrderNo)
        .where("isAccepted", "==", false)
        .get();

        snapshot.forEach((doc) => {
          var dispatchData = {
            orderId: orderId,
            customerId: currentOrder.userId,
            deliveryStatus: 1,
            isAccepted: false,
            dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
            dateAccepted: null,
            driverId: rider[this.riderToDispatchIndex].driverId,
            restaurantOrderNo: doc.data().restaurantOrderNo,
            restaurantId: currentOrder.restaurantId,
            grandTotal: doc.data().grandTotal,
            deliveryFee: doc.data().deliveryFee,
            formattedAddress: doc.data().formattedAddress,
            hasPending: false,
            processingFee: currentOrder.processingFee
          }; 
          console.log("PRESENT: \n")
          console.log(dispatchData)

          db.collection("delivery_requests")
            .add(dispatchData)
            .then(function(docRef) {
              console.log(
                "Document successfully written width: " + docRef.id
              );
                self.currentDocDeliver = docRef.id;
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
        })
        

        this.currentDispatch = rider[this.riderToDispatchIndex];
        this.dispatchRiderDialog = true;

        this.interval = setInterval(() => {
          if (this.value === 0) {
            clearInterval(this.interval);
            this.dispatchRiderDialog = false;
            db.collection("delivery_requests")
              .doc(self.currentDocDeliver)
              .update({
                deliveryStatus: 0,
              })
              .then(function() {
                console.log("Document successfully written!");
              })
              .catch(function(error) {
                console.error("Error writing document: ", error);
              });

              this.riderToDispatchIndex += 1
              this.callDispatchingDialog(rider)
              this.dispatchRiderIsClicked = false;
          }
          this.value -= 10;
        }, 1000);
        this.value = 150;

        //------------ SEARCHING isAccepted in delivery_requests collection

        const unsubscribe = db.collection("delivery_requests")
          .where("driverId", "==", this.currentDriverDispatch)
          .where("orderId", "==", currentOrder.id)
          .where("isAccepted", "==", true)
          .where("deliveryStatus", "==", rider[this.riderToDispatchIndex].driverStatus === 0 ? 2 : 3)
          .onSnapshot(querySnapshot => {
              const alertsTemp = querySnapshot.docs.map(documentSnapshot => {
                  if (documentSnapshot.data()) {
                    clearInterval(this.interval);
                    this.dispatchRiderDialog = false;
                    this.showOrderDialog = false;
                    this.riderToDispatchIndex = 0
                    this.dispatchRiderIsClicked = false;
                    this.$swal.fire(
                      "Accepted!",
                      "The order has been accepted!.",
                      "success"
                    );
                    this.value = 150;
                    console.log(currentOrder)
                  }
              });

              console.log(alertsTemp)
          });

          
  /*           
        db.collection("delivery_requests")
          .where("driverId", "==", this.currentDriverDispatch)
          .where("orderId", "==", this.currentOrder.id)
          .where("isAccepted", "==", true)
          .where("deliveryStatus", "==", rider[this.riderToDispatchIndex].driverStatus === 0 ? 2 : 3)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.data()) {
                clearInterval(this.interval);
                this.dispatchRiderDialog = false;
                this.showOrderDialog = false;
                this.riderToDispatchIndex = 0
                this.dispatchRiderIsClicked = false;
                this.$swal.fire(
                  "Accepted!",
                  "The order has been accepted!.",
                  "success"
                );
                this.value = 150;
                console.log(this.currentOrder)
              }
            });
          }); */

/* 
          const phoneToken = this.getToken(rider[this.riderToDispatchIndex].driverId) */
          const notification = this.buildNotification('eWmdznqHSJmgQCJK3rEiBr:APA91bH4YgpZWl0xVvouEWJMRP9s_gdcQuoiaET5EW_bv0AN4ptU3p9sBKV0uTDON2Pyivm0Dh9jwFYAyW-tqa1FOoQw6ZD4Lyq1FqKZWKCbxrmsdWtHrw8w-v-5EGNELm6AfaTERbVm')
          this.sendNotification(notification)

          return () => unsubscribe();

      } else {
        this.riderToDispatchIndex = 0
        console.log("WALA EH")
      }
    },
    getToken(id) {
        console.log("TOKEN NA ID:" +id)
        var token;

        db.collection("riders")
        .doc(id)
        .collection("tokens"
        ).onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              token = doc.id
              console.log("TOKEN NA NAHUGOT: " +token)
          });
        });
        return token;
    },
    buildNotification(token){
      console.log("BUILD NOTIF TOKEN: " +token)
      return {
        "notification": {
          "title": "Skood Admin Dashboard",
          "text": "Skood Admin Notification",
          "sound":"default"
        },
        "to": token,
        "priority":"high",
        "data": {
          "click_action": "FLUTTER_NOTIFICATION_CLICK",
          "id": "1",
          "status": "done",
          "view": "/order-info",
          "deliveryReqId" : this.currentDocDeliver
        },
      }
    },
    buildRequest (notification) {
      return {
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'post',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `key=AAAA9w5iDcI:APA91bGpsN1PkfxJNKw_Kf9KPKotRIFbHFZ00M8lo-O6kYY5NSaUIWHVvo7ib88kdKcyf08Xmc9IGMMXX0wVYREVzEqE-pvJO8voHXAn_coxGE36Jz5EYsIsua88SWeXEhO_greghY7m`
        },
        data: notification
      }
    },
    sendNotification(notification) {
      const request = this.buildRequest(notification)
      axios(request).then((r) => {
        console.log(r)
      }).catch((error) => {
        console.log("SENDING NOTIFICATION FAILED")
        console.log(error)
      })
    },
    callDispatchingDialog(rider){
      this.dispatchRider(rider)
    },

    closeOrder() {
      this.showOrderDialog = false;
      this.nearbyRider = [];
      this.findingDriverLoad = true;
      this.nearbyRiderRadius = 2;
      db.collection("orders").doc(this.currentOrder.id).update({
        hasDispatcher: false,
        assignedDispatcherId: ''
      })
    },

    cancelOrder(order) {
      this.$swal("Hello Vue world!!!");

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, cancel it!",
        })
        .then((result) => {
          if (result.value) {
            this.$swal.fire(
              "Canceled!",
              "Order # " + order.restaurantOrderNo + " has been canceled.",
              "success"
            );
            this.showOrderDialog = false;
          }
        });
    },
  },
  created() {
    EventBus.$on('i-got-clicked', data => {
      console.log(data)
      this.showOrderDialog = true
      this.showOrder(data)
      
    });
    var user = fb.auth().currentUser;

    if (user != null) {
      db.collection("restaurants").onSnapshot((querySnapshot) => {
        let restaurants = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().dispatchers != null) {
            var x;
            for (x = 0; x < doc.data().dispatchers.length; x++) {
              if (doc.data().dispatchers[x] == user.uid) {
                restaurants.push(doc.id);
              }
            }
          }
        });
        this.assignedRestaurants = restaurants;
        this.fetchOrders(); //================> Call Fetching restaurant_orders every updating the assigned restaurants <=================/
      });
    }

    /* 

    this.$bind(
    'documents',
    db
        .collection('documents')
        .where('wordCount', '>', 200)
        .orderBy('wordCount')
    ) */
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 10000);

      this.loader = null;
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.riderToDispatchIndex{
  box-shadow: 1px 3px 7px -4px;
  border-top: 2px solid white;
  border-right: 1px solid rgba(238, 238, 238, 0.966);
  border-left: 1px solid white;
}
.riderToDispatchIndex:hover{
  cursor: pointer;
  box-shadow: 1px 3px 9px -4px;
  transition: .3s ease;
}
.showOrder {
  background-color: rgb(247, 245, 245);
}

.riderListContainer:hover{
  overflow: auto;
}
</style>
