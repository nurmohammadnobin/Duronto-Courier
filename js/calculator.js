/* ============================================
   Duronto Courier — Delivery Rate Calculator
   Live calculation of delivery charges by zone & weight
   ============================================ */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '8801334925668';

  // Zone pricing configuration
  var ZONE_PRICES = {
    inside: { base: 60, extraPerKg: 15, label: 'Inside Dhaka', eta: 'Same day delivery' },
    suburbs: { base: 100, extraPerKg: 20, label: 'Dhaka Suburbs', eta: '24–48 hours' },
    outside: { base: 130, extraPerKg: 25, label: 'Outside Dhaka', eta: '48–72 hours' }
  };

  var INCLUDED_WEIGHT = 1; // KG included in base price
  var COD_FEE_RATE = 0.01; // 1% of COD amount
  var COD_MIN_FEE = 10; // Minimum COD fee in BDT

  var pickupZoneEl = document.getElementById('pickupZone');
  var deliveryZoneEl = document.getElementById('deliveryZone');
  var weightEl = document.getElementById('calcWeight');
  var codEl = document.getElementById('calcCod');

  var baseFeeEl = document.getElementById('baseFee');
  var weightFeeEl = document.getElementById('weightFee');
  var codFeeEl = document.getElementById('codFee');
  var codRowEl = document.getElementById('codRow');
  var totalFeeEl = document.getElementById('totalFee');
  var etaEl = document.getElementById('deliveryEta');
  var bookRateBtn = document.getElementById('bookRateBtn');

  if (!pickupZoneEl || !deliveryZoneEl || !weightEl) return;

  // The delivery zone determines the base price and per-KG rate.
  // We use the higher-cost zone between pickup and delivery to ensure coverage.
  function getEffectiveZone() {
    var pickup = pickupZoneEl.value;
    var delivery = deliveryZoneEl.value;
    // Priority: outside > suburbs > inside
    var priority = { inside: 0, suburbs: 1, outside: 2 };
    var effectiveKey = priority[pickup] >= priority[delivery] ? pickup : delivery;
    return effectiveKey;
  }

  function calculate() {
    var zoneKey = getEffectiveZone();
    var zone = ZONE_PRICES[zoneKey];

    var weight = parseFloat(weightEl.value) || 0;
    if (weight < 0) weight = 0;

    var codAmount = parseFloat(codEl.value) || 0;
    if (codAmount < 0) codAmount = 0;

    // Base fee
    var baseFee = zone.base;

    // Extra weight charge
    var extraWeight = Math.max(0, weight - INCLUDED_WEIGHT);
    var weightFee = Math.ceil(extraWeight * zone.extraPerKg);

    // COD fee
    var codFee = 0;
    if (codAmount > 0) {
      codFee = Math.max(COD_MIN_FEE, Math.ceil(codAmount * COD_FEE_RATE));
      if (codRowEl) codRowEl.style.display = 'flex';
      if (codFeeEl) codFeeEl.textContent = codFee + ' BDT';
    } else {
      if (codRowEl) codRowEl.style.display = 'none';
    }

    // Total
    var total = baseFee + weightFee + codFee;

    // Update DOM
    if (baseFeeEl) baseFeeEl.textContent = baseFee + ' BDT';
    if (weightFeeEl) weightFeeEl.textContent = weightFee + ' BDT';
    if (totalFeeEl) totalFeeEl.textContent = total + ' BDT';
    if (etaEl) etaEl.textContent = 'Estimated Delivery: ' + zone.eta;

    // Store last calculation for WhatsApp booking
    bookRateBtn._lastCalc = {
      pickupZone: ZONE_PRICES[pickupZoneEl.value].label,
      deliveryZone: ZONE_PRICES[deliveryZoneEl.value].label,
      weight: weight,
      codAmount: codAmount,
      baseFee: baseFee,
      weightFee: weightFee,
      codFee: codFee,
      total: total,
      eta: zone.eta
    };
  }

  // ===== Event Listeners =====
  [pickupZoneEl, deliveryZoneEl, weightEl, codEl].forEach(function (el) {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  // ===== Book Rate via WhatsApp =====
  if (bookRateBtn) {
    bookRateBtn.addEventListener('click', function () {
      var calc = bookRateBtn._lastCalc;
      if (!calc) return;

      var lines = [];
      lines.push('*Delivery Rate Booking Request*');
      lines.push('———————————————');
      lines.push('');
      lines.push('*Pickup Zone:* ' + calc.pickupZone);
      lines.push('*Delivery Zone:* ' + calc.deliveryZone);
      lines.push('*Weight:* ' + calc.weight + ' KG');
      if (calc.codAmount > 0) {
        lines.push('*COD Amount:* ' + calc.codAmount + ' BDT');
      }
      lines.push('');
      lines.push('*Base Fee:* ' + calc.baseFee + ' BDT');
      lines.push('*Extra Weight Charge:* ' + calc.weightFee + ' BDT');
      if (calc.codFee > 0) {
        lines.push('*COD Service Fee:* ' + calc.codFee + ' BDT');
      }
      lines.push('*Estimated Total:* ' + calc.total + ' BDT');
      lines.push('*Estimated Delivery:* ' + calc.eta);
      lines.push('');
      lines.push('I would like to book this rate. Please assist with pickup.');

      var message = lines.join('\n');
      var encoded = encodeURIComponent(message);
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;
      window.open(url, '_blank', 'noopener');
    });
  }

  // Initial calculation
  calculate();
})();
