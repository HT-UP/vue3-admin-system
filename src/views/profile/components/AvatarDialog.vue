<template>
	<div id="avatar-dialog">
		<el-dialog :modelValue="open" title="修改头像" width="42%" top="15vh" :close-on-click-modal="false"
			:close-on-press-escape="false" destroy-on-close draggable @open="openHandle" @close="cancelHandle">
			<el-row>
				<el-col :lg="12">
					<div style="height: 350px;">
						<vue-cropper v-if="visible" ref="cropper" :img="options.img" :info="true"
							:autoCrop="options.autoCrop" :autoCropWidth="options.autoCropWidth"
							:autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox"
							:outputType="options.outputType" @realTime="realTime" />
					</div>
					<div class="flex-x-between mt-10px">
						<el-upload action="#" :http-request="requestUpload" :show-file-list="false"
							:before-upload="beforeUpload">
							<el-button>
								选择
								<el-icon class="el-icon--right">
									<UploadFilled />
								</el-icon>
							</el-button>
						</el-upload>
						<div>
							<el-button class="ml-12px" icon="Plus" @click="changeScale(1)"></el-button>
							<el-button icon="Minus" @click="changeScale(-1)"></el-button>
							<el-button icon="RefreshLeft" @click="rotateLeft"></el-button>
							<el-button icon="RefreshRight" @click="rotateRight"></el-button>
						</div>
					</div>
				</el-col>
				
				<el-col :lg="12">
					<div style="height: 350px;">
						<div class="avatar-upload-preview">
							<img :src="options.previews.url" :style="options.previews.img" />
						</div>
					</div>
					<div class="text-center mt-10px">
						<el-button :icon="Check" type="primary" :loading="saveLoading" @click="uploadImg">保 存</el-button>
					</div>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
	import "vue-cropper/dist/index.css";
	import { VueCropper } from "vue-cropper";
	import { Check } from '@element-plus/icons-vue';
	import { uploadFileApi, editAvatarApi } from "@/api/user";

	const store = useStore();
	const { proxy } = getCurrentInstance();
	const props = defineProps({
		open: {
			type: Boolean,
			default: false,
		}
	});
	const emits = defineEmits(['update:open']);

	const visible = ref(false);
	//图片裁剪数据
	const options = reactive({
		img: store.state.userInfo.userAvatar,     // 裁剪图片的地址
		autoCrop: true,            // 是否默认生成截图框
		autoCropWidth: 200,        // 默认生成截图框宽度
		autoCropHeight: 200,       // 默认生成截图框高度
		fixedBox: true,            // 固定截图框大小 不允许改变
		outputType: "png",         // 默认生成截图为PNG格式
		filename: 'avatar',        // 文件名称
		previews: {}               //预览数据
	});
	const openHandle = () => {
		visible.value = true;
	}
	const cancelHandle = () => {
		options.img = store.state.userInfo.userAvatar;
		options.visible = false;
		emits('update:open', false);
	}
	/** 向左旋转 */
	const rotateLeft = () => {
		proxy.$refs.cropper.rotateLeft();
	}

	/** 向右旋转 */
	const rotateRight = () => {
		proxy.$refs.cropper.rotateRight();
	}

	/** 图片缩放 */
	const changeScale = (num) => {
		num = num || 1;
		proxy.$refs.cropper.changeScale(num);
	}
	/** 覆盖默认上传行为 */
	const requestUpload = () => { }
	/** 上传预处理 */
	const beforeUpload = (file) => {
		if (file.type.indexOf("image/") == -1) {
			proxy.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
		} else {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				options.img = reader.result;
				options.filename = file.name;
			};
		}
	}
	const saveLoading = ref(false);
	/** 上传图片 */
	const uploadImg = () => {
		proxy.$refs.cropper.getCropBlob(async (data) => {
			try {
				saveLoading.value = true;
				let formData = new FormData();
				formData.append("file", data, options.filename);
				let res = await uploadFileApi(formData);
				saveAvatarHandle(res.data.url);
			} catch (e) {
				saveLoading.value = false;
			} finally {
				
			}
		});
	}
	const saveAvatarHandle = async (url) => {
		try{
			await editAvatarApi({
				userAvatar: url
			});
			store.state.userInfo.userAvatar = url;
			ElMessage.success("修改成功");
			visible.value = false;
			emits("update:open", false);
		}catch(e){
			
		}finally{
			saveLoading.value = false;
		}
	}

	/** 实时预览 */
	const realTime = (data) => {
		options.previews = data;
	}
</script>

<style lang="scss" scoped>
	#avatar-dialog {
		.avatar-upload-preview {
			position: relative;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			width: 200px;
			height: 200px;
			border-radius: 50%;
			-webkit-box-shadow: 0 0 4px #ccc;
			box-shadow: 0 0 4px #ccc;
			overflow: hidden;
		}
	}
</style>