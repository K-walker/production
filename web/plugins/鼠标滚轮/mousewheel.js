/**
 * Created by 004928 on 2017/4/27.
 * 注册/注销 鼠标滚轮事件
 */
(function(window){

    var _document = window.document ;

    var Wheel = function () {
        return {
            registerWheelEvent:function (func) {
                if (_document.attachEvent) {   // IE兼容
                    _document.attachEvent("onmousewheel", func);
                } else { // Safari 和 Chrome 兼容
                    _document.onmousewheel = func ;
                }
            },
            unregisterWheelEvent:function (func) {
                if(_document.attachEvent) {
                    _document.detachEvent("onmousewheel" , func)
                } else  {
                    _document.onmousewheel = null ;
                }
            }
        }
    }

    window._Wheel = new Wheel() ;

})(window);