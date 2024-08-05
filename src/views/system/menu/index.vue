<template>
	<div class="page-container">
		<div class="search-container">
			<el-form ref="searchFormRef" :model="searchForm" :inline="true" @submit.prevent>
				<el-form-item prop="systemId" label="所属系统">
					<el-select v-model="searchForm.systemId" placeholder="请选择所属系统" @change="getList">
						<el-option v-for="item in systemList" :key="item.id" :label="item.displayValue"
							:value="item.id" />
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
						<el-button type="success" @click="addHandle('')"><i-ep-plus />新增</el-button>
					</div>
				</template>

				<el-table ref="tableRef" :data="tableList" highlight-current-row border v-loading="tableLoading"
					row-key="id" default-expand-all :tree-props="{ children: 'child', hasChildren: 'hasChildren' }">
					<el-table-column label="权限名称" prop="resName" min-width="200" show-overflow-tooltip>
						<template #default="{ row }">
							<span>
								<svg-icon v-if="row.resType === 0" icon-class="client" class="m-r-1" />
								<el-icon
									v-if="[1, 2].includes(row.resType) && row.resIcon && row.resIcon.startsWith('el-icon')"
									class="m-r-1" style="vertical-align: text-top">
									<component :is="row.resIcon.replace('el-icon-', '')" />
								</el-icon>
								<svg-icon v-if="[1, 2].includes(row.resType) && row.resIcon && !row.resIcon.startsWith('el-icon')" :icon-class="row.resIcon"
									class="m-r-1" />
								<svg-icon v-if="[1, 2].includes(row.resType) && !row.resIcon" icon-class="menu"
									class="m-r-1" />
								<span>{{ row.resName }}</span>
							</span>
						</template>
					</el-table-column>
					<el-table-column label="权限类型" align="center" width="100">
						<template #default="{ row }">
							<el-tag v-if="row.resType === 0" type="info">根节点</el-tag>
							<el-tag v-if="row.resType === 1" type="success">目录</el-tag>
							<el-tag v-if="row.resType === 2" type="warning">菜单</el-tag>
							<el-tag v-if="row.resType === 3" type="danger">按钮</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="权限标识" min-width="140" prop="resCode" show-overflow-tooltip />
					<el-table-column label="权限URL" min-width="150" prop="resUrl" show-overflow-tooltip />
					<el-table-column label="显示状态" align="center" width="100">
						<template #default="{ row }">
							<el-tag v-if="row.resStatus" type="primary">显示</el-tag>
							<el-tag v-else type="info">隐藏</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="排序" align="center" width="80" prop="sort" />

					<el-table-column fixed="right" label="操作" width="200">
						<template #default="{ row }">
							<el-button v-if="row.resType !== 3" type="success" link size="small"
								@click="addHandle(row.id)"><i-ep-plus />新增</el-button>
							<el-button v-if="row.resType !== 0" type="primary" link size="small"
								@click="editHandle(row.id)"><i-ep-edit />编辑</el-button>
							<el-button v-if="row.resType !== 0" type="danger" link size="small"
								@click="deleteHandle(row.id)"><i-ep-delete />删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>

		<MenuDialog v-model:visible="menuDialogVisible" :system-id="searchForm.systemId" :system-list="systemList"
			:row-id="rowId" :handle-type="handleType" @update="getList">
		</MenuDialog>
	</div>
</template>

<script setup lang="ts">
	defineOptions({
		name: "Permission",
		inheritAttrs: false,
	});

	import { getSystemOptionsApi, getMenuListApi, deleteMenuApi } from "@/api/system/menu";
	import MenuDialog from "./components/MenuDialog.vue";

	const searchFormRef = ref();
	const searchForm = reactive({
		systemId: ''
	})
	const systemList = ref([]);
	const tableLoading = ref(false);
	const tableList = ref([]);
	const searchHandle = () => {
		getList();
	}
	const resetHandle = () => {
		searchFormRef.value.resetFields();
		searchForm.systemId = systemList.value[0].id;
		searchHandle();
	}
	const getSystemList = async () => {
		try {
			tableLoading.value = true;
			let res = await getSystemOptionsApi();
			systemList.value = res.data;
			searchForm.systemId = systemList.value[0].id;
		} catch (e) {
			tableLoading.value = false;
		} finally {

		}
	}
	const getList = async () => {
		try {
			tableLoading.value = true;
			let res = await getMenuListApi(searchForm.systemId, {
				isButton: true
			});
			tableList.value = res.data;
		} catch (e) {

		} finally {
			tableLoading.value = false;
		}
	}
	const menuDialogVisible = ref(false);
	const handleType = ref('');
	const rowId = ref('');
	const addHandle = (id) => {
		rowId.value = id;
		handleType.value = 'add';
		menuDialogVisible.value = true;
	}
	const editHandle = (id) => {
		rowId.value = id;
		handleType.value = 'edit';
		menuDialogVisible.value = true;
	}

	const deleteHandle = (id) => {
		ElMessageBox.confirm('请确认是否删除该权限？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			try{
				tableLoading.value = true;
				await deleteMenuApi(id);
				ElMessage.success("操作成功");
				getList();
			}catch(e){
				
			}finally{
				tableLoading.value = false;
			}
		}).catch(() => {

		})
	}

	onMounted(async () => {
		await getSystemList();
		getList();
	});
</script>
<style lang="scss" scoped>

</style>