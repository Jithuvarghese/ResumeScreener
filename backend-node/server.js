require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const morgan = require('morgan');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = Number(process.env.PORT || 3001);
const javaApiBaseUrl = (process.env.JAVA_API_BASE_URL || 'http://localhost:8081').replace(/\/$/, '');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'node-gateway' });
});

app.post('/api/analyze/resume', upload.single('file'), async (request, response, next) => {
  try {
    const documentFile = request.file;
    const role = request.query.role || request.body.role;

    if (!documentFile) {
      return response.status(400).json({ message: 'A file upload is required.' });
    }

    if (!role) {
      return response.status(400).json({ message: 'A job role is required.' });
    }

    const formData = new FormData();
    formData.append('file', documentFile.buffer, {
      filename: documentFile.originalname,
      contentType: documentFile.mimetype,
    });

    const upstreamUrl = `${javaApiBaseUrl}/api/analyze/resume`;
    formData.append('role', role);
    const upstreamResponse = await axios.post(upstreamUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000,
    });

    return response.status(upstreamResponse.status).json(upstreamResponse.data);
  } catch (error) {
    return next(error);
  }
});

app.use((request, response) => {
  response.status(404).json({ message: `Route not found: ${request.method} ${request.originalUrl}` });
});

app.use((error, request, response, _next) => {
  if (error.response) {
    return response.status(error.response.status).json({
      message: error.response.data?.message || 'Gateway request failed',
      details: error.response.data,
    });
  }

  console.error('Gateway error:', error.message || error);
  return response.status(500).json({
    message: 'Internal server error',
    details: error.message || 'Unknown gateway failure',
  });
});

app.listen(port, () => {
  console.log(`Node gateway running on http://localhost:${port}`);
  console.log(`Forwarding requests to ${javaApiBaseUrl}`);
});
