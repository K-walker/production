var express = require("express");
var app = express();
app.use(express.static("static"));

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(8888);

var id = 1 ;     // 接入的用户ID，每次累加
var online = 0 ; // 当前在线人数

app.get("/" , function (req , res) {
	res.sendFile(__dirname + "/login.html")
})

app.get("/chat" , function (req , res) {
	if(req.query.uname === undefined) {
		res.send("请先<a href='http://localhost:8888'>登陆</a>");
		return ;
	}
	res.cookie("u"+id, req.query.uname);
	res.sendFile(__dirname + "/chat.html");
}) 

// 添加一个命名空间
io.of("/chat").on("connection" , function (socket) {
	console.log("socket connect");
	io.of("/chat").emit("online" , ++online);
	socket.emit("setId" , {id:id++});

	socket.on("onClientSend" , function (data) {
		io.of("/chat").emit("onServerSend" , data);
	})

	socket.on("disconnect" , function (data) {
		console.log("socket disconnect");
		io.of("/chat").emit("online" , --online);
	})

})

console.log("start server listen port on 8888");