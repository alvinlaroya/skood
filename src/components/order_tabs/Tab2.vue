<template>
  <v-card>
    <v-card-title>
    <!--   Daily --> Order Delivered
    <v-spacer></v-spacer>
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        width="2"
        hide-details
    ></v-text-field>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="processOrders"
        :search="search"
        item-key="id"
        aria-setsize="2px"
        class="elevation-1"
        :loading="isProcessing"
        loading-text="Processing... Please wait"
    >
        <template v-slot:item.deliveryFeeSlot="{ item }">
        <v-chip color="#036d94" style="color: white; font-weight: 300">
            &#x20b1; {{ (item.deliveryFee).toFixed(2) }}
        </v-chip>
        </template>
        <template v-slot:item.subTotalSlot="{ item }">
        <v-chip color="#004660" style="color: white; font-weight: 300">
            &#x20b1; {{ (item.subTotal).toFixed(2) }}
        </v-chip>
        </template>
        <template v-slot:item.grandTotalSlot="{ item }">
        <v-chip color="#004660" style="color: white; font-weight: 300">
            &#x20b1; {{ (item.grandTotal).toFixed(2) }}
        </v-chip>
        </template>
        <template v-slot:item.modeOfPaymentSlot="{ item }">
        <span v-if="item.modeOfPayment == 1">Credit Card</span>
        <span v-else-if="item.modeOfPayment == 2">Paypal</span>
        <span v-else>COD</span>
        </template>
        <template v-slot:item.orderStatusSlot="{ item }">
        <v-chip color="gray" style="color: black" v-if="item.orderStatus == 0">
            Waiting
        </v-chip>
        <v-chip color="orange" style="color: white" v-if="item.orderStatus == 1 && item.isAccepted == false">
            Pending
        </v-chip>
        <v-chip color="pink" style="color: white" v-if="item.orderStatus == 1 && item.isAccepted == true">
            Pick up Order
        </v-chip>
        <v-chip color="#08b0d1" style="color: white" v-if="item.orderStatus == 2">
            On Deliver
        </v-chip>
        <v-chip color="success" style="color: white" v-if="item.orderStatus == 3">
            Delivered
        </v-chip>
        <v-chip color="red" style="color: white" v-if="item.orderStatus == 4">
            Canceled
        </v-chip>
        <v-chip color="#8e9394" style="color: white" v-if="item.orderStatus == 5">
            No Show
        </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
            <span v-if="item.id === idToBeProcess">Processing...</span>
            <v-menu transition="slide-x-transition" v-else>
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
                        @click="process(item)"
                    >
                        <v-icon size="16">mdi-clipboard-account-outline</v-icon><v-list-item-title style="font-size: 13px; margin-left: 5px">Process Sale</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-data-table>
</v-card>
</template>

<script>
import { db } from './../../firebase';
export default {
    props: {
        processOrders: Array
    },
    data: () => ({
        search: '',
        expanded: [],
        singleExpand: false,
        headers: [
            {
              text: 'Order #',
              align: 'start',
              sortable: true,
              value: 'restaurantOrderNo',
            },
            { text: 'Delivery Fee', value: 'deliveryFeeSlot' },
            { text: 'Sub Total', value: 'subTotalSlot' },
            { text: 'Grand Total', value: 'grandTotalSlot' },
            { text: 'Payment Method', value: 'modeOfPaymentSlot' },
            { text: 'Order Status', value: 'orderStatusSlot' },
            { text: 'Action', value: 'actions' },
          ],
        orderNotProcessedCount: 0,
        idToBeProcess: null,
        isProcessing: false,
    }),
    methods: {
        async process(item) {
            this.isProcessing = true
            this.idToBeProcess = item.id
            console.log(item.id)
            let orderItems = await db.collection("orders")
            .doc(item.id)
            .collection("order_items")
            .get()

            try {
                for(let orderItem of orderItems.docs) {
                    let restaurantRef = db.collection("restaurants").doc(orderItem.data().restaurantId);
                    let categoryRef = db.collection("categories").doc(orderItem.data().categoryId);
                    let itemRef = db.collection("items").doc(orderItem.data().productId);
                    await db.runTransaction(async (t) => {
                        let restaurants = await t.get(restaurantRef)    
                        let categories = await t.get(categoryRef)
                        let items = await t.get(itemRef)

                        var salesToBeAdded = orderItem.data().variations["price"] * orderItem.data().qty

                        var salesFromResto = restaurants.data().restaurantSales
                        var ctrFromResto = restaurants.data().restaurantCtr
                        ctrFromResto = orderItem.data().qty + ctrFromResto
                        console.log('Sales From Resto ' + salesFromResto);
                        console.log('Counter From Resto ' + ctrFromResto);


                        var salesFromItem = items.data().itemSales
                        var ctrFromItem = items.data().itemCtr
                        ctrFromItem = orderItem.data().qty + ctrFromItem;
                        
                        var salesFromCategory = categories.data().categorySales
                        var ctrFromCategory = categories.data().categoryCtr
                        ctrFromCategory = orderItem.data().qty + ctrFromCategory


                        let itemVar = items.data().variations


                        // GETTING ALL THE VARIATIONS FIRST AND PUSH TO TEMPORARY varArrayToBeUpdated Array before updating items
                        var varArrayToBeUpdated = [];

                        itemVar.forEach((variation) => {
                            varArrayToBeUpdated.push({
                                'ctr' : variation.ctr,
                                'isAvailable' : variation.isAvailable,
                                'name' : variation.name,
                                'price' : variation.price,
                                'sales' : variation.sales,
                            })
                        })


                        varArrayToBeUpdated[orderItem.data().variations['index']]["sales"] += orderItem.data().variations["price"] * orderItem.data().qty
                        varArrayToBeUpdated[orderItem.data().variations['index']]["ctr"] += orderItem.data().qty

                        t.update(itemRef, {
                            itemCtr: ctrFromItem,
                            itemSales: salesFromItem + salesToBeAdded,
                            variations: varArrayToBeUpdated
                        })

                        t.update(categoryRef, {
                            categoryCtr: ctrFromCategory,
                            categorySales: salesFromCategory + salesToBeAdded
                        });
                        
                        t.update(restaurantRef, { 
                            restaurantCtr: ctrFromResto, 
                            restaurantSales: salesFromResto + salesToBeAdded
                        });
                    })
                }
                this.isProcessing = false
                console.log('Transaction success!');
                await db.collection("orders")
                .doc(item.id)
                .update({
                    isProcessed: true
                })
                this.idToBeProcess = null
            } catch (e) {
                console.log('Transaction failure:', e);
            }
        }
    }
}
</script>

<style>

</style>
