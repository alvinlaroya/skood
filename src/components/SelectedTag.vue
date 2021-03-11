<template>
  <div class="restaurant">
       <!--  <v-btn large color="#ffffff" elevation="0" style="color: #004660; border-radius: 0" nudge-width="150px" height="60" @click="openAddDialog">
            Create New Restaurant
        </v-btn> -->
    <v-breadcrumbs :items="BreadCrumbs"></v-breadcrumbs>
    <v-container>
        <v-row>
            <v-col cols="12" xl="8" lg="8">
                <v-container>
                    <h4>{{ topMenus.length }} {{ tagName }} Menus</h4>
                    <v-row>
                    <!--   <RestaurantLoader/> -->
                        <v-col  
                            cols="12"
                            lg="6" 
                            xl="4"
                            md="6"
                            sm="6"
                            v-for="(menu, index) in menus.slice().reverse()" :key="index"
                        >
                            <v-card
                                class="mx-auto"
                                style="box-shadow: none"
                                @click="explore(menu, menu.id)"
                            >
                            <span v-if="menu.itemImageURL">
                                    <v-img
                                        class="white--text align-end"
                                        height="250px"
                                        :src="menu.itemImageURL"
                                    >
                                        <div style="background-color: rgba(0, 0, 0, 0.6); width: 100%; height: 60px;">
                                            <v-card-title style="font-size: 15px;">{{ menu.itemName }}</v-card-title>
                                        </div>
                                    </v-img>
                            </span>
                                <span v-else>
                                    <v-img
                                        class="white--text align-end"
                                        height="250px"
                                        src="https://semantic-ui.com/images/wireframe/image.png"
                                    >
                                        <div style="background-color: rgba(0, 0, 0, 0.6); width: 100%; height: 60px;">
                                            <v-card-title>{{ menu.itemName }}</v-card-title>
                                        </div>
                                    </v-img>
                                </span>
                                <v-card-text class="text--primary">
                                    <div class="text-left" style="margin-left: 10px">
                                        <v-chip
                                            class="ma-2"
                                            color="red"
                                            text-color="white"
                                            style="position: absolute; top: 255px; right: 5px"
                                            >
                                            &#x20b1; {{ menu.itemPrice }}
                                        </v-chip>
                                        <v-rating v-model="menu.ranking" dense color="warning" full-icon="mdi-heart" readonly background-color="dimgray" empty-icon="mdi-heart-outline"></v-rating>
                                    </div>
                                    <!-- <v-chip
                                        class="ma-2"
                                        color="red"
                                        text-color="white"
                                        style="position: absolute; top: 255px; right: 5px"
                                        >
                                        &#x20b1; {{ menu.price }}
                                    </v-chip> -->
                                    <div v-if="menu.itemDescription.length>=140">
                                        <v-card-text style="font-size: 12px;" v-html="menu.itemDescription.substring(0,140)+'..'">
                                        </v-card-text>
                                    </div>
                                    <div v-else>
                                        <v-card-text style="font-size: 12px;" v-html="menu.itemDescription">
                                        </v-card-text>
                                    </div>

                                    <!-- <div>Revenue: <span style="font-weight: bold; color: black">&#x20b1; {{ menu.revenue }}</span></div> -->
                                </v-card-text>

                                <v-card-actions class="text-right" style="padding: 30px;">
                                    <v-btn
                                        small
                                        color="orange"
                                        text
                                        style="margin-bottom: -20px"
                                    >
                                        Share
                                    </v-btn>

                                    <v-btn
                                        small
                                        color="orange"
                                        text
                                        style="margin-bottom: -20px"
                                        @click="explore(restaurant, restaurant.id)"
                                    >
                                        Explore
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
            <v-col cols="12" xl="4" lg="4">
                <v-container>
                    <h4>Top {{ tagName }} Menus</h4>
                    <v-row>
                    <!--   <RestaurantLoader/> -->
                        <v-col  
                            cols="12"
                            lg="6" 
                            xl="4" 
                            md="6"
                            sm="6"
                            v-for="(menu, index) in topMenus.slice().reverse()" :key="index"
                        >
                            <v-card
                                class="mx-auto"
                            >
                            <span v-if="menu.itemImageURL">
                                    <v-img
                                        class="white--text align-end"
                                        height="110px"
                                        :src="menu.itemImageURL"
                                    >
                                        <div style="background-color: rgba(0, 0, 0, 0.6); width: 100%; height: 25px;">
                                            <span style="font-size: 10px; margin-left: 10px">{{ menu.itemName }}</span>
                                        </div>
                                    </v-img>
                            </span>
                                <span v-else>
                                    <v-img
                                        class="white--text align-end"
                                        height="250px"
                                        src="https://semantic-ui.com/images/wireframe/image.png"
                                    >
                                        <div style="background-color: rgba(0, 0, 0, 0.6); width: 100%; height: 60px;">
                                            <v-card-title>{{ menu.itemName }}</v-card-title>
                                        </div>
                                    </v-img>
                                </span>
                                <v-card-text class="text--primary">
                                    <div class="text-left">
                                        <v-chip
                                            class="ma-2"
                                            color="red"
                                            x-small
                                            text-color="white"
                                            style="position: absolute; top: 121px; right: 1px"
                                            >
                                            &#x20b1; {{ menu.itemPrice }}
                                        </v-chip>
                                        <v-rating v-model="menu.ranking" dense color="warning" size="12" readonly style="margin-left: -10px" full-icon="mdi-heart" background-color="dimgray" empty-icon="mdi-heart-outline"></v-rating>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
    
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import { db } from '../firebase';


/* import fb from '../../firebase' */

/* import RestaurantLoader from '../../components/skeleton_loader/RestaurantLoader' */

export default {
  name: 'restaurant',
  components: {
    /* RestaurantLoader */
  },
  data: () => ({
    countDown: 10,
    imageData: null,
    picture: null,
    photo: null,
    BreadCrumbs: [
        {
            text: 'Others',
            disabled: false,
            href: '/dashboard',
        },
        {
            text: 'Restaurant',
            disabled: true,
            href: '/overview/restaurant',
        },
    ],
    menus: [],
    topMenus: [],
    restoCount: null,
    tagName: '',
  }),
  created(){
      var docRef = db.collection("tags").doc(this.$route.params.id);
      const self = this

        docRef.get().then(function(doc) {
            if (doc.exists) {
                self.tagName = doc.data().name
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

      db.collection("items").where("tagId", "==", this.$route.params.id).limit(15)
        .onSnapshot((querySnapshot)=>  {
            var arrayReviews = []
            querySnapshot.forEach((doc) => {
                arrayReviews.push(doc.data());
            });
            this.menus= arrayReviews
        });


     db.collection("items").where("tagId", "==", this.$route.params.id).limit(9)
        .onSnapshot((querySnapshot)=>  {
            var arrayReviews = []
            querySnapshot.forEach((doc) => {
                arrayReviews.push(doc.data());
            });
            this.topMenus= arrayReviews
        });
  }
}
</script>
