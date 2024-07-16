<template>
	<div>
		<!--左侧布局 || 顶部布局 -->
		<SidebarLogo :collapse="$store.state.sidebarStatus === 'closed'" />
		<el-scrollbar>
		  <SidebarMenu :menu-list="$store.state.routerMenu" base-path="" />
		</el-scrollbar>
		<NavbarRight v-if="$store.state.layout === 'top'" />
	</div>
</template>

<script setup lang="ts">
	import SidebarLogo from './components/SidebarLogo.vue';
	import SidebarMenu from './components/SidebarMenu.vue';
	import NavbarRight from '../NavBar/components/NavbarRight.vue';
</script>