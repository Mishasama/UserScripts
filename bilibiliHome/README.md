B站网页端添加APP首页推荐
=========================

[脚本发布页](https://greasyfork.org/zh-CN/scripts/368446)

[个人脚本仓库](https://github.com/indefined/UserScripts)

[问题反馈到这里](https://github.com/indefined/UserScripts/issues)

**提交问题前请仔细读完说明和使用须知**

**<font color="#0f0">此脚本目前未适配新版主页，[点击查看详情](https://github.com/indefined/UserScripts/issues/76)</font>**

**如果你使用新版首页的话可以使用[bilibili-app-recommend
](https://greasyfork.org/zh-CN/scripts/443530-bilibili-app-recommend)**


-------------------------
## 功能

- bilibili网页端首页添加APP首页推荐内容
- 添加/撤销稍后再看
- 不喜欢/撤销不喜欢
- 视频/弹幕预览
- 全站排行榜(20201203开始旧版全站排行接口全部失效，已换用新版接口并删除日期选项)

![图片预览](https://greasyfork.org/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaXd0IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--dbb03ca1a4335781c93150650b81702c3d7a336e/preview.jpg)

-------------------------
## 授权说明

- 目前获取根据个人观看喜好的APP首页数据和提交定制不喜欢的视频需要获取授权key。
- 点击获取授权将从官方授权接口获取一个授权key，获取的key保存在脚本管理器内。
- 如果不想使用授权，脚本仍然能从官方接口获取随机推荐视频，但内容可能不再根据个人喜好且无法提交不喜欢内容。
- 点击删除授权可从脚本管理器中删除已获取授权key，脚本将按照没有获取授权的情况执行。
- 授权key有效期大约一个月，如果看到奇怪的推荐提交不喜欢时遇到奇怪的错误可以尝试删除授权重新获取。

-------------------------
## 兼容性

- 本脚本使用了较新的ES6+和HTML5 API，比较旧的浏览器版本可能不兼容
- chrome 72 @ Tampermonkey 4.7/4.8 测试通过
- firefox 64 @ Tampermonkey 4.8 、Violentmonkey v2.10 测试通过
- 不兼容GreaseMonkey4
- 其它浏览器和脚本管理器未知

-------------------------
## 使用须知

- 获取的内容和提交不喜欢效果取决于服务器且可能存在很高的作用延迟，脚本仅负责提交不对内容负责
- 添加内容依赖首页的动画版块，如果找不到版块或者版块定义变更脚本将不工作
- APP首页内容使用旧版APP接口，当前该接口鉴权已经被提升，官方后续是否会更改关闭该接口无法判断