(function () {
    var script = document.currentScript;
    var countHit = script && script.hasAttribute("data-count-hit");

    function formatDate(iso) {
        var parts = String(iso).split("-");
        if (parts.length !== 3) return "";
        return "(" + parts[2] + "/" + parts[1] + "/" + parts[0].slice(2) + ")";
    }

    function render(data) {
        var views = Number(data.views).toLocaleString("en-GB");
        var date = formatDate(data.date);
        document.querySelectorAll("[data-site-views]").forEach(function (el) {
            el.textContent = views;
        });
        document.querySelectorAll("[data-site-views-date]").forEach(function (el) {
            el.textContent = date;
        });
    }

    function load() {
        fetch("/api/site-views", { cache: "no-store" })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) { if (data) render(data); })
            .catch(function () {});
    }

    if (countHit) {
        fetch("/api/site-views/hit", { method: "POST", keepalive: true })
            .catch(function () {})
            .then(load);
    } else {
        load();
    }
})();
