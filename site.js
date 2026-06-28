/* ============================================================
   site.js  —  stock quotes (Finnhub) + nav + scroll reveal
   ------------------------------------------------------------
   >>> PUT YOUR FINNHUB API KEY ON THE NEXT LINE <<<
   This ships to the browser and is publicly visible (static site,
   no server). That is expected for a free Finnhub key. The key
   below was shared in plaintext earlier, so regenerate it in your
   Finnhub dashboard and paste the new one here.
   ============================================================ */
const FINNHUB_API_KEY = "d7mjle9r01qngrvof0vg";

/* Tickers shown as cards. label = short company tag under the price. */
const TICKERS = [
  { sym:"DSX",  co:"Diana Shipping (acquirer)" },
  { sym:"GNK",  co:"Genco Shipping (target)" },
  { sym:"PSHG", co:"Performance Shipping" },
  { sym:"SVRN", co:"OceanPal / SovereignAI" },
  { sym:"SBLK", co:"Star Bulk (bid partner)" },
];

async function loadQuotes(){
  const host = document.getElementById("quotes");
  if(!host) return;
  host.innerHTML = TICKERS.map(t => cardShell(t)).join("");

  await Promise.all(TICKERS.map(async t => {
    const el = document.getElementById("q-"+t.sym);
    try{
      const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(t.sym)}&token=${encodeURIComponent(FINNHUB_API_KEY)}`);
      const d = await r.json();
      if(d && typeof d.c === "number" && d.c > 0){
        const dir = d.d >= 0 ? "up" : "down";
        const sign = d.d >= 0 ? "+" : "";
        el.querySelector(".px").textContent = "$" + d.c.toFixed(2);
        const chg = el.querySelector(".chg");
        chg.classList.add(dir);
        chg.textContent = `${sign}${(d.d??0).toFixed(2)}  (${sign}${(d.dp??0).toFixed(2)}%)`;
      } else {
        el.querySelector(".px").textContent = "—";
        el.querySelector(".chg").textContent = "quote unavailable";
      }
    }catch(e){
      el.querySelector(".px").textContent = "—";
      el.querySelector(".chg").textContent = "quote unavailable";
    }
  }));
}

function cardShell(t){
  return `<div class="quote" id="q-${t.sym}">
    <div class="sym">${t.sym}<span>${t.sym==="DSX"||t.sym==="GNK"?"NYSE":"NASDAQ"}</span></div>
    <div class="px">…</div>
    <div class="chg">loading</div>
    <div class="co">${t.co}</div>
  </div>`;
}

/* mobile nav */
function initNav(){
  const t = document.querySelector(".navtoggle");
  const l = document.querySelector(".navlinks");
  if(t && l) t.addEventListener("click", ()=> l.classList.toggle("open"));
}

/* scroll reveal */
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion:reduce)").matches){
    els.forEach(e=>e.classList.add("in")); return;
  }
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target);} });
  },{threshold:.14});
  els.forEach(e=>io.observe(e));
}

document.addEventListener("DOMContentLoaded", ()=>{
  loadQuotes(); initNav(); initReveal();
});
