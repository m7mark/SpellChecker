// const http = require('http')
import http from 'http';
import formidable from 'formidable';
import fs from 'fs'
import fetch from 'node-fetch';


const highWaterMark = 10 * 1024
const encoding = 'utf-8'
const PORT = 5000

const server = http.createServer((req, res) => {
  // res.writeHead(200, { 'Content-type': 'text/html; charset=utf-8' })
  // if (req.url === '/api/spell') {
  //   console.log(req);
  //   res.end('spell')
  // }
  // else {
  //   res.end()
  // }
  if (req.url === '/api/upload' && req.method?.toLowerCase() === 'post') {
    // parse a file upload
    const form = formidable();
    form.on('file', function (name, file) {
      if (file.mimetype !== 'text/plain') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify('error type'));
      }

      // fs.readFile(file.filepath, 'utf-8', (e, data) => {
      //   console.log(data);
      // })

      const stream = fs.createReadStream(file.filepath, { encoding, highWaterMark })
      stream.on('data', (chank) => {
        console.log(chank);
        // fetch('https://github.com/')
        //   .then(res => res.text())
        //   .then(body => console.log(body));
        // console.log(res);
      })
      stream.on('error', (e) => {
        console.log(e);
      })

    })
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });

  }


  // // show a file upload form
  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.end(`
  //   <h2>With Node.js <code>"http"</code> module</h2>
  //   <form action="/api/upload" enctype="multipart/form-data" method="post">
  //     <div>Text field title: <input type="text" name="title" /></div>
  //     <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
  //     <input type="submit" value="Upload" />
  //   </form>
  // `);
})

server.listen(PORT, () => console.log(`server start on ${PORT}`))