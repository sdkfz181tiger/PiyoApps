console.log("main.js!!");

const KEY_STORAGE  = "camdetector";

const MODE_LOADING = 0;
const MODE_MAIN    = 1;

const myData = {
	mode: MODE_LOADING,
	actives: [false, false, false, false, false],
	myOffcanvas: null,
	modalText: "",
	data: null,
	results: []
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
		const elemModal = document.getElementById("myModal");
		const modal = new bootstrap.Modal(elemModal);
		// Axios
		loadAxios("./assets/js/data.json", json=>{
			this.data = json.data;
			setTimeout(()=>{
				this.changeMode(MODE_MAIN);
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
		onDetected(results){
			//console.log("onDetected:", results);
			if(!results || results.length <= 0) return;
			this.results = results;
		},
		showModal(title, body){
			console.log("showModal");
			const elem = document.getElementById("myModal");
			elem.querySelector("#modalTitle").innerText = title;
			elem.querySelector("#modalBody").innerText = body;
			bootstrap.Modal.getInstance(elem).show();
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
	mounted(){
		console.log("Component is mounted!!");
		const elem = document.getElementById(this.id);
		const imobile = document.createElement("script");
		imobile.src = "//imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104";
		imobile.setAttribute("async", "true");
		elem.after(imobile);
	},
	template: '<div class="overflow-hidden" v-bind:id="id"></div>'
});

app.component("webcam", {
	data(){
		return {
			msg: "This is my Component!!",
			videoWidth: 480,
			videoHeight: 320,
			video: null,
			canvas: null
		}
	},
	mounted(){
		console.log("Component is mounted!!");
		// WebCam
		this.readyWebcam();
	},
	methods:{
		async readyWebcam(){
			console.log("readyWebcam");
			// Mobile
			const isMobile = (navigator.userAgent.match(/iPhone|Android.+Mobile/)) ? true:false;
			const optionPC = {video: {width: this.videoWidth, height: this.videoHeight}};
			const optionMobile = {video: {facingMode: {exact: "environment"}}};
			const option = (isMobile) ? optionMobile:optionPC;
			// WebCam
			this.video = document.getElementsByTagName("video")[0];
			const capture = await navigator.mediaDevices.getUserMedia(option);
			this.video.srcObject = capture;
			this.video.addEventListener("play", (e)=>{
				// Overlay
				this.canvas = document.createElement("canvas");
				this.video.after(this.canvas);
			});
			this.video.play();
			// Detector
			const detector = await ml5.objectDetector("yoro", ()=>{
				this.startDetection(this.video, detector);
			});
		},
		startDetection(video, detector){
			//console.log("startDetection");
			detector.detect(video, (err, results)=>{
				if(err){
					console.log(err);
					showToast("Error", "0 min ago.", err);
					return;
				}
				// Context
				const width = this.video.clientWidth;
				const height = this.video.clientHeight;
				const rate = width / this.video.videoWidth;
				this.canvas.width = width;
				this.canvas.height = height;
				const ctx = this.canvas.getContext("2d");
				ctx.strokeStyle = "lime";
				ctx.lineWidth = 4;
				ctx.clearRect(0, 0, width, height);
				ctx.strokeRect(0, 0, width, height);
				results.map(result=>{
					result.persent = Math.floor(result.confidence*100) + "%";
					result.x = Math.floor(result.x * rate);
					result.y = Math.floor(result.y * rate);
					result.w = Math.floor(result.width * rate);
					result.h = Math.floor(result.height * rate);
					ctx.strokeRect(result.x, result.y, result.w, result.h);
				});
				ctx.fill();
				setTimeout(()=>{
					this.startDetection(video, detector);
					this.$emit("on-detected", results);// Emit
				}, 1000);
			});
		}
	},
	template: '<video></video>'
});

app.mount("#app");