var express = require("express");
var app = express();

var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 设置静态文件路径  http://localhost:8888/images/web.png
app.use(express.static("static"))


app.get("/" , function (req , res) {
	console.log(req.params.id)
	res.sendFile(__dirname + "/" + "index.html")
})

// POST请求需要添加 urlencodedParser
app.post("/user" , urlencodedParser , function (req , res) {
	var result = {
		account:req.body.uname,
		passwd:req.body.upasswd
	}
	res.send(JSON.stringify(result));
})

app.get("/list/:id" , function (req , res) {
	res.end(req.params.id);
})


app.listen(8888 , function () {
	console.log("start node server");
})	