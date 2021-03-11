<template>
    <div>
        <gmap-map ref="mymap" :center="{lat: riderInfo[0].currentLocation.Ra, lng: riderInfo[0].currentLocation.Pa}" :zoom="15" style="width: 100%; height: 800px;" map-type-id="terrain">
          <gmap-marker @click="toggleInfoWIndow(riderInfo[0])" :position="{lat: riderInfo[0].currentLocation.Ra, lng: riderInfo[0].currentLocation.Pa}" :draggable="true" :icon="markerOption" />
            <gmap-info-window
                :options="infoOptions"
                :position="infoWindowPos"
                :opened="true"
                @closeClick="infoWinOpen=false"
            >
                <div v-html="inforContent"></div>
            </gmap-info-window>
        </gmap-map>
           <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <div class="text-center pa-5">
            <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                style="height: 120px; width: 120px; margin: auto; border-radius: 100%"
                :src="currentRiderProfile[0].riderImage"
            ></v-img>
        </div>
         <v-card-title>
            {{currentRiderInfo.firstName}} {{currentRiderInfo.lastName}}
        </v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
/* import * as firebase from 'firebase/app'; */
import { db } from '../firebase'

export default {
    data: () => ({
        center: {
            lat: 0,
            long: 0,
        },
        riderInfo: [{
            currentLocation: {
                Ra: 0,
                Pa: 0
            }
        }],
        currentRiderInfo: {},
        currentRiderProfile: [{
            riderImage: '',
        }],
        dialog: false,
        markerOption: {
        url: 'https://www.seekpng.com/png/full/251-2519834_delivery-rider-delivery-order-png.png',
        size: {width: 90, height: 90, f: 'px', b: 'px',},
        scaledSize: {width: 55, height: 55, f: 'px', b: 'px',},
        },
        inforContent: '',
        infoWindowPos: {
            lat: 0,
            long: 0,
        },
        infoWinOpen: true,
        currentMidx: null,
        infoOptions: {
            pixelOffset: {
                width: 0,
                height: -35
            }
        },

    }),
    firestore: {
        riderInfo: db.collection("driver_status"),
    },
    methods: {
        updateCoordinates(location) {
            console.log(location)
            this.addRestoData.lat = location.latLng.lat()
            this.addRestoData.long = location.latLng.lng()
        },
        toggleInfoWIndow(info) {
            this.dialog = true
            db.collection('riders').doc(info.driverId).get().then(snapshot => {
                this.currentRiderInfo = snapshot.data()
            });
            db.collection("riders").doc(info.driverId).collection("rider_profile")
            .onSnapshot((querySnapshot)=>  {
                var arrayMenu = []
                querySnapshot.forEach((doc) => {
                    arrayMenu.push(doc.data());
                });
                
                this.currentRiderProfile = arrayMenu
            });
        },
        getInfoWindowContent(info) {
            return (`
                <div class="card">
                    <div class="card-image" style>
                    </div>
                    <div class="card-content">
                        <p>${info.driverStatus}</p>
                    </div>
                </div>
            `)
        },
    },
    created(){
        this.$bind(
        "riderInfo",
        db
            .collection("driver_status")
        /*    .where("orderCreated", ">=", this.timeFormat(" 00:00:00"))
            .where("orderCreated", "<=", this.timeFormat(" 23:59:59")) */
            .where("driverId", "==", this.$route.params.id)
        );
    }
}
</script>