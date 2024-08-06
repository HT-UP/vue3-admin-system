<template>
	<div id="detail-dialog">
		<el-dialog :modelValue="visible" :title="`【${rowData.dictTypeName}】明细表`" width="40%" top="15vh"
			:close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close draggable @open="openHandle"
			@close="cancelHandle">
			<div class="table-container">
				<el-card shadow="never">
					<template #header>
						<div class="card-header">
							<el-button type="success" @click="addHandle"><i-ep-plus />新增</el-button>
						</div>
					</template>
					<el-table ref="tableRef" :data="tableList" highlight-current-row border v-loading="tableLoading"
						height="440">
						<el-table-column label="字典项名称" prop="displayValue" min-width="120" show-overflow-tooltip />
						<el-table-column label="字典项编码" prop="storageValue" min-width="120" show-overflow-tooltip />
						<el-table-column label="字典项描述" prop="dictDataDesc" min-width="150" show-overflow-tooltip />
						<el-table-column fixed="right" label="操作" width="130">
							<template #default="{ row }">
								<el-button type="primary" link size="small"
									@click="editHandle(row)"><i-ep-edit />编辑</el-button>
								<el-button v-if="!row.userStatus" type="danger" link size="small"
									@click="deleteHandle(row.id)"><i-ep-delete />删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination :total="total" v-model:page="searchForm.current" v-model:page-size="searchForm.pageSize"
						@on-change="getList" />
				</el-card>
			</div>
		</el-dialog>

		<DictionaryDialog v-model:visible="dictionaryDialogVisible" :current-data="currentData"
			:handle-type="handleType" :type-id="rowData.id" :type-name="rowData.dictTypeName" @addUpdate="searchHandle"
			@editUpdate="getList">
		</DictionaryDialog>
	</div>
</template>

<script lang="ts" setup>
	import { getDictionaryDataListApi, deleteDictionaryDataApi } from "@/api/system/dictionary";
	import DictionaryDialog from "./DictionaryDialog.vue";

	const props = defineProps({
		visible: {
			type: Boolean,
			default: false,
		},
		rowData: {
			type: Object,
			default() {
				return {}
			}
		}
	});
	const emits = defineEmits(['update:visible']);
	const tableLoading = ref(false);
	const searchForm = reactive({
		current: 1,
		pageSize: 10
	})
	const tableList = ref([]);
	const total = ref(0);
	const searchHandle = () => {
		searchForm.current = 1;
		getList();
	}
	const getList = async () => {
		try {
			tableLoading.value = true;
			let res = await getDictionaryDataListApi(props.rowData.id, searchForm);
			tableList.value = res.data.rows;
			total.value = res.data.total;
		} catch (e) {

		} finally {
			tableLoading.value = false;
		}
	}

	const openHandle = () => {
		getList();
	}
	const cancelHandle = () => {
		searchForm.current = 1;
		tableList.value = [];
		total.value = 0;
		emits('update:visible', false);
	}
	const dictionaryDialogVisible = ref(false);
	const handleType = ref('');
	const currentData = ref({});
	const addHandle = () => {
		currentData.value = {};
		handleType.value = 'add';
		dictionaryDialogVisible.value = true;
	}
	const editHandle = (data) => {
		currentData.value = Object.assign({}, data);
		handleType.value = 'edit';
		dictionaryDialogVisible.value = true;
	}
	const deleteHandle = (id) => {
		ElMessageBox.confirm('请确认是否删除该字典数据？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			try {
				tableLoading.value = true;
				await deleteDictionaryDataApi(id);
				ElMessage.success("操作成功");
				getList();
			} catch (e) {

			} finally {
				tableLoading.value = false;
			}
		}).catch(() => {

		})
	}
</script>

<style lang="scss" scoped>
	#detail-dialog {}
</style>