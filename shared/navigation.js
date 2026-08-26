// shared/navigation.js
(function () {
  // Read and clear direction flag on page load → apply CSS animation class
  const dir = sessionStorage.getItem('pb_nav') || 'push';
  sessionStorage.removeItem('pb_nav');
  document.documentElement.setAttribute('data-nav', dir);

  function setDir(d) { sessionStorage.setItem('pb_nav', d); }

  window.navigation = {
    /** Push a new screen (slide in from right) */
    push(url) {
      setDir('push');
      window.location.href = url;
    },
    /** Go back (slide in from left — previous page animates in) */
    pop() {
      document.body.style.cssText =
        'animation: slideOutRight 280ms cubic-bezier(0.4,0,0.2,1) both;';
      // Define slideOutRight inline if styles.css isn't loaded yet
      if (!document.getElementById('pb-nav-style')) {
        const s = document.createElement('style');
        s.id = 'pb-nav-style';
        s.textContent = '@keyframes slideOutRight{from{transform:translateX(0)}to{transform:translateX(100%)}}';
        document.head.appendChild(s);
      }
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
      document.body.style.cssText =
        'animation: slideOutDown 300ms cubic-bezier(0.4,0,0.2,1) both;';
      if (!document.getElementById('pb-nav-style2')) {
        const s = document.createElement('style');
        s.id = 'pb-nav-style2';
        s.textContent = '@keyframes slideOutDown{from{transform:translateY(0)}to{transform:translateY(100%)}}';
        document.head.appendChild(s);
      }
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
