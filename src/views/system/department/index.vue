<template>
	<div class="page-container">
		<div class="search-container">
			<el-form ref="searchFormRef" :model="searchForm" :inline="true" @submit.prevent>
				<el-form-item prop="deptName" label="部门名称">
					<el-input v-model.trim="searchForm.deptName" placeholder="请输入部门名称" clearable
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
						<el-button type="success" @click="addHandle('')"><i-ep-plus />新增</el-button>
					</div>
				</template>

				<el-table ref="tableRef" :data="tableList" highlight-current-row border v-loading="tableLoading"
					row-key="id" default-expand-all :tree-props="{ children: 'child', hasChildren: 'hasChildren' }">
					<el-table-column label="部门名称" prop="deptName" min-width="200" show-overflow-tooltip />
					<!-- <el-table-column label="部门领导" prop="deptLeaderName" width="200" /> -->
					<el-table-column label="部门描述" prop="deptDesc" min-width="200" show-overflow-tooltip />

					<el-table-column fixed="right" label="操作" width="200">
						<template #default="{ row }">
							<el-button type="success" link size="small"
								@click="addHandle(row.id)"><i-ep-plus />新增</el-button>
							<el-button v-if="row.higherDeptId" type="primary" link size="small"
								@click="editHandle(row.id)"><i-ep-edit />编辑</el-button>
							<el-button v-if="row.higherDeptId" type="danger" link size="small"
								@click="deleteHandle(row.id)"><i-ep-delete />删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>

		<DepartmentDialog v-model:visible="departmentDialogVisible" :row-id="rowId" :handle-type="handleType" @update="getList">
		</DepartmentDialog>
	</div>
</template>

<script setup lang="ts">
	defineOptions({
		name: "Department",
		inheritAttrs: false,
	});

	import { getDeptListApi, deleteDeptApi } from "@/api/system/department";
	import DepartmentDialog from "./components/DepartmentDialog.vue";

	const searchFormRef = ref();
	const searchForm = reactive({
		deptName: ''
	})
	const tableLoading = ref(false);
	const tableList = ref([]);

	const searchHandle = () => {
		getList();
	}
	const resetHandle = () => {
		searchFormRef.value.resetFields();
		searchHandle();
	}
	const getList = async () => {
		try {
			tableLoading.value = true;
			let res = await getDeptListApi(searchForm);
			tableList.value = res.data;
		} catch (e) {

		} finally {
			tableLoading.value = false;
		}
	}
	const departmentDialogVisible = ref(false);
	const handleType = ref('');
	const rowId = ref('');
	const addHandle = (id) => {
		rowId.value = id;
		handleType.value = 'add';
		departmentDialogVisible.value = true;
	}
	const editHandle = (id) => {
		rowId.value = id;
		handleType.value = 'edit';
		departmentDialogVisible.value = true;
	}
	const deleteHandle = (id) => {
		ElMessageBox.confirm('请确认是否删除该部门？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			try {
				tableLoading.value = true;
				await deleteDeptApi(id);
				ElMessage.success("操作成功");
				getList();
			} catch (e) {

			} finally {
				tableLoading.value = false;
			}
		}).catch(() => {

		})
	}

	onMounted(() => {
		getList();
	});
</script>
<style lang="scss" scoped>

</style>