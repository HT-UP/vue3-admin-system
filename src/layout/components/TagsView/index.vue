<template>
	<div class="tags-container">
		<el-scrollbar class="scroll-container" :vertical="false" @wheel.prevent="handleScroll">
			<router-link ref="tagRef" v-for="tag in visitedViews" :key="tag.fullPath"
				:class="'tags-item ' + (isActive(tag) ? 'active' : '')"
				:to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
				@contextmenu.prevent="openContentMenu(tag, $event)">
				{{ tag.title }}
				<i-ep-close v-if="visitedViews.length > 1" class="close-icon" size="12px"
					@click.prevent.stop="closeSelectedTag(tag)" />
			</router-link>
		</el-scrollbar>

		<!-- tag标签操作菜单 -->
		<ul v-show="contentMenuVisible" class="contextmenu" :style="{ left: left + 'px', top: top + 'px' }">
			<li class="flex-y-center" @click="refreshSelectedTag(selectedTag)">
				<i-ep-refresh class="m-r-1" />
				刷新页面
			</li>
			<li v-if="visitedViews.length > 1" class="flex-y-center" @click="closeSelectedTag(selectedTag)">
				<i-ep-close class="m-r-1" />
				关闭当前
			</li>
			<li v-if="visitedViews.length > 1" class="flex-y-center" @click="closeOtherTags">
				<i-ep-switch class="m-r-1" />
				关闭其它
			</li>
			<li v-if="!isFirstView()" class="flex-y-center" @click="closeLeftTags">
				<i-ep-download class="m-r-1 rotate-90" />
				关闭左侧
			</li>
			<li v-if="!isLastView()" class="flex-y-center" @click="closeRightTags">
				<i-ep-upload class="m-r-1 rotate-90" />
				关闭右侧
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { resolve } from "path-browserify";

	const { proxy } = getCurrentInstance()!;
	const store = useStore();
	const route = useRoute();
	const router = useRouter();

	const visitedViews = computed(() => store.state.tagsView.visitedViews);

	const isActive = (val) => {
		return val.path === route.path;
	}
	const refreshSelectedTag = (view) => {
		store.dispatch('tagsView/delCachedView', view).then(() => {
			const { fullPath } = view;
			nextTick(() => {
				router.replace({
					path: '/redirect' + fullPath
				})
			})
		})
	}
	const closeSelectedTag = (view) => {
		store.dispatch('tagsView/delView', view).then(({
			visitedViews
		}) => {
			if (isActive(view)) {
				toLastView(visitedViews, view)
			}
		})
	}
	const closeOtherTags = () => {
		router.push(selectedTag.value)
		store.dispatch('tagsView/delOtherViews', selectedTag.value).then(() => {
			moveToCurrentTag();
		})
	}
	const closeLeftTags = () => {
		store.dispatch('tagsView/delLeftTags', selectedTag.value).then(visitedViews => {
			if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
				router.push(selectedTag.value);
			}
		})
	}
	const closeRightTags = () => {
		store.dispatch('tagsView/delRightTags', selectedTag.value).then(visitedViews => {
			if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
				router.push(selectedTag.value);
			}
		})
	}
	
	const toLastView = (visitedViews, view) => {
		const latestView = visitedViews.slice(-1)[0];
		if (latestView) {
			router.push(latestView.fullPath);
		} else {
			if (view.name === 'Dashboard') {
				router.replace({
					path: '/redirect' + view.fullPath
				})
			} else {
				router.push('/')
			}
		}
	}
	watch(route, () => {
		addTags();
		moveToCurrentTag();
	}
	);
	const moveToCurrentTag = () => {
		// 使用 nextTick() 的目的是确保在更新 tagsView 组件之前，scrollPaneRef 对象已经滚动到了正确的位置。
		nextTick(() => {
			for (const tag of visitedViews.value) {
				if (tag.path === route.path) {
					if (tag.fullPath !== route.fullPath) {
						store.dispatch('tagsView/updateVisitedView', route)
					}
				}
			}
		});
	}
	/**
	 * 过滤出需要固定的标签
	 */
	const filterAffixTags = (routes, basePath = "/") => {
		let tags = [];
		routes.forEach((route) => {
			if (route.meta && route.meta.affix) {
				const tagPath = resolve(basePath, route.path);
				tags.push({
					path: tagPath,
					fullPath: tagPath,
					name: String(route.name),
					meta: {
						...route.meta
					}
				});
			}
			if (route.children) {
				const tempTags = filterAffixTags(route.children, basePath + route.path);
				if (tempTags.length >= 1) {
					tags = [...tags, ...tempTags];
				}
			}
		});
		return tags;
	}
	//初始化tags
	const initTags = () => {
		const affixTags = filterAffixTags(store.state.routerMenu);
		for (const tag of affixTags) {
			if (tag.name) {
				store.dispatch('tagsView/addVisitedView', tag);
			}
		}
	}
	/* 添加页签 */
	const addTags = () => {
		const { name } = route;
		if (name) {
			store.dispatch('tagsView/addView', route)
		}
		return false;
	}
	const selectedTag = ref({});
	const left = ref(0);
	const top = ref(0);
	const isFirstView = () => {
		try {
			return selectedTag.value.fullPath === visitedViews.value[0].fullPath;
		} catch (err) {
			return false;
		}
	}
	const isLastView = () => {
		try {
			return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath;
		} catch (err) {
			return false;
		}
	}
	const contentMenuVisible = ref(false); // 右键菜单是否显示
	watch(contentMenuVisible, (value) => {
		if (value) {
			document.body.addEventListener("click", closeContentMenu);
		} else {
			document.body.removeEventListener("click", closeContentMenu);
		}
	});
	/**
	 * 打开右键菜单
	 */
	const openContentMenu = (tag, e) => {
		const menuMinWidth = 105;
		const offsetLeft = proxy?.$el.getBoundingClientRect().left; // container margin left
		const offsetWidth = proxy?.$el.offsetWidth; // container width
		const maxLeft = offsetWidth - menuMinWidth; // left boundary
		const l = e.clientX - offsetLeft + 15; // 15: margin right

		if (l > maxLeft) {
			left.value = maxLeft;
		} else {
			left.value = l;
		}
		top.value = e.clientY;
		contentMenuVisible.value = true;
		selectedTag.value = tag;
	}
	/**
	 * 关闭右键菜单
	 */
	const closeContentMenu = () => {
		contentMenuVisible.value = false;
	}
	/**
	 * 滚动事件
	 */
	const handleScroll = () => {
		closeContentMenu();
	}



	onMounted(() => {
		initTags();
		addTags();
	});
