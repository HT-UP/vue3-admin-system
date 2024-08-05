import vue from '@vitejs/plugin-vue'
import { UserConfig, ConfigEnv, loadEnv, defineConfig } from 'vite'
import { resolve } from 'path'
const pathSrc = resolve(__dirname, "src")
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import UnoCSS from "unocss/vite"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig(({ mode } : ConfigEnv) : UserConfig => {
	const env = loadEnv(mode, process.cwd());
	return {
		resolve: {
			alias: {
				"@": pathSrc,
			},
		},
		css: {
			// CSS 预处理器
			preprocessorOptions: {
				// 定义全局 SCSS 变量
				scss: {
					javascriptEnabled: true,
					additionalData: `@use "@/styles/variables.scss" as *;`,
				},
			},
		},
		base: env.VITE_ENV === 'production' ? './' : './',
		server: {
			// 允许IP访问
			host: "0.0.0.0",
			// 应用端口 (默认:3000)
			port: 8080,
			// 运行是否自动打开浏览器
			open: false,
			proxy: {
				/** 代理前缀为 /api 的请求  */
				'/api/zxc': {
					// target: 'http://vapi.youlai.tech', // 指定要代理的目标地址
					target: 'http://192.168.3.33:8080', // 章学铖
					changeOrigin: true, // 是否改变请求的来源
					rewrite: (path) => path.replace(/\/api\/zxc/g, ''), // 可选的路径重写规则
				},
				'/api/xy': {
					// target: 'http://vapi.youlai.tech', // 指定要代理的目标地址
					target: 'http://192.168.3.17:3211', // 谢颖
					changeOrigin: true, // 是否改变请求的来源
					rewrite: (path) => path.replace(/\/api\/xy/g, ''), // 可选的路径重写规则
				},
			},
		},
		plugins: [
			vue(),
			UnoCSS({
				hmrTopLevelAwait: false,
			}),
			AutoImport({
				// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
				imports: ['vue', 'vue-router', 'vuex', '@vueuse/core'],
				resolvers: [
					// 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
					ElementPlusResolver(),
					// 自动导入图标组件
					IconsResolver({})
				],
				// 是否在 vue 模板中自动导入
				vueTemplate: true,
				// 自动导入组件类型声明文件位置，默认根目录
				dts: resolve(pathSrc, 'auto-imports.d.ts'),
			}),
			Components({
				resolvers: [
					// 自动导入 Element Plus 组件
					ElementPlusResolver(),
					// 自动注册图标组件
					IconsResolver({
						// element-plus图标库，其他图标库 https://icon-sets.iconify.design/
						enabledCollections: ["ep"],
					}),
				],
				// 自动导入组件类型声明文件位置，默认根目录
				dts: resolve(pathSrc, 'components.d.ts'),
			}),
			Icons({
				// 自动安装图标库
				autoInstall: true,
			}),
			createSvgIconsPlugin({
				// 指定需要缓存的图标文件夹
				iconDirs: [resolve(pathSrc, "assets/icons")],
				// 指定symbolId格式
				symbolId: "icon-[dir]-[name]",
			}),
		],
		//****这里进行设置文件名****
		build: {
			outDir: 'dist'
		}
	}
})