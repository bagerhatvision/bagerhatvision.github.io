(function(){
const $=s=>document.querySelector(s), money=n=>`${window.TECH_CONFIG.CURRENCY}${Number(n||0).toLocaleString('en-IN')}`;
let db=TEStore.get(); let page=document.body.dataset.page;
let apiReady=false, navigationBusy=false;
const pageCache=new Map(), scrollPositions=new Map();
if(/Android.*(TV|AFT|BRAVIA|GoogleTV)|GoogleTV|SmartTV/i.test(navigator.userAgent))document.body.classList.add('tv-mode');
function header(){
 const count=TEStore.cart().reduce((s,x)=>s+x.qty,0);
 const icon=(name)=>({search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>',cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h2l2.2 12.1a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',home:'<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10H5V10"/><path d="M9 20v-7h6v7"/></svg>',grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',track:'<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h5M8 16h8"/><path d="m15 12 2 2 4-5"/></svg>',contact:'<svg viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2-5.1A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.5 9.5c.7 2 2 3.3 4 4"/></svg>'})[name];
 $('#site-header').innerHTML=`<header class="site-header"><div class="container header-inner"><a class="brand" href="index.html"><span class="brand-mark brand-logo"><img src="https://i.imgur.com/N1sgJOj.jpeg" alt="Tech Express 2.0 logo"></span><span class="brand-copy">Tech Express 2.0<small>🛒Quality gadgets you can trust.🛍️</small></span></a><nav class="desktop-nav"><a href="index.html">হোম</a><a href="products.html">পণ্য</a><a href="cart.html">কার্ট</a><a href="tracking.html">অর্ডার ট্র্যাকিং</a><a href="contact.html">যোগাযোগ</a></nav><div class="header-actions"><a class="header-icon search-link" href="products.html?focus=search" aria-label="Search">${icon('search')}</a><a class="header-icon cart-link" href="cart.html" aria-label="Cart">${icon('cart')}<b class="cart-count">${count}</b></a><button class="menu-btn" id="menu-toggle" aria-label="Menu">☰</button></div></div><nav class="mobile-nav" id="mobile-nav"><a href="index.html">হোম</a><a href="products.html">পণ্য</a><a href="tracking.html">অর্ডার ট্র্যাকিং</a><a href="about.html">আমাদের সম্পর্কে</a><a href="contact.html">যোগাযোগ</a></nav></header><nav class="mobile-bottom-nav"><a href="index.html" class="${page==='home'?'active':''}">${icon('home')}<span>হোম</span></a><a href="products.html" class="${page==='products'?'active':''}">${icon('grid')}<span>পণ্য</span></a><a href="cart.html" class="${page==='cart'?'active':''}">${icon('cart')}<span>কার্ট <b class="bottom-count">${count}</b></span></a><a href="tracking.html" class="${page==='tracking'?'active':''}">${icon('track')}<span>অর্ডার ট্র্যাকিং</span></a><a href="contact.html" class="${page==='contact'?'active':''}">${icon('contact')}<span>যোগাযোগ</span></a></nav>`;
 const toggle=$('#menu-toggle');if(toggle)toggle.onclick=()=>$('#mobile-nav').classList.toggle('open');
}
function footer(){ $('#site-footer').innerHTML=`<footer class="site-footer compact-footer">
 <div class="container footer-topline">
  <a class="footer-brand-mini" href="index.html" aria-label="Tech Express 2.0 Home">
   <img src="https://i.imgur.com/N1sgJOj.jpeg" alt="Tech Express 2.0 logo">
   <span><b>Tech Express 2.0</b><small>🛒Quality gadgets you can trust.🛍️</small></span>
  </a>
  <div class="footer-social-contact">
   <a class="footer-social whatsapp" href="https://wa.me/8801303072964" target="_blank" rel="noopener" aria-label="WhatsApp 01303-072964"><span>◉</span><small>01303-072964</small></a>
   <a class="footer-social facebook" href="https://www.facebook.com/TechExpress2.0" target="_blank" rel="noopener" aria-label="Tech Express 2.0 Facebook"><span>f</span><small>Facebook</small></a>
  </div>
 </div>
 <div class="footer-benefits"><span>🚚 COD সারা দেশে</span><span>↻ ৭ দিনের রিপ্লেসমেন্ট</span><span>🛡 নিরাপদ কেনাকাটা</span></div>
 <div class="footer-copyright">© Tech Express 2.0 - 2026 <span>All Rights Reserved</span></div>
</footer>`}
function card(p){return `<article class="product-card"><a href="product.html?id=${encodeURIComponent(p.id)}" class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/watch-placeholder.svg'"></a><div class="product-info"><a class="product-name" href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a><div class="price">${money(p.price)} ${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}</div><button class="btn btn-small add-btn" data-add="${p.id}">＋ কার্টে যোগ করুন</button></div></article>`}
function bindAdd(){document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{TEStore.addCart(b.dataset.add);b.textContent='যোগ হয়েছে ✓';document.querySelectorAll('.cart-count,.bottom-count').forEach(x=>x.textContent=TEStore.cart().reduce((s,i)=>s+i.qty,0))})}
function home(){ $('#home-categories').innerHTML=db.categories.map(c=>`<a class="category-chip" href="products.html?category=${encodeURIComponent(c)}">${c}</a>`).join('');$('#featured-products').innerHTML=db.products.filter(p=>p.active&&p.featured).map(card).join('');$('#new-products').innerHTML=db.products.filter(p=>p.active).slice().reverse().slice(0,4).map(card).join('');bindAdd()}
function products(){let list=db.products.filter(p=>p.active);const params=new URLSearchParams(location.search);const cat=params.get('category');$('#category-filter').innerHTML+=[...new Set(db.categories)].map(c=>`<option>${c}</option>`).join('');if(cat)$('#category-filter').value=cat;if(params.get('focus')==='search')setTimeout(()=>$('#product-search').focus(),100);if(params.get('search'))$('#product-search').value=params.get('search');function draw(){let q=$('#product-search').value.toLowerCase(),c=$('#category-filter').value,s=$('#sort-filter').value,a=list.filter(p=>(!q||p.name.toLowerCase().includes(q))&&(!c||p.category===c));if(s==='low')a.sort((x,y)=>x.price-y.price);if(s==='high')a.sort((x,y)=>y.price-x.price);$('#all-products').innerHTML=a.length?a.map(card).join(''):'<p class="empty">কোনো পণ্য পাওয়া যায়নি।</p>';bindAdd()}['input','change'].forEach(ev=>[$('#product-search'),$('#category-filter'),$('#sort-filter')].forEach(x=>x.addEventListener(ev,draw)));draw()}
function detail(){let id=new URLSearchParams(location.search).get('id'),p=TEStore.product(id);if(!p){$('#product-detail').innerHTML='<p class="empty">পণ্য পাওয়া যায়নি। <a href="products.html">সব পণ্য দেখুন</a></p>';return}$('#product-detail').innerHTML=`<div class="detail-layout"><div class="detail-image"><img src="${p.image}" alt="${p.name}" onerror="this.src='assets/watch-placeholder.svg'"></div><div class="detail-info"><p class="eyebrow">${p.category}</p><h1>${p.name}</h1><div class="price detail-price">${money(p.price)} ${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}</div><p>${p.description||''}</p><p class="stock">${p.stock>0?'স্টকে আছে':'স্টক শেষ'}</p><div class="detail-actions"><button class="btn" id="detail-add" ${p.stock<1?'disabled':''}>কার্টে যোগ করুন</button><a class="btn btn-outline" href="checkout.html">অর্ডার করুন</a></div><p class="muted small">পেমেন্ট: Cash on Delivery</p></div></div>`;$('#detail-add').onclick=()=>{TEStore.addCart(p.id);navigate('cart.html')};document.querySelector('.detail-actions .btn-outline').onclick=(e)=>{e.preventDefault();TEStore.addCart(p.id);navigate('checkout.html')}}
function cartPage(){let items=TEStore.cartItems();if(!items.length){$('#cart-content').innerHTML='<div class="panel empty">আপনার কার্ট খালি। <a href="products.html">পণ্য দেখুন</a></div>';return}$('#cart-content').innerHTML=`<div class="cart-layout"><div class="cart-list">${items.map(x=>`<div class="cart-row"><img src="${x.product.image}" onerror="this.src='assets/watch-placeholder.svg'"><div class="cart-product"><b>${x.product.name}</b><span class="price">${money(x.product.price)}</span></div><div class="qty"><button data-minus="${x.id}">−</button><span>${x.qty}</span><button data-plus="${x.id}">＋</button></div><button class="remove" data-remove="${x.id}">✕</button></div>`).join('')}</div><aside class="panel summary"><h3>অর্ডার সারাংশ</h3><p>সাবটোটাল <b>${money(TEStore.subtotal())}</b></p><p>ডেলিভারি <b>${money(db.settings.delivery)}</b></p><hr><h3>সর্বমোট <strong>${money(TEStore.subtotal()+Number(db.settings.delivery))}</strong></h3><a class="btn full" href="checkout.html">চেকআউট করুন</a></aside></div>`;document.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{let x=TEStore.cart().find(i=>i.id===b.dataset.minus);TEStore.updateCart(x.id,x.qty-1);cartPage()});document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{let x=TEStore.cart().find(i=>i.id===b.dataset.plus);TEStore.updateCart(x.id,x.qty+1);cartPage()});document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{TEStore.updateCart(b.dataset.remove,0);cartPage()})}
function checkout(){
 let items=TEStore.cartItems();
 if(!items.length){$('#checkout-content').innerHTML='<div class="panel empty">কার্ট খালি। <a href="products.html">পণ্য দেখুন</a></div>';return}
 const total=TEStore.subtotal()+Number(db.settings.delivery);
 $('#checkout-content').innerHTML=`<form id="order-form" class="panel form-grid">
 <label>আপনার নাম *<input name="name" required autocomplete="name"></label>
 <label>মোবাইল নম্বর *<input name="phone" type="tel" required pattern="[0-9+ -]{10,15}" autocomplete="tel"></label>
 <label class="span-2">সম্পূর্ণ ঠিকানা *<textarea name="address" required rows="3" placeholder="গ্রাম, ইউনিয়ন, উপজেলা, জেলা" autocomplete="street-address"></textarea></label>
 <label class="span-2">অতিরিক্ত তথ্য (ঐচ্ছিক)<textarea name="note" rows="2"></textarea></label>
 <div class="span-2 summary-line"><span>পণ্যের মূল্য</span><b>${money(TEStore.subtotal())}</b></div>
 <div class="span-2 summary-line"><span>ডেলিভারি চার্জ</span><b>${money(db.settings.delivery)}</b></div>
 <div class="span-2 summary-line total-line"><span>সর্বমোট (Cash on Delivery)</span><b>${money(total)}</b></div>
 <div class="span-2 order-policy"><b>অর্ডার ও বাতিল সংক্রান্ত নোটিশ</b><p>অর্ডার নিশ্চিত হওয়ার পর কোনো কারণে অর্ডার বাতিল করতে চাইলে কুরিয়ার বুকিং/ডেলিভারি চার্জ আপনাকে পরিশোধ করতে হবে। অর্ডার দেওয়ার আগে পণ্য, ঠিকানা ও মোবাইল নম্বর ভালোভাবে যাচাই করুন।</p></div>
 <div class="span-2" id="order-submit-notice" role="status" aria-live="polite"></div>
 <button class="btn span-2" type="submit">অর্ডার নিশ্চিত করুন</button>
 </form>`;
 $('#order-form').onsubmit=async e=>{
  e.preventDefault();
  const btn=e.target.querySelector('button[type="submit"]');
  const notice=$('#order-submit-notice');
  btn.disabled=true;btn.textContent='অর্ডার প্রক্রিয়াধীন...';notice.innerHTML='';
  try{
   const f=new FormData(e.target);
   const o=await TEStore.placeOrder({name:f.get('name').trim(),phone:f.get('phone').trim(),address:f.get('address').trim(),note:f.get('note').trim()}); localStorage.setItem('te_last_order',JSON.stringify(o));
   if(!o||!o.id) throw new Error('অর্ডার আইডি তৈরি হয়নি');
   $('#checkout-content').innerHTML=`<section class="panel order-success-card">
    <div class="success-icon">✓</div><p class="success-kicker">TECH EXPRESS 2.0 · ORDER CONFIRMATION</p>
    <h2>আপনার অর্ডার গ্রহণ করা হয়েছে!</h2>
    <p class="success-lead">ধন্যবাদ ${escapeHTML(o.customer.name)}। আপনার অর্ডারটি সফলভাবে রেকর্ড হয়েছে।</p>
    <div class="success-summary"><div><small>অর্ডার আইডি</small><b>${escapeHTML(o.id)}</b></div><div><small>সর্বমোট (COD)</small><b>${money(o.total)}</b></div><div><small>অর্ডারের অবস্থা</small><b class="pending-text">প্রাথমিকভাবে গ্রহণ করা হয়েছে</b></div></div>
    <div class="success-notice"><b>গুরুত্বপূর্ণ বাতিল নীতিমালা</b><p>অর্ডার নিশ্চিত হওয়ার পর কোনো কারণে বাতিল করতে হলে কুরিয়ার বুকিং/ডেলিভারি চার্জ আপনাকে পরিশোধ করতে হবে।</p></div>
    <div class="success-actions"><a class="btn" href="invoice.html?id=${encodeURIComponent(o.id)}">▣ PDF ইনভয়েস ডাউনলোড</a><a class="btn btn-outline" href="tracking.html?id=${encodeURIComponent(o.id)}">অর্ডার ট্র্যাক করুন</a></div>
    <p class="success-help">অর্ডার সংক্রান্ত সহায়তা: <a href="https://wa.me/8801303072964" target="_blank" rel="noopener">WhatsApp 01303-072964</a></p>
   </section>`;
  }catch(err){
   btn.disabled=false;btn.textContent='আবার চেষ্টা করুন';
   notice.innerHTML=`<div class="order-error-notice"><b>অর্ডার সম্পন্ন হয়নি!</b><p>আপনার অর্ডারটি সম্পূর্ণভাবে গ্রহণ করা যায়নি। কার্টের পণ্যগুলো সংরক্ষিত আছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা WhatsApp-এ যোগাযোগ করুন।</p><a href="https://wa.me/8801303072964" target="_blank" rel="noopener">WhatsApp: 01303-072964</a></div>`;
   console.error(err);
  }
 };
}
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function invoice(){
 const id=new URLSearchParams(location.search).get('id');
 const o=TEStore.get().orders.find(x=>x.id===id) || (()=>{try{const v=JSON.parse(localStorage.getItem('te_last_order'));return v&&v.id===id?v:null}catch(e){return null}})();
 const target=$('#invoice-content');
 if(!o){target.innerHTML=`<div class="panel order-error-notice"><h2>ইনভয়েস পাওয়া যায়নি</h2><p>এই অর্ডারটি এই ব্রাউজারে পাওয়া যায়নি অথবা অর্ডার সম্পন্ন হয়নি। সঠিক অর্ডার আইডি দিয়ে আবার চেষ্টা করুন।</p><a class="btn" href="tracking.html">অর্ডার ট্র্যাকিং</a></div>`;return}
 const rows=o.items.map((it,i)=>`<tr><td>${i+1}</td><td>${escapeHTML(it.name)}</td><td>${it.qty}</td><td>${money(it.price)}</td><td>${money(it.price*it.qty)}</td></tr>`).join('');
 target.innerHTML=`<article class="invoice-sheet">
  <div class="invoice-head"><div class="invoice-brand"><img src="https://i.imgur.com/N1sgJOj.jpeg" alt="Tech Express 2.0"><div><h2>Tech Express 2.0</h2><p>🛒Quality gadgets you can trust.🛍️</p></div></div><div class="invoice-label"><b>ORDER INVOICE</b><span>ক্যাশ অন ডেলিভারি</span></div></div>
  <div class="invoice-meta"><div><small>ইনভয়েস / অর্ডার আইডি</small><b>${escapeHTML(o.id)}</b></div><div><small>অর্ডারের তারিখ</small><b>${new Date(o.date).toLocaleString('bn-BD')}</b></div><div><small>অর্ডারের অবস্থা</small><b>${escapeHTML(o.status||'Pending')}</b></div></div>
  <div class="invoice-customer"><h3>কাস্টমারের তথ্য</h3><p><b>নাম:</b> ${escapeHTML(o.customer.name)}</p><p><b>মোবাইল:</b> ${escapeHTML(o.customer.phone)}</p><p><b>ঠিকানা:</b> ${escapeHTML(o.customer.address)}</p>${o.customer.note?`<p><b>নোট:</b> ${escapeHTML(o.customer.note)}</p>`:''}</div>
  <h3 class="invoice-section-title">অর্ডারের বিবরণ</h3><div class="invoice-table-wrap"><table class="invoice-table"><thead><tr><th>#</th><th>পণ্যের নাম</th><th>পরিমাণ</th><th>একক মূল্য</th><th>মোট</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="invoice-totals"><p><span>পণ্যের মূল্য</span><b>${money(o.subtotal)}</b></p><p><span>ডেলিভারি চার্জ</span><b>${money(o.delivery)}</b></p><p class="invoice-grand"><span>সর্বমোট (COD)</span><b>${money(o.total)}</b></p></div>
  <div class="invoice-policy"><b>অর্ডার বাতিল সংক্রান্ত গুরুত্বপূর্ণ নোটিশ</b><p>অর্ডার নিশ্চিত হওয়ার পর কোনো কারণে অর্ডার বাতিল করতে হলে কুরিয়ার বুকিং/ডেলিভারি চার্জ আপনাকে পরিশোধ করতে হবে। অর্ডার দেওয়ার আগে পণ্য, ঠিকানা ও মোবাইল নম্বর যাচাই করুন।</p></div>
  <div class="invoice-contact"><b>যোগাযোগ</b><span>WhatsApp: 01303-072964</span><span>Facebook: facebook.com/TechExpress2.0</span></div>
  <div class="invoice-thanks">Tech Express 2.0-এ কেনাকাটার জন্য ধন্যবাদ।</div>
 </article>
 <div class="invoice-actions"><button class="btn" id="download-invoice">⬇ PDF ডাউনলোড করুন</button><a class="btn btn-outline" href="tracking.html?id=${encodeURIComponent(o.id)}">অর্ডার ট্র্যাক করুন</a></div>
 <p class="invoice-pdf-hint">PDF ডাউনলোড বাটনে চাপ দিয়ে Print অপশনে “Save as PDF” নির্বাচন করুন।</p>`;
 $('#download-invoice').onclick=()=>window.print();
}
function tracking(){
 let form=$('#tracking-form'),res=$('#tracking-result'); if(!form)return;
 if(!form.elements.phoneLast4){const l=document.createElement('label');l.innerHTML='মোবাইল নম্বরের শেষ ৪ সংখ্যা<input name="phoneLast4" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required placeholder="শেষ ৪ সংখ্যা">';form.appendChild(l)}
 async function find(id,last4){res.innerHTML='<div class="panel">অর্ডার খোঁজা হচ্ছে...</div>';try{const o=await TEStore.getOrder(id,last4);res.innerHTML=`<div class="panel tracking-card"><h2>অর্ডার ${escapeHTML(o.id)}</h2><p>${escapeHTML(o.customer?.name||'কাস্টমার')}</p><p>মোট: <b>${money(o.total)}</b></p><span class="status">${escapeHTML(o.status)}</span><p class="muted small">${new Date(o.date).toLocaleString('bn-BD')}</p></div>`}catch(e){res.innerHTML=`<div class="panel empty">${escapeHTML(e.message)}</div>`}}
 form.onsubmit=e=>{e.preventDefault();const f=new FormData(form);find(f.get('orderId'),f.get('phoneLast4'))};
 let id=new URLSearchParams(location.search).get('id');if(id)form.elements.orderId.value=id;
}
function loadingCard(){return `<div class="product-card skeleton-card"><div class="skeleton skeleton-image"></div><div class="product-info"><div class="skeleton skeleton-line wide"></div><div class="skeleton skeleton-line short"></div><div class="skeleton skeleton-button"></div></div></div>`}
function showLoadingState(){
 const gridIds=page==='home'?['featured-products','new-products']:page==='products'?['all-products']:[];
 gridIds.forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=Array.from({length:page==='home'?4:8},loadingCard).join('')});
 if(page==='home'){const c=document.getElementById('home-categories');if(c)c.innerHTML=Array.from({length:4},()=>'<span class="skeleton skeleton-chip"></span>').join('')}
 const target=document.getElementById(({cart:'cart-content',checkout:'checkout-content',tracking:'tracking-result',product:'product-detail'}[page])||'');
 if(target)target.innerHTML='<div class="panel loading-panel"><span class="loading-spinner"></span><span>তথ্য লোড হচ্ছে...</span></div>';
}
async function renderCurrentPage(){
 page=document.body.dataset.page||'home';
 db=TEStore.get();
 showLoadingState();
 const renderer=({home,products,product:detail,cart:cartPage,checkout,tracking,invoice})[page];
 if(renderer) renderer();
 updateCartBadges();
 document.title=({home:'Tech Express 2.0 | Quality gadgets you can trust.',products:'সব পণ্য | Tech Express 2.0',product:'পণ্যের বিবরণ | Tech Express 2.0',cart:'কার্ট | Tech Express 2.0',checkout:'চেকআউট | Tech Express 2.0',tracking:'অর্ডার ট্র্যাকিং | Tech Express 2.0',invoice:'ইনভয়েস | Tech Express 2.0',contact:'যোগাযোগ | Tech Express 2.0',about:'আমাদের সম্পর্কে | Tech Express 2.0'})[page]||'Tech Express 2.0';
}
function updateCartBadges(){
 const count=TEStore.cart().reduce((sum,item)=>sum+item.qty,0);
 document.querySelectorAll('.cart-count,.bottom-count').forEach(el=>el.textContent=count);
}
function setActiveNavigation(){
 document.querySelectorAll('.desktop-nav a,.mobile-bottom-nav a,.mobile-nav a').forEach(a=>{
  const target=new URL(a.href,location.href);
  const active=target.pathname===location.pathname;
  a.classList.toggle('active',active);
 });
}
function pageKey(url){return url.pathname+url.search}
async function navigate(href,{replace=false,pop=false}={}){
 const url=new URL(href,location.href);
 if(url.origin!==location.origin||!url.pathname.startsWith(location.pathname.replace(/[^/]*$/,''))||url.pathname.includes('/admin/')){location.href=url.href;return}
 if(navigationBusy)return;
 const currentKey=pageKey(new URL(location.href));
 scrollPositions.set(currentKey,window.scrollY);
 if(!pop){
  if(replace)history.replaceState({te:true},'',url.href);
  else history.pushState({te:true},'',url.href);
 }
 const key=pageKey(url);
 navigationBusy=true;
 try{
  let html=pageCache.get(key);
  if(!html){
   const response=await fetch(url.href,{credentials:'same-origin',cache:'no-cache'});
   if(!response.ok)throw new Error('পেজ লোড করা যায়নি');
   const text=await response.text();
   const doc=new DOMParser().parseFromString(text,'text/html');
   const incoming=doc.querySelector('main');
   if(!incoming)throw new Error('পেজের Content পাওয়া যায়নি');
   html=incoming.innerHTML;
   pageCache.set(key,html);
   // Keep the cache bounded on low-memory phones.
   if(pageCache.size>12)pageCache.delete(pageCache.keys().next().value);
  }
  const docPage=url.pathname.split('/').pop().replace('.html','')||'home';
  const pageName=docPage==='index'?'home':docPage;
  const main=document.querySelector('main');
  if(main){main.innerHTML=html;main.dataset.page=pageName}
  document.body.dataset.page=pageName;
  await renderCurrentPage();
  setActiveNavigation();
  const saved=scrollPositions.get(key);
  requestAnimationFrame(()=>window.scrollTo(0,saved||0));
 }catch(error){
  console.error(error);
  if(!pop)history.back();
  else location.href=url.href;
 }finally{navigationBusy=false}
}
function installRouter(){
 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a[href]');
  if(!a||a.target==='_blank'||a.hasAttribute('download')||a.getAttribute('href').startsWith('#'))return;
  const u=new URL(a.href,location.href);
  if(u.origin!==location.origin||u.pathname.includes('/admin/'))return;
  if(!/\.html?$/.test(u.pathname)&&u.pathname!==location.pathname)return;
  e.preventDefault();navigate(u.href);
 });
 window.addEventListener('popstate',()=>navigate(location.href,{pop:true,replace:true}));
}
async function start(){
 header();footer();installRouter();
 showLoadingState();
 // Keep the shared shell and page structure visible while Sheets responds.
 try{await TEStore.init();apiReady=true;db=TEStore.get()}
 catch(err){console.error('Store initialization:',err)}
 await renderCurrentPage();
}
window.TEApp={navigate,refresh:async()=>{await TEStore.init();await renderCurrentPage()},clearPageCache:()=>pageCache.clear()};
start();
// Arrow-key navigation for Android TV remotes and keyboard users.
document.addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
 const active=document.activeElement;
 if(active && ['INPUT','TEXTAREA','SELECT'].includes(active.tagName)) return;
 const nodes=[...document.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)')].filter(n=>n.getClientRects().length && getComputedStyle(n).visibility!=='hidden');
 if(!nodes.length)return;const idx=nodes.indexOf(active);
 if(idx<0){nodes[0].focus();e.preventDefault();return}
 const r=active.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
 const dirs={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},[dx,dy]=dirs[e.key];
 let best=null,score=Infinity;
 nodes.forEach(n=>{if(n===active)return;const q=n.getBoundingClientRect(),x=q.left+q.width/2-cx,y=q.top+q.height/2-cy,forward=x*dx+y*dy;if(forward<=4)return;const v=forward+Math.abs(x*dy-y*dx)*2.4;if(v<score){score=v;best=n}});
 if(best){best.focus();e.preventDefault()}
});

})();
