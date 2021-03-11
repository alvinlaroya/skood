<template>
  <div>
    <v-card>
      <v-card-title>
        <!--   Daily -->
        Orders
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
        :items="orderData"
        :search="search"
        item-key="id"
        aria-setsize="2px"
        class="elevation-1"
      >
        <template v-slot:item.restaurantSlot="{ item }">
          <span v-for="(resto, r) in restaurants" :key="r">
            <span v-if="resto.id == item.restaurantId">
              {{ resto.name }}
            </span>
          </span>
        </template>
        <template v-slot:item.riderSlot="{ item }">
          <span v-for="(rider, r) in riders" :key="r">
            <span v-if="rider.id == item.assignedDriver">
              {{ rider.firstName }} {{ rider.lastName }}
            </span>
          </span>
        </template>
        <!--         <template v-slot:item.deliveryFeeSlot="{ item }">
        <v-chip color="#036d94" style="color: white; font-weight: 300">
            &#x20b1; {{ (item.deliveryFee).toFixed(2) }}
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
        </template> -->
        <template v-slot:item.orderStatusSlot="{ item }">
          <v-chip
            color="gray"
            style="color: black"
            v-if="item.orderStatus == 0"
          >
            Waiting
          </v-chip>
          <v-chip
            color="orange"
            style="color: white"
            v-if="item.orderStatus == 1 && item.isAccepted == false"
          >
            Pending
          </v-chip>
          <v-chip
            color="pink"
            style="color: white"
            v-if="item.orderStatus == 1 && item.isAccepted == true"
          >
            Pick up Order
          </v-chip>
          <v-chip
            color="#08b0d1"
            style="color: white"
            v-if="item.orderStatus == 2"
          >
            On Deliver
          </v-chip>
          <v-chip
            color="success"
            style="color: white"
            v-if="item.orderStatus == 3"
          >
            Delivered
          </v-chip>
          <v-chip color="red" style="color: white" v-if="item.orderStatus == 4">
            Canceled by Customer
          </v-chip>
          <v-chip color="red" style="color: white" v-if="item.orderStatus == 5">
            Canceled by Resto
          </v-chip>
          <v-chip
            color="#8e9394"
            style="color: white"
            v-if="item.orderStatus == 6"
          >
            No Show
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            v-if="item.isProcessed === true"
            medium
            color="green"
            class="mr-2"
          >
            mdi-check-circle
          </v-icon>
          <v-icon v-else medium class="mr-2"> mdi-timer-sand </v-icon>
        </template>
        <template v-slot:item.dots="{ item }">
          <v-menu transition="slide-x-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on" class="mr-2">
                mdi-dots-vertical
              </v-icon>
            </template>
            <v-list>
              <v-list-item @click="trackOrder(item)">
                <v-icon size="16">mdi-food</v-icon
                ><v-list-item-title style="font-size: 13px; margin-left: 5px"
                  >View Order</v-list-item-title
                >
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="trackRider(item)">
                <v-icon size="16">mdi-account-outline</v-icon
                ><v-list-item-title style="font-size: 13px; margin-left: 5px"
                  >Track Rider</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="trackOrderDialog" persistent max-width="850">
      <v-card class="showOrder" style="overflow: hidden">
        <v-icon
          size="40"
          color="red"
          @click="trackOrderDialog = false"
          style="position: absolute; top: 10px; right: 10px"
        >
          mdi-close
        </v-icon>
        <v-card-title class="headline">{{
          currentOrder.restaurantOrderNo
        }}</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <span v-for="user in customers" :key="user.id">
                <span v-if="currentOrder.userId == user.id">
                  <v-card-text
                    class="animate__animated animate__fadeInUp"
                    style="
                      position: absolute;
                      top: 50px;
                      left: 10px;
                      width: 100%;
                    "
                    ><span style="font-weight: bold">Order From:</span>
                    {{ user.firstName }} {{ user.lastName }}</v-card-text
                  >
                </span>
              </span>
              <v-card-text
                class="animate__animated animate__fadeInUp"
                style="position: absolute; top: 80px; left: 10px; width: 100%"
                ><span style="font-weight: bold">Total Quantity:</span>
                {{ currentOrder.qty }}</v-card-text
              >
              <span v-for="resto in restaurants" :key="resto.id">
                <span v-if="currentOrder.restaurantId == resto.id">
                  <v-card-text
                    class="animate__animated animate__fadeInUp"
                    style="
                      position: absolute;
                      top: 110px;
                      left: 10px;
                      width: 100%;
                    "
                    ><span style="font-weight: bold">Restaurant:</span>
                    {{ resto.name }}</v-card-text
                  >
                </span>
              </span>
              <v-card-text
                class="animate__animated animate__fadeInUp"
                style="position: absolute; top: 140px; left: 10px; width: 100%"
                ><span style="font-weight: bold">Mode Of Payment: </span>
                <span v-if="currentOrder.modeOfPayment == 1">Credit Card</span>
                <span v-else-if="currentOrder.modeOfPayment == 2">Paypal</span>
                <span v-else>COD</span></v-card-text
              >
              <v-card-text
                class="animate__animated animate__fadeInUp"
                style="position: absolute; top: 170px; left: 10px; width: 100%"
                ><span style="font-weight: bold">Address: </span>
                {{ currentOrder.formattedAddress }}</v-card-text
              >
            </v-col>
            <v-col cols="12" lg="6">
                <v-card-text
                class="animate__animated animate__fadeInUp"
                style="margin-top: -35px"
                ><span style="font-weight: bold">Delivery Fee: &#8369;</span>
                {{ currentOrder.deliveryFee }}</v-card-text
              >
              <v-card-text
                class="animate__animated animate__fadeInUp"
                style="margin-top: -23px"
                ><span style="font-weight: bold">Discount: &#8369;</span>
                {{ currentOrder.discount }}</v-card-text
              >
              <v-card-text
                class="animate__animated animate__fadeInUp"
                style="margin-top: -23px"
                ><span style="font-weight: bold">SubTotal: &#8369;</span>
                {{ currentOrder.subTotal }}</v-card-text
              >
              <v-card-text
                class="animate__animated animate__fadeInUp"
                style="margin-top: -23px"
                ><span style="font-weight: bold">GrandTotal: &#8369;</span>
                {{ currentOrder.grandTotal }}</v-card-text
              >
            </v-col>
          </v-row>
          <v-row style="margin-top: 20px">
            <v-col
              cols="12"
              lg="6"
              md="6"
              class="animate__animated animate__fadeInUp"
            >
              <v-list
                two-line
                max-height="500"
                style="overflow: auto"
                class="showOrder"
              >
                <v-list-item-group>
                  <div
                    style="
                      color: #004660;
                      font-size: 11px;
                      font-weight: bold;
                      margin-left: 15px;
                      margin-bottom: 8px;
                    "
                  >
                    <span>Order Item ({{ currentOrderItem.length }})</span>
                  </div>
                  <template
                    v-for="(item, i) in currentOrderItem"
                    style="height: 20px"
                  >
                    <v-list-item
                      :key="i"
                      style="margin-top: 10px; margin-bottom: 10px"
                      inactive
                    >
                      <template>
                        <v-list-item-content style="height: 80px">
                          <v-img
                            class="white--text align-end"
                            height="75px"
                            width="75px"
                            :src="item.imgUrl"
                            style="
                              position: absolute;
                              bottom: 0px;
                              left: 15px;
                              border-radius: 5px;
                            "
                          >
                          </v-img>
                          <v-list-item-title
                            style="
                              font-size: 11px;
                              position: absolute;
                              top: 10px;
                              left: 100px;
                            "
                            ><span style="font-weight: bold">Item:</span>
                            {{ item.itemName }}</v-list-item-title
                          >
                          <v-list-item-subtitle
                            class="text--primary"
                            style="
                              font-size: 11px;
                              position: absolute;
                              top: 25px;
                              left: 100px;
                            "
                            ><span style="font-weight: bold">Order #:</span>
                            {{ item.restaurantOrder }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            class="text--primary"
                            style="
                              font-size: 11px;
                              position: absolute;
                              top: 40px;
                              left: 100px;
                            "
                            ><span style="font-weight: bold">Quantity:</span>
                            {{ item.qty }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            class="text--primary"
                            style="
                              font-size: 11px;
                              position: absolute;
                              top: 55px;
                              right: 5px;
                            "
                            ><span style="font-weight: bold">Price:</span>
                            &#x20b1;{{ item.itemPrice }}</v-list-item-subtitle
                          >
                          <span
                            v-for="(categ, c) in currentOrderCategory"
                            :key="c"
                          >
                            <span v-if="categ.id == item.categoryId">
                              <v-list-item-subtitle
                                class="text--primary"
                                style="
                                  font-size: 11px;
                                  position: absolute;
                                  top: 55px;
                                  left: 100px;
                                "
                              >
                                <span style="font-weight: bold">Category: </span
                                >{{ categ.categoryName }}
                              </v-list-item-subtitle>
                            </span>
                          </span>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              md="6"
              class="animate__animated animate__fadeInUp"
            >
              <v-list
                two-line
                max-height="500"
                style="overflow: auto"
                class="showOrder"
              >
                <v-list-item-group>
                  <div
                    style="
                      color: #004660;
                      font-size: 11px;
                      font-weight: bold;
                      margin-left: 15px;
                      margin-bottom: 8px;
                    "
                  >
                    <span>Driver Details</span>
                  </div>
                  <template
                    style="height: 20px"
                  >
                    <v-list-item
                      style="margin-top: 10px; margin-bottom: 10px"
                      inactive
                    >
                      <template>
                        <v-list-item-content style="height: 80px">
                          <v-img
                            class="white--text align-end"
                            height="75px"
                            width="75px"
                            src="@/assets/img/driver.png"
                            style="
                              position: absolute;
                              bottom: 0px;
                              left: 15px;
                              border-radius: 5px;
                            "
                          >
                          </v-img>
                          <v-list-item-title
                            style="
                              font-size: 11px;
                              position: absolute;
                              top: 10px;
                              left: 100px;
                            "
                            ><span style="font-weight: bold">Name:</span>
                            {{ currentRider.firstName }} {{ currentRider.lastName }}</v-list-item-title
                          >
                          <v-list-item-subtitle
                            class="text--primary"
                            style="
                              font-size: 11px;
                              position: absolute;
                              top: 25px;
                              left: 100px;
                            "
                            ><span style="font-weight: bold">Email:</span>
                            {{ currentRider.email }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            class="text--primary"
                            style="
                              font-size: 11px;
                              position: absolute;
                              top: 40px;
                              left: 100px;
                            "
                            ><span style="font-weight: bold">Contact:</span>
                            {{ currentRider.contactNo }}</v-list-item-subtitle
                          >
                          <span
                            v-for="(categ, c) in currentOrderCategory"
                            :key="c"
                          >
                            <span v-if="categ.id == currentOrder.categoryId">
                              <v-list-item-subtitle
                                class="text--primary"
                                style="
                                  font-size: 11px;
                                  position: absolute;
                                  top: 55px;
                                  left: 100px;
                                "
                              >
                                <span style="font-weight: bold">Category: </span
                                >{{ categ.categoryName }}
                              </v-list-item-subtitle>
                            </span>
                          </span>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "./../../firebase";
export default {
  props: {
    orderData: Array,
    customers: Array,
  },
  data: () => ({
    search: "",
    expanded: [],
    singleExpand: false,
    trackOrderDialog: false,
    headers: [
      { text: "Restaurant Order #", value: "restaurantOrderNo" },
      { text: "Restaurant Name", value: "restaurantSlot" },
      { text: "Assigned Driver", value: "riderSlot" },
      /* {
              text: 'Customer',
              sortable: true,
              value: 'customerSlot',
            },
            
            { text: 'Delivery Fee', value: 'deliveryFeeSlot' },
            { text: 'Grand Total', value: 'grandTotalSlot' },
            { text: 'Payment Method', value: 'modeOfPaymentSlot' }, */
      { text: "Order Status", value: "orderStatusSlot" },
      { text: "Processed", value: "actions" },
      { text: "Actions", value: "dots" },
    ],
    restaurants: [],
    currentOrder: {},
    currentRider: {},
    currentOrderCategory: {},
    currentOrderItem: {},
    riders: [],
  }),
  firestore: {
    restaurants: db.collection("restaurants"),
    riders: db.collection("riders"),
  },
  methods: {
    trackRider(item) {
      this.$router.push({
        name: "TrackRider",
        params: {
          id: item.assignedDriver,
        },
      });
    },
    trackOrder(item) {
      this.currentOrder = item; 
      this.trackOrderDialog = true;
      db.collection("orders").doc(item.id).collection("order_items")
   /*      .where("restaurantId", "==", item.restaurantId)
        .where("restaurantOrder", "==", item.restaurantOrderNo) */
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          querySnapshot.forEach((doc) => {
            arrayItems.push(doc.data());
          });
          this.currentOrderItem = arrayItems;
          console.log(arrayItems)
        });

      db.collection("categories")
        .where("categoryStatus", "==", 1)
        .onSnapshot((querySnapshot) => {
          var arrayItems = [];
          let tempObj = {};
          querySnapshot.forEach((doc) => {
            tempObj = {
              id: doc.id,
              categoryName: doc.data().categoryName,
              tag: doc.data().tag,
            };
            arrayItems.push(tempObj);
          });
          this.currentOrderCategory = arrayItems;
        });

        db.collection('employees').doc(item.assignedDriver).get().then(querySnapshot => {
            this.currentRider = querySnapshot.data();
        });
    },
  },
};
</script>

<style>
</style>