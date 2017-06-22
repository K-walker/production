
# 使用方法

	var drag  = new Drag("可拖拽元素类名" , function (top) {
		// TODO 拖拽事件的回调
	});

# api
	
	setIndex (index) 
	
	如果当前可拖拽的dom有多个，则使用此参数指定对应的dom
 
	setEnable (isEnable)

	设置 禁用/启动 拖拽
	