<template>
  <div class="categories">
     <v-breadcrumbs :items="BreadCrumbs"></v-breadcrumbs>
     <v-container>
         <v-row>
             <v-col 
                cols="12" 
                lg="6"
                xl="3"
                v-for="(categ, c) in categories"
                :key="c"
            >
                 <v-card
                    class="mt-6 mx-auto" 
                    style="box-shadow: none"
                    max-width="400"
                    @click="$router.replace(categ.path)"
                >
                    <v-sheet
                    class="v-sheet--offset card-header"
                    color="cyan"
                    elevation="5"
                    max-width="calc(100% - 32px)"
                    >
                        <v-icon style="font-size: 70px;" color="white">{{ categ.icon }}</v-icon>
                    </v-sheet>
                    <v-card-text class="pt-0">
                    <div class="title font-weight-light mb-2" style="position: absolute; top: 20px; right: 20px">{{ categ.title }}</div>
                    <span style="font-size: 40px; position: absolute; top: 70px; right: 20px;">24</span>
                    <div class="subheading font-weight-light grey--text">{{ categ.desc }}</div>
                    </v-card-text>
                </v-card>
             </v-col>
         </v-row>
     </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */

export default {
  name: 'Categories',
  components: {
    //
  },
  data: () => ({
    BreadCrumbs: [
        {
            text: 'Others',
            disabled: false,
            href: '/dashboard',
        },
        {
            text: 'Categories',
            disabled: true,
            href: '/others/categories',
        },
    ],
    categories: [
        {
            icon: 'mdi-train-car',
            title: 'Breakfast',
            desc: 'Travel Description',
            path: '/categories/breakfast',
        },
        {
            icon: 'mdi-cart',
            title: 'Lunch',
            desc: 'Travel Description',
            path: '/categories/store',
        },
         {
            icon: 'mdi-school',
            title: 'Dinner',
            desc: 'Travel Description',
            path: '/categories/school',
        },
        {
            icon: 'mdi-hospital-building',
            title: 'Set',
            desc: 'Travel Description',
            path: '/categories/hospital',
        },
    ]
  }),
  methods: {
      showCateg(){
          console.log("SHOW")
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