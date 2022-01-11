# uniapp实现在微信H5中使用支付宝支付

本文讨论的是在微信公众号（即网页版H5）中实现支付宝支付的方法，其他端如小程序、APP不在本文讨论范围内。

支付宝官方提供了一个在微信H5中使用支付宝支付的插件，[链接地址](https://gw.alipayobjects.com/os/bmw-prod/aefe726f-6363-4bfb-9141-4e4bb75d56fb.zip)

实现效果图：

![alt 提示用浏览器打开](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/254687/1602828363659-f0f742df-f318-4f76-86b8-fb04c972ea80.jpeg?x-oss-process=image%2Fresize%2Cw_300)
![alt 调起支付宝网页支付](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/254687/1602828558563-3cf55243-f08f-42e9-bcee-c02fa77a568c.jpeg?x-oss-process=image%2Fresize%2Cw_300)

以上方式在非前后端分离的项目中非常好实现，照着Demo基本都能成功，接下来要讨论的是，如何在用uniapp开发的网页项目中实现。

假设项目中有一个支付页如/pages/payment/pay.vue

第一步，把下载的压缩包解压，里面的ap.js和pay.htm必须用到

修改ap.js，在文件里面找到
```
location.href="pay.htm?goto="
```
修改成
```
location.href="/pages/payment/alipay?goto="
```
再把ap.js放入到/common/目录中

第二步，编辑你的pay.vue，引入ap.js
```
// #ifdef H5
import ap from '@/common/ap.js'
// #endif
```
ap.js只支持H5，所以必须使用条件编译。

然后，在选择支付宝支付时，向后台请求支付参数，返回后执行以下代码：
```
const payform = document.createElement('payform')
payform.innerHTML = res.data.paystring
document.body.appendChild(payform)
let queryParam = ''
//开始拼接参数
Array.prototype.slice.call(document.querySelectorAll("input[type=hidden]")).forEach(
	function(ele) {
		queryParam += ele.name + "=" + encodeURIComponent(ele.value) + '&'
	})
let gotoUrl = document.querySelector("#alipaysubmit").getAttribute('action') + '&' +
	queryParam
_AP.pay(gotoUrl)
```

第三步，把pay.htm重命名为alipay.vue，放并入/pages/payment/目录中，注意需要在pages.json中注册一下；

编辑alipay.vue文件，如下：

模板
```
<template>
	<view class="container">
		<view class="J-weixin-tip weixin-tip">
			<view class="weixin-tip-content">
				请在菜单中选择在浏览器中打开,<br />
				以完成支付
			</view>
		</view>
		<view class="J-weixin-tip-img weixin-tip-img"></view>
	</view>
</template>
```
JS
```
<script>
	// #ifdef H5
	import ap from '@/common/ap.js'
	// #endif
	export default {
		data() {
			return {}
		},
		mounted() {
			if (location.hash.indexOf('error') != -1) {
				uni.showModal({
					content: '参数错误，请检查',
					showCancel: false
				})
			} else {
				var ua = navigator.userAgent.toLowerCase()
				var tip = document.querySelector(".weixin-tip")
				var tipImg = document.querySelector(".J-weixin-tip-img")
				if (ua.indexOf('micromessenger') != -1) {
					tip.style.display = 'block'
					tipImg.style.display = 'block'
					if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1) {
						tipImg.className = 'J-weixin-tip-img weixin-tip-img iphone'
					} else {
						tipImg.className = 'J-weixin-tip-img weixin-tip-img android'
					}
				} else {
					var getQueryString = function(url, name) {
						var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i")
						if (reg.test(url)) return RegExp.$2.replace(/\+/g, " ")
					}
					var param = getQueryString(location.href, 'goto') || ''
					location.href = param != '' ? _AP.decode(param) : 'http://xxx.com/pages/payment/alipay#error'
				}
			}
		}
	}
</script>
```

注意，上面JS代码中的域名请更换为你自己的域名。

经过以上步骤，就能正常调起支付宝支付宝了！