<template>
	<div id="password-dialog">
		<el-dialog :modelValue="visible" title="修改密码" width="26%" top="15vh" :close-on-click-modal="false"
			:close-on-press-escape="false" destroy-on-close draggable @open="openHandle" @close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="dialogLoading">
				<el-form-item prop="oldPasswd" label="旧密码">
					<el-input v-model.trim="formData.oldPasswd" placeholder="请输入旧密码" type="password" name="password"
						show-password autocomplete="off" />
				</el-form-item>
				<el-form-item prop="passwd" label="新密码">
					<el-input v-model.trim="formData.passwd" placeholder="请输入新密码" type="password" name="password"
						show-password autocomplete="off" />
				</el-form-item>
				<el-form-item prop="confirmPassword" label="确认密码">
					<el-input v-model.trim="formData.confirmPassword" placeholder="请再一次确认密码" type="password"
						name="password" show-password autocomplete="off" />
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
	const props = defineProps({
		visible: {
			type: Boolean,
			default: false,
		}
	});
	import { Md5 } from "ts-md5";
	import { editPasswordApi } from "@/api/user";
	
	const emits = defineEmits(['update:visible']);

	const dialogLoading = ref(false);
	const confirmLoading = ref(false);
	const formRef = ref();
	const formData = ref({
		oldPasswd: '',
		passwd: '',
		confirmPassword: ''
	})
	const formRules = reactive({
		oldPasswd: [{
			required: true,
			message: '旧密码不能为空',
			trigger: 'change'
		}],
		passwd: [{
			required: true,
			validator: (rules, value, callback) => {
				if (!value) {
					return callback(new Error('新密码不能为空'));
				} else if (value && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(value)) {
					return callback(new Error('密码限制为6到16位且必须包含英文字母和数字'));
				}
				return callback();
			},
			trigger: 'change'
		}],
		confirmPassword: [{
			required: true,
			validator: (rules, value, callback) => {
				if (!value) {
					return callback(new Error('确认密码不能为空'));
				} else if (formData.value.passwd !== value) {
					return callback(new Error('两次输入的密码不一致'));
				}
				return callback();
			},
			trigger: 'change'
		}]
	})
	const openHandle = () => {

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
					let params = {
						oldPasswd: Md5.hashStr(formData.value.oldPasswd),
						passwd: Md5.hashStr(formData.value.passwd)
					}
					let res = await editPasswordApi(params);
					ElMessage.success("修改成功");
					formRef.value.resetFields();
					emits("update:visible", false);
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
	#password-dialog {}
</style>