//==========
// ServiceWorker
console.log("Hello ServiceWorker!!");

const CACHE_VERSION = "cache_1.0.0";
const CACHE_FILES = [
	"ad.svg", "ae.svg", "af.svg", "ag.svg", "ai.svg", "al.svg", "am.svg", "ao.svg",
	"aq.svg", "ar.svg", "as.svg", "at.svg", "au.svg", "aw.svg", "ax.svg", "az.svg", 
	"ba.svg", "bb.svg", "bd.svg", "be.svg", "bf.svg", "bg.svg", "bh.svg", "bi.svg",
	"bj.svg", "bl.svg", "bm.svg", "bn.svg", "bo.svg", "bq.svg", "br.svg", "bs.svg",
	"bt.svg", "bv.svg", "bw.svg", "by.svg", "bz.svg",
	"ca.svg", "cc.svg", "cd.svg", "cf.svg", "cg.svg", "ch.svg", "ci.svg", "ck.svg",
	"cl.svg", "cm.svg", "cn.svg", "co.svg", "cr.svg", "cu.svg", "cv.svg", "cw.svg",
	"cx.svg", "cy.svg", "cz.svg",
	"de.svg", "dj.svg", "dk.svg", "dm.svg", "do.svg", "dz.svg",
	"ec.svg", "ee.svg", "eg.svg", "eh.svg", "er.svg", "es.svg", "et.svg", "eu.svg",
	"fi.svg", "fj.svg", "fk.svg", "fm.svg", "fo.svg", "fr.svg",
	"ga.svg", "gb-eng.svg", "gb-nir.svg", "gb-sct.svg", "gb-wls.svg",
	"gb.svg", "gd.svg", "ge.svg", "gf.svg", "gg.svg", "gh.svg", "gi.svg", "gl.svg",
	"gm.svg", "gn.svg", "gp.svg", "gq.svg", "gr.svg", "gs.svg", "gt.svg", "gu.svg",
	"gw.svg", "gy.svg",
	"hk.svg", "hm.svg", "hn.svg", "hr.svg", "ht.svg", "hu.svg",
	"id.svg", "ie.svg", "il.svg", "im.svg", "in.svg", "io.svg", "iq.svg", "ir.svg",
	"is.svg", "it.svg",
	"je.svg", "jm.svg", "jo.svg", "jp.svg",
	"ke.svg", "kg.svg", "kh.svg", "ki.svg", "km.svg", "kn.svg", "kp.svg", "kr.svg",
	"kw.svg", "ky.svg", "kz.svg",
	"la.svg", "lb.svg", "lc.svg", "li.svg", "lk.svg", "lr.svg", "ls.svg", "lt.svg",
	"lu.svg", "lv.svg", "ly.svg",
	"ma.svg", "mc.svg", "md.svg", "me.svg", "mf.svg", "mg.svg", "mh.svg", "mk.svg",
	"ml.svg", "mm.svg", "mn.svg", "mo.svg", "mp.svg", "mq.svg", "mr.svg", "ms.svg",
	"mt.svg", "mu.svg", "mv.svg", "mw.svg", "mx.svg", "my.svg", "mz.svg",
	"na.svg", "nc.svg", "ne.svg", "nf.svg", "ng.svg", "ni.svg", "nl.svg", "no.svg",
	"np.svg", "nr.svg", "nu.svg", "nz.svg",
	"om.svg", "pa.svg", "pe.svg", "pf.svg", "pg.svg", "ph.svg", "pk.svg", "pl.svg",
	"pm.svg", "pn.svg", "pr.svg", "ps.svg", "pt.svg", "pw.svg", "py.svg",
	"qa.svg",
	"re.svg", "ro.svg", "rs.svg", "ru.svg", "rw.svg",
	"sa.svg", "sb.svg", "sc.svg", "sd.svg", "se.svg", "sg.svg", "sh.svg", "si.svg",
	"sj.svg", "sk.svg", "sl.svg", "sm.svg", "sn.svg", "so.svg", "sr.svg", "ss.svg",
	"st.svg", "sv.svg", "sx.svg", "sy.svg", "sz.svg",
	"tc.svg", "td.svg", "tf.svg", "tg.svg", "th.svg", "tj.svg", "tk.svg", "tl.svg",
	"tm.svg", "tn.svg", "to.svg", "tr.svg", "tt.svg", "tv.svg", "tw.svg", "tz.svg",
	"ua.svg", "ug.svg", "um.svg", "us.svg", "uy.svg", "uz.svg",
	"va.svg", "vc.svg", "ve.svg", "vg.svg", "vi.svg", "vn.svg", "vu.svg",
	"wf.svg", "ws.svg", "xk.svg", "ye.svg", "yt.svg", "za.svg", "zm.svg", "zw.svg"
];

// Place files that need to be executed offline 
// in the offline cache area.
// Check it out: Console -> Application -> Cache Storage
self.addEventListener("install", (e)=>{
	console.log("install", e);
	const flags = [];// Flags
	for(let i=0; i<CACHE_FILES.length; i++){
		flags.push("./assets/images/flags/" + CACHE_FILES[i]);
	}
	e.waitUntil(caches.open(CACHE_VERSION).then((cache)=>{
		return cache.addAll(flags);
	}));
});

// Delete caches that are not on the whitelist.
self.addEventListener("activate", (e)=>{
	console.log("activate", e);
	let cacheWhitelist = [CACHE_VERSION];
	e.waitUntil(caches.keys().then(function(keyList){
		return Promise.all(keyList.map(function(key){
			if(cacheWhitelist.indexOf(key) === -1){
				return caches.delete(key);}
			}));
		})
	);
});

// If there is data in the cache, 
// use it as it is, if not, request it.
self.addEventListener("fetch", (e)=>{
	e.respondWith(caches.match(e.request).then((res)=>{
		if(res) return res;
		return fetch(e.request);
	}));
});