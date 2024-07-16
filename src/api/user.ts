import request from "@/request";

//获取验证码
export function getCaptchaImgApi() {
	return request.get(`/api/v1/auth/captcha`);
}
// 登录
export function loginApi(formData) {
	return request({
		url: `/api/v1/auth/login`,
		method: "post",
		data: formData,
		headers: {
		  "Content-Type": "multipart/form-data",
		}
	});
}
//获取个人信息及按钮权限
export function getUserInfoApi() {
	return request.get(`/api/v1/users/me`);
}
//获取菜单
export function getMenuListApi() {
	return request.get(`/api/v1/menus/routes`);
}
//退出登录
export function loginOutApi() {
	return request.delete(`/api/v1/auth/logout`);
}