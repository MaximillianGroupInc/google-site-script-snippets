function doPost(e) {
  // --- CONFIGURATION ---
  var myEmail = "YOUR_EMAIL@gmail.com";        
  var bccAddress = "SECRET_EMAIL@gmail.com";   
  var replyToAddress = "SUPPORT@yourdomain.com"; 
  var logoUrl = "https://yourwebsite.com/logo.png"; // Optional: Link to your logo image
  // ---------------------

  var name = e.parameter.name;
  var userEmail = e.parameter.email;
  var message = e.parameter.message;

  // 1. NOTIFICATION TO YOU (Keep this simple/internal)
  MailApp.sendEmail(myEmail, "New Web Form: " + name, "", {
    bcc: bccAddress,
    replyTo: userEmail,
    htmlBody: "<h3>New Submission</h3><p><strong>From:</strong> " + name + "</p><p><strong>Message:</strong> " + message + "</p>"
  });

  // 2. STYLED AUTO-REPLY TO USER
  var userSubject = "We've received your message, " + name + "!";
  
  // Create the HTML structure for the user's email
  var htmlMsg = 
    "<div style='font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;'>" +
      "<h2 style='color: #4CAF50;'>Hello " + name + "!</h2>" +
      "<p>Thank you for reaching out. We wanted to let you know that we've received your message and our team is looking into it.</p>" +
      "<blockquote style='background: #f9f9f9; border-left: 5px solid #ccc; padding: 10px;'> " + message + " </blockquote>" +
      "<p>If you have any urgent follow-ups, simply reply to this email.</p>" +
      "<hr style='border: 0; border-top: 1px solid #eee;' />" +
      "<p style='font-size: 12px; color: #888;'>This is an automated confirmation from Your Website Name.</p>" +
    "</div>";

  MailApp.sendEmail(userEmail, userSubject, "Thank you for your message!", {
    replyTo: replyToAddress,
    htmlBody: htmlMsg
  });

  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
