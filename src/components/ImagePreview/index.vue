<template>
	<div class="image-preview" :style="{width: size, height: size}">
		<el-image :src="imgUrl || ''" fit="cover" :style="{width: size, height: size}" :preview-src-list="previewList"
			:initial-index="imgIndex" preview-teleported hide-on-click-modal>
			<template #error>
				<div class="image-slot">
					<el-icon><icon-picture /></el-icon>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script setup lang="ts">
	import { Picture as IconPicture } from '@element-plus/icons-vue'

	const props = defineProps({
		imgUrl: {
			type: String,
			default: "",
		},
		previewList: {
			type: Array,
			default() {
				return [];
			},
		},
		size: {
			type: String,
			default: "30px",
		},
		imgIndex: {
			type: Number,
			default: 0,
		}
	})
</script>
<style lang="scss" scoped>
	.image-preview {
		.image-slot {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			background: var(--el-fill-color-light);
			color: var(--el-text-color-secondary);
			font-size: 30px;
		}
	}
</style>