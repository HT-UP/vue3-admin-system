const state = {
	visitedViews: [],  // 用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
	cachedViews: []  // 实际 keep-alive 的路由。可以在配置路由的时候通过 meta.keepAlive 来设置是否需要缓存这个路由。
}
const mutations = {
	// 添加标签
	// 如果标签跳转的路由存在就不添加，否则就添加进标签组
	ADD_VISITED_VIEW: (state, view) => {
		if (state.visitedViews.some(v => v.path === view.path)) return
		state.visitedViews.push(
			Object.assign({}, view, {
				title: view.meta.title || 'no-name'
			})
		)
	},
	// 添加缓存标签
	// 已存在缓存就不缓存了
	ADD_CACHED_VIEW: (state, view) => {
		if (state.cachedViews.includes(view.name)) return
		if (view.meta && view.meta.keepAlive) {
			state.cachedViews.push(view.name)
		}
	},
	UPDATE_VISITED_VIEW: (state, view) => {
		for (let v of state.visitedViews) {
			if (v.path === view.path) {
				v = Object.assign(v, view)
				break
			}
		}
	},
	// 删除选择的标签
	DEL_VISITED_VIEW: (state, view) => {
		for (const [i, v] of state.visitedViews.entries()) {
			if (v.path === view.path) {
				state.visitedViews.splice(i, 1)
				break
			}
		}
	},
	// 删除缓存标签
	DEL_CACHED_VIEW: (state, view) => {
		const index = state.cachedViews.indexOf(view.name);
		index > -1 && state.cachedViews.splice(index, 1);
	},
	// 删除其它标签
	DEL_OTHER_VISITED_VIEWS: (state, view) => {
		state.visitedViews = state.visitedViews.filter(v => {
			return v.path === view.path
		})
	},
	// 删除其它缓存标签
	DEL_OTHER_CACHED_VIEWS: (state, view) => {
		const index = state.cachedViews.indexOf(view.name)
		if (index > -1) {
			state.cachedViews = state.cachedViews.slice(index, index + 1)
		} else {
			state.cachedViews = []
		}
	},
	// 删除左侧标签
	DEL_LEFT_VIEWS: (state, view) => {
		const index = state.visitedViews.findIndex(v => v.path === view.path)
		if (index === -1) {
			return
		}
		state.visitedViews = state.visitedViews.filter((item, idx) => {
			if (idx >= index) {
				return true
			}
			const i = state.cachedViews.indexOf(item.name)
			if (i > -1) {
				state.cachedViews.splice(i, 1)
			}
			return false
		})
	},
	// 删除右侧标签
	DEL_RIGHT_VIEWS: (state, view) => {
		const index = state.visitedViews.findIndex(v => v.path === view.path)
		if (index === -1) {
			return
		}
		state.visitedViews = state.visitedViews.filter((item, idx) => {
			if (idx <= index) {
				return true
			} const i = state.cachedViews.indexOf(item.name)
			if (i > -1) {
				state.cachedViews.splice(i, 1)
			} return false
		})
	}
}
const actions = {
	// 新增当前路由标签和标签缓存
	addView({ dispatch }, view) {
		dispatch('addVisitedView', view)
		dispatch('addCachedView', view)
	},
	// 新增当前路由标签
	addVisitedView({ commit }, view) {
		commit('ADD_VISITED_VIEW', view)
	},
	// 新增当前路由标签缓存
	addCachedView({ commit }, view) {
		commit('ADD_CACHED_VIEW', view)
	},
	updateVisitedView({ commit }, view) {
		commit('UPDATE_VISITED_VIEW', view)
	},
	// 删除当前路由标签和标签缓存
	delView({ dispatch, state }, view) {
		return new Promise(resolve => {
			dispatch('delVisitedView', view);
			dispatch('delCachedView', view);
			resolve({
				visitedViews: [...state.visitedViews],
				cachedViews: [...state.cachedViews]
			})
		})
	},
	// 删除当前路由标签
	delVisitedView({ commit, state }, view) {
		return new Promise(resolve => {
			commit('DEL_VISITED_VIEW', view)
			resolve([...state.visitedViews])
		})
	},
	// 删除当前路由标签缓存
	delCachedView({ commit, state }, view) {
		return new Promise(resolve => {
			commit('DEL_CACHED_VIEW', view)
			resolve([...state.cachedViews])
		})
	},
	// 删除其他路由标签和标签缓存
	delOtherViews({ dispatch, state }, view) {
		return new Promise(resolve => {
			dispatch('delOtherVisitedViews', view)
			dispatch('delOtherCachedViews', view)
			resolve({
				visitedViews: [...state.visitedViews],
				cachedViews: [...state.cachedViews]
			})
		})
	},
	// 删除其他路由标签
	delOtherVisitedViews({ commit, state }, view) {
		return new Promise(resolve => {
			commit('DEL_OTHER_VISITED_VIEWS', view)
			resolve([...state.visitedViews])
		})
	},
	// 删除其他路由标签缓存
	delOtherCachedViews({ commit, state }, view) {
		return new Promise(resolve => {
			commit('DEL_OTHER_CACHED_VIEWS', view)
			resolve([...state.cachedViews])
		})
	},
	// 删除左侧路由标签缓存
	delLeftTags({ commit }, view) {
		return new Promise(resolve => {
			commit('DEL_LEFT_VIEWS', view)
			resolve([...state.visitedViews])
		})
	},
	// 删除右侧路由标签缓存
	delRightTags({ commit }, view) {
		return new Promise(resolve => {
			commit('DEL_RIGHT_VIEWS', view)
			resolve([...state.visitedViews])
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}