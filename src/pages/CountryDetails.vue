<script setup lang="ts">
import { storeToRefs } from "pinia"
import { ref, computed, watch } from "vue"
import { useRoute } from "vue-router"
import { Icon } from "@iconify/vue"
import { Country } from "../types/Country"
import { useAppStore } from "../app/stores/appStore"
import {
	getCountryCurrencies,
	getCountryNativeNames,
	getCountryLanguages,
} from "../app/utils/country"

const appStore = useAppStore()
const { startLoading, endLoading } = appStore
const { theme } = storeToRefs(appStore)
const route = useRoute()
const code = ref(route.params.code)
const error = ref("")
const country = ref<Country | null>(null)
const nativeNames = computed(() => getCountryNativeNames(country.value))
const currencies = computed(() => getCountryCurrencies(country.value))
const languages = computed(() => getCountryLanguages(country.value))

watch(
	code,
	async () => {
		try {
			startLoading()
			const res = await fetch(
				`https://restcountries.com/v3.1/alpha/${code.value}`
			)
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.message)
			}

			country.value = data[0]
			endLoading()
		} catch (err: any) {
			error.value = err.message || "Error"
			endLoading()
		}
	},
	{ immediate: true, deep: true }
)
</script>

<template>
	<p v-if="error">{{ error }}</p>
	<p v-else-if="!country">Unexpected error</p>
	<div v-else class="country-container">
		<router-link to="/" class="go-back-btn">
			<Icon icon="material-symbols:arrow-back" />
		</router-link>
		<h1>{{ country.name.common }}</h1>
		<div class="images-container">
			<img
				v-if="country.flags.png"
				:src="country.flags.png"
				:alt="country.flags.alt"
				class="flag"
			/>
			<img
				v-if="country.coatOfArms.png"
				:src="country.coatOfArms.png"
				:alt="`${country.name.common} coat of arms`"
				class="coat-of-arms"
			/>
		</div>
		<p>Official name: {{ country.name.official }}</p>
		<p v-if="nativeNames.length > 0">
			Native name: {{ nativeNames.join(", ") }}
		</p>
		<p v-if="currencies.length > 0">Currencies: {{ currencies.join(", ") }}</p>
		<p v-if="languages.length > 0">Languages: {{ languages.join(", ") }}</p>
		<p>Region: {{ country.region }}</p>
		<p v-if="country.subregion">Subregion: {{ country.subregion }}</p>
		<p v-if="country.borders && country.borders.length > 0">
			Borders:
			<router-link
				v-for="border in country.borders"
				:key="border"
				@click="code = border"
				:to="`/country/${border}`"
				class="border-link"
			>
				{{ `${border} ` }}
			</router-link>
		</p>
		<p>Independent: {{ country.independent ? "Yes" : "No" }}</p>
		<p>
			<Icon icon="flag:un-4x3" /> UN Member:
			{{ country.unMember ? "Yes" : "No" }}
		</p>
		<p>Landlocked: {{ country.landlocked ? "Yes" : "No" }}</p>
	</div>
</template>

<style scoped lang="scss">
@import "../app/style/variables";

.country-container {
	width: 80%;
	max-width: 1200px;
	margin: 0 auto 20px;
	color: v-bind("theme.colors.text");
	.go-back-btn {
		position: absolute;
		top: 20px;
		left: 20px;
		cursor: pointer;
		border-radius: 50%;
		padding: 10px;
		svg {
			width: 50px;
			height: 50px;
			color: v-bind("theme.colors.text");
		}
	}
	h1 {
		font-size: 2.2rem;
		text-align: center;
		margin-bottom: 30px;
	}
	.images-container {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: center;
		gap: 50px;

		.flag {
			width: 70%;
			aspect-ratio: 16 / 9;
		}

		.coat-of-arms {
			width: 70%;
			aspect-ratio: 1 / 1;
		}
	}
	p {
		font-size: 0.8rem;
		margin: 20px 0;
		text-align: center;
		svg {
			margin: auto 5px auto 0;
		}
		.border-link {
			color: #6495ed;
			&:hover {
				text-decoration: underline;
			}
		}
	}
}
@media screen and (min-width: $breakpoints-sm) {
	.country-container {
		p {
			font-size: 1.1rem;
		}
	}
}
@media screen and (min-width: $breakpoints-md) {
	.country-container {
		h1 {
			font-size: 2.8rem;
		}
		.images-container {
			.flag {
				width: 40%;
			}

			.coat-of-arms {
				width: 40%;
			}
		}
		p {
			font-size: 1.4rem;
		}
	}
}

@media screen and (min-width: $breakpoints-lg) {
	.country-container {
		h1 {
			font-size: 3.4rem;
		}
		p {
			font-size: 1.8rem;
		}
	}
}
</style>
