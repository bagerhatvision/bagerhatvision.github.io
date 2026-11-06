(function(){
const KEY='techExpressDemo_v1';
const seed={
 categories:['Smart Watch','Ladies Watch','Earbuds','Watch Strap','Accessories'],
 products:[
 {id:'P001',name:'S9 Pro Smart Watch',category:'Smart Watch',price:800,oldPrice:1000,stock:25,image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',description:'Bluetooth Calling, Full Touch Display, Health Monitoring.',featured:true,active:true},
 {id:'P002',name:'V19 Pro Smart Watch',category:'Smart Watch',price:999,oldPrice:1199,stock:18,image:'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700',description:'স্মার্ট ডিজাইন ও প্রয়োজনীয় দৈনন্দিন ফিচার।',featured:true,active:true},
 {id:'P003',name:'KW68 Mini Ladies Watch',category:'Ladies Watch',price:949,oldPrice:1100,stock:12,image:'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=700',description:'Ladies collection smart watch.',featured:true,active:true},
 {id:'P004',name:'S10 Pro Smart Watch',category:'Smart Watch',price:1050,oldPrice:1250,stock:10,image:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700',description:'স্টাইলিশ স্মার্ট ওয়াচ।',featured:false,active:true},
 {id:'P005',name:'Classic Watch Strap',category:'Watch Strap',price:180,oldPrice:220,stock:30,image:'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=700',description:'কমফোর্টেবল রিপ্লেসমেন্ট স্ট্র্যাপ।',featured:false,active:true},
 {id:'P006',name:'TWS Earbuds',category:'Earbuds',price:650,oldPrice:800,stock:15,image:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700',description:'Wireless earbuds with charging case.',featured:false,active:true}
 ],
 orders:[],settings:{phone:'+8801712345678',delivery:80,storeName:'Tech Express',notice:'Cash on Delivery সারা বাংলাদেশে।'}
};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(seed)}catch(e){return JSON.parse(JSON.stringify(seed))}}
let db=load();
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function get(){return db}
function reset(){db=JSON.parse(JSON.stringify(seed));save()}
function product(id){return db.products.find(p=>p.id===id)}
function cart(){try{return JSON.parse(localStorage.getItem('te_cart'))||[]}catch(e){return []}}
function saveCart(c){localStorage.setItem('te_cart',JSON.stringify(c))}
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