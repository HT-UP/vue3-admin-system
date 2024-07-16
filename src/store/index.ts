import { createStore } from 'vuex'
import tagsView from './modules/tags'
import { getUserInfoApi, getMenuListApi } from '@/api/user'

export default createStore({
	state: {
		userInfo: null,
		routerMenu: [],

		layout: localStorage.getItem("layout") || 'left',
		showTagsView: localStorage.getItem("showTagsView") || true,
		fixedHeader: localStorage.getItem("fixedHeader") || true,
		sidebarStatus: localStorage.getItem("sidebarStatus") || 'opened',
		theme: localStorage.getItem("theme") || 'light',
		activeTopMenuPath: localStorage.getItem("activeTopMenuPath") || '',
		device: localStorage.getItem("device") || 'desktop',

		settingsVisible: false
	},
	mutations: {
		setUserInfo: (state, info) => {
			state.userInfo = info;
		},
		setMenuList: (state, menu) => {
			state.routerMenu = menu;
		},
		toggleSidebar: (state, status) => {
			let sidebarStatus = localStorage.getItem("sidebarStatus") === 'opened' ? 'closed' : 'opened';
			state.sidebarStatus = sidebarStatus;
			localStorage.setItem('sidebarStatus', sidebarStatus);
		},
		openSideBar: (state, status) => {
			state.sidebarStatus = 'opened';
			localStorage.setItem('sidebarStatus', 'opened');
		},
		closeSideBar: (state, status) => {
			state.sidebarStatus = 'closed';
			localStorage.setItem('sidebarStatus', 'closed');
		},
		toggleDevice: (state, type) => {
			state.device = type;
			localStorage.setItem('device', type);
		},
		openSettingsDrawer: (state, status) => {
			state.settingsVisible = true;
		},
		closeSettingsDrawer: (state, status) => {
			state.settingsVisible = false;
		},
		changeTheme: (state, type) => {
			state.theme = type;
			localStorage.setItem('theme', type);
		},
		changeShowTags: (state, status) => {
			state.showTagsView = status;
			localStorage.setItem('showTagsView', status);
		},
		changeHeader: (state, status) => {
			state.fixedHeader = status;
			localStorage.setItem('fixedHeader', status);
		},
		changeLayout: (state, type) => {
			state.layout = type;
			localStorage.setItem('layout', type);
		}
	},
	actions: {
		//获取个人账号信息
		getUserInfo({ commit }) {
			return new Promise((resolve, reject) => {
				try {
					getUserInfoApi().then(res => {
						const info = res.data;
						commit('setUserInfo', info);
						resolve(info);
					}).catch(err => {
						reject(err);
					})
				} catch (error) {
					reject(error);
				}
			})
		},
		//获取路由菜单列表
		getMenuList({ commit }) {
			return new Promise((resolve, reject) => {
				try {
					getMenuListApi().then(res => {
						const menu = [
							// {
							// 	path: '/dashboard',
							// 	meta: {
							// 		title: '首页',
							// 		hidden: false,
							// 		icon: 'house'
							// 	},
							// 	id: 1,
							// 	pid: 0
							// },
							{
								path: '/system',
								meta: {
									title: "系统管理",
									hidden: false,
									icon: 'monitor'
								},
								id: 2,
								pid: 0,
								children: [
									{
										path: '/system/user',
										meta: {
											title: '用户管理',
											hidden: false,
											icon: 'user'
										},
										id: 3,
										pid: 2
									},
									{
										path: '/system/role',
										meta: {
											title: '角色管理',
											hidden: false,
											icon: 'avatar'
										},
										id: 4,
										pid: 2
									}
								]
							}
						];
						console.log(menu);
						commit('setMenuList', menu);
						resolve(menu);
					}).catch(err => {
						reject(err);
					})
				} catch (error) {
					reject(error);
				}
			})
		},
	},
	modules: {
		tagsView
	}
})