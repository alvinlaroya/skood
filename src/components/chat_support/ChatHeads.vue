<template>
  <v-responsive
      class="overflow-y-auto fill-height"
      height="760"
    >
      <v-list three-line>
        <span>{{ items[0].orderNumber }}</span>
        <v-list-item-group
          active-class="pink--text"
        >
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
              class="pink--text"
              v-else
              :key="item.id"
              @click="selectedChatHead(item)"
              color="red"
              
            >
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.problemCode == 101 ? "My order is missing" : "My order is delay"}}</v-list-item-title>
                <v-list-item-subtitle>{{ item.customerFname }} {{ item.customerLname }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ item.customerEmail }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
        </v-list>
    </v-responsive>
  <!-- <v-navigation-drawer style="width: 100%">
        <v-toolbar
          color="cyan"
          dark
        >
          <v-app-bar-nav-icon></v-app-bar-nav-icon>

          <v-toolbar-title>Inbox</v-toolbar-title>

            <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list three-line>
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
              v-else
              :key="item.title"
              @click="selectedChatHead(item)"
            >
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="item.name"></v-list-item-title>
                <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer> -->
</template>

<script>
/* import * as firebase from "firebase/app"; */
/* import { db } from '../../firebase' */
/* const current = firebase.auth().currentUser */
export default {
    data: () => ({
      selectedAvatar: '',
      selectedName: '',
      activeChat: 1,
      messageForm: {
        content: "",
        me: true,
        created_at: "11:11am"
      },
    }),
    props: [
      "items",
    ],
    methods: {
        async selectedChatHead(item) {
          console.log(item.id)
        /*   db.collection("support_queue").doc(item.id).update({
            agentId: current.uid,
            isOpened: true
          }) */

          this.$emit("select-chat-head")

          var fullname = `${item.customerFname} ${item.customerLname}`
          this.$emit("child-avatar", item.id, item.customerId, item.avatar, fullname, item.problemCode);
        }
    },
    computed:{
      /* indexArray: function(){
        return 
      } */
    }
}
</script>

<style>
</style>