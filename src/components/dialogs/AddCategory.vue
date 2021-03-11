<template>
    <div>
        <v-dialog
            v-model="addRestoCategoryDialog"
            width="500"
        >
        <v-card>
            <v-card-title style="color: white;" class="headline primary">
                <v-icon style="font-size: 30px; color: white; margin-right: 10px;">mdi-silverware-fork-knife</v-icon>Add Category
                </v-card-title>
                <v-container>
                    <v-img
                        :src="imageUrl"
                        height="205"
                    >
                    </v-img>
                    <div style="margin-top: -40px;" class="text-center">
                        <v-btn class="mx-2" fab style="width: 80px; height: 80px; box-shadow: none" color="white" @click="onPickFile">
                            <v-icon style="font-size: 60px;" color="primary">mdi-camera-outline</v-icon>
                        </v-btn>
                        <p style="margin-top: 4px;">Select Category Photo</p>
                        <input 
                            type="file" 
                            accept="image/*" 
                            @change="onFilePicked" 
                            ref="fileInput" 
                            style="display: none" 
                        />
                    </div>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                label="Name of Cateogry"
                                v-model="category.name"
                            ></v-text-field>
                            <v-text-field
                                label="Tag"
                                v-model="category.tag"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
                <v-divider></v-divider>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="addRestoCategoryDialog = false"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    @click="onCreateCategory"
                >
                    Save Changes
                </v-btn>
                </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>

import * as firebase from 'firebase/app';
import { db } from '../../firebase';


export default {
  name: 'SelectedRestaurant',
  components: {
    
  },
  data: () => ({
    name: '',
    BreadCrumbs: [
        {
            text: 'Restaurant',
            disabled: false,
            href: '/dashboard',
        },
        {
            text: '',
            disabled: true,
            href: '/overview/restaurant',
        },
    ],
    category:{
        name: '',
        tag: '',
    },
    imageData: null,
    imageUrl: '',
    picture: null,
    photo: null,
    restaurants: [],
    currentRestaurants: [],
    categories: [],
    reviews: [],
    currentRestaurantName: '',
    currentMenus: [],
    restaurantID: null,
    addRestoCategoryDialog: false,
    categorySnackbar: false,
  }),   
  methods: {
      onPickFile(){
         this.$refs.fileInput.click();
      },
      onFilePicked(event){
        this.imageData = event.target.files[0]
        const files = event.target.files
        let filename = files[0].name;
        if(filename.lastIndexOf('.') <= 0){
            return alert('Please pick valid image')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result
            console.log(this.imageUrl)
        })
        fileReader.readAsDataURL(files[0])
     },
      onCreateCategory(){
          const storageRef = firebase.storage().ref(`images/${this.imageData.name}`).put(this.imageData);
            storageRef.on('state_changed', snapshot => {
                this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                }, error =>{ console.log(error.message)},
                () => {this.uploadValue=100;
                storageRef.snapshot.ref.getDownloadURL().then((url) => {
                    
                    var categoryData = {
                        categoryCtr: 0,
                        categoryName: this.category.name,
                        categorySale: 0,
                        categoryStatus: 1,
                        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                        id: null,
                        categoryImage: url,
                        restaurantId: this.$route.params.id,
                        tag: this.category.tag,
                    }

                    console.log(categoryData)

                    db.collection("categories").add(categoryData)
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    }); 

                })
            })

            this.categorySnackbar = true
            this.addRestoCategoryDialog = false
        }
  },
  mounted(){
      this.restaurantID = this.$route.params.id
      console.log(this.restaurantID)
  },
  created(){

        // QUERY FOR CATEGORIES
        db.collection("categories")
        .where("restaurantId", "==", this.$route.params.id).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                this.categories.push(doc.data());
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });


  }
}
</script>
