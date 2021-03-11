<template>
  <v-card style="height: auto; max-height: 400px; overflow: auto">
    <v-container>
            <v-row>
                <v-col cols="12" v-for="(category, c) in categories" :key="c">
                    <v-card style="margin-top: -10px">
                        <v-img :src="category.categoryImage" height="50" width="50" style="position: absolute; top: 20px; right: 10px; border-radius: 10px"></v-img>

                        <v-card-title style="font-size: 11px; margin-top:">Category Name: {{ category.categoryName }}</v-card-title>
                        <v-card-title style="font-size: 11px; margin-top: -40px">Tag: {{ category.tag }}</v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
</v-card>
</template>

<script>
import { db } from '../firebase';
export default {
    name: 'Categories',
    components: {
        //
    },
    data: () => ({
        categories: []
    }),
    created(){
        db.collection("categories").where("restaurantId", "==", this.$route.params.id).limit(9)
        .onSnapshot((querySnapshot)=>  {
            var arrayCategories = []
            querySnapshot.forEach((doc) => {
                arrayCategories.push(doc.data());
                
                this.categoryNameAutocomplete.push({'text': doc.data().categoryName, 'value': doc.id})
            });
            this.categories = arrayCategories
        });
    }
}
</script>

<style>

</style>