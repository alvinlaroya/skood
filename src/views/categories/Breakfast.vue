<template>
  <div class="bank">
    <v-breadcrumbs :items="BreadCrumbs"></v-breadcrumbs>
    <v-container>
      <v-row>
        <v-col cols="12" lg="9">
          <v-card>
            <v-card-title>
              Breakfast
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                style="max-width: 420px"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="categories"
              :search="search"
            >
              <template v-slot:item.categoryImage="{ item }">
                <div v-if="item.categoryImage != null">
                  <v-img
                    class="white--text align-end"
                    height="60px"
                    width="60px"
                    :src="item.categoryImage"
                    style="border-radius: 50%; margin: 10px;"
                  >
                  </v-img>
                </div>
                <div v-else>
                  <v-img
                    class="white--text align-end"
                    height="60px"
                    width="60px"
                    src="https://semantic-ui.com/images/wireframe/image.png"
                    style="border-radius: 50%; margin: 10px;"
                  >
                  </v-img>
                </div>
              </template>
              <template v-slot:item.restaurant="{ item }">
                <span v-for="resto in restaurants" :key="resto.id">
                  <span v-if="item.restaurantId == resto.id">
                    {{ resto.name }}
                  </span>
                </span>
              </template>
              <template v-slot:item.status="{ item }">
                <span v-if="item.categoryStatus == 1">
                  <v-chip color="#004660" style="color: white">
                    Active
                  </v-chip>
                </span>
                <span v-else>
                  <v-chip>
                    In-active
                  </v-chip>
                </span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="openActionDialog(item)">
                  <v-icon small>
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card class="mt-6 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset card-header"
              color="#004660"
              elevation="5"
              max-width="calc(100% - 32px)"
            >
              <v-img
                src="https://pic.90sjimg.com/design/00/14/27/32/5938d72587af9.png"
              ></v-img>
            </v-sheet>
            <v-card-text class="pt-0">
              <div
                class="title font-weight-light mb-2"
                style="position: absolute; top: 20px; right: 20px"
              >
                Breakfast
              </div>
              <span
                style="font-size: 40px; position: absolute; top: 70px; right: 20px;"
                >{{ categories.length }}</span
              >
              <div class="subheading font-weight-light grey--text">
                Breakfast
              </div>
            </v-card-text>
          </v-card>
          <br />
          <h3 style="color: #004660">Top 5 Breakfast</h3>
          <br />
          <v-card class="mx-auto">
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              height="180px"
            ></v-img>

            <v-card-title style="font-size: 15px">
              Top western road trips
            </v-card-title>

            <v-card-subtitle style="font-size: 13px">
              1,000 miles of wonder
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row> </v-row>
    </v-container>
    <v-dialog v-model="actionDialog" width="500">
      <v-card>
        <v-card-title>{{ currentCategory.categoryName }}</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Name of Cateogry"
                      v-model="currentCategory.categoryName"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-container style="margin-top: -30px">
                <v-row>
                  <v-col cols="12" lg="6">
                    <v-select
                      v-model="currentCategory.tag"
                      :items="tags"
                      label="Tag"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <span
                      style="display: inline; font-size: 12px; margin-top: -40px"
                      >Status</span
                    >
                    <v-switch
                      style="display: inline"
                      v-model="currentCategory.categoryStatus"
                      :label="
                        `${
                          currentCategory.categoryStatus == 1
                            ? 'Active'
                            : 'In-active'
                        }`
                      "
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="actionDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="onCreateCategory">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import { db } from "../../firebase";

export default {
  name: "School",
  components: {
    //
  },
  data: () => ({
    BreadCrumbs: [
      {
        text: "Categories",
        disabled: false,
        href: "/others/categories",
      },
      {
        text: "Breakfast",
        disabled: true,
        href: "/categories/bank",
      },
    ],
    tags: ["Breakfast", "Lunch", "Dinner", "Set"],
    actionDialog: false,
    search: "",
    headers: [
      {
        text: "Category Image",
        align: "start",
        sortable: false,
        value: "categoryImage",
      },
      { text: "Category Name", value: "categoryName" },
      { text: "Restaurant", value: "restaurant" },
      { text: "Tag", value: "tag" },
      { text: "Status", value: "status" },
      { text: "Cateogry Sale", value: "categorySale" },
      { text: "Category Ctr", value: "categoryCtr" },
      { text: "Action", value: "actions" },
    ],
    categories: [],
    restaurants: [],
    currentCategory: {},
  }),
  firestore: {
    categories: db.collection("categories").where("tag", "==", "Breakfast"),
  },
  methods: {
    openActionDialog(item) {
      this.currentCategory = item;
      this.actionDialog = true;
    },

    onCreateCategory() {
      db.collection("categories")
        .doc(this.currentCategory.id)
        .set({
          categoryCtr:
            this.currentCategory.categoryCtr != null
              ? this.currentCategory.categoryCtr
              : "none",
          categoryImage:
            this.currentCategory.categoryImage != null
              ? this.currentCategory.categoryImage
              : null,
          categoryName:
            this.currentCategory.categoryName != null
              ? this.currentCategory.categoryName
              : "none",
          categorySale:
            this.currentCategory.categorySale != null
              ? this.currentCategory.categorySale
              : 0,
          categoryStatus: this.currentCategory.categoryStatus === true ? 1 : 0,
          createdAt: this.currentCategory.createdAt,
          id: this.currentCategory.id != null ? this.currentCategory.id : null,
          restaurantId: this.currentCategory.restaurantId,
          tag: this.currentCategory.tag,
        })
        .then(function() {
          console.log("Update Category Succesfully Written");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });

      this.actionDialog = false;
    },
  },

  created() {
    db.collection("restaurants").onSnapshot((querySnapshot) => {
      var tempArray = [];
      var tempObj;
      querySnapshot.forEach((doc) => {
        tempObj = {
          id: doc.id,
          name: doc.data().name,
        };
        tempArray.push(tempObj);
      });
      this.restaurants = tempArray;
    });
  },
};
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
.card-header {
  padding: 20px;
  width: 110px;
  height: 110px;
  margin-left: 15px;
  z-index: 9;
}
</style>
