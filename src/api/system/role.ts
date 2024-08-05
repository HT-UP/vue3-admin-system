import request from "@/request";

const pre_xy = import.meta.env.VITE_APP_PRE_XY

//获取角色列表
export function getRoleListApi(params) {
	return request.post(`${pre_xy}/api/role/system/role/list`, params);
}

//获取角色下拉列表
export function getRoleOptionsApi() {
	return request.get(`${pre_xy}/api/role/system/role/dropdown/list`);
}

//修改角色状态
export function editRoleStatusApi(id, params) {
	return request.put(`${pre_xy}/api/role/system/role/${id}/status`, params);
}

//删除角色
export function deleteRoleApi(id) {
	return request.delete(`${pre_xy}/api/role/system/role/${id}`);
}

//获取角色详情
export function getRoleDetailApi(id) {
	return request.post(`${pre_xy}/api/role/system/role/${id}/detail`);
}

//新增，编辑角色
export function addOrEditRoleApi(params) {
	return request.post(`${pre_xy}/api/role/system/role/edit`, params);
}