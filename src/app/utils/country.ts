import { Country } from "../../types/Country"

export function getCountryNativeNames(country: Country | null) {
	if (!country?.name.nativeName) {
		return []
	}

	const names = Object.values(country.name.nativeName)
	const commonNames = names.map(value => value.common)

	return commonNames
}

export function getCountryCurrencies(country: Country | null) {
	if (!country?.currencies) {
		return []
	}

	const currencies = Object.entries(country.currencies)
	const currenciesNames = currencies.map(
		([key, { name }]) => `${key} - ${name}`
	)

	return currenciesNames
}

export function getCountryLanguages(country: Country | null) {
	if (!country?.languages) {
		return []
	}

	const languages = Object.values(country.languages)

	return languages
}
