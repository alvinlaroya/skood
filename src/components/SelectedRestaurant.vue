<template>
  <div class="restaurant">
    <div v-if="!showContent">
        <SelectedRestaurantLoader/>
    </div>
    
    <div v-else>
        <v-parallax :src="currentRestaurants.restaurantImage" height="400"></v-parallax>
        <v-container>
            <v-row>
                <v-breadcrumbs :items="BreadCrumbs" style="position: absolute; top: 400px; right: 10px;"></v-breadcrumbs>
                <v-col  
                    cols="12"
                    lg="12" 
                >
                    <v-card-title style="font-size: 40px; margin-top: 9px; color: #004660">{{ currentRestaurants.name }} </v-card-title>
                    
                    <v-card-title style="margin-top: -20px; font-size: 16px">
                        <v-icon style="font-size: 22px; margin-right: 10px">mdi-map-marker</v-icon>&emsp;{{ currentRestaurants.location }}
                    </v-card-title>
                    <v-card-title style="margin-top: -30px; font-size: 16px">
                        <v-icon style="font-size: 22px; margin-right: 10px">mdi-phone</v-icon>&emsp;{{ currentRestaurants.contactNo }}
                    </v-card-title>
                    <v-card-title style="margin-top: -30px; font-size: 16px">
                        <v-icon style="font-size: 22px; margin-right: 10px">mdi-web</v-icon>&emsp;<a :href="currentRestaurants.website" target="_blank">{{ currentRestaurants.website }}</a>
                    </v-card-title>
                    <v-card-title style="margin-top: -30px; font-size: 16px">
                        <v-icon style="font-size: 22px; margin-right: 10px">mdi-silverware-fork-knife</v-icon>&emsp;{{ currentRestaurants.cuisine }}
                    </v-card-title> 
                    <v-card-title style="margin-top: -30px; font-size: 16px">
                        <v-icon style="font-size: 22px; margin-right: 10px">mdi-clock-outline</v-icon>&emsp;{{ `${currentRestaurants.openingTime} - ${currentRestaurants.closingTime}` }}
                    </v-card-title> 
                    <v-card-title style="margin-top: -40px">
                        <v-switch
                            large
                            v-model="currentRestaurants.isDisplayed"
                            @change="fuse"
                        ></v-switch>
                        <v-chip color="#004660" style="color: white" v-if="currentRestaurants.isDisplayed === true">Displayed</v-chip>
                        <v-chip v-else>Not Displayed</v-chip>
                    </v-card-title>
                    <v-card-title style="margin-top: -40px">
                        <v-switch
                            large
                            v-model="currentRestaurants.isForceClosed"
                            @change="force"
                        ></v-switch>
                        <v-chip color="#004660" style="color: white" v-if="currentRestaurants.isForceClosed === true">Force Closed</v-chip>
                        <v-chip v-else>Not Closed</v-chip>
                    </v-card-title>
                </v-col>
                
            </v-row>
            <v-row>
                <v-col cols="12" lg="9" xl="10">
                    <v-card-title style="font-size: 14px;">{{ currentRestaurants.description }}</v-card-title>
                </v-col>
                <v-col cols="12" lg="3" xl="2">
                    <v-btn 
                        style="width: 100%; max-width: 200px; font-size: 12px; color: white" 
                        class="ma-2" 
                        rounded large color="teal"
                        @click="addRestoMenuDialog = true"
                    >
                        <v-icon left>mdi-food</v-icon>Add Menus
                    </v-btn>
                    <v-btn style="width: 100%; max-width: 200px; color: white; font-size: 12px" class="ma-2"
                        rounded 
                        large 
                        color="#004660"
                        @click="addRestoCategoryDialog = true"
                    >
                        <v-icon left>mdi-pencil</v-icon> Add Categories
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-row>
                <v-col cols="12" lg="8">
                    <v-container>
                        <h5 style="color: #004660">Menus</h5>
                        <v-row>
                            <v-col cols="12" lg="6" xl="4" md="6" sm="6"
                                v-for="(menu, m) in currentMenus.slice().reverse()" :key="m"
                            >
                            <v-card
                                class="mx-auto"
                                style="box-shadow: none"
                            >
                            <!--  <p>{{ restaurant.website }}</p> -->
                                <v-img
                                    class="white--text align-end"
                                    height="250px"
                                    lazy-src="https://thumbs.gfycat.com/UnderstatedFrayedAlabamamapturtle-size_restricted.gif"
                                    :src="menu.itemImageURL != null ? menu.itemImageURL :  menuImageLoading"
                                >
                                    <div style="background-color: rgba(0, 0, 0, 0.6); width: 100%; height: 60px;">
                                        <v-card-title>{{ menu.itemName }}</v-card-title>
                                    </div>
                                </v-img>
                                <v-card-text class="text--primary">
                                    <div>
                                        <v-chip
                                            class="ma-2"
                                            color="red"
                                            text-color="white"
                                            style="position: absolute; top: 255px; right: 5px"
                                            >
                                            &#x20b1; {{ menu.itemPrice }}
                                        </v-chip>
                                        <v-rating v-model="menu.ranking" dense color="warning" full-icon="mdi-heart" background-color="dimgray" empty-icon="mdi-heart-outline" style="margin-top: -5px;"></v-rating>
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
                                    <div style="padding: 15px; margin-bottom: -30px">
                                        <div v-for="(count, c) in categories" :key="c">
                                            <span style="font-size: 12px;"
                                                v-if="count.id == menu.categoryId"
                                            >
                                                <span style="font-weight: bold">Category:</span> {{ count.categoryName }}
                                            </span>
                                        </div>
                                    </div>
                                    <div style="padding: 15px; margin-bottom: -30px">
                                        <div v-for="tag in tags" :key="tag.id">
                                            <span style="font-size: 12px;"
                                                v-if="tag.id == menu.tagId"
                                            >
                                                <span style="font-weight: bold">Tag:</span> {{ tag.name }}
                                            </span>
                                        </div>
                                    </div>
                                    <div style="padding: 15px; margin-bottom: -30px">
                                        <div>
                                            <span style="font-size: 12px; font-weight: bold">
                                                Variations:
                                            </span>
                                        </div>
                                    </div>
                                    <v-row style="padding: 5px; padding-left: 25px; margin-bottom: -30px" v-for="(variation, index) in menu.variations" :key="index">
                                        <v-col cols="6">
                                            <span style="font-size: 12px;">
                                                {{variation.name}}
                                            </span>
                                        </v-col>
                                        <v-col cols="6" class="text-right">
                                            <v-chip
                                                small
                                                color="red"
                                                text-color="white"
                                            >
                                                &#x20b1; {{variation.price}}
                                            </v-chip>
                                        </v-col>
                                    </v-row>  

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
                        <div class="text-center">
                            <v-btn class="ma-2" style="width: 250px" rounded large color="info">
                                <v-icon left>mdi-arrow-expand-all</v-icon>Show All Menus
                            </v-btn>
                        </div>
                    </v-container>
                </v-col>
                <v-col cols="12" lg="4">
                    <v-container>
                        <h5 style="color: #004660">Categories ({{ categories.length }})</h5>
                        <v-row>
                            <v-col cols="12">
                                <v-card style="height: auto; max-height: 400px; overflow: auto">
                                    <v-container>
                                            <v-row>
                                                <v-col cols="12" v-for="(category, c) in categories" :key="c">
                                                    <v-card style="margin-top: -10px;">
                                                        <v-icon
                                                            medium
                                                            style="position: absolute; top: 17px; right: 10px;"
                                                            @click="selectedCategory(category)"
                                                        >
                                                           mdi-dots-vertical
                                                        </v-icon>
                                                        <v-img src="@/assets/img/foodcover.png" height="40" width="40" style="position: absolute; top: 50px; right: 10px; border-radius: 10px"></v-img>
                                                        <v-card-title style="font-size: 12px">Category Name: {{ category.categoryName }}</v-card-title>
                                                        <v-card-subtitle style="font-size: 12px"><span style="font-weight: bold">Ordered: </span>{{ category.categoryCtr }}</v-card-subtitle>
                                                        <v-card-subtitle style="font-size: 12px; margin-top: -37px"><span style="font-weight: bold">Sales: </span>&#x20b1; {{ category.categorySales }}</v-card-subtitle>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container>
                        <h5 style="color: #004660">Reviews ({{ reviews.length }})</h5>
                        <v-row>
                            <v-col cols="12">
                                <v-card>
                                    <v-container>
                                            <v-row v-if="reviewsIsEmpty" class="text-center">
                                                <v-card-text style="font-size: 15px; margin-bottom: -70px margin-top: -10px;">No review yet</v-card-text>
                                            </v-row>
                                            <v-row v-else>
                                                <v-col cols="12" v-for="(review, r) in reviews" :key="r">
                                                    <div style="padding: 20px; margin-bottom: -40px; margin-top: -20px">
                                                        <img src="https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png" style="width: 40px" alt="">
                                                        <span v-for="(user, u) in users" :key="u">
                                                            <v-card-title style="font-size: 13px; margin-top: -70px; margin-left: 33px" v-if="user.id == review.userId">{{ user.firstName }} {{ user.lastName }}</v-card-title>
                                                        </span>
                                                        <div style="font-size: 13px; margin-top: -25px; margin-left: 49px">
                                                            <v-rating color="warning" full-icon="mdi-heart" background-color="dimgray" empty-icon="mdi-heart-outline" dense v-model="review.rating" readonly size="12"></v-rating>
                                                        </div>
                                                        <div>
                                                             <v-card-text style="font-size: 10px; margin-top: -20px; margin-left: 33px; margin-bottom: -30px">
                                                                 {{ review.createdAt.toDate() | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
                                                            </v-card-text>
                                                        </div>
                                                        <v-card-text style="font-size: 13px; font-weight: 350; line-height: 16px">{{ review.review }}</v-card-text>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                        <div style="height: 20px"></div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>  
                </v-col>
            </v-row>
        </v-container>
    </div>
    <v-dialog
      v-model="addRestoMenuDialog"
      width="770"
    >
      <v-card class="mx-auto">
          <v-img
                class="align-end"
                :src="menuImageUrl"
                height="300"
            >
            </v-img>
        <v-container>
            <div style="margin-top: -40px;" class="text-center">
                <v-btn class="mx-2" fab style="width: 80px; height: 80px; box-shadow: none" color="white" @click="onMenuPickFile">
                    <v-icon style="font-size: 60px;" color="primary">mdi-camera-outline</v-icon>
                </v-btn>
                <p style="margin-top: 4px; font-size: 12px">Select Menu Image</p>
                <input 
                    type="file" 
                    accept="image/*" 
                    @change="onMenuFilePicked" 
                    ref="MenuFileInput" 
                    style="display: none" 
                />
            </div>
            <v-form
                ref="form"
                lazy-validation
                v-model="valid"
            >
                <v-row style="margin-top: -30px">
                    <v-col cols="12">
                        <v-text-field
                            clearable
                            label="Name of Menu"
                            v-model="menu.name"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" style="margin-top: -45px">
                        <v-row>
                            <v-col cols="4">
                                <v-autocomplete
                                    v-model="menu.tagId"
                                    :items="tags"
                                    color="blue-grey lighten-2"
                                    label="Select Tag"
                                    item-text="name"
                                    item-value="id"
                                    :rules="[rules.required]"
                                >
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    clearable
                                    label="Preperation Time"
                                    type="number"
                                    v-model="menu.prepTime"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    clearable
                                    prefix="₱"
                                    label="Regular Price"
                                    type="number"
                                    v-model="menu.price"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="8" style="margin-top: -35px">
                        <v-autocomplete
                            id="category"
                            v-model="menu.id"
                            :items="categoryNameAutocomplete"
                            :rules="[rules.required]"
                            label="Select Category"
                            style="margin-top: 4px;"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="4" style="margin-top: -35px">
                        <v-btn
                            block
                            style="margin-bottom: -15px"
                            :color="hasVariations ? 'warning' : 'primary'"
                            @click="[hasVariations = !hasVariations, addRow = true, hasVariations ? [variations = [], variation={name: '', price: 0}] : '']"
                            large
                        >
                            {{hasVariations ? "Remove Variations" : "Add Variations"}}
                        </v-btn>
                    </v-col>
                </v-row>
                <template v-if="hasVariations">
                    <v-row v-for="(variation, index) in variations" :key="index">
                        <v-col cols="8" style="margin-top: -25px">
                            <v-text-field
                                clearable
                                label="Variation Name"
                                v-model="variations[index].name"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="2" style="margin-top: -25px">
                            <v-text-field
                                clearable
                                prefix="₱"
                                :label="`Original Price: ${(variations[index].price/1.16).toFixed()}`"
                                type="number"
                                v-model="variations[index].price"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="2" style="margin-top: -25px">
                            <v-btn
                                fab
                                dark
                                x-small
                                color="error"
                                style="margin-bottom: -30px"
                                @click="removeVariation(index)"
                                >
                                <v-icon dark>
                                    mdi-minus
                                </v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                dark
                                x-small
                                color="info"
                                style="margin-left: 20px; margin-bottom: -30px"
                                @click="addRow = true"
                                >
                                <v-icon dark>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
                <template v-if="hasVariations && addRow">
                    <v-row>
                        <v-col cols="8" style="margin-top: -25px">
                            <v-text-field
                                clearable
                                label="Variation Name"
                                v-model="variation.name"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="2" style="margin-top: -25px">
                            <v-text-field
                                clearable
                                prefix="₱"
                                label="Variation Price"
                                type="number"
                                v-model="variation.price"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="2" style="margin-top: -25px">
                             <v-btn
                                fab
                                dark
                                x-small
                                color="success"
                                style="margin-bottom: -30px"
                                @click="checkVariation(variation.name, variation.price)"
                                >
                                <v-icon dark>
                                    mdi-check
                                </v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                dark
                                x-small
                                color="info"
                                style="margin-left: 20px; margin-bottom: -30px"
                                @click="pushVariation(variation.name, variation.price)"
                                >
                                <v-icon dark>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
             <!--    <v-row v-if="variationValues.length > 0" style="margin-top: -35px">
                    <v-col :cols="12/variationValues.length" v-for="(variation, index) in variationValues" :key="index">
                        <v-text-field
                            clearable
                            prefix="₱"
                            :label="variations[index] + priceLabel"
                            type="number"
                            v-model="variationPrices[variations[index]].value"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row> -->
                <v-row>
                    <v-col cols="12" style="margin-top: -35px">
                        <v-textarea
                            row-height="30"
                            label="Menu Description"
                            v-model="menu.description"
                            :rules="[rules.required, rules.counter]"
                            maxlength="201"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="addRestoMenuDialog = false"
            >
                Cancel
            </v-btn>
            <v-btn
                color="primary"
                text
                @click="onCreateMenu"
            >
                Save Changes
            </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>


    <v-dialog
      v-model="addRestoCategoryDialog"
      width="500"
    >
      <v-card>
        <v-card-title style="color: white;" class="headline primary">
            <v-icon style="font-size: 30px; color: white; margin-right: 10px;">mdi-silverware-fork-knife</v-icon>Add Category
            </v-card-title>
            <v-container>
                <v-form
                    ref="categoryForm"
                    lazy-validation
                    v-model="valid"
                >
                    <v-row style="padding: 10px;">
                        <v-col cols="12">
                            <v-text-field
                                label="Name of Cateogry"
                                v-model="category.name"
                                :rules="[rules.required]"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
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

    <v-dialog
      v-model="editRestoCategoryDialog"
      width="500"
    >
      <v-card>
        <v-card-title style="color: white;" class="headline primary">
            <v-icon style="font-size: 30px; color: white; margin-right: 10px;">mdi-silverware-fork-knife</v-icon>Update Category {{currentCategory.categoryName}}
            </v-card-title>
            <v-container>
                <v-row style="padding: 10px;">
                    <v-col cols="12">
                        <v-text-field
                            label="Name of Cateogry"
                            v-model="currentCategory.categoryName"
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
                    @click="editRestoCategoryDialog = false"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    @click="onUpdateCategory"
                >
                    Save Changes
                </v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="isSwitching"
      persistent
      max-width="360"
    >   
      <v-card class="text-center" style="background-color: black">
        <v-card-text style="font-size: 15px; padding-top: 20px; color: black; font-weight: bold; color: white">
            <v-icon color="black" size="15">mdi-electric-switch</v-icon> Switching {{currentRestaurants.name}} information...
        </v-card-text>
        <v-progress-linear indeterminate value="15"></v-progress-linear>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="categorySnackbar"
      color="success"
      left
      multi-line
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="categorySnackbar = false"
        >
          <v-icon>
              mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="categoryUpdateSnackbar"
      color="success"
      left
      multi-line
    >
      {{ snackbar.updateText }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="categoryUpdateSnackbar = false"
        >
          <v-icon>
              mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>



<script>
// @ is an alias to /src
/* import { GeoPoint } from '../../firebase' */
/* import { fb } from '../firebase'; */
import * as firebase from 'firebase/app';
import { db } from '../firebase'

import SelectedRestaurantLoader from '../components/skeleton_loader/SelectedRestaurantLoader'

export default {
  name: 'SelectedRestaurant',
  components: {
    SelectedRestaurantLoader
  },
  data: () => ({
    rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 100 || 'Max 200 characters',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
        },
    },
    categoryModel: null,
    valid: null,
    name: '',
    showContent: null,
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
    count: null,
    menu: {
        name: '',
        id: null,
        category: null,
        tagId: null,
        price: 0,
        description: '',
        prepTime: '',
    },
    hasVariations: false,
    addRow: true,
    variations: [],
    variation: {
        name: '', 
        price: 0,
        ctr: 0,
        isAvailable: true,
        sales: 0,
    },
    priceLabel: 'Price',
    value: null,
    tags: [],
    users: [],
    category:{
        name: '',
    },
    categoryIdAutocomplete: [],
    categoryNameAutocomplete: [],

    currentCategory: {},

    menuImageData: null,
    menuImageUrl: 'https://semantic-ui.com/images/wireframe/image.png',
    menuImageLoading: 'https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif',
    restaurants: [],
    currentRestaurants: [],
    categories: [],
    reviews: [],
    currentRestaurantName: '',
    currentMenus: [],
    restaurantID: null,

    addRestoMenuDialog: false,  
    categorySnackbar: false,

    addRestoCategoryDialog: false,
    editRestoCategoryDialog: false,
    categoryUpdateSnackbar: false,

    restoID: null,
    rara: [],
    reviewsIsEmpty: false,
    fuseItems: [],
    fuseCategories: [],
    snackbar: {
        text: '',
        updateText: '',
    },
    isSwitching: false,
  }),   
  firestore: {
    restaurants: db.collection('restaurants').where("displayStatus", "==", 0).orderBy('createdAt'),
    tags: db.collection("tags").where("tagStatus", "==", 1),
    users: db.collection("customers"),
  },
  methods: {
      explore(restaurant, index){
          console.log(restaurant)
          this.$router.push('/components/selectedRestaurant/'+index);
          console.log(index)
      },
      checkVariation(name, price) {
          console.log(name);
          console.log(price);
          this.variations.push({
            name: name,
            price: this.currentRestaurants.specialCase === true ? parseInt(price) + parseInt(price * 0.16) : parseInt(price),
            ctr: 0,
            isAvailable: true,
            sales: 0,
        })
        this.variation = {
            name: '',
            price: 0,
            ctr: 0,
            isAvailable: true,
            sales: 0,
        }
        this.addRow = false;
      },
      pushVariation(name, price) {
          console.log(name);
          console.log(price);
          this.variations.push({
            name: name,
            price: this.currentRestaurants.specialCase === true ? parseInt(price) + parseInt(price * 0.16) : parseInt(price),
            ctr: 0,
            isAvailable: true,
            sales: 0,
        })
        this.variation = {
            name: '',
            price: 0,
            ctr: 0,
            isAvailable: true,
            sales: 0,
        }
      },
      removeVariation(index){
         this.variations.splice(index, 1)
      },
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
     selectedCategory(category) {
         this.editRestoCategoryDialog = true
         this.currentCategory = category
     },
     onUpdateCategory(){
        db.collection("categories").doc(this.currentCategory.id).update({
            categoryName: this.currentCategory.categoryName
        })
        this.editRestoCategoryDialog = false
        this.categoryUpdateSnackbar = true
        this.snackbar.updateText = `Category ${this.currentCategory.categoryName} Update Successfully!`
    },
    onCreateCategory(){
       /*  var self = this */
        if(this.category.name !== '') {
            var categoryData = {
                categoryCtr: 0,
                categoryName: this.category.name,
                categorySales: 0,
                categoryStatus: 1,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                restaurantId: this.$route.params.id,
            }

            console.log(categoryData)

            db.collection("categories").add(categoryData)
            .then(function() {
                console.log("Document successfully written!");
                /* self.category.name = ""; */
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            }); 
            this.$refs.categoryForm.reset()
            this.categorySnackbar = true
            this.snackbar.text = `Category ${this.category.name} save successfully!`
            this.addRestoCategoryDialog = false
        } else {
             this.$refs.categoryForm.validate()
        }
        
    },
    categoryOnSelected(name){
        /* console.log(name[0].text) */
        var index =  document.getElementById("category").selectedIndex;
        console.log(index)
        console.log(name)

        
        /* this.menu.category = name
        console.log(name) */

    },
    onMenuPickFile(){
        this.$refs.MenuFileInput.click();
    },
    onMenuFilePicked(event){
        this.menuImageData = event.target.files[0]
        const files = event.target.files
        let filename = files[0].name;
        if(filename.lastIndexOf('.') <= 0){
            return alert('Please pick valid image')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
            this.menuImageUrl = fileReader.result
            console.log(this.menuImageUrl)
        })
        fileReader.readAsDataURL(files[0])
    },
    reverseInPlace(str) {
        var words = [];
        words = str.match(/\S+/g);
        var result = "";
        for (var i = 0; i < words.length; i++) {
            result += words[i].split('').join('') + " ";
        }
        return result
    },
    onCreateMenu(){
        var response = [];
        var str = this.menu.name;
        response = str.split(" ");
        var self = this
        if(this.menu.id !== null && this.menu.tagId !== null && this.menu.price !== 0 && this.menu.description !== '') {
            var date =  Math.round((new Date()).getTime() / 1000);
            var restoDocRef = db.collection("restaurants").doc(this.$route.params.id);
            const storageRef = firebase.storage().ref(`images/${this.menuImageData.name}`+date).put(this.menuImageData);
            storageRef.on('state_changed', snapshot => {
                this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                }, error =>{ console.log(error.message)},
                () => {this.uploadValue=100;
                storageRef.snapshot.ref.getDownloadURL().then(async (url) => {
                    
                    var menuData = {
                        categoryId: this.menu.id,
                        tagId: this.menu.tagId,
                        createdAt:firebase.firestore.Timestamp.fromDate(new Date()),
                        isFeatured: true,
                        itemCtr: 0,
                        itemDescription: this.menu.description,
                        itemImageURL: url,
                        itemName: this.menu.name,
                        itemSales: 0,
                        itemStatus: 1,
                        isDisplayed: false,
                        prepTime: Number(this.menu.prepTime),
                        ranking: 0,
                        restaurantId: this.$route.params.id,
                        variations: this.variations
                    }

                    console.log(menuData)

                    response.map((word) => {
                        restoDocRef.update({
                            searchQueries: firebase.firestore.FieldValue.arrayUnion(word)
                        });
                    })

                    db.collection("items").add(menuData)
                    .then(function() {
                        console.log("Document successfully written!");

                        self.menuImageUrl = "https://semantic-ui.com/images/wireframe/image.png";
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    }); 

                    
                    // Transaction function for increementing the tagCounter in tags collection every adding menu or item
                    let tagsRef = db.collection("tags").doc(this.menu.tagId);
                    await db.runTransaction(async (t) => {
                        let tags = await t.get(tagsRef)

                        var tempCounter = tags.data().tagCounter
                        var finalTagCounter = tempCounter + 1

                        t.update(tagsRef, { 
                            tagCounter:  finalTagCounter
                        });
                    })
                    
                    this.$refs.form.reset()
                    this.variations = [];
                    this.hasVariations =  false;
                })
            })
            this.categorySnackbar = true
            this.snackbar.text = `Item ${this.menu.name} added!`
            this.addRestoMenuDialog = false
        } else {
            this.$refs.form.validate()
        }
    },
    async fuse() {
        this.isSwitching = true
        // start here
        // HETO YUNG PARA SA FUSE NG SINGLE RESTAURANT
        let batch = db.batch()

        var changeDisplay = {
            isDisplayed: this.currentRestaurants.isDisplayed,
            restaurantStatus: 1
        }

        let restaurantRef = db.collection("restaurants").doc(this.$route.params.id)

        batch.update(restaurantRef, changeDisplay)

        await db.collection("items").where("restaurantId", "==", this.$route.params.id).get().then(docSnaps => {
            docSnaps.docs.forEach((doc) => {
                let itemRef = db.collection("items").doc(doc.id)
                batch.update(itemRef, changeDisplay)
            })
        })

        await db.collection("categories").where("restaurantId", "==", this.$route.params.id).get().then(docSnaps => {
            docSnaps.docs.forEach((doc) => {
                let itemRef = db.collection("categories").doc(doc.id)
                batch.update(itemRef, changeDisplay)
            })
        })

        batch.commit().then(() => {
            console.log('Batch update success')
            this.isSwitching = false
            this.$swal.fire(
                "Done!",
                `${this.currentRestaurants.name} display status is now ${this.currentRestaurants.isDisplayed ? `"Displayed"` : `"Not Displayed"`}.`,
                "success"
            );
        })
    },
    async force() {
        this.isSwitching = true
        // start here
        // HETO YUNG PARA SA FUSE NG SINGLE RESTAURANT
        let batch = db.batch()

        var changeDisplay = {
            isForceClosed: this.currentRestaurants.isForceClosed,
        }

        await db.collection("restaurants").get().then(docSnaps => {
            docSnaps.docs.forEach((doc) => {
                let restaurantRef = db.collection("restaurants").doc(doc.id)
                batch.update(restaurantRef, changeDisplay)
            })
        })

        batch.commit().then(() => {
            console.log('Batch update success')
            this.isSwitching = false
            this.$swal.fire(
                "Done!",
                `All Restaurants is now ${this.currentRestaurants.isForceClosed ? `"force "Closed"` : `"Open"`}.`,
                "success"
            );
        })
    },
  },
  mounted(){
      this.restaurantID = this.$route.params.id
      this.restoID = this.$route.params.id
      window.scrollTo(0,0);
  },
  created(){
        db.collection('restaurants').doc(this.$route.params.id).get().then(snapshot => {
            this.currentRestaurants = snapshot.data()
            this.currentRestaurantName = snapshot.data().name
            this.BreadCrumbs[1].text = snapshot.data().name
        });


       /*  db.collection('restaurants').where("restaurantId", "==", this.$route.params.id).get().then(snapshot => {
            this.currentMenus = snapshot.data()
        });
         */


        // QUERY FOR ITEMS
        db.collection("items").where("restaurantId", "==", this.$route.params.id).orderBy("createdAt").limit(30)
        .onSnapshot((querySnapshot)=>  {
            var arrayMenu = []
            querySnapshot.forEach((doc) => {
                arrayMenu.push(doc.data());
            });
            
            this.currentMenus = arrayMenu
            this.showContent = arrayMenu
            this.count = arrayMenu.length
        });
        

        // QUERY FOR CATEGORIES
        db.collection("categories").where("restaurantId", "==", this.$route.params.id)
        .onSnapshot((querySnapshot)=>  {
            var arrayCategories = []
            querySnapshot.forEach((doc) => {
                arrayCategories.push({
                    id: doc.id,
                    categoryName: doc.data().categoryName,
                    categoryCtr: doc.data().categoryCtr,
                    categorySales: doc.data().categorySales
                });
                
                this.categoryNameAutocomplete.push({'text': doc.data().categoryName, 'value': doc.id})
            });
            this.categories = arrayCategories
        });


        // QUERY FOR REVIEWS
        db.collection("restaurants").doc(this.$route.params.id).collection("reviews").limit(9)
        .onSnapshot((querySnapshot)=>  {
            var arrayReviews = []
            querySnapshot.forEach((doc) => {
                arrayReviews.push(doc.data());
            });
            this.reviews = arrayReviews
            if(arrayReviews.length <= 0){
                this.reviewsIsEmpty = true
            } else {
                this.reviewsIsEmpty = false
            }
        });


  }
}
</script>
