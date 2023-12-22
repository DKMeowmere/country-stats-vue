<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { useAppStore } from "../app/stores/appStore"
import { storeToRefs } from "pinia"

const themeStore = useAppStore()
const { switchTheme } = themeStore
const { theme } = storeToRefs(themeStore)
</script>

<template>
	<div class="icon" @click="switchTheme">
		<Icon icon="material-symbols:sunny-rounded" v-if="theme.type === 'LIGHT'" />
		<Icon icon="bi:moon-fill" v-else />
	</div>
</template>

<style scoped lang="scss">
.icon {
	position: absolute;
	width: 50px;
	height: 50px;
	top: 20px;
	right: 20px;
	cursor: pointer;
	svg {
		color: v-bind("theme.colors.text");
		width: 100%;
		height: 100%;
	}
}
</style>
