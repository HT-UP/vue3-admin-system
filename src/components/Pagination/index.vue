<template>
	<el-scrollbar class="w-full flex-x-end">
		<div class="pagination">
			<el-pagination :total="total" v-model:page-size="pageSize" v-model:current-page="page" :page-sizes="pageSizes"
				:pager-count="5" background :layout="layout" @current-change="currentChange"
				@size-change="sizeChange" />
		</div>
	</el-scrollbar>
</template>

<script setup lang="ts">
	const props = defineProps({
		total: {
			required: true,
			type: Number as PropType<number>,
			default: 0,
		},
		page: {
			type: Number,
			default: 1,
		},
		pageSize: {
			type: Number,
			default: 10
		},
		pageSizes: {
			type: Array as PropType<number[]>,
			default() {
				return [10, 20, 30, 50];
			},
		},
		layout: {
			type: String,
			default: "total, sizes, prev, pager, next, jumper",
		}
	});

	const emit = defineEmits(["onChange", "update:page", "update:pageSize"]);
	const page = useVModel(props, "page", emit);
	const pageSize = useVModel(props, "pageSize", emit);

	const sizeChange = (val) => {
		emit('update:pageSize', val);
		emit('onChange');
	}
	const currentChange = (val) => {
		emit('update:page', val);
		emit('onChange');
	}
</script>
<style lang="scss" scoped>
	.pagination {
		padding: 12px 12px 0 12px;
		flex: 1;
	}
</style>