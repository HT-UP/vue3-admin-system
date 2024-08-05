import request from "@/request";

const pre_xy = import.meta.env.VITE_APP_PRE_XY

//获取系统下拉列表
export function getSystemOptionsApi() {
	return request.post(`${pre_xy}/api/role/system/dictionary/data/dropdown/list`);
}

//获取菜单列表
export function getMenuListApi(id, params) {
	return request.post(`${pre_xy}/api/role/system/res/${id}`, params);
}

//获取菜单下拉列表
export function getMenuOptionsApi(id, params) {
	return request.post(`${pre_xy}/api/role/system/res/${id}`, params);
}

//新增，编辑权限
export function addOrEditMenuApi(params) {
	return request.post(`${pre_xy}/api/role/system/res/edit`, params);
}

//获取菜单详情
export function getMenuDetailApi(id) {
	return request.post(`${pre_xy}/api/role/system/res/${id}/detail`);
}

//删除权限
export function deleteMenuApi(id) {
	return request.delete(`${pre_xy}/api/role/system/res/${id}`);
}