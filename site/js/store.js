(function(){
const KEY='techExpressLive_v3';
const seed={categories:['Smart Watch','Ladies Watch','Earbuds','Watch Strap','Accessories'],products:[],orders:[],settings:{phone:'01303-072964',delivery:80,storeName:'Tech Express 2.0',notice:'Cash on Delivery সারা বাংলাদেশে।'}};
let db=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||JSON.parse(JSON.stringify(seed))}catch(e){return JSON.parse(JSON.stringify(seed))}}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function apiUrl(action,params={}){const u=new URL(TECH_CONFIG.APPS_SCRIPT_URL);u.searchParams.set('action',action);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));return u.toString()}
function jsonp(url){return new Promise((resolve,reject)=>{const cb='teJsonp_'+Date.now()+'_'+Math.floor(Math.random()*1e6),s=document.createElement('script'),timer=setTimeout(()=>{cleanup();reject(new Error('সার্ভার থেকে উত্তর পাওয়া যায়নি।'))},18000);function cleanup(){clearTimeout(timer);delete window[cb];s.remove()}window[cb]=v=>{cleanup();resolve(v)};s.onerror=()=>{cleanup();reject(new Error('Apps Script API লোড হয়নি। Deployment access পরীক্ষা করুন।'))};s.src=url+(url.includes('?')?'&':'?')+'callback='+cb;document.head.appendChild(s)})}
async function getApi(action,params){const r=await jsonp(apiUrl(action,params));if(!r||r.ok!==true)throw new Error(r?.message||'API request failed');return r}
async function postApi(payload){const response=await fetch(TECH_CONFIG.APPS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow'});const data=await response.json();if(!data||data.ok!==true)throw new Error(data?.message||'API request failed');return data}
async function init(){if(TECH_CONFIG.API_MODE!=='apps-script')return db;const r=await getApi('bootstrap');const x=r.data||{};db={...db,categories:(x.categories||[]).map(c=>c.name||c),products:(x.products||[]).map(v=>({id:v.id,name:v.name,category:v.categoryName||v.category,price:Number(v.price||0),oldPrice:Number(v.oldPrice||0),stock:Number(v.stock||0),image:v.imageUrl||v.image||'assets/watch-placeholder.svg',description:v.description||'',featured:!!v.featured,active:v.active!==false})),settings:{...db.settings,storeName:x.storeName||'Tech Express 2.0',delivery:Number(x.deliveryCharge??80),phone:x.contactPhone||'01303-072964',notice:x.notice||'',whatsappNumber:x.whatsappNumber||'8801303072964',cancellationNotice:x.cancellationNotice||''}};save();return db}
function get(){return db}
function reset(){db=JSON.parse(JSON.stringify(seed));save()}
function product(id){return db.products.find(p=>p.id===id)}
function cart(){try{return JSON.parse(localStorage.getItem('te_cart_v3'))||[]}catch(e){return []}}
function saveCart(c){localStorage.setItem('te_cart_v3',JSON.stringify(c))}
function addCart(id,qty=1){let c=cart(),it=c.find(x=>x.id===id);if(it)it.qty+=qty;else c.push({id,qty});saveCart(c)}
function updateCart(id,qty){let c=cart().map(x=>x.id===id?{...x,qty}:x).filter(x=>x.qty>0);saveCart(c)}
function cartItems(){return cart().map(x=>({...x,product:product(x.id)})).filter(x=>x.product)}
function subtotal(){return cartItems().reduce((s,x)=>s+x.product.price*x.qty,0)}
async function placeOrder(data){const items=cartItems();if(!items.length)throw Error('কার্ট খালি।');if(TECH_CONFIG.API_MODE!=='apps-script')throw Error('লাইভ API চালু নেই।');const r=await postApi({action:'createOrder',customer:data,items:items.map(x=>({productId:x.id,quantity:x.qty}))});const o=r.order;if(!o?.id)throw Error('অর্ডার আইডি তৈরি হয়নি।');db.orders.unshift(o);save();saveCart([]);await init().catch(()=>{});return o}
async function getOrder(id,phoneLast4){const r=await getApi('order',{orderId:id,phoneLast4});return r.order}
window.TEStore={get,save,reset,init,product,cart,saveCart,addCart,updateCart,cartItems,subtotal,placeOrder,getOrder,apiPost:postApi,apiGet:getApi,KEY};
})();