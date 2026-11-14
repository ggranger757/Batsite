(function () {
  var form = document.getElementById('book-form');
  var sent = document.getElementById('book-sent');
  var status = document.getElementById('f-status');
  var btn = document.getElementById('f-submit');
  var subject = document.getElementById('f-subject');
  var group = document.getElementById('group-field');
  var params = new URLSearchParams(location.search);

  function showSent() { form.hidden = true; sent.hidden = false; sent.focus(); }
  if (params.get('sent') === '1') { showSent(); return; }

  // Preselect the service from the link (book.html?type=shoot|lesson|paint-sip)
  var type = params.get('type');
  if (type) {
    var pre = form.querySelector('input[data-type="' + type + '"]');
    if (pre) pre.checked = true;
  }
  function syncGroup() {
    var c = form.querySelector('input[name="Service"]:checked');
    group.hidden = !!(c && c.getAttribute('data-type') === 'shoot');
  }
  form.addEventListener('change', syncGroup); syncGroup();

  function setErr(name, on) {
    var p = form.querySelector('.err[data-for="' + name + '"]');
    if (p) p.classList.toggle('show', on);
    form.querySelectorAll('[name="' + name + '"]').forEach(function (el) { el.setAttribute('aria-invalid', on ? 'true' : 'false'); });
  }
  function validate() {
    var ok = true, first = null;
    ['Service', 'Name', 'email', 'Availability'].forEach(function (n) {
      var els = form.querySelectorAll('[name="' + n + '"]');
      var good = n === 'Service'
        ? Array.prototype.some.call(els, function (e) { return e.checked; })
        : els[0].value.trim() !== '' && els[0].checkValidity();
      setErr(n, !good);
      if (!good) { ok = false; if (!first) first = els[0]; }
    });
    if (first) first.focus();
    return ok;
  }
  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () { setErr(el.name, false); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var c = form.querySelector('input[name="Service"]:checked');
    subject.value = 'Booking request: ' + c.value + ' — ' + form.Name.value.trim();
    btn.disabled = true; btn.textContent = 'Sending…';
    status.textContent = 'Sending your request…'; status.classList.remove('bad');
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    fetch('https://formsubmit.co/ajax/Bat.Favitsou@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.j.success) === 'true') { showSent(); }
        else { throw new Error(res.j && res.j.message || 'failed'); }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Send booking request';
        status.classList.add('bad');
        status.innerHTML = 'That didn’t go through. Please try again, or email <a href="mailto:Bat.Favitsou@gmail.com?subject=Booking%20request">Bat.Favitsou@gmail.com</a>.';
      });
  });
})();
