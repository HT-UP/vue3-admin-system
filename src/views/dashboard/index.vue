<template>
	<div class="page-container">
		<div class="search-container">
			<el-form ref="searchFormRef" :model="searchForm" :inline="true">
				<el-form-item prop="keywords" label="关键字">
					<el-input v-model.trim="searchForm.keywords" placeholder="请输入日志内容" clearable
						@keyup.enter="searchHandle" />
				</el-form-item>
				<el-form-item prop="status" label="日志状态">
					<el-select v-model="searchForm.status" placeholder="请选择日志状态" clearable>
						<el-option v-for="item in statusList" :key="item.value" :label="item.label"
							:value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item prop="createDate" label="创建时间">
					<el-date-picker v-model="searchForm.createDate" type="daterange" range-separator="~"
						start-placeholder="开始时间" end-placeholder="截止时间" value-format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item v-if="isExpand" prop="updateDate" label="更新时间">
					<el-date-picker v-model="searchForm.updateDate" type="daterange" range-separator="~"
						start-placeholder="开始时间" end-placeholder="截止时间" value-format="YYYY-MM-DD" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="searchHandle"><i-ep-search />查询</el-button>
					<el-button @click="resetHandle"><i-ep-refresh />重置</el-button>

					<el-button v-if="!isExpand" type="primary" link
						@click="isExpand = !isExpand">展开<i-ep-arrow-down /></el-button>
					<el-button v-else type="primary" link @click="isExpand = !isExpand">收起<i-ep-arrow-up /></el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-container">
			<el-card shadow="never">
				<template #header>
					<div class="card-header">
						<el-button type="success" @click="addHandle"><i-ep-plus />新增</el-button>
						<el-button type="warning"><i-ep-upload />导入</el-button>
						<el-button type="info"><i-ep-download />导出</el-button>
					</div>
				</template>

				<el-table ref="tableRef" :data="tableList" highlight-current-row border v-loading="tableLoading">
					<el-table-column label="图片" align="center" width="60">
						<template #default="{ row }">
							<image-preview :img-url="row.images[0]" :preview-list="row.images" />
						</template>
					</el-table-column>
					<el-table-column label="操作人" prop="operator" width="120" />
					<el-table-column label="日志模块" prop="module" width="100" />
					<el-table-column label="日志内容" prop="content" min-width="200" />
					<el-table-column label="IP 地址" prop="ip" width="150" />
					<el-table-column label="地区" prop="region" width="150" />
					<el-table-column label="浏览器" prop="browser" width="150" show-overflow-tooltip />
					<el-table-column label="终端系统" prop="os" width="200" show-overflow-tooltip />
					<el-table-column label="执行时间(ms)" prop="executionTime" width="150" />
					<el-table-column label="操作时间" prop="createTime" width="160" />
					<el-table-column fixed="right" label="操作" width="160">
						<template #default="{ row }">
							<el-button type="primary" link size="small"><i-ep-edit />编辑</el-button>
							<el-button type="danger" link size="small"><i-ep-delete />删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination :total="total" v-model:page="searchForm.page" v-model:page-size="searchForm.pageSize"
					@on-change="getList" />
			</el-card>
		</div>
		
		<MenuDialog v-model:visible="menuDialogVisible" :row-data="rowData" :handle-type="handleType"></MenuDialog>
	</div>
</template>

<script setup lang="ts">
	defineOptions({
		name: "Dashboard",
		inheritAttrs: false,
	});
	
	// import { getLogListApi } from "@/api/user";
	import MenuDialog from "./components/MenuDialog.vue";

	const isExpand = ref(false);
	const searchFormRef = ref();
	const searchForm = reactive({
		keywords: '',
		status: '',
		createDate: [],
		updateDate: [],
		page: 1,
		pageSize: 10
	})
	const tableLoading = ref(false);
	const tableList = ref([]);
	const total = ref(0);
	const statusList = ref([
		{ value: 1, label: '启用' },
		{ value: 0, label: '停用' }
	]);
	const searchHandle = () => {
		searchForm.page = 1;
		getList();
	}
	const resetHandle = () => {
		searchFormRef.value.resetFields();
		searchForm.updateDate = [];
		searchHandle();
	}
	const getList = async () => {
		try {
			tableLoading.value = true;
			let res = await getLogListApi({
				pageNum: searchForm.page,
				...searchForm
			})
			tableList.value = res.data.list;
			total.value = res.data.total;

			tableList.value.forEach(item => {
				item.images = [ 'https://oss.youlai.tech/youlai-boot/2023/05/16/811270ef31f548af9cffc026dfc3777b.gif?imageView2/1/w/80/h/80', 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',]
			})
		} catch (e) {

		} finally {
			tableLoading.value = false;
		}
	}
	const menuDialogVisible = ref(false);
	const handleType = ref('');
	const rowData = ref({});
	const addHandle = () => {
		rowData.value = {};
		handleType.value = 'add';
		menuDialogVisible.value = true;
	}

	onMounted(() => {
		getList();
	});
</script>