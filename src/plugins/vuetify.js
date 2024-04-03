/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          background: "#EEEEEE",
          primary: "#FAFAFA",
          "primary-darken-1": "#1565C0",
          secondary: "#424242",
          "secondary-darken-1": "#333333",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          "sidebar-bg": "#2B2B2B",
        },
      },
      dark: {
        colors: {
          background: "#424242",
          primary: "#90CAF9",
          "primary-darken-1": "#64B5F6",
          secondary: "#FFA726",
          "secondary-darken-1": "#FB8C00",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          "sidebar-bg": "#2B2B2B",
        },
      },
    },
  },
});
