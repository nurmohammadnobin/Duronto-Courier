/* ============================================
   Duronto Courier — WhatsApp Booking Module
   Form validation & WhatsApp API URL builder
   ============================================ */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '8801334925668';

  var bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  // ===== Validation =====
  function showError(fieldName, message) {
    var errorEl = bookingForm.querySelector('.error-msg[data-for="' + fieldName + '"]');
    var inputEl = document.getElementById(fieldName);
    if (errorEl) {
      errorEl.textContent = message;
    }
    if (inputEl) {
      if (message) {
        inputEl.classList.add('error');
      } else {
        inputEl.classList.remove('error');
      }
    }
  }

  function clearAllErrors() {
    var errorEls = bookingForm.querySelectorAll('.error-msg');
    errorEls.forEach(function (el) {
      el.textContent = '';
    });
    var inputs = bookingForm.querySelectorAll('input, select, textarea');
    inputs.forEach(function (el) {
      el.classList.remove('error');
    });
  }

  function validateField(id, label, value) {
    if (!value || !value.trim()) {
      showError(id, label + ' is required');
      return false;
    }
    showError(id, '');
    return true;
  }

  function validateMobile(id, value) {
    if (!value || !value.trim()) {
      showError(id, 'Mobile number is required');
      return false;
    }
    var cleaned = value.replace(/[\s+\-]/g, '');
    if (!/^[0-9]{11,13}$/.test(cleaned)) {
      showError(id, 'Enter a valid mobile number (11-13 digits)');
      return false;
    }
    showError(id, '');
    return true;
  }

  function validateForm(data) {
    var valid = true;
    clearAllErrors();

    if (!validateField('senderName', 'Sender name', data.senderName)) valid = false;
    if (!validateMobile('senderMobile', data.senderMobile)) valid = false;
    if (!validateField('pickupAddress', 'Pickup address', data.pickupAddress)) valid = false;
    if (!validateField('recipientName', 'Recipient name', data.recipientName)) valid = false;
    if (!validateMobile('recipientMobile', data.recipientMobile)) valid = false;
    if (!validateField('deliveryAddress', 'Delivery address', data.deliveryAddress)) valid = false;
    if (!validateField('cityDistrict', 'City/District', data.cityDistrict)) valid = false;
    if (!validateField('parcelType', 'Parcel type', data.parcelType)) valid = false;

    if (!data.parcelWeight || parseFloat(data.parcelWeight) <= 0) {
      showError('parcelWeight', 'Enter a valid weight');
      valid = false;
    } else {
      showError('parcelWeight', '');
    }

    return valid;
  }

  // ===== Message Builder =====
  function buildMessage(data) {
    var lines = [];
    lines.push('*New Parcel Booking Request*');
    lines.push('———————————————');
    lines.push('');
    lines.push('*Sender:* ' + data.senderName);
    lines.push('*Sender Mobile:* ' + data.senderMobile);
    lines.push('*Pickup Address:* ' + data.pickupAddress);
    lines.push('');
    lines.push('*Recipient:* ' + data.recipientName);
    lines.push('*Recipient Mobile:* ' + data.recipientMobile);
    lines.push('*Delivery Address:* ' + data.deliveryAddress);
    lines.push('*City/District:* ' + data.cityDistrict);
    lines.push('');
    lines.push('*Parcel Type:* ' + data.parcelType);
    lines.push('*Weight:* ' + data.parcelWeight + ' KG');
    if (data.codAmount && parseFloat(data.codAmount) > 0) {
      lines.push('*COD Amount:* ' + data.codAmount + ' BDT');
    } else {
      lines.push('*COD Amount:* None');
    }
    lines.push('');
    lines.push('Please confirm pickup time and tracking ID. Thank you!');

    return lines.join('\n');
  }

  // ===== Form Submission =====
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = {
      senderName: document.getElementById('senderName').value,
      senderMobile: document.getElementById('senderMobile').value,
      pickupAddress: document.getElementById('pickupAddress').value,
      recipientName: document.getElementById('recipientName').value,
      recipientMobile: document.getElementById('recipientMobile').value,
      deliveryAddress: document.getElementById('deliveryAddress').value,
      cityDistrict: document.getElementById('cityDistrict').value,
      parcelType: document.getElementById('parcelType').value,
      parcelWeight: document.getElementById('parcelWeight').value,
      codAmount: document.getElementById('codAmount').value
    };

    if (!validateForm(data)) {
      // Focus first error field
      var firstError = bookingForm.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    var message = buildMessage(data);
    var encoded = encodeURIComponent(message);
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;
    window.open(url, '_blank', 'noopener');
  });

  // ===== Clear error on input =====
  bookingForm.addEventListener('input', function (e) {
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
      var errorEl = bookingForm.querySelector('.error-msg[data-for="' + e.target.id + '"]');
      if (errorEl) errorEl.textContent = '';
    }
  });

  // ===== Reset clears errors =====
  bookingForm.addEventListener('reset', function () {
    setTimeout(clearAllErrors, 0);
  });
})();
