import { defineStore } from "pinia";

export const pageStore = defineStore("pageStore", {
    state: () => {
        return {
            keyword: '',
            // 渲染记录图
            imageRecords: [],
            // 针对layout的滚动
            scrollLoadingNext: 0,
            scrollLoadingPrev: 0,
        }
    },
    getters: {
        getKeyword: (state) => {
            return state.keyword;
        },
        getImageRecords: (state) => {
            return state.imageRecords;
        }
    },
    actions: {
        setKeyword(data) {
            this.keyword = data;
        },
        setImageRecords(data) {
            this.imageRecords = data;
        },
        setScrollLoadingNext() {
            this.scrollLoadingNext = new Date().getTime();
        },
        setScrollLoadingPrev() {
            this.scrollLoadingPrev = new Date().getTime();
        }
    }
})