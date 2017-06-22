/**
 * Created by 004928 on 2017/6/20.
 */
(function (window) {
    /**
     *
     * @param option :
     *  id:下拉框的id
     *  key:列表展示的文本字段
     *  kScrollbar:是否显示自定义滚动条
     *  data:列表数据源
     *  onItemSelect:item点击回调
     * @constructor
     */
    var DropDownDialog  = function (option) {
        option.key = option.key || 'text' ;
        option.kScrollbar = option.kScrollbar || false ;
        var option = option ;
        if(!option.id)  throw "请给下拉框dom设置id";
        var $el = $(option.id);
        var mScrollBar ;

        initElement();
        initData(option.data);
        bindEvent();
        /**
         * 初始化dom元素
         */
        function initElement () {
            var $input = $("<input type='text' class='drop-input' readonly>");
            var $i = $("<i class='arrow-box arrow-bottom'></i>");
            $el.append($input);
            $el.append($i);
        }

        /**
         * 初始化数据
         * @param list
         */
        function initData(list) {
            if(list && list.length > 0) {
                if(typeof list[0] === 'object') {
                    createListInObject(list);
                } else if(typeof list[0] === 'string' || typeof list[0] === 'number' || typeof list[0] === 'boolean') {
                    createListInArray(list);
                }
            }
        }

        /**
         * 设置自定义滚动条
         */
        function setCustormScrollBar () {
            mScrollBar = new window.KScrollBar({
                root:option.id,
                scrollOffset:12
            });
        }
        /**
         * 创建列表项 by Object
         * @param list
         */
        function createListInObject (list) {
            var liStr = "";
            list.forEach(function (obj , index) {
                for(var k in obj) {
                    if(k === option.key) {
                        liStr += "<li><span data-key='"+k+"' data-index='"+index+"'>"+obj[k]+"</span></li>";
                        return ;
                    }
                }
            });
            createList(liStr);
        }
        /**
         * 创建列表项 by Array
         * @param list
         */
        function createListInArray (list) {
            var liStr = "";
            list.forEach(function (item , index) {
                liStr += "<li><span data-key='"+item+"' data-index='"+index+"'>"+item+"</span></li>";
            });
            createList(liStr);
        }

        /**
         * 构建列表，并添加到目标父元素中
         * @param liStr
         */
        function createList (liStr) {
            var $ul = $("<ul></ul>");
            $ul.html(liStr);
            var $div = $("<div class='drop-down-list hide'></div>");
            $div.append($ul);
            $el.append($div);
        }

        /**
         * 绑定事件
         */
        function bindEvent () {
            $el.find('input').click(onDropdownClickEvent);
            $el.find('i').click(onDropdownClickEvent);
            $el.find('ul li').click(onItemSelectEvent);
            $(document).click(onOutsideClickEvent);
        }

        /**
         * 响应下拉框显示/隐藏事件
         */
        function onDropdownClickEvent (e) {
            e.preventDefault();
            e.stopPropagation();

            if(isHide()) {
                $(".k-drop-down .drop-down-list").not('hide').addClass('hide');
                show();
            } else {
                hide();
            }
        }

        /**
         *  item选择事件
         */
        function onItemSelectEvent (e) {
            var $span = $(e.target).find('span') ;
            var $input = $el.find('input');
            $input.attr('data-key' , $span.attr('data-key'));
            $input.attr('data-index' , $span.attr('data-index'));
            $input.val($span.text());
            if(option.onItemSelect) {
                option.onItemSelect($span.text() , $span.attr('data-index'));
            }
        }

        /**
         * 点击外部，关闭下拉框
         */
        function onOutsideClickEvent () {
            if( !isHide()) {
                hide();
            }
        }

        /**
         * 显示下拉框
         */
        function show () {
            $el.find('.drop-down-list').removeClass('hide');
            // 显示自定义滚动条
            if(option.kScrollbar && !mScrollBar) {setCustormScrollBar()};

            var divH = $el.find('.drop-down-list').height();
            var ulH = $el.find('ul').height();
            if(ulH <= divH) $el.find('.drop-down-list').height(ulH);
        }

        /**
         * 隐藏下拉弹框
         */
        function hide () {
            $el.find('.drop-down-list').addClass('hide');
        }

        /**
         * 判断是否是隐藏的
         * @returns
         */
        function isHide () {
            return $el.find('.drop-down-list').hasClass('hide');
        }
    }

    if(typeof window.DropDownDialog === 'undefined') {
        window.DropDownDialog = DropDownDialog ;
    }

})(window);