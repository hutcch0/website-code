(function () {
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function postLink(slug) {
    return "/html/post.html?slug=" + encodeURIComponent(slug);
  }

  function fillLatest(post) {
    var latest = document.querySelector(".latest-post");
    if (!latest) return;
    latest.textContent = "";
    latest.appendChild(el("p", "post-date", post.date_label));
    latest.appendChild(el("h2", "", post.title));
    if (post.summary) latest.appendChild(el("p", "", post.summary));
    var more = el("a", "read-more", "Read the post");
    more.href = postLink(post.slug);
    latest.appendChild(more);
  }

  function fillList(posts) {
    var live = document.getElementById("live-posts");
    if (!live) return;
    posts.forEach(function (post) {
      var article = el("article", "card");
      article.appendChild(el("span", "date", post.date_label));
      article.appendChild(el("h2", "", post.title));
      if (post.summary) article.appendChild(el("p", "", post.summary));
      var more = el("a", "read-more", "Read the post →");
      more.href = postLink(post.slug);
      article.appendChild(more);
      live.appendChild(article);
    });
  }

  function fillPost() {
    var root = document.getElementById("post-root");
    if (!root) return Promise.resolve();
    var slug = new URLSearchParams(location.search).get("slug") || "";
    if (!slug) {
      root.textContent = "";
      root.appendChild(el("h1", "", "Post not found"));
      root.appendChild(el("p", "", "This page needs a post link."));
      return Promise.resolve();
    }
    return fetch("/api/blog/posts/" + encodeURIComponent(slug), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("missing");
        return response.json();
      })
      .then(function (post) {
        document.title = post.title + " | Hutcch";
        root.textContent = "";
        root.appendChild(el("h1", "", post.title));
        root.appendChild(el("div", "post-meta", post.date_label));
        var content = el("div", "post-content");
        String(post.body || "").split(/\n\s*\n/).forEach(function (paragraph) {
          var text = paragraph.trim();
          if (!text) return;
          var node = document.createElement("p");
          text.split("\n").forEach(function (line, index) {
            if (index) node.appendChild(document.createElement("br"));
            node.appendChild(document.createTextNode(line));
          });
          content.appendChild(node);
        });
        root.appendChild(content);
      })
      .catch(function () {
        root.textContent = "";
        root.appendChild(el("h1", "", "Post not found"));
        root.appendChild(el("p", "", "That post is not on the site."));
      });
  }

  fillPost();

  fetch("/api/blog/posts", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("list");
      return response.json();
    })
    .then(function (data) {
      var posts = data.posts || [];
      if (!posts.length) return;
      fillList(posts);
      if (!document.getElementById("post-root")) fillLatest(posts[0]);
    })
    .catch(function () {});
})();
