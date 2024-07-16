<template>
	<el-drawer v-model="$store.state.settingsVisible" size="300" title="系统设置" :before-close="handleClose">
		<el-divider>主题设置</el-divider>
		<div class="flex-center">
			<el-switch v-model="isDark" active-icon="Moon" inactive-icon="Sunny" @change="changeTheme" />
		</div>
		<el-divider>界面设置</el-divider>
		<div class="settings-option">
			<span class="text-xs">开启 Tags-View</span>
			<el-switch v-model="isShowTags" @change="changeShowTags" />
		</div>
		<div class="settings-option">
			<span class="text-xs">固定 Header</span>
			<el-switch v-model="isFixed" @change="changeHeader" />
		</div>
		<el-divider>导航设置</el-divider>
		<LayoutSelect v-model="$store.state.layout" @update:model-value="changeLayout" />
	</el-drawer>
</template>

<script setup lang="ts">
	import LayoutSelect from './components/LayoutSelect.vue'

	const store = useStore();
	const handleClose = (done : () => void) => {
		store.commit("closeSettingsDrawer");
		done();
	}

	//切换主题
	const isDark = ref<boolean>(store.state.theme === 'dark');
	const changeTheme = (val : string) => {
		isDark.value = val;
		store.commit("changeTheme", isDark.value ? 'dark' : 'light');
	}
	//切换显示隐藏tags
	const isShowTags = ref<boolean>(JSON.parse(store.state.showTagsView));
	const changeShowTags = (val : boolean) => {
		isShowTags.value = val;
		store.commit("changeShowTags", isShowTags.value);
	}
	//切换固定header
	const isFixed = ref<boolean>(JSON.parse(store.state.fixedHeader));
	const changeHeader = (val : boolean) => {
		isFixed.value = val;
		store.commit("changeHeader", isFixed.value);
	}
	//切换导航
	const changeLayout = (val : string) => {
		store.commit("changeLayout", val);
	}

	watch(isDark, (newValue) => {
		let html = document.documentElement;
		isDark.value ? html.className = 'dark' : html.className = '';
	}, {
		immediate: true, // 立即执行，确保在侦听器创建时执行一次
	})
</script>
<style lang="scss" scoped>
	.settings-option {
		@apply py-1 flex-x-between;
	}
</style>