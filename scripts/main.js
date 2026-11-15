(function () {
  'use strict';

  // Booking rules mirror the JotForm appointment field (form 251803846453157):
  // Monday-Friday only, at least 7 days' notice, up to 90 days ahead.
  var BOOKING = {
    weekdays: [1, 2, 3, 4, 5],
    minNoticeDays: 7,
    maxDaysAhead: 90
  };

  var MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function initMobileMenu() {
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var mobileNav = document.querySelector('.mobile-nav');

    if (!menuBtn || !mobileNav) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);

    function setOpen(open) {
      mobileNav.classList.toggle('active', open);
      menuBtn.classList.toggle('active', open);
      backdrop.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    menuBtn.addEventListener('click', function () {
      setOpen(!mobileNav.classList.contains('active'));
    });
    backdrop.addEventListener('click', function () { setOpen(false); });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        setOpen(false);
        menuBtn.focus();
      }
    });
  }

  function initNavHighlighting() {
    var navLinks = document.querySelectorAll('.nav a[href^="#"], .mobile-nav a[href^="#"]');
    if (navLinks.length === 0) return;

    var sections = [];
    navLinks.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section && sections.indexOf(section) === -1) sections.push(section);
    });
    if (sections.length === 0) return;

    function highlightNav() {
      var current = '';
      sections.forEach(function (section) {
        if (window.scrollY >= section.offsetTop - 100) current = section.id;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function initCalendar() {
    var calendarGrid = document.getElementById('calendarGrid');
    var currentMonthEl = document.getElementById('currentMonth');
    var prevMonthBtn = document.getElementById('prevMonth');
    var nextMonthBtn = document.getElementById('nextMonth');

    if (!calendarGrid) return;

    var today = startOfDay(new Date());
    var firstBookable = addDays(today, BOOKING.minNoticeDays);
    var lastBookable = addDays(today, BOOKING.maxDaysAhead);
    var minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var maxMonth = new Date(lastBookable.getFullYear(), lastBookable.getMonth(), 1);

    // Open on the month of the first bookable day.
    var viewMonth = new Date(firstBookable.getFullYear(), firstBookable.getMonth(), 1);

    function isBookable(date) {
      return date >= firstBookable &&
        date <= lastBookable &&
        BOOKING.weekdays.indexOf(date.getDay()) !== -1;
    }

    function render() {
      var year = viewMonth.getFullYear();
      var month = viewMonth.getMonth();

      if (currentMonthEl) currentMonthEl.textContent = MONTH_NAMES[month] + ' ' + year;
      if (prevMonthBtn) prevMonthBtn.disabled = viewMonth <= minMonth;
      if (nextMonthBtn) nextMonthBtn.disabled = viewMonth >= maxMonth;

      calendarGrid.innerHTML = '';

      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (day) {
        var header = document.createElement('div');
        header.className = 'calendar-cell calendar-header-cell';
        header.textContent = day;
        calendarGrid.appendChild(header);
      });

      var firstDay = new Date(year, month, 1).getDay();
      var daysInMonth = new Date(year, month + 1, 0).getDate();

      for (var i = 0; i < firstDay; i++) {
        var empty = document.createElement('div');
        empty.className = 'calendar-cell';
        calendarGrid.appendChild(empty);
      }

      for (var day = 1; day <= daysInMonth; day++) {
        var cellDate = new Date(year, month, day);
        var cell;

        if (isBookable(cellDate)) {
          cell = document.createElement('a');
          cell.href = '/schedule';
          cell.className = 'calendar-cell available';
          cell.setAttribute('aria-label', 'Book a session on ' + MONTH_NAMES[month] + ' ' + day + ', ' + year);
        } else {
          cell = document.createElement('div');
          cell.className = 'calendar-cell';
        }

        if (cellDate.getTime() === today.getTime()) cell.classList.add('today');
        cell.textContent = String(day);
        calendarGrid.appendChild(cell);
      }
    }

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', function () {
        if (viewMonth <= minMonth) return;
        viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
        render();
      });
    }

    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', function () {
        if (viewMonth >= maxMonth) return;
        viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
        render();
      });
    }

    render();
  }

  function initCurrentYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-current-year]').forEach(function (el) {
      el.textContent = year;
    });
  }

  function init() {
    initMobileMenu();
    initNavHighlighting();
    initCalendar();
    initCurrentYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
