<template>
    <v-navigation-drawer
        app
        light
    >
        <template v-slot:prepend>
            <v-list-item two-line size="9">
            <v-list-item-avatar>
                <img src="https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png">
            </v-list-item-avatar>
            <span style="height: 15px; width: 15px; border: 3px solid white; border-radius: 50%; background-color: #22bf66; position: absolute; top: 43px; left: 43px;"></span>
            <v-list-item-content>   
                <v-list-item-title class="title"></v-list-item-title>
                <v-list-item-subtitle style="font-size: 13px; font-weight: bold; color: black">{{ session.firstName }} {{ session.lastName }}</v-list-item-subtitle>
                <v-list-item-subtitle style="font-size: 11px">{{ session.email }}</v-list-item-subtitle>
                <v-list-item-subtitle style="font-size: 11px">{{ session.accountType }}</v-list-item-subtitle>
            </v-list-item-content>
            </v-list-item>
        </template>
        <v-divider></v-divider>
        <v-list dense class="highlighted overflow-hidden">
             <!-- LIST OF NAVIGATION -->
            <v-subheader>NAVIGATION</v-subheader>
            <v-list-item-group color="primary">
                <v-list-item
                    v-for="(item, i) in navigations"
                    :key="i"
                    link
                    to="/dashboard"
                >
                <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
            <!-- END LIST OF NAVIGATION -->

            <!-- LIST OF OVERVIEW -->
            <v-subheader>OVERVIEW</v-subheader>
            <v-list-item-group color="primary">
                <div
                    v-for="(item, i) in overviews"
                    :key="i"
                >
                    <v-list-item
                        
                        link
                        :to="item.path"
                        v-if="item.show == true"
                    >
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                    <v-chip draggable color="red" small text-color="white" v-if="restaurantsInvoice.length > 0 && item.invoiceChipDisplay == true">{{ restaurantsInvoice.length }}</v-chip>
                    </v-list-item>
                </div>
            </v-list-item-group>
            <!-- END LIST OF OVERVIEW -->

            <!-- LIST OF FOOD -->
            <v-subheader>FOOD</v-subheader>
            <v-list-item-group color="primary">
                <div
                    v-for="(item, i) in foods"
                    :key="i"
                >
                    <v-list-item
                        link
                        :to="item.path"
                        v-if="item.show == true"
                    >
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                        <v-chip draggable color="red" small text-color="white" v-if="item.count > 0">{{ item.count }}</v-chip>
                    </v-list-item>
                    <v-list-item v-else disabled>
                        <v-list-item-icon>
                            <v-icon>mdi-cancel</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    </div>
            </v-list-item-group>
            <v-subheader>USER MANAGEMENT</v-subheader>
            <v-list-item-group color="primary">
                <div  
                    v-for="(item, i) in user_management"
                    :key="i">
                    <v-list-item
                        v-if="item.show == true"
                        link
                        :to="item.path"
                    >
                        <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-else disabled>
                        <v-list-item-icon>
                            <v-icon>mdi-cancel</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
                
            </v-list-item-group>
            <!-- END LIST OF USER MANAGEMENT -->

            <!-- LIST OF SUPPORT -->
            <v-subheader>SUPPORT</v-subheader>
            <v-list-item-group color="primary">
                <div
                    v-for="(item, i) in supports"
                    :key="i"
                >
                    <v-list-item
                    v-if="item.show == true"
                    link
                    :to="item.path"
                    >
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                        <v-chip draggable color="red" small text-color="white" v-if="support.length > 0">{{support.length}}</v-chip>
                    </v-list-item>
                    <v-list-item v-else disabled>
                        <v-list-item-icon>
                            <v-icon>mdi-cancel</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </v-list-item-group>
            <!-- END LIST OF OTHERS -->

            <!-- LIST OF REMITTANCE -->
            <v-subheader>REMIT MANAGEMENT</v-subheader>
            <v-list-item-group color="primary">
                <v-list-group
                prepend-icon="mdi-cash-usd-outline"
                no-action
            >
                <template v-slot:activator>
                <v-list-item-content>
                    <v-list-item-title>Remit</v-list-item-title>
                </v-list-item-content>
                <v-badge color="pink" dot offset-x="-15" offset-y="6" :value="remitRider.length > 0 && remitVerification.length > 0"></v-badge>
                </template>

                <v-list-item to="/remit/remit_rider">
                    <v-list-item-content>
                        <v-list-item-title>
                            Remit Rider
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-chip draggable color="red" small text-color="white" v-if="remitRider.length > 0">{{remitRider.length}}</v-chip>
                </v-list-item>
                <v-list-item to="/remit/remit_verification">
                    <v-list-item-content>
                        <v-list-item-title>
                            Remit Verification
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-chip draggable color="red" small text-color="white" v-if="remitVerification.length > 0" >{{remitVerification.length}}</v-chip>
                </v-list-item>
            </v-list-group>
            </v-list-item-group>
            <!-- END LIST OFREMITTANCE-->

            <!-- LIST OF OTHERS -->
            <v-subheader>OTHERS</v-subheader>
            <v-list-item-group color="primary">
                <div
                    v-for="(item, i) in others"
                    :key="i"
                >
                    <v-list-item
                        link
                        :to="item.path"
                        v-if="item.show == true"
                    >
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-else disabled>
                        <v-list-item-icon>
                            <v-icon>mdi-cancel</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </v-list-item-group>
            <!-- END LIST OF OTHERS -->
        </v-list>
    </v-navigation-drawer>
