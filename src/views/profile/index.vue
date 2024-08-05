<template>
	<div class="page-container" :style="{ height: minHeight }">
		<div class="wh-full white-bg">
			<el-card class="box-card">
				<template v-slot:header>
					<div class="clearfix">
						<span>个人信息</span>
					</div>
				</template>
				<div>
					<div class="text-center">
						<div class="user-info-head" @click="editCropper">
							<img :src="$store.state.userInfo.userAvatar" class="img-circle img-lg" />
						</div>
					</div>
					<ul class="list-group list-group-striped">
						<li class="list-group-item flex-center">
							<el-button :icon="Edit" type="warning" @click="editHandle">修改密码</el-button>
						</li>
						<li class="list-group-item flex-x-between">
							<div class="pull-left">
								<i-ep-user />
								<span class="ml-1">登录账号</span>
							</div>
							<div class="pull-right">{{ $store.state.userInfo.userAccount }}</div>
						</li>
						<li class="list-group-item flex-x-between">
							<div class="pull-left">
								<i-ep-Iphone />
								<span class="ml-1">手机号码</span>
							</div>
							<div class="pull-right">{{ $store.state.userInfo.userPhone }}</div>
						</li>
						<li class="list-group-item flex-x-between">
							<div class="pull-left">
								<svg-icon icon-class="tree" />
								<span class="ml-1">所属部门</span>
							</div>
							<div class="pull-right">
								{{ formatDept($store.state.userInfo.deptList) }}</div>
						</li>
						<li class="list-group-item flex-x-between">
							<div class="pull-left">
								<svg-icon icon-class="role" />
								<span class="ml-1">所属角色</span>
							</div>
							<div class="pull-right">{{ formatRole($store.state.userInfo.roleList) }}</div>
						</li>
					</ul>
				</div>
			</el-card>
		</div>

		<AvatarDialog v-model:open="avatarDialogVisible"></AvatarDialog>
		<PasswordDialog v-model:visible="passwordDialogVisible"></PasswordDialog>
	</div>
</template>

<script lang="ts" setup>
	defineOptions({
		name: "Profile",
		inheritAttrs: false,
	});
	import { Edit } from '@element-plus/icons-vue'
	import variables from "@/styles/variables.module.scss";
	import AvatarDialog from "./components/AvatarDialog.vue";
	import PasswordDialog from "./components/PasswordDialog.vue";

	const store = useStore();

	const minHeight = computed(() => {
		if (store.state.tagsView) {
			return `calc(100vh - ${variables["navbar-height"]} - ${variables["tags-view-height"]})`;
		} else {
			return `calc(100vh - ${variables["navbar-height"]})`;
		}
	});
	const formatDept = (arr) => {
		let deptList = arr.map(i => i.deptName);
		return deptList.join('/');
	}
	const formatRole = (arr) => {
		let roleList = arr.map(i => i.roleName);
		return roleList.join('，');
	}
	const avatarDialogVisible = ref(false);
	const passwordDialogVisible = ref(false);
	const editCropper = () => {
		avatarDialogVisible.value = true;
	}
	const editHandle = () => {
		passwordDialogVisible.value = true;
	}
</script>

<style lang="scss" scoped>
	.page-container {
		.white-bg {
			background-color: var(--el-bg-color-overlay);
			padding-top: 50px;
			min-height: 500px;

			.el-card {
				min-width: 300px;
				width: 24%;
				margin: 0 auto;

				.list-group {
					margin: 20px 0;

					.list-group-item {
						border-bottom: 1px solid #e7eaec;
						border-top: 1px solid #e7eaec;
						margin-bottom: -1px;
						padding: 11px 0;
						font-size: 13px;
						
						.pull-right {
							max-width: 160px;
						}
					}
				}
			}
		}

		.user-info-head {
			position: relative;
			display: inline-block;

			.img-circle {
				width: 120px;
				height: 120px;
				border-radius: 100%;
				object-fit: contain;
			}
		}

		.user-info-head:hover:after {
			content: "+";
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 6px;
			color: #eee;
			background: rgba(0, 0, 0, 0.5);
			font-size: 24px;
			font-style: normal;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			cursor: pointer;
			line-height: 120px;
			border-radius: 100%;
		}
	}
</style>