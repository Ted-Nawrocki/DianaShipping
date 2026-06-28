/* ============================================================
   site.js — nav + scroll reveal + optional resilient quotes
   ============================================================ */
const FINNHUB_API_KEY = "d7mjle9r01qngrvof0vg";
const QUOTE_TIMEOUT_MS = 8000;

const TICKERS = [
  { sym:"DSX",  co:"Diana Shipping (acquirer)" },
  { sym:"GNK",  co:"Genco Shipping (target)" },
  { sym:"PSHG", co:"Performance Shipping" },
  { sym:"SVRN", co:"OceanPal / SovereignAI" },
  { sym:"SBLK", co:"Star Bulk (bid partner)" },
];

function initNav(){
  const t = document.querySelector(".navtoggle");
  const l = document.querySelector(".navlinks");
  if(t && l) t.addEventListener("click", ()=> l.classList.toggle("open"));
}

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

async function optionalQuoteHealthCheck(){
  const host = document.getElementById("quotes");
  if(!host || document.getElementById("quote-grid")) return;
  host.innerHTML = TICKERS.map(t => `<div class="quote"><div class="sym">${t.sym}</div><div class="px">quotes load on the home page</div></div>`).join("");
}

document.addEventListener("DOMContentLoaded", ()=>{
  initNav();
  initReveal();
  optionalQuoteHealthCheck();
});
