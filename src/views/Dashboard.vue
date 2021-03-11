<template>
  <div class="dashboard">
    <v-container style="padding: 20px" fluid
      ><br />
      <h3 style="font-weight: 400">Hi, Welcome Back!</h3>
      <span style="font-size: 13px">Welcome to Skood Admin Dashboard</span>
      <v-row>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" lg="6" v-for="(line, l) in lineChart" :key="l">
              <v-card class="text-left" style="height: 138px; box-shadow: none">
                <span
                  style="
                    font-size: 30px;
                    position: absolute;
                    top: 20px;
                    right: 15px;
                  "
                  >{{ line.value }}</span
                >
                <span
                  style="
                    font-size: 20px;
                    color: grey;
                    position: absolute;
                    top: 20px;
                    left: 15px;
                  "
                  >{{ line.title }}</span
                >
                <v-card-text style="position: absolute; bottom: 2px"
                  >8.5%<br />Since Last Month</v-card-text
                >
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12">
              <v-card style="box-shadow: none; height: 300px; padding: 20px">
                <div id="bar"></div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row style="padding: 10px">
        <h3>Top Menus</h3>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-sheet style="width: 100%">
            <v-slide-group v-model="model" center-active show-arrows>
              <v-slide-item
                v-for="(menu, m) in topMenus"
                :key="m"
                v-slot="{ toggle }"
              >
                <v-card
                  class="ma-3"
                  height="230"
                  width="280"
                  style="box-shadow: none"
                  @click="toggle"
                >
                  <v-img
                    class="white--text align-end"
                    height="170px"
                    lazy-src="https://thumbs.gfycat.com/UnderstatedFrayedAlabamamapturtle-size_restricted.gif"
                    :src="menu.itemImageURL"
                  >
                    <v-card-title style="font-size: 14px">{{
                      menu.itemName
                    }}</v-card-title>
                  </v-img>

                  <v-card-text class="text--primary">
                    <v-chip
                      class="ma-2"
                      color="red"
                      text-color="white"
                      style="position: absolute; top: 170px; right: 5px"
                    >
                      &#x20b1; {{ menu.itemPrice }}
                    </v-chip>
                    <div>
                      Ordered:
                      <span style="font-weight: bold; color: black">{{
                        menu.itemCtr
                      }}</span>
                    </div>
                    <div>
                      Revenue:
                      <span style="font-weight: bold; color: black"
                        >&#x20b1; {{ menu.itemPrice * menu.itemCtr }}</span
                      >
                    </div>
                  </v-card-text>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row style="padding: 10px">
        <h3>Restaurants</h3>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-sheet style="width: 100%">
            <v-slide-group v-model="model" center-active show-arrows>
              <v-slide-item
                v-for="(myResto, my) in restaurants"
                :key="my"
                v-slot="{ toggle }"
              >
                <v-card class="ma-3" height="230" width="280" @click="toggle">
                  <v-img
                    class="white--text align-end"
                    height="150px"
                    lazy-src="https://thumbs.gfycat.com/UnderstatedFrayedAlabamamapturtle-size_restricted.gif"
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
                  <v-card-text class="text--primary" style="position: relative">
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
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card style="box-shadow: none; padding: 20px">
            <div id="pie"></div>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card style="box-shadow: none; padding: 20px">
            <div id="line"></div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
/* import VueCharts from 'vue-chartjs' */
/* import { Bar } from 'vue-chartjs' */
import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";

import { db } from "../firebase";
// import css
import "frappe-charts/dist/frappe-charts.min.css";

