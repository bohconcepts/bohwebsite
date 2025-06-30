<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Basic validation
if (!isset($data['name']) || !isset($data['email']) || !isset($data['formType'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Missing required fields',
        'requiredFields' => ['name', 'email', 'formType']
    ]);
    exit;
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Configuration
$companyEmail = 'info@bohconcepts.com'; // Your company email
$fromEmail = 'contact@bohconcepts.com'; // Your distribution email

// Process the form submission
try {
    $userEmailSent = sendUserConfirmationEmail($data, $fromEmail);
    $companyEmailSent = sendCompanyNotificationEmail($data, $fromEmail, $companyEmail);
    
    if ($userEmailSent && $companyEmailSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Form submitted successfully'
        ]);
    } else {
        http_response_code(207);
        echo json_encode([
            'success' => false,
            'userEmailSent' => $userEmailSent,
            'companyEmailSent' => $companyEmailSent,
            'message' => 'Form processed with partial success'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}

/**
 * Send confirmation email to the user
 */
function sendUserConfirmationEmail($data, $fromEmail) {
    $to = $data['email'];
    $subject = "BOH Concepts - " . ucfirst($data['formType']) . " Form Submission";
    
    // Create HTML email content
    $message = "<html><body>";
    $message .= "<h2>Thank you for your " . $data['formType'] . " submission!</h2>";
    $message .= "<p>Hello " . htmlspecialchars($data['name']) . ",</p>";
    $message .= "<p>We've received your submission and will get back to you soon.</p>";
    $message .= "<p>Best regards,<br>The BOH Concepts Team</p>";
    $message .= "</body></html>";
    
    // Email headers
    $headers = "From: BOH Concepts <$fromEmail>\r\n";
    $headers .= "Reply-To: $fromEmail\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // Send email
    return mail($to, $subject, $message, $headers);
}

/**
 * Send notification email to the company
 */
function sendCompanyNotificationEmail($data, $fromEmail, $companyEmail) {
    $to = $companyEmail;
    $subject = "New " . ucfirst($data['formType']) . " Form Submission from " . $data['name'];
    
    // Create HTML email content
    $message = "<html><body>";
    $message .= "<h2>New " . ucfirst($data['formType']) . " Form Submission</h2>";
    $message .= "<p><strong>Name:</strong> " . htmlspecialchars($data['name']) . "</p>";
    $message .= "<p><strong>Email:</strong> " . htmlspecialchars($data['email']) . "</p>";
    
    if (isset($data['message'])) {
        $message .= "<p><strong>Message:</strong> " . nl2br(htmlspecialchars($data['message'])) . "</p>";
    }
    
    // Add any additional fields
    foreach ($data as $key => $value) {
        if (!in_array($key, ['name', 'email', 'message', 'formType'])) {
            $message .= "<p><strong>" . ucfirst(str_replace('_', ' ', $key)) . ":</strong> " . htmlspecialchars($value) . "</p>";
        }
    }
    
    $message .= "</body></html>";
    
    // Email headers
    $headers = "From: Website Form <$fromEmail>\r\n";
    $headers .= "Reply-To: " . $data['email'] . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // Send email
    return mail($to, $subject, $message, $headers);
}
