(function(){
const KEY='techExpressDemo_v2';
const seed={
 categories:['Smart Watch','Ladies Watch','Earbuds','Watch Strap','Accessories'],
 products:[
 {id:'P001',name:'S9 Pro Smart Watch',category:'Smart Watch',price:800,oldPrice:1000,stock:25,image:'assets/watch-s9.svg',description:'Bluetooth Calling, Full Touch Display, Health Monitoring.',featured:true,active:true},
 {id:'P002',name:'V19 Pro Smart Watch',category:'Smart Watch',price:999,oldPrice:1199,stock:18,image:'assets/watch-v19.svg',description:'স্মার্ট ডিজাইন ও প্রয়োজনীয় দৈনন্দিন ফিচার।',featured:true,active:true},
 {id:'P003',name:'KW68 Mini Ladies Watch',category:'Ladies Watch',price:949,oldPrice:1100,stock:12,image:'assets/watch-kw68.svg',description:'Ladies collection smart watch.',featured:true,active:true},
 {id:'P004',name:'S10 Pro Smart Watch',category:'Smart Watch',price:1050,oldPrice:1250,stock:10,image:'assets/watch-s10.svg',description:'স্টাইলিশ স্মার্ট ওয়াচ।',featured:false,active:true},
 {id:'P005',name:'Classic Watch Strap',category:'Watch Strap',price:180,oldPrice:220,stock:30,image:'assets/watch-strap.svg',description:'কমফোর্টেবল রিপ্লেসমেন্ট স্ট্র্যাপ।',featured:false,active:true},
 {id:'P006',name:'TWS Earbuds',category:'Earbuds',price:650,oldPrice:800,stock:15,image:'assets/watch-earbuds.svg',description:'Wireless earbuds with charging case.',featured:false,active:true}
 ],
 orders:[],settings:{phone:'+8801712345678',delivery:80,storeName:'Tech Express',notice:'Cash on Delivery সারা বাংলাদেশে।'}
};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(seed)}catch(e){return JSON.parse(JSON.stringify(seed))}}
let db=load();
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function get(){return db}
function reset(){db=JSON.parse(JSON.stringify(seed));save()}
function product(id){return db.products.find(p=>p.id===id)}
function cart(){try{return JSON.parse(localStorage.getItem('te_cart_v2'))||[]}catch(e){return []}}
function saveCart(c){localStorage.setItem('te_cart_v2',JSON.stringify(c))}
function addCart(id,qty=1){let c=cart(),it=c.find(x=>x.id===id);if(it)it.qty+=qty;else c.push({id,qty});saveCart(c)}
function updateCart(id,qty){let c=cart().map(x=>x.id===id?{...x,qty}:x).filter(x=>x.qty>0);saveCart(c)}
function cartItems(){return cart().map(x=>({...x,product:product(x.id)})).filter(x=>x.product)}
function subtotal(){return cartItems().reduce((s,x)=>s+x.product.price*x.qty,0)}
function placeOrder(data){
 const items=cartItems();if(!items.length)throw Error('কার্ট খালি।');
 const id='TE'+(10001+db.orders.length);
 const order={id,date:new Date().toISOString(),customer:data,items:items.map(x=>({id:x.id,name:x.product.name,price:x.product.price,qty:x.qty})),subtotal:subtotal(),delivery:Number(db.settings.delivery)||80,total:subtotal()+(Number(db.settings.delivery)||80),status:'Pending'};
 db.orders.unshift(order);save();saveCart([]);return order;
}
window.TEStore={get,save,reset,product,cart,saveCart,addCart,updateCart,cartItems,subtotal,placeOrder,KEY};
})();