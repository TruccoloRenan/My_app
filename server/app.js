const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());

let server = app.listen(4004, ()=> {
  console.log('servidor rodando porta 4004')
  //nms.run()
});

app.post('/', multer({dest: path.resolve('pasta_download')}).array('files'), (req, res) =>{
  let oldF = null;
  try{
    for(let file of req.files){
      let oldF = path.join(path.resolve('pasta_download'), file.filename);
      let newF = path.join(path.resolve('pasta_download'), file.originalname);

      fs.renameSync(oldF, newF);
    }res.send("Arquivo(s) recebido(s) com sucesso");

  }catch (err) {
    try{
      fs.unlinkSync(oldF);
    }catch (err) {
      res.send('error' + err);
    }
    res.send('error' + err)
  }
});

app.get('/', (req, res) => {
  fs.readFile('./index.html', (err, html) => res.end(html));
});

app.get('/pasta_download/:movieName', (req, res) => {
  const { movieName } = req.params;
  const movieFile = `./pasta_download/${movieName}`;
  fs.stat(movieFile, (err, stats) => {
    if(err){
      console.log(err);
      return res.status(404).end('<h1>Movie not found</h1>');
    }

    const { range } = req.headers;
    const { size } = stats;
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = size - 1;
    const chunkSize = (end - start) + 1;

    res.set({
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    res.status(206);

    const stream = fs.createReadStream(movieFile, { start, end });
    stream.on('open', () => stream.pipe(res));
    stream.on('error', (streamErr) => res.end(streamErr));
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;