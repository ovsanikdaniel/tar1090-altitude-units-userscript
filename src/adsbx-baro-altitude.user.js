// ==UserScript==
// @name         ADSBexchange: Baro label + altitude ft (m)
// @name:sk      ADSBexchange: Baro popis + výška ft (m)
// @namespace    https://github.com/ovsanikdaniel/tar1090-altitude-units-userscript
// @version      1.0.0
// @description  Forces sidebar altitude to show as "xxx ft (xxx m)" and renames selected_altitude1_title to "Baro" on globe.adsbexchange.com.
// @description:sk V sidebare vynúti formát výšky "xxx ft (xxx m)" a prepíše selected_altitude1_title na "Baro" na globe.adsbexchange.com.
// @author       Daniel Ovšanik
// @license      MIT
// @match        https://globe.adsbexchange.com/*
// @match        https://*.adsbexchange.com/*
// @run-at       document-end
// @grant        none
// @homepageURL  https://github.com/ovsanikdaniel/tar1090-altitude-units-userscript
// @supportURL   https://github.com/ovsanikdaniel/tar1090-altitude-units-userscript/issues
// @downloadURL  https://raw.githubusercontent.com/ovsanikdaniel/tar1090-altitude-units-userscript/main/src/adsbx-baro-altitude.user.js
// @updateURL    https://raw.githubusercontent.com/ovsanikdaniel/tar1090-altitude-units-userscript/main/src/adsbx-baro-altitude.user.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Daniel Ovšanik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
*/

(function () {
  'use strict';

  // --- Config ---
  const ALT_ID = 'selected_altitude1';
  const ALT_TITLE_ID = 'selected_altitude1_title';
  const ALT_TITLE_TEXT = 'Baro';

  // ADSBx často používa úzku nedeliteľnú medzeru medzi číslom a jednotkou.
  const NNBSP = '\u202F';

  // Interval je zámerný: stránka je SPA a hodnoty môžu byť často prepisované.
  const APPLY_INTERVAL_MS = 300;

  // --- Helpers ---
  function parseNumber(raw) {
    if (!raw) return NaN;

    // odstráň whitespace vrátane NBSP/NNBSP
    let s = String(raw).trim().replace(/[\s\u00A0\u202F]/g, '');

    // "12,5" -> "12.5"
    if (s.includes(',') && !s.includes('.')) s = s.replace(',', '.');

    // odstráň tisícové oddeľovače (čiarky)
    s = s.replace(/,/g, '');

    // ak by bolo viac bodiek, nechaj poslednú ako desatinnú
    const dotCount = (s.match(/\./g) || []).length;
    if (dotCount > 1) {
      const parts = s.split('.');
      const last = parts.pop();
      s = parts.join('') + '.' + last;
    }

    return Number.parseFloat(s);
  }

  function fmtInt(n) {
    return String(Math.round(n));
  }

  function stripAddon(text) {
    // odstráni existujúce "(#### m)" alebo "(#### ft)" aby sa to nezdvojovalo
    return String(text)
      .replace(/\s*\(\s*[-\d.,\s\u00A0\u202F]+\s*(?:ft|m)\s*\)\s*/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function formatFtM(text) {
    // voliteľná šípka ▲/▼ + číslo + jednotka ft|m
    const rx = /([▲▼]\s*)?(-?\d[\d.,\s\u00A0\u202F]*)([\s\u00A0\u202F]*)(ft|m)\b/i;

    return text.replace(rx, (full, arrow = '', numRaw, _sep = '', unitRaw) => {
      const unit = unitRaw.toLowerCase();
      const v = parseNumber(numRaw);
      if (!Number.isFinite(v)) return full;

      let ft, m;
      if (unit === 'ft') {
        ft = v;
        m = ft * 0.3048;
      } else {
        m = v;
        ft = m / 0.3048;
      }

      return `${arrow}${fmtInt(ft)}${NNBSP}ft (${fmtInt(m)}${NNBSP}m)`;
    });
  }

  // --- Main ---
  function apply() {
    // 1) Prepíš title na "Baro"
    const titleEl = document.getElementById(ALT_TITLE_ID);
    if (titleEl && titleEl.textContent !== ALT_TITLE_TEXT) {
      titleEl.textContent = ALT_TITLE_TEXT;
    }

    // 2) Prepíš výšku na "ft (m)"
    const altEl = document.getElementById(ALT_ID);
    if (!altEl) return;

    const raw = altEl.textContent ?? '';
    const cleaned = stripAddon(raw);
    const updated = formatFtM(cleaned);

    if (updated !== raw) {
      altEl.textContent = updated;
    }
  }

  // SPA/aktualizácie: reaguj na DOM zmeny + poistka intervalom
  const mo = new MutationObserver(apply);
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  setInterval(apply, APPLY_INTERVAL_MS);
  apply();
})();
