<template>
	<section class="app-main" :style="{ minHeight: minHeight }">
		<router-view>
			<template #default="{ Component, route }">
				<transition enter-active-class="animate__animated animate__fadeIn" mode="out-in">
					<keep-alive :include="cachedViews">
						<component :is="Component" :key="route.path" />
					</keep-alive>
				</transition>
			</template>
		</router-view>
	</section>
</template>

<script setup lang="ts">
	import variables from "@/styles/variables.module.scss";

	const store = useStore();

	const cachedViews = computed(() => store.state.tagsView.cachedViews); // 缓存页面集合
	const minHeight = computed(() => {
		return store.state.showTagsView ? `calc(100vh - ${variables["navbar-height"]} - ${variables["tags-view-height"]})` : `calc(100vh - ${variables["navbar-height"]})`;
	});
</script>

<style lang="scss" scoped>
	.app-main {
		position: relative;
		background-color: var(--el-bg-color-page);
	}
</style>