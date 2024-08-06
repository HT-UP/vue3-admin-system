<template>
	<div id="type-dialog">
		<el-dialog :modelValue="visible" :title="handleType == 'add' ? '新增字典类型' : '编辑字典类型'" width="26%" top="15vh"
			:close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close draggable @open="openHandle"
			@close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="dialogLoading">
				<el-form-item prop="dictTypeName" label="类型名称">
					<el-input v-model.trim="formData.dictTypeName" placeholder="请输入字典类型名称" maxlength="20" show-word-limit />
				</el-form-item>
				<el-form-item prop="dictTypeCode" label="类型编码">
					<el-input v-model.trim="formData.dictTypeCode" placeholder="请输入字典类型编码" maxlength="50" show-word-limit />
				</el-form-item>
				<el-form-item prop="dictTypeDesc" label="类型描述">
					<el-input v-model.trim="formData.dictTypeDesc" maxlength="100" placeholder="请输入字典类型描述" show-word-limit
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
	import { addOrEditDictionaryTypeApi } from "@/api/system/dictionary";
	
	const props = defineProps({
		visible: {
			type: Boolean,
			default: false,
		},
		handleType: {
			type: String,
			default: '',
		},
		rowData: {
			type: Object,
			default() {
				return {}
			}
		}
	});
	const emits = defineEmits(['update:visible', 'addUpdate', 'editUpdate']);
	const dialogLoading = ref(false);
	const confirmLoading = ref(false);
	const formRef = ref();
	const formData = ref({
		dictTypeName: '',
		dictTypeCode: '',
		dictTypeDesc: ''
	})
	const formRules = reactive({
		dictTypeName: [{
			required: true,
			message: '字典类型名称不能为空',
			trigger: 'change'
		}],
		dictTypeCode: [{
			required: true,
			message: '字典类型编码不能为空',
			trigger: 'change'
		}]
	})
	const openHandle = () => {
		if (props.handleType == 'edit') {
			formData.value = Object.assign(formData.value, props.rowData);
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
					params.id = props.handleType == 'add' ? 0 : props.rowData.id;
					let res = await addOrEditDictionaryTypeApi(params);
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
	#type-dialog {}
</style>