</template>

<script>

import * as firebase from 'firebase/app';
import { db } from '../firebase';

export default {
     data: () => ({
         session: {
             id: null,
             firstName: '',
             lastName: '',
             accountType: '',
             email: null,
             contactNo: null,
         },
         remitRider: [],
         remitVerification: [],
         restaurantsInvoice: [],
         support: [],
         ordersCount: null,
         assignedRestaurants: [],
         navigations: [
            { 
                text: 'Dashboard', icon: 'mdi-view-dashboard-outline', 
                items: [],
            },
         ],
         overviews: [
            { text: 'Restaurants', icon: 'mdi-silverware-fork-knife', path: '/overview/restaurant', invoiceChipDisplay: false, show: false },
            { text: "Restaurant's Invoice", icon: 'mdi-receipt', path: '/overview/restaurants_invoice', invoiceChipDisplay: true, show: false},
         ],
         foods: [
            { text: 'Orders', icon: 'mdi-order-bool-ascending-variant', path: '/food/orders', count: 0, show: false},
         ],
         applications: [
            { 
                text: 'Create', icon: 'mdi-folder-plus-outline', 
                items: [
                    { text: 'Menus', icon: 'mdi-clock', path: '/post/news'},
                ],
            },
            { 
                text: 'Categories', icon: 'mdi-shape-outline', 
                items: [
                    { text: 'Travel', icon: 'mdi-clock', path: '/categories/travel'},
                    { text: 'Store', icon: 'mdi-clock', path: '/categories/store'},
                    { text: 'School', icon: 'mdi-clock', path: '/categories/school'},
                    { text: 'Hospital', icon: 'mdi-clock', path: '/categories/hospital'},
                    { text: 'Government', icon: 'mdi-clock', path: '/categories/government'},
                    { text: 'Restaurant', icon: 'mdi-clock', path: '/categories/restaurant'},
                    { text: 'Work', icon: 'mdi-clock', path: '/categories/work'},
                    { text: 'Bank', icon: 'mdi-clock', path: '/categories/bank'},
                    { text: 'Church', icon: 'mdi-clock', path: '/categories/church'},
                ],
            },
            { 
                text: 'App2', icon: 'mdi-clock', 
                items: [
                    { text: 'App2 sub item', icon: 'mdi-clock', path: '/dashboard'}
                ],
            },
            { 
                text: 'App3', icon: 'mdi-clock', 
                items: [
                    { text: 'App3 sub item', icon: 'mdi-clock', path: '/dashboard'}
                ],
            },
         ],
         user_management: [
            { text: 'My Account', icon: 'mdi-account-circle-outline', path: '/management/my_account', show: true},
            { text: 'Employee Registration', icon: 'mdi-card-account-details-outline', path: '/management/employee_registration', show: false},
            { text: 'Rider Registration', icon: 'mdi-card-account-details-outline', path: '/management/rider_registration', show: false},
            
         ],
         supports: [
            { text: 'Chat Support', icon: 'mdi-chat', path: '/support/chat', show: false},
         ],
         others: [
            { text: 'Restaurant Management', icon: 'mdi-silverware', path: '/others/restaurant_management', show: false},
            { text: 'Menu Management', icon: 'mdi-food', path: '/others/menu_management', show: false},
            { text: 'Tags', icon: 'mdi-account', path: '/others/tags', show: false},
         ],
     }),

    firestore: {
        restaurantsInvoice: db.collection("restaurants"),
        remitRider: db.collection("remit"),
        remitVerification: db.collection("remit"),
        support: db.collection("support_queue"),
    },

    mounted(){
        //
    },
    methods: {
        fetchOrders(){
            const unsubscribe = db.collection("orders")
            .where("orderStatus", "==", 1)
            .where("isAccepted", "==", false)
            .where("hasDispatcher", "==", false)
            .orderBy("orderCreated")
            .onSnapshot(querySnapshot => {
                const alertsTemp = querySnapshot.docs.map(documentSnapshot => {
                  /*   this.$notify({
                        group: 'foo',
                        title: `${(documentSnapshot.data().orderCreated).toDate()}`,
                        text: `Hello! There is an order in a Restaurant with Order No: ${documentSnapshot.data().restaurantOrderNo}`,
                        type: 'success',
                    }); */
                    return {
                        id: documentSnapshot.id,
                        // give defaults
                        restaurantId: '',
                        orderStatus: '',
                        ...documentSnapshot.data()
                    };
                });

                this.foods[0].count = alertsTemp.length
            });

            return () => unsubscribe();
            /* var x;
            for(x=0; x<this.assignedRestaurants.length; x++){

                const unsubscribe = db.collection("orders")
                .where("orderStatus", "==", 1)
                .where("isAccepted", "==", false)
                .where("restaurantId", "==", this.assignedRestaurants[x])
                .orderBy("orderCreated")
                .onSnapshot(querySnapshot => {
                    const alertsTemp = querySnapshot.docs.map(documentSnapshot => {
                        return {
                            id: documentSnapshot.id,
                            // give defaults
                            restaurantId: '',
                            orderStatus: '',
                            ...documentSnapshot.data()
                        };
                    });

                    this.foods[0].count = alertsTemp.length
                });

                return () => unsubscribe();
            } */
        },
        timeFormat(hms){
          var d = new Date();
          var date = d.getDate();
          var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
          var year = d.getFullYear();

          return firebase.firestore.Timestamp.fromDate(new Date(`${year}-${month}-${date}${hms}`));
      },
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

                    if(doc.data().accountType === 'Supervisor'){
                        this.user_management[1].show = true
                        this.user_management[2].show = true
                        this.others[0].show = true
                        this.others[1].show = true
                        this.others[2].show = true
                        this.supports[0].show = true
                        this.overviews[0].show = true
                        this.overviews[1].show = true
                        this.foods[0].show = true
                    }
                    else if(doc.data().accountType === 'Registrar'){
                        this.user_management[1] = true
                        this.overviews[0].show = true
                        this.user_management[2].show = true
                        this.others[0].show = true
                        this.others[1].show = true
                        this.others[2].show = true
                    }
                    else if(doc.data().accountType === 'Support'){
                        this.overviews[0].show = true
                        this.supports[0].show = true
                    }
                    else if(doc.data().accountType === 'Dispatcher'){
                        this.foods[0].show = true
                        this.overviews[0].show = true
                    }
                    else if(doc.data().accountType === 'Accounting'){
                        this.overviews[0].show = true
                        this.overviews[1].show = true
                        this.overviews[2].show = true
                    }
                    else {
                        //
                    }
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


        this.$bind(
            'restaurantsInvoice',
            db
            .collection('restaurants')
            .where("dateOfIssue", ">=", this.timeFormat(" 00:00:00")).where("dateOfIssue", "<=", this.timeFormat(" 23:59:59"))
        )

        this.$bind(
            'remitRider',
            db
            .collection('remit')
            .where("hasRemitted", "==", false)
        )

        this.$bind(
            'remitVerification',
            db
            .collection('remit')
            .where("hasRemitted", "==", true)
        )

        this.$bind(
            'support',
            db
            .collection('support_queue')
            .where("isOpened", "==", false)
        )

        

      /*   console.log("FIRST NAME MO ITO: " +fname)
        console.log("EMAIL MO ITO: " +email)
        console.log("UID MO ITO: " +uid) */
    }
}
</script>

<style>
#sidebar{
    overflow: hidden;
}
</style>