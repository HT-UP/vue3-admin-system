import request from "@/request";

const pre_xy = import.meta.env.VITE_APP_PRE_XY

//获取员工列表
export function getUserListApi(params) {
	return request.post(`${pre_xy}/api/role/system/user/list`, params);
}

//修改员工状态
export function editUserStatusApi(id, params) {
	return request.put(`${pre_xy}/api/role/system/user/${id}/status`, params);
}

//删除员工
export function deleteUserApi(id) {
	return request.delete(`${pre_xy}/api/role/system/user/${id}`);
}

//获取员工详情
export function getUserDetailApi(id) {
	return request.post(`${pre_xy}/api/role/system/user/${id}/detail`);
}

//新增，编辑员工
export function addOrEditUserApi(params) {
	return request.post(`${pre_xy}/api/role/system/user/edit`, params);
}

//重置员工密码
export function resetUserPasswordApi(id) {
	return request.put(`${pre_xy}/api/role/system/user/${id}/passwd`);
}