const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'HRMS API',
    version: '1.0.0',
    description: 'https://github.com/ardenden/hrms-api',
  },
  servers: [
    {
      url: 'http://localhost:8000/api'
    }
  ]
}

export default swaggerDefinition
