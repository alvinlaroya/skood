<template>
  <div class="orders">
    <v-container>
      <h3 style="font-weight: 400">Hi, Welcome Back!</h3>
      <span style="font-size: 13px">Welcome {{ session.name }} to Skood Dispatcher Dashboard</span>
      <v-row>
        <v-col cols="12" xl="12" lg="12" style="margin-bottom: 10px">
          <OrderTop4Card />
        </v-col>
<!--         <v-col cols="12" xl="6" lg="12">
          <v-row>
            <v-col cols="12">
              <v-card class="text-left" style="min-height: 322px; height: 100%; margin-bottom: 10px">
                <v-card-title
                  >Restaurants ({{ myRestaurants.length }})</v-card-title
                >
                  <v-sheet
                    style="width: 100%"
                  >
                    <v-slide-group
                      v-model="model"
                      center-active
                      show-arrows
                    >
                      <v-slide-item
                        
                        v-for="(myResto, my) in myRestaurants"
                        :key="my"
                        v-slot="{ toggle }"
                      >
                        <v-card class="ma-2" height="230" width="280" @click="toggle">
                          <v-img
                            class="white--text align-end"
                            height="150px"
                            :src="myResto.restaurantImage"
                          >
                            <div
                              style="
                                height: 60px;
                                width: 100%;
                                background-color: rgba(0, 0, 0, 0.6);
                              "
                            >
                              <v-card-title
                                style="font-size: 14px; margin-bottom: 20px"
                                >{{ myResto.name }}</v-card-title
                              >
                            </div>
                          </v-img>
                          <v-card-text
                            class="text--primary"
                            style="position: relative"
                          >
                            <v-btn
                              absolute
                              color="orange"
                              class="white--text"
                              fab
                              small
                              right
                              top
                              @click="explore(myRestaurants, myResto.id)"
                            >
                              <v-icon>mdi-cart</v-icon>
                            </v-btn>
                            <div style="font-size: 12px">
                              Owner: {{ myResto.owner }}
                            </div>
                            <div>
                              <v-rating
                                style="margin-left: -3px"
                                v-model="myResto.restaurantRating"
                                dense
                                color="warning"
                                full-icon="mdi-heart"
                                background-color="dimgray"
                                empty-icon="mdi-heart-outline"
                                readonly
                              ></v-rating>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>
                  </v-sheet>
              </v-card>
            </v-col>
          </v-row>
        </v-col> -->
      </v-row>
      <v-row style="margin-top: -10px">
        <v-col cols="12" lg="8">
          <v-card>
            <v-toolbar color="cyan" dark flat>
              <v-app-bar-nav-icon></v-app-bar-nav-icon>

              <v-toolbar-title>Orders</v-toolbar-title>
              <template v-slot:extension>
                <v-tabs v-model="tab" align-with-title>
                  <v-tabs-slider color="#004660"></v-tabs-slider>
                  <v-tab> Order Details </v-tab>
                  <v-tab>
                    <v-badge
                      color="pink"
                      size="40"
                      :content="order_delivered.length"
                      :value="order_delivered.length > 0 ? true : false"
                    >
                      Sale Processing
                    </v-badge>
                  </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                  <Tab1 :orderData="restaurant_orders" :customers="customers" />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <Tab2 :processOrders="order_delivered" />
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4">
          <OrderQueue />
          <br />
          <ActiveRider />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import * as firebase from "firebase/app";

import { db } from "../../firebase";
import { fb } from "../../firebase";
import ActiveRider from "../../components/ActiveRider";
import OrderTop4Card from "../../components/OrderTop4Card";
import OrderQueue from "../../components/OrderQueue";

import Tab1 from "../../components/order_tabs/Tab1";
import Tab2 from "../../components/order_tabs/Tab2";

