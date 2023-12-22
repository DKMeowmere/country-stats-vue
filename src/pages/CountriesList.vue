<script setup lang="ts">
import { storeToRefs } from "pinia"
import { ref, onMounted, computed } from "vue"
import { Country } from "../types/Country"
import { useAppStore } from "../app/stores/appStore"
import MainButton from "../components/MainButton.vue"

type Mode = "ALL" | "INDEPENDENT" | "UNMEMBER"

const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

const error = ref("")
const mode = ref<Mode>("ALL")
const query = ref("")
const Allcountries = ref<Country[]>([])
const filteredCountries = computed(getFilteredCountries)
const unMemberCountries = computed(() =>
	filteredCountries.value.filter(country => country.unMember)
)
const independentCountries = computed(() =>
	filteredCountries.value.filter(country => country.independent)
)
const { startLoading, endLoading } = appStore

onMounted(async () => {
	try {
		startLoading()

		const res = await fetch("https://restcountries.com/v3.1/all")
		const data = await res.json()

		if (!res.ok) {
			throw new Error(data.message)
		}

		Allcountries.value = data
		Allcountries.value.sort((a, b) => (a.name.common > b.name.common ? 1 : -1))
		endLoading()
	} catch (err: any) {
		error.value = err.message || "Error"
		endLoading()
	}
})

function getSelectedCountries() {
	if (mode.value === "ALL") {
		return filteredCountries.value
	} else if (mode.value === "INDEPENDENT") {
		return independentCountries.value
	} else if (mode.value === "UNMEMBER") {
		return unMemberCountries.value
	}
	return filteredCountries.value
}

function getFilteredCountries() {
	if (query.value) {
		return Allcountries.value.filter(country =>
			country.name.common.toLowerCase().includes(query.value.toLowerCase())
		)
	}
	return Allcountries.value
}
</script>

<template>
	<p v-if="error">{{ error }}</p>
	<template v-else>
		<h1 class="title">Countries list</h1>
		<div class="button-container">
			<MainButton @click="mode = 'ALL'" :class="mode === 'ALL' && 'active'">
				Countries and regions
			</MainButton>
			<MainButton
				@click="mode = 'INDEPENDENT'"
				:class="mode === 'INDEPENDENT' && 'active'"
			>
				Independent countries
			</MainButton>
			<MainButton
				@click="mode = 'UNMEMBER'"
				:class="mode === 'UNMEMBER' && 'active'"
			>
				UN member countries
			</MainButton>
		</div>
		<input
			type="text"
			class="query-input"
			v-model="query"
			placeholder="Search for countries..."
		/>
		<div class="countries-container">
			<router-link
				class="country"
				v-for="{
					cca3,
					name,
					flag,
					capital,
					languages,
				} in getSelectedCountries()"
				:to="`/country/${cca3}`"
				:key="cca3"
			>
				<p class="country-title">{{ `${flag} ${name.common}` }}</p>
				<p>Capital: {{ capital?.join(", ") || "None" }}</p>
				<p>
					Languages:
					{{ languages ? Object.values(languages)?.join(", ") : "None" }}
				</p>
			</router-link>
		</div>
	</template>
</template>

<style scoped lang="scss">
@import "../app/style/variables";

h1 {
	text-align: center;
	margin-bottom: 20px;
}
.button-container {
	width: 80%;
	max-width: 1200px;
	margin: 0 auto 20px;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20px;
	button {
		width: 100%;
		margin: 0;
	}
	.active {
		box-shadow: 0px 0px 25px 0px v-bind("theme.colors.text");
	}
}
.query-input {
	display: block;
	width: 80%;
	max-width: 1200px;
	padding: 10px 20px;
	margin: 0 auto 20px;
}
.countries-container {
	width: 80%;
	max-width: 1200px;
	margin: 0 auto;
	display: grid;
	justify-content: space-between;
	grid-template-columns: 100%;
	.country {
		width: 100%;
		margin-bottom: 20px;
		padding: 10px;
		background-color: #fff;
		border: 1px solid v-bind("theme.colors.mainBg");
		color: v-bind("theme.colors.blackText");
		border-radius: 10px;
		p {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			font-size: 1.4rem;
			margin: 2px 0;
		}
		.country-title {
			font-size: 1.6rem;
		}
	}
}
@media screen and (min-width: $breakpoints-md) {
	.button-container {
		button {
			width: 30%;
		}
	}
	.countries-container {
		grid-template-columns: 48% 48%;
		.country {
			p {
				font-size: 1.1rem;
			}
			.country-title {
				font-size: 1.3rem;
			}
		}
	}
}
@media screen and (min-width: $breakpoints-lg) {
	.countries-container {
		grid-template-columns: repeat(4, 23%);
		.country {
			p {
				font-size: 0.8rem;
			}
			.country-title {
				font-size: 1rem;
			}
		}
	}
}
</style>
