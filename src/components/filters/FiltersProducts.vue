<template>
  <v-app class="ma-n4 w-100 bg-light-green-darken-1">
    <v-container class="mx-2 mt-5 pl-4">
      <h3 class="mb-5">Filtros</h3>
      <v-list-item class="pl-0">
        <v-text-field
          v-model="sku"
          placeholder="Buscar por sku"
          variant="outlined"
          density="compact"
          class="white--text"
          rounded
        ></v-text-field>
      </v-list-item>
      <v-list-item class="pl-0">
        <v-text-field
          v-model="category"
          placeholder="Buscar categoria"
          variant="outlined"
          density="compact"
          class="white--text"
          rounded
        ></v-text-field>
      </v-list-item>
      <v-list-item class="pl-0">
        <v-text-field
          v-model="quantity"
          placeholder="Buscar por quantidade"
          variant="outlined"
          density="compact"
          class="white--text"
          rounded
        ></v-text-field>
      </v-list-item>
      <v-btn @click="applyFilters" color="primary" class="ml-2"
        >Aplicar Filtros</v-btn
      >
    </v-container>
  </v-app>
</template>
<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["apply-filters"]);

const sku = ref("");
const category = ref("");
const quantity = ref("");

// Método para aplicar os filtros
const applyFilters = () => {
  const filters = {};

  if (sku.value.trim() !== "") {
    filters.sku = sku.value;
  }

  if (category.value.trim() !== "") {
    filters.category = category.value;
  }

  if (quantity.value.trim() !== "") {
    filters.quantity = quantity.value;
  }

  // Adicione outros filtros conforme necessário

  console.log('funcionou')
  emit("apply-filters", filters);
};
</script>
