const OFFER_TIME_ZONE = 'Europe/London';
const OFFER_LOCALE = 'en-GB';

export function getOfferMonth(date = new Date()) {
	return new Intl.DateTimeFormat(OFFER_LOCALE, {
		timeZone: OFFER_TIME_ZONE,
		month: 'long'
	}).format(date);
}

export function getValuationLinkSource(date = new Date()) {
	return `Valuation Link Page · ${getOfferMonth(date)} Free Valuation Offer`;
}

export function isValuationLinkSource(source) {
	return /^Valuation Link Page · .+ Free Valuation Offer$/.test(source);
}
