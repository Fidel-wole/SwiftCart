const fs = require('fs');
function requestHandler(req, res){
    const url = req.url;
    const method = req.method;
     if(url === '/'){
        res.write('<html>');
        res.write('<head><title>My node project</title></head>');
        res.write('<body>');
        res.write('<form action ="/message" method= "POST">');
        res.write('<input type="text" name = "message"><br>');
        res.write('<button>Submit</button>')
        res.write('</form>');
        res.write('</body');
        res.write('</html>');
       return res.end();
     }
    if(url === '/message' && method === 'POST' ){
        const body = [];
        req.on('data', (chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
       return req.on('end', ()=>{
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, (err)=>{
            res.statusCode = 302;
            res.setHeader('Location', '/')
            return res.end();
            });
  
        })
       
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My node project</title></head>');
    res.write('<body><h1>Ok</h2></body>');
    res.write('</html>');
    res.end();
}
module.exports = requestHandler;