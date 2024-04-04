<template>
  <v-app class="">
    <v-container class="ml-3 px-3">
      <v-row class="">
        <v-col cols="2" class="d-flex pl-0 ml-0">
          <FiltersProducts />
        </v-col>
        <v-col cols="10" class="pl-0 ml-0">
          <v-data-table
            density="compact"
            :loading="isLoading"
            :headers="headers"
            :items="products.result"
            :sort-by="[{ key: 'calories', order: 'asc' }]"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Catalogo de Produtos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      class="mb-2"
                      :color="theme.current.value.colors.secondary"
                      dark
                      v-bind="props"
                    >
                      Novo Produto
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="4" sm="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Nome do produto"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <v-text-field
                              v-model="editedItem.price"
                              label="Preço"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <v-text-field
                              v-model="editedItem.quantity"
                              label="Quantidade"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green-darken-1"
                        variant="text"
                        @click="close"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="green-darken-1"
                        variant="text"
                        @click="save"
                      >
                        Salvar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5"
                      >Gostaria mesmo de deletar este produto</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green-darken-1"
                        variant="text"
                        @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="green-darken-1"
                        variant="text"
                        @click="deleteItemConfirm"
                        >Confirmar</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon class="me-2" size="small" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                size="small"
                :color="theme.current.value.colors.error"
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary"> Reset </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import FiltersProducts from "@/components/filters/FiltersProducts.vue";
import { useTheme } from "vuetify";

import axios from "axios";

const theme = useTheme();
const isLoadging = ref(false);
const products = ref({ total: 0, showing: 0, result: [] });
const isLoading = ref(false);
const lastPluggtoId = ref(null);
const accessToken = "e3abf430a0f57cf40b3d8f0eed3a9960de49e673";

// cabeçalho da tabela
const headers = [
  {
    title: "Sku",
    align: "start",
    sortable: false,
    value: "Product.sku",
  },
  { title: "Nome", value: "Product.name" },
  { title: "Preço", value: "Product.price" },
  { title: "Estoque", value: "Product.quantity" },
  { title: "Acões", value: "actions" },
  { title: "Variações", value: "", sortable: false },
];
// fetch products, responsavel pelos dados da tabela 
const fetchProducts = async () => {
  isLoading.value = true;

  let url;
  if (lastPluggtoId.value) {
    url = `https://api.plugg.to/products?next=${lastPluggtoId.value}&limit=100`;
  } else {
    url = "https://api.plugg.to/products";
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    const responseData = response.data;
    console.log("Produtos da API:", responseData);

    // Se houver próxima página, atualize lastPluggtoId
    if (responseData.next) {
      lastPluggtoId.value = responseData.next;
    }

    // Atualize os produtos
    products.value = {
      total: responseData.total,
      showing: responseData.result.length,
      result: responseData.result,
    };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  } finally {
    isLoading.value = false;
  }
};

const dialog = ref(false);
const dialogDelete = ref(false);


const editedIndex = ref(-1);
const editedItem = ref({
  name: "",
  price: 0,
  quantity: 0,
});
const defaultItem = {
  name: "",
  calories: 0,
  fat: 0,
  carbs: 0,
  protein: 0,
};

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Novo Produto" : "Editar Produto";
});

onMounted(() => {
  fetchProducts();
});


const editItem = (item) => {
  const index = products.value.result.findIndex(product => product.sku === item.sku);
  if (index !== -1) {
    editedIndex.value = index;
    // Copiar os valores do item atual para o editedItem
    editedItem.value = { ...products.value.result[index] };
    dialog.value = true;
  }
};


const deleteItem = (item) => {
  editedIndex.value = products.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  products.value.splice(editedIndex.value, 1);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  }, 100);
};

const closeDelete = () => {
  dialogDelete.value = false;
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  }, 100);
};

const save = async () => {
  if (editedIndex.value > -1) {
    Object.assign(products.value.result[index], editedItem.value);
  } else {
    products.value.push({ ...editedItem.value });
  }
  close();

  // Envie as alterações para a API
  try {
    const response = await axios.put(`https://api.plugg.to/products/${editedItem.value.sku}`, editedItem.value, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.status === 200) {
      // Atualizar a interface do usuário ou exibir uma mensagem de sucesso
      console.log("Alterações salvas com sucesso!");
    } else {
      // Exibir mensagem de erro para o usuário
      console.error("Erro ao salvar as alterações:", response.data.message);
    }
  } catch (error) {
    console.error("Erro ao salvar as alterações:", error);
  }
               
};
</script>

<style></style>
