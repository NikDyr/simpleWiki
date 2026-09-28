(function () {
  var root = document.documentElement, body = document.body;

  // Theme toggle
  var themeBtn = document.querySelector(".theme-btn");
  function isDark() {
    return root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  }
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.querySelector(".menu-btn"), scrim = document.querySelector(".scrim");
  function setNav(open) { body.classList.toggle("nav-open", open); if (menuBtn) menuBtn.setAttribute("aria-expanded", open); }
  if (menuBtn) menuBtn.addEventListener("click", function () { setNav(!body.classList.contains("nav-open")); });
  if (scrim) scrim.addEventListener("click", function () { setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  // Doc variant (?ua=appended): the manager's link picks it, the selector can change it
  function carryVariant() {
    var ua = root.dataset.ua;
    document.querySelectorAll("a[href]").forEach(function (a) {
      if (a.host !== location.host || a.getAttribute("href").charAt(0) === "#") return;
      var u = new URL(a.href);
      if (ua && ua !== "basic") u.searchParams.set("ua", ua); else u.searchParams.delete("ua");
      a.href = u.toString();
    });
  }
  function setVariant(ua) {
    root.dataset.ua = ua;
    try { localStorage.setItem("ua", ua); } catch (e) {}
    var u = new URL(location.href);
    if (ua === "basic") u.searchParams.delete("ua"); else u.searchParams.set("ua", ua);
    history.replaceState(null, "", u);
    carryVariant();
    document.querySelectorAll(".variant-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.variant === ua);
    });
  }
  carryVariant();

  var doc = document.querySelector(".doc"), main = document.querySelector(".content");
  if (!doc) return;

  // Heading ids + anchors
  var used = {};
  var heads = doc.querySelectorAll("h2, h3, h4");
  heads.forEach(function (h) {
    if (!h.id) {
      var base = h.textContent.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section";
      var id = base, n = 2;
      while (used[id] || document.getElementById(id)) id = base + "-" + n++;
      h.id = id;
    }
    used[h.id] = true;
    var a = document.createElement("a");
    a.className = "anchor"; a.href = "#" + h.id; a.textContent = "#"; a.setAttribute("aria-hidden", "true");
    h.prepend(a);
  });

  // Table of contents
  var toc = document.querySelector(".toc"), tocList = toc && toc.querySelector("ul");
  if (toc && heads.length >= 2) {
    heads.forEach(function (h) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = "#" + h.id; a.className = "l" + h.tagName[1];
      a.textContent = h.textContent.replace(/^#/, "").trim();
      li.appendChild(a); tocList.appendChild(li);
    });
    var tocLinks = tocList.querySelectorAll("a");
    var spy = function () {
      var cur = 0;
      heads.forEach(function (h, i) { if (h.getBoundingClientRect().top < 120) cur = i; });
      tocLinks.forEach(function (a, i) { a.classList.toggle("active", i === cur); });
    };
    addEventListener("scroll", spy, { passive: true }); spy();
  } else if (toc) {
    toc.hidden = true;
  }

  // Variant selector above the first variant block of each group
  var seen = [];
  doc.querySelectorAll(".variant").forEach(function (v) {
    var parent = v.parentNode;
    if (seen.indexOf(parent) !== -1) return;
    seen.push(parent);
    var group = parent.querySelectorAll(":scope > .variant");
    if (group.length < 2) return;
    var sw = document.createElement("div");
    sw.className = "variant-switch"; sw.setAttribute("role", "group");
    group.forEach(function (g) {
      var b = document.createElement("button");
      b.type = "button"; b.dataset.variant = g.dataset.variant;
      b.textContent = g.dataset.label || g.dataset.variant;
      b.setAttribute("aria-pressed", g.dataset.variant === root.dataset.ua);
      b.addEventListener("click", function () { setVariant(g.dataset.variant); });
      sw.appendChild(b);
    });
    parent.insertBefore(sw, group[0]);
  });

  // Copy buttons on code blocks
  doc.querySelectorAll("pre").forEach(function (pre) {
    var b = document.createElement("button");
    b.className = "copy-btn"; b.type = "button"; b.textContent = main.dataset.copy || "Copy";
    b.addEventListener("click", function () {
      var text = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
      navigator.clipboard.writeText(text).then(function () {
        b.textContent = main.dataset.copied || "Copied"; b.classList.add("done");
        setTimeout(function () { b.textContent = main.dataset.copy || "Copy"; b.classList.remove("done"); }, 1500);
      });
    });
    pre.appendChild(b);
  });

  // External links open in new tab
  doc.querySelectorAll('a[href^="http"]').forEach(function (a) {
    if (a.host !== location.host) { a.target = "_blank"; a.rel = "noopener"; }
  });

  // Image lightbox
  doc.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("click", function () {
      var box = document.createElement("div");
      box.className = "lightbox";
      box.innerHTML = '<img alt="">';
      box.firstChild.src = img.src;
      box.addEventListener("click", function () { box.remove(); });
      body.appendChild(box);
    });
  });
})();
