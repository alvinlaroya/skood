<template>
  <div class="tags">
    <TagToolBar/> 
    <v-breadcrumbs :items="BreadCrumbs"></v-breadcrumbs>
    <v-container>
        <v-row>
            <v-col cols="12" xl="12">
                <v-row style="margin-top: -40px">
                    <v-col cols="12" xl="3" lg="4" sm="6" xs="12" v-for="tag in tags" :key="tag.id">
                        <v-card
                            @click="view(tag)"
                            class="mx-auto animate__animated animate__fadeIn"
                        >
                            <v-img
                                class="white--text align-end"
                                height="250px"
                                :src="tag.image"
                            >
                            
                            </v-img>

                            <v-card-title>{{ tag.name }}</v-card-title>

                            <v-card-text class="text--primary">
                            <div>
                                Status: <span v-if="tag.tagStatus == 1"><v-chip small color="#004660" style="color: white">Active</v-chip></span><span v-else><v-chip small>In-active</v-chip></span>
                            </div>
                            <div>
                               <span v-if="tag.tagCounter > 0">{{ tag.tagCounter }} Menus</span>
                               <span v-else>No menu yet</span>
                            </div>
                            <div>Date Created: {{ tag.createdAt.toDate() | moment("dddd, MMMM Do YYYY") }}</div>
                            </v-card-text>
                            <!-- <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="orange"
                                    text
                                    @click="deleteTag(tag.id)"
                                >
                                    Delete
                                </v-btn>
                                <v-btn
                                    color="orange"
                                    text
                                    @click="explore(tag, tag.id)"
                                >
                                    Explore
                                </v-btn>
                            </v-card-actions> -->
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title style="color: white;" class="headline primary">
          <v-icon style="font-size: 20px; color: white; margin-right: 10px;">mdi-tag-multiple</v-icon><span style="font-size: 15px">{{ currentTags.name }}</span>
        </v-card-title>

        <v-container>
            <v-img
                :src="currentTags.image"
                height="250"
            >
            </v-img>
        </v-container>
        <v-container>
            <v-row>
                <v-col cols="4" class="text-center center">
                    <v-layout row wrap justify-center>
                        <span>Is Displayed: </span>
                        <v-flex md6 style="margin-top: -15px; margin-left: 30px">
                            <v-switch
                                @change="fuseDisplayed(currentTags)"
                                large
                                v-model="currentTags.isDisplayed"
                            ></v-switch>
                        </v-flex>
                    </v-layout>
                </v-col>
                <v-col cols="4" class="text-center">    
                    <span>Tag Counter:</span><br>
                    <span style="font-size: 25px; font-weight: bold">{{ currentTags.tagCounter }}</span>
                </v-col>
                <v-col cols="4" class="text-center center">
                    <v-layout row wrap justify-center>
                        <span>Tag Status: </span>
                        <v-flex md6 style="margin-top: -15px; margin-left: 30px">
                            <v-switch
                                @change="fuseTags(currentTags)"
                                large
                                v-model="currentTags.tagStatus"
                            ></v-switch>
                        </v-flex>
                    </v-layout>
                </v-col>
               
            </v-row>
        </v-container>
        <v-card-actions style="margin-top: -30px">
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="dialog = false"
          >
            close
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Edit {{ currentTags.name }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '../../firebase';

import TagToolBar from '../../components/TagToolBar';

export default {
  name: 'Tags',
  components: {
    TagToolBar,
  },
  data: () => ({
    BreadCrumbs: [
        {
            text: 'Others',
            disabled: false,
            href: '/dashboard',
        },
        {
            text: 'Tags',
            disabled: true,
            href: '/others/categories',
        },
    ],
    currentTags: {},
    dialog: false,
    categories: [
        {
            icon: 'mdi-train-car',
            title: 'Breakfast',
            desc: 'Travel Description',
            path: '/categories/breakfast',
        },
    ],
    tags: [],
  }),
  firestore: {
      tags: db.collection("tags").orderBy("createdAt")
  },
  methods: {
    explore(restaurant, id){
        this.$router.push({
            name: 'SelectedTag',
            params: {
                id: id,
            },
        });
    },
    view(tags){
        console.log(tags)
        this.currentTags = tags;
        this.dialog = true;
    },
    fuseDisplayed(tag) {
        db.collection("tags").doc(tag.id).update({
            isDisplayed: tag.isDisplayed
        });
    },
    fuseTags(tag) {
        db.collection("tags").doc(tag.id).update({
            tagStatus: tag.tagStatus
        });
    },
    deleteTag(id) {
        db.collection("tags").doc(id).update({
            isDisplayed: false
        })
    }
  }
}
</script>

<style>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
  .card-header{
      padding: 20px;
      width: 110px;
      height: 110px;
      margin-left: 15px;
      z-index: 99999;
  }
</style>