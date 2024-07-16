import { createRouter, createWebHashHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import store from '@/store'
import { resetToken, getPathList } from "@/utils";
import NProgress from "@/utils/nprogress";

export const Layout = () => import("@/layout/index.vue");

// 路由文件懒加载
export const constantRoutes : RouteRecordRaw[] = [
	{
		path: "/redirect",
		name: 'Redirect',
		component: Layout,
		meta: { hidden: true },
		children: [
			{
				path: "/redirect/:path(.*)",
				component: () => import("@/views/redirect/index.vue"),
			},
		],
	},
	{
		path: "/login",
		name: 'Login',
		component: () => import("@/views/login/index.vue"),
		meta: { hidden: true },
	},
	
	//独立菜单页面必须写在这里面
	{
	  path: "/",
	  name: "/",
	  component: Layout,
	  redirect: "/login",
	  children: [
	    {
	    	path: "/dashboard",
	    	name: "Dashboard",
	    	component: () => import("@/views/dashboard/index.vue"),
	    	meta: {
	    		title: "首页",
	    		keepAlive: true
	    	},
	    },
	  ],
	},

	{
		path: '/system',
		name: 'System',
		component: Layout,
		meta: {
			title: "系统管理"
		},
		children: [
			{
				path: '/system/user',
				name: 'User',
				component: () => import('@/views/system/user/index.vue'),
				meta: {
					title: '用户管理',
					keepAlive: true
				}
			},
			{
				path: '/system/role',
				name: 'Role',
				component: () => import('@/views/system/role/index.vue'),
				meta: {
					title: '角色管理',
					keepAlive: true
				}
			}
		]
	},

	{
		path: "/401",
		name: '401',
		component: () => import("@/views/errorPage/401.vue"),
		meta: { hidden: true },
	},
	{
		path: "/404",
		name: '404',
		component: () => import("@/views/errorPage/404.vue"),
		meta: { hidden: true },
	},
]

/**
 * 创建路由
 */
const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes,
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 白名单路由
const whiteList = ["/login", "/401", "/404"];

router.beforeEach(async (to, from, next) => {
	NProgress.start();
	const hasToken = localStorage.getItem("TOKEN_KEY");
	if (hasToken) {
		if (["/401", "/404"].includes(to.path) || to.path.indexOf("/redirect") !== -1) {
			next();
			NProgress.done();
			return false;
		}

		//已登录,判断是否已获取到菜单
		if (store.state.routerMenu.length == 0) {
			try {
				const getUserInfo = store.dispatch('getUserInfo');
				const getMenuList = store.dispatch('getMenuList');
				//使用Promise.all等待两个操作完成
				await Promise.all([getUserInfo, getMenuList]);
				if (store.state.routerMenu.length == 0) {
					ElMessage.warning("暂无任何页面权限，请联系管理员开通！");
					next({
						path: '/401',
						replace: true
					});
					NProgress.done();
				} else {
					if (to.path === "/login") {
						// 如果已登录，跳转到首页
						next({ path: getPathList(store.state.routerMenu)[0] });
						NProgress.done();
					} else {
						// 如果未匹配到任何路由，跳转到404页面
						if (to.matched.length === 0) {
							next("/404");
						} else {
							if (getPathList(store.state.routerMenu).includes(to.path)) {
								next();
								NProgress.done();
							} else {
								// 无权限，重定向到401页面
								next({
									path: '/401',
									replace: true
								});
								NProgress.done();
							}
						}
					}
				}
			} catch (e) {
				//移除 token 并重定向到登录页，携带当前页面路由作为跳转参数
				await resetToken();
				redirectToLogin(to, next);
				NProgress.done();
			}
		} else {
			if (to.path === "/login") {
				// 如果已登录，跳转到首页
				next({ path: getPathList(store.state.routerMenu)[0] });
				NProgress.done();
			} else {
				// 如果未匹配到任何路由，跳转到404页面
				if (to.matched.length === 0) {
					next("/404");
				} else {
					if (getPathList(store.state.routerMenu).includes(to.path)) {
						next();
						NProgress.done();
					} else {
						// 无权限，重定向到401页面
						next({
							path: '/401',
							replace: true
						});
						NProgress.done();
					}
				}
			}
		}
	} else {
		// 没有token，未登录
		if (whiteList.includes(to.path)) {
			// 在白名单，直接进入
			next();
		} else {
			// 不在白名单，重定向到登录页
			redirectToLogin(to, next);
			NProgress.done();
		}
	}
});

router.afterEach(() => {
	NProgress.done();
});

/** 重定向到登录页 */
function redirectToLogin(
	to : RouteLocationNormalized,
	next : NavigationGuardNext
) {
	const params = new URLSearchParams(to.query as Record<string, string>);
	const queryString = params.toString();
	const redirect = queryString ? `${to.path}?${queryString}` : to.path;
	next(`/login?redirect=${encodeURIComponent(redirect)}`);
}

/**
 * 重置路由
 */
export function resetRouter() {
	router.replace({ path: "/login" });
}

export default router;