</script>
<style lang="scss" scoped>
	.tags-container {
		width: 100%;
		height: 34px;
		background-color: var(--el-bg-color);
		border: 1px solid var(--el-border-color-light);
		box-shadow: 0 1px 1px var(--el-box-shadow-light);

		.tags-item {
			display: inline-block;
			padding: 3px 8px;
			margin: 4px 0 0 5px;
			font-size: 12px;
			cursor: pointer;
			border: 1px solid var(--el-border-color-light);

			&:hover {
				color: var(--el-color-primary);
			}

			&:first-of-type {
				margin-left: 15px;
			}

			&:last-of-type {
				margin-right: 15px;
			}

			.close-icon {
				border-radius: 50%;

				&:hover {
					color: #fff;
					background-color: var(--el-color-primary);
				}
			}

			&.active {
				color: #fff;
				background-color: var(--el-color-primary);

				&::before {
					display: inline-block;
					width: 8px;
					height: 8px;
					margin-right: 5px;
					content: "";
					background: #fff;
					border-radius: 50%;
				}

				.close-icon:hover {
					color: var(--el-color-primary);
					background-color: var(--el-fill-color-light);
				}
			}
		}
	}

	.contextmenu {
		position: absolute;
		z-index: 99;
		font-size: 12px;
		background: var(--el-bg-color-overlay);
		border-radius: 4px;
		box-shadow: var(--el-box-shadow-light);

		li {
			padding: 8px 14px 8px 12px;
			cursor: pointer;

			&:hover {
				background: var(--el-fill-color-light);
			}
		}
	}

	.scroll-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;

		.el-scrollbar__bar {
			bottom: 0;
		}

		.el-scrollbar__wrap {
			height: 49px;
		}
	}
</style>