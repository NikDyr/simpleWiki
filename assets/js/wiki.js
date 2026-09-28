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

  // Tabs: <div class="tabs"><section data-tab="Label">…</section>…</div>
  doc.querySelectorAll(".tabs").forEach(function (box, n) {
    var sections = box.querySelectorAll(":scope > section");
    if (sections.length < 2) return;
    var list = document.createElement("div");
    list.className = "tab-list"; list.setAttribute("role", "tablist");
    sections.forEach(function (sec, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.textContent = sec.dataset.tab;
      b.id = "tab-" + n + "-" + i; sec.setAttribute("role", "tabpanel"); sec.setAttribute("aria-labelledby", b.id);
      b.addEventListener("click", function () {
        list.querySelectorAll("button").forEach(function (x, j) { x.setAttribute("aria-selected", j === i); sections[j].hidden = j !== i; });
      });
      list.appendChild(b);
    });
    box.prepend(list);
    box.classList.add("ready");
    list.firstChild.click();
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
