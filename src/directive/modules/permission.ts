import store from '@/store'

export default {
	mounted(el, binding) {
		let buttonKey = binding.value;
		if (buttonKey) {
			let index = store.state.userInfo.buttonList.indexOf(buttonKey);
			if (index == -1) {
				// 没有权限 移除Dom元素
				el.parentNode && el.parentNode.removeChild(el)
			}
		} else {
			throw new Error(`缺少唯一指令`)
		}
	}
}