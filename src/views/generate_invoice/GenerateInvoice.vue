<template>
  <div class="myaccount">
      <v-app-bar
            color="#004660"
            dense
            dark
        >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>{{ selectedRestoName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        </v-app-bar>
    <v-container>
        <v-row>
            <v-col cols="12" lg="6" xl="6" sm="6">
                <h2></h2>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="text-right" sm="6">
                <span><router-link to="/overview/restaurants_invoice" style="text-decoration: none">Restaurant Invoice</router-link> / Generate Invoice</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" xl="12">
                <v-card id="invoices">
                    <v-card-title>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            style="width: 20px"
                            hide-details
                        ></v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn color="white" large style="color:#004660" elevation="0" @click="dialogDateRange = true">
                            <v-icon left>mdi-calendar</v-icon> Date Range
                        </v-btn>
                        <v-btn color="white" large style="color:#004660" elevation="0" @click="downloadPdf()">
                            <v-icon left>mdi-pdf</v-icon> Generate PDF
                        </v-btn>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="invoices"
                        :search="search"
                        item-key="id"
                        aria-setsize="2px"
                        class="elevation-1"
                        group-by="restaurantOrderNo"
                    >
                        <template v-slot:item.itemImageSlot="{ item }">
                          <v-img
                              class="white--text align-end"
                              height="67px"
                              width="67px"
                              :src="item.imgUrl"
                              style="border-radius: 50%; margin: 20px;"
                          >
                          </v-img>
                        </template>
                        <template v-slot:item.productNameSlot="{ item }">
                           {{ item.itemName }}
                        </template>
                        <template v-slot:item.dateSlot="{ item }">
                            {{ item.orderCreated.toDate() | moment("YYYY-MM-DD") }}
                        </template>
                        <template v-slot:item.modeOfPaymentSlot="{ item }">
                            <span v-if="item.modeOfPayment == 1">Credit Card</span>
                            <span v-else-if="item.modeOfPayment == 2">Paypal</span>
                            <span v-else>COD</span>
                        </template>
                        <template v-slot:expanded-item="{ item }">
                            <tr>
                            <td colspan="2">Description: {{ item.itemDescription}}</td>
                            </tr>
                            <tr>
                            <td colspan="2">Description: {{ item.itemDescription}}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog
        v-model="dialogDateRange"
        width="800"
    >
        <v-card>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col md="5">
                                <v-date-picker v-model="dateRange.from"></v-date-picker>
                        </v-col>
                        <v-col md="2" class="text-center">
                            <h1 style="margin-top: 150px">To</h1>
                        </v-col>
                        <v-col md="5">
                                <v-date-picker v-model="dateRange.to"></v-date-picker>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="[dialogDateRange= false, fetchInvoices(), fetchCanceledOrderInvoices()]"
            >
                Continue
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

import { db } from '../../firebase';

import { jsPDF } from "jspdf";
import 'jspdf-autotable'

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
    dialogDateRange: false,
    dateRange: {
        from: new Date().toISOString().substr(0, 10),
        to: new Date().toISOString().substr(0, 10),
    },
    pickerDateFrom: new Date().toISOString().substr(0, 10),
    selectedRestoName: '',
    search: '',
    invoices: [],
    canceledOrders: [],
    restoToInvoice: [],
    invoicesDownload: [],
    restaurants: [],
    invoicesAutoTable: [],
    currentRestaurant: [],
    currentRestaurantName: '',
    currentRestaurantOwner: '',
    headers: [
        {
            text: 'Order #',
            align: 'start',
            sortable: true,
            value: 'restaurantOrderNo',
        },
        { text: 'Item', value: 'itemImageSlot' },
        { text: 'Product Name', value: 'productNameSlot' },
        { text: 'Date', value: 'dateSlot' },
        { text: 'Payment', value: 'modeOfPaymentSlot' },
        { text: 'Quantity', value: 'qty' },
        { text: 'Price', value: 'price' },
        { text: 'Skood Discount', value: 'skoodDiscount' },
        { text: 'Vat', value: 'vat' },
        { text: 'Total Order Value', value: 'totalOrderValue' },
        { text: 'Restaurant Revenue', value: 'restaurantRevenue' },
        { text: 'Agency Fee Percentage', value: 'agencyFeePercentage' },
        { text: 'Total Agency Fees', value: 'totalAgencyFees' },
        { text: 'Balance', value: 'balance' },
        { text: 'Action', value: 'actions' },
        { text: '', value: 'data-table-expand' },
    ],
  }),
  firestore: {
      restoToInvoice: db.collection("restaurants"),
      restaurants: db.collection("restaurants")
  },
  methods: {
      async downloadPdf() {
        var d = new Date();
        var date = d.getDate();
        var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        var year = d.getFullYear()
        var revenue = 0;
        var totalSkoodFee = 0;
        console.log("RestaurantID pdf: " +this.$route.params.id)
        var self = this
        setTimeout(function(){ 
            // Landscape export, 2×4 inches
            const docAppendixA = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [13, 8.5]
            });

            const docAppendixC = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [13, 8.5]
            });

            const docInvoice = new jsPDF({
                orientation: "portrait",
                unit: "in",
                format: [13, 8.5]
            });


            //**************  SUCCESSFULL DELIVERED ORDERS INVOICING *************//
            var col = ['Order#', 'ProductName', 'Date', 'Payment', 'Quantity', 'Price', 'Skood Discount', 'VAT', 'Total Order Value', 'Restaurant Revenue']
            var deliveredRows = [];
            var canceledRows = [];

            self.invoices.forEach(element => {
                var temp = [
                    element.restaurantOrder,
                    element.itemName, 
                    new Date(element.orderCreated * 1000).toLocaleString("en-US", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}), 
                    element.modeOfPayment == 1 ? 'Pay Maya' : element.modeOfPayment == 2 ? 'Credit Card' : 'COD', 
                    element.qty, 
                    (element.price).toFixed(2), 
                    element.skoodDiscount, 
                    element.vat, 
                    element.totalOrderValue, 
                    element.restaurantRevenue, 
                ];
                revenue += Number(element.totalOrderValue)
                totalSkoodFee += Number(element.totalAgencyFees)
                deliveredRows.push(temp);
                console.log("TOTAL: " +totalSkoodFee)

            });
            docAppendixA.autoTable(col, deliveredRows,{
                margin: { top: 0.8 },
            });
            
            docAppendixA.text("Appendix A: Successfull Delivered Order Details", 0.6, 0.5);
            docAppendixA.save(`${self.currentRestaurantName}_Appendex A`);


            //************** CANCELED ORDERS INVOICING *************//
            self.canceledOrders.forEach(canceledElement => {
                var temp = [
                    canceledElement.restaurantOrder,
                    canceledElement.itemName, 
                    new Date(canceledElement.orderCreated * 1000).toLocaleString("en-US", {month: "long", day: "numeric", year: "numeric"}), 
                    canceledElement.modeOfPayment == 1 ? 'Pay Maya' : canceledElement.modeOfPayment == 2 ? 'Credit Card' : 'COD', 
                    canceledElement.qty, 
                    (canceledElement.price).toFixed(2), 
                    canceledElement.skoodDiscount, 
                    canceledElement.vat, 
                    canceledElement.totalOrderValue, 
                    canceledElement.restaurantRevenue, 
                    canceledElement.agencyFeePercentage, 
                    canceledElement.totalAgencyFees, 
                    canceledElement.balance
                ];
                canceledRows.push(temp);

            });
            docAppendixC.autoTable(col, canceledRows,{
                margin: { top: 0.8 },
            });
            
            docAppendixC.text("Appendix C: Canceled Order Details", 0.6, 0.5);
            docAppendixC.save(`${self.currentRestaurantName}_Appendex C`);

            

            var img = new Image();
            img.src = require('@/assets/img/skood.png');

            docInvoice.setFontSize(10);
            docInvoice.text("Invoice", 0.6, 0.8);
            docInvoice.addImage(img, 'PNG', 7, 0.5, 1.4, 1);
            docInvoice.text(`${self.currentRestaurantName}`, 0.6, 2);
            docInvoice.text(`${self.currentRestaurantOwner}`, 0.6, 2.2);
            docInvoice.text(`Invoice date: ${year}-${month}-${date}`, 5.5, 2);
            docInvoice.text("Invoice number: ", 5.5, 2.2);
            docInvoice.text(`Invoice period: ${self.dateRange.from} - ${self.dateRange.to}`, 5.5, 2.4);
            docInvoice.text("Amount", 7.4, 2.9);
            docInvoice.setLineWidth(-23)
            docInvoice.line(0.6, 3, 8, 3) //x, y-left, width, y-right
            docInvoice.text("Number of successful orders", 0.6, 3.3);
            docInvoice.text(`${self.invoices.length}`, 7.4, 3.3);
            docInvoice.text("Your revenue via Skood", 0.6, 3.6);
            docInvoice.text(`${revenue.toFixed(2)} PHP`, 7.4, 3.6);
            docInvoice.text("Already receive amount", 0.6, 3.9);
            docInvoice.text("0.00 PHP", 7.4, 3.9);
            docInvoice.text("Outstanding amount", 0.6, 4.2);
            docInvoice.text(`${revenue.toFixed(2)} PHP`, 7.4, 4.2);
            docInvoice.line(0.6, 4.4, 8, 4.4) //x, y-left, width, y-right
            docInvoice.text("Agency Fee base", 0.6, 4.6);
            docInvoice.text(`${revenue.toFixed(2)} PHP`, 7.4, 4.6);
            docInvoice.text("Agency Fee percentage", 0.6, 4.9);
            docInvoice.text("16.00%", 7.4, 4.9);
            docInvoice.text("Total Agency Fees", 0.6, 5.2);
            docInvoice.text(`${totalSkoodFee.toFixed(2)} PHP`, 7.4, 5.2);
            docInvoice.text("Net invoice", 0.6, 5.5);
            docInvoice.text(`${totalSkoodFee.toFixed(2)} PHP`, 7.4, 5.5);
            docInvoice.line(0.6, 5.7, 8, 5.7) //x, y-left, width, y-right
            docInvoice.text("Fees and Adjustment", 0.6, 6);
            docInvoice.line(0.6, 6.1, 8, 6.1) //x, y-left, width, y-right
            docInvoice.text("Gross invoice total", 0.6, 6.3);
            docInvoice.text(`${totalSkoodFee.toFixed(2)} PHP`, 7.4, 6.3);
            docInvoice.text("Total Amount Paid Out", 0.6, 6.6);
            docInvoice.text(`${(revenue - totalSkoodFee).toFixed(2)} PHP`, 7.4, 6.6);

            docInvoice.text("Client Check Details", 0.6, 7.3);
            docInvoice.text(`Check in Favor of: ${self.currentRestaurantOwner}`, 0.6, 7.6);
            docInvoice.text("Bank Name:", 0.6, 7.9);
            docInvoice.text("Account Name:", 0.6, 8.2);

            docInvoice.text("Check Details", 4.5, 7.3);
            docInvoice.text(`Check in Favor of: Skood`, 4.5, 7.6);
            docInvoice.text("Bank Name:", 4.5, 7.9);
            docInvoice.text("Account Name:", 4.5, 8.2);
            docInvoice.text("Mailing Address: Baguio, Benguet", 4.5, 8.5);
            
            docInvoice.text("This is a system generated invoice and doesn't require a signature. If you have any questions fell free to contact us.", 0.6, 10);

            docInvoice.text("Skood Philippines", 0.6, 12);
            docInvoice.text("Baguio City", 0.6, 12.2);

            docInvoice.text("Email", 3.5, 12);
            docInvoice.text("Invoicing@skood.com", 3.5, 12.2);
            docInvoice.text("Phone: +639381453259", 3.5, 12.4);

            docInvoice.text("Tax id:", 6.5, 12);

            /* docInvoice.setLineWidth(0.1);
            docInvoice.line(10, 10, 60, 20); // horizontal line */

            docInvoice.save(`${self.currentRestaurantName}_Invoice`);
        }, 1000);
        db.collection("restaurants").doc(this.$route.params.id).update({
            dateOfIssue: firebase.firestore.Timestamp.fromDate(new Date(parseInt(new Date().getTime()) + 604800000))
        })
      },
      async fetchCanceledOrderInvoices() {
        this.canceledOrders = []
        let tempArr = []
        let tempObj = {}
        const orderRef = db.collection("orders").where("isProcessed", "==", true);
        const snapshot = await orderRef
        .where("restaurantId", "==", this.$route.params.id)
        .where("orderStatus", "==", 5)
        .where("orderCreated", ">=", this.timeFormat(this.dateRange.from, '00:00:00'))
        .where("orderCreated", "<=", this.timeFormat(this.dateRange.to, '23:59:59'))
        .get();

        snapshot.forEach((docOrders) => {

            db.collection("orders").doc(docOrders.id).collection("order_items")
            .where("restaurantOrder", "==", docOrders.data().restaurantOrderNo)
            .onSnapshot((querySnapshot)=>  {
                querySnapshot.forEach((docOrderItems) => {
                     tempObj = {
                        amountChanged: docOrders.data().amountChanged,
                        amountRendered: docOrders.data().amountRendered,
                        assignedDriver: docOrders.data().assignedDriver,
                        deliveryFee: docOrders.data().deliveryFee,
                        donePreparing: docOrders.data().donePreparing,
                        formattedAddress: docOrders.data().formattedAddress,
                        grandTotal: docOrders.data().grandTotal,
                        isAccepted: docOrders.data().isAccepted,
                        isCanceled: docOrders.data().isCanceled,
                        modeOfPayment: docOrders.data().modeOfPayment,
                        orderAccpeted: docOrders.data().orderAccpeted,
                        orderCreated: docOrders.data().orderCreated,
                        orderDelivered: docOrders.data().orderDelivered,
                        orderPickedUp: docOrders.data().orderPickedUp,
                        orderStatus: docOrders.data().orderStatus,
                        qty: docOrderItems.data().qty,
                        restaurantId: docOrders.data().restaurantId,
                        restaurantOrder: docOrderItems.data().restaurantOrder,
                        restaurantOrderNo: docOrders.data().restaurantOrderNo,
                        costumerId: docOrders.data().userId,
                        productId: docOrderItems.data().productId,
                        categoryId: docOrderItems.data().categoryId,
                        imgUrl: docOrderItems.data().imgUrl,
                        itemName: docOrderItems.data().itemName,
                        itemPrice: docOrderItems.data().variations.price,
                        price: ((docOrderItems.data().variations.price / 1.12).toFixed(2)) * docOrderItems.data().qty,
                        skoodDiscount: 0,
                        vat: (docOrderItems.data().variations.price - (docOrderItems.data().variations.price / 1.12)).toFixed(2)/* ((docOrderItems.data().itemPrice * docOrderItems.data().qty)/1.2).toFixed(2) */,
                        totalOrderValue: docOrderItems.data().variations.price * docOrderItems.data().qty,
                        restaurantRevenue: docOrderItems.data().variations.price * docOrderItems.data().qty,
                        agencyFeePercentage: '16%',
                        totalAgencyFees: (docOrderItems.data().variations.price * docOrderItems.data().qty) * 0.16,
                        balance: (docOrderItems.data().variations.price * docOrderItems.data().qty) - ((docOrderItems.data().variations.price * docOrderItems.data().qty) * 0.16)
                    }
                    tempArr.push(tempObj)
                });
                this.canceledOrders = tempArr
            });
        })
       
      },
      async fetchInvoices() {
        this.invoices = []
        let tempArr = []
        let tempObj = {}
        const orderRef = db.collection("orders").where("isProcessed", "==", true);
        const snapshot = await orderRef
        .where("restaurantId", "==", this.$route.params.id)
        .where("isAccepted", "==", true)
        .where("orderStatus", "==", 3)
        .where("orderCreated", ">=", this.timeFormat(this.dateRange.from, '00:00:00'))
        .where("orderCreated", "<=", this.timeFormat(this.dateRange.to, '23:59:59'))
        .get();

        snapshot.forEach((docOrders) => {

            db.collection("orders").doc(docOrders.id).collection("order_items")
            .where("restaurantOrder", "==", docOrders.data().restaurantOrderNo)
            .onSnapshot((querySnapshot)=>  {
                querySnapshot.forEach((docOrderItems) => {
                     tempObj = {
                        amountChanged: docOrders.data().amountChanged,
                        amountRendered: docOrders.data().amountRendered,
                        assignedDriver: docOrders.data().assignedDriver,
                        deliveryFee: docOrders.data().deliveryFee,
                        donePreparing: docOrders.data().donePreparing,
                        formattedAddress: docOrders.data().formattedAddress,
                        grandTotal: docOrders.data().grandTotal,
                        isAccepted: docOrders.data().isAccepted,
                        isCanceled: docOrders.data().isCanceled,
                        modeOfPayment: docOrders.data().modeOfPayment,
                        orderAccpeted: docOrders.data().orderAccpeted,
                        orderCreated: docOrders.data().orderCreated,
                        orderDelivered: docOrders.data().orderDelivered,
                        orderPickedUp: docOrders.data().orderPickedUp,
                        orderStatus: docOrders.data().orderStatus,
                        qty: docOrderItems.data().qty,
                        restaurantId: docOrders.data().restaurantId,
                        restaurantOrder: docOrderItems.data().restaurantOrder,
                        restaurantOrderNo: docOrders.data().restaurantOrderNo,
                        costumerId: docOrders.data().userId,
                        productId: docOrderItems.data().productId,
                        categoryId: docOrderItems.data().categoryId,
                        imgUrl: docOrderItems.data().imgUrl,
                        itemName: `${docOrderItems.data().itemName} (${docOrderItems.data().variations.name})`,
                        itemPrice: docOrderItems.data().variations.price,
                        price: ((docOrderItems.data().variations.price / 1.12).toFixed(2)) * docOrderItems.data().qty,
                        skoodDiscount: 0,
                        vat: (docOrderItems.data().variations.price - (docOrderItems.data().variations.price / 1.12)).toFixed(2)/* ((docOrderItems.data().itemPrice * docOrderItems.data().qty)/1.2).toFixed(2) */,
                        totalOrderValue: docOrderItems.data().variations.price * docOrderItems.data().qty,
                        restaurantRevenue: docOrderItems.data().variations.price * docOrderItems.data().qty,
                        agencyFeePercentage: '16%',
                        totalAgencyFees: (docOrderItems.data().variations.price * docOrderItems.data().qty) * 0.16,
                        balance: (docOrderItems.data().variations.price * docOrderItems.data().qty) - ((docOrderItems.data().variations.price * docOrderItems.data().qty) * 0.16)
                    }

                    
                    tempArr.push(tempObj)
                });
                this.invoices = tempArr
            });
        })
       
      },
      timeFormat(date, hr){
          return firebase.firestore.Timestamp.fromDate(new Date(`${date} ${hr}`));
      },
  },
    created(){
        let tempArr = []
        db.collection('restaurants').doc(this.$route.params.id).get().then(snapshot => {
            this.selectedRestoName = snapshot.data().name
            this.currentRestaurantName = snapshot.data().name
            this.currentRestaurantOwner = snapshot.data().owner
            this.selectedRestoId = snapshot.id
            tempArr.push({
                id: snapshot.id,
                name: snapshot.data().name,
                owner: snapshot.data().owner,
            })
        });
        this.currentRestaurant = tempArr
    }
}
</script>