<template>
  <div class="travel">
     <v-breadcrumbs :items="BreadCrumbs"></v-breadcrumbs>
     <v-container>
         <v-row>
             <v-col 
                cols="12" 
                lg="3"
            >
                 <v-card
                    class="mt-6 mx-auto" 
                    style="box-shadow: none"
                    max-width="400"
                >
                    <v-sheet
                    class="v-sheet--offset card-header"
                    color="cyan"
                    elevation="5"
                    max-width="calc(100% - 32px)"
                    >
                        <v-icon style="font-size: 70px;" color="white">mdi-train-car</v-icon>
                    </v-sheet>
                    <v-card-text class="pt-0">
                    <div class="title font-weight-light mb-2" style="position: absolute; top: 20px; right: 20px">Travel</div>
                    <span style="font-size: 40px; position: absolute; top: 70px; right: 20px;">24</span>
                    <div class="subheading font-weight-light grey--text">Travel Description</div>
                    </v-card-text>
                </v-card>
                <v-card
                    class="mt-6 mx-auto" 
                    style="box-shadow: none"
                    max-width="400"
                >
                    <v-sheet
                    class="v-sheet--offset card-header"
                    color="cyan"
                    elevation="5"
                    max-width="calc(100% - 32px)"
                    >
                        <v-icon style="font-size: 70px;" color="white">mdi-train-car</v-icon>
                    </v-sheet>
                    <v-card-text class="pt-0">
                    <div class="title font-weight-light mb-2" style="position: absolute; top: 20px; right: 20px">Travels</div>
                    <span style="font-size: 40px; position: absolute; top: 70px; right: 20px;">24</span>
                    <div class="subheading font-weight-light grey--text">Travel Description</div>
                    </v-card-text>
                </v-card>
             </v-col>
             <v-col cols="12" lg="9">
                  <v-card class="mt-6 mx-auto" 
                    style="box-shadow: none">
                       <v-sheet
                            class="v-sheet--offset card-header"
                            color="cyan"
                            elevation="5"
                            max-width="calc(100% - 32px)"
                        >
                            <v-icon style="font-size: 70px;" color="white">mdi-format-list-bulleted</v-icon>
                        </v-sheet>
                        <v-card-title>
                             <v-btn 
                                color="primary"
                                @click="addDialog = true"
                            >
                                Add Record
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                style="max-width: 420px"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-card-title>
                        <v-data-table
                        :headers="headers"
                        :items="records.slice().reverse()"
                        :search="search"
                        ></v-data-table>
                    </v-card>
              </v-col>
         </v-row>
     </v-container>
     <v-container>
         <v-dialog
            v-model="addDialog"
            max-width="500px"
         >
            <v-card>
            <v-card-title>
                Add Vehicle
            </v-card-title>
            <v-card-text>
                <v-text-field
                    clearable
                    v-model="record.name"
                    label="Name Of Driver"
                ></v-text-field>
                <v-text-field
                    clearable
                    v-model="record.contact"
                    hint="09381234567"
                    label="Contact"
                ></v-text-field>
                <v-select
                    v-model="record.vehicleType"
                    :items="vehicles"
                    label="A Select List"
                    item-value="text"
                ></v-select>
                <v-text-field
                 v-model="record.plateNo"
                    clearable
                    label="Plate No."
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="grey darken-1"
                    text
                    @click="addDialog = false"
                >
                    Cancel
                </v-btn>

                <v-btn
                    color="green darken-1"
                    text
                    @click="saveChanges"
                >
                    Save Changes
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
            v-model="addSnackbar"
            color="success"
        >
        Record saved!

        <template v-slot:action="{ attrs }">
            <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="addSnackbar = false"
            >
            Close
            </v-btn>
        </template>
        </v-snackbar>
     </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
/* import Navbar from '@/components/Navbar.vue' */
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

export default {
  name: 'Travel',
  components: {
    //
  },
  data: () => ({
    BreadCrumbs: [
        {
            text: 'Categories',
            disabled: false,
            href: '/others/categories',
        },
        {
            text: 'Travel',
            disabled: true,
            href: '/categories/travel',
        },
    ],
    record: {
        name: null,
        contact: null,
        vehicleType: null,
        plateNo: null,
    },
    records: [],
    addDialog: false,
    addSnackbar: false,
    vehicles: ["Taxi", "Bus", "Train", "Truck", "Jeep", "Tricycle", "Tuck-Tuck"],
    search: '',
        headers: [
          {
            text: 'Name Of Driver',
            align: 'start',
            sortable: false,
            value: 'driverName',
          },
          { text: 'Vehicle Type', value: 'vehicleType' },
          { text: 'Contact Number', value: 'contact' },
          { text: 'Plate Number', value: 'plateNo' },
        ],
  }),
  methods: {
      saveChanges(){
           var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ' ' + today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let dateId = new Date();
            let timeId = dateId.getTime();
            let counter = timeId;

            const travelData = {
                driverName: this.record.name,
                contact: this.record.contact,
                createdAt: time,
                vehicleType: this.record.vehicleType,
                plateNo: this.record.plateNo
            }

            let db = firebase.database().ref("travel/" + counter);
            db.set(travelData);

            this.addSnackbar = true 
            this.addDialog = false
      },
  },
  created(){
        var traveldb = firebase.database().ref("travel/");
        var travelsdb = [];

        traveldb.on("child_added", function(data){
            var newsValue = data.val();
          
            travelsdb.push(newsValue);
        });
        this.records = travelsdb;
    },
}
</script>

<style>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
  .card-header{
      padding: 20px;
      width: 110px;
      height: 110px;
      margin-left: 15px;
  }
</style>
