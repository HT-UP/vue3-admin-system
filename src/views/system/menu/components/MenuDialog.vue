<template>
	<div id="menu-dialog">
		<el-dialog :modelValue="visible" :title="handleType == 'add' ? '新增菜单' : '编辑菜单'" width="26%" top="15vh"
			:close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close draggable @open="openHandle"
			@close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="dialogLoading">
				<el-form-item prop="systemId" label="所属系统">
					<el-select v-model="formData.systemId" placeholder="请选择所属系统" disabled>
						<el-option v-for="item in systemList" :key="item.id" :label="item.displayValue"
							:value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item prop="higherResId" label="上级菜单">
					<el-cascader v-model="formData.higherResId" :options="menuOptions" :props="menuProps"
						placeholder="请选择上级菜单" style="width: 100%;" />
				</el-form-item>
				<el-form-item prop="resName" label="权限名称">
					<el-input v-model.trim="formData.resName" placeholder="请输入权限名称" maxlength="15" show-word-limit />
				</el-form-item>
				<el-form-item label="权限类型" prop="resType">
					<el-radio-group v-model="formData.resType">
						<el-radio :value="1">目录</el-radio>
						<el-radio :value="2">菜单</el-radio>
						<el-radio :value="3">按钮</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="formData.resType === 3" prop="resCode" label="权限标识">
					<el-input v-model.trim="formData.resCode" placeholder="请输入权限标识" maxlength="50" show-word-limit />
				</el-form-item>
				<el-form-item v-if="formData.resType !== 3" prop="resUrl" label="权限URL">
					<el-input v-model.trim="formData.resUrl" placeholder="请输入权限URL" maxlength="100" show-word-limit />
				</el-form-item>
				<el-form-item v-if="formData.resType !== 3" prop="resIcon" label="权限图标">
					<!-- 图标选择器 -->
					<icon-select v-model="formData.resIcon" />
				</el-form-item>
				<el-form-item prop="sort" label="显示排序">
					<el-input-number v-model="formData.sort" :step="1" :min="0" :max="10000" step-strictly
						controls-position="right" style="width: 100%;" />
				</el-form-item>
				<el-form-item v-if="formData.resType !== 3" prop="resStatus" label="显示状态">
					<el-radio-group v-model="formData.resStatus">
						<el-radio :value="true">显示</el-radio>
						<el-radio :value="false">隐藏</el-radio>
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
	import { getMenuOptionsApi, addOrEditMenuApi, getMenuDetailApi } from "@/api/system/menu";
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
		systemId: {
			type: [Number, String],
			default: ''
		},
		systemList: {
			type: Array,
			default() {
				return []
			}
		}
	});
	const emits = defineEmits(['update:visible', 'update']);

	const dialogLoading = ref(false);
	const confirmLoading = ref(false);
	const formRef = ref();
	const formData = ref({
		systemId: '',
		higherResId: [],
		resName: '',
		resType: 1,
		resCode: '',
		resUrl: '',
		resIcon: '',
		sort: 0,
		resStatus: true
	})
	const menuProps = {
		checkStrictly: true,
		value: 'id',
		label: 'resName',
		children: 'child'
	}
	const menuOptions = ref([]);
	const formRules = reactive({
		higherResId: [{
			required: true,
			message: '请选择上级菜单',
			trigger: 'change'
		}],
		resName: [{
			required: true,
			message: '权限名称不能为空',
			trigger: 'change'
		}],
		resType: [{
			required: true,
			message: '请选择权限类型',
			trigger: 'change'
		}],
		resCode: [{
			required: true,
			message: '权限标识不能为空',
			trigger: 'change'
		}],
		resUrl: [{
			required: true,
			message: '权限URL不能为空',
			trigger: 'change'
		}],
		sort: [{
			required: true,
			message: '显示排序不能为空',
			trigger: 'change'
		}]
	})
	const getMenuOptions = async () => {
		let res = await getMenuOptionsApi(formData.value.systemId, {
			isButton: false
		});
		menuOptions.value = res.data;
	}
	const getDetail = async () => {
		try {
			dialogLoading.value = true;
			let res = await getMenuDetailApi(props.rowId);
			formData.value = Object.assign(formData.value, res.data);
			formData.value.higherResId = findParentList(formData.value.higherResId, menuOptions.value);
		} catch (e) {

		} finally {
			dialogLoading.value = false;
		}
	}
	const openHandle = async () => {
		formData.value.systemId = props.systemId;
		formData.value.resCode = '';
		await getMenuOptions();
		if (props.handleType == 'add') {
			if (props.rowId) {
				formData.value.higherResId = findParentList(props.rowId, menuOptions.value);
			} else {
				formData.value.higherResId = [];
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
					params.higherResId = formData.value.higherResId[formData.value.higherResId.length - 1];
					params.resCode = formData.value.resType == 3 ? formData.value.resCode : '';
					let res = await addOrEditMenuApi(params);
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
	#menu-dialog {}
</style>