export default {
  name: "Dashboard",
  components: {
    //Bar
  },
  data: () => ({
    model: null,
    sparklines: ["1", "1", "1", "1"],
    lineChart: [
      { title: "Order", value: 0 },
      { title: "Pending", value: 0 },
      { title: "Revenue", value: "13,524" },
      { title: "Expense", value: "123,524" },
    ],
    menus: [
      {
        name: "Adobong Manok",
        price: "23,524",
        ordered: "423",
        revenue: "23,242",
      },
      { name: "Carbonara", price: "22,524", ordered: "423", revenue: "23,242" },
      {
        name: "Leche plan",
        price: "13,524",
        ordered: "423",
        revenue: "23,242",
      },
      {
        name: "Wancha Milk Tea",
        price: "123,524",
        ordered: "423",
        revenue: "23,242",
      },
    ],
    topMenus: [],
    restaurants: [],
  }),
  firestore: {
    restaurants: db.collection("restaurants"),
  },
  methods: {
    barChart() {
      const data = {
        labels: [
          "12am-3am",
          "3am-6pm",
          "6am-9am",
          "9am-12am",
          "12pm-3pm",
          "3pm-6pm",
          "6pm-9pm",
          "9am-12am",
        ],
        datasets: [
          {
            name: "Some Data",
            type: "bar",
            values: [25, 40, 30, 35, 8, 52, 17, -4],
          },
          {
            name: "Another Set",
            type: "line",
            values: [25, 50, -10, 15, 18, 32, 27, 14],
          },
        ],
      };

      const chart = new Chart("#bar", {
        // or a DOM element,
        // new Chart() in case of ES6 module with above usage
        title: "EARNINGS",
        data: data,
        type: "bar", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 250,
        colors: ["#7cd6fd", "#743ee2"],
      });

      console.log(chart);
    },
    pieChart() {
      const data = {
        labels: [
          "12am-3am",
          "3am-6pm",
          "6am-9am",
          "9am-12am",
          "12pm-3pm",
          "3pm-6pm",
          "6pm-9pm",
          "9am-12am",
        ],
        datasets: [
          {
            name: "Some Data",
            type: "bar",
            values: [25, 40, 30, 35, 8, 52, 17, -4],
          },
          {
            name: "Another Set",
            type: "line",
            values: [25, 50, -10, 15, 18, 32, 27, 14],
          },
        ],
      };

      const chart = new Chart("#pie", {
        // or a DOM element,
        // new Chart() in case of ES6 module with above usage
        title: "RESTAURANT RAITING",
        data: data,
        type: "pie", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 360,
        colors: ["#7cd6fd", "#743ee2"],
      });

      console.log(chart);
    },
    liningChart() {
      const data = {
        labels: [
          "12am-3am",
          "3am-6pm",
          "6am-9am",
          "9am-12am",
          "12pm-3pm",
          "3pm-6pm",
          "6pm-9pm",
          "9am-12am",
        ],
        datasets: [
          {
            name: "Some Data",
            type: "bar",
            values: [25, 40, 30, 35, 8, 52, 17, -4],
          },
          {
            name: "Another Set",
            type: "line",
            values: [25, 50, -10, 15, 18, 32, 27, 14],
          },
        ],
      };

      const chart = new Chart("#line", {
        // or a DOM element,
        // new Chart() in case of ES6 module with above usage
        title: "VISIT HOUR",
        data: data,
        type: "line", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 360,
        colors: ["#7cd6fd", "#743ee2"],
      });

      console.log(chart);
    },
    explore(id) {
      this.$router.push({
        name: "SelectedRestaurant",
        params: {
          id: id,
        },
      });
    },
  },
  created() {
    db.collection("orders").onSnapshot((querySnapshot) => {
      var arrayItems = [];
      querySnapshot.forEach((doc) => {
        /* restaurants.push(doc.id) */
        arrayItems.push(doc.data());
        this.lineChart[0].value = arrayItems.length;
      });
    });

    db.collection("orders")
      .where("isAccepted", "==", false)
      .where("orderStatus", "==", 1)
      .onSnapshot((querySnapshot) => {
        var arrayItems = [];
        querySnapshot.forEach((doc) => {
          /* restaurants.push(doc.id) */
          arrayItems.push(doc.data());
          this.lineChart[1].value = arrayItems.length;
        });
      });

    db.collection("items")
      .orderBy("itemCtr", "desc")
      .limit(10)
      .onSnapshot((querySnapshot) => {
        var arrayItems = [];
        querySnapshot.forEach((doc) => {
          /* restaurants.push(doc.id) */
          arrayItems.push(doc.data());
        });
        this.topMenus = arrayItems;
      });
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.barChart();
    this.pieChart();
    this.liningChart();
  },
};
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
.cards {
  box-shadow: none;
}
.resto-x {
  display: flex;
  overflow-x: hidden;
}
.resto-x:hover {
  overflow-x: auto;
}
::-webkit-scrollbar {
  width: 10px;
  height: 13px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border-radius: 20px;
  border: 1px solid #b0b0b0;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #004660;
  transition: 0.2s ease;
}
</style>
