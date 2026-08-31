// shared/navigation.js
(function () {
  // Read and clear direction flag on page load → apply CSS animation class
  const dir = sessionStorage.getItem('pb_nav') || 'push';
  sessionStorage.removeItem('pb_nav');
  document.documentElement.setAttribute('data-nav', dir);

  function setDir(d) { sessionStorage.setItem('pb_nav', d); }

  /* ⚠️ A page restored from the back/forward cache does not re-run this script, so
     without this the flag set by pop() is never consumed: the restored page keeps the
     `data-nav` it was first loaded with (measured: going back to the editor left it on
     'push') and a stale 'pop' sits in sessionStorage waiting to misdirect whatever
     navigates next. `pageshow` with `persisted` is the only signal for that restore. */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var d = sessionStorage.getItem('pb_nav') || 'pop';
    sessionStorage.removeItem('pb_nav');
    document.documentElement.setAttribute('data-nav', d);
  });

  /* The exit animations run on the screen wrapper, never on <body> — same reason
     as the enter animations in styles.css: a transform on <body> makes it the
     containing block for the wrapper's `position:fixed; inset:0`, and in the iOS
     standalone PWA <body>'s box is shorter than the screen, so the page would
     shrink off the bottom edge for the duration of the transition.
     Set `style.animation` only; cssText would wipe the wrapper's React styles. */
  function animateOut(keyframes, css, ms) {
    if (!document.getElementById('pb-nav-' + keyframes)) {
      const s = document.createElement('style');
      s.id = 'pb-nav-' + keyframes;
      s.textContent = css;
      document.head.appendChild(s);
    }
    const root = document.getElementById('root');
    const el = (root && root.firstElementChild) || document.body;
    el.style.animation = keyframes + ' ' + ms + 'ms cubic-bezier(0.4,0,0.2,1) both';
  }

  window.navigation = {
    /** Push a new screen (slide in from right) */
    push(url) {
      setDir('push');
      window.location.href = url;
    },
    /** Go back (slide in from left — previous page animates in) */
    pop() {
      animateOut('slideOutRight',
        '@keyframes slideOutRight{from{transform:translateX(0)}to{transform:translateX(100%)}}', 280);
      setDir('pop');
      setTimeout(() => window.history.back(), 270);
    },
    /** Present a sheet (slide up from bottom) */
    modal(url) {
      setDir('modal');
      window.location.href = url;
    },
    /** Dismiss a sheet (slide down, then go back) */
    dismiss() {
      animateOut('slideOutDown',
        '@keyframes slideOutDown{from{transform:translateY(0)}to{transform:translateY(100%)}}', 300);
      setDir('pop');
      setTimeout(() => window.history.back(), 290);
    },
    /** Replace current page (fade — no back entry) */
    replace(url) {
      setDir('replace');
      window.location.replace(url);
    },
  };
})();
