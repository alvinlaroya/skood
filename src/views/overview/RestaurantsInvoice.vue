<template>
  <div class="restaurants_invoice">
    <v-container style="padding: 20px">
        <v-breadcrumbs :items="BreadCrumbs" style="margin-left: -25px; margin-top: -20px"></v-breadcrumbs>
        <h3 style="font-weight: 400">Hi, Welcome Back!</h3>
        <span style="font-size: 13px">Welcome to Skood Admin Dashboard</span>
        <v-row>
            <v-col cols="12" xl="12">
                <v-card id="invoices">
                    <v-card-title>
                        Restaurant's Invoice
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            style="width: 20px"
                            hide-details
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headersRestoToInvoice"
                        :items="restaurants"
                        :search="search"
                        item-key="id"
                        aria-setsize="2px"
                        class="elevation-1"
                    >
                        <template v-slot:item.restoImageSlot="{ item }">
                          <v-img
                              class="white--text align-end"
                              height="67px"
                              width="67px"
                              :src="item.restaurantImage"
                              style="border-radius: 50%; margin: 20px;"
                          >
                          </v-img>
                        </template>
                        <template v-slot:item.dateOfIssueSlot="{ item }">
                            {{ item.dateOfIssue.toDate() | moment("dddd, MMMM Do YYYY") }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-menu transition="slide-x-transition">
                                <template v-slot:activator="{ on, attrs }   ">
                                    <v-icon
                                        small
                                        v-bind="attrs"
                                        v-on="on"
                                        class="mr-2"
                                    >
                                    mdi-dots-vertical
                                    </v-icon>
                                </template>
                                <v-list>
                                    <v-list-item
                                      @click="issueForInvoice(item)"
                                    >
                                        <v-icon size="16">mdi-clipboard-account-outline</v-icon><v-list-item-title style="font-size: 11px; margin-left: 5px">Generate Invoice of {{ item.name }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import * as firebase from "firebase/app";

import { db } from '../../firebase';

export default {
  name: 'Restaurants_invoice',
  components: {
    
  },
  data: () => ({
      BreadCrumbs: [
        {
            text: 'Pverview',
            disabled: false,
            href: '/dashboard',
        },
        {
            text: "Restaurant's Invoices",
            disabled: true,
            href: '/overview/restaurant',
        },
    ],
    search: '',
    expanded: [],
    singleExpand: false,
    invoices: [],
    restoToInvoice: [],
    invoicesDownload: [],
    restaurants: [],
    invoicesAutoTable: [],
    headersRestoToInvoice: [
        { text: 'Restaurant', value: 'restoImageSlot' },
        {
            text: 'Restaurant Name',
            align: 'start',
            sortable: true,
            value: 'name',
        },
        { text: 'Contact', value: 'contactNo' },
        { text: 'Date of Issue', value: 'dateOfIssueSlot' },
        { text: 'Owner', value: 'owner' },
        { text: 'Action', value: 'actions' }
    ],
  }),
  firestore: {
      restoToInvoice: db.collection("restaurants"),
      restaurants: db.collection("restaurants")
  },
  methods: {
      timeFormat(hms){
          var d = new Date();
          var date = d.getDate();
          var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
          var year = d.getFullYear();

          return firebase.firestore.Timestamp.fromDate(new Date(`${year}-${month}-${date}${hms}`));
      },
      issueForInvoice(restaurant){
            this.$router.push({
                name: 'GenerateInvoice',
                params: {
                    id: restaurant.id,
                },
            });
        },
  },
  created(){
    this.$bind(
    'restaurants',
    db
        .collection('restaurants')
        .where("dateOfIssue", ">=", this.timeFormat(" 00:00:00")).where("dateOfIssue", "<=", this.timeFormat(" 23:59:59"))
    )
  }
}
</script>