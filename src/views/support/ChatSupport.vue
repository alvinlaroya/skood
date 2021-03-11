<template>
  <v-container class="fill-height pa-0" style="background-color: white" fluid>
    <v-row class="no-gutters" style="background-color: white">
      <v-col
        cols="12" xs="12" sm="3" md="3" lg="3" xl="3"
        class="flex-grow-1 flex-shrink-0"
        style="border-right: 1px solid #0000001f; height: calc(100vh - 40px)"
      >
        <v-responsive class="overflow-y-auto fill-height">
          <v-toolbar color="cyan" dark fixed>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>Inbox</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list three-line>
            <v-list-item-group active-class="pink--text">
              <template v-for="(item, index) in items">
                <v-subheader
                  v-if="item.header"
                  :key="item.header"
                  v-text="item.header"
                ></v-subheader>

                <v-divider
                  v-else-if="item.divider"
                  :key="index"
                  :inset="item.inset"
                ></v-divider>

                <v-list-item
                  :disabled="item.isLegitComplaint < 2 ? true : (item.agentId !== '' && item.agentId !== session.id) ? true : false"
                  style="transition: 0.1s ease"
                  v-else
                  :key="item.id"
                  @click="selectedChatHead(item, index)"
                  :class="[
                    { pointer: item.isLegitComplaint < 2 },
                    { read: item.isOpened },
                    { unread: !item.isOpened },
                    [
                      index === selectedIndex
                        ? 'selectedChat'
                        : 'notSelectedChat',
                    ],
                  ]"
                >
                  <v-list-item-avatar>
                    <v-img
                      :src="item.avatar"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      :class="[
                        item.isOpened ? 'read' : 'unread',
                        { legit: item.isLegitComplaint === 1 },
                        { notLegit: item.isLegitComplaint === 0 },
                      ]"
                    >
                      <span
                        :class="[
                          { hasAgent: item.agentId !== '' && item.agentId !== session.id},
                        ]"
                      >
                        {{item.isLegitComplaint === 1 ? "(Tagged)" : item.isLegitComplaint === 0 ? "(Rejected)" : (item.agentId !== '' && item.agentId !== session.id) ? "(Has Agent)" : ""}}
                      </span>
                      {{
                        item.problemCode == "101"
                          ? "Missing Order"
                          : item.problemCode == "102"
                          ? "Delayed Order"
                          : item.problemCode == "103"
                          ? "Food Packaging is unpleasant"
                          : item.problemCode == "104"
                          ? "Wrong Order"
                          : item.problemCode == "105"
                          ? "Cold/Warm Food"
                          : "Stale Food"
                      }}</v-list-item-title
                    >
                    <v-list-item-subtitle>
                        <template v-for="(user, index) in customers">
                          <div :key="index">
                            <span v-if="user.id === item.customerId">
                              <!-- <v-skeleton-loader
                                class="mx-auto"
                                type="text"
                                v-if="user.firstName === null"
                              ></v-skeleton-loader> -->
                              {{ user.firstName }}
                              {{ user.lastName }}
                            </span>
                          </div>
                        </template>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle style="font-size: 11px">{{
                      item.requestedAt.toDate()
                        | moment("MMMM DD, YYYY (h:mm:ss a)")
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-responsive>
      </v-col>
      <v-col
        cols="12" xs="12" sm="6" md="6" lg="6" xl="6"
        class="flex-grow-1 flex-shrink-0"
        style="border-right: 1px solid #0000001f"
      >
        <v-responsive v-if="activeChat">
          <v-card flat class="d-flex flex-column center-panel">
            <v-toolbar color="white" dark fixed elevation="0">
              <v-avatar width="48">
                <img :src="items[selectedIndex].avatar" alt="John" />
              </v-avatar>
              <template v-for="(user, u) in customers">
                <v-toolbar-title
                  :key="u"
                  v-if="user.id === items[selectedIndex].customerId"
                  style="margin-left: 10px; margin-top: -15px; color: black"
                  >{{ user.firstName }}
                  {{ user.lastName }}</v-toolbar-title
                >
              </template>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text
              class="flex-grow-1 overflow-y-auto"
              id="chat-container"
              v-chat-scroll
            >
              <template v-for="(msg, i) in messages">
                <div :key="i" :class="{ 'd-flex flex-row-reverse': msg.me }">
                  <span
                    v-if="msg.me == false"
                    style="font-size: 0.6rem; color: black"
                  >
                    {{ msg.sent.toDate() | moment("h:mm a") }} </span
                  ><br />
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-hover v-slot:default="{ hover }">
                        <v-chip
                          :color="msg.me ? 'primary' : '#004660'"
                          dark
                          style="height: auto; white-space: normal"
                          class="pa-2 mb-2"
                          :class="msg.me ? 'margin-left' : 'margin-right'"
                          v-on="on"
                        >
                          {{ msg.message }}
                          <span
                            v-if="hover && msg.me == true"
                            style="
                              font-size: 0.6rem;
                              color: white;
                              margin-left: 10px;
                            "
                          >
                            {{ msg.sent.toDate() | moment("h:mm a") }}
                          </span>
                          <v-icon style="margin-left: 10px" v-if="hover && msg.me == true" small>
                            mdi-dots-vertical
                          </v-icon>
                        </v-chip>
                      </v-hover>
                    </template>
                    <v-list dense>
                      <!--  <v-list-item @click="lang()">
                                <v-list-item-title>Edit</v-list-item-title>
                            </v-list-item> -->
                      <v-list-item
                        @click="deleteMessage(msg.id, selectedChatHeadId)"
                      >
                        <v-list-item-title>delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-card-text>
            <div style="width: 100%; height: 60px">
              <v-textarea
                style="padding: 5px; border-radius: 0"
                solo
                rows="1"
                draggable="false"
                color="#004660"
                background-color="white"
                v-model="chat.message"
                label="Type a message"
                append-icon="mdi-send"
                @click:append="
                  sendMessage(selectedChatHeadId, selectedCustomerId)
                "
                @keyup.enter="
                  sendMessage(selectedChatHeadId, selectedCustomerId)
                "
              >
              </v-textarea>
            </div>
          </v-card>
        </v-responsive>
      </v-col>
      <v-col
        cols="12" xs="12" sm="3" md="3" lg="3" xl="3"
        class="flex-grow-1 flex-shrink-0 text-center"
        style="
          border-left: 1px solid #0000001f;
          overflow-y: auto;
          height: calc(100vh - 40px);
        "
      >
        <img
          :src="items[selectedIndex].avatar"
          alt="John"
          width="120"
          style="border-radius: 50%; margin-top: 20px"
        />
        <h3>
          {{ items[selectedIndex].customerFname }}
          {{ items[selectedIndex].customerLname }}
        </h3>
        <v-list
          two-line
          max-height="500"
          style="overflow: auto; margin-top: 10px"
          class="showOrder"
        >
          <v-list-item-group>
            <div
              class="text-left"
              style="
                color: #004660;
                font-size: 11px;
                font-weight: bold;
                margin-left: 15px;
                margin-bottom: 8px;
              "
            >
              <span
                >Restaurant Order No:
                {{ items[selectedIndex].orderNumber }}</span
              ><br />
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
                      elevation="10"
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
                      {{ item.orderNo }}</v-list-item-subtitle
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
                        left: 100px;
                      "
                      ><span style="font-weight: bold">Order Creatd:</span>
                      {{
                        item.orderCreated.toDate()
                          | moment("MMM-DD-YYYY h:mm:ss a")
                      }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
        <div class="text-left pa-3">
          <span
            ><span style="font-weight: bold">Total of Order:</span> &#x20b1;
            {{ currentOrderTotal }}</span
          ><br />
          <span
            ><span style="font-weight: bold">Reason of Complainant:</span>
            {{
              problemCode == "101"
                ? "Missing Order"
                : problemCode == "102"
                ? "Delayed Order"
                : problemCode == "103"
                ? "Food Packaging is unpleasant"
                : problemCode == "104"
                ? "Wrong Order"
                : problemCode == "105"
                ? "Cold/Warm Food"
                : "Stale Food"
            }} </span
          ><br />
          <span
            ><span style="font-weight: bold">Penalty Percentage: </span>
            {{
              problemCode == "101"
                ? "- 50% of the Total Value of Order"
                : problemCode == "102"
                ? "(- 5% / 10mins. delay) (- 10% / 10mins. delay) of the Total Value of Order"
                : "No Percentage"
            }} </span
          ><br />
          <span
            ><span style="font-weight: bold">Deduction Value: </span> &#x20b1;
            {{ currentOrderTotal * 0.5 }}</span
          ><br />
        </div>
        <v-container fluid>
          <v-row class="no-gutters">
            <v-col cols="12" xs="12" sm="7" md="7" lg="7" xl="7">
              <v-btn
                color="success"
                block
                style="border-radius: 0"
                @click="tagPenalty()"
              >
                <v-icon left>
                  mdi-bookmark-check-outline
                </v-icon>
                Tag Penalty
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="5" md="5" lg="5" xl="5">
              <v-btn
                color="error"
                block
                style="border-radius: 0"
                @click="rejectPenalty()"
              >
                <v-icon left>
                  mdi-text-box-remove-outline
                </v-icon>
                Reject
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app";
import { db } from "../../firebase";

export default {
  components: {},
  data: () => ({
    currentUser: [],
    selectedChatHeadId: "",
    selectedChatAvatar: "",
    selectedChatName: "",
    selectedCustomerId: "",
    selectedProblemCode: "",
    selectedOrderNo: "",
    selectedOrders: [],
    problemCode: "101",
    currentOrderItem: [],
    selectedIndex: 0,
    items: [{ header: "Today" }],
    activeChat: 1,
    chat: {
      message: "",
    },
    messages: [],
    customers: [],
    session: {
      id: "",
      firstName: "",
      lastName: "",
      accountType: "",
      email: "",
      contactNo: "",
    },
    messageLoading: true,
    selectedAvatar: "",
    selectedName: "",
    messageForm: {
      content: "",
      me: true,
      created_at: "11:11am",
    },
    currentOrderTotal: 0,
    currentOrderProblemCode: "",
    currentOrderDeducted: 0,
  }),
  firestore: {
    customers: db.collection("customers"),
  },
  methods: {
    lang() {
      console.log(1);
    },
    tagPenalty() {
      this.$swal
      .fire({
        title: "Are you sure?",
        text: "You want to tag a penalty from this customer complaint?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, tag it!",
      })
      .then((result) => {
        if (result.value) {
          db.collection("support_queue").doc(this.selectedChatHeadId).update({
            isLegitComplaint: 1,
            penalty: this.currentOrderTotal * 0.5
          });
          this.$swal.fire(
            "Penalty Tagged!",
            "Penalty for this customer's order has been tagged!",
            "success"
          );
        }
      });
    },
    rejectPenalty() {
      this.$swal
      .fire({
        title: "Are you sure?",
        text: "You want to reject this customer complaint?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reject it!",
      })
      .then((result) => {
        if (result.value) {
          db.collection("support_queue").doc(this.selectedChatHeadId).update({
            isLegitComplaint: 0,
          });
          this.$swal.fire(
            "Rejected!",
            "Customer complaint has been rejected.",
            "success"
          );
        }
      });
    },
    deleteMessage(message_id, chat_id) {
      db.collection("support_queue")
        .doc(chat_id)
        .collection("messages")
        .doc(message_id)
        .delete()
        .then(function () {
          console.log("Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    },
    async sendMessage(chatHead_Id, customer_Id) {
      var self = this;
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;
      console.log("ChatID: " + chatHead_Id + "\nCustomerID: " + customer_Id);
      db.collection("support_queue")
        .doc(chatHead_Id)
        .collection("messages")
        .add({
          supportQueueId: chatHead_Id,
          customerId: customer_Id,
          agentId: this.session.id,
          message: this.chat.message,
          me: true,
          sent: timestamp(),
        })
        .then(function () {
          console.log("Document successfully written!");
          self.chat.message = "";
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    },
    fetchConvo() {
      const unsubscribe = db
        .collection("support_queue")
        .doc(this.selectedChatHeadId)
        .collection("messages")
        .orderBy("sent")
        .onSnapshot((querySnapshot) => {
          const convos = querySnapshot.docs.map((documentSnapshot) => {
            return {
              id: documentSnapshot.id,
              // give defaults
              agentId: "",
              customerId: "",
              me: "",
              message: "",
              sent: "",
              supportQueueId: "",
              ...documentSnapshot.data(),
            };
          });

          this.messages = convos;
        });

      /**
       * unsubscribe listener
       */
      return () => unsubscribe();
    },
    fetchOrder() {
      let tempArr = [];
      var self = this;
      this.currentOrderTotal = 0;
      db.collection("orders")
        .where("restaurantOrderNo", "==", this.selectedOrderNo)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            db.collection("orders")
              .doc(doc.id)
              .collection("order_items")
              .onSnapshot((querySnapshot1) => {
                querySnapshot1.forEach((doc1) => {
                  tempArr.push(doc1.data());
                  self.currentOrderTotal +=
                    doc1.data().itemPrice * doc1.data().qty;
                });
              });
            this.currentOrderItem = tempArr;
          });
        });
    },
    async selectedChatHead(item, index) {
      console.log(item);
      db.collection("support_queue").doc(item.id).update({
        agentId: this.currentUser.uid,
        isOpened: true,
        isLegitComplaint: 2,
      });
      this.selectedChatHeadId = item.id;
      this.selectedChatAvatar = item.avatar;
      this.selectedChatName = `${item.customerFname} ${item.customerLname}`;
      this.problemCode = item.problemCode;
      this.selectedOrderNo = item.orderNumber;
      console.log("ORDER: " + this.selectedOrderNo);
      this.selectedIndex = index;
      this.fetchConvo();
      this.fetchOrder();
    },
  },
  created() {
    db.collection("support_queue")
    .orderBy("requestedAt")
    .onSnapshot((querySnapshot) => {
      const tempArr = querySnapshot.docs.map((documentSnapshot) => {
        return {
          id: documentSnapshot.id,
          customerId: "",
          agentId: "",
          orderNumber: "",
          problemCode: "",
          requestedAt: "",
          restaurantId: "",
          isOpened: false,
          isLegitComplaint: false,
          avatar:
            "https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png",
          
          ...documentSnapshot.data(),
        };
      });

      this.items = tempArr;
    });

    var user = firebase.auth().currentUser;
    this.currentUser = user;

    if (user != null) {
      db.collection("employees")
        .where("id", "==", user.uid)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.session.id = doc.id;
            this.session.firstName = doc.data().firstName;
            this.session.lastName = doc.data().lastName;
            this.session.accountType = doc.data().accountType;
            this.session.email = doc.data().email;
            this.session.contactNo = doc.data().contactNo;
          });
        });
    }
  },
};
</script>
<style>
html,
body {
  margin: 0px;
  height: 100%;
}

.margin-left {
  margin-left: 50px;
}
.margin-right {
  margin-right: 50px;
}

.center-panel {
  height: calc(100vh - 40px);
}

.read {
  color: black;
}

.unread {
  background-color: powderblue;
  color: rgb(248, 95, 120);
}

.selectedChat {
  border-left: 4px solid #004660;
}

.chat_convoShow {
  display: inline;
}
.chat_convoHide {
  display: none;
}

.legit {
  color: green;
}
.notLegit {
  color: red;
}

.hasAgent {
  color: orange;
}

.pointer {
  cursor: not-allowed;
  background-color: #eee;
}
/* .theme--light.v-input:not(.v-textare--is-disabled) textarea{
  color:#fff;
} */
</style>