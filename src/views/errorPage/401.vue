<template>
	<div class="content-container">
		<div class="img">
			<img src="@/assets/images/401.svg">
		</div>
		<div class="content">
			<h1>401</h1>
			<div class="desc">抱歉，您无权访问该页面</div>
			<div class="action">
				<el-button v-if="!$store.state.routerMenu.length" type="primary" @click="backLogin">返回登录页</el-button>
				<el-button v-else type="primary" @click="backHome">返回首页</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineOptions({
		name: "Page401",
	});
	
	import { loginOutApi } from "@/api/user";
	import { getPathList } from '@/utils'
	
	const store = useStore();
	const router = useRouter();
	
	const backLogin = async () => {
		await loginOutApi();
		localStorage.setItem("TOKEN_KEY", "");
		router.push("/login");
	}
	const backHome = () => {
		router.push(getPathList(store.state.routerMenu)[0]);
	}
</script>

<style lang="scss" scoped>
	.content-container {
		width: 100%;
		height: 100%;
		padding: 100px;
		background: url("@/assets/images/login-background-light.jpg") no-repeat center right;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;

		.img {
			padding-right: 52px;
			zoom: 1;

			img {
				max-width: 430px;
			}
		}

		.content {
			h1 {
				color: #E6A23C;
				font-size: 72px;
				font-weight: 600;
				line-height: 72px;
				margin-bottom: 24px;
			}

			.desc {
				color: #606266;
				font-size: 20px;
				line-height: 28px;
				margin-bottom: 16px;
			}
		}
	}
</style>