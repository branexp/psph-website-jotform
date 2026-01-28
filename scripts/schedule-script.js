// Add invalid style class on native validation errors
document.addEventListener(
  'invalid',
  (e) => {
    const t = e.target;
    if (t && t.classList) t.classList.add('is-invalid');
  },
  true
);

document.addEventListener(
  'input',
  (e) => {
    const t = e.target;
    if (t && t.validity) t.classList.toggle('is-invalid', !t.validity.valid);
  },
  true
);

function debounce(fn, delay = 150) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), delay);
  };
}

// ========== Data loading for autocomplete ==========
let __districts = null;
let __schools = null;
let __dataLoading = null;

async function loadDataIfNeeded() {
  if (__districts && __schools) return;
  if (!__dataLoading) {
    __dataLoading = Promise.all([
      fetch('/assets/data/districts.json', { cache: 'force-cache' }).then((r) => r.json()),
      fetch('/assets/data/schools.json', { cache: 'force-cache' }).then((r) => r.json())
    ])
      .then(([d, s]) => {
        __districts = Array.isArray(d) ? d : [];
        __schools = Array.isArray(s) ? s : [];
      })
      .catch((err) => {
        console.error('Failed to load data JSON:', err);
        __districts = __districts || [];
        __schools = __schools || [];
        throw err;
      });
  }
  await __dataLoading;
}

async function getDistricts() {
  await loadDataIfNeeded();
  return __districts || [];
}
async function getSchools() {
  await loadDataIfNeeded();
  return __schools || [];
}

function warmDataOn(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const warm = () => {
    loadDataIfNeeded().catch(() => {});
    el.removeEventListener('mouseenter', warm);
    el.removeEventListener('focus', warm);
  };
  el.addEventListener('mouseenter', warm, { once: true });
  el.addEventListener('focus', warm, { once: true });
}

