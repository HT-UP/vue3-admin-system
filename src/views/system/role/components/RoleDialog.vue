<template>
	<div id="role-dialog">
		<el-dialog :modelValue="visible" :title="handleType == 'add' ? '新增角色' : handleType == 'edit' ? '编辑角色' : '角色授权'"
			width="40%" top="8vh" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close
			draggable @open="openHandle" @close="cancelHandle">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="dialogLoading">
				<el-row :gutter="10">
					<el-col :lg="12">
						<el-form-item prop="roleName" label="角色名称">
							<el-input v-model.trim="formData.roleName" placeholder="请输入角色名称" maxlength="20"
								show-word-limit :disabled="handleType == 'share'" />
						</el-form-item>
					</el-col>
					<el-col :lg="12">
						<el-form-item label="角色类型" prop="roleType">
							<el-select v-model="formData.roleType" placeholder="请选择角色类型"
								:disabled="handleType == 'share'" @change="typeChange">
								<el-option v-for="item in roleList" :key="item.id" :label="item.name"
									:value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :lg="12">
						<el-form-item label="所属系统" prop="dictDataId">
							<el-select v-model="formData.dictDataId" placeholder="请选择所属系统"
								:disabled="handleType == 'share'" @change="systemChange">
								<el-option v-for="item in systemList" :key="item.id" :label="item.displayValue"
									:value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :lg="12">
						<el-form-item prop="roleStatus" label="角色状态">
							<el-radio-group v-model="formData.roleStatus" :disabled="handleType == 'share'">
								<el-radio :value="true">启用</el-radio>
								<el-radio :value="false">停用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>

					<el-col v-if="formData.dictDataId" :span="24" v-loading="menuLoading">
						<el-divider>
							<i-ep-menu />
						</el-divider>
						<el-form-item label="菜单权限">
							<el-checkbox v-model="menuExpand"
								@change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
							<el-checkbox v-model="menuNodeAll"
								@change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
						</el-form-item>
						<el-form-item label="">
							<el-scrollbar height="400px">
								<div class="tree-box">
									<el-tree class="tree-border" :data="menuList" show-checkbox ref="menuRef"
										node-key="id" empty-text="暂无任何菜单" default-expand-all
										:props="{ label: 'resName', children: 'child' }"></el-tree>
								</div>
							</el-scrollbar>
						</el-form-item>
					</el-col>
				</el-row>
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
	import { getMenuOptionsApi } from "@/api/system/menu";
	import { addOrEditRoleApi, getRoleDetailApi } from "@/api/system/role";

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
		systemList: {
			type: Array,
			default() {
				return []
			}
		}
	});
	const emits = defineEmits(['update:visible', 'addUpdate', 'editUpdate']);
	const dialogLoading = ref(false);
	const menuLoading = ref(false);
	const confirmLoading = ref(false);
	const formRef = ref();
	const menuRef = ref(null);
	const roleList = ref([
		{ id: 0, name: '系统角色' },
		{ id: 1, name: '用户角色' }
	]);
	const formData = ref({
		roleName: '',
		roleType: '',
		dictDataId: '',
		roleStatus: true
	})
	const formRules = reactive({
		roleName: [{
			required: true,
			message: '角色名称不能为空',
			trigger: 'change'
		}],
		roleType: [{
			required: true,
			message: '请选择角色类型',
			trigger: 'change'
		}],
		dictDataId: [{
			required: true,
			message: '请选择所属系统',
			trigger: 'change'
		}]
	})
	const typeChange = () => {
		if (formData.value.roleType === 0 && menuList.value.length > 0) {
			menuNodeAll.value = true;
			nextTick(() => {
				handleCheckedTreeNodeAll(true);
			})
		} else if (formData.value.roleType === 1 && menuList.value.length > 0) {
			menuNodeAll.value = false;
			nextTick(() => {
				handleCheckedTreeNodeAll(false);
			})
		}
	}
	const systemChange = async () => {
		getMenuList();
	}
	const menuList = ref([]);
	const getMenuList = async () => {
		try {
			menuList.value = [];
			menuLoading.value = true;
			let res = await getMenuOptionsApi(formData.value.dictDataId, {
				isButton: true
			});
			menuList.value = res.data;
			if (formData.value.roleType === 0 && menuList.value.length > 0) {
				menuNodeAll.value = true;
				nextTick(() => {
					handleCheckedTreeNodeAll(true);
				})
			} else if (formData.value.roleType === 1 && menuList.value.length > 0) {
				menuNodeAll.value = false;
				nextTick(() => {
					handleCheckedTreeNodeAll(false);
				})
			}
		} catch (e) {

		} finally {
			menuLoading.value = false;
		}
	}
	const getDetail = async () => {
		try {
			dialogLoading.value = true;
			let res = await getRoleDetailApi(props.rowId);
			formData.value = Object.assign(formData.value, res.data);
			await getMenuList();
			menuNodeAll.value = false;
			nextTick(() => {
				formData.value.roleResourceIds.forEach((v) => {
					nextTick(() => {
						menuRef.value.setChecked(v, true, false);
					});
				});
			})
		} catch (e) {

		} finally {
			dialogLoading.value = false;
		}
	}
	const openHandle = async () => {
		if (props.handleType !== 'add') {
			getDetail();
		}
	}
	const cancelHandle = () => {
		menuList.value = [];
		formRef.value.resetFields();
		menuExpand.value = true;
		menuNodeAll.value = false;
		emits('update:visible', false);
	}
	const menuExpand = ref(true);
	const menuNodeAll = ref(false);
	/** 树权限（展开/折叠）*/
	const handleCheckedTreeExpand = (value) => {
		let treeList = menuList.value;
		for (let i = 0; i < treeList.length; i++) {
			menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
		}
	}
	/** 树权限（全选/全不选） */
	const handleCheckedTreeNodeAll = (value) => {
		menuRef.value.setCheckedNodes(value ? menuList.value : []);
	}
	/** 所有菜单节点数据 */
	const getMenuAllCheckedKeys = () => {
		// 目前被选中的菜单节点
		let checkedKeys = menuRef.value.getCheckedKeys();
		// 半选中的菜单节点
		let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
		checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
		return checkedKeys;
	}
	const comfirmHandle = () => {
		formRef.value.validate(async (valid) => {
			if (valid) {
				try {
					confirmLoading.value = true;
					let params = Object.assign({}, formData.value);
					params.id = props.handleType == 'add' ? 0 : props.rowId;
					params.roleResourceIds = getMenuAllCheckedKeys();
					let res = await addOrEditRoleApi(params);
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
	#role-dialog {
		.el-form {
			:deep(.el-form-item) {
				.el-form-item__content {
					width: 100%;
					margin-left: 0px !important;

					.el-scrollbar {
						width: 100%;
						border: 1px solid var(--el-border-color-light);
						border-radius: 4px;
					}
				}
			}
		}
	}
</style>