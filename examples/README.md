# Where Now examples

## Hotel timezone → open restaurants (concept)

Server Connect action flow:

1. **Get Hotel**: returns `timezone` (e.g. `America/Tijuana`)
2. **Where Now**: `timezone` = `{{hotel.timezone}}`
3. **Get Restaurants**: filter with `{{whereNow.localTime}}` and opening hours stored in local time

Bindings from the Where Now step:

| Binding | Example | Use |
|---------|---------|-----|
| `{{whereNow.localDate}}` | `2026-09-19` | Date in hotel timezone |
| `{{whereNow.localTime}}` | `14:30` | 24-hour local time |
| `{{whereNow.hour}}` | `14` | Numeric hour for comparisons |
| `{{whereNow.minute}}` | `30` | Numeric minute |
| `{{whereNow.dayOfWeek}}` | `5` | Sunday = 0 … Saturday = 6 |

Check `{{whereNow.isValidTimezone}}` or `{{whereNow.usedFallback}}` when debugging bad database values.

See [hotel-open-now.json](hotel-open-now.json) for a minimal step outline.
