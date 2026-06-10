export const WORKSPACE_INVITE_TEMPLATE = (
  workspaceName: string,
  inviteUrl: string
): string => `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8" />
    <title>You've been invited to ${workspaceName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0; padding: 40px 20px; color: #2d3748; min-height: 100vh;
      }
      .email-container {
        max-width: 600px; margin: 0 auto;
        background: rgba(255,255,255,0.95); border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.15); overflow: hidden;
        border: 1px solid rgba(255,255,255,0.2);
      }
      .header-section {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        padding: 50px 40px; text-align: center; position: relative; overflow: hidden;
      }
      .icon-container {
        width: 80px; height: 80px; background: rgba(255,255,255,0.2);
        border-radius: 50%; margin: 0 auto 20px;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid rgba(255,255,255,0.3); position: relative; z-index: 1;
      }
      .email-icon { width: 40px; height: 40px; stroke: white; stroke-width: 2; fill: none; }
      .header-title { font-size: 28px; font-weight: 700; color: white; margin-bottom: 8px; position: relative; z-index: 1; }
      .header-subtitle { font-size: 16px; color: rgba(255,255,255,0.9); position: relative; z-index: 1; }
      .content-section { padding: 50px 40px; text-align: center; background: white; }
      .welcome-text { font-size: 16px; line-height: 1.7; color: #4a5568; margin-bottom: 24px; }
      .workspace-name {
        display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; font-weight: 700; font-size: 20px;
      }
      .cta-button {
        display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white; text-decoration: none; padding: 16px 40px;
        border-radius: 12px; font-size: 16px; font-weight: 600;
        margin: 28px 0; letter-spacing: 0.3px;
        box-shadow: 0 4px 15px rgba(79,70,229,0.4);
      }
      .link-fallback { font-size: 12px; color: #718096; margin-top: 20px; word-break: break-all; }
      .link-fallback a { color: #4f46e5; }
      .security-notice {
        background: #fef5e7; border: 1px solid #f6e05e;
        border-radius: 12px; padding: 20px; margin: 24px 0; text-align: left;
      }
      .security-title { font-weight: 600; color: #744210; margin-bottom: 6px; }
      .security-text { font-size: 13px; color: #975a16; line-height: 1.5; }
      .footer-section {
        background: #f8fafc; padding: 32px 40px; text-align: center;
        border-top: 1px solid #e2e8f0;
      }
      .footer-text { font-size: 12px; color: #718096; line-height: 1.6; }
      .company-name { font-weight: 600; color: #4a5568; }
      @media (max-width: 600px) {
        body { padding: 20px 10px; }
        .header-section, .content-section, .footer-section { padding: 32px 24px; }
        .header-title { font-size: 22px; }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header-section">
        <div class="icon-container">
          <svg class="email-icon" viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <h1 class="header-title">You've been invited!</h1>
        <p class="header-subtitle">Join a workspace on Elixir</p>
      </div>

      <div class="content-section">
        <p class="welcome-text">
          You have been invited to join the workspace
        </p>
        <div class="workspace-name">${workspaceName}</div>
        <p class="welcome-text" style="margin-top: 16px;">
          Click the button below to accept your invitation and get started.
          This link will expire in <strong>7 days</strong>.
        </p>

        <a href="${inviteUrl}" class="cta-button">Accept Invitation</a>

        <div class="security-notice">
          <div class="security-title">⚠️ Important</div>
          <p class="security-text">
            If you did not expect this invitation, you can safely ignore this email.
            Do not share this link with anyone — it is unique to you.
          </p>
        </div>

        <p class="link-fallback">
          If the button doesn't work, copy and paste this link:<br/>
          <a href="${inviteUrl}">${inviteUrl}</a>
        </p>
      </div>

      <div class="footer-section">
        <p class="footer-text">
          This invitation was sent by <span class="company-name">Elixir</span><br/>
          © ${new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`;
