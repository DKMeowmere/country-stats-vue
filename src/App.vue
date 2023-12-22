<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useAppStore } from "./app/stores/appStore"
import switchThemeIcon from "./components/SwitchThemeIcon.vue"
import LoadingScreen from "./components/LoadingScreen.vue"

const themeStore = useAppStore()
const { setupTheme } = themeStore
const { theme, isLoading } = storeToRefs(themeStore)

setupTheme()
</script>

<template>
	<div class="container">
		<switchThemeIcon />
		<LoadingScreen v-if="isLoading" />
		<main>
			<router-view />
		</main>
	</div>
</template>

<style scoped lang="scss">
.container {
	width: 100%;
	min-height: 100vh;
	padding: 80px 0;
	background-color: v-bind("theme.colors.mainBg");
	color: v-bind("theme.colors.text");
}
</style>
