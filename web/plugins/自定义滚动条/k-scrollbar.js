/**
 * Created by 004928 on 2017/6/21.
 */

(function (window) {
    /**
     * 自定义滚动条
     * @param option
     *  root: drop-down-list 类的id
     *  scrollOffset: 滚轮每次滚动的偏移量
     * @constructor
     */
    var KScrollBar = function (option) {
        if(!option.root) throw "请给drop-down-list类设置一个唯一id";
        if(typeof window._Wheel === 'undefined') throw "请先引入mousewheel.js"

        var $root = $(option.root);
        var down = false ;
        /**按下时的 Y坐标*/
        var downY = 0 ;
        /**滚动内容的高度*/
        var scrollHeight = 0 ;
        /**内容可见高度*/
        var height = 0 ;
        /** 滑块高度 */
        var slideBlockHeight = 0 ;
        /**内容滚动的距离与滑块滚动的距离的比例*/
        var scale = 1 ;
        /** 是否可以滚动 */
        var isScroll = false ;
        /** 滚轮每次滚动的距离 */
        var weelL = -option.scrollOffset || -10 ;

        createScrollBar();
        initData();
        bindEvent();
        /**
         * 创建滚动条
         */
        function createScrollBar () {
             $root.find('.drop-down-list').css('overflow-y','hidden');
             var $scrollBarBox = $("<div></div>");
             $scrollBarBox.addClass('k-scroll-bar-box hide');
             var $scrollBar = $("<div></div>");
             $scrollBar.addClass("k-scroll-bar");
             $scrollBarBox.append($scrollBar);
             $root.find('.drop-down-list').append($scrollBarBox);
        }
        /**
         * 初始化数据
         */
        function initData () {
            scrollHeight = $root.find('ul')[0].scrollHeight ;
            height = $root.find('.drop-down-list').height() ;
            // 如果滚动高度小于可见高度，重置可见高度
            if(scrollHeight <= height) {
                $root.find('.drop-down-list').height(scrollHeight);
                return ;
            }
            // 计算滑块的高度
            slideBlockHeight = height * height / scrollHeight ;
            // 如果滑块等于可见高度，说明内容无需滚动
            isScroll = slideBlockHeight != height ;
            if(isScroll) {
                // 如果当前内容可滚动，则计算比例，设置滑块高度，并显示滚动条
                scale = (scrollHeight - height) / (height - slideBlockHeight) ;
                $root.find('.k-scroll-bar').height(slideBlockHeight);
                $root.find('.k-scroll-bar-box').removeClass('hide');
                down = true ;
            }
        }

        /**
         * 绑定事件
         */
        function bindEvent () {
            $root.find(".k-scroll-bar").on('mouseover' , onMouseOver);
            $root.find(".k-scroll-bar").on('mousedown' , onMouseDown);
            $root.find(".k-scroll-bar").on('mousemove' , onMouseMove);
            $root.find(".k-scroll-bar").on('mouseup' , onMouseUp);
            $root.find(".k-scroll-bar").on('mouseout' , onMouseOut);
            $root.find(".k-scroll-bar").on('click' , onScrollBarClick);

            $root.find('ul').on('mouseenter' , onMouseEnter);
            $root.find('ul').on('mouseleave' , onMouseLeave);
        }

        /**
         * 响应滚动条的点击事件，并拦截
         * @param e
         */
        function onScrollBarClick (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        /**
         * 鼠标进入滑块
         */
        function onMouseOver (e) {
            down = false ;
        }

        /**
         * 鼠标按下滑块
         */
        function onMouseDown (e) {
            down = true ;
            downY = e.clientY ;
            $(e.target).css('cursor','default');
        }

        /**
         * 鼠标移动滑块
         */
        function onMouseMove (e) {
            if(down && isScroll) {
                var scrollBarTop = parseInt($(e.target).css('top')) ;
                var _y = e.clientY - downY ;
                scrollBarTop = scrollBarTop + _y;
                setScrollBarTop(scrollBarTop);
                downY = e.clientY ;
            }
        }

        /**
         * 鼠标抬起
         */
        function onMouseUp (e) {
            down = false ;
            $(e.target).css('cursor','');
        }

        /**
         * 鼠标移出滑块区域
         */
        function onMouseOut (e) {
            down = false ;
        }

        /**
         * 设置滚动条位置
         */
        function setScrollBarTop (scrollBarTop) {
            // 处理滑块可移动的区域 0 和 height - slideBlockHeight 之间的区域
            // 临界点出重置
            if(scrollBarTop < 0) scrollBarTop = 0 ;
            if(scrollBarTop > height - slideBlockHeight) {
                scrollBarTop = height - slideBlockHeight ;
            }
            $root.find('.k-scroll-bar').css({top:scrollBarTop + 'px'});
            setContentScrollTop(scrollBarTop);
        }

        /**
         * 设置内容滚动位置
         */
        function setContentScrollTop (scrollBarTop) {
            var contentTop = parseFloat($root.find('ul').css('top')) ;
            // 内容滚动区域在 -(scrollHeight - height) 和 0 之间
            // 通过滑块滚动的距离*比例关系，计算内容需要滚动的距离
            contentTop = -scrollBarTop * scale;
            if(contentTop <= 0 && contentTop >= -(scrollHeight - height)) {
                $root.find('ul').css({top:contentTop + 'px'});
            }
        }

        /**
         * 鼠标进入时，注册滚轮事件
         */
        function onMouseEnter (e) {
            e = e || window.event ;
            e.preventDefault();
            e.stopPropagation();
            if(isScroll) {
                window._Wheel.registerWheelEvent(onContentScrollEvent);
            }
        }

        /**
         * 鼠标离开时，移除滚轮事件
         */
        function onMouseLeave (e) {
            e = e || window.event ;
            e.preventDefault();
            e.stopPropagation();
            if(isScroll) {
                window._Wheel.unregisterWheelEvent(onContentScrollEvent);
            }
        }

        /**
         * 响应内容滚动
         * @param e
         */
        function onContentScrollEvent (e) {
            e = e || window.event ;
            var direct = e.wheelDelta / 120 || e.detail / 120;
            // 获取滚动条的位置
            var scrollBarTop = parseInt($root.find('.k-scroll-bar').css('top')) ;
            setScrollBarTop(scrollBarTop + direct * weelL);
        }
    }

    if(typeof window.KScrollBar === 'undefined') window.KScrollBar = KScrollBar ;

})(window)