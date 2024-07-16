<template>
	<div class="flex flex-wrap justify-around w-full h-12">
		<el-tooltip content="左侧模式" placement="bottom">
			<div class="layout-item left" :class="{ 'is-active': modelValue === 'left' }"
				@click="updateValue('left')">
				<div></div>
				<div></div>
			</div>
		</el-tooltip>

		<el-tooltip content="顶部模式" placement="bottom">
			<div class="layout-item top" :class="{ 'is-active': modelValue === 'top' }"
				@click="updateValue('top')">
				<div></div>
				<div></div>
			</div>
		</el-tooltip>
	</div>
</template>

<script lang="ts" setup>
	const props = defineProps({
		modelValue: String,
	});

	const emit = defineEmits(["update:modelValue"]);

	const updateValue = (layout : string) => {
		emit("update:modelValue", layout);
	}
</script>

<style scoped>
	.layout-selector {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		width: 100%;
		height: 50px;
	}

	.layout-item {
		position: relative;
		width: 18%;
		height: 45px;
		overflow: hidden;
		cursor: pointer;
		background: #f0f2f5;
		border-radius: 4px;

		&.mix div:nth-child(1),
		&.top div:nth-child(1) {
			width: 100%;
			height: 30%;
			background: #1b2a47;
			box-shadow: 0 0 1px #888;
		}

		&.mix div:nth-child(2) {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 30%;
			height: 70%;
			background: #1b2a47;
			box-shadow: 0 0 1px #888;
		}

		&.left div:nth-child(1) {
			width: 30%;
			height: 100%;
			background: #1b2a47;
		}

		&.left div:nth-child(2) {
			position: absolute;
			top: 0;
			right: 0;
			width: 70%;
			height: 30%;
			background: #fff;
			box-shadow: 0 0 1px #888;
		}
	}

	.layout-item.is-active {
		border: 2px solid var(--el-color-primary);
	}
</style>