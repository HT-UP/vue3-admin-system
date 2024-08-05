import { createStore } from 'vuex'
import tagsView from './modules/tags'
import { getUserInfoApi, getMenuListApi } from '@/api/user'

export default createStore({
	state: {
		userInfo: null,
		routerMenu: [],

		layout: localStorage.getItem("layout") || 'left',
		showTagsView: localStorage.getItem("showTagsView") && localStorage.getItem("showTagsView") == 'false' ? false : true,
		fixedHeader: localStorage.getItem("fixedHeader") && localStorage.getItem("fixedHeader") == 'false' ? false : true,
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
						commit('setUserInfo', res.data);
						resolve(res.data);
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
					getMenuListApi({
						code: 'YYGLXT'
					}).then(res => {
						commit('setMenuList', res.data);
						resolve(res.data);
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