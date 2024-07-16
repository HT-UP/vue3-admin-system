<template>
	<div class="flex-center">
		<template v-if="!isMobile">
			<!--全屏 -->
			<div class="setting-item" @click="toggle">
				<i-ep-FullScreen v-if="!isFullscreen" style="font-size: 14px;" />
				<i-ep-CopyDocument v-else  style="font-size: 14px;" />
			</div>
		</template>

		<!-- 用户头像 -->
		<el-dropdown class="setting-item" trigger="click">
			<div class="flex-center h100% p10px">
				<img :src="$store.state.userInfo.avatar + '?imageView2/1/w/80/h/80'" class="rounded-full mr-10px w24px w24px" />
				<span>{{ $store.state.userInfo.username }}</span>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item @click="setHandle">系统设置</el-dropdown-item>
					<el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>
<script setup lang="ts">
	import { loginOutApi } from "@/api/user";
	
	const route = useRoute();
	const router = useRouter();
	const store = useStore();

	const isMobile = computed(() => store.state.device === 'mobile');

	const { isFullscreen, toggle } = useFullscreen();
	
	const setHandle = () => {
		store.commit("openSettingsDrawer");
	}

	//注销
	const logout = () => {
		ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
			lockScroll: false,
		}).then(async () => {
			await loginOutApi();
			localStorage.setItem("TOKEN_KEY", "");
			location.reload(); // 清空路由
			router.push(`/login?redirect=${route.fullPath}`);
		}).catch(() => {});
	}
</script>
<style lang="scss" scoped>
	.setting-item {
		display: inline-block;
		min-width: 40px;
		height: $navbar-height;
		line-height: $navbar-height;
		color: var(--el-text-color);
		text-align: center;
		cursor: pointer;

		&:hover {
			background: rgb(0 0 0 / 10%);
		}
	}

	.layout-top {
		.setting-item,
		.el-icon {
			color: var(--el-color-white);
		}
	}

	.dark .setting-item:hover {
		background: rgb(255 255 255 / 20%);
	}
</style>