export default {
  name: "orders",
  components: {
    ActiveRider,
    OrderTop4Card,
    OrderQueue,
    Tab1,
    Tab2,
  },
  data: () => ({
    model: null,
    session: {
      name: "AAWGWA"
    },
    search: "",
    expanded: [],
    singleExpand: false,
    restaurant_orders: [],
    restaurants: [],
    myRestaurants: [],
    orders: [],
    order_delivered: [],
    customers: [],
    tab: null,
    items: [
      {
        name: "Order Status",
        hasBadge: false,
      },
      {
        name: "Sale Processing",
        hasBadge: true,
      },
    ],
  }),
  firestore: {
    orders: db.collection("order_items"),
    ordersNotProcessed: db.collection("order_items"),
    order_delivered: db.collection("orders"),
    restaurants: db.collection("restaurants"),
    customers: db.collection("customers"),
  },
  methods: {
    editItem(i) {
      console.log(i);
    },
    deleteItem(i) {
      console.log(i);
    },
    explore(restaurant, id) {
      this.$router.push({
        name: "SelectedRestaurant",
        params: {
          id: id,
        },
      });
    },
    timeFormat(hms) {
      var d = new Date();
      var date = d.getDate();
      var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
      var year = d.getFullYear();

      return firebase.firestore.Timestamp.fromDate(
        new Date(`${year}-${month}-${date}${hms}`)
      );
    },
    fetchOrders() {
      db.collection("orders")
        .orderBy("orderCreated", "desc")
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          var tempObj = {};
          querySnapshot.forEach((doc) => {
            tempObj = {
              id: doc.id,
              ammountChange: doc.data().ammountChange,
              ammountRendered: doc.data().ammountRendered,
              assignedDriver: doc.data().assignedDriver,
              deliveryFee: doc.data().deliveryFee,
              grandTotal: doc.data().grandTotal,
              subTotal: doc.data().subTotal,
              isAccepted: doc.data().isAccepted,
              isProcessed: doc.data().isProcessed,
              modeOfPayment: doc.data().modeOfPayment,
              orderCreated: doc.data().orderCreated,
              orderNo: doc.data().orderNo,
              orderStatus: doc.data().orderStatus,
              restaurantId: doc.data().restaurantId,
              restaurantOrderNo: doc.data().restaurantOrderNo,
              userId: doc.data().userId,
              formattedAddress: doc.data().formattedAddress
            };
            arrayItems.push(tempObj);
            this.restaurant_orders = arrayItems;
          });
        });
      /*    db.collection("orders")
          .orderBy("orderCreated")
          .onSnapshot((querySnapshot)=>  {
              var arrayItems = []
              var tempObj = {}
              querySnapshot.forEach((doc) => {
                  var x;
                  for(x=0; x<this.assignedRestaurants.length; x++){
                      if(doc.data().restaurantId == this.assignedRestaurants[x].id) {
                          tempObj = {
                            id: doc.id,
                            ammountChange: doc.data().ammountChange,
                            ammountRendered: doc.data().ammountRendered,
                            assignedDriver: doc.data().assignedDriver,
                            deliveryFee: doc.data().deliveryFee,
                            grandTotal: doc.data().grandTotal,
                            isAccepted: doc.data().isAccepted,
                            isProcessed: doc.data().isProcessed,
                            modeOfPayment: doc.data().modeOfPayment,
                            orderCreated: doc.data().orderCreated,
                            orderNo: doc.data().orderNo,
                            orderStatus: doc.data().orderStatus,
                            restaurantId: doc.data().restaurantId,
                            RestaurantName: this.assignedRestaurants[x].name,
                            restaurantOrderNo: doc.data().restaurantOrderNo,
                            userId: doc.data().userId
                          }
                          arrayItems.push(tempObj);
                          this.restaurant_orders = arrayItems
                      }
                  }
              });
          }); */
    },
    showOrderNotif(item) {
      if (item.isOpened == false) {
        db.collection("restaurant_orders")
          .doc(item.id)
          .update({
            isOpened: true,
          })
          .then(function () {
            console.log("Document successfully updated!");
          });
      }
    },
  },
  created() {
    var user = fb.auth().currentUser;
    this.session.name = user.displayName;

    if (user != null) {
      db.collection("restaurants").onSnapshot((querySnapshot) => {
        let restaurants = [];
        let myRestaurantsArray = [];
        querySnapshot.forEach((doc) => {
          restaurants.push({
            id: doc.id,
            name: doc.data().name,
          });
          myRestaurantsArray.push({
            id: doc.id,
            restaurantImage: doc.data().restaurantImage,
            name: doc.data().name,
            owner: doc.data().owner,
          });
          /* if(doc.data().dispatchers != null) {
                        var x;
                        for(x=0; x<doc.data().dispatchers.length; x++){
                            if(doc.data().dispatchers[x] == user.uid) {
                                restaurants.push({
                                  id: doc.id,
                                  name: doc.data().name
                                })
                                myRestaurantsArray.push({
                                  id: doc.id,
                                  restaurantImage: doc.data().restaurantImage,
                                  name: doc.data().name,
                                  owner: doc.data().owner,
                                })
                            }
                        }
                    } */
        });
        this.assignedRestaurants = restaurants;
        this.myRestaurants = myRestaurantsArray;
        this.fetchOrders(); //================> Call Fetching restaurant_orders every updating the assigned restaurants <=================/
      });
    }

    this.$bind(
      "order_delivered",
      db
        .collection("orders")
     /*    .where("orderCreated", ">=", this.timeFormat(" 00:00:00"))
        .where("orderCreated", "<=", this.timeFormat(" 23:59:59")) */
        .where("orderStatus", "==", 3)
        .where("isProcessed", "==", false)
        .where("assignedDispatcherId", "==", fb.auth().currentUser.uid)
        .orderBy("orderCreated", "asc")
    );
  },
};
</script>

  <style>
.firstOrder {
  border-left: 4px solid #004660;
}
.resto-x {
  display: flex;
  overflow-x: hidden;
}
.resto-x:hover{
    overflow-x: auto;
}
</style>