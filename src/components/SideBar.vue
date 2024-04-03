<template>
  <v-navigation-drawer
    v-model="drawer"
    expand-on-hover
    rail
    color="sidebar-bg"
    class=""
  >
    <div color="" class="pa-4">
      <v-img
        src="p1.webp"
        alt="food"
        width="150"
        height="150"
        class="ml-9"
      ></v-img>
    </div>
    <v-card class="rounded-e-xl me" width="60" height="400" color="#424242">
    </v-card>
    <v-list class="top">
      <v-list-item
        v-for="(item, i) in links"
        :key="i"
        :value="item"
        :to="item.route"
        class="mb-5"
        color="#90EE90"
        variant="plain"
      >
        <template v-slot:append="{ isActive }">
          <div v-if="isActive" class="a"></div>
        </template>

        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
    <div
      style="
        position: absolute;
        justify-content: space-evenly;
        bottom: 30px;
        margin: 0 auto;
        left: 0;
        right: 0;
        text-align: center;
        display: block;
        align-items: center;
        
      "
    >
      <v-btn
        icon="mdi-theme-light-dark"
        @click="toggleTheme"
        size="small"
        class="mr-2"
        color="#5F3B39"
      ></v-btn>

      <v-badge dot color="#FF6259">
        <v-btn icon="mdi mdi-bell" size="small" color="#5F3B39"></v-btn>
      </v-badge>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { useTheme } from "vuetify";
export default {
  name: "SideBar",
  data() {
    const theme = useTheme();

    function toggleTheme() {
      theme.global.name.value = theme.global.current.value.dark
        ? "light"
        : "dark";
    }
    return {
      toggleTheme,
      drawer: null,
      links: [
        { text: "Dashboard", icon: "mdi-view-dashboard", route: "/" },
        { text: "Pedidos", icon: "mdi-cart", route: "/pedidos" },
        {
          text: "Produtos",
          icon: "mdi-package-variant-closed",
          route: "/produtos",
        },
        { text: "Relatórios", icon: "mdi-file-chart", route: "/relatorios" },
        { text: "Logout", icon: "mdi-logout", route: "/sair" },
      ],
      cards: ["Hoje", "Amanhã"],
    };
  },
};
</script>
<style scoped>
.v-list-item.v-list-item--active.v-list-item--link.border.v-theme--light.text-red.v-list-item--density-default.v-list-item--one-line.v-list-item--variant-text {
  color: white !important;
}
.top {
  margin-top: 60px;
}
.me {
  position: absolute;
  margin-top: 28px;
}
.v-locale--is-ltr .rounded-e-xl {
  border-top-right-radius: 44px !important;
  border-bottom-right-radius: 44px !important;
}
.a {
  top: 32%;
  left: 20.5%;
  position: absolute;
  height: 15px;
  width: 15px;
  background: linear-gradient(-90deg, #545454, #545454 50%, black 50%);
  border-radius: 50%;
}
</style>
