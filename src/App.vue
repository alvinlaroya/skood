<template>
  <v-app class="grey lighten-4">
    <template>
      <v-main class="app">
      <!--   <Navbar /> -->
        <router-view></router-view>
        <router-view class="view two" name="navbar"></router-view>
        <router-view class="view three" name="sidebar"></router-view>
        <notifications group="foo" position="bottom left" width="400" />
      </v-main>
    </template>
  </v-app>
</template>

<script>
/* import HelloWorld from './components/HelloWorld'; */
/* import Navbar from './components/Navbar'; */
import * as firebase from 'firebase/app';
import 'firebase/auth';


export default {
  created(){
    firebase.auth().onAuthStateChanged(user => {
      this.loggedIn = !!user;
      if(user){
        this.session.userId = user.uid
      } else {
        this.loggedIn = false;
      }

      console.log("SESION ID: "+this.session.userId)
    })
  },
  name: 'App',
  data: () => ({
    loggedIn: null,
    session: {
      userId: null
    }
  }),
  components: {
    /* 'navbar': Navbar, */
  },
};

</script>


<style>
  .app {
    background-color: #f1f5f5;
  }

</style>
