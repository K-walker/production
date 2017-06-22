/**
 * Created by 004928 on 2017/5/5.
 */

(function (window) {

    var Slider = function (domId , callback) {
        var that = this ;
        this.domId = domId ;
        this.target = $(domId);
        this.down = false ;
        this.downX = 0 ;
        this.upX  = 0 ;
        this.move = false ;
        this.left = 0 ;
        this.pageWidth = 0;
        this.pageNum = 0 ;
        this.offset = 0 ;
        this.slider = false ; // 是否在滑动
        this.onScroll = callback || function (index) {};
        init.apply(this , arguments);

        function init () {
            this.pageWidth = this.target.width();
            this.pageNum = 4;  // 后期动态计算页面数量
            this.offset = this.pageWidth / 5 ; // 设置滑动偏移量
            bindTouchEvent.apply(this , arguments);
        }

        function bindTouchEvent () {
            this.target.on("touchstart" , onTouchStart);
            this.target.on("touchmove" , onTouchMove);
            this.target.on("touchend" , onTouchEnd);
        }

        /**
         * 手指触摸到页面时的回调
         */
        function onTouchStart (e) {
            that.down = true ;
            that.isSlider = false ;
            that.slider = false ;
            that.downX = that.upX = e.touches[0].clientX;
            that.left = that.target.scrollLeft();
        }
        /**
         * 手指按住页面滑动的时候回调
         */
        function onTouchMove (e) {
            that.move = true ;
            that.slider = true ;
            that.upX = e.touches[0].clientX ;
            var moveX = that.downX  - that.upX;

            // 处理边界不可滑动的情况
            // 1.轮播图显示第一张时，不可向右滑动
            // 2.轮播图显示最后一张时，不可向左滑动
            // 向右滑
            if(moveX <= 0 && that.target.scrollLeft() <= 0 ) {
                that.move = false ;
                return false ;
            }
            // 向左滑
            if(moveX > 0 && that.target.scrollLeft() >= (that.pageNum - 1) * that.pageWidth) {
                that.move = false ;
                return false ;
            }
            that.target.scrollLeft(that.left + moveX) ;
        }
        /**
         * 手指离开页面时的回调
         */
        function onTouchEnd (e) {
            that.down = false ;
            if(!that.move) { return true ;}
            if(that.upX == that.downX) return true ;
            // 如果滑动了轮播图的一半，放开后，自动划过这一页,否则回退到之前页面
            var moveX = that.downX - that.upX;
            autoScroll(moveX);
            return true ;
        }

        /**
         * 页面根据滑动距离，自己判断向哪边滚动
         * 拖动距离大于页面宽度的1/3则自动向划过这一页。否则复位到原来位置
         * @param moveX
         */
        function autoScroll (moveX) {
            that.left = that.target.scrollLeft();
            if(moveX >= 0) { // 向左滑
                if(moveX >= that.offset) {
                    scrollAnimation(that.left + that.pageWidth - moveX);
                } else {
                    scrollAnimation(that.left - moveX);
                }
            } else { // 向右滑
                if(Math.abs(moveX) >= that.offset) {
                    scrollAnimation(that.left - that.pageWidth + Math.abs(moveX));
                } else {
                    scrollAnimation(that.left + Math.abs(moveX));
                }
            }
        }

        /**
         * 页面滑动的动画
         * @param left
         */
        function scrollAnimation (left) {
            that.target.animate({scrollLeft:left+1} , 300 , function () {
                that.onScroll(that.target.scrollLeft() / that.pageWidth);
            })
        }

        return {
            isSlider:that.slider
        }
    }

    if(typeof window.Slider === "undefined") {
        window.Slider = Slider ;
    }
})(window);
