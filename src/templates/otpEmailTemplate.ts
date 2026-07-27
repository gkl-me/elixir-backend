export const RESET_PASSWORD_OTP_TEMPLATE = (otp: string): string => `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        margin: 0;
        padding: 40px 20px;
        color: #2d3748;
        min-height: 100vh;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .header-section {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        padding: 50px 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .header-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: float 6s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
        50% { transform: translate(-50%, -50%) rotate(180deg); }
      }

      .icon-container {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        position: relative;
        z-index: 1;
      }

      .email-icon {
        width: 40px;
        height: 40px;
        stroke: white;
        stroke-width: 2;
        fill: none;
      }

      .header-title {
        font-size: 32px;
        font-weight: 700;
        color: white;
        margin-bottom: 8px;
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .header-subtitle {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        position: relative;
        z-index: 1;
        font-weight: 400;
      }

      .content-section {
        padding: 50px 40px;
        text-align: center;
        background: white;
      }

      .welcome-text {
        font-size: 18px;
        line-height: 1.6;
        color: #4a5568;
        margin-bottom: 30px;
        font-weight: 400;
      }

      .highlight-text {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 600;
      }

      .otp-box {
        margin: 30px auto;
        display: inline-block;
        background: #f7fafc;
        border: 2px dashed #4f46e5;
        border-radius: 14px;
        padding: 18px 40px;
        font-size: 28px;
        letter-spacing: 6px;
        font-weight: 700;
        color: #4f46e5;
      }

      .security-notice {
        background: #fef5e7;
        border: 1px solid #f6e05e;
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        text-align: left;
      }

      .security-title {
        font-weight: 600;
        color: #744210;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .security-text {
        font-size: 14px;
        color: #975a16;
        line-height: 1.4;
      }

      .footer-section {
        background: #f8fafc;
        padding: 40px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
      }

      .footer-text {
        font-size: 13px;
        color: #718096;
        line-height: 1.5;
      }

      .company-name {
        font-weight: 600;
        color: #4a5568;
      }

      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
        margin: 20px 0;
      }

      @media (max-width: 600px) {
        body {
          padding: 20px 10px;
        }

        .email-container {
          border-radius: 16px;
        }

        .header-section {
          padding: 40px 30px;
        }

        .content-section {
          padding: 40px 30px;
        }

        .header-title {
          font-size: 28px;
        }

        .welcome-text {
          font-size: 16px;
        }

        .footer-section {
          padding: 30px 20px;
        }

        .otp-box {
          font-size: 24px;
          padding: 16px 30px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="icon-container">
          <svg class="email-icon" viewBox="0 0 24 24">
            <path d="M12 17v2"/>
            <path d="M12 3a5 5 0 00-5 5v4H6a2 2 0 00-2 2v6h16v-6a2 2 0 00-2-2h-1V8a5 5 0 00-5-5z"/>
          </svg>
        </div>
        <h1 class="header-title">Reset Your Password</h1>
        <p class="header-subtitle">Use the OTP below to continue</p>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <p class="welcome-text">
          We received a request to reset your password. Please use the following
          <span class="highlight-text">One-Time Password (OTP)</span> to proceed.
        </p>

        <div class="otp-box">${otp}</div>

        <p class="welcome-text">
          This OTP is valid for a limited time. Do not share it with anyone.
        </p>

        <div class="security-notice">
          <div class="security-title">🔒 Security Notice</div>
          <p class="security-text">
            If you did not request a password reset, please ignore this email or contact support immediately.
          </p>
        </div>
      </div>

      <!-- Footer Section -->
      <div class="footer-section">
        <div class="divider"></div>
        <p class="footer-text">
          This email was sent by <span class="company-name">Your Company Name</span><br>
          © ${new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`;
