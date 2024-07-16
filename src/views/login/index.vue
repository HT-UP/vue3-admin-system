<template>
	<div class="login-container">
		<el-card class="login-card">
			<div class="text-center">
				<h2>admin-system-front</h2>
			</div>
			<el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form" size="large">
				<el-form-item prop="username">
					<el-input v-model.trim="loginData.username" placeholder="用户名" :prefix-icon="User" name="username"
						class="h-[48px]" @keyup.enter="handleLoginSubmit" />
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model.trim="loginData.password" placeholder="密码" :prefix-icon="Lock" type="password"
						name="password" class="h-[48px]" show-password @keyup.enter="handleLoginSubmit" />
				</el-form-item>
				<el-form-item prop="captchaCode">
					<div class="input-wrapper">
						<el-input v-model.trim="loginData.captchaCode" auto-complete="off" class="h-[48px] flex-1"
							placeholder="验证码" :prefix-icon="Iphone" @keyup.enter="handleLoginSubmit" />

						<el-image :src="captchaBase64" class="captcha-image" @click="getCaptchaImg" />
					</div>
				</el-form-item>

				<!-- 登录按钮 -->
				<el-button :loading="loginLoading" type="primary" class="w-full" @click.prevent="handleLoginSubmit">登
					录</el-button>

				<div class="mt-10 text-sm text-center">
					<span>欢迎登录</span>
				</div>
			</el-form>
		</el-card>

		<!-- ICP备案 -->
		<div class="icp-info" v-show="icpVisible">
			<p>Copyright © 2021 - 2024 admin.tech All Rights Reserved.</p>
			<p>粤ICP备20006496号-3</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { FormInstance } from "element-plus";
	import { useWindowSize } from '@vueuse/core';
	import { User, Lock, Iphone } from '@element-plus/icons-vue'
	import { getCaptchaImgApi, loginApi } from "@/api/user";
	import { getPathList } from '@/utils'

	const route = useRoute();
	const router = useRouter();
	const store = useStore();
	const loginFormRef = ref<FormInstance>();
	const loginData = reactive({
		username: "admin",
		password: "123456",
		captchaKey: '',
		captchaCode: ''
	})
	const loginRules = ref({
		username: [
			{
				required: true,
				trigger: 'change',
				message: '请输入用户名',
			}
		],
		password: [
			{
				required: true,
				trigger: 'change',
				message: '请输入密码',
			}
		],
		captchaCode: [
			{
				required: true,
				trigger: 'change',
				message: '请输入验证码',
			}
		]
	});
	const captchaBase64 = ref();
	const getCaptchaImg = async () => {
		let res = await getCaptchaImgApi();
		loginData.captchaKey = res.data.captchaKey;
		captchaBase64.value = res.data.captchaBase64;
	}

	const loginLoading = ref(false);
	const handleLoginSubmit = () => {
		loginFormRef.value.validate(async (valid : boolean) => {
			if (valid) {
				try {
					loginLoading.value = true;
					const formData = new FormData();
					formData.append("username", loginData.username);
					formData.append("password", loginData.password);
					formData.append("captchaKey", loginData.captchaKey);
					formData.append("captchaCode", loginData.captchaCode);
					let res = await loginApi(formData);
					const { tokenType, accessToken } = res.data;
					localStorage.setItem("TOKEN_KEY", tokenType + " " + accessToken);
					//保存token之后获取账号信息及菜单并保存
					getSaveInfo();
				} catch (e) {
					getCaptchaImg();
					loginLoading.value = false;
				} finally {

				}
			}
		});
	};
	const getSaveInfo = async () => {
		try {
			loginLoading.value = true;
			const getUserInfo = store.dispatch('getUserInfo');
			const getMenuList = store.dispatch('getMenuList');
			//使用Promise.all等待两个操作完成
			await Promise.all([getUserInfo, getMenuList]);
			if (store.state.routerMenu.length == 0) {
				ElMessage.warning("暂无任何页面权限，请联系管理员开通！");
				localStorage.setItem("TOKEN_KEY", '');
				getCaptchaImg();
			} else {
				const { path, queryParams } = parseRedirect();
				router.push({ path: path, query: queryParams });
			}
		} catch (e) {
			getCaptchaImg();
		} finally {
			loginLoading.value = false;
		}
	}

	/** 解析 redirect 字符串 为 path 和  queryParams */
	const parseRedirect = () : {
		path : string;
		queryParams : Record<string, string>;
	} => {
		const query : LocationQuery = route.query;
		const redirect = (query.redirect as string) ?? getPathList(store.state.routerMenu)[0];

		const url = new URL(redirect, window.location.origin);
		const path = url.pathname;
		const queryParams : Record<string, string> = {};

		url.searchParams.forEach((value, key) => {
			queryParams[key] = value;
		});

		return { path, queryParams };
	}

	const icpVisible = ref(true);
	// 窗口高度
	const { height } = useWindowSize();
	/** 根据屏幕宽度切换设备模式 */
	watchEffect(() => {
		if (height.value < 600) {
			icpVisible.value = false;
		} else {
			icpVisible.value = true;
		}
	});

	onMounted(() => {
		getCaptchaImg();
	});
</script>
<style lang="scss" scoped>
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		background: url("@/assets/images/login-background-light.jpg") no-repeat center right;
		position: relative;

		.login-card {
			width: 400px;
			background: transparent;
			border: none;
			border-radius: 4%;

			@media (width <=640px) {
				width: 340px;
			}

			.input-wrapper {
				display: flex;
				align-items: center;
				width: 100%;
			}

			.captcha-image {
				height: 48px;
				cursor: pointer;
				border-top-right-radius: 6px;
				border-bottom-right-radius: 6px;
			}
		}

		.icp-info {
			position: absolute;
			bottom: 10px;
			font-size: 12px;
			text-align: center;
		}

		.el-form-item {
			background: var(--el-input-bg-color);
			border: 1px solid var(--el-border-color);
			border-radius: 5px;
		}

		:deep(.el-input) {
			.el-input__wrapper {
				background-color: transparent;
				box-shadow: none;

				&.is-focus,
				&:hover {
					box-shadow: none !important;
				}

				input:-webkit-autofill {
					/* 通过延时渲染背景色变相去除背景颜色 */
					transition: background-color 1000s ease-in-out 0s;
				}
			}
		}
	}
</style>