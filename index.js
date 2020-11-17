const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const overview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const product = fs.readFileSync('./templates/template-product.html', 'utf-8');
const card = fs.readFileSync('./templates/template-card.html', 'utf-8');
const itemsData = JSON.parse(fs.readFileSync('./dev-data/data.json', 'utf-8'));

const server = http.createServer((req, res) => {
  const query = url.parse(req.url, true);
  const pathName = query.pathname;
  const id = query.query.id;

  // Routing
  console.log(pathName);

  // Home
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const products = itemsData
      .map(e => {
        return replaceTemplate(card, e);
      })
      .join(' ');
    console.log(products);
    const output = overview.replace('{%PRODUCT_CARDS%}', products);
    res.end(output);
  }

  // Product
  else if (pathName === '/product' && id < itemsData.length && id >= 0) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const output = replaceTemplate(product, itemsData[id]);
    res.end(output);
  }

  // Images
  else if (/.(jpg|jpeg|png|gif)$/.test(pathName)) {
    res.writeHead(200, 'Content-Type', 'image/jpeg');
    fs.readFile(__dirname + '/data/img' + pathName, (err, data) => {
      res.end(data);
    });
  }

  // INVALID URL
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404! Please visit correct link!');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listing to port 8000');
});
