var http = require('http');
var caculator = require('./caculator.js');

var a=10, b=2;
var tong,hieu,tich;
tong = caculator.cong(a,b);
hieu = caculator.tru(a,b);
tich = caculator.nhan(a,b);

console.log("Tong la: " + tong);
console.log("Hieu la: " + hieu);
console.log("Tich la: " + tich);

http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write("Tong la: " + tong);
    res.write("Hieu la: " + hieu);
    res.write("Tich la: " + tich);
    res.end("Tran Van Duc _ PS10722");
}).listen(1996);

