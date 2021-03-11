<template>
  <nav>
    <!-- #004660 -->
    <v-app-bar app color="white" dark height="45">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/img/skood.png"
          transition="scale-transition"
          width="60"
        />
      </div>
      <v-spacer></v-spacer>

      <template>
        <div class="text-center">
          <v-btn icon @click="$router.push('/dashboard')">
            <v-icon size="20" color="#004660">mdi-view-dashboard-outline</v-icon>
          </v-btn>
          <v-menu
            fixed
            max-height="500"
            offset-y
            nudge-width="450"
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-badge color="pink" dot offset-x="21" offset-y="21" :value="restaurant_orders.length > 0">
                <v-btn icon v-on="on" v-bind="attrs">
                  <v-icon size="20" color="#004660">mdi-order-bool-ascending-variant</v-icon>
                </v-btn>
              </v-badge>
            </template>
            <v-list two-line>
              <v-list-item-group multiple active-class="white">
                <div
                  style="color: #004660; font-size: 11px; font-weight: bold; margin-left: 15px; margin-bottom: 8px"
                >
                  <span>{{ restaurant_orders.length }} Pending Orders</span>
                  <span style="position: absolute; top: 0px; right: 15px"
                    ><a href="">Mark all as read</a></span
                  >
                </div>
                <v-divider></v-divider>
                <template
                  v-for="(item, index) in restaurant_orders.slice().reverse()"
                  style="height: 20px"
                >
                  <v-list-item
                    :key="index"
                    :class="item.isOpened === false ? 'highlighted' : ''"
                    @click="showOrderNotif(item)"
                  >
                    <template>
                      <v-list-item-content style="height: 80px">
                        <span v-for="user in users" :key="user.id">
                          <span v-if="item.userId == user.id">
                            <v-list-item-title
                              style="font-size: 11px; position: absolute; top: 5px; left: 15px;"
                              ><span style="font-weight: bold"
                                >Order From:</span
                              >
                              {{ user.firstName }}
                              {{ user.lastName }}</v-list-item-title
                            >
                          </span>
                        </span>
                        <v-list-item-subtitle
                          class="text--primary"
                          style="font-size: 11px; position: absolute; top: 20px; left: 15px;"
                          ><span style="font-weight: bold">Order #:</span>
                          {{ item.restaurantOrderNo }}</v-list-item-subtitle
                        >
                        <v-list-item-subtitle
                          class="text--primary"
                          style="font-size: 11px; position: absolute; top: 35px; left: 15px;"
                          ><span style="font-weight: bold">Quantity:</span>
                          {{ item.qty }}</v-list-item-subtitle
                        >
                        <span v-for="resto in restaurants" :key="resto.id">
                          <span v-if="item.restaurantId == resto.id">
                            <v-list-item-subtitle
                              style="font-size: 11px; position: absolute; top: 55px; left: 15px;"
                              ><span style="font-weight: bold"
                                >Restaurant:</span
                              >
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
                          style="font-size: 9px; position: absolute; top: 5px; right: 15px"
                          >{{
                            item.orderCreated.toDate()
                              | moment("dddd, MMMM Do YYYY, h:mm:ss a")
                          }}</span
                        >
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                  <v-divider :key="item.id"></v-divider>
                </template>
                <div
                  class="text-center"
                  style="margin-top: 10px; font-size: 12px; font-weight: bold"
                >
                  <router-link to="/food/orders">See all</router-link>
                </div>
              </v-list-item-group>
            </v-list>
          </v-menu>

          <v-bottom-sheet v-model="sheet">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon size="20" color="#004660">mdi-menu</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-subheader>Open in</v-subheader>
              <v-list-item
                v-for="tile in tiles"
                :key="tile.title"
                @click="eventFromMenu(tile.func)"
              >
                <v-list-item-avatar>
                  <v-avatar size="32px" tile>
                    <img
                      :src="tile.img"
                      :alt="tile.title"
                    />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-title>{{ tile.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-bottom-sheet>
        </div>
      </template>
    </v-app-bar>
  </nav>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

import { EventBus } from '@/bus.js';

import { db } from "../firebase";

export default {
  data: () => ({
    loggedIn: false,
    items: [
      { title: "Click Me", funct: "" },
      { title: "Click Me", funct: "" },
      { title: "Click Me", funct: "" },
      { title: "Sign Out", funct: "sigOut" },
    ],
    restaurant_orders: [],
    itemss: [
      {
        action: "15 min",
        headline: "Brunch this weekend?",
        title: "Ali Connors",
        subtitle:
          "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
      },
      {
        action: "2 hr",
        headline: "Summer BBQ",
        title: "me, Scrott, Jennifer",
        subtitle: "Wish I could come, but I'm out of town this weekend.",
      },
      {
        action: "6 hr",
        headline: "Oui oui",
        title: "Sandra Adams",
        subtitle: "Do you have Paris recommendations? Have you ever been?",
      },
      {
        action: "12 hr",
        headline: "Birthday gift",
        title: "Trevor Hansen",
        subtitle:
          "Have any ideas about what we should get Heidi for her birthday?",
      },
      {
        action: "18hr",
        headline: "Recipe to try",
        title: "Britta Holt",
        subtitle:
          "We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
      },
    ],
    sheet: false,
    tiles: [
      { func: 'dashboard', img: "https://w7.pngwing.com/pngs/502/794/png-transparent-white-arrow-going-up-computer-icons-dashboard-car-symbol-dashboard-icon-miscellaneous-angle-logo.png", title: "Dashboard", path: "/dashoard" },
      { func: 'profile', img: "https://p7.hiclipart.com/preview/81/570/423/computer-icons-user-clip-art-user.jpg", title: "Profile", path: "/dashoard" },
      { func: 'orders', img: "https://booster.io/wp-content/uploads/custom-order-numbers-e1438361586475.png", title: "Orders", path: "/dashoard" },
      { func: 'support', img: "https://upload.wikimedia.org/wikipedia/commons/0/05/Google_Messages_logo.svg", title: "Support Messages", path: "/dashoard" },
      { func: 'signOut', img: "https://cdn.pixabay.com/photo/2017/05/29/23/02/logging-out-2355227_960_720.png", title: "Sign Out", path: "/" },
    ],
    notifications: [
      { id: 1, title: "Click Me" },
      { id: 2, title: "Click Me" },
      { id: 3, title: "Click Me" },
      { id: 4, title: "Click Me 2" },
    ],
  }),
  firestore: {
    users: db.collection("users"),
    restaurants: db.collection("restaurants"),
  },
  methods: {
    fetchOrders() {
      const unsubscribe = db.collection("orders")
      .where("orderStatus", "==", 1)
      .where("isAccepted", "==", false)
      .where("hasDispatcher", "==", false)
      .orderBy("orderCreated")
      .onSnapshot(querySnapshot => {
          const alertsTemp = querySnapshot.docs.map(documentSnapshot => {
              return {
                  id: documentSnapshot.id,
                  assignedDriver: '',
                  grandTotal: '',
                  isOpened: '',
                  orderAccepted: '',
                  orderCreated: '',
                  orderDelivered: '',
                  restaurantOrderNo: '',
                  orderStatus: '',
                  qty: '',
                  restaurantId: '',
                  userId: '',
                  ...documentSnapshot.data()
              };
          });

          this.restaurant_orders = alertsTemp
      });

      return () => unsubscribe();
     /* var x;
      for(x=0; x<this.assignedRestaurants.length; x++){

          const unsubscribe = db.collection("orders")
          .where("orderStatus", "==", 1)
          .where("isAccepted", "==", false)
          .where("restaurantId", "==", this.assignedRestaurants[x])
          .orderBy("orderCreated")
          .onSnapshot(querySnapshot => {
              const alertsTemp = querySnapshot.docs.map(documentSnapshot => {
                  return {
                      id: documentSnapshot.id,
                      assignedDriver: '',
                      grandTotal: '',
                      isOpened: '',
                      orderAccepted: '',
                      orderCreated: '',
                      orderDelivered: '',
                      orderNo: '',
                      orderStatus: '',
                      qty: '',
                      restaurantId: '',
                      userId: '',
                      ...documentSnapshot.data()
                  };
              });

              this.restaurant_orders = alertsTemp
          });

          return () => unsubscribe();
      } */
    },

    showOrderNotif(item) {
      this.$router.push({
          name: 'Orders',
      });
      setTimeout(() => {
        EventBus.$emit('i-got-clicked', item);
      }, 1000);
      /* if (item.isOpened == false) {
        db.collection("restaurant_orders")
          .doc(item.id)
          .update({
            isOpened: true,
          })
          .then(function() {
            console.log("Document successfully updated!");
          });
      } */
    },

    async eventFromMenu(func) {
      if(func === 'signOut') {
        try {
          const data = await firebase.auth().signOut();
          console.log(data);
          this.$router.replace({ name: "Login" });
          this.sheet = false;
        } catch (err) {
          console.log(err);
        }
      } else if(func === 'dashboard') {
        this.$router.push('/dashboard');
        this.sheet = false;
      } else if(func === 'profile') {
        this.$router.push('/management/my_account');
        this.sheet = false;
      } else if(func === 'orders') {
        this.$router.push('/food/orders');
        this.sheet = false;
      } else if(func === 'support') {
        this.$router.push('/support/chat');
        this.sheet = false;
      } else {
        //
      }
    },
  },
  created() {
    var user = firebase.auth().currentUser;

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
  },
};
</script>

<style>
.highlighted {
  background-color: #e6f4fa;
}
</style>
