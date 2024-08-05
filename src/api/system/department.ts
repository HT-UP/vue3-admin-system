import request from "@/request";

const pre_xy = import.meta.env.VITE_APP_PRE_XY

//获取部门列表
export function getDeptListApi(params) {
	return request.get(`${pre_xy}/api/role/system/dept/list`, {params: params});
}

//新增，编辑部门
export function addOrEditDeptApi(params) {
	return request.post(`${pre_xy}/api/role/system/dept/edit`, params);
}

//获取部门详情
export function getDeptDetailApi(id) {
	return request.post(`${pre_xy}/api/role/system/dept/${id}/detail`);
}

//删除部门
export function deleteDeptApi(id) {
	return request.delete(`${pre_xy}/api/role/system/dept/${id}`);
}