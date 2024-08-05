<template>
	<div id="user-dialog">
		<el-dialog :modelValue="visible" :title="handleType == 'add' ? '新增员工' : '编辑员工'" width="26%" top="15vh"
			:close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close draggable @open="openHandle"
			@close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="dialogLoading">
				<el-form-item prop="userName" label="员工姓名">
					<el-input v-model.trim="formData.userName" placeholder="请输入员工姓名" maxlength="20" show-word-limit />
				</el-form-item>
				<el-form-item prop="userAccount" label="登录账号">
					<el-input v-model.trim="formData.userAccount" placeholder="请输入登录账号" maxlength="20" show-word-limit />
				</el-form-item>
				<el-form-item prop="userPhone" label="手机号码">
					<el-input v-model.trim="formData.userPhone" placeholder="请输入手机号码" maxlength="11"
						show-word-limit />
				</el-form-item>
				<el-form-item prop="deptId" label="所属部门">
					<el-cascader v-model="formData.deptId" :options="deptList" :props="deptProps" placeholder="请选择所属部门"
						style="width: 100%;" />
				</el-form-item>
				<el-form-item label="角色" prop="roleList">
					<el-select v-model="formData.roleList" multiple placeholder="请选择角色">
						<el-option v-for="item in roleOptions" :key="item.id" :label="item.roleName"
							:value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item prop="userStatus" label="账号状态">
					<el-radio-group v-model="formData.userStatus">
						<el-radio :value="true">启用</el-radio>
						<el-radio :value="false">停用</el-radio>
					</el-radio-group>
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
	import { getRoleOptionsApi } from "@/api/system/role";
	import { getUserDetailApi, addOrEditUserApi } from "@/api/system/user";
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
		},
		deptList: {
			type: Array,
			default() {
				return []
			}
		}
	});
	const emits = defineEmits(['update:visible', 'addUpdate', 'editUpdate']);
	const dialogLoading = ref(false);
	const confirmLoading = ref(false);
	const formRef = ref();
	const roleOptions = ref([]);
	const formData = ref({
		userName: '',
		userAccount: '',
		userPhone: '',
		deptId: [],
		roleList: [],
		userStatus: true
	})
	const deptProps = {
		checkStrictly: true,
		value: 'id',
		label: 'deptName',
		children: 'child'
	}
	const formRules = reactive({
		userName: [{
			required: true,
			message: '员工姓名不能为空',
			trigger: 'change'
		}],
		userAccount: [{
			required: true,
			message: '登录账号不能为空',
			trigger: 'change'
		}],
		userPhone: [{
			required: true,
			validator: (rules, value, callback) => {
				if (!value) {
					return callback(new Error('手机号码不能为空'));
				} else if (value && !/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
					return callback(new Error('请输入正确的手机号码'));
				}
				return callback();
			},
			trigger: 'change'
		}],
		deptId: [{
			required: true,
			message: '请选择所属部门',
			trigger: 'change'
		}],
		roleList: [{
			required: true,
			message: '请选择角色',
			trigger: 'change'
		}]
	})
	const getRoleOptions = async () => {
		let res = await getRoleOptionsApi();
		roleOptions.value = res.data;
	}
	const getDetail = async () => {
		try {
			dialogLoading.value = true;
			let res = await getUserDetailApi(props.rowId);
			formData.value = Object.assign(formData.value, res.data);
			formData.value.deptId = findParentList(formData.value.deptId, props.deptList);
			formData.value.roleList = formData.value.roleList.map(i => i.id);
		} catch (e) {
	
		} finally {
			dialogLoading.value = false;
		}
	}
	const openHandle = async () => {
		await getRoleOptions();
		if (props.handleType == 'edit') {
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
					params.deptId = formData.value.deptId[formData.value.deptId.length - 1];
					let res = await addOrEditUserApi(params);
					ElMessage.success("操作成功");
					formRef.value.resetFields();
					emits("update:visible", false);
					if (props.handleType == 'add') {
						emits("addUpdate");
					} else{
						emits("editUpdate");
					}
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
	#user-dialog {}
</style>