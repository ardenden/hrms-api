const host = process.env.HOST || 'http://localhost'
const port = process.env.PORT || 8000
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'HRMS API',
    version: '1.0.0',
    description: 'https://github.com/ardenden/hrms-api',
  },
  servers: [
    {
      url: `${host}:${port}/api`
    }
  ]
}

export default swaggerDefinition
