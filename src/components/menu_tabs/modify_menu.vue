<template>
  <div class="Assign">
    <v-card>
      <v-card-title>
        Menus
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
          <v-chip color="red" style="color: white; font-size: 12px">
            &#x20b1; {{ item.itemPrice }}
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
        <template v-slot:item.statusSlot="{ item }">
          <span v-if="item.itemStatus === 1">
            <v-chip color="#239140" style="color: white; font-size: 12px">
              Added
            </v-chip>
          </span>
          <span v-else>
            <v-chip color="#a62c11" style="color: white; font-size: 12px">
              Deleted
            </v-chip>
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
              <v-list-item @click="selectedMenu(item)">
                <v-icon size="16">mdi-clipboard-account-outline</v-icon
                ><v-list-item-title style="font-size: 11px; margin-left: 5px"
                  >Update {{ item.itemName }}</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="deleteOrAddMenu(item)">
                <v-icon size="16">mdi-clipboard-account-outline</v-icon
                ><v-list-item-title style="font-size: 11px; margin-left: 5px">{{
                  item.itemStatus === 1
                    ? `Delete ${item.itemName}`
                    : `Add ${item.itemName}`
                }}</v-list-item-title>
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
                  {{ item.Restaurant }}
                </v-col>
              </v-row>
            </v-container>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="updateMenuDialog" width="650">
      <v-card class="mx-auto">
        <v-img class="align-end" :src="currentMenu.itemImageURL" height="300">
        </v-img>
        <v-container>
          <div style="margin-top: -40px" class="text-center">
            <v-btn
              class="mx-2"
              fab
              style="width: 80px; height: 80px; box-shadow: none"
              color="white"
              @click="onPickFile"
            >
              <v-icon style="font-size: 60px" color="primary"
                >mdi-camera-outline</v-icon
              >
            </v-btn>
            <p style="margin-top: 4px; font-size: 12px">Select Menu Image</p>
            <input
              type="file"
              accept="image/*"
              @change="onFilePicked"
              ref="MenuFileInput"
              style="display: none"
            />
          </div>
          <v-row style="margin-top: -30px">
            <v-col cols="12">
              <v-text-field
                clearable
                label="Name of Menu"
                v-model="currentMenu.itemName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" style="margin-top: -45px">
              <v-row>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="currentMenu.tagId"
                    :items="tags"
                    color="blue-grey lighten-2"
                    label="Select Tag"
                    item-text="name"
                    item-value="id"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    clearable
                    prepend-inner-icon="mdi-currency-php"
                    label="Price"
                    type="number"
                    v-model="currentMenu.itemPrice"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    clearable
                    prepend-inner-icon="mdi-clock-outline"
                    label="Preperation Time"
                    type="number"
                    v-model="currentMenu.prepTime"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row
            v-for="(variation, index) in currentMenu.variations"
            :key="index"
          >
            <v-col cols="6" style="margin-top: -25px">
              <v-text-field
                clearable
                label="Variation Name"
                v-model="variations[index].name"
              ></v-text-field>
            </v-col>
            <v-col cols="5" style="margin-top: -25px">
              <v-text-field
                clearable
                prefix="₱"
                label="Varation Price"
                type="number"
                v-model="variations[index].price"
              ></v-text-field>
            </v-col>
            <v-col cols="1" style="margin-top: -25px">
              <v-btn
                fab
                dark
                small
                color="error"
                @click="removeVariation(index)"
              >
                <v-icon dark> mdi-minus </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="margin-top: -45px"> </v-col>
            <v-col cols="12" style="margin-top: -35px">
              <v-textarea
                row-height="30"
                label="Menu Description"
                v-model="currentMenu.itemDescription"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="updateMenuDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="onUpdateMenu">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

import * as firebase from "firebase/app";
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
    samples: [],
    assignDispatcherDialog: false,
    updateMenuDialog: false,
    restaurantAssignedImage: "",
    restaurantAssignedName: "",
    assignedRestaurants: [],
    search: "",
    expanded: [],
    singleExpand: false,
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
      { text: "Status", value: "statusSlot", sortable: true },
      { text: "Action", value: "actions" },
      { text: "More", value: "data-table-expand" },
    ],
    imageData: "",
    menus: [],
    restaurants: [],
    tags: [],
    categories: [],
    currentMenu: {},
    imageChange: false,
  }),
  firestore: {
    tags: db.collection("tags"),
    categories: db.collection("categories"),
    menus: db.collection("items"),
  },
  methods: {
    selectedMenu(item) {
      this.currentMenu = item;
      this.updateMenuDialog = true;
      console.log(item);
    },
    async deleteOrAddMenu(item) {
      if (item.itemStatus === 1) {
        this.$swal
          .fire({
            title: "Are you sure?",
            text:
              "This item will be remove but it doesn't mean it's deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!",
          })
          .then(async (result) => {
            if (result.value) {
              this.$swal.fire(
                "Deleted!",
                "Item " + item.itemName + " has been deleted.",
                "success"
              );
              db.collection("items").doc(item.id).update({
                itemStatus: 0,
              });
              let categoryRef = db.collection("tags").doc(item.tagId);
              await db.runTransaction(async (t) => {
                let tags = await t.get(categoryRef);
                var ctrFromTags = tags.data().tagCounter - 1;
                t.update(categoryRef, {
                  tagCounter: ctrFromTags,
                });
              });
            }
          });
      } else {
        this.$swal
          .fire({
            title: "Are you sure?",
            text: "This item will be added again",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add again!",
          })
          .then(async (result) => {
            if (result.value) {
              this.$swal.fire(
                "Added!!",
                "Item " + item.itemName + " added.",
                "success"
              );
              db.collection("items").doc(item.id).update({
                itemStatus: 1,
              });
              let tagRef = db.collection("tags").doc(item.tagId);
              await db.runTransaction(async (t) => {
                let tags = await t.get(tagRef);
                var ctrFromTags = tags.data().tagCounter + 1;
                t.update(tagRef, {
                  tagCounter: ctrFromTags,
                });
              });
            }
          });
      }
    },
    onPickFile() {
      this.$refs.MenuFileInput.click();
    },
    onFilePicked(event) {
      this.imageChange = true;
      this.imageData = event.target.files[0];
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please pick valid image");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.currentMenu.itemImageURL = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
    },
    onUpdateMenu() {
      var self = this;
      if (this.imageChange) {
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

              db.collection("items")
                .doc(this.currentMenu.id)
                .update({
                  itemDescription: this.currentMenu.itemDescription,
                  itemImageURL: url,
                  itemName: this.currentMenu.itemName,
                  itemPrice: this.currentMenu.itemPrice,
                  prepTime: this.currentMenu.prepTime,
                })
                .then(function () {
                  console.log("Document successfully written!");
                });
            });
          }
        );
      } else {
        db.collection("items")
          .doc(this.currentMenu.id)
          .update({
            itemDescription: this.currentMenu.itemDescription,
            itemName: this.currentMenu.itemName,
            itemPrice: this.currentMenu.itemPrice,
            prepTime: this.currentMenu.prepTime,
          })
          .then(function () {
            console.log("Document successfully written!");
            self.snackbar = true;
            self.snackbarText = `Item ${self.currentMenu.itemName} succesfully updated!`;
            this.currentMenu = {};
          });
        this.updateMenuDialog = false;
      }
    },
  },
  created() {},
};
</script>
