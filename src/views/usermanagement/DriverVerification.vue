<template>
  <div class="driververification">
   <v-breadcrumbs :items="items"></v-breadcrumbs>
    <v-container>
        <v-row>
            <v-col
                cols="12"
                md="3"
                lg="3"
            >
                <v-card
                    class="mx-auto"
                    max-width="344"
                    outlined
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">OVERLINE</div>
                        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                        color="grey"
                    ></v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col
                cols="12"
                md="3"
                lg="3"
            >
                <v-card
                    class="mx-auto"
                    max-width="344"
                    outlined
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">OVERLINE</div>
                        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                        color="grey"
                    ></v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col
                cols="12"
                md="3"
                lg="3"
            >
                <v-card
                    class="mx-auto"
                    max-width="344"
                    outlined
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">OVERLINE</div>
                        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                        color="grey"
                    ></v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col><v-col
                cols="12"
                md="3"
                lg="3"
            >
                <v-card
                    class="mx-auto"
                    max-width="344"
                    outlined
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">OVERLINE</div>
                        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                        color="grey"
                    ></v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <h1>hey</h1>
                    <h1>hey</h1>
                    <h1>hey</h1>
                    <h1>hey</h1>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <h1>hey</h1>
                    <h1>hey</h1>
                    <h1>hey</h1>
                    <h1>hey</h1>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <h1>hey</h1>
                    <h1>hey</h1>
                    <h1>hey</h1>
                    <h1>hey</h1>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */

export default {
  name: 'DriverVerification',
  components: {
    //
  },
  data: () => ({
      items: [
        {
            text: 'User Management',
            disabled: false,
            href: '/dashboard/driver_verification',
        },
        {
            text: 'Driver Verification',
            disabled: true,
            href: '/dashboard/driver_verification',
        },
      ],
    }),
}
</script>

<style scoped>
.body{
    background-color: black;
}
</style>
