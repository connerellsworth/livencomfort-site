/* Live-n-Comfort site script.
   Analytics load only on the production hostnames, so local previews and
   Netlify preview links never send data. */
(function () {
  "use strict";

  var GA_ID = "G-F05MV209RF";
  var CLARITY_ID = "zcq5c0q2ff";
  var host = window.location.hostname;
  var isProduction = host === "livencomfort.com" || host === "www.livencomfort.com";

  // ---------- Consent ----------
  // The visitor's choice is "accepted", "declined" or null (not chosen yet).
  // A Global Privacy Control signal always counts as "declined".
  var STORAGE_KEY = "lnc-analytics";
  var hasGPC = navigator.globalPrivacyControl === true;
  var analyticsLoaded = false;

  function readChoice() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "accepted" || value === "declined" ? value : null;
    } catch (e) {
      return null;
    }
  }

  // If storage is blocked the choice still applies to this page, just not the next one.
  function saveChoice(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage blocked */ }
  }

  var choice = hasGPC ? "declined" : readChoice();

  function loadAnalytics() {
    if (!isProduction || analyticsLoaded) return;
    analyticsLoaded = true;

    // Google Analytics 4. Consent defaults must run before js and config.
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      region: ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH"]
    });
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(ga);

    // Microsoft Clarity (standard loader)
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  function grantStoredAcceptance() {
    if (!analyticsLoaded) return;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  }

  function decline() {
    choice = "declined";
    saveChoice("declined");
    if (!analyticsLoaded) return;
    window["ga-disable-" + GA_ID] = true;
    window.gtag("consent", "update", { analytics_storage: "denied" });
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    try { window.clarity("consent", false); } catch (e) { /* legacy API missing */ }
  }

  function accept() {
    choice = "accepted";
    saveChoice("accepted");
    if (!analyticsLoaded) {
      loadAnalytics();
      grantStoredAcceptance();
      return;
    }
    // Declined earlier on this same page, so the tools are already here.
    window["ga-disable-" + GA_ID] = false;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
    try { window.clarity("consent"); } catch (e) { /* legacy API missing */ }
  }

  if (choice !== "declined") {
    loadAnalytics();
    if (choice === "accepted") grantStoredAcceptance();
  }

  // ---------- Cookie notice ----------
  // A plain fixed bar, not a dialog: it never takes focus on load and never traps focus.
  var banner = null;
  var returnFocusTo = null;

  function setBannerSpace(px) {
    var value = px ? px + "px" : "";
    document.documentElement.style.scrollPaddingBottom = value;
    document.body.style.paddingBottom = value;
  }

  function renderBanner() {
    if (!banner) {
      banner = document.createElement("section");
      banner.className = "cookie-banner";
      banner.setAttribute("aria-labelledby", "cookie-banner-title");
      var skip = document.querySelector(".skip-link");
      if (skip) skip.insertAdjacentElement("afterend", banner);
      else document.body.insertBefore(banner, document.body.firstChild);

      banner.addEventListener("click", function (event) {
        var button = event.target.closest && event.target.closest("[data-consent]");
        if (!button) return;
        var action = button.getAttribute("data-consent");
        if (action === "accept") accept();
        else if (action === "decline") decline();
        closeBanner();
      });

      if ("ResizeObserver" in window) {
        new ResizeObserver(function () {
          if (!banner.hidden) setBannerSpace(banner.offsetHeight);
        }).observe(banner);
      }
    }

    var actions = hasGPC
      ? '<button type="button" class="cookie-banner__btn" data-consent="close">Close</button>'
      : '<button type="button" class="cookie-banner__btn" data-consent="accept">Accept</button>' +
        '<button type="button" class="cookie-banner__btn" data-consent="decline">Decline</button>';
    var message = hasGPC
      ? "Your browser’s Global Privacy Control signal is on, so analytics are off."
      : "We use Google Analytics and Microsoft Clarity to see how people use this site. It’s your choice.";

    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<div class="cookie-banner__text">' +
          '<h2 class="cookie-banner__title" id="cookie-banner-title" tabindex="-1">Cookies on this site</h2> ' +
          '<p>' + message + ' <a href="/privacy/">Privacy</a></p>' +
        '</div>' +
        '<div class="cookie-banner__actions">' + actions + '</div>' +
      '</div>';
    banner.hidden = false;
    setBannerSpace(banner.offsetHeight);
  }

  function closeBanner() {
    var focusWasInside = banner.contains(document.activeElement);
    banner.hidden = true;
    setBannerSpace(0);
    if (returnFocusTo) {
      returnFocusTo.focus();
      returnFocusTo = null;
    } else if (focusWasInside) {
      var main = document.getElementById("main");
      if (main) main.focus();
    }
  }

  if (choice === null) renderBanner();

  document.addEventListener("click", function (event) {
    var opener = event.target.closest && event.target.closest("[data-cookie-settings]");
    if (!opener) return;
    returnFocusTo = opener;
    renderBanner();
    banner.querySelector("#cookie-banner-title").focus();
  });

  // Keyboard focus inside the Google Map iframe does not match :focus in this
  // page, so mark the map wrapper while the map has focus to keep a visible ring.
  var mapFrame = document.querySelector(".map-frame");
  if (mapFrame) {
    var mapWrap = mapFrame.parentNode;
    window.addEventListener("blur", function () {
      setTimeout(function () {
        mapWrap.classList.toggle("has-focus", document.activeElement === mapFrame);
      }, 0);
    });
    window.addEventListener("focus", function () { mapWrap.classList.remove("has-focus"); });
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
