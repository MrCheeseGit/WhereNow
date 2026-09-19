/**
 * Where Now: current date/time in a dynamic IANA timezone for Wappler Server Connect (Node).
 * Uses Intl (no extra npm packages). DST-safe zones such as America/Tijuana.
 */

const DEFAULT_FALLBACK = 'UTC';
const DEFAULT_LOCALE = 'en-CA';

const WEEKDAY_INDEX = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
};

/**
 * @param {unknown} value
 * @param {string} fallback
 * @returns {{ timezone: string, isValid: boolean }}
 */
function resolveTimezone(value, fallback) {
    const requested = String(value == null ? '' : value).trim();
    const fb = String(fallback || DEFAULT_FALLBACK).trim() || DEFAULT_FALLBACK;

    if (!requested) {
        return { timezone: normalizeTimezone(fb, DEFAULT_FALLBACK), isValid: false };
    }

    if (isValidTimezone(requested)) {
        return { timezone: requested, isValid: true };
    }

    return { timezone: normalizeTimezone(fb, DEFAULT_FALLBACK), isValid: false };
}

/**
 * @param {string} timezone
 * @returns {boolean}
 */
function isValidTimezone(timezone) {
    try {
        Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
        return true;
    } catch {
        return false;
    }
}

/**
 * @param {string} timezone
 * @param {string} fallback
 * @returns {string}
 */
function normalizeTimezone(timezone, fallback) {
    const candidate = String(timezone || '').trim();
    if (candidate && isValidTimezone(candidate)) return candidate;
    const fb = String(fallback || DEFAULT_FALLBACK).trim() || DEFAULT_FALLBACK;
    if (isValidTimezone(fb)) return fb;
    return DEFAULT_FALLBACK;
}

/**
 * @param {Date} date
 * @param {string} timeZone
 * @param {string} locale
 * @returns {Record<string, string>}
 */
function partsInZone(date, timeZone, locale) {
    const formatter = new Intl.DateTimeFormat(locale || DEFAULT_LOCALE, {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        weekday: 'short'
    });

    const map = {};
    formatter.formatToParts(date).forEach(function (part) {
        if (part.type !== 'literal') map[part.type] = part.value;
    });
    return map;
}

/**
 * @param {Date} date
 * @param {string} timeZone
 * @returns {string}
 */
function offsetLabel(date, timeZone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'longOffset'
    });
    const part = formatter.formatToParts(date).find(function (p) {
        return p.type === 'timeZoneName';
    });
    return part ? part.value : '';
}

/**
 * @param {unknown} raw
 * @returns {Date}
 */
function parseReferenceInstant(raw) {
    if (raw === null || raw === undefined || raw === '') return new Date();
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error('whereNow: reference must be a valid date/time when provided.');
    }
    return parsed;
}

/**
 * @param {object} options
 * @param {string} [options.timezone] IANA zone from a prior step (e.g. {{hotel.timezone}})
 * @param {string} [options.fallbackTimezone] Used when timezone is empty or invalid (default UTC)
 * @param {string} [options.locale] Intl locale for formatting (default en-CA)
 * @param {string} [options.reference] Optional instant to format instead of now (ISO string)
 * @returns {object}
 */
exports.now = function (options) {
    const requestedTimezone = this.parseOptional(options.timezone, '*', '');
    const fallbackTimezone = this.parseOptional(options.fallbackTimezone, 'string', DEFAULT_FALLBACK);
    const locale = this.parseOptional(options.locale, 'string', DEFAULT_LOCALE);
    const referenceRaw = this.parseOptional(options.reference, '*', '');

    const instant = parseReferenceInstant(referenceRaw);
    const resolved = resolveTimezone(requestedTimezone, fallbackTimezone);
    const parts = partsInZone(instant, resolved.timezone, locale);
    const weekdayKey = String(parts.weekday || '').slice(0, 3).toLowerCase();
    const hour = parseInt(parts.hour, 10);
    const minute = parseInt(parts.minute, 10);
    const second = parseInt(parts.second, 10);
    const localDate = parts.year + '-' + parts.month + '-' + parts.day;
    const localTime = parts.hour + ':' + parts.minute;
    const localTimeSeconds = parts.hour + ':' + parts.minute + ':' + parts.second;

    return {
        success: true,
        timezone: resolved.timezone,
        requestedTimezone: String(requestedTimezone || '').trim(),
        isValidTimezone: resolved.isValid,
        usedFallback: !resolved.isValid,
        locale: locale,
        localDate: localDate,
        localTime: localTime,
        localTimeSeconds: localTimeSeconds,
        localDateTime: localDate + ' ' + localTimeSeconds,
        hour: hour,
        minute: minute,
        second: second,
        dayOfWeek: WEEKDAY_INDEX[weekdayKey] != null ? WEEKDAY_INDEX[weekdayKey] : null,
        weekday: parts.weekday || '',
        offsetLabel: offsetLabel(instant, resolved.timezone),
        isoUtc: instant.toISOString(),
        unixMs: instant.getTime()
    };
};

exports._isValidTimezone = isValidTimezone;
exports._resolveTimezone = resolveTimezone;
