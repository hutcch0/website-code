(function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var aurora = document.createElement("div");
    aurora.className = "aurora";
    aurora.setAttribute("aria-hidden", "true");
    aurora.innerHTML = "<span></span><span></span>";
    document.body.prepend(aurora);

    var path = location.pathname.replace(/\/+$/, "");
    document.querySelectorAll(".nav-links a").forEach(function (link) {
        var href = link.getAttribute("href") || "";
        if (path === href || path.endsWith(href)) {
            link.setAttribute("aria-current", "page");
        }
    });

    var cards = document.querySelectorAll(
        ".glass-box, .card, .project-card, .hero-card, .profile-card, .post-card, .update-card, .sidebar-box, .latest-post, .home-hero, .home-project, .not-found-card"
    );
    cards.forEach(function (card) {
        card.classList.add("glow");
        if (reduce) return;
        card.addEventListener("pointermove", function (event) {
            var rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
            card.style.setProperty("--my", (event.clientY - rect.top) + "px");
        });
    });
})();
