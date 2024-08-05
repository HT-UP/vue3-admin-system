import { resetRouter } from "@/router";

// 清空token
export function resetToken() {
	console.log("resetToken");
	return new Promise<void>((resolve) => {
		localStorage.setItem("TOKEN_KEY", "");
		resetRouter();
		resolve();
	});
}

/**
 * 判断是否是外部链接
 *
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path : string) {
	const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
	return isExternal;
}

//递归获取菜单中所有真实path数组
const totalPaths = [];
export const getPathList = element => {
	element.forEach(el => {
		if (el.child && el.child.length > 0) {
			if (el.path.replace("#", "")) {
				if (el.resType == 2) {
					totalKeys.push(el.path.replace("#", ""));
				}
			}
			return getPathList(el.child); //递归调用 传入子数组
		} else {
			if (el.path.replace("#", "")) {
				totalPaths.push(el.path.replace("#", ""));
			}
			return;
		}
	});
	return totalPaths;
}

//根据子节点id递归获取所有父节点id
export const findParentList = (key, treeData) => {
	const arr = []; // 在递归时操作的数组
	let returnArr = []; // 存放结果的数组
	let depth = 0; // 定义全局层级
	// 定义递归函数
	function childrenEach(childrenData, depthN) {
		for (var j = 0; j < childrenData.length; j++) {
			depth = depthN; // 将执行的层级赋值 到 全局层级
			arr[depthN] = childrenData[j].id;
			if (childrenData[j].id == key) {
				returnArr = arr.slice(0, depthN + 1); // 将目前匹配的数组，截断并保存到结果数组，
				break;
			} else {
				if (childrenData[j].child) {
					depth++;
					childrenEach(childrenData[j].child, depth);
				}
			}
		}
		return returnArr;
	}
	return childrenEach(treeData, depth);
}