<template>
  <div class="myaccount">
      <v-container>
          <v-row>
              <v-col cols="12" lg="3" v-for="(load, l) in loader" :key="l">
                <v-sheet
                    :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                    class=""
                >
                    <v-skeleton-loader
                    type="card, article, actions"
                    ></v-skeleton-loader>
                </v-sheet>
            </v-col>
          </v-row>
      </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */

export default {
  name: 'MyAccount',
  inject: ['theme'],
  components: {
    //
  },
  data: () => ({
      loader: 12,
  }),
}
</script>
