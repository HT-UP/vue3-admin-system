<template>
	<div class="page-container">
		<div class="search-container">
			<el-form ref="searchFormRef" :model="searchForm" :inline="true" @submit.prevent>
				<el-form-item prop="dictTypeName" label="类型名称">
					<el-input v-model.trim="searchForm.dictTypeName" placeholder="请输入字典类型名称" clearable
						@keyup.enter="searchHandle" />
				</el-form-item>
				<el-form-item prop="dictTypeCode" label="类型编码">
					<el-input v-model.trim="searchForm.dictTypeCode" placeholder="请输入字典类型编码" clearable
						@keyup.enter="searchHandle" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="searchHandle"><i-ep-search />查询</el-button>
					<el-button @click="resetHandle"><i-ep-refresh />重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-container">
			<el-card shadow="never">
				<template #header>
					<div class="card-header">
						<el-button type="success" @click="addHandle"><i-ep-plus />新增</el-button>
					</div>
				</template>
				<el-table ref="tableRef" :data="tableList" highlight-current-row border v-loading="tableLoading">
					<el-table-column label="字典类型名称" prop="dictTypeName" min-width="120" show-overflow-tooltip />
					<el-table-column label="字典类型编码" prop="dictTypeCode" min-width="120" show-overflow-tooltip />
					<el-table-column label="类型描述" prop="dictTypeDesc" min-width="150" show-overflow-tooltip />

					<el-table-column fixed="right" label="操作" width="220">
						<template #default="{ row }">
							<el-button type="primary" link size="small"
								@click="editHandle(row)"><i-ep-edit />编辑</el-button>
							<el-button type="warning" link size="small"
								@click="detailHandle(row)"><i-ep-Tickets />明细</el-button>
							<el-button v-if="!row.userStatus" type="danger" link size="small"
								@click="deleteHandle(row.id)"><i-ep-delete />删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination :total="total" v-model:page="searchForm.current" v-model:page-size="searchForm.pageSize"
					@on-change="getList" />
			</el-card>
		</div>

		<TypeDialog v-model:visible="typeDialogVisible" :row-data="rowData" :handle-type="handleType"
			@addUpdate="searchHandle" @editUpdate="getList">
		</TypeDialog>
		<DetailDialog v-model:visible="detailDialogVisible" :row-data="rowData"></DetailDialog>
	</div>
</template>

<script setup lang="ts">
	defineOptions({
		name: "Dictionary",
		inheritAttrs: false,
	});

	import { getDictionaryTypeListApi, deleteDictionaryTypeApi } from "@/api/system/dictionary";
	import TypeDialog from "./components/TypeDialog.vue";
	import DetailDialog from "./components/DetailDialog.vue";

	const searchFormRef = ref();
	const searchForm = reactive({
		dictTypeName: '',
		dictTypeCode: '',
		current: 1,
		pageSize: 10
	})
	const tableLoading = ref(false);
	const tableList = ref([]);
	const total = ref(0);
	const searchHandle = () => {
		searchForm.current = 1;
		getList();
	}
	const resetHandle = () => {
		searchFormRef.value.resetFields();
		searchHandle();
	}
	const getList = async () => {
		try {
			tableLoading.value = true;
			let res = await getDictionaryTypeListApi(searchForm);
			tableList.value = res.data.rows;
			total.value = res.data.total;
		} catch (e) {

		} finally {
			tableLoading.value = false;
		}
	}
	const deleteHandle = (id) => {
		ElMessageBox.confirm('请确认是否删除该字典类型？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			try {
				tableLoading.value = true;
				await deleteDictionaryTypeApi(id);
				ElMessage.success("操作成功");
				getList();
			} catch (e) {

			} finally {
				tableLoading.value = false;
			}
		}).catch(() => {

		})
	}
	const typeDialogVisible = ref(false);
	const handleType = ref('');
	const rowData = ref({});
	const addHandle = () => {
		rowData.value = {};
		handleType.value = 'add';
		typeDialogVisible.value = true;
	}
	const editHandle = (data) => {
		rowData.value = Object.assign({}, data);
		handleType.value = 'edit';
		typeDialogVisible.value = true;
	}
	const detailDialogVisible = ref(false);
	const detailHandle = (data) => {
		rowData.value = Object.assign({}, data);
		detailDialogVisible.value = true;
	}

	onMounted(() => {
		getList();
	});
</script>

<style lang="scss" scoped>

</style>