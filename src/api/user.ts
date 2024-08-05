import request from "@/request";

const pre_zxc = import.meta.env.VITE_APP_PRE_ZXC
const pre_xy = import.meta.env.VITE_APP_PRE_XY

// 登录
export function loginApi(params) {
	return request.post(`${pre_zxc}/api/AAA/sys/login`, params);
}
//获取个人信息及按钮权限
export function getUserInfoApi() {
	return request.post(`${pre_xy}/api/role/system/userinfo/get`);
}
//获取菜单
export function getMenuListApi(params) {
	return request.post(`${pre_xy}/api/role/system/res/menu`, params);
}
//退出登录
export function loginOutApi() {
	return request.post(`${pre_zxc}/api/AAA/sys/logout`);
}

//上传文件公共接口
export function uploadFileApi(formData) {
	return request({
		url: `${pre_xy}/api/role/upload`,
		method: "post",
		data: formData,
		headers: {
		  "Content-Type": "multipart/form-data",
		}
	});
}

//修改头像
export function editAvatarApi(params) {
	return request.post(`${pre_xy}/api/role/system/userinfo/edit/avatar`, params);
}

//修改密码
export function editPasswordApi(params) {
	return request.post(`${pre_xy}/api/role/system/userinfo/edit/passwd`, params);
}