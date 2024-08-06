import request from "@/request";

const pre_xy = import.meta.env.VITE_APP_PRE_XY

//获取字典类型列表
export function getDictionaryTypeListApi(params) {
	return request.post(`${pre_xy}/api/role/system/dictionary/type/list`, params);
}

//删除字典类型
export function deleteDictionaryTypeApi(id) {
	return request.delete(`${pre_xy}/api/role/system/dictionary/type/${id}`);
}

//新增，编辑字典类型
export function addOrEditDictionaryTypeApi(params) {
	return request.post(`${pre_xy}/api/role/system/dictionary/type/edit`, params);
}

//获取字典数据列表
export function getDictionaryDataListApi(id, params) {
	return request.post(`${pre_xy}/api/role/system/dictionary/data/${id}/list`, params);
}

//删除字典数据
export function deleteDictionaryDataApi(id) {
	return request.delete(`${pre_xy}/api/role/system/dictionary/data/${id}`);
}

//新增，编辑字典数据
export function addOrEditDictionaryDataApi(params) {
	return request.post(`${pre_xy}/api/role/system/dictionary/data/edit`, params);
}