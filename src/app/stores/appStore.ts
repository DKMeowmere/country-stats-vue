import { defineStore } from "pinia"
import { Theme } from "../../types/Theme"
import { lightTheme } from "../themes/lightTheme"
import { darkTheme } from "../themes/darkTheme"

type State = {
	theme: Theme
	isLoading: boolean
}

const initialState: State = {
	theme: lightTheme,
	isLoading: true,
}

export const useAppStore = defineStore("theme", {
	state: () => initialState,
	actions: {
		setupTheme() {
			const themeType = localStorage.getItem("theme")

			if (themeType === "DARK") {
				this.theme = darkTheme
			} else {
				this.theme = lightTheme
			}
		},
		switchTheme() {
			if (this.theme.type === "LIGHT") {
				this.theme = darkTheme
				localStorage.setItem("theme", "DARK")
			} else {
				this.theme = lightTheme
				localStorage.setItem("theme", "LIGHT")
			}
		},
		startLoading() {
			this.isLoading = true
		},
		endLoading() {
			this.isLoading = false
		},
	},
})
