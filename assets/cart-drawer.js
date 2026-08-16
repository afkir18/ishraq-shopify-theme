(function () {
  var config = window.IshraqCart || {};
  var drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;

  var panel = drawer.querySelector('.ishraq-cart-drawer__panel');
  var contents = drawer.querySelector('[data-cart-drawer-contents]');
  var footer = drawer.querySelector('[data-cart-drawer-footer]');
  var totalEl = drawer.querySelector('[data-cart-drawer-total]');
  var checkoutBtn = drawer.querySelector('[data-cart-drawer-checkout]');
  var openTriggers = document.querySelectorAll('[data-cart-drawer-open]');
  var closeTriggers = drawer.querySelectorAll('[data-cart-drawer-close]');
  var countBadges = document.querySelectorAll('[data-cart-count]');
  var removeIcon =
    '<svg class="ishraq-cart-drawer__remove-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
    '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m2 0v9.5A1.5 1.5 0 0 1 12.5 17h-5A1.5 1.5 0 0 1 6 15.5V6h8z"/>' +
    '</svg>';

  function formatMoney(cents) {
    var amount = (Number(cents) / 100).toFixed(2);
    var format = config.moneyFormat || '{{amount}} MAD';
    return format
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, amount.replace('.', ','))
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, String(Math.round(Number(cents) / 100)))
      .replace(/\{\{\s*amount\s*\}\}/g, amount);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateCountBadge(count) {
    countBadges.forEach(function (badge) {
      if (count > 0) {
        badge.textContent = String(count);
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    });

    openTriggers.forEach(function (trigger) {
      trigger.setAttribute(
        'aria-label',
        count > 0 ? 'السلة (' + count + ')' : 'السلة'
      );
    });
  }

  function renderCart(cart) {
    updateCountBadge(cart.item_count);

    if (!cart.items.length) {
      contents.innerHTML =
        '<p class="ishraq-cart-drawer__empty">السلّة فارغة.</p>' +
        '<a class="btn btn--secondary ishraq-cart-drawer__shop" href="' +
        escapeHtml(config.collectionUrl || '/collections/all') +
        '">شوفي منتجاتنا</a>';
      footer.hidden = true;
      return;
    }

    var html = '<ul class="ishraq-cart-drawer__list">';
    cart.items.forEach(function (item) {
      var variantLabel = item.variant_title && item.variant_title !== 'Default Title'
        ? item.variant_title
        : '';
      var image = item.image
        ? '<img src="' + escapeHtml(item.image) + '" alt="" width="64" height="64" loading="lazy">'
        : '';
      html +=
        '<li class="ishraq-cart-drawer__item">' +
        image +
        '<div><p class="ishraq-cart-drawer__item-title">' + escapeHtml(item.product_title) + '</p>' +
        (variantLabel
          ? '<p class="ishraq-cart-drawer__item-meta">' + escapeHtml(variantLabel) + ' · ' + formatMoney(item.final_line_price) + '</p>'
          : '<p class="ishraq-cart-drawer__item-meta">' + formatMoney(item.final_line_price) + '</p>') +
        '</div>' +
        '<button type="button" class="ishraq-cart-drawer__remove" data-cart-remove="' + escapeHtml(item.key) + '" aria-label="حذف">' +
        removeIcon +
        '</button>' +
        '</li>';
    });
    html += '</ul>';
    contents.innerHTML = html;
    totalEl.textContent = formatMoney(cart.total_price);
    footer.hidden = false;
  }

  function fetchCart() {
    return fetch('/cart.js', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('cart_fetch_failed');
      return res.json();
    });
  }

  function refreshCart() {
    contents.innerHTML = '<p class="ishraq-cart-drawer__loading">جاري التحميل...</p>';
    return fetchCart()
      .then(renderCart)
      .catch(function () {
        contents.innerHTML = '<p class="ishraq-cart-drawer__empty">تعذّر تحميل السلة.</p>';
      });
  }

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ishraq-cart-open');
    refreshCart().then(function () {
      panel.focus();
    });
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ishraq-cart-open');
  }

  function changeLine(key, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ id: key, quantity: quantity })
    }).then(function (res) {
      if (!res.ok) throw new Error('cart_change_failed');
      return res.json();
    });
  }

  function addToCart(form) {
    var formData = new FormData(form);
    return fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      body: formData
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw data;
        return data;
      });
    });
  }

  openTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openDrawer();
    });
  });

  closeTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      closeDrawer();
    });
  });

  drawer.addEventListener('click', function (event) {
    if (event.target.closest('.ishraq-cart-drawer__shop')) {
      closeDrawer();
    }

    var removeBtn = event.target.closest('[data-cart-remove]');
    if (!removeBtn) return;
    removeBtn.disabled = true;
    changeLine(removeBtn.getAttribute('data-cart-remove'), 0)
      .then(renderCart)
      .catch(function () {
        removeBtn.disabled = false;
      });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.matches('form[action*="/cart/add"]')) return;

    event.preventDefault();
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    addToCart(form)
      .then(function () {
        return fetchCart();
      })
      .then(function (cart) {
        renderCart(cart);
        openDrawer();
      })
      .catch(function () {
        form.submit();
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });

  fetchCart().then(renderCart).catch(function () {});
})();
