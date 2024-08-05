<template>
	<div class="page-container">
		<div class="search-container">
			<el-form ref="searchFormRef" :model="searchForm" :inline="true" @submit.prevent>
				<el-form-item prop="roleName" label="角色名称">
					<el-input v-model.trim="searchForm.roleName" placeholder="请输入角色名称" clearable
						@keyup.enter="searchHandle" />
				</el-form-item>
				<el-form-item prop="dictDataId" label="所属系统">
					<el-select v-model="searchForm.dictDataId" placeholder="请选择所属系统" clearable>
						<el-option v-for="item in systemList" :key="item.id" :label="item.displayValue"
							:value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item prop="roleStatus" label="角色状态">
					<el-select v-model="searchForm.roleStatus" placeholder="请选择角色状态" clearable>
						<el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
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
					<el-table-column label="角色名称" prop="roleName" min-width="120" show-overflow-tooltip />
					<el-table-column label="角色类型" align="center" width="150">
						<template #default="{ row }">
							<el-tag v-if="row.roleType === 0" type="success">系统角色</el-tag>
							<el-tag v-if="row.roleType === 1" type="warning">用户角色</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="所属系统" prop="displayValue" min-width="150" show-overflow-tooltip />
					<el-table-column label="角色状态" prop="roleStatus" width="150" align="center">
						<template #default="{ row }">
							<el-switch v-model="row.roleStatus" :loading="row.statusLoading"
								:before-change="()=>switchBeforeChange(row)" />
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="createTime" width="160" show-overflow-tooltip />

					<el-table-column fixed="right" label="操作" width="220">
						<template #default="{ row }">
							<el-button type="primary" link size="small"
								@click="editHandle(row.id)"><i-ep-edit />编辑</el-button>
							<el-button v-if="row.roleStatus" type="success" link size="small"
								@click="shareHandle(row.id)">
								<svg-icon icon-class="captcha" class="text-16px" />授权</el-button>
							<el-button v-if="!row.roleStatus" type="danger" link size="small"
								@click="deleteHandle(row.id)"><i-ep-delete />删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination :total="total" v-model:page="searchForm.current" v-model:page-size="searchForm.pageSize"
					@on-change="getList" />
			</el-card>
		</div>

		<RoleDialog v-model:visible="roleDialogVisible" :system-list="systemList" :row-id="rowId"
			:handle-type="handleType" @addUpdate="searchHandle" @editUpdate="getList">
		</RoleDialog>
	</div>
</template>

<script setup lang="ts">
	defineOptions({
		name: "Role",
		inheritAttrs: false,
	});
	import { getSystemOptionsApi } from "@/api/system/menu";
	import { getRoleListApi, editRoleStatusApi, deleteRoleApi } from "@/api/system/role";
	import RoleDialog from "./components/RoleDialog.vue";

	const searchFormRef = ref();
	const searchForm = reactive({
		roleName: '',
		dictDataId: '',
		roleStatus: '',
		current: 1,
		pageSize: 10
	})
	const systemList = ref([]);
	const statusList = ref([
		{ id: true, name: '启用' },
		{ id: false, name: '停用' }
	]);
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
	const getSystemOptions = async () => {
		let res = await getSystemOptionsApi();
		systemList.value = res.data;
	}
	const getList = async () => {
		try {
			tableLoading.value = true;
			let res = await getRoleListApi(searchForm);
			tableList.value = res.data.rows;
			total.value = res.data.total;
		} catch (e) {

		} finally {
			tableLoading.value = false;
		}
	}
	const switchBeforeChange = async (row) => {
		return new Promise(async (_, reject) => {
			try{
				row.statusLoading = true;
				await editRoleStatusApi(row.id, {
					status: !row.roleStatus
				})
				ElMessage.success('操作成功');
				getList();
			}catch(e){
				return reject(new Error('Error'));
			}finally{
				row.statusLoading = false;
			}
		})
	}
	const deleteHandle = (id) => {
		ElMessageBox.confirm('请确认是否删除该角色？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			try {
				tableLoading.value = true;
				await deleteRoleApi(id);
				ElMessage.success("操作成功");
				getList();
			} catch (e) {
			
			} finally {
				tableLoading.value = false;
			}
		}).catch(() => {

		})
	}
	const roleDialogVisible = ref(false);
	const handleType = ref('');
	const rowId = ref('');
	const addHandle = () => {
		rowId.value = '';
		handleType.value = 'add';
		roleDialogVisible.value = true;
	}
	const editHandle = (id) => {
		rowId.value = id;
		handleType.value = 'edit';
		roleDialogVisible.value = true;
	}
	const shareHandle = (id) => {
		rowId.value = id;
		handleType.value = 'share';
		roleDialogVisible.value = true;
	}

	onMounted(() => {
		getSystemOptions();
		getList();
	});
</script>
<style lang="scss" scoped>

</style>