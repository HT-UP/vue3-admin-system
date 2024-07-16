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
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

//递归获取菜单中所有真实path数组
const totalPaths = [];
export const getPathList = element => {
	element.forEach(el => {
	  if (el.children) {
	    if (el.path.replace("#", "")) {
	      if (el.pid != 0) {
	        totalKeys.push(el.path.replace("#", ""));
	      }
	    }
	    return getPathList(el.children); //递归调用 传入子数组
	  } else {
	    if (el.path.replace("#", "")) {
	      totalPaths.push(el.path.replace("#", ""));
	    }
	    return;
	  }
	});
	return totalPaths;
}