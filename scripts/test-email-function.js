// Simple script to test the email function directly
const fetch = require('node-fetch');

// Replace with your actual test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  formType: 'contact',
  message: 'This is a test message from the email function test script.',
  phone: '123-456-7890'
};

// Function to test local endpoint
async function testEmailFunction() {
  try {
    console.log('Sending test request to email function...');
    
    // Use localhost:8888 for testing with netlify dev
    const response = await fetch('http://localhost:8888/.netlify/functions/send-email', {
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
      console.log('Response body:', JSON.stringify(result, null, 2));
    } else {
      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', text);
    }
  } catch (error) {
    console.error('Error testing email function:', error);
  }
}

// Run the test
testEmailFunction();
