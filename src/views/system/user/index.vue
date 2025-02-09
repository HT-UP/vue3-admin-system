<template>
	<div class="page-container">
		<div class="search-container">
			<el-form ref="searchFormRef" :model="searchForm" :inline="true" @submit.prevent>
				<el-form-item prop="userName" label="员工姓名">
					<el-input v-model.trim="searchForm.userName" placeholder="请输入员工姓名" clearable
						@keyup.enter="searchHandle" />
				</el-form-item>
				<el-form-item prop="deptId" label="所属部门">
					<el-cascader v-model="searchForm.deptId" :options="deptOptions" :props="deptProps"
						placeholder="请选择所属部门" clearable />
				</el-form-item>
				<el-form-item prop="userPhone" label="手机号码">
					<el-input v-model.trim="searchForm.userPhone" placeholder="请输入手机号码" clearable
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
						<el-button v-permission="'system_user_add'" type="success" @click="addHandle"><i-ep-plus />新增</el-button>
					</div>
				</template>

				<el-table ref="tableRef" :data="tableList" highlight-current-row border v-loading="tableLoading">
					<el-table-column label="头像" align="center" width="60">
						<template #default="{ row }">
							<image-preview :img-url="row.userAvatar" :preview-list="[row.userAvatar]" />
						</template>
					</el-table-column>
					<el-table-column label="员工姓名" prop="userName" width="120" show-overflow-tooltip />
					<el-table-column label="登录账号" prop="userAccount" min-width="100" show-overflow-tooltip />
					<el-table-column label="手机号码" prop="userPhone" width="150" />
					<el-table-column label="所属部门" min-width="200" show-overflow-tooltip>
						<template #default="{ row }">
							<span>{{formatDept(row.deptList)}}</span>
						</template>
					</el-table-column>
					<el-table-column label="角色" min-width="150" show-overflow-tooltip>
						<template #default="{ row }">
							<span>{{formatRole(row.roleList)}}</span>
						</template>
					</el-table-column>
					<el-table-column label="账号状态" prop="userStatus" width="150" align="center">
						<template #default="{ row }">
							<el-switch v-model="row.userStatus" :loading="row.statusLoading"
								:before-change="()=>switchBeforeChange(row)" />
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="createTime" width="160" show-overflow-tooltip />

					<el-table-column fixed="right" label="操作" width="220">
						<template #default="{ row }">
							<el-button type="success" link size="small"
								@click="resetPsHandle(row)"><i-ep-refresh-left />重置密码</el-button>
							<el-button type="primary" link size="small"
								@click="editHandle(row.id)"><i-ep-edit />编辑</el-button>
							<el-button v-if="!row.userStatus" type="danger" link size="small"
								@click="deleteHandle(row.id)"><i-ep-delete />删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination :total="total" v-model:page="searchForm.current" v-model:page-size="searchForm.pageSize"
					@on-change="getList" />
			</el-card>
		</div>

		<UserDialog v-model:visible="userDialogVisible" :dept-list="deptOptions" :row-id="rowId"
			:handle-type="handleType" @addUpdate="searchHandle" @editUpdate="getList">
		</UserDialog>
	</div>
</template>

<script setup lang="ts">
	defineOptions({
		name: "User",
		inheritAttrs: false,
	});

	import { getDeptListApi } from "@/api/system/department";
	import { getUserListApi, editUserStatusApi, resetUserPasswordApi, deleteUserApi } from "@/api/system/user";
	import UserDialog from "./components/UserDialog.vue";

	const searchFormRef = ref();
	const searchForm = reactive({
		userName: '',
		deptId: [],
		userPhone: '',
		current: 1,
		pageSize: 10
	})
	const deptOptions = ref([]);
	const deptProps = {
		checkStrictly: true,
		value: 'id',
		label: 'deptName',
		children: 'child'
	}
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
	const getDeptOptions = async () => {
		let res = await getDeptListApi();
		deptOptions.value = res.data;
	}
	const getList = async () => {
		try {
			tableLoading.value = true;
			let params = Object.assign({}, searchForm);
			params.deptId = params.deptId && params.deptId.length ? params.deptId[params.deptId.length - 1] : '';
			let res = await getUserListApi(params);
			tableList.value = res.data.rows;
			total.value = res.data.total;
		} catch (e) {

		} finally {
			tableLoading.value = false;
		}
	}
	const formatDept = (arr) => {
		let deptList = arr.map(i => i.deptName);
		return deptList.join('/');
	}
	const formatRole = (arr) => {
		let roleList = arr.map(i => i.roleName);
		return roleList.join('，');
	}
	const switchBeforeChange = async (row) => {
		return new Promise(async (_, reject) => {
			try{
				row.statusLoading = true;
				await editUserStatusApi(row.id, {
					status: !row.userStatus
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
	const resetPsHandle = (row) => {
		ElMessageBox.confirm(`请确认是否重置该员工【${row.userName}】的密码？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			try {
				tableLoading.value = true;
				await resetUserPasswordApi(row.id);
				ElMessage.success("操作成功");
				getList();
			} catch (e) {
			
			} finally {
				tableLoading.value = false;
			}
		}).catch(() => {
		
		})
	}
	const deleteHandle = (id) => {
		ElMessageBox.confirm('请确认是否删除该员工？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			try {
				tableLoading.value = true;
				await deleteUserApi(id);
				ElMessage.success("操作成功");
				getList();
			} catch (e) {
			
			} finally {
				tableLoading.value = false;
			}
		}).catch(() => {

		})
	}
	const userDialogVisible = ref(false);
	const handleType = ref('');
	const rowId = ref('');
	const addHandle = () => {
		rowId.value = '';
		handleType.value = 'add';
		userDialogVisible.value = true;
	}
	const editHandle = (id) => {
		rowId.value = id;
		handleType.value = 'edit';
		userDialogVisible.value = true;
	}

	onMounted(() => {
		getDeptOptions();
		getList();
	});
</script>
<style lang="scss" scoped>

</style>