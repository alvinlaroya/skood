<template>
  <div>
    <v-toolbar dark color="teal">
      <v-icon>mdi-home-search-outline</v-icon>
      <v-autocomplete
        v-model="select"
        :search-input.sync="search"
        :items="items"
        :loading="loading"
        cache-items
        class="mx-4"
        flat
        hide-no-data
        hide-details
        label="What kind of tag are you looking for?"
        solo-inverted
        @change="searchedTags()"
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
        color="#ffffff"
        elevation="0"
        style="font-size: 12px; color: #ffffff; border-radius: 0; background-color: transparent"
        nudge-width="150px"
        height="60"
        @click="showAddTagDialog"
      >
        <v-icon>mdi-plus-circle-outline</v-icon
        ><span style="margin-left: 5px">New Tag</span>
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="addTagDialog" width="500">
      <v-card class="mt-6 mx-auto" style="padding: 20px">
        <v-flex>
          <v-form>
            <v-img :src="tag.imageUrl" height="300"> </v-img>
            <v-container class="text-center">
              <div style="margin-top: -40px;" class="text-center">
                <v-btn
                  class="mx-2"
                  fab
                  style="width: 80px; height: 80px; box-shadow: none"
                  color="white"
                  @click="onMenuPickFile"
                >
                  <v-icon style="font-size: 60px;" color="primary"
                    >mdi-camera-outline</v-icon
                  >
                </v-btn>
                <p style="margin-top: 4px;">Select Tag Clipart</p>
                <input
                  type="file"
                  accept="image/*"
                  @change="onMenuFilePicked"
                  ref="MenuFileInput"
                  style="display: none"
                />
              </div>
            </v-container>
            <v-text-field
              outlined
              v-model="tag.tagname"
              label="Enter Tag Name"
              prepend-inner-icon="mdi-account"
            ></v-text-field>
            <v-btn
              large
              color="#004660"
              style="color: white"
              block
              @click="onCreateTag"
            >
              Save Tag
            </v-btn>
          </v-form>
        </v-flex>
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
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import { db } from "../firebase";
import 'firebase/storage';

export default {
  name: "TagToolbar",
  data: () => ({
    addTagDialog: false,
    search: '',
    select: null,
    imageData: null,
    picture: null,
    photo: null,
    tag: {
      tagname: "",
      imageUrl: "https://semantic-ui.com/images/wireframe/image.png"
    },
    items: [],
    tags: [],
    snackbar: false,
    snackbarText: '',
    loading: false,
  }),
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    showCateg() {
      console.log("SHOW");
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.tags.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    onMenuFilePicked(event) {
      this.imageData = event.target.files[0];
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please pick valid image");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.tag.imageUrl = fileReader.result;
        console.log(this.tag.imageUrl);
      });
      fileReader.readAsDataURL(files[0]);
    },
    searchedTags() {
      db.collection("tags")
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
    onMenuPickFile() {
      this.$refs.MenuFileInput.click();
    },
    showAddTagDialog() {
      this.addTagDialog = true;
    },

    onCreateTag() {
      var self = this
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
            var tagData = {
              name: self.tag.tagname,
              tagStatus: 1,
              tagCounter: 0,
              isDisplayed: false,
              createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
              image: url,
            };

            console.log(tagData);
            db.collection("tags")
              .add(tagData)
              .then(function() {
                console.log("Document successfully written!");
                self.tag = {
                  imageUrl: "https://semantic-ui.com/images/wireframe/image.png",
                  tagname: ""
                }
                
              })
              .catch(function(error) {
                console.error("Error writing document: ", error);
              });
          });
        }
      );

      this.$swal.fire(
        "Saved!",
        "Tag " + this.tag.tagname + " has been added.",
        "success"
      );
      this.addTagDialog = false;
      this.snackbar = true;
      this.snackbarText = "Tag " + this.tag.tagname + " has been added."
    },
  },
  created(){
    db.collection("tags").onSnapshot((querySnapshot) => {
      var arrayTags = [];
      querySnapshot.forEach((doc) => {
        arrayTags.push(doc.data().name);
      });
      this.tags = arrayTags;
    });
  }
};
</script>

<style></style>
