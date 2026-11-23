/** Danh sách quốc gia của form thanh toán quốc tế (dùng chung cho client và server). "OTHER" = nước khác. */
export const COUNTRIES = [
  ["US", "United States"], ["CA", "Canada"], ["GB", "United Kingdom"], ["IE", "Ireland"], ["DE", "Germany"], ["FR", "France"],
  ["ES", "Spain"], ["IT", "Italy"], ["NL", "Netherlands"], ["BE", "Belgium"], ["LU", "Luxembourg"], ["AT", "Austria"],
  ["CH", "Switzerland"], ["SE", "Sweden"], ["NO", "Norway"], ["DK", "Denmark"], ["FI", "Finland"], ["IS", "Iceland"],
  ["PL", "Poland"], ["CZ", "Czechia"], ["SK", "Slovakia"], ["HU", "Hungary"], ["RO", "Romania"], ["BG", "Bulgaria"],
  ["GR", "Greece"], ["PT", "Portugal"], ["HR", "Croatia"], ["SI", "Slovenia"], ["EE", "Estonia"], ["LV", "Latvia"],
  ["LT", "Lithuania"], ["CY", "Cyprus"], ["MT", "Malta"], ["LI", "Liechtenstein"], ["AU", "Australia"], ["NZ", "New Zealand"],
  ["SG", "Singapore"], ["MY", "Malaysia"], ["PH", "Philippines"], ["TH", "Thailand"], ["VN", "Vietnam"], ["ID", "Indonesia"],
  ["JP", "Japan"], ["KR", "South Korea"], ["IN", "India"], ["AE", "United Arab Emirates"], ["SA", "Saudi Arabia"],
  ["IL", "Israel"], ["TR", "Türkiye"], ["ZA", "South Africa"], ["NG", "Nigeria"], ["KE", "Kenya"], ["BR", "Brazil"],
  ["MX", "Mexico"], ["AR", "Argentina"], ["CL", "Chile"], ["CO", "Colombia"], ["OTHER", "Other"],
] as const satisfies readonly (readonly [string, string])[];

export type CountryCode = (typeof COUNTRIES)[number][0];

export const COUNTRY_CODES = COUNTRIES.map(([code]) => code) as [CountryCode, ...CountryCode[]];

/** EU + EEA + Anh + Thụy Sĩ: các nước áp dụng GDPR / UK GDPR (hiện lưu ý riêng ở form). */
export const GDPR_COUNTRIES = new Set<string>(
  "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO GB CH".split(" "),
);
