
# html
	```
	<div class="multiple-dialog clearfix hide" id="multi-dialog">
        <div class="multiple">
            <div class="m-container">
                <div class="m-search">
                    <input type="text" placeholder="城市">
                </div>
                <ul class="m-list">
                </ul>
            </div>
        </div>
    </div>
	```
# 使用方法	
	```
	var multipleDialog = new Multiple({
        el : ".multiple-dialog" ,
        data : data ,
        onSelectEvent : function (item , e) {
           // 选择后的回调
        },
        onCancelSelectEvent:function (item , e) {
            // 取消选择后的回调
        }
    });
	```

# api 

    setSelected (setSelected) 
	
	初始化被选择的数据集合