// This is a static site with no server, so the form validates in the
// browser and then opens a prefilled email in the visitor's own mail
// client. Swap this for a real form backend (Formspree, a small
// serverless function, etc.) if you want submissions to land somewhere
// without the visitor's mail app opening.
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var DEST_EMAIL = 'reginaadesuwa1@gmail.com';
  var fields = {
    name: { el: document.getElementById('cName'), validate: function (v) { return v.trim().length > 1; }, msg: 'Enter your name.' },
    email: { el: document.getElementById('cEmail'), validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Enter a valid email address.' },
    message: { el: document.getElementById('cMessage'), validate: function (v) { return v.trim().length > 9; }, msg: 'Say a little more (10+ characters).' }
  };
  var status = document.getElementById('formStatus');

  function setError(key, show) {
    var wrap = fields[key].el.closest('.field');
    wrap.classList.toggle('has-error', show);
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].el.addEventListener('input', function () {
      setError(key, !fields[key].validate(fields[key].el.value));
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var allValid = true;
    Object.keys(fields).forEach(function (key) {
      var valid = fields[key].validate(fields[key].el.value);
      setError(key, !valid);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      status.textContent = 'Check the highlighted fields above.';
      status.classList.add('show');
      return;
    }

    var name = fields.name.el.value.trim();
    var email = fields.email.el.value.trim();
    var message = fields.message.el.value.trim();

    var subject = encodeURIComponent('Portfolio contact — ' + name);
    var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:' + DEST_EMAIL + '?subject=' + subject + '&body=' + body;

    status.textContent = 'Opening your email app with this message ready to send…';
    status.classList.add('show');
    form.reset();
  });
})();
