import { createRouter, createWebHistory } from "vue-router"
import CountriesList from "./pages/CountriesList.vue"
import CountryDetails from "./pages/CountryDetails.vue"

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ name: "Countries List", path: "/", component: CountriesList },
		{
			name: "Country Details",
			path: "/country/:code",
			component: CountryDetails,
		},
	],
})
