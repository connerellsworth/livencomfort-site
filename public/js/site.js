/* Live-n-Comfort site script.
   Analytics load only on the production hostnames, so local previews and
   Netlify preview links never send data. */
(function () {
  "use strict";

  var GA_ID = "G-F05MV209RF";
  var CLARITY_ID = "zcq5c0q2ff";
  var host = window.location.hostname;
  var isProduction = host === "livencomfort.com" || host === "www.livencomfort.com";

  if (isProduction) {
    // Google Analytics 4
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(ga);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    // Microsoft Clarity (standard loader)
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  // One delegated listener for tracked clicks. Sends only if gtag exists.
  document.addEventListener("click", function (event) {
    if (typeof window.gtag !== "function" || !event.target.closest) return;
    var link = event.target.closest('[data-track="get_directions"], a[href^="mailto:"]');
    if (!link) return;
    var name = link.getAttribute("data-track") === "get_directions" ? "get_directions" : "email_click";
    window.gtag("event", name, { link_location: window.location.pathname });
  });
})();
