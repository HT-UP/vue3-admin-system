<template>
	<div id="menu-dialog">
		<el-dialog :modelValue="visible" :title="handleType == 'add' ? '新增菜单' : '编辑菜单'" width="780" top="15vh" :close-on-click-modal="false"
			:close-on-press-escape="false" destroy-on-close draggable @open="openHandle" @close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-form-item prop="icon" label="图标">
					<!-- 图标选择器 -->
					<icon-select v-model="formData.icon" />
				</el-form-item>
			</el-form>
			
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelHandle">取 消</el-button>
					<el-button type="primary" @click="comfirmHandle">确 定</el-button>
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
		},
		handleType: {
			type: String,
			default: '',
		},
		rowData: {
			type: Object,
			default() {
				return {};
			},
		},
	});
	const emits = defineEmits(['update:visible']);
	
	const formRef = ref();
	const formData = reactive({
		icon: ''
	})
	const formRules = reactive({
		icon: [{
			required: true,
			message: '请选择图标',
			trigger: 'change'
		}]
	})
	
	const openHandle = () => {
		
	}
	const cancelHandle = () => {
		emits('update:visible', false);
	}
	const comfirmHandle = () => {
		
	}
</script>

<style lang="scss" scoped>
	#menu-dialog {}
</style>