// ========== Robust Autocomplete Component (ARIA) ==========
document.addEventListener('DOMContentLoaded', () => {
  warmDataOn('#school-district');
  warmDataOn('#school');

  // Add asterisk to required field labels without changing HTML
  document.querySelectorAll('.form-group').forEach((g) => {
    const input = g.querySelector('input[required], select[required], textarea[required]');
    const label = g.querySelector('label');
    if (input && label) label.classList.add('is-required');
  });

  class Autocomplete {
    constructor({ input, list, max = 20, provider }) {
      this.input = input;
      this.list = list;
      this.max = max;
      this.provider = provider; 
      this.items = [];
      this.activeIndex = -1;
      this.composing = false; 
      this.queryGen = 0; 

      this._setupA11y();
      this._bind();
    }

    _setupA11y() {
      this.input.setAttribute('role', 'combobox');
      this.input.setAttribute('aria-autocomplete', 'list');
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-controls', this._listId());
      this.list.id = this._listId();
      this.list.setAttribute('role', 'listbox');
      this._hide();
    }

    _listId() {
      return this.input.id + '-listbox';
    }

    _bind() {
      const onInput = debounce(() => this.search(this.input.value), 120);

      this.input.addEventListener('compositionstart', () => (this.composing = true));
      this.input.addEventListener('compositionend', () => {
        this.composing = false;
        onInput();
      });

      this.input.addEventListener('input', () => {
        if (!this.composing) onInput();
      });

      this.input.addEventListener('keydown', (e) => this._onKeyDown(e));

      // Close when leaving input/list (small delay lets clicks register)
      this.input.addEventListener('blur', () => setTimeout(() => this._maybeHide(), 120));
      this.list.addEventListener('blur', () => setTimeout(() => this._maybeHide(), 120), true);

      // Click-away
      document.addEventListener('click', (e) => {
        if (!this.input.contains(e.target) && !this.list.contains(e.target)) this._hide();
      });

      // Prevent blur on mousedown inside the list to make click selection reliable
      this.list.addEventListener('mousedown', (e) => e.preventDefault());
    }

    async search(raw) {
      const q = (raw || '').trim();
      this.activeIndex = -1;
      if (!q) {
        this.clear();
        this._hide();
        return;
      }

      // Show loading state
      this._renderLoading();

      const myGen = ++this.queryGen;
      let results = [];
      try {
        results = await this.provider(q);
      } catch {
        results = [];
      }
      if (myGen !== this.queryGen) return;

      results = this._dedupe(results).slice(0, this.max);
      this.render(results);
      if (results.length) this._show();
      else this._hide();
    }

    render(items) {
      this.items = items;
      this.list.innerHTML = '';
      items.forEach((text, i) => {
        const opt = document.createElement('div');
        opt.className = 'suggestion-item';
        opt.setAttribute('role', 'option');
        opt.id = `${this._listId()}-opt-${i}`;
        opt.textContent = text;
        opt.addEventListener('mouseenter', () => this._activate(i));
        opt.addEventListener('click', () => this._choose(i));
        this.list.appendChild(opt);
      });
    }

    clear() {
      this.items = [];
      this.list.innerHTML = '';
      this.activeIndex = -1;
      this.input.removeAttribute('aria-activedescendant');
    }

    _renderLoading() {
      this.list.innerHTML = '';
      const li = document.createElement('div');
      li.className = 'suggestion-item is-loading';
      li.textContent = 'Loading…';
      this.list.appendChild(li);
      this._show();
    }

    _activate(i) {
      const prev = this.list.querySelector('.suggestion-item.is-active');
      if (prev) prev.classList.remove('is-active');
      const node = this.list.children[i];
      if (node) {
        node.classList.add('is-active');
        this.activeIndex = i;
        this.input.setAttribute('aria-activedescendant', node.id);
        this._scrollIntoView(node);
      }
    }

    _choose(i) {
      const text = this.items[i];
      if (!text) return;
      this.input.value = text;
      this.clear();
      this._hide();
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    _onKeyDown(e) {
      if (e.key === 'ArrowDown') {
        if (!this.items.length) {
          this.search(this.input.value);
          return;
        }
        e.preventDefault();
        const next = (this.activeIndex + 1) % this.items.length;
        this._activate(next);
      } else if (e.key === 'ArrowUp') {
        if (!this.items.length) return;
        e.preventDefault();
        const next = (this.activeIndex - 1 + this.items.length) % this.items.length;
        this._activate(next);
      } else if (e.key === 'Enter') {
        if (this.activeIndex >= 0) {
          e.preventDefault();
          this._choose(this.activeIndex);
        }
      } else if (e.key === 'Escape') {
        this._hide();
        this.clear();
      }
    }

    _scrollIntoView(node) {
      const c = this.list.getBoundingClientRect();
      const n = node.getBoundingClientRect();
      if (n.top < c.top) node.scrollIntoView({ block: 'nearest' });
      else if (n.bottom > c.bottom) node.scrollIntoView({ block: 'nearest' });
    }

    _normalize(s) {
      return (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    }

    _dedupe(arr) {
      const seen = new Set();
      const out = [];
      for (const s of arr) {
        const k = (s || '').trim();
        if (!k) continue;
        const n = this._normalize(k);
        if (seen.has(n)) continue;
        seen.add(n);
        out.push(k);
      }
      return out;
    }

    _show() {
      this.list.hidden = false;
      this.input.setAttribute('aria-expanded', 'true');
    }
    _hide() {
      this.list.hidden = true;
      this.input.setAttribute('aria-expanded', 'false');
      this.input.removeAttribute('aria-activedescendant');
    }
    _maybeHide() {
      if (!this.input.matches(':focus') && !this.list.contains(document.activeElement)) this._hide();
    }
  }

  // Providers (simple, fast contains-match with diacritic-insensitivity)
  const contains = (arr, q, limit = 50) => {
    const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const nq = norm(q);
    const out = [];
    for (const s of arr) {
      if (out.length >= limit) break;
      const ns = norm(s);
      if (ns.includes(nq)) out.push(s);
    }
    return out;
  };

  const districtProvider = async (q) => {
    const d = await getDistricts();
    return contains(d, q, 200);
  };
  const schoolProvider = async (q) => {
    const s = await getSchools();
    return contains(s, q, 200);
  };

  // Instantiate both autocompletes
  const districtInput = document.getElementById('school-district');
  const districtList = document.getElementById('district-suggestions');
  if (districtInput && districtList) {
    new Autocomplete({ input: districtInput, list: districtList, max: 20, provider: districtProvider });
  }

  const schoolInput = document.getElementById('school');
  const schoolList = document.getElementById('school-suggestions');
  if (schoolInput && schoolList) {
    new Autocomplete({ input: schoolInput, list: schoolList, max: 12, provider: schoolProvider });
  }
});

// ========== Submit handler ==========
const form = document.getElementById('appointment-form');
const otherRadio = document.getElementById('other');
const otherTopicInput = document.getElementById('other-topic-input');

const toggleOtherField = () => {
  if (!otherTopicInput || !otherRadio) return;
  if (otherRadio.checked) {
    otherTopicInput.style.display = 'block';
    otherTopicInput.required = true;
  } else {
    otherTopicInput.style.display = 'none';
    otherTopicInput.required = false;
    otherTopicInput.value = '';
  }
};
document.querySelectorAll('input[name="topic"]').forEach((r) => r.addEventListener('change', toggleOtherField));
toggleOtherField();

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validate that at least one topic is selected
    const checkedTopics = document.querySelectorAll('input[name="topic"]:checked');
    if (checkedTopics.length === 0) {
      alert('Please select at least one topic you\'re interested in discussing.');
      return;
    }

    // Validate "Other" field if "Other" is selected
    if (otherRadio && otherRadio.checked && (!otherTopicInput || otherTopicInput.value.trim() === '')) {
      alert('Please specify your question in the "Other" field.');
      otherTopicInput?.focus();
      return;
    }

    const formData = new FormData(form);

    // Debug payload to console
    console.log('--- Form Data Being Sent to PHP ---');
    for (let [key, value] of formData.entries()) console.log(key + ': ' + value);
    console.log('-----------------------------------');

    try {
      const response = await fetch('send-email.php', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error(await response.text());

      const firstName = (document.getElementById('first-name')?.value || '').trim();
      const appointmentTime = (document.getElementById('appointment-time')?.value || '').trim();

      let topicValue = '';
      // Get all selected topics
      const checkedTopics = document.querySelectorAll('input[name="topic"]:checked');
      const topicValues = Array.from(checkedTopics).map(input => input.value);
      
      // Replace "Other" with the specific text if provided
      if (otherRadio && otherRadio.checked && otherTopicInput?.value.trim()) {
        const otherIndex = topicValues.indexOf('Other');
        if (otherIndex !== -1) {
          topicValues[otherIndex] = otherTopicInput.value.trim();
        }
      }
      
      topicValue = topicValues.join(', ');

      const redirectUrl = `confirmation.html?firstName=${encodeURIComponent(firstName)}&appointment=${encodeURIComponent(
        appointmentTime
      )}&topic=${encodeURIComponent(topicValue)}`;
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Submit error:', err);
      alert('There was a problem submitting your form. Please try again.');
    }
  });
}
