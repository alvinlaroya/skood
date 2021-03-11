<template>
    <v-responsive
        v-if="activeChat"
        class="overflow-y-hidden fill-height"
        height="760"
    >
    <v-card
        flat
        class="d-flex flex-column fill-height"
    >
      <v-toolbar
        color="white"
        dark
        fixed
        elevation="0"
      >
         <v-avatar>
                <img
                    :src="selectedChatAvatar"
                    alt="John"
                    height="20"
                >
            </v-avatar>

        <v-toolbar-title style="margin-left: 10px; margin-top: -15px; color: black">{{ selectedChatName }}</v-toolbar-title>

          <v-spacer></v-spacer>
          <h2 style="color: black">{{ selectedProblemCode }}</h2>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto" id="chat-container">
            <template v-for="(msg, i) in messages">
                <div
                  :key="i"
                  :class="{ 'd-flex flex-row-reverse': msg.me }"
                >
                  <span
                    v-if="msg.me == false"
                    style="font-size: 0.6rem; color: black"
                  >
                      {{ msg.sent.toDate() | moment("h:mm a") }}
                  </span><br>
                  <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                          <v-hover
                              v-slot:default="{ hover }"
                          >
                              <v-chip
                                :color="msg.me ? 'primary' : '#004660'"
                                dark
                                style="height:auto;white-space: normal;"
                                class="pa-2 mb-2"
                                :class="msg.me ? 'margin-left' : 'margin-right'"
                                v-on="on"
                              >
                                {{ msg.message }}
                                <span
                                    v-if="hover && msg.me == true"
                                    style="font-size: 0.6rem; color: white; margin-left: 10px"
                                >
                                  {{ msg.sent.toDate() | moment("h:mm a") }}
                                </span>
                                <v-icon
                                    style="margin-left: 10px"
                                    v-if="hover"
                                    small
                                >
                                  mdi-dots-vertical
                                </v-icon>
                              </v-chip>
                          </v-hover>
                      </template>
                      <v-list dense>
                        <v-list-item @click="lang()">
                            <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                          <v-list-item @click="deleteMessage(msg.id, selectedChatHeadId)">
                            <v-list-item-title>delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                  </v-menu>
                </div>
            </template>
        </v-card-text>
        <v-textarea
              v-model="chat.message"
              label="type_a_message"
              append-outer-icon="mdi-send"
              @click:append-outer="sendMessage(selectedChatHeadId, selectedCustomerId)"
              @keyup.enter="sendMessage(selectedChatHeadId, selectedCustomerId)"
              auto-grow
              rows="1"
          >
          </v-textarea>
    </v-card>
    </v-responsive>
</template>

<script>
import * as firebase from "firebase/app";
import { db } from '../../firebase'
export default {
    props: [
        "selectedChatAvatar",
        "selectedChatName",
        "selectedChatHeadId",
        "selectedCustomerId",
        "selectedConvo",
        "selectedProblemCode"
    ],
    data: () => ({
      session: {
        id: '',
        firstName: '',
        lastName: '',
        accountType: '',
        email: '',
        contactNo: '',
      },
      items: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          title: 'Birthday gift',
          subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
        },
      ],
      activeChat: 1,
      chat: {
        message: ''
      },
      messages: [],
      messageLoading: true
    }),
  /*   firestore: {
      messages: db.collection("support_queue"),
    }, */
    methods: {
        lang() {
            console.log(1)
        },
        deleteMessage(message_id, chat_id){
          db.collection("support_queue")
          .doc(chat_id)
          .collection("messages")
          .doc(message_id)
          .delete().then(function() {
            console.log("Document successfully deleted!");
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
        },
        async sendMessage(chatHead_Id, customer_Id){
          var self = this
          console.log("ChatID: " +chatHead_Id+"\nCustomerID: " +customer_Id)
          db.collection("support_queue")
          .doc(chatHead_Id)
          .collection("messages")
          .add({
            supportQueueId: chatHead_Id,
            customerId: customer_Id,
            agentId: this.session.id,
            message: this.chat.message,
            me: true,
            sent: firebase.firestore.Timestamp.fromDate(new Date())
          })
          .then(function() {
            console.log("Document successfully written!");
            self.chat.message = ""
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
          this.message = []
          this.fetchConvo()
        },
        fetchConvo(){
          
          this.messageLoading = true
          console.log("POTANGINA")
          let tempArr = []
          db.collection("support_queue")
          .doc(this.selectedChatHeadId)
          .collection("messages")
          .orderBy("sent")
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              tempArr.push({
                id: doc.id,
                agentId: doc.data().agentId,
                customerId: doc.data().customerId,
                me: doc.data().me,
                message: doc.data().message,
                sent: doc.data().sent,
                supportQueueId: doc.data().supportQueueId
              })
            });
            setTimeout(() => {
              this.messages = tempArr;
            }, 1000)
          });
/* 
          this.$bind(
          'messages',
          db
              .collection('support_queue')
              .doc(this.selectedChatHeadId).collection("messages")
              .orderBy("sent")
          ) */
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
              });
          });
      }
    }
}
</script>

<style>
.sender{
  padding: 20px;
}
.margin-left{
  margin-left: 90px;
}
.margin-right{
  margin-right: 90px;
}
</style>