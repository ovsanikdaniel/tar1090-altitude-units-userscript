# tar1090 Altitude Units Userscript (ft + m) — “Baro” Label

A Tampermonkey userscript for **tar1090-based ADS-B UIs** (including **globe.adsbexchange.com**) that normalizes the altitude display in the sidebar:

- Forces altitude to: **`xxx ft / xxx m`**
- Preserves climb/descent arrows **▲ / ▼** (when present in the source text)
- Renames the altitude label (`selected_altitude1_title`) to **`Baro`**
- Designed for fast-updating SPA pages (keeps re-applying formatting)

## Requirements

- Browser: Chrome / Edge / Firefox
- Userscript manager: **Tampermonkey**  
  https://www.tampermonkey.net/

## Installation

1. Install Tampermonkey from https://www.tampermonkey.net/
2. Open the userscript file:
   - `src/adsbx-baro-altitude.user.js`
3. Click **Raw** (GitHub) and confirm installation in Tampermonkey.
4. Reload the target page.

Tip: Once `@downloadURL` / `@updateURL` point to the GitHub *raw* file, Tampermonkey can auto-update the script.

## Supported Sites

This script works on **tar1090-style** aircraft tracking pages that expose these sidebar elements:

- `#selected_altitude1` (altitude value)
- `#selected_altitude1_title` (altitude label/title)

Confirmed target:
- `https://globe.adsbexchange.com/*`

It will also typically work on self-hosted tar1090 instances, for example:
- `http://192.168.1.50:8080/*`
- `https://tar1090.example.com/*`

If a site does not use the same element IDs or DOM structure, the script will not apply until adjusted.

## Adding More Sites

You can add additional URLs in two ways:

### Option A — Edit the script metadata (`@match`) (recommended for GitHub-managed installs)

Open `src/adsbx-baro-altitude.user.js` and add more `@match` lines, e.g.:

~~~js
// @match        https://globe.adsbexchange.com/*
// @match        https://tar1090.example.com/*
// @match        http://192.168.1.50:8080/*
~~~

## Donations

If you find this useful and want to support development:
 - BTC: bc1qpl78800mkup2z8f98v4hvymc0cly9x2e8pftp7
 - LTC: ltc1qpyvhd9swhakzx266whmzs7pmx9l5dmv3h09mgk
