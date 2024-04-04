<template>
  <v-app class="ma-n4 bg-light-green-darken-1">
    <v-container class="mx-2 mt-5 pl-4">
      <h4 class="mb-5">Filtros</h4>
      <v-list-item class="pl-0">
        <v-text-field
          append-inner-icon="mdi-magnify"
          rounded
          placeholder="Buscar sku"
          density="compact"
          variant="outlined"
          class="white--text"
        ></v-text-field>
      </v-list-item>
      <v-list-item class="pl-0">
        <v-text-field
          append-inner-icon="mdi-magnify"
          density="compact"
          placeholder="Categoria"
          variant="outlined"
          rounded
          class="text-white"
        ></v-text-field>
      </v-list-item>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

</script>
