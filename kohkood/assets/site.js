
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',scrollY>40);onScroll();addEventListener('scroll',onScroll,{passive:true});
document.documentElement.classList.replace('no-js','js');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
// Rezdy modal: a fresh iframe per open so the spinner shows until the widget paints
// Rezdy insists on taking over the top window at checkout (its forms target _top) and offers no way back,
// so booking opens in its own centred window: our site stays open behind it, and closing the window returns the visitor here.
// Popup blocked or mobile → the link's target=_blank opens a new tab instead.
document.querySelectorAll('a[data-rezdy]').forEach(a=>a.addEventListener('click',e=>{
  if(matchMedia('(max-width:760px)').matches)return;
  const w=Math.min(820,screen.availWidth-40),h=Math.min(920,screen.availHeight-60);
  const left=Math.round((screen.availWidth-w)/2+(screen.availLeft||0)),top=Math.round((screen.availHeight-h)/2+(screen.availTop||0));
  const win=window.open(a.href,'rezdy','popup=yes,width='+w+',height='+h+',left='+left+',top='+top+',resizable=yes,scrollbars=yes');
  if(win){e.preventDefault();win.focus()}
}));
// Currency: THB is what you pay; other currencies are shown as an approximation
let cur;try{cur=localStorage.getItem('cur')}catch(e){}
cur=cur&&RATES[cur]?cur:document.body.dataset.cur;
const loc=document.documentElement.lang;
function applyCur(){document.querySelectorAll('.money').forEach(m=>{const n=+m.dataset.thb;
  if(cur==='THB'){m.innerHTML='<b>'+n.toLocaleString('en-US')+'</b> <i>THB</i>';return}
  const v=Math.round(n*RATES[cur]).toLocaleString(loc);
  m.innerHTML='<b>≈ '+v+'</b> <i>'+cur+'</i>'+(m.classList.contains('per')?'':'<small>'+n.toLocaleString('en-US')+' THB</small>')});
  document.querySelectorAll('.cur-code').forEach(s=>s.textContent=cur);document.querySelectorAll('select.cur-sel').forEach(s=>s.value=cur);document.querySelectorAll('.dd-menu [data-cur]').forEach(a=>a.classList.toggle('active',a.dataset.cur===cur))}
const setCur=c=>{cur=c;try{localStorage.setItem('cur',cur)}catch(e){}applyCur()};
document.querySelectorAll('.dd-menu [data-cur]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setCur(a.dataset.cur);a.closest('details').removeAttribute('open')}));
document.querySelectorAll('select.cur-sel').forEach(s=>s.addEventListener('change',()=>setCur(s.value)));
applyCur();
// Dropdowns: explicit toggling so only one is open and outside clicks close them
const dds=[...document.querySelectorAll('details.dd')];
dds.forEach(d=>d.querySelector('summary').addEventListener('click',e=>{e.preventDefault();const was=d.open;dds.forEach(x=>x.removeAttribute('open'));if(!was)d.setAttribute('open','')}));
document.addEventListener('click',e=>{if(!e.target.closest('details.dd'))dds.forEach(x=>x.removeAttribute('open'))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){dds.forEach(x=>x.removeAttribute('open'));closeMenu()}});
const mm=document.getElementById('mm'),burger=document.querySelector('.burger');
function openMenu(){mm.classList.add('open');burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';mm.querySelector('a,button').focus()}
function closeMenu(){if(!mm.classList.contains('open'))return;mm.classList.remove('open');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';burger.focus()}
window.openMenu=openMenu;window.closeMenu=closeMenu;
// Nav dropdowns: hover/focus opens via CSS; the caret button toggles for touch and keyboard, outside click closes
const subs=[...document.querySelectorAll('.nav-links .has-sub')];
subs.forEach(li=>{const t=li.querySelector('.sub-toggle');t.addEventListener('click',()=>{const open=!li.classList.contains('open');subs.forEach(x=>{x.classList.remove('open');x.querySelector('.sub-toggle').setAttribute('aria-expanded','false')});li.classList.toggle('open',open);t.setAttribute('aria-expanded',String(open))})});
document.addEventListener('click',e=>{if(!e.target.closest('.has-sub'))subs.forEach(x=>{x.classList.remove('open');x.querySelector('.sub-toggle').setAttribute('aria-expanded','false')})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){subs.forEach(x=>{x.classList.remove('open');x.querySelector('.sub-toggle').setAttribute('aria-expanded','false')});if(e.target.closest&&e.target.closest('.has-sub'))e.target.blur()}});
// Contact form: POST to the configured endpoint, else open the visitor's mail app with the message prefilled
const cf=document.querySelector('.cform');
if(cf){cf.addEventListener('submit',async e=>{e.preventDefault();if(!cf.reportValidity())return;const fd=new FormData(cf);if(fd.get('company'))return;
  const btn=cf.querySelector('button[type=submit]'),done=cf.querySelector('.fdone'),err=cf.querySelector('.ferr');
  const lines=['name','email','dates','interest','message'].map(k=>fd.get(k)?k+': '+fd.get(k):'').filter(Boolean).join('\n');
  if(!cf.action||cf.action===location.href){location.href='mailto:'+cf.dataset.mail+'?subject='+encodeURIComponent('Koh Kood Divers — '+(fd.get('interest')||'enquiry'))+'&body='+encodeURIComponent(lines);done.hidden=false;return}
  btn.disabled=true;try{const r=await fetch(cf.action,{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!r.ok)throw 0;cf.reset();done.hidden=false;err.hidden=true}catch(x){err.hidden=false}finally{btn.disabled=false}})}
