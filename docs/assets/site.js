/* DOPPELGÄNGER.md — CC0 1.0. No dependencies. */
(function () {
  "use strict";

  /* copy buttons: data-copy="<id of a <template> or element>" */
  function textFor(btn) {
    var src = document.getElementById(btn.getAttribute("data-copy"));
    if (!src) return "";
    return (src.content ? src.content.textContent : src.textContent).replace(/^\n/, "");
  }

  function flash(btn, label, ok) {
    btn.textContent = ok ? "Copied" : "Copy failed";
    btn.setAttribute("aria-live", "polite");
    setTimeout(function () { btn.textContent = label; }, 1800);
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener("click", function () {
      var text = textFor(btn);
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { flash(btn, label, true); },
          function () { flash(btn, label, false); }
        );
        return;
      }
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      flash(btn, label, ok);
    });
  });

  /* fig. 1 draws itself once, when it comes into view */
  var fig = document.getElementById("fig");
  if (!fig) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    fig.classList.add("is-in");
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        fig.classList.add("is-in");
        io.disconnect();
      }
    });
  }, { threshold: 0.12 });
  io.observe(fig);
})();
