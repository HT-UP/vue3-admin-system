<template>
	<div id="dictionary-dialog">
		<el-dialog :modelValue="visible" :title="handleType == 'add' ? `【${typeName}】新增字典数据` : `【${typeName}】编辑字典数据`"
			width="26%" top="15vh" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close
			draggable @open="openHandle" @close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="dialogLoading">
				<el-form-item prop="displayValue" label="字典项名称">
					<el-input v-model.trim="formData.displayValue" placeholder="请输入字典项名称" maxlength="20"
						show-word-limit />
				</el-form-item>
				<el-form-item prop="storageValue" label="字典项编码">
					<el-input v-model.trim="formData.storageValue" placeholder="请输入字典项编码" maxlength="50"
						show-word-limit />
				</el-form-item>
				<el-form-item prop="dictDataDesc" label="字典项描述">
					<el-input v-model.trim="formData.dictDataDesc" maxlength="100" placeholder="请输入字典项描述"
						show-word-limit type="textarea" :rows="4" />
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
	import { addOrEditDictionaryDataApi } from "@/api/system/dictionary";
	const props = defineProps({
		visible: {
			type: Boolean,
			default: false,
		},
		handleType: {
			type: String,
			default: '',
		},
		currentData: {
			type: Object,
			default() {
				return {}
			}
		},
		typeId: {
			type: Number,
			default: 0,
		},
		typeName: {
			type: String,
			default: '',
		}
	});
	const emits = defineEmits(['update:visible', 'addUpdate', 'editUpdate']);
	const dialogLoading = ref(false);
	const confirmLoading = ref(false);
	const formRef = ref();
	const formData = ref({
		displayValue: '',
		storageValue: '',
		dictDataDesc: ''
	})
	const formRules = reactive({
		displayValue: [{
			required: true,
			message: '字典项名称不能为空',
			trigger: 'change'
		}],
		storageValue: [{
			required: true,
			message: '字典项编码不能为空',
			trigger: 'change'
		}]
	})
	const openHandle = () => {
		if (props.handleType == 'edit') {
			formData.value = Object.assign(formData.value, props.currentData);
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
					params.id = props.handleType == 'add' ? 0 : props.currentData.id;
					params.dictTypeId = props.typeId;
					let res = await addOrEditDictionaryDataApi(params);
					ElMessage.success("操作成功");
					formRef.value.resetFields();
					emits("update:visible", false);
					if (props.handleType == 'add') {
						emits("addUpdate");
					} else {
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
	#dictionary-dialog {}
</style>