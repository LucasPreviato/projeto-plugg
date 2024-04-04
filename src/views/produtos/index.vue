<template>
  <v-app class="">
    <v-container class="ml-3 px-3">
      <v-row class="">
        <v-col cols="2" class="d-flex pl-0 ml-0">
          <FiltersProducts @apply-filters="applyFilters" />
        </v-col>
        <v-col cols="10" class="pl-0 ml-0">
          <v-data-table
            :loading="isLoading"
            :headers="headers"
            :items="products.result"
            density="compact"
            show-expand
          >
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length">
                  <v-data-table
                    :headers="variationHeaders"
                    :items="item.Product.variations"
                    :loading="isLoading"
                    item-key="id"
                    hide-default-footer
                  ></v-data-table>
                </td>
              </tr>
            </template>
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
const products = ref({ total: 0, showing: 0, result: [] });
const isLoading = ref(false);
const lastPluggtoId = ref(null);
const accessToken = "14e1e5d876dc920641346362c49a0d3cfc802474";

// Cabeçalho da tabela
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
  { title: "Ações", value: "actions" },
  {
    title: "Variações",
    value: "data-table-expand",
    align: "center",
    sortable: false,
  },
];
const variationHeaders = [
  { title: "SKU", value: "sku", align: "start", sortable: false },
  { title: "Nome", value: "name" },
  { title: "Preço", value: "price" },
  { title: "Quantidade", value: "quantity" },
  { title: "Ações", value: "actions" },
];

// Método para buscar os produtos
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

// Método para aplicar filtros
const applyFilters = async (filters) => {
  isLoading.value = true;

  let url = "https://api.plugg.to/products";

  if (filters) {
    const queryParams = new URLSearchParams(filters).toString();
    url += `?${queryParams}`;
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
    console.log("Produtos filtrados:", responseData);
    console.log("url utilizada", url);

    products.value = {
      total: responseData.total,
      showing: responseData.result.length,
      result: responseData.result,
    };
  } catch (error) {
    console.error("Erro ao buscar produtos com filtros:", error);
  } finally {
    isLoading.value = false;
  }
};

// Variáveis e métodos relacionados à edição e exclusão de produtos
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
  price: 0,
  quantity: 0,
};

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Novo Produto" : "Editar Produto";
});

// Método para editar um produto
const editItem = (item) => {
  const index = products.value.result.findIndex(
    (product) => product.sku === item.sku
  );
  if (index !== -1) {
    console.log("Produto encontrado:", products.value.result[index]);
    editedIndex.value = index;
    editedItem.value = {
      name: products.value.result[index].name,
      price: products.value.result[index].price,
      quantity: products.value.result[index].quantity,
    };
    console.log("Produto editado:", editedItem.value);
    dialog.value = true;
  } else {
    console.log("Produto não encontrado com SKU:", item.sku);
    // Ou exibir uma mensagem de alerta
    // alert("Produto não encontrado com SKU: " + item.sku);
  }
};
// Método para deletar um produto
const deleteItem = (item) => {
  editedIndex.value = products.value.result.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

// Método para confirmar a exclusão de um produto
const deleteItemConfirm = () => {
  products.value.result.splice(editedIndex.value, 1);
  closeDelete();
};

// Método para fechar o diálogo de edição
const close = () => {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  }, 100);
};

// Método para fechar o diálogo de exclusão
const closeDelete = () => {
  dialogDelete.value = false;
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  }, 100);
};

// Método para salvar as alterações em um produto
const save = async () => {
  if (editedIndex.value > -1) {
    Object.assign(products.value.result[index], editedItem.value);
  } else {
    products.value.result.push({ ...editedItem.value });
  }
  close();

  // Envie as alterações para a API
  try {
    const response = await axios.put(
      `https://api.plugg.to/products/${editedItem.value.sku}`,
      editedItem.value,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
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

// Atualizar os produtos ao montar o componente
onMounted(() => {
  fetchProducts();
});
</script>
