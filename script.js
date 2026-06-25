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
