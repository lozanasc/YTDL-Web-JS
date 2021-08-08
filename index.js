const express = require('express');
const app = express();
const path = require('path');
const ytdl = require('ytdl-core');
const port = process.env.PORT || 6969;

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/GetInfoDownloadable', (request, response) => {
    const {url} = request.query;
    ytdl.getInfo(url)
    .then(
        ({formats: Stream, videoDetails: Details}) => {
            response.send({VideoDetails: Details, DownloadStream: Stream});
        }
    ).catch(error => console.log(error));
});

app.listen(port, () => {
    console.log(`Development server is listening at http://localhost:${[port]}`);
});  
