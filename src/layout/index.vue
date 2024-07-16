<template>
	<div class="wh-full" :class="classObj">
		<!-- 遮罩层 -->
		<div v-if="isMobile && isOpenSidebar" class="wh-full fixed-lt z-999 bg-black bg-opacity-30"
			@click="handleOutsideClick">
		</div>
		
		<!-- 公用侧边栏 -->
		<Sidebar class="sidebar-container" />
		
		<!-- 左侧和顶部布局 -->
		<div class="main-container">
		  <div :class="{ 'fixed-header': fixedHeader }" style="box-shadow: 0 0 10px rgba(3, 3, 3, .5);">
		    <NavBar v-if="layout === 'left'" />
		    <TagsView v-if="showTagsView" />
		  </div>
		  <AppMain />
		  <Settings  />
		  
		  <el-backtop target=".main-container"></el-backtop>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useWindowSize } from '@vueuse/core';
	import Sidebar from './components/Sidebar/index.vue';
	import NavBar from './components/NavBar/index.vue';
	import TagsView from './components/TagsView/index.vue';
	import AppMain from './components/AppMain/index.vue';
	import Settings from './components/Settings/index.vue';
	
	const store = useStore();
	const width = useWindowSize().width;

	const WIDTH_DESKTOP = 992; // 响应式布局容器固定宽度  大屏（>=1200px） 中屏（>=992px） 小屏（>=768px）
	const classObj = computed(() => ({
		openSidebar: store.state.sidebarStatus === 'opened',
		hideSidebar: store.state.sidebarStatus === 'closed',
		mobile: store.state.device === 'mobile',
		[`layout-${store.state.layout}`]: true,
	}));
	const isMobile = computed(() => store.state.device === 'mobile');
	const isOpenSidebar = computed(() => store.state.sidebarStatus === 'opened');
	const showTagsView = computed(() => store.state.showTagsView); // 是否显示tags
	const fixedHeader = computed(() => store.state.fixedHeader); // 是否固定header
	const layout = computed(() => store.state.layout); // 布局模式 left top
	const activeTopMenuPath = computed(() => store.state.activeTopMenuPath); // 顶部菜单激活path

	const handleOutsideClick = () => {
		store.commit('closeSideBar');
	}

	watchEffect(() => {
		if (width.value < WIDTH_DESKTOP) {
			store.commit('toggleDevice', "mobile");
			store.commit('closeSideBar');
		} else {
			store.commit('toggleDevice', "desktop");
			store.commit('openSideBar');
		}
	});

	const route = useRoute();
	watch(route, () => {
		if (isMobile.value && isOpenSidebar.value) {
			store.commit('closeSideBar');
		}
	});
</script>

<style lang="scss" scoped>
	.sidebar-container {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
		width: $sidebar-width;
		background-color: $menu-background;
		transition: width 0.28s;

		:deep(.el-menu) {
			border: none;
		}
	}

	.main-container {
		position: relative;
		height: 100%;
		margin-left: $sidebar-width;
		overflow-y: auto;
		transition: margin-left 0.28s;

		.fixed-header {
			position: sticky;
			top: 0;
			z-index: 9;
			transition: width 0.28s;
		}
	}

	.layout-top {
		.sidebar-container {
			position: sticky;
			z-index: 999;
			display: flex;
			width: 100% !important;
			height: $navbar-height;

			:deep(.el-scrollbar) {
				flex: 1;
				height: $navbar-height;
			}

			:deep(.el-menu-item),
			:deep(.el-sub-menu__title),
			:deep(.el-menu--horizontal) {
				height: $navbar-height;
				line-height: $navbar-height;
			}

			:deep(.el-menu--collapse) {
				width: 100%;
			}
		}

		.main-container {
			height: calc(100vh - $navbar-height);
			margin-left: 0;
		}
	}

	.hideSidebar {
		.main-container {
			margin-left: $sidebar-width-collapsed;
		}

		&.layout-top {
			.main-container {
				margin-left: 0;
			}
		}

		&.layout-mix {
			.sidebar-container {
				width: 100% !important;
			}

			.mix-container {
				.mix-container__left {
					width: $sidebar-width-collapsed;
				}
			}
		}
	}

	.layout-left.hideSidebar {
		.sidebar-container {
			width: $sidebar-width-collapsed !important;
		}

		.main-container {
			margin-left: $sidebar-width-collapsed;
		}

		&.mobile {
			.sidebar-container {
				pointer-events: none;
				transition-duration: 0.3s;
				transform: translate3d(-210px, 0, 0);
			}

			.main-container {
				margin-left: 0;
			}
		}
	}

	.mobile {
		.main-container {
			margin-left: 0;
		}

		&.layout-top {
			// 顶部模式全局变量修改
			--el-menu-item-height: $navbar-height;
		}
	}
</style>