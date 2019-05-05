var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('含查询字符串的路径\n' + pathWithQuery)


  if (path == '/style.css') {
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write('body{background-color: #ddd}h1{color:blue}')
    response.end()
  } else if (path == '/main.js') {
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write('alert("此处是JS执行的命令")')
    response.end()
  } else if (path === '/') {
    //读取html文件，获取db中数据，替换数据，将替换数据的html重新渲染页面，这里的amount是db中的数据
    var string = fs.readFileSync('./index.html','utf8')
    var amount = fs.readFileSync('./db','utf8')
    string = string.replace('&&&amount&&&',amount)
    response.setHeader('Content-Type','text/html;charset=utf-8')
    response.write(string)//注意写入页面使用write
    response.end()
  }else if(path === '/pay'){
  //进入pay路径,获取amount，然后给amount-1，写入db
  var amount = fs.readFileSync('db','utf8')
  var newAmount = amount - 1
  fs.writeFileSync('./db',newAmount)
  response.setHeader('Content-Type','application/javascript')
  response.statusCode = 200
  let callbackName = query.callback
  //jack.com的服务器返回一个数据，调用frank.com的函数
  response.write(`
  ${callbackName}.call(undefined,'success')
  `)

  response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('error')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)


