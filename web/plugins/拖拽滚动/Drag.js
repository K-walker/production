/**
 * Created by 004928 on 2017/4/19.
 */

var Drag = function (domId , callback) {
    this.domId = domId ;
    this.dragWrap = $(this.domId);
    this.init.apply(this,arguments);
    this.onMoveCallbacl = callback ;
};

Drag.prototype = {
    constructor:Drag,
    _dom : {},
    _x : 0,
    _y : 0,
    _top :0,
    _left: 0,
    move : false,
    down : false,
    isDrag : false ,
    index:0 ,
    isEnable:true,
    firstX:0,
    init : function () {
        this.bindEvent();
    },
    bindEvent : function () {
        var t = this;
        $('body').on('mousedown', this.domId ,function(e){
            e && e.preventDefault();
            if ( !t.move) {
                t.mouseDown(e);
            }
        });
        $('body').on('mouseup', this.domId ,function(e){
            t.mouseUp(e);
        });

        $('body').on('mousemove', this.domId ,function(e){
            if (t.down) {
                t.mouseMove(e);
            }
        });
    },
    mouseDown : function (e) {
        if(this.isEnable) {
            this.firstX = e.pageX ;
            this.isDrag = false ;
            this.move = false;
            this.down = true;
            this._x = e.clientX;
            this._y = e.clientY;
            this._top = $(this.domId)[this.index].scrollTop;
            this._left = $(this.domId)[this.index].scrollLeft;
            this.dragWrap.css('cursor','move');
        }
    },
    mouseMove : function (e) {
        if(this.isEnable) {
            e && e.preventDefault();
            this.move = true;
            this.isDrag = true ;
            var x = this._x - e.clientX,
                y = this._y - e.clientY,
                dom = $(this.domId)[this.index];
            dom.scrollLeft = (this._left + x);
            dom.scrollTop = (this._top + y);

            if(this.onMoveCallbacl) {
                this.onMoveCallbacl(this._top + y);
            }
        }
    },
    mouseUp : function (e) {
        if(this.isEnable) {
            e && e.preventDefault();
            // 判断当前是否是拖拽
            if(this.firstX == e.pageX) {
                this.isDrag = false ;
            }
            this.move = false;
            this.down = false;
            this.dragWrap.css('cursor','');
        }
    },
    /**
     * 设置 禁用/启动 拖拽
     * @param isEnable
     */
    setEnable:function (isEnable) {
        this.isEnable = isEnable ;
    },
    /**
     * 如果当前可拖拽的dom有多个，则使用此参数指定对应的dom
     * @param index
     */
    setIndex:function (index) {
        this.index = index ;
        this.onMoveCallbacl($(this.domId)[this.index].scrollTop);
    }
};
