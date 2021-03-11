<template>
  <div class="userapproval">
    <v-container>
      <h3 style="font-weight: 400">Hi, Welcome Back!</h3>
      <span style="font-size: 13px">Welcome to Skood Admin Dashboard</span>
      <v-row>
        <v-col lg="12">
          <v-card>
            <v-card-title>
            Remit Rider
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
              :headers="headers"
              :items="remits"
              :search="search"
              item-key="id"
              show-expand
              aria-setsize="2px"
              class="elevation-1"
            >
              <template v-slot:item.riderNameSlot="{ item }">
                  <span v-for="(user, u) in riders" :key="u">
                    <span v-if="item.riderId == user.id">
                      {{ user.firstName }} {{ user.lastName }}
                    </span>
                  </span>
              </template>
              <template v-slot:item.firstOrderSlot="{ item }">
                  {{ item.firstOrder.toDate()
                      | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
              </template>
              <template v-slot:item.paymentVerifiedSlot="{ item }">
                 <span v-if="item.paymentVerified == true">
                      <v-chip color="success" style="color: white; font-size: 12px">
                          Verified
                      </v-chip>
                  </span>
                  <span v-else>
                      <v-chip style="font-size: 12px">
                          Not Verified
                      </v-chip>
                  </span>
              </template>
              <template v-slot:item.remitDateSlot="{ item }">
                  {{ item.remitDate.toDate()
                      | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
              </template>
              <template v-slot:item.actions="{ item }">
                  <v-menu transition="slide-x-transition">
                      <template v-slot:activator="{ on, attrs }">
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
                              @click="printReceipt(item)"
                          >
                              <v-icon size="16">mdi-clipboard-account-outline</v-icon><v-list-item-title style="font-size: 11px; margin-left: 5px">Print Receipt Preview</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                              @click="markAsRemitted(item)"
                          >
                              <v-icon size="16">mdi-clipboard-account-outline</v-icon><v-list-item-title style="font-size: 11px; margin-left: 5px">Mark as remitted</v-list-item-title>
                          </v-list-item>
                      </v-list>
                  </v-menu>
              </template>
            </v-data-table>
        </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialogPrint"
      width="350"
    >
      <v-btn icon color="white" @click="dialogPrint = false" style="position: fixed; top: 10px; right: 10px">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card ref="printContent">
        <div class="text-center" style="height: 40px; width: 100%; background-color: #65676b; padding: 5px;">
            <span style="font-size: 11px; color: white; font-family: Orator Std">-------SKOOD REMITTANCE ACKNOWLEDGEMENT RECEIPT-------</span>
          </div>
        <v-card-text style="padding: 10px">
          <v-divider></v-divider>
          <v-container style="color: black">
            <v-row>
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">Tracking Number: </span>
              </v-col>
              <v-col cols="6">
                <span style="font-size: 11px; font-family: Letter Gothic Std">{{ currentTrackNo }}</span>
              </v-col>
            </v-row>
            <v-row style="margin-top: -20px">
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">Company Name: </span>
              </v-col>
              <v-col cols="6">
                <span style="font-size: 11px; font-family: Letter Gothic Std">TaraPhilippines</span>
              </v-col>
            </v-row>
            <v-row style="margin-top: -20px">
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">First Order: </span>
              </v-col>
              <v-col cols="6">
                <p style="font-size: 11px; line-height: 15px; font-family: Letter Gothic Std">{{ currentFirstOrder }}</p>
              </v-col>
            </v-row>
            <v-row style="margin-top: -20px">
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">Total to be remitted: </span>
              </v-col>
              <v-col cols="6">
                <span style="font-size: 11px; font-family: Letter Gothic Std">&#8369; {{ currentPrintInfo.totalToBeRemitted }}</span>
              </v-col>
            </v-row>
            <v-row style="margin-top: -20px">
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">Remit Date: </span>
              </v-col>
              <v-col cols="6">
                <p style="font-size: 11px; line-height: 15px; font-family: Letter Gothic Std">{{ currentRemitDate }}</p>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">Name of Rider: </span>
              </v-col>
              <v-col cols="6">
                <span style="font-size: 11px; font-family: Letter Gothic Std">{{ currentRemitRider }}</span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">Transaction Date: </span>
              </v-col>
              <v-col cols="6">
                <p style="font-size: 11px; line-height: 15px; font-family: Letter Gothic Std">{{ transactionDate }}</p>
              </v-col>
            </v-row>
            <v-row style="margin-top: -20px">
              <v-col cols="6" class="text-left">
                <span style="font-size: 11px; font-family: Letter Gothic Std">IMPORTANT: </span>
              </v-col>
              <v-col cols="6">
                <p style="font-size: 11px; line-height: 15px; font-family: Letter Gothic Std">This will serve as your proof of remit</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="print()"
            class="no-print"
          >
            Print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import * as firebase from "firebase/app";
import { db } from '../../firebase'

import print from 'ink-html'

export default {
  name: 'UserApproval',
  components: {
    
  },
  data: () => ({
      dialogPrint: false,
      remits: [],
      riders: [],
      currentPrintInfo: {},
      currentRemitId: '',
      currentTrackNo: '',
      currentFirstOrder: '',
      currentRemitDate: '',
      currentRemitRider: '',
      search: '',
      headers: [
          { text: 'Rider Name', value: 'riderNameSlot',  align: 'start'},
          {
              text: 'First Order',
              sortable: true,
              value: 'firstOrderSlot',
          },
          { text: 'Payment Verified', value: 'paymentVerifiedSlot', sortable: true},
          { text: 'Remit Date', value: 'remitDateSlot', sortable: true},
          { text: 'Total to be remitted', value: 'totalToBeRemitted', sortable: true},
          { text: 'Action', value: 'actions' },
          { text: '', value: 'data-table-expand' },
      ],
  }),
  firestore: {
    remits: db.collection('remit').orderBy('remitDate'),
    riders: db.collection('riders'),
  },
  methods: {
    async printReceipt(item){
      this.currentRemitId = item.id

      var date = new Date(); // some mock date
      var milliseconds = date.getTime();
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
      this.currentFirstOrder = item.firstOrder.toDate("dd-MM-YYYY, h:mm:ss a").toLocaleDateString("en-US", options)
      this.currentRemitDate = item.remitDate.toDate("dd-MM-YYYY, h:mm:ss a").toLocaleDateString("en-US", options)
      this.transactionDate = date.toLocaleDateString("en-US", options)
      this.dialogPrint = true
      this.currentPrintInfo = item
      this.currentTrackNo = `SKOOD-${milliseconds}`

      const orderRef = db.collection("employees");
        const snapshot = await orderRef
        .where("accountType", "==", "Rider")
        .where("id", "==", item.riderId)
        .get();

        snapshot.forEach((doc) => {
          this.currentRemitRider = `${doc.data().firstName} ${doc.data().lastName}`
        })
    },
    print(){
      print(this.$refs.printContent.$el)
      db.collection("remit").doc(this.currentRemitId).update({
          trackNo: this.currentTrackNo,
          hasRemitted: true,
          paymentReceivedAt: firebase.firestore.Timestamp.fromDate(new Date()),
          paymentTime: null,
          receiptPhoto: null
      }).then(function() {
          console.log("Document successfully written!");
      });
    },
    markAsRemitted(item) {
      db.collection("remit").doc(item.id).update({
          hasRemitted: true
      }).then(function() {
          console.log("Document successfully written!");
      });
    },
  },
  created(){
      this.$bind(
      'remits',
      db
          .collection('remit')
          .where("hasRemitted", "==", false)
      )
  }
}
</script>
<style>
  @media print {
    body {
      width: 100mm;
      height: 140mm;
    }
    .no-print {
      visibility: hidden;
    }
  }

  
@page {
  size: 3.94in 5.51in;
}

</style>
