<template>
    <v-row>
        <v-col cols="12" lg="3" xl="3" v-for="(line, l) in lineChart" :key="l">
                <v-card
                    class="text-left"
                    style="height: 150px; box-shadow: none"
                >
                    <span style="font-size: 30px; position: absolute; top: 45px; left: 15px;" class="counter animate__animated animate__fadeInUp">{{ line.value }}</span>
                    <span style="font-size: 20px; color: grey; position: absolute; top: 20px; left: 15px;" class="animate__animated animate__fadeInUp">{{ line.title }}</span>
                    <v-card-text style="position: absolute; bottom: 2px;" class="animate__animated animate__fadeInUp">8.5%<br>Today</v-card-text>
                    <v-img
                        :src="line.icon"
                        width="94"
                        height="94"
                        class="icon-right animate__animated animate__fadeInUp"
                    ></v-img>
                </v-card>
        </v-col>
    </v-row>
</template>

<script>
import * as firebase from 'firebase/app';
import { db } from '../firebase';

export default {
    data: () => ({
        lineChart: [
          {title: 'Delivered', value: 0, icon: 'https://image.flaticon.com/icons/png/512/1337/1337104.png'},
          {title: 'Orders', value: 0, icon: 'https://image.flaticon.com/icons/png/512/1532/1532688.png'},
          {title: 'Pending', value: 0, icon: 'https://image.flaticon.com/icons/svg/1701/1701971.svg'},
          {title: 'Canceled', value: 0, icon: 'https://static.peachmode.com/static/17.3/images/icons/cancel-order.png'},
      ],
      assignedRestaurants: [],
      session: {
        id: '',
        firstName: '',
        lastName: '',
        accountType: '',
        email: '',
        contactNo : '',
      }
    
    }),
    methods: {
        fetchOrders(){
            db.collection("orders").where("orderStatus", "==", 3).where("isCancelled", "==", false)
            .onSnapshot((querySnapshot)=>  {
               var arrayItems = []
                querySnapshot.forEach((doc) => {
                    arrayItems.push(doc.data());
                    this.lineChart[0].value = arrayItems.length
                   /*  var x;
                    for(x=0; x<this.assignedRestaurants.length; x++){
                        if(doc.data().restaurantId == this.assignedRestaurants[x]) {
                            arrayItems.push(doc.data());
                            this.lineChart[0].value = arrayItems.length
                        }
                    } */
                });
            });

            db.collection("orders").where("orderStatus", "==", 1).where("isCancelled", "==", false).where("isAccepted", "==", false)
            .onSnapshot((querySnapshot)=>  {
                var arrayItems = []
                querySnapshot.forEach((doc) => {
                    arrayItems.push(doc.data());
                    this.lineChart[2].value = arrayItems.length
                   /*  var x;
                    for(x=0; x<this.assignedRestaurants.length; x++){
                        if(doc.data().restaurantId == this.assignedRestaurants[x]) {
                            arrayItems.push(doc.data());
                            this.lineChart[2].value = arrayItems.length
                        }
                    } */
                });
            });

            db.collection("orders")
            .onSnapshot((querySnapshot)=>  {
                var arrayItems = []
                querySnapshot.forEach((doc) => {
                    arrayItems.push(doc.data());
                    this.lineChart[1].value = arrayItems.length
                   /*  var x;
                    for(x=0; x<this.assignedRestaurants.length; x++){
                        if(doc.data().restaurantId == this.assignedRestaurants[x]) {
                            arrayItems.push(doc.data());
                            this.lineChart[1].value = arrayItems.length
                        }
                    } */
                });
            });

            db.collection("orders").where("isCancelled", "==", true).where("orderStatus", "==", 4)
            .onSnapshot((querySnapshot)=>  {
                var arrayItems = []
                querySnapshot.forEach((doc) => {
                    arrayItems.push(doc.data());
                    this.lineChart[3].value = arrayItems.length
                   /*  var x;
                    for(x=0; x<this.assignedRestaurants.length; x++){
                        if(doc.data().restaurantId == this.assignedRestaurants[x]) {
                            arrayItems.push(doc.data());
                            this.lineChart[3].value = arrayItems.length
                        }
                    } */
                });
            });
        }
    },
    created(){

        var user = firebase.auth().currentUser;

        if (user != null) {
            db.collection("employees").where("id", "==", user.uid)
            .onSnapshot((querySnapshot)=>  {
                querySnapshot.forEach((doc) => {
                    this.session.id = doc.id
                    this.session.firstName = doc.data().firstName
                    this.session.lastName = doc.data().lastName
                    this.session.accountType = doc.data().accountType
                    this.session.email = doc.data().email
                    this.session.contactNo = doc.data().contactNo
                });
            });

            db.collection("restaurants")
            .onSnapshot((querySnapshot)=>  {
                let restaurants = []
                querySnapshot.forEach((doc) => {
                    if(doc.data().dispatchers != null) {
                        var x;
                        for(x=0; x<doc.data().dispatchers.length; x++){
                            if(doc.data().dispatchers[x] == user.uid) {
                                restaurants.push(doc.id)
                            }
                        }
                    }
                });
                this.assignedRestaurants = restaurants
                this.fetchOrders() //================> Call Fetching restaurant_orders every updating the assigned restaurants <=================/
            });

        }


         

      /*   console.log("FIRST NAME MO ITO: " +fname)
        console.log("EMAIL MO ITO: " +email)
        console.log("UID MO ITO: " +uid) */
    }
}
</script>

<style>
.icon-right {
    position: absolute;
    top: 20px;
    right: 10px;
}
</style>