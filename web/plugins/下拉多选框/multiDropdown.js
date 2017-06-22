/**
 * Created by 004928 on 2017/4/21.
 * 数据地图的下拉多选框
 */
(function (window) {

    var Multiple = function(option) {
        this.el = document.querySelector(option.el);
        this.data = option.data;
        this.onSelectEvent = option.onSelectEvent;
        this.onCancelSelectEvent = option.onCancelSelectEvent;
        var that = this ;

        init();

        /**
         *
         */
        function addHandler () {
            var search = that.el.querySelector(".m-search"),
                ul = that.el.querySelector(".m-list"),
                input = search.querySelector("input")

            var timeId = null ;
            /**
             * 监听输入框的内容改变事件
             */
            input.addEventListener("input" , function(e) {
                clearTimeout(timeId);
                timeId = setTimeout(function () {
                    onSearch(e.target.value)
                } , 300)
            });

            $(ul).on("click","li",function() {
                var $icon = $(this).find("i");
                var index = $(this).index();
                var tempData = that.data[index];//需要添加或删除的数据
                if($icon.hasClass("selected")){ //取消选择
                    $icon.removeClass("selected");
                    that.onCancelSelectEvent && that.onCancelSelectEvent(tempData , that.e);
                }else{//选择
                    $icon.addClass("selected");
                    that.onSelectEvent && that.onSelectEvent(tempData , that.e);
                }
            });
        }

        function init () {
            var ul = that.el.querySelector(".m-list"),
                tmpl = "" ;
            for(var i = 0 , item ; item = that.data[i++];){
                tmpl += '<li><i></i><span>' + item.title + '</span></li>';
            }
            ul.innerHTML = tmpl;
            addHandler();
        }

        /**
         * 根据输入的关键词，模糊搜索列表
         * @param keyWord
         */
        function onSearch (keyWord) {
            var ul = that.el.querySelector(".m-list");
            if( !$.trim(keyWord) ) {    // 搜索为空
                $(ul).find("li").show();
                return;
            }

            var result = [];
            for(var i= 0 , len = that.data.length ; i < len ; i++) {
                var value = that.data[i].title;
                if(value.indexOf(keyWord) != -1) {
                    result.push(i);
                }
            }

            if(result.length > 0) {
                $(ul).find("li").each(function (index) {
                    if(result.indexOf(index) == -1) {
                        $(this).hide();
                    }
                })
            }
        }

        /**
         * 特殊需要，保存点击事件
         * @param e
         */
        function setEvent (e) {
            that.e = e ;
        }

        /**
         * 获取event
         * @returns {*}
         */
        function getEvent () {
            return that.e ;
        }

        /**
         * 显示
         */
        function show () {
            $(that.el).removeClass('hide');
        }

        /**
         * 隐藏
         */
        function hide () {
            $(that.el).addClass('hide');
            cancelSelected();
        }

        /**
         * 判断是否是隐藏
         * @returns {*|jQuery}
         */
        function isHide () {
            return $(that.el).hasClass('hide') ;
        }

        /**
         * 勾选已经被选中的项
         * @param list
         */
        function setSelected (list) {
            if(list && list.length > 0) {
                var iArrays = $(that.el).find("i");
                that.data.forEach(function (item , index) {
                    var obj = list.find(function (currValue) {
                        return item.title == currValue.title ;
                    });
                    if(obj) {
                        $(iArrays[index]).addClass("selected");
                        if(obj.bg == 1) {
                            $(iArrays[index]).parent().addClass("sk-disable");
                        }
                    }
                })
            }
        };
        /**
         * 取消所有被选中的项
         */
        function cancelSelected () {
            var selected = $(that.el).find("li i.selected");
            if(selected && selected.length > 0) {
                selected.each(function() {
                    $(this).removeClass("selected");
                    $(this).parent().removeClass("sk-disable");
                })
            }
        }

        return {
            target:that.el,
            setEvent:setEvent,
            getEvent:getEvent,
            showDialog:show,
            hideDialog:hide,
            isHide:isHide,
            setSelected:setSelected
        }
    };

    if(typeof window.Multiple === 'undefined') {
        window.Multiple = Multiple ;
    }

})(window);