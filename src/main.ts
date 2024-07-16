import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from "@/router"
import store from "@/store"

// 样式
import "element-plus/theme-chalk/dark/css-vars.css"
import "@/styles/index.scss"
import 'uno.css'
import "animate.css"

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, { size: 'default', zIndex: 3000 })
app.use(router)
app.use(store)
app.mount("#app")
