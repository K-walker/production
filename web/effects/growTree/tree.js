/**
 * Created by 004928 on 2017/8/2.
 */
(function (window) {

    var w = window.innerWidth , h = window.innerHeight ;
    var ctx = null ;
    var treeNum = 3 ;
    var initRadius = 25 ;     // 树干的初始宽度
    var maxGeneration = 5 ;   // 最多分支的次数
    var branchArray = null ;  // 树干的集合
    var flowers = [];         // 花的集合

    window.MyRequestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ;

    window.MyCancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ;

    /**
     * 初始化canvas
     */
    function initCanvas () {
        var canvas = document.getElementById("myCanvas");
        canvas.setAttribute('width' , w);
        canvas.setAttribute('height' , h);
        if(canvas.getContext) {
            ctx = canvas.getContext('2d');
            initTree();
            loop();
        }
    }

    /**
     * 初始化树的数量
     */
    function initTree () {
        branchArray = new BranchArray ();
        for(var i = 0 ; i < treeNum ; i++) {
            branchArray.add(new Branch(w / 2 , h));
        }
    }

    /**
     * 树干
     * @param x
     * @param y
     * @constructor
     */
    function Branch (x , y) {
        this.x = x ;
        this.y = y ;
        this.radius = initRadius ;
        this.angle = Math.PI / 2 ; // 树枝的初始角度
        this.speed = 2.35 ;    // 数生长的速度
        this.generation = 1 ;
    }

    /**
     * 生长
     */
    Branch.prototype.grow = function () {
        this.draw();
        this.update();
    }

    Branch.prototype.draw = function () {
        ctx.fillStyle = '#55220F';
        ctx.beginPath();
        ctx.arc(this.x , this.y , this.radius , 0 , 2 * Math.PI);
        ctx.fill();
    }

    /**
     * 更改数的高度以及扭曲度
     */
    Branch.prototype.update = function () {

        // 计算树干每次的扭曲角度，因为树一般不是笔直生长的，都会有不规则的扭曲
        this.angle += random( -0.1 * this.generation / 2 , 0.1 * this.generation / 2 );

        var vx = this.speed * Math.cos(this.angle);
        // 因为初始角度设置为Math.PI , 所以vy要取负数
        var vy = - this.speed * Math.sin(this.angle);

        if(this.radius < 0.99 || this.generation > maxGeneration) {
            branchArray.remove(this);
        }

        this.x += vx ;
        this.y += vy ;

        this.radius *= 0.99 ;

        if(this.radius >= 0.9) {
            // 计算当前是第几代分支
            var g = (maxGeneration - 1) * initRadius / (initRadius - 1) / this.radius + (initRadius - maxGeneration) / (initRadius - 1) ;
            if( g > this.generation + 1) {
                this.generation = Math.floor(g) ;
                // 随机创建分支
                for(var i = 0 ; i < random(1,3) ; i++) {
                    this.clone(this);
                }
            }
        }

    }

    /**
     * 创建分支
     * @param b
     */
    Branch.prototype.clone = function (b) {
        var obj = new Branch(b.x , b.y);
        obj.angle = b.angle ;
        obj.radius = b.radius ;
        obj.speed = b.speed;
        obj.generation = b.generation;
        branchArray.add(obj);
        // 如果当前分支次数大于3则创建花，这样可以让花在树的顶端显示
        if( b.generation > 3 ) {
            flowers.push(new Flower(b.x , b.y));
        }
    }

    function BranchArray () {
        this.branchs = [];
    }

    /**
     * 添加树干到集合中
     * @param b
     */
    BranchArray.prototype.add = function (b) {
        this.branchs.push(b);
    }
    /**
     * 从集合中移除树干
     * @param b
     */
    BranchArray.prototype.remove = function (b) {
        if( this.branchs.length > 0) {
            var index = this.branchs.findIndex(function (item) {
                return b === item ;
            })
            if(index != -1) {
                this.branchs.splice(index , 1);
            }
        }
    }

    /**
     * 花
     * @param x
     * @param y
     * @constructor
     */
    function Flower (x , y) {
        this.x = x ;
        this.y = y ;
        this.r = 1 ;       // 花瓣的半径
        this.petals = 5 ;  // 花瓣数量
        this.speed = 1.0235 ;// 花的绽放速度
        this.maxR = random(3 , 7); // 花的大小
    }

    /**
     * 花朵开放（通过改变花的半径实现开放的效果）
     * @param index
     */
    Flower.prototype.update = function (index) {
        if(this.r == this.maxR) {
            flowers.splice(index , 1);
            return ;
        }
        this.r *= this.speed ;
        if(this.r > this.maxR) this.r = this.maxR ;
    }

    /**
     * 绘制花朵
     */
    Flower.prototype.draw = function () {
        ctx.fillStyle = "#F3097B" ;
        for(var i = 1 ; i <= this.petals ; i++) {
            var x0 = this.x + this.r * Math.cos( Math.PI / 180  * (360 / this.petals) * i) ;
            var y0 = this.y + this.r * Math.sin( Math.PI / 180  * (360 / this.petals) * i) ;
            ctx.beginPath();
            ctx.arc(x0 , y0 , this.r , 0  , 2 * Math.PI) ;
            ctx.fill();
        }
        ctx.fillStyle = "#F56BC1";
        ctx.beginPath();
        ctx.arc(this.x  , this.y  , this.r / 2 , 0  , 2 * Math.PI) ;
        ctx.fill();
    }

    function random (min , max) {
        return Math.random() * (max - min) + min ;
    }

    /**
     * 循环遍历所有树干和花，并调用更新和draw方法，实现动画效果
     */
    function loop () {
        for(var i = 0 ; i < branchArray.branchs.length ; i ++) {
            var b = branchArray.branchs[i];
            b.grow();
        }
        var len = flowers.length ;
        while (len --) {
            flowers[len].draw();
            flowers[len].update();
        }
        MyRequestAnimationFrame(loop);
    }

    window.onload = initCanvas;

})(window)