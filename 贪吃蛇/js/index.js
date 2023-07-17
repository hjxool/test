import vue from "../js/main.js";
const { createApp, toRefs } = vue;
createApp({
    setup(props) {
        let data = {
            score: 0,
            level: 1,
        };
        return { ...toRefs(data) };
    },
}).mount("#main");
