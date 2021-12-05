import http from 'http';
import formidable from 'formidable';
import fs from 'fs'
import SpellChecker from './service'
import EventEmitter from 'events';
import { writeFile } from 'fs';

//options
const highWaterMark = 3 * 512
const encoding = 'utf-8'
const PORT = 5000
const emitter = new EventEmitter()
const form = formidable();

const server = http.createServer((req, res) => {

  if (req.url === '/api/upload' && req.method?.toLowerCase() === 'post') {
    // parse a file upload
    form.on('file', async function (name, file) {
      if (file.mimetype !== 'text/plain') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify('error type'));
      }
      //create readeble stream from text file
      const stream = fs.createReadStream(file.filepath, { encoding, highWaterMark })
      let chunks = [] as Array<String>;
      //every chunc check spell
      for await (const chunk of stream) {
        const response = await SpellChecker.sendChankText(chunk.toString())
        chunks = chunks.concat(response);
        // console.log('iteration');
      }
      //save new text in file and emmit action
      writeFile('files/final.txt', chunks.join(), 'utf8', (err) => {
        if (err) throw err;
        emitter.emit('upload');
      });

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
      emitter.once('upload', () => {
        const filePath = 'files/final.txt'
        if (fs.existsSync(filePath)) {
          fs.createReadStream('files/final.txt').pipe(res)
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/plane' });
        res.end('Error sending file');
      });
    });
  }
  else { res.end() }
})

server.listen(process.env.PORT || PORT, () => console.log(`server start on ${PORT}`))