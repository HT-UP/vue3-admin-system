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
			config.headers.accessToken = accessToken;
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

		const { resultStatus, errorMessage, code, data } = response.data;
		// 响应成功
		if (resultStatus) {
			return response.data;
		} else {
			if (code === "50001") {
				ElMessage.warning("您的会话已过期，请重新登录");
				// token过期，清除token缓存，退出登录，清空路由
				setTimeout(function() {
					resetToken().then(() => {
					  location.reload();
					});
				}, 1000);
			} else{
				ElMessage.error(errorMessage || "系统出错");
			}
			// 响应失败
			return Promise.reject(new Error(errorMessage || "Error"));
		}
	},
	(error : any) => {
		// 响应失败，抛出错误信息
		ElMessage.error(error.message || "系统出错");
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;