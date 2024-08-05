<template>
	<div id="department-dialog">
		<el-dialog :modelValue="visible" :title="handleType == 'add' ? '新增部门' : '编辑部门'" width="26%" top="15vh"
			:close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close draggable @open="openHandle"
			@close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="dialogLoading">
				<el-form-item prop="higherDeptId" label="上级部门">
					<el-cascader v-model="formData.higherDeptId" :options="deptList" :props="deptProps"
						placeholder="请选择上级部门" style="width: 100%;" />
				</el-form-item>
				<el-form-item prop="deptName" label="部门名称">
					<el-input v-model.trim="formData.deptName" placeholder="请输入部门名称" maxlength="15" show-word-limit />
				</el-form-item>
				<el-form-item prop="deptDesc" label="部门描述">
					<el-input v-model.trim="formData.deptDesc" maxlength="100" placeholder="请输入部门描述" show-word-limit
						type="textarea" :rows="4" />
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelHandle">取 消</el-button>
					<el-button type="primary" :loading="confirmLoading" @click="comfirmHandle">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
	import { getDeptListApi, getDeptDetailApi, addOrEditDeptApi } from "@/api/system/department";
	import { findParentList } from "@/utils";

	const props = defineProps({
		visible: {
			type: Boolean,
			default: false,
		},
		handleType: {
			type: String,
			default: '',
		},
		rowId: {
			type: [Number, String],
			default: ''
		}
	});
	const emits = defineEmits(['update:visible', 'update']);

	const dialogLoading = ref(false);
	const confirmLoading = ref(false);
	const formRef = ref();
	const formData = ref({
		higherDeptId: [],
		deptName: '',
		deptDesc: ''
	})
	const deptList = ref([]);
	const deptProps = {
		checkStrictly: true,
		value: 'id',
		label: 'deptName',
		children: 'child'
	}
	const formRules = reactive({
		higherDeptId: [{
			required: true,
			message: '请选择上级部门',
			trigger: 'change'
		}],
		deptName: [{
			required: true,
			message: '部门名称不能为空',
			trigger: 'change'
		}]
	})
	const getDeptList = async () => {
		let res = await getDeptListApi();
		deptList.value = res.data;
	}
	const getDetail = async () => {
		try {
			dialogLoading.value = true;
			let res = await getDeptDetailApi(props.rowId);
			formData.value = Object.assign(formData.value, res.data);
			formData.value.higherDeptId = findParentList(formData.value.higherDeptId, deptList.value);
		} catch (e) {

		} finally {
			dialogLoading.value = false;
		}
	}
	const openHandle = async () => {
		await getDeptList();
		if (props.handleType == 'add') {
			if (props.rowId) {
				formData.value.higherDeptId = findParentList(props.rowId, deptList.value);
			} else {
				formData.value.higherDeptId = [];
			}
		} else {
			getDetail();
		}
	}
	const cancelHandle = () => {
		formRef.value.resetFields();
		emits('update:visible', false);
	}
	const comfirmHandle = () => {
		formRef.value.validate(async (valid) => {
			if (valid) {
				try {
					confirmLoading.value = true;
					let params = Object.assign({}, formData.value);
					params.id = props.handleType == 'add' ? 0 : props.rowId;
					params.higherDeptId = formData.value.higherDeptId[formData.value.higherDeptId.length - 1];
					let res = await addOrEditDeptApi(params);
					ElMessage.success("操作成功");
					formRef.value.resetFields();
					emits("update:visible", false);
					emits("update");
				} catch (e) {

				} finally {
					confirmLoading.value = false;
				}
			} else {
				console.log('error submit!');
			}
		})
	}
</script>

<style lang="scss" scoped>
	#department-dialog {}
</style>