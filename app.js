// const express = require('express');
// const cors = require('cors');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const app = express();

// // Enable CORS for all routes
// app.use(cors({origin: 'http://olaopsses.s3-website.eu-north-1.amazonaws.com',}));

// const apiEndpoint = 'https://api.xiteit.co';
// const apiProxy = createProxyMiddleware('/api', { target: apiEndpoint, changeOrigin: true });
// app.use('/api', apiProxy);

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Express server is running on https://localhost:${port}`);
// });
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for both local development and deployed S3 application

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
const apiEndpoint = 'https://api.xiteit.co';
const apiProxy = createProxyMiddleware('/api', { target: apiEndpoint, changeOrigin: true });
app.use('/api', apiProxy);

const port = 3000;
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
