// Tasteful scroll-reveal. Progressive enhancement: elements only get hidden if
// JS runs and the visitor hasn't asked for reduced motion — otherwise everything
// renders normally.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var targets = [];
  document.querySelectorAll("main > section:not(.hero) > .wrap > *").forEach(function (el) { targets.push(el); });

  if (!targets.length) return;
  targets.forEach(function (el) { el.classList.add("reveal"); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  targets.forEach(function (el) { io.observe(el); });
})();

// Contact form — submits to Web3Forms via fetch so the visitor stays on the page.
// Paste your access key into the hidden "access_key" input in index.html.

(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var note = document.getElementById("form-note");
  var button = form.querySelector('button[type="submit"]');
  var buttonLabel = button ? button.textContent : "Send";

  function setNote(text, tone) {
    note.textContent = text;
    note.style.color = tone === "error" ? "var(--text-dim)" : "var(--accent)";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !validEmail || !message) {
      setNote("Add your name, a valid email, and a line about your brand.", "error");
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    setNote("", "ok");

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          setNote("Thanks " + name + ". Your message is on its way. I'll be in touch.", "ok");
          form.reset();
        } else {
          setNote(data.message || "Something went wrong. Email me directly instead.", "error");
        }
      })
      .catch(function () {
        setNote("Couldn't send right now. Check your connection or email me directly.", "error");
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = buttonLabel;
      });
  });
})();
