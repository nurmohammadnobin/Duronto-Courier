/* ============================================
   Duronto Courier — Parcel Tracking System
   Mock tracking data with visual status timeline
   ============================================ */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '8801334925668';

  // ===== Mock Tracking Data =====
  var TRACKING_DATA = [
    {
      id: 'EXP101',
      status: 'delivered',
      currentStatus: 'Delivered',
      sender: 'Trendy Wear BD',
      recipient: 'Nusrat Jahan',
      destination: 'Chittagong',
      service: 'Standard Delivery',
      timeline: [
        { status: 'Picked Up', location: 'Dhaka Hub', time: '12 Aug 2026, 09:15 AM', state: 'completed' },
        { status: 'In Transit', location: 'Comilla Transit Center', time: '12 Aug 2026, 02:30 PM', state: 'completed' },
        { status: 'Out for Delivery', location: 'Chittagong City', time: '13 Aug 2026, 08:45 AM', state: 'completed' },
        { status: 'Delivered', location: 'Chittagong — Delivered to recipient', time: '13 Aug 2026, 11:20 AM', state: 'completed' }
      ]
    },
    {
      id: 'EXP102',
      status: 'transit',
      currentStatus: 'In Transit',
      sender: 'Sylhet Crafts',
      recipient: 'Rakib Hasan',
      destination: 'Sylhet',
      service: 'Standard Delivery',
      timeline: [
        { status: 'Picked Up', location: 'Dhaka Hub', time: '13 Aug 2026, 10:00 AM', state: 'completed' },
        { status: 'In Transit', location: 'Brahmanbaria Transit Point', time: '13 Aug 2026, 03:45 PM', state: 'current' },
        { status: 'Out for Delivery', location: 'Sylhet City', time: 'Pending', state: 'pending' },
        { status: 'Delivered', location: 'Sylhet', time: 'Pending', state: 'pending' }
      ]
    },
    {
      id: 'EXP103',
      status: 'transit',
      currentStatus: 'Out for Delivery',
      sender: 'Online Books BD',
      recipient: 'Sadia Islam',
      destination: 'Khulna',
      service: 'Duronto Delivery',
      timeline: [
        { status: 'Picked Up', location: 'Dhaka Hub', time: '14 Aug 2026, 08:30 AM', state: 'completed' },
        { status: 'In Transit', location: 'Faridpur Transit Center', time: '14 Aug 2026, 01:15 PM', state: 'completed' },
        { status: 'Out for Delivery', location: 'Khulna City', time: '15 Aug 2026, 09:00 AM', state: 'current' },
        { status: 'Delivered', location: 'Khulna', time: 'Pending', state: 'pending' }
      ]
    }
  ];

  // ===== Status Icons (SVG) =====
  var STATUS_ICONS = {
    completed: '<svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M5 12L10 17L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    current: '<svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M12 2L14 9L21 10L16 15L17 22L12 18L7 22L8 15L3 10L10 9L12 2Z" fill="currentColor"/></svg>',
    pending: '<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/></svg>'
  };

  var STATUS_CLASSES = {
    delivered: 'status-delivered',
    transit: 'status-transit',
    pending: 'status-pending'
  };

  // ===== Elements =====
  var trackingForm = document.getElementById('trackingForm');
  var trackingIdInput = document.getElementById('trackingId');
  var resultContainer = document.getElementById('trackingResult');
  var notFoundContainer = document.getElementById('trackingNotFound');
  var inquireBtn = document.getElementById('inquireWhatsAppBtn');
  var notFoundText = document.getElementById('notFoundText');

  if (!trackingForm) return;

  // ===== Search Tracking =====
  function searchTracking(rawId) {
    var id = (rawId || '').trim().toUpperCase();

    if (!id) {
      if (trackingIdInput) trackingIdInput.focus();
      return;
    }

    // Find matching record
    var record = TRACKING_DATA.find(function (item) {
      return item.id.toUpperCase() === id;
    });

    if (record) {
      renderResult(record);
      hideNotFound();
    } else {
      hideResult();
      showNotFound(id);
    }
  }

  // ===== Render Result =====
  function renderResult(record) {
    if (!resultContainer) return;

    // Calculate progress
    var totalSteps = record.timeline.length;
    var completedSteps = record.timeline.filter(function (t) {
      return t.state === 'completed';
    }).length;
    var progress = Math.round((completedSteps / totalSteps) * 100);

    // Build status badge
    var badgeClass = STATUS_CLASSES[record.status] || 'status-pending';

    // Build timeline HTML
    var timelineHtml = record.timeline.map(function (item) {
      var itemClass = item.state === 'completed' ? 'completed' : item.state === 'current' ? 'current' : 'pending';
      var icon = STATUS_ICONS[item.state] || STATUS_ICONS.pending;
      return '<div class="timeline-item ' + itemClass + '">' +
        '<div class="timeline-dot">' + icon + '</div>' +
        '<div class="timeline-status">' + item.status + '</div>' +
        '<div class="timeline-location">' + item.location + '</div>' +
        '<div class="timeline-time">' + item.time + '</div>' +
        '</div>';
    }).join('');

    resultContainer.innerHTML =
      '<div class="tracking-header">' +
        '<div>' +
          '<div class="tracking-id-label">Tracking ID</div>' +
          '<div class="tracking-id-value">' + record.id + '</div>' +
        '</div>' +
        '<div class="tracking-status-badge ' + badgeClass + '">' +
          '<span class="status-dot"></span>' +
          '<span>' + record.currentStatus + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="tracking-progress">' +
        '<div class="progress-label">' +
          '<span>Delivery Progress</span>' +
          '<span>' + progress + '%</span>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress-fill" style="width: ' + progress + '%"></div>' +
        '</div>' +
      '</div>' +
      '<div class="tracking-timeline">' +
        '<h3 class="timeline-title">Status Timeline</h3>' +
        '<div class="timeline">' + timelineHtml + '</div>' +
      '</div>' +
      '<div class="tracking-info">' +
        '<div class="info-item">' +
          '<div class="info-item-label">Sender</div>' +
          '<div class="info-item-value">' + record.sender + '</div>' +
        '</div>' +
        '<div class="info-item">' +
          '<div class="info-item-label">Recipient</div>' +
          '<div class="info-item-value">' + record.recipient + '</div>' +
        '</div>' +
        '<div class="info-item">' +
          '<div class="info-item-label">Destination</div>' +
          '<div class="info-item-value">' + record.destination + '</div>' +
        '</div>' +
        '<div class="info-item">' +
          '<div class="info-item-label">Service</div>' +
          '<div class="info-item-value">' + record.service + '</div>' +
        '</div>' +
      '</div>';

    resultContainer.style.display = 'block';

    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideResult() {
    if (resultContainer) {
      resultContainer.style.display = 'none';
      resultContainer.innerHTML = '';
    }
  }

  // ===== Show Not Found =====
  function showNotFound(id) {
    if (notFoundText) {
      notFoundText.textContent = 'The tracking ID "' + id + '" doesn\'t match any of our records. Please double-check and try again, or inquire directly on WhatsApp.';
    }
    if (inquireBtn) {
      var message = 'Hi, please check status for Tracking ID: ' + id;
      var encoded = encodeURIComponent(message);
      inquireBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;
    }
    if (notFoundContainer) {
      notFoundContainer.style.display = 'block';
      notFoundContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function hideNotFound() {
    if (notFoundContainer) {
      notFoundContainer.style.display = 'none';
    }
  }

  // ===== Form Submit =====
  trackingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    searchTracking(trackingIdInput.value);
  });

  // ===== Sample ID Buttons =====
  var sampleButtons = document.querySelectorAll('.sample-id');
  sampleButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = this.getAttribute('data-id');
      if (trackingIdInput) {
        trackingIdInput.value = id;
        searchTracking(id);
      }
    });
  });

  // ===== Auto-search from URL parameter =====
  // Supports both ?id=EXP1234 (from home page) and bare ?EXP1234
  function getIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (id) return id;
    // Check for bare query param (e.g. ?EXP1234)
    var rawQuery = window.location.search.replace(/^\?/, '');
    if (rawQuery && rawQuery.indexOf('=') === -1) {
      return decodeURIComponent(rawQuery);
    }
    return null;
  }

  var urlId = getIdFromUrl();
  if (urlId) {
    if (trackingIdInput) trackingIdInput.value = urlId;
    // Slight delay so the page is fully rendered
    setTimeout(function () {
      searchTracking(urlId);
    }, 100);
  }
})();
