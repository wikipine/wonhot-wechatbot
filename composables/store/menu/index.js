import { defineStore } from "pinia";

export const menuStore = defineStore("menuStore", {
    state: () => {
        return {
            breadcrumb: []
        }
    },
    getters: {
        getBreadcrumb: (state) => {
            return state.breadcrumb;
        }
    },
    actions: {
        setBreadcrumb(data) {
            this.breadcrumb = data;
        }
    }
})