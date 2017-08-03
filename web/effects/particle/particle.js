/**
 * Created by 004928 on 2017/8/2.
 */

(function (window) {
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ;

    window.cancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ;


    var w , h ;			             // 画布宽高
    var particles = [];              // 粒子集合
    var temp = [];
    var points = [];                 // 每个粒子坐标对象的集合
    var delayTime = 2000 ;           // 位移动画执行的延迟时间
    var maxRadius = 7 ;              // 粒子圆的最大半径
    var animationIncrement = 0.08 ;  // 粒子缩放时的增减量
    var offsetY = 7 , offsetX = 7 ;  // x , y 轴每隔7个像素点取值
    var speed = 20 ;                 // 粒子运动速度

    // 粒子颜色库
    var colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
        '#FF5722'
    ];
    var down  = false , move = false  ;

    var requestId , timeId;
    var canvas = null ;
    var ctx = null ;

    /**
     * 初始化canvas
     */
    function initCanvas() {
        canvas = document.getElementById("myCanvas");
        w = window.innerWidth ;
        h = window.innerHeight ;
        canvas.setAttribute('width',  w);
        canvas.setAttribute('height', h);
        if(canvas.getContext) {
            ctx = canvas.getContext('2d');
            bindEvent();
        }
    }

    /**
     * cnavas 绑定事件
     */
    function bindEvent() {
        canvas.addEventListener('mousedown' , function (e) {
            down = true ;
            stopAnimation();
        });

        canvas.addEventListener('mousemove' , function (e) {
            if(down) {
                move = true ;
                drawPath({
                    x:e.offsetX ,
                    y:e.offsetY
                });
            }
        });

        canvas.addEventListener('mouseup' , function (e) {
            down = false ;
            if(move) {
                throttle(graffiti , window);
            }
            move = false ;
        });
    }

    /**
     * 涂鸦
     */
    function graffiti () {
        initParticle();
        randomDraw();
        start();
        points = [] ;
    }

    /**
     * 节流函数
     */
    function throttle (method , context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
            method.call(context);
        } , delayTime);
    }

    /**
     * 绘制路径
     */
    function drawPath (point) {
        points.push(point);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(point.x , point.y , Math.floor(Math.random() * maxRadius + 1) , 0 , 2 * Math.PI);
        ctx.fill();
    }

    /**
     * 初始化粒子个数
     */
    function initParticle () {
        particles  = [] ;
        temp = [] ;
        // 拿到画布的所有像素点信息
        // 每个像素点包含了rgba 四个值，
        // 而这个pxData是一个一维数组,每4位保存一个像素点信息
        var pxData = ctx.getImageData(0 , 0 , w , h);
        // 将4位表示的像素点信息，转化为1位来表示，
        // 即数组中的每个元素表示一个像素
        var buffer32 = new Uint32Array(pxData.data.buffer);

        // 找到数组中有像素信息的点，并创建粒子
        // 因为数组是一维数组，j * w + i 计算当前遍历的数组下标
        for(var j = 0 ; j < h ; j += offsetY) {
            for(var i = 0 ; i < w ; i += offsetX) {
                if(buffer32[ j * w + i]) {
                    particles.push(new Particles(i , j , colors[i % colors.length]));
                    // 在移动粒子的时候需要用到
                    temp.push(new Particles(0 , 0 , colors[i % colors.length]));
                }
            }
        }
    }


    /**
     * 首先随机绘制在屏幕上
     */
    function randomDraw () {
        ctx.clearRect( 0 , 0 , w , h);
        for(var l = 0 ; l < temp.length ; l ++) {
            var p = temp[l];
            setRadius(p);
            if(p.x == 0) p.x = randomInteger(w);
            if(p.y == 0) p.y = randomInteger(h);
            draw(p);
        }
        requestId = requestAnimationFrame(randomDraw);
    }

    /**
     * 随机产生 1 - max 之间的整数
     * @param max
     * @returns {number}
     */
    function randomInteger (max) {
        return Math.floor(Math.random() * max + 1);
    }

    /**
     * 粒子对象
     */
    function Particles (x , y , color) {
        this.x = x ;
        this.y = y ;
        this.color = color ;   // 粒子颜色
        this.r = Math.floor(Math.random() * maxRadius + 1); // 随机产生粒子的半径 1 - 5
        this.zoom =  Math.floor(Math.random() * 2) == 0 ? -1 : 1  ; // 0 表示缩小，1表示放大
    }

    /**
     * 循环执行动画
     */
    function loop () {
        ctx.clearRect( 0 , 0 , w , h);
        for(var l = 0 ; l < particles.length ; l ++) {
            var p = particles[l];
            var t = temp[l];
            calcPosition(p , t);
            setRadius(t);
            draw(t);
        }
        requestId = requestAnimationFrame(loop);
    }

    /**
     * 2s 之后 聚合成要显示的文本样式
     */
    function start () {
        timeId = setTimeout(function () {
            cancelRequestAnimationFrame(requestId);
            loop();
        } , delayTime);
    }

    /**
     * 设置粒子的半径（递增/递减）
     */
    function setRadius (p) {
        if(p.zoom > 0) {
            p.r += animationIncrement ;
            if(p.r >= maxRadius ) p.zoom = -1 ;
        } else {
            p.r -= animationIncrement ;
            if(p.r <= 1) p.zoom = 1 ;
        }
    }

    /**
     * 计算粒子的位置
     */
    function calcPosition (p , t) {

        var vx = ( p.x - t.x ) / speed ;
        var vy = ( p.y - t.y ) / speed ;

        t.x += vx ;
        t.y +=  vy ;

        if(vx > 0) {
            if(t.x >= p.x )  t.x = p.x ;
        } else {
            if(t.x <= p.x )  t.x = p.x ;
        }

        if(vy > 0) {
            if(t.y >= p.y )  t.y = p.y ;
        } else {
            if(t.y <= p.y )  t.y = p.y ;
        }

    }

    /**
     * 绘制粒子
     * @param t
     */
    function draw (t) {
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x  , t.y , t.r , 0 , 2 * Math.PI);
        ctx.fill();
    }

    /**
     * 停止动画
     */
    function stopAnimation () {
        if(requestId || timeId) {
            cancelRequestAnimationFrame(requestId);
            clearTimeout(timeId);
            requestId = timeId = null ;
            ctx.clearRect(0 , 0 , w, h);
        }
    }

    window.onload = initCanvas ;

})(window);
