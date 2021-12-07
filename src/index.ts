import http from 'http';
import formidable from 'formidable';
import { apiSpell } from './apiSpell'
import { Writable } from 'node:stream';

//options
const PORT = 5000
// const emitter = new EventEmitter()
let chunks = [] as Array<String>;

const streamFromFile = {
  fileWriteStreamHandler: (/* file */) => {
    const writable = new Writable();
    writable._write = async (chunk, enc, next) => {
      const response = await apiSpell(chunk.toString())
      chunks = chunks.concat(response);
      console.log('iteration', chunk.toString().length);
      next();
    };
    return writable;
  }
}

const filterType = {
  filter: function ({ mimetype }: any) {
    // keep only text
    return mimetype && mimetype.includes("text");
  }
}

const form = formidable({
  maxFileSize: 50 * 1024 * 1024,
  encoding: 'utf-8',
  ...filterType,
  ...streamFromFile
});

const server = http.createServer((req, res) => {
  //CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    'Access-Control-Allow-Headers': 'Content-Type, Content-Length, X-Requested-With'
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, headers)
    res.end()
    return
  }

  //upload file route
  if (req.url === '/api/upload' && req.method?.toLowerCase() === 'post') {
    // parse a file upload
    form.once('end', () => {
      console.log('-> post done from "end" event');
      res.writeHead(200, { 'Content-Type': 'text/plain', ...headers });
      res.end(chunks.join());
      chunks = []
    });
    form.parse(req, (err, fieldsMultiple, files) => {
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain', ...headers });
        res.end(String(err));
        console.log(err);
        return;
      }
    });
  }
  else { res.end() }
})

server.listen(process.env.PORT || PORT, () => console.log(`server start on ${PORT}`))