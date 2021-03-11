<template>
  <div class="Assign">
    <v-card>
      <v-card-title>
        Pending Menus
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
        :items="menus"
        :search="search"
        single-expand
        :expanded.sync="expanded"
        item-key="id"
        show-expand
        dense
        aria-setsize="2px"
        class="elevation-1"
      >
        <template v-slot:item.itemImage="{ item }">
          <v-img
            class="white--text align-end"
            height="67px"
            width="67px"
            :src="item.itemImageURL"
            style="border-radius: 50%; margin: 20px"
          >
          </v-img>
        </template>
        <template v-slot:item.priceSlot="{ item }">
          <v-chip
            :color="item.itemPrice !== null ? 'red' : 'gray'"
            :class="item.itemPrice !== null ? 'hasPrice' : 'noPrice'"
            style="font-size: 12px"
          >
            <span v-if="item.itemPrice !== null">
              &#x20b1; {{ item.itemPrice }}
            </span>
            <span v-else>
              No Price Yet
            </span>
          </v-chip>
        </template>
        <template v-slot:item.tagSlot="{ item }">
          <span v-for="(tag, t) in tags" :key="t">
            <span v-if="item.tagId == tag.id">
              {{ tag.name }}
            </span>
          </span>
        </template>
        <template v-slot:item.categorySlot="{ item }">
          <span v-for="(categ, c) in categories" :key="c">
            <span v-if="item.categoryId == categ.id">
              {{ categ.categoryName }}
            </span>
          </span>
        </template>
        <template v-slot:item.prepTimeSlot="{ item }">
          <span>
            {{
              item.prepTime != null
                ? `${item.prepTime}mins.`
                : "No preperation time yet"
            }}
          </span>
        </template>

        <template v-slot:item.status="{ item }">
          <span v-if="item.isDisplayed == true">
            <v-chip color="#004660" style="color: white; font-size: 12px">
              Displayed
            </v-chip>
          </span>
          <span v-else>
            <v-chip style="font-size: 12px"> Not displayed </v-chip>
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu transition="slide-x-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on" class="mr-2">
                mdi-dots-vertical
              </v-icon>
            </template>
            <v-list>
              <v-list-item @click="confirmItem(item)">
                <v-icon size="16">mdi-clipboard-account-outline</v-icon
                ><v-list-item-title style="font-size: 11px; margin-left: 5px"
                  >Confirm item {{ item.itemName }} to be added</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="deleteOrAddMenu(item)">
                <v-icon size="16">mdi-clipboard-account-outline</v-icon
                ><v-list-item-title style="font-size: 11px; margin-left: 5px">
                    Delete item {{ item.itemName }}
                </v-list-item-title>
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
                    More info about {{ item.itemName }}
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12">
                  <span style="font-size: 14px; font-weight: bold">
                    Item Sales: </span
                  ><br />
                  {{ item.itemSales }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12">
                  <span style="font-size: 14px; font-weight: bold">
                    Item Status: </span
                  ><br />
                  {{ item.itemStatus == 1 ? "Active" : "In-active" }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12">
                  <span style="font-size: 14px; font-weight: bold">
                    Featured: </span
                  ><br />
                  {{ item.isFeatured == true ? "Is Featured" : "Not Featured" }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12">
                  <span style="font-size: 14px; font-weight: bold">
                    Ranking:
                    <v-rating
                      color="warning"
                      full-icon="mdi-heart"
                      background-color="dimgray"
                      empty-icon="mdi-heart-outline"
                      dense
                      v-model="item.restaurantRating"
                      readonly
                      size="16"
                    ></v-rating>
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12">
                  <span style="font-size: 14px; font-weight: bold">
                    Item Description: </span
                  ><br />
                  {{ item.itemDescription }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12">
                  <span style="font-size: 14px; font-weight: bold">
                    Restaurant: </span
                  ><br />
                  <span v-for="(resto, index) in restaurants" :key="index">
                      <span v-if="item.restaurantId === resto.id">
                          {{ resto.name }}
                      </span>
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="3000" left color="green">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */

/* import * as firebase from "firebase/app"; */
import { db } from "../../firebase";
/* import { fb } from '../../firebase'; */

export default {
  name: "Assign",
  components: {
    //
  },
  data: () => ({
    snackbar: false,
    snackbarText: "",
    headers: [
      { text: "Menu Image", value: "itemImage", align: "start" },
      {
        text: "Name",
        sortable: true,
        value: "itemName",
      },
      { text: "Price", value: "priceSlot", sortable: true },
      { text: "Tag", value: "tagSlot", sortable: true },
      { text: "Cateogry", value: "categorySlot", sortable: true },
      { text: "Preperation Time", value: "prepTimeSlot", sortable: true },
      { text: "Display Status", value: "status", sortable: true },
      { text: "Action", value: "actions" },
      { text: "More", value: "data-table-expand" },
    ],
    menus: [],
    restaurants: [],
  }),
  firestore: {
    tags: db.collection("tags"),
    categories: db.collection("categories"),
    menus: db.collection("items"),
    restaurants: db.collection("restaurants")
  },
  methods: {
    confirmItem(item) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "This menu will be added",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Add this menu!",
        })
        .then(async (result) => {
          if (result.value) {
            this.$swal.fire(
              "Added!!",
              "Item " + item.itemName + " added.",
              "success"
            );
            db.collection("items").doc(item.id).update({
              itemStatus: 1
          })
          }
        });
    }
  },
  created() {
      this.$bind(
      "menus",
      db
        .collection("items")
/*         .where("orderCreated", ">=", this.timeFormat(" 00:00:00"))
        .where("orderCreated", "<=", this.timeFormat(" 23:59:59")) */
        .where("itemStatus", "==", 2)
    );
  },
};
</script>

<style scoped>
.noPrice {
  color: black;
}
.hasPrice {
  color: white;
}
</style>
