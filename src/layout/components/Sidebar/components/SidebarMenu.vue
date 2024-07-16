<template>
	<el-menu :default-active="currentRoute.path" :collapse="$store.state.sidebarStatus === 'closed'"
		:background-color="variables['menu-background']" :text-color="variables['menu-text']"
		:active-text-color="variables['menu-active-text']" :unique-opened="false" :collapse-transition="false"
		:mode="mode">
		<SidebarMenuItem v-for="route in menuList" :key="route.path" :item="route" :base-path="resolvePath(route.path)" />
	</el-menu>
</template>

<script lang="ts" setup>
	import SidebarMenuItem from './SidebarMenuItem.vue';
	import { isExternal } from "@/utils/index";
	import path from "path-browserify";
	import variables from "@/styles/variables.module.scss";

	const currentRoute = useRoute();
	const store = useStore();
	const props = defineProps({
		menuList: {
			required: true,
			default: () => {
				return [];
			},
			type: Array<any>,
		},
		basePath: {
			type: String,
			required: true,
		},
	});
	const mode = computed(() => {
		return store.state.layout === 'top' ? "horizontal" : "vertical";
	});

	/**
	 * 解析路径
	 *
	 * @param routePath 路由路径 /user
	 */
	const resolvePath = (routePath : string) => {
		if (isExternal(routePath)) {
			return routePath;
		}
		if (isExternal(props.basePath)) {
			return props.basePath;
		}

		// 完整绝对路径 = 父级路径(/system) + 路由路径(/user)
		const fullPath = path.resolve(props.basePath, routePath);
		return fullPath;
	}
</script>