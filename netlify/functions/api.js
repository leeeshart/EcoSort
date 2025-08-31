const serverless = require('serverless-http');

// Import your Express app
const createApp = async () => {
  // We need to dynamically import the ES modules
  const { createExpressApp } = await import('../../server/index.js');
  return createExpressApp();
};

let app;

exports.handler = async (event, context) => {
  if (!app) {
    app = await createApp();
  }
  
  const handler = serverless(app);
  return handler(event, context);
};
