// Simple script to test the email function directly
import fetch from 'node-fetch';

// Determine if we're in a development environment
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV || process.env.NODE_ENV === 'test';
};

// Safe logging function that only logs sensitive data in development
const devLog = (...args) => {
  if (isDevelopment()) {
    console.log(...args);
  }
};

// Replace with your actual test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  formType: 'contact',
  message: 'This is a test message from the email function test script.',
  phone: '123-456-7890'
};

// Choose environment to test
const environment = process.argv[2] || 'local';
let endpointUrl;

if (environment === 'production') {
  endpointUrl = 'https://bohwebsitedemo.netlify.app/.netlify/functions/send-email';
  console.log('Testing PRODUCTION endpoint');
} else {
  endpointUrl = 'http://localhost:8888/.netlify/functions/send-email';
  console.log('Testing LOCAL endpoint');
}

// Main test function
async function testEmailFunction() {
  try {
    console.log(`Sending test request to: ${endpointUrl}`);
    
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log('Response status:', response.status);
      // Use devLog for potentially sensitive response data
      devLog('Response body:', JSON.stringify(result, null, 2));
      // Always log success/failure status
      console.log('Email sent successfully:', result.success === true);
    } else {
      const text = await response.text();
      console.log('Response status:', response.status);
      // Use devLog for potentially sensitive response data
      devLog('Response text:', text);
    }
  } catch (error) {
    console.error('Error testing email function:', error);
  }
}

// Execute the test
testEmailFunction()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err.message || String(err)));
