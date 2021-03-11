<template>
  <div class="myaccount">
      <v-sheet
            :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
            class=""
        >
            <v-skeleton-loader
                height="200"
                type="image"
            ></v-skeleton-loader>
        </v-sheet>
      <v-container>
          <v-row>
              <v-col cols="12" lg="12">
                    <v-skeleton-loader
                        height="50"
                        type="heading"
                    ></v-skeleton-loader>
                     <v-skeleton-loader
                        height="50"
                        type="heading"
                    ></v-skeleton-loader>
                    <v-skeleton-loader
                        type="paragraph"
                    ></v-skeleton-loader>
            </v-col>
          </v-row>
          <v-row>
              <v-col cols="12" lg="8">
                  <v-container>
                       <div style="width: 150px;">
                           <v-skeleton-loader
                                type="text"
                            ></v-skeleton-loader>
                       </div>
                      <v-row>
                          <v-col cols="12" lg="6" xl="4" v-for="(menu, m) in menus" :key="m">
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
              </v-col>
              <v-col cols="12" lg="4">
                  <v-container>
                      <div style="width: 150px;">
                           <v-skeleton-loader
                                type="text"
                            ></v-skeleton-loader>
                       </div>
                      <v-row>
                          <v-col cols="12">
                              <v-sheet
                                    :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                                    class=""
                                >
                                    <v-skeleton-loader
                                    type="list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
                                    ></v-skeleton-loader>
                                </v-sheet>
                          </v-col>
                      </v-row>
                  </v-container>
                  <v-container>
                      <div style="width: 150px;">
                           <v-skeleton-loader
                                type="text"
                            ></v-skeleton-loader>
                       </div>
                      <v-row>
                          <v-col cols="12">
                              <v-sheet
                                    :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                                    class=""
                                >
                                    <v-skeleton-loader
                                    type="list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
                                    ></v-skeleton-loader>
                                </v-sheet>
                          </v-col>
                      </v-row>
                  </v-container>
              </v-col>
          </v-row>
      </v-container>
      <!-- <v-container>
          <v-row>
              <v-col cols="12" lg="12" v-for="(load, l) in loader" :key="l">
                <v-sheet
                    :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                    class=""
                >
                    <v-skeleton-loader
                    type="image"
                    ></v-skeleton-loader>
                </v-sheet>
            </v-col>
          </v-row>
      </v-container> -->
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
      menus: 9,
  }),
}
</script>
