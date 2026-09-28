(function () {
  var input = document.getElementById("search"), out = document.getElementById("results");
  if (!input) return;
  var index = null, sel = -1;
  function load() {
    if (index) return Promise.resolve(index);
    return fetch(input.dataset.index).then(function (r) { return r.json(); }).then(function (d) { return (index = d); });
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hl(s, q) {
    var i = s.toLowerCase().indexOf(q);
    return i < 0 ? esc(s) : esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length));
  }
  function links() { return out.querySelectorAll("a"); }
  function mark() { links().forEach(function (a, i) { a.classList.toggle("sel", i === sel); if (i === sel) a.scrollIntoView({ block: "nearest" }); }); }
  function run() {
    var q = input.value.trim().toLowerCase();
    sel = -1;
    if (!q) { out.hidden = true; return; }
    load().then(function (pages) {
      var hits = pages.filter(function (p) { return p.lang === input.dataset.lang && (p.title + " " + p.text).toLowerCase().indexOf(q) !== -1; })
        .sort(function (a, b) { return (b.title.toLowerCase().indexOf(q) !== -1) - (a.title.toLowerCase().indexOf(q) !== -1); });
      out.innerHTML = hits.length
        ? hits.slice(0, 12).map(function (p) {
            var i = p.text.toLowerCase().indexOf(q), snip = i < 0 ? "" : (i > 50 ? "…" : "") + p.text.slice(Math.max(0, i - 50), i + 90) + "…";
            return '<li><a href="' + p.url + '"><strong>' + hl(p.title, q) + "</strong><small>" + hl(snip, q) + "</small></a></li>";
          }).join("")
        : '<li class="empty">' + esc(input.dataset.empty) + "</li>";
      out.hidden = false;
    });
  }
  input.addEventListener("input", run);
  input.addEventListener("focus", function () { if (input.value.trim()) run(); });
  input.addEventListener("keydown", function (e) {
    var n = links().length;
    if (e.key === "ArrowDown" && n) { sel = (sel + 1) % n; mark(); e.preventDefault(); }
    else if (e.key === "ArrowUp" && n) { sel = (sel - 1 + n) % n; mark(); e.preventDefault(); }
    else if (e.key === "Enter") { var a = links()[sel < 0 ? 0 : sel]; if (a) location.href = a.href; }
    else if (e.key === "Escape") { input.value = ""; out.hidden = true; input.blur(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".search-wrap")) out.hidden = true; });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
})();
