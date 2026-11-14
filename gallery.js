// Placeholders: show a photo once the matching file exists in /images.
document.querySelectorAll('[data-img]').forEach(function (el) {
  var src = el.getAttribute('data-img');
  var img = new Image();
  img.onload = function () { el.style.backgroundImage = 'url("' + src + '")'; el.classList.add('loaded'); };
  img.src = src;
});

// Lightbox: click a gallery photo to view it large; arrows / swipe-free buttons to move, Esc to close.
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.m-item'));
  if (!items.length) return;
  var icon = function (d) { return '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"></path></svg>'; };
  var lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = '<img alt=""><p class="lb-cap"></p>' +
    '<button class="lb-close" aria-label="Close">' + icon('M6 6l12 12M18 6L6 18') + '</button>' +
    '<button class="lb-prev" aria-label="Previous photo">' + icon('M15 18l-6-6 6-6') + '</button>' +
    '<button class="lb-next" aria-label="Next photo">' + icon('M9 6l6 6-6 6') + '</button>';
  document.body.appendChild(lb);
  var big = lb.querySelector('img'), cap = lb.querySelector('.lb-cap'), cur = 0, last = null;
  function show(i) {
    cur = (i + items.length) % items.length;
    var a = items[cur], t = a.querySelector('img');
    big.src = a.getAttribute('href'); big.alt = t.alt; cap.textContent = t.alt;
  }
  function open(i) { last = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); }
  items.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); open(i); }); });
  lb.querySelector('.lb-close').onclick = close;
  lb.querySelector('.lb-prev').onclick = function () { show(cur - 1); };
  lb.querySelector('.lb-next').onclick = function () { show(cur + 1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
})();
