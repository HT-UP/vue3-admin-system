import permission from './modules/permission'

export default function directive(app) {
	/* 按钮权限指令传入权限字符串，如：v-permission="'edit'" */
	app.directive('permission', permission)
}