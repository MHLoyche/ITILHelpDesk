-- =========================
-- SAMPLE DATA
-- =========================

INSERT INTO priorities (name) VALUES
('Low'),
('Medium'),
('High'),
('Critical');

INSERT INTO status (name) VALUES
('Open'),
('In Progress'),
('Resolved'),
('Closed'),
('Escalated');

INSERT INTO supporters (name) VALUES
('Jonas'),
('Emma'),
('Martin');

INSERT INTO categories (name) VALUES
('Email'),
('Network'),
('Printer'),
('Software'),
('VPN');

INSERT INTO sla (serviceName, responseHours, resolveHours) VALUES
('Email Service', 2, 8),
('Network Service', 1, 4),
('Printer Service', 8, 48),
('VPN Service', 2, 6),
('Software Support', 4, 24);

INSERT INTO articles (title, content, category_id) VALUES

(
'How to Reset Outlook Password',
'If a user cannot log in to Outlook, first verify internet connection. Then navigate to the password reset portal. Confirm the account email address and complete the reset process. Restart Outlook afterwards.',
1
),

(
'Email Not Sending - Troubleshooting Guide',
'Check if Outlook is connected to the mail server. Verify internet access. Review mailbox storage quota. Restart the mail client. If issue continues, escalate to second line support.',
1
),

(
'VPN Connection Failed',
'Ensure the device has internet connection. Confirm VPN client is updated. Verify username and password. Restart the VPN client and retry. If multi-factor authentication fails, contact support.',
5
),

(
'Slow Network Performance',
'Run a speed test and compare expected bandwidth. Restart router or switch if local office issue. Check for known outages. Escalate if multiple users are affected.',
2
),

(
'Printer Not Responding',
'Check power status and network cable. Ensure printer is online. Restart print spooler service on client PC. Remove stuck print jobs and retry printing.',
3
),

(
'Install Approved Software',
'Users must request approved software through the ticket system. Support will validate license availability and install remotely if approved.',
4
),

(
'Software Crashes on Startup',
'Restart the computer first. Ensure latest updates are installed. Run the application as administrator. Reinstall application if problem persists.',
4
),

(
'VPN Setup for New Employees',
'Install the corporate VPN client from the software portal. Import company profile. Enter company credentials and test connection before remote work.',
5
),

(
'Printer Toner Replacement Guide',
'Open front panel carefully. Remove empty toner cartridge. Insert new cartridge and close panel. Print a test page to confirm functionality.',
3
),

(
'How to Map Network Drive',
'Open File Explorer. Select This PC and choose Map Network Drive. Enter provided network path. Enable reconnect at sign-in and finish setup.',
2
);