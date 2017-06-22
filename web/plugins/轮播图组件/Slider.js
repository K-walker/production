/**
 * Created by 004928 on 2017/5/4.
 */

var Carousel = function (domId , callback) {
    this.domId = domId;
    this.target =  $(this.domId);
    this.init.apply(this , arguments);
    this.onScroll = callback || function (index) {}; // 滚动完成后的回调
}

Carousel.prototype = {
    constructor:Carousel,
    down:false,
    move:false,
    _downX:0 ,
    _left:0 ,
    index:0,
    isSlider:false,     // 判断是否在滑动
    firstX:0,
    direction: 120 ,  // 滑动的方向 正数 向左 负数向右
    _pageWidth:0,     // 每页的宽度
    init:function () {
        this._pageWidth = this.target.width();
        this.bindEvent();
    },
    bindEvent:function () {
        var that = this ;
        $('body').on('mousedown', this.domId , function(e){
            if(!that.down) {
                that.mouseDown(e);
            }
        });
        $('body').on('mousemove', this.domId , function(e){
            if(that.down) {
                that.mouseMove(e);
            }
        });

        $('body').on('mouseup', this.domId , function(e) {
            if(that.down) {
                that.mouseUp(e);
            }
        });
        $('body').on('mouseout', this.domId , function(e){
            if(that.down) {
                that.mouseOut(e);
            }
        });
    },
    mouseDown:function (e) {
        this.down = true ;
        this.isSlider = false ;
        this._downX = e.clientX;
        this._left = this.target.scrollLeft();
        this.target.css('cursor','move');
    },
    mouseMove:function (e) {
        this.move = true ;
        this.isSlider = true ;
        var moveX = this._downX  - e.clientX;
        this.direction = moveX ;
        // 处理边界不可滑动的情况
        // 1.轮播图显示第一张时，不可向右滑动
        // 2.轮播图显示最后一张时，不可向左滑动
        // 向右滑
        if(moveX <= 0 && this.target.scrollLeft() <= 0 ) {
            this.move = false ;
            return false ;
        }
        // 向左滑
        if(moveX > 0 && this.target.scrollLeft() >= (4 - 1) * this._pageWidth) {
            this.move = false ;
            return false ;
        }
        this.target.scrollLeft(this._left + moveX);
        this.target.css('cursor','move');
    },

    mouseUp:function (e) {
        this.down = false ;
        if(!this.move) { return true ;}
        // 如果滑动了轮播图的一半，放开后，自动划过这一页,否则回退到之前页面
        var moveX = this._downX - e.clientX;
        this.autoScroll(moveX);
        this.target.css('cursor','');
        return true ;
    },

    mouseOut:function (e) {
        this.down = false ;
        this.move = false ;
        this.isSlider = false ;
        var moveX = this.target.scrollLeft() % this._pageWidth ;
        moveX =  this.direction > 0 ? moveX : moveX - this._pageWidth ;
        this.autoScroll(moveX);
        this.target.css('cursor','');
        return true ;
    },

    scrollAnimation:function (left) {
        var that = this ;
        this.target.animate({scrollLeft:left} , 300 , function () {
            that.onScroll(that.target.scrollLeft() / that._pageWidth);
        })
    },
    /**
     * 页面根据滑动距离，自己判断向哪边滚动
     * 拖动距离大于页面宽度的1/3则自动向划过这一页。否则复位到原来位置
     * @param moveX
     */
    autoScroll :function (moveX) {
        this._left = this.target.scrollLeft();
        if(moveX >= 0) { // 向左滑
            if(moveX >= this._pageWidth / 3) {
                this.scrollAnimation(this._left + this._pageWidth - moveX);
            } else {
                this.scrollAnimation(this._left - moveX);
            }
        } else { // 向右滑
            if(Math.abs(moveX) >= this._pageWidth / 3) {
                this.scrollAnimation(this._left - this._pageWidth + Math.abs(moveX));
            } else {
                this.scrollAnimation(this._left + Math.abs(moveX));
            }
        }
    }
}
