console.log("main.js!!");

const KEY_STORAGE  = "apps";

const MODE_LOADING = 0;
const MODE_TITLE   = 1;

const myData = {
	mode: MODE_LOADING,
}

// Vue.js
const app = Vue.createApp({
	data(){
		return myData;
	},
	created(){
		console.log("created!!");
	},
	mounted(){
		console.log("mounted!!");
		this.changeMode(MODE_TITLE);
	},
	methods:{
		changeMode(mode){
			if(this.mode == mode) return;
			this.mode = mode;
		}
	}
});

// Components
app.component("imobile", {
	props: ["pid", "mid", "asid", "id"],
	created(){
		// Banner
		(window.adsbyimobile=window.adsbyimobile||[]).push({
			pid: this.pid, mid: this.mid, asid: this.asid, 
			type: "banner", display: "inline", elementid: this.id});
	},
	template: '<div class="overflow-hidden" v-bind:id="id"></div>'
});
app.mount("#app");