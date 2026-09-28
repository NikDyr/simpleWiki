(function () {
  var input = document.getElementById("search"), out = document.getElementById("results");
  if (!input) return;
  var index = null;
  function load() {
    if (index) return Promise.resolve(index);
    return fetch(input.dataset.index).then(function (r) { return r.json(); }).then(function (d) { return (index = d); });
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    if (!q) { out.hidden = true; return; }
    load().then(function (pages) {
      var hits = pages.filter(function (p) {
        return p.lang === input.dataset.lang && (p.title + " " + p.text).toLowerCase().indexOf(q) !== -1;
      });
      out.innerHTML = hits.length
        ? hits.map(function (p) {
            var i = p.text.toLowerCase().indexOf(q), snip = i < 0 ? "" : p.text.slice(Math.max(0, i - 40), i + 80);
            return '<li><a href="' + p.url + '">' + esc(p.title) + "</a><small>" + esc(snip) + "</small></li>";
          }).join("")
        : "<li>" + esc(input.dataset.empty) + "</li>";
      out.hidden = false;
    });
  });
})();
