(function () {
    var form = document.getElementById("gb-form");
    var status = document.getElementById("gb-status");
    var list = document.getElementById("gb-list");
    var message = document.getElementById("gb-message");
    var count = document.getElementById("gb-count");
    var button = form.querySelector("button");

    function formatDate(iso) {
        var d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }

    function setStatus(text, kind) {
        status.textContent = text;
        status.className = "gb-status" + (kind ? " " + kind : "");
    }

    function renderEntries(entries) {
        list.replaceChildren();
        if (!entries.length) {
            var empty = document.createElement("li");
            empty.className = "gb-empty";
            empty.textContent = "No messages yet. Be the first!";
            list.appendChild(empty);
            return;
        }
        entries.forEach(function (entry) {
            var li = document.createElement("li");
            li.className = "gb-entry";

            var head = document.createElement("div");
            head.className = "gb-entry-head";

            var name = document.createElement("span");
            name.className = "gb-entry-name";
            name.textContent = entry.name;

            var date = document.createElement("span");
            date.className = "gb-entry-date";
            date.textContent = formatDate(entry.created_at);

            var text = document.createElement("p");
            text.className = "gb-entry-message";
            text.textContent = entry.message;

            head.appendChild(name);
            head.appendChild(date);
            li.appendChild(head);
            li.appendChild(text);
            list.appendChild(li);
        });
    }

    function loadEntries() {
        fetch("/api/guestbook/entries", { cache: "no-store" })
            .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
            .then(function (data) { renderEntries(data.entries || []); })
            .catch(function () {
                list.replaceChildren();
                var li = document.createElement("li");
                li.className = "gb-empty";
                li.textContent = "Couldn't load messages right now.";
                list.appendChild(li);
            });
    }

    message.addEventListener("input", function () {
        count.textContent = message.value.length + " / 500";
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var payload = {
            name: form.elements.name.value,
            message: form.elements.message.value,
            website: form.elements.website.value
        };
        if (!payload.name.trim() || !payload.message.trim()) {
            setStatus("Please fill in your name and a message.", "error");
            return;
        }
        button.disabled = true;
        setStatus("Sending...", "");
        fetch("/api/guestbook/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(function (res) {
                return res.json().catch(function () { return {}; }).then(function (data) {
                    if (!res.ok) throw new Error(data.error || "Something went wrong, try again later.");
                    return data;
                });
            })
            .then(function () {
                form.reset();
                count.textContent = "0 / 500";
                setStatus("Thanks! It'll appear once approved.", "ok");
            })
            .catch(function (err) {
                setStatus(err.message || "Something went wrong, try again later.", "error");
            })
            .then(function () { button.disabled = false; });
    });

    loadEntries();
})();
