// Glossary popups: the first mention of each term on a page gets a popup with a short summary.
(function () {
  var dataEl = document.getElementById("glossary-data"), doc = document.querySelector(".doc");
  if (!dataEl || !doc) return;
  var terms = JSON.parse(dataEl.textContent), base = dataEl.dataset.base, more = dataEl.dataset.more || "→";

  // One combined regex; longer patterns first so "config request" wins over "config".
  var alts = [];
  terms.forEach(function (t, i) {
    (t.match || []).forEach(function (m) { alts.push({ src: m, i: i }); });
  });
  alts.sort(function (a, b) { return b.src.length - a.src.length; });
  if (!alts.length) return;
  var re = new RegExp("(?<![\\p{L}\\p{N}_])(?:" + alts.map(function (a) { return "(" + a.src + ")"; }).join("|") + ")(?![\\p{L}\\p{N}_])", "giu");
  var codeMap = {};
  terms.forEach(function (t, i) { (t.code || []).forEach(function (c) { codeMap[c] = i; }); });

  var used = {};
  var SKIP = "a, pre, code, h1, h2, h3, h4, h5, h6, summary, button, .gl-term, .variant-switch, .crumbs, .pager";
  var herePath = location.pathname.replace(/\/+$/, "/");

  function href(t) { return base + t.ref + "/" + (t.anchor ? "#" + t.anchor : ""); }
  function isHere(t) { return new URL(href(t), location.href).pathname === herePath && !t.anchor; }

  function wrap(el, i) {
    el.classList.add("gl-term");
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-expanded", "false");
    el.dataset.term = i;
  }

  // Inline code that exactly names a term (e.g. `url`)
  doc.querySelectorAll("code").forEach(function (c) {
    if (c.closest("pre") || c.closest("a, h1, h2, h3, h4, h5, h6, summary")) return;
    var i = codeMap[c.textContent.trim()];
    if (i === undefined || used[i]) return;
    used[i] = true;
    wrap(c, i);
  });

  // Plain text
  var walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      if (!n.nodeValue.trim() || n.parentElement.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (node) {
    var text = node.nodeValue, m, last = 0, frag = null;
    re.lastIndex = 0;
    while ((m = re.exec(text))) {
      var k = 1; while (m[k] === undefined) k++;
      var i = alts[k - 1].i;
      if (used[i]) continue;
      used[i] = true;
      frag = frag || document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var span = document.createElement("span");
      span.textContent = m[0];
      wrap(span, i);
      frag.appendChild(span);
      last = m.index + m[0].length;
    }
    if (frag) {
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  });

  // Popup
  var pop = document.createElement("div");
  pop.className = "gl-pop"; pop.id = "gl-pop"; pop.setAttribute("role", "tooltip"); pop.hidden = true;
  document.body.appendChild(pop);
  var current = null, hideTimer = null, shownAt = 0;

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); }

  function show(el) {
    clearTimeout(hideTimer);
    if (current !== el) shownAt = Date.now();
    if (current && current !== el) current.setAttribute("aria-expanded", "false");
    current = el;
    var t = terms[el.dataset.term];
    pop.innerHTML = "<strong>" + esc(t.term) + "</strong>" + fmt(t.summary) +
      (isHere(t) ? "" : '<br><a href="' + href(t) + '">' + esc(more) + " →</a>");
    pop.hidden = false;
    el.setAttribute("aria-expanded", "true");
    el.setAttribute("aria-describedby", "gl-pop");
    var r = el.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.min(Math.max(12, r.left + r.width / 2 - pw / 2), document.documentElement.clientWidth - pw - 12);
    var top = r.bottom + 8;
    if (top + ph > innerHeight - 8 && r.top - ph - 8 > 0) top = r.top - ph - 8;
    pop.style.left = left + scrollX + "px";
    pop.style.top = top + scrollY + "px";
    // the carried ?ua= variant is added to links by wiki.js; keep it here too
    if (document.documentElement.dataset.ua === "appended") {
      var a = pop.querySelector("a");
      if (a) { var u = new URL(a.href); u.searchParams.set("ua", "appended"); a.href = u; }
    }
  }
  function hide() {
    if (!current) return;
    current.setAttribute("aria-expanded", "false");
    current.removeAttribute("aria-describedby");
    current = null;
    pop.hidden = true;
  }
  function hideSoon() { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 180); }

  doc.addEventListener("mouseover", function (e) { var el = e.target.closest(".gl-term"); if (el) show(el); });
  doc.addEventListener("mouseout", function (e) { if (e.target.closest(".gl-term")) hideSoon(); });
  pop.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
  pop.addEventListener("mouseleave", hideSoon);
  doc.addEventListener("focusin", function (e) { var el = e.target.closest(".gl-term"); if (el) show(el); });
  doc.addEventListener("focusout", function (e) { if (e.target.closest(".gl-term") && !pop.contains(e.relatedTarget)) hideSoon(); });
  document.addEventListener("click", function (e) {
    var el = e.target.closest(".gl-term");
    // a tap fires mouseover then click: don't let the click close what the tap just opened
    if (el) { current === el && !pop.hidden && Date.now() - shownAt > 400 ? hide() : show(el); return; }
    if (!pop.contains(e.target)) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("gl-term")) { e.preventDefault(); show(e.target); }
  });
  addEventListener("scroll", function () { if (current && !pop.matches(":hover")) hide(); }, { passive: true });
})();
