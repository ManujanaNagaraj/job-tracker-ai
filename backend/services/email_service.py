import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 465))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
FROM_EMAIL = os.getenv('FROM_EMAIL', SMTP_USER)


def send_reminder_email(to_email: str, company: str, job_title: str, days_ago: int) -> bool:
    """
    Send a follow-up reminder email for a job application
    Returns True if successful, False otherwise
    """
    if not all([SMTP_USER, SMTP_PASSWORD, to_email]):
        print("Email configuration not complete")
        return False
    
    # Create HTML email
    subject = f"⏰ Follow up on your {job_title} application at {company}"
    
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Time to Follow Up! 🚀</h2>
          
          <p>You applied to <strong>{company}</strong> for the <strong>{job_title}</strong> position <strong>{days_ago} days ago</strong>.</p>
          
          <p>It's a great time to follow up and show your continued interest!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Follow-up Tips:</h3>
            <ul style="margin: 10px 0;">
              <li>Send a polite email to the recruiter or hiring manager</li>
              <li>Reiterate your interest in the position</li>
              <li>Mention any new relevant skills or projects</li>
              <li>Ask if there's any additional information you can provide</li>
              <li>Keep it brief and professional</li>
            </ul>
          </div>
          
          <p style="margin-top: 20px;">
            <strong>Sample email opener:</strong><br>
            <em>"I hope this email finds you well. I wanted to follow up on my application for the {job_title} position that I submitted on [date]. I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience align with your team's needs."</em>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
            This is an automated reminder from Job Tracker AI.<br>
            Manage your applications at <a href="http://localhost:5173">localhost:5173</a>
          </p>
        </div>
      </body>
    </html>
    """
    
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = FROM_EMAIL
    message["To"] = to_email
    
    # Add HTML body
    html_part = MIMEText(html_body, "html")
    message.attach(html_part)
    
    try:
        # Create secure SSL context
        context = ssl.create_default_context()
        
        # Connect and send email
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, message.as_string())
        
        print(f"Reminder email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False
