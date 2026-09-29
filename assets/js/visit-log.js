// Visit alerts for Regina.
//
// How it decides "me" vs "someone else": this browser is marked as the
// owner's once it loads the site with ?owner=<passphrase> in the URL —
// that sets a flag in this browser's localStorage that lasts until the
// browser's storage is cleared. Every browser without that flag is
// treated as a visitor, and triggers one notification per page view.
//
// What this can and can't tell you: it reads standard, already-public
// technical signals a browser sends on every page load — an IP-based
// city/region guess, browser/OS string, which page, and what link (if
// any) brought them here. It CANNOT reveal a visitor's name or identity.
// A visitor who opens their browser's dev tools can also see this script
// running — there's no way to make client-side code truly invisible.
//
// Setup required before this sends anything: an EmailJS account (free
// tier), with the three IDs below filled in. Until then this fails
// silently and never blocks the page.
(function () {
  var OWNER_STORAGE_KEY = 'ra_site_owner_v1';
  var OWNER_PASSPHRASE = 'p3s9g1t2di5mpg'; // change this any time — just update it here

  var EMAILJS_PUBLIC_KEY = 'REPLACE_WITH_PUBLIC_KEY';
  var EMAILJS_SERVICE_ID = 'REPLACE_WITH_SERVICE_ID';
  var EMAILJS_TEMPLATE_ID = 'REPLACE_WITH_TEMPLATE_ID';

  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('owner') === OWNER_PASSPHRASE) {
      localStorage.setItem(OWNER_STORAGE_KEY, 'true');
    }
    if (localStorage.getItem(OWNER_STORAGE_KEY) === 'true') {
      return; // this is Regina's own browser — no log, no email
    }
  } catch (e) {
    return; // if storage is blocked, fail quiet rather than guess
  }

  function notify(location) {
    if (EMAILJS_PUBLIC_KEY.indexOf('REPLACE_WITH') === 0) return; // not configured yet

    var body = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        page: window.location.pathname,
        referrer: document.referrer || 'direct / typed URL / bookmark',
        user_agent: navigator.userAgent,
        time: new Date().toString(),
        approx_location: location
      }
    };

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).catch(function () { /* never block the page on a failed send */ });
  }

  fetch('https://get.geojs.io/v1/ip/geo.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var parts = [d.city, d.region, d.country_code].filter(Boolean);
      notify(parts.length ? parts.join(', ') + ' (' + d.ip + ')' : (d.ip || 'unknown'));
    })
    .catch(function () { notify('unknown'); });
})();
