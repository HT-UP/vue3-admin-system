import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { resetToken } from "@/utils";

// 创建 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
	(config : InternalAxiosRequestConfig) => {
		// 请求头添加token
		const accessToken = localStorage.getItem("TOKEN_KEY");
		if (accessToken) {
			config.headers.Authorization = accessToken;
		}
		return config;
	},
	(error : any) => {
		return Promise.reject(error);
	}
);

// 响应拦截器
service.interceptors.response.use(
	(response : AxiosResponse) => {
		// 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
		if (
			response.config.responseType === "blob" ||
			response.config.responseType === "arraybuffer"
		) {
			return response;
		}

		const { code, data, msg } = response.data;
		// 响应成功
		if (code === "00000") {
			return response.data;
		}
		// 响应失败
		ElMessage.error(msg || "系统出错");
		return Promise.reject(new Error(msg || "Error"));
	},
	(error : any) => {
		// 异常处理
		if (error.response.data) {
			const { code, msg } = error.response.data;
			// token过期处理
			if (code === "A0230") {
				ElNotification({
					title: "提示",
					message: "您的会话已过期，请重新登录",
					type: "info",
				});
				// token过期，清除token缓存，退出登录，清空路由
				setTimeout(function() {
					resetToken().then(() => {
					  location.reload();
					});
				}, 2000);
			} else {
				ElMessage.error(msg || "系统出错");
			}
		}
		// 响应失败，抛出错误信息
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;