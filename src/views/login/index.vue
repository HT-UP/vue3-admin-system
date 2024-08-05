<template>
	<div class="login-container">
		<el-card class="login-card">
			<div class="text-center">
				<h2>运营管理系统</h2>
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
				<el-form-item prop="captchaStatus">
					<el-popover v-if="!loginData.captchaStatus" :visible="visible" placement="top" :width="popoverWidth"
						trigger="click">
						<template #reference>
							<el-input placeholder="点击去安全验证" type="text" readonly class="h-[48px] captcha-box"
								@click="verifyHandle" />
						</template>

						<div id="captcha-box"></div>
					</el-popover>

					<div v-else
						class="w-full h-[48px] success-box text-center line-height-48px color-#52ccba fw-bold bg-#d2f4ef">
						<i-ep-check class="m-r-1" />
						<span>验证成功</span>
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
			<p>Copyright © 2024 深圳乾元小通科技有限公司. All rights reserved.</p>
			<p class="number" @click="jumpHandle">粤ICP备2024289785号-1</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { FormInstance } from "element-plus";
	import { useWindowSize } from '@vueuse/core';
	import { User, Lock } from '@element-plus/icons-vue'
	import { loginApi } from "@/api/user";
	import { getPathList } from '@/utils'
	import "@/captcha/tac.css";
	import "@/captcha/jquery-3.7.1.min.js";
	import "@/captcha/tac.min.js";
	import { Md5 } from "ts-md5";

	const route = useRoute();
	const router = useRouter();
	const store = useStore();
	const loginFormRef = ref<FormInstance>();
	const loginData = reactive({
		username: "",
		password: "",
		captchaStatus: ''
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
		captchaStatus: [
			{
				required: true,
				trigger: 'change',
				message: '请先完成安全验证',
			}
		]
	});
	const visible = ref(false);
	const verifyIng = ref(false);
	const popoverWidth = ref(400);
	const verifyHandle = () => {
		if (!verifyIng.value) {
			visible.value = true;
			nextTick(() => {
				verifyIng.value = true;
				getCaptchaImg();
			})
		}
	}
	const pre_zxc = import.meta.env.MODE == 'development' ? '/api/zxc' : import.meta.env.VITE_APP_API_URL;
	const getCaptchaImg = async () => {
		const config = {
			// 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
			requestCaptchaDataUrl: `${pre_zxc}/api/AAA/sys/captcha?type=SLIDER`,
			// 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
			validCaptchaUrl: `${pre_zxc}/api/AAA/sys/check`,
			// 验证码绑定的div块 (必选项,必须配置)
			bindEl: "#captcha-box",
			// 验证成功回调函数(必选项,必须配置)
			validSuccess: (res, c, tac) => {
				// 销毁验证码服务
				console.log("验证成功，后端返回的数据为", res);
				visible.value = false;
				setTimeout(() => {
					tac.destroyWindow();
				}, 500)
				loginData.captchaStatus = "success";
				loginFormRef.value.validateField('captchaStatus');
			},
			// 验证失败的回调函数(可忽略，如果不自定义 validFail 方法时，会使用默认的)
			validFail: (res, c, tac) => {
				console.log("验证码验证失败回调...")
				// 验证失败后重新拉取验证码
				tac.reloadCaptcha();
			},
			// 刷新按钮回调事件
			btnRefreshFun: (el, tac) => {
				console.log("刷新按钮触发事件...")
				tac.reloadCaptcha();
			},
			// 关闭按钮回调事件
			btnCloseFun: (el, tac) => {
				console.log("关闭按钮触发事件...")
				visible.value = false;
				verifyIng.value = false;
				setTimeout(() => {
					tac.destroyWindow();
				}, 500)
			}
		}
		// 一些样式配置， 可不传
		let style = {
			// 按钮样式
			btnUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3.png",
			// 背景样式
			// bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
			// logo地址
			logoUrl: null,
			// 滑动边框样式
			moveTrackMaskBgColor: "#409EFF",
			moveTrackMaskBorderColor: "#409EFF"
		}
		new window.TAC(config, style).init();
	}

	const loginLoading = ref(false);
	const handleLoginSubmit = () => {
		loginFormRef.value.validate(async (valid : boolean) => {
			if (valid) {
				try {
					loginLoading.value = true;
					let res = await loginApi({
						username: loginData.username,
						password: Md5.hashStr(loginData.password)
					});
					localStorage.setItem("TOKEN_KEY", res.data.token);
					//保存token之后获取账号信息及菜单并保存
					getSaveInfo();
				} catch (e) {
					loginLoading.value = false;
				} finally {

				}
			} else {
				console.log('error submit!');
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
			} else {
				const { path, queryParams } = parseRedirect();
				router.push({ path: path, query: queryParams });
			}
		} catch (e) {

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
	const { width, height } = useWindowSize();
	/** 根据屏幕宽度切换设备模式 */
	watchEffect(() => {
		if (width.value < 640) {
			popoverWidth.value = 340;
		} else {
			popoverWidth.value = 400;
		}
		if (height.value < 600) {
			icpVisible.value = false;
		} else {
			icpVisible.value = true;
		}
	});
	const jumpHandle = () => {
		window.open("https://beian.miit.gov.cn");
	}

	onMounted(() => {

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

			:deep(.captcha-box) {
				.el-input__wrapper {
					.el-input__inner {
						cursor: pointer;
						text-align: center;
					}
				}
			}
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
		
		.number {
			cursor: pointer;
		}
	}
</style>