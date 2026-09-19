# Where Now (Wappler Server Connect)

**Current local date and time** in a **dynamic IANA timezone** from your database or a prior Server Connect step. DST-safe zones such as `America/Tijuana`, not fixed UTC offsets.

[![License: Mr Cheese Extension v1.0](https://img.shields.io/badge/License-Mr%20Cheese%20Extension%20v1.0-blue.svg)](https://www.mrcheese.co.uk/extension-license)
![Wappler](https://img.shields.io/badge/Wappler-Server%20Connect-teal)
![Version](https://img.shields.io/badge/version-0%2E1%2E0-green)

Built by **[Mr Cheese](https://www.mrcheese.co.uk)** · Wappler extensions

---

## What it does

| Capability | Description |
|------------|-------------|
| **Dynamic IANA timezone** | Bind `{{hotel.timezone}}` from a query step |
| **DST-safe** | Uses Node `Intl`; no fixed `UTC-8` offsets |
| **Local outputs** | `localDate`, `localTime`, `hour`, `minute`, `dayOfWeek` |
| **Fallback** | Invalid or empty timezone → configurable fallback (default `UTC`) |
| **Test instant** | Optional `reference` for fixed date/time instead of now |
| **No extra npm packages** | Built-in Node `Intl` only |

Typical flow:

```
Get Hotel → hotel.timezone
         → Where Now
         → Filter restaurants open at {{whereNow.localTime}}
```

---

## Requirements

- Wappler project with **Server Connect (Node)**
- Node **≥ 14** (Intl timezone support)

---

## Installation

Official Wappler guide: [How To Install Custom Wappler Extensions](https://docs.wappler.io/t/how-to-install-custom-wappler-extensions/49982/).

| Path | |
|------|--|
| **npm** | Wappler Project Settings → Extensions (`wappler-where-now`) |
| **Git** | [Extension Installer](https://www.mrcheese.co.uk/extensions/install) or manual copy below |

### Git install (Extension Installer recommended)

This repo ships **`wappler-install.json`**. Use the [Mr Cheese Extension Installer](https://www.mrcheese.co.uk/extensions/install), select **Where Now**, and run the generated script from your project root.

### Manual install (Git)

Run from your **Wappler project root**:

```bash
git clone https://github.com/MrCheeseGit/whereNow.git ../whereNow

cp ../whereNow/server_connect/modules/whereNow_now.hjson extensions/server_connect/modules/
cp ../whereNow/server_connect/modules/whereNow.js lib/modules/
```

**Quit Wappler completely** and reopen your project.

### npm install (Wappler Project Settings)

1. **Wappler** → Project Settings → Extensions → Add → `wappler-where-now`
2. From your project root: `npm install`
3. **Quit Wappler completely** and reopen your project.

#### Local `file:` development (optional)

```json
"devDependencies": {
  "wappler-where-now": "file:../path/to/this-extension"
}
```

---

## Usage

### Server Connect step

**Mr Cheese → Where Now**

| Option | Bind / value | Notes |
|--------|----------------|-------|
| **IANA timezone** | `{{hotel.timezone}}` | e.g. `America/Tijuana` |
| **Fallback timezone** | `UTC` | Used when empty or invalid |
| **Locale** | `en-CA` | `localDate` uses YYYY-MM-DD ordering |
| **Reference instant** | *(empty)* | Optional ISO datetime for testing |

### Output bindings

| Binding | Type | Example |
|---------|------|---------|
| `{{whereNow.localDate}}` | text | `2026-09-19` |
| `{{whereNow.localTime}}` | text | `14:30` (24-hour) |
| `{{whereNow.localTimeSeconds}}` | text | `14:30:00` |
| `{{whereNow.localDateTime}}` | text | `2026-09-19 14:30:00` |
| `{{whereNow.hour}}` | number | `14` |
| `{{whereNow.minute}}` | number | `30` |
| `{{whereNow.dayOfWeek}}` | number | `0` (Sun) … `6` (Sat) |
| `{{whereNow.weekday}}` | text | `Fri` |
| `{{whereNow.timezone}}` | text | Resolved IANA zone |
| `{{whereNow.isValidTimezone}}` | boolean | `true` when input was valid |
| `{{whereNow.usedFallback}}` | boolean | `true` when fallback was used |
| `{{whereNow.offsetLabel}}` | text | e.g. `GMT-7` (debug) |
| `{{whereNow.isoUtc}}` | text | Reference instant in UTC ISO |

See [examples/](examples/) for a hotel / open-restaurants outline.

---

## Compatibility

Standalone Server Connect extension. Pairs naturally with [Great Range Picker](https://github.com/MrCheeseGit/greatRangePicker) and [Great Range Time Picker](https://github.com/MrCheeseGit/greatRangeTimePicker) when a project needs server-side “now in zone” plus client date/time pickers.

See the [Wappler Extension Compatibility](https://github.com/MrCheeseGit/Wappler-Extension-Docs/blob/main/extension-compatibility.md) guide.

---

## License

[Mr Cheese Extension License v1.0](https://www.mrcheese.co.uk/extension-license). See [LICENSE](LICENSE).
