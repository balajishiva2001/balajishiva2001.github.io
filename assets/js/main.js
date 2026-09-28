(function () {
  'use strict';

  /* ── footer year ────────────────────────────────────── */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── section observer: reveal + active index ─────────── */
  var bands = [].slice.call(
    document.querySelectorAll('main section[id]:not([data-no-reveal])')
  );

  bands.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    bands.forEach(function (el) { revealer.observe(el); });

    var links = [].slice.call(document.querySelectorAll('[data-rail], .topnav a'));
    var byId = {};
    links.forEach(function (a) {
      var key = a.getAttribute('data-rail') || (a.getAttribute('href') || '').slice(1);
      if (key) (byId[key] = byId[key] || []).push(a);
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var group = byId[entry.target.id];
        if (!group) return;
        group.forEach(function (a) { a.classList.toggle('is-active', entry.isIntersecting); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    bands.forEach(function (el) { spy.observe(el); });
  } else {
    bands.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── smooth scroll fallback ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#' || href.indexOf('#') !== 0) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, null, href);
      }
    });
  });

  /* ── unique visitor counter ──────────────────────────── */
  var counterEl = document.getElementById('unique-visitor-count');
  if (counterEl) {
    var hasVisited = localStorage.getItem('has_visited_portfolio');
    var key = 'balajishiva2001_portfolio_unique';
    var baseUrl = 'https://countapi.mileshilliard.com/api/v1';
    var url = hasVisited ? (baseUrl + '/get/' + key) : (baseUrl + '/hit/' + key);

    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        counterEl.textContent = data.value;
        if (!hasVisited) {
          localStorage.setItem('has_visited_portfolio', 'true');
        }
      })
      .catch(function(err) {
        console.error('Error fetching counter:', err);
        counterEl.textContent = 'N/A';
      });
  }

})();
