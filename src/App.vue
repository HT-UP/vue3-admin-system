<template>
	<div id="app">
		<el-config-provider :locale="locale">
			<router-view />
		</el-config-provider>
	</div>
</template>

<script setup lang="ts">
	import zhCn from 'element-plus/es/locale/lang/zh-cn'
	
	const locale = zhCn;
</script>

<style scoped>

</style>