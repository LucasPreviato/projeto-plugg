<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" sm="8">
            <Dashboard />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Dashboard from "@/components/dashboard/Dashboard.vue";
export default {
  name: "Home",
  components: {
    Dashboard,
  },
};
</script>
