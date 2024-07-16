<template>
	<div class="flex">
		<hamburger :is-active="$store.state.sidebarStatus === 'opened'" @toggle-click="toggleSideBar" />
		<breadcrumb />
	</div>
</template>

<script setup lang="ts">
	const store = useStore();
	
	const toggleSideBar = () => {
		store.commit('toggleSidebar');
	}
</script>