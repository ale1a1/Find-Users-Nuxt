// @ts-nocheck
import vClickOutside from "click-outside-vue3";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vClickOutside); // No error here
});
