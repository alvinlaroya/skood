<template>
  <div class="restaurant">
       <!--  <v-btn large color="#ffffff" elevation="0" style="color: #004660; border-radius: 0" nudge-width="150px" height="60" @click="openAddDialog">
            Create New Restaurant
        </v-btn> -->
    <RestaurantToolBar/>
    <v-breadcrumbs :items="BreadCrumbs"></v-breadcrumbs>
    <v-container fluid>
        <v-row>
          <!--   <RestaurantLoader/> -->
            <v-col  
                cols="12"
                 lg="4" 
                 xl="3"
                 md="6"
                 sm="6"
                 v-for="(restaurant, index) in restaurants.slice().reverse()" :key="index"
            >
                <v-card
                    class="mx-auto"
                    style="box-shadow: none"
                    @click="explore(restaurant, restaurant.id)"
                >
                   <span v-if="restaurant.restaurantImage">
                        <v-img
                            class="white--text align-end"
                            height="250px"
                            lazy-src="https://thumbs.gfycat.com/UnderstatedFrayedAlabamamapturtle-size_restricted.gif"
                            :src="restaurant.restaurantImage"
                        >
                            <div style="background-color: rgba(0, 0, 0, 0.6); width: 100%; height: 60px;">
                                <v-card-title style="font-size: 15px;">{{ restaurant.name }}</v-card-title>
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
                                <v-card-title>{{ restaurant.name }}</v-card-title>
                            </div>
                        </v-img>
                    </span>
                    <v-card-text class="text--primary">
                        <div class="text-left" style="margin-left: 10px">
                            <v-rating v-model="restaurant.restaurantRating" dense color="warning" full-icon="mdi-heart" background-color="dimgray" empty-icon="mdi-heart-outline"></v-rating>
                        </div>
                        <!-- <v-chip
                            class="ma-2"
                            color="red"
                            text-color="white"
                            style="position: absolute; top: 255px; right: 5px"
                            >
                            &#x20b1; {{ menu.price }}
                        </v-chip> -->
                        <div v-if="restaurant.description.length>=140">
                            <v-card-text style="font-size: 12px;" v-html="restaurant.description.substring(0,140)+'..'">
                            </v-card-text>
                        </div>
                        <div v-else>
                            <v-card-text style="font-size: 12px;" v-html="restaurant.description">
                            </v-card-text>
                        </div>
                        <div style="padding: 15px; margin-bottom: -30px">
                            <v-icon style="font-size: 16px; margin-right: 10px">mdi-phone-outline</v-icon>
                            <span style="font-size: 12px;">
                                {{ restaurant.contactNo }}
                            </span><br>
                            <v-icon style="font-size: 16px; margin-right: 10px">mdi-map-marker</v-icon>
                            <span style="font-size: 12px;">
                                {{ restaurant.location }}
                            </span>
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
    
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import { db } from '../../firebase';

import RestaurantToolBar from '../../components/RestaurantToolBar';
/* import fb from '../../firebase' */

/* import RestaurantLoader from '../../components/skeleton_loader/RestaurantLoader' */

export default {
  name: 'restaurant',
  components: {
    /* RestaurantLoader */
    RestaurantToolBar,
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
    restaurants: [],
    restoCount: null,
  }),
  methods: {
        explore(restaurant, id){
            this.$router.push({
                name: 'SelectedRestaurant',
                params: {
                    id: id,
                },
            });
        },
  },
   firestore: {
    restaurants: db.collection('restaurants').orderBy('createdAt'),
  },
}
</script>
