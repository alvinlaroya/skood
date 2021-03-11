<template>
  <v-card class="card">
        <v-card-title>
            Active Rider
        </v-card-title>
        <div style="color: #004660; font-size: 11px; font-weight: bold; margin-left: 15px">
            <v-row>
                <v-col cols="12" lg="4">
                    <span>Online Rider ({{ drivers.length }})</span>
                </v-col>
                <v-col cols="12" lg="4">
                    <span>Available Rider ({{ availableDrivers.length }})</span>
                </v-col>
                <v-col cols="12" lg="4">
                    <span>On-Deliver Rider ({{ onDeliverDrivers.length }})</span>
                </v-col>
            </v-row>
        </div>
        <v-divider></v-divider>
        <v-list two-line max-height="500" style="overflow-y: auto" class="cardList">
            <v-list-item-group
                multiple
                active-class="white"
            >
                <span v-for="driver in drivers" :key="driver.id">
                    <span v-for="user in employees.slice().reverse()" :key="user.id" style="height: 20px">
                        <span v-if="driver.driverId == user.id">
                            <v-list-item inactive style="border-bottom: 1px solid #eee" class="animate__animated animate__flipInX">
                                <template>
                                    <v-list-item-content style="height: 80px;">
                                        <v-img
                                            class="white--text align-end"
                                            height="40px"
                                            width="40px"
                                            src="@/assets/img/driver.png"
                                            style="position: absolute; top: 10px; left: 15px;"
                                        >
                                        </v-img> 
                                        <v-list-item-title style="font-size: 11px; position: absolute; top: 15px; left: 65px; font-weight: bold">{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
                                        <v-list-item-subtitle class="text--primary" style="font-size: 11px; position: absolute; top: 30px; left: 65px;"> {{ user.email }}</v-list-item-subtitle>
                                        <v-list-item-subtitle class="text--primary" style="font-size: 11px; position: absolute; top: 47px; left: 65px;"> {{ user.contactNo }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                        </span>
                    </span>
                </span>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>

<script>
import { db } from '../firebase';
export default {
    data: () => ({
        employees: [],
        drivers: [],
        availableDrivers: [],
        onDeliverDrivers: [],
    }),
    firestore: {
        drivers: db.collection("driver_status").where("isOnline", "==", true),
        availableDrivers: db.collection("driver_status"),
        onDeliverDrivers: db.collection("driver_status"),
    },
    created(){
        db.collection("employees").where("accountType", "==", "Rider")
        .onSnapshot((querySnapshot)=>  {
            var arrayItems = []
            querySnapshot.forEach((doc) => {
                arrayItems.push(doc.data());
            });
            this.employees = arrayItems
        
        });

        this.$bind('availableDrivers', db.collection("driver_status").where("isOnline", "==", true).where("driverStatus", "==", 0));
        this.$bind('onDeliverDrivers', db.collection("driver_status").where("isOnline", "==", true).where("driverStatus", ">=", 1));
    }
}
</script>

<style>
.cardList{
    overflow-x: hidden;
}
</style>