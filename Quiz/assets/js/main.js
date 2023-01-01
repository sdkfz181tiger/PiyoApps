console.log("main.js!!");

const VERSION       = "v0.0.1";
const KEY_STORAGE   = "quiz";

const MODE_LOADING  = 0;
const MODE_TITLE    = 1;
const MODE_GAME     = 2;
const MODE_RESULT   = 3;

const LEVEL_EASY    = 1;
const LEVEL_NORMAL  = 2;
const LEVEL_HARD    = 3;
const QUIZ_TOTAL    = 4;

const PATH_FLAGS    = "./assets/images/flags/";
const myHowl        = new MyHowler();

const myData = {
	version: VERSION,
	mode: MODE_LOADING,
	actives: [false, false, false, false, false],
	myOffcanvas: null,
	modalText: "",
	flags: [],
	quizes: [],
	results: [],
	choises: [],
	level: 0,
	index: 0,
	answer: null,
	waiting: false
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
		// Offcanvas
		const elemOff = document.getElementById("myOffcanvas");
		this.myOffcanvas = new bootstrap.Offcanvas(elemOff);
		// Modal
		const elem = document.getElementById("myModal");
		const modal = new bootstrap.Modal(elem);
		// Axios
		loadAxios("./assets/js/data.json", json=>{
			this.flags = json.data.filter(flag=>flag.capital!="");// Flags
			this.flags.map(flg=>{flg.src = PATH_FLAGS + flg.code + ".svg";});
			preloadImages(this.flags);// Preload
			setTimeout(()=>{
				this.changeMode(MODE_TITLE);
			}, 200);
		}, (err)=>{
			showToast("Error", "0 min ago", "通信エラーです");
		});
	},
	methods:{
		changeMode(mode){
			if(this.mode == mode) return;
			this.mode = mode;
			for(let i=0; i<this.actives.length; i++){
				this.actives[i] = this.mode == i;
			}
		},
		create(){
			console.log("create");
			// Error
			if(this.modalText == null || this.modalText.length <= 0){
				showToast("Error", "1 min ago", "テキストを入力してください");
				return;
			}
			showToast("Create", "1 min ago", this.modalText);
		},
		showModal(){
			console.log("showModal");
			const elem = document.getElementById("myModal");
			elem.querySelector("#modalLabel").innerText = "Modal";
			bootstrap.Modal.getInstance(elem).show();
		},
		shuffleFlags(){
			console.log("shuffleFlags");
			for(let i=this.flags.length-1; 0<i; i--){
				const rdm = Math.floor(Math.random() * i);
				[this.flags[i], this.flags[rdm]] = [this.flags[rdm], this.flags[i]];
			}
		},
		shuffleChoises(){
			console.log("shuffleChoises");
			this.choises = this.quizes.filter(flag=>flag.name!=this.answer.name);
			for(let i=this.choises.length-1; 0<i; i--){
				const rdm = Math.floor(Math.random() * i);
				[this.choises[i], this.choises[rdm]] = [this.choises[rdm], this.choises[i]];
			}
			this.choises.splice(3);
			this.choises.push(this.answer);
			for(let i=0; i<this.choises.length; i++){
				const rdm = Math.floor(Math.random() * this.choises.length);
				if(rdm == i) continue;
				[this.choises[i], this.choises[rdm]] = [this.choises[rdm], this.choises[i]];
			}
		},
		clickGameLevel(level){
			console.log("clickGameLevel:", level);
			this.shuffleFlags();// Shuffle
			this.level = level;
			this.index = 0;
			this.quizes = this.flags.filter(flag=>flag.level==level);
			this.quizes = this.quizes.splice(0, QUIZ_TOTAL);
			this.results = Array(QUIZ_TOTAL).fill("-");
			this.answer = this.quizes[this.index];
			this.shuffleChoises();// Choises
			this.changeMode(MODE_GAME);
			myHowl.playBGM("./assets/sounds/bgm_game.mp3", 0.4, true);
		},
		clickChoise(name){
			console.log("clickChoise:", name);
			if(this.waiting) return;
			this.waiting = true;
			// Judge
			if(this.answer.name == name){
				this.results[this.index] = "o";
				this.doAnimate("quiz-flag", "animate__bounce");
				myHowl.playSE("./assets/sounds/se_ok.mp3");
			}else{
				this.results[this.index] = "x";
				this.doAnimate("quiz-flag", "animate__headShake");
				myHowl.playSE("./assets/sounds/se_ng.mp3");
			}
			// Next
			setTimeout(()=>{
				this.waiting = false;
				if(this.quizes.length-1 < ++this.index){
					this.changeMode(MODE_RESULT);
					myHowl.playBGM("./assets/sounds/bgm_result.mp3", 0.4);
					return;
				}
				this.answer = this.quizes[this.index];// Next
				this.shuffleChoises();// Choises
				this.doAnimate("quiz-flag", "animate__bounceIn");
				myHowl.playSE("./assets/sounds/se_next.mp3");
			}, 1200);
		},
		clickTitle(){
			console.log("clickTitle");
			this.changeMode(MODE_TITLE);
			myHowl.playBGM("./assets/sounds/bgm_title.mp3", 0.4);
		},
		clickRetry(){
			console.log("clickRetry");
			this.clickGameLevel(this.level);// Rtery
		},
		doAnimate(id, anim){
			console.log("doAnimate:", id, anim);
			const elem = document.getElementById(id);
			elem.setAttribute("class", "animate__animated " + anim);
			elem.addEventListener("animationend", ()=>{
				elem.removeEventListener("animationend", this);
				elem.removeAttribute("class");
			});
		}
	},
	computed:{
		getResultCount(){
			let counter = 0;
			for(let result of this.results){
				if(result == "o") counter++;
			}
			return counter;
		},
		getResultLine(){
			return this.results.join(",");
		},
		getFlgLine(){
			const icons = [];
			for(let i=0; i<6; i++){
				const rdm = Math.floor(Math.random()*this.flags.length);
				icons.push(this.flags[rdm]);
			}
			return icons;
		}
	}
});

// Components
app.component("greeting", {
	template: "<p>Good morning!!</p>"
});

app.mount("#app");