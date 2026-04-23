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
('Martin'),
('Unassigned');

INSERT INTO sla (serviceName, responseHours, resolveHours) VALUES
('Email Service', 2, 8),
('Network Service', 1, 4),
('Printer Service', 8, 48),
('VPN Service', 2, 6),
('Software Support', 4, 24);

INSERT INTO categories (name, sla_id) VALUES
('Email' , 1),
('Network', 2),
('Printer', 3),
('Software', 5),
('VPN', 4);

INSERT INTO articles (supporter_id, title, content, category_id) VALUES

(
1,
'How to Reset Outlook Password',
'If a user cannot log in to Outlook, first verify internet connection. Then navigate to the password reset portal. Confirm the account email address and complete the reset process. Restart Outlook afterwards.',
1
),

(
2,
'Email Not Sending - Troubleshooting Guide',
'Check if Outlook is connected to the mail server. Verify internet access. Review mailbox storage quota. Restart the mail client. If issue continues, escalate to second line support.',
1
),

(
1,
'VPN Connection Failed',
'Ensure the device has internet connection. Confirm VPN client is updated. Verify username and password. Restart the VPN client and retry. If multi-factor authentication fails, contact support.',
5
),

(
3,
'Slow Network Performance',
'Run a speed test and compare expected bandwidth. Restart router or switch if local office issue. Check for known outages. Escalate if multiple users are affected.',
2
),

(
2,
'Printer Not Responding',
'Check power status and network cable. Ensure printer is online. Restart print spooler service on client PC. Remove stuck print jobs and retry printing.',
3
),

(
3,
'Install Approved Software',
'Users must request approved software through the ticket system. Support will validate license availability and install remotely if approved.',
4
),

(
1,
'Software Crashes on Startup',
'Restart the computer first. Ensure latest updates are installed. Run the application as administrator. Reinstall application if problem persists.',
4
),

(
1,
'VPN Setup for New Employees',
'Install the corporate VPN client from the software portal. Import company profile. Enter company credentials and test connection before remote work.',
5
),

(
2,
'Printer Toner Replacement Guide',
'Open front panel carefully. Remove empty toner cartridge. Insert new cartridge and close panel. Print a test page to confirm functionality.',
3
),

(
3,
'How to Map Network Drive',
'Open File Explorer. Select This PC and choose Map Network Drive. Enter provided network path. Enable reconnect at sign-in and finish setup.',
2
);

INSERT INTO tickets
(
    title,
    description,
    priority_id,
    status_id,
    requesterName,
    requesterEmail,
    supporter_id,
    category_id,
    createdAt,
    updatedAt,
    closedAt
)
VALUES

(
'Unable to send emails',
'User reports Outlook is connected but emails remain in outbox and are not being delivered.',
3,
1,
'Anna Jensen',
'anna.jensen@company.local',
1,
1,
NOW(),
NOW(),
NULL
),

(
'VPN login failed',
'Remote employee cannot connect to company VPN after password change.',
3,
2,
'Peter Hansen',
'peter.hansen@company.local',
2,
5,
NOW(),
NOW(),
NULL
),

(
'Printer offline in accounting',
'Shared printer on 2nd floor is showing offline for multiple users.',
2,
1,
'Sofie Larsen',
'sofie.larsen@company.local',
3,
3,
NOW(),
NOW(),
NULL
),

(
'Slow internet connection',
'Several users report unstable internet and slow access to websites.',
4,
5,
'Jonas Madsen',
'jonas.madsen@company.local',
1,
2,
NOW(),
NOW(),
NULL
),

(
'Software crashes on startup',
'Finance software closes immediately after opening.',
2,
2,
'Emma Nielsen',
'emma.nielsen@company.local',
2,
4,
NOW(),
NOW(),
NULL
),

(
'Cannot map network drive',
'User receives access denied when connecting to shared drive.',
2,
1,
'Lucas Pedersen',
'lucas.pedersen@company.local',
3,
2,
NOW(),
NOW(),
NULL
),

(
'Email spam filtering issue',
'Important customer emails are incorrectly placed in junk folder.',
1,
2,
'Freja Mortensen',
'freja.mortensen@company.local',
1,
1,
NOW(),
NOW(),
NULL
),

(
'VPN frequently disconnects',
'VPN connection drops every 10 minutes while working remotely.',
3,
1,
'Mikkel Sørensen',
'mikkel.sorensen@company.local',
2,
5,
NOW(),
NOW(),
NULL
),

(
'Printer toner warning',
'Printer displays toner low warning and printing quality is reduced.',
1,
3,
'Camilla Thomsen',
'camilla.thomsen@company.local',
3,
3,
NOW(),
NOW(),
NOW()
),

(
'Application installation request',
'User requests installation of approved PDF editing software.',
1,
4,
'Oliver Kristensen',
'oliver.kristensen@company.local',
2,
4,
NOW(),
NOW(),
NOW()
),

(
'WiFi unavailable in meeting room',
'Wireless network unavailable in meeting room B for all attendees.',
4,
1,
'Ida Christensen',
'ida.christensen@company.local',
1,
2,
NOW(),
NOW(),
NULL
),

(
'Mailbox full warning',
'User receives mailbox storage quota exceeded message.',
2,
3,
'Noah Rasmussen',
'noah.rasmussen@company.local',
1,
1,
NOW(),
NOW(),
NOW()
);

-----

INSERT INTO tickets (
    title,
    description,
    priority_id,
    status_id,
    requesterName,
    requesterEmail,
    supporter_id,
    category_id,
    createdAt,
    updatedAt,
    closedAt
)
VALUES

-- 1
(
'Laptop overheating frequently',
'User reports laptop fan running constantly and device gets very hot.',
3,
1,
'Daniel Nielsen',
'daniel.nielsen@email.com',
1,
5,
NOW(),
NOW(),
NULL
),

-- 2
(
'Cannot connect to VPN',
'VPN client fails during login authentication.',
3,
2,
'Sarah Jensen',
'sarah.jensen@email.com',
2,
2,
NOW(),
NOW(),
NULL
),

-- 3
(
'Outlook keeps crashing',
'Outlook closes immediately after startup.',
2,
2,
'Emma Larsen',
'emma.larsen@email.com',
3,
1,
NOW(),
NOW(),
NULL
),

-- 4
(
'Printer not responding',
'Office printer appears offline for all users.',
2,
1,
'Lucas Hansen',
'lucas.hansen@email.com',
4,
3,
NOW(),
NOW(),
NULL
),

-- 5
(
'Slow internet in office',
'Multiple users report unstable and slow network speeds.',
3,
2,
'Oliver Madsen',
'oliver.madsen@email.com',
1,
4,
NOW(),
NOW(),
NULL
),

-- 6
(
'Need Adobe Acrobat installed',
'Requester needs Acrobat for PDF editing tasks.',
1,
1,
'Freja Thomsen',
'freja.thomsen@email.com',
2,
5,
NOW(),
NOW(),
NULL
),

-- 7
(
'Password reset required',
'User forgot password and cannot log in.',
2,
4,
'Noah Christensen',
'noah.christensen@email.com',
3,
1,
NOW(),
NOW(),
NOW()
),

-- 8
(
'WiFi unstable in meeting room',
'Wireless connection drops repeatedly.',
2,
1,
'Ida Sørensen',
'ida.sorensen@email.com',
4,
4,
NOW(),
NOW(),
NULL
),

-- 9
(
'New employee account setup',
'Create account, mailbox and permissions for new starter.',
1,
2,
'Anna Pedersen',
'anna.pedersen@email.com',
1,
5,
NOW(),
NOW(),
NULL
),

-- 10
(
'Scanner not detected',
'USB scanner missing after reboot.',
1,
1,
'Mikkel Rasmussen',
'mikkel.rasmussen@email.com',
2,
3,
NOW(),
NOW(),
NULL
),

-- 11
(
'Teams microphone not working',
'Microphone not recognized in Microsoft Teams.',
2,
2,
'Sofie Mortensen',
'sofie.mortensen@email.com',
3,
5,
NOW(),
NOW(),
NULL
),

-- 12
(
'Access request to finance folder',
'Need read/write access to shared finance directory.',
2,
1,
'Jonas Poulsen',
'jonas.poulsen@email.com',
4,
5,
NOW(),
NOW(),
NULL
),

-- 13
(
'Blue screen after update',
'Laptop crashes after Windows update installation.',
3,
2,
'Camilla Jørgensen',
'camilla.jorgensen@email.com',
1,
5,
NOW(),
NOW(),
NULL
),

-- 14
(
'Mailbox full warning',
'Cannot receive new emails due to mailbox size.',
1,
4,
'Maria Olsen',
'maria.olsen@email.com',
2,
1,
NOW(),
NOW(),
NOW()
),

-- 15
(
'VPN setup for consultant',
'Temporary consultant requires VPN access.',
1,
1,
'Peter Holm',
'peter.holm@email.com',
3,
2,
NOW(),
NOW(),
NULL
),

-- 16
(
'Keyboard keys stuck',
'Several keys on laptop keyboard do not respond.',
1,
1,
'Julie Andersen',
'julie.andersen@email.com',
4,
5,
NOW(),
NOW(),
NULL
),

-- 17
(
'Shared drive unavailable',
'Department shared drive cannot be reached.',
3,
2,
'Thomas Eriksen',
'thomas.eriksen@email.com',
1,
4,
NOW(),
NOW(),
NULL
),

-- 18
(
'Install Visual Studio Code',
'Developer requests VS Code on workstation.',
1,
4,
'Andreas Lund',
'andreas.lund@email.com',
2,
5,
NOW(),
NOW(),
NOW()
),

-- 19
(
'Printer toner replacement',
'Printer displays low toner warning.',
1,
1,
'Nadia Kristensen',
'nadia.kristensen@email.com',
3,
3,
NOW(),
NOW(),
NULL
),

-- 20
(
'Laptop battery drains quickly',
'Battery only lasts 30 minutes unplugged.',
2,
2,
'Kasper Winther',
'kasper.winther@email.com',
4,
5,
NOW(),
NOW(),
NULL
),

-- 21
(
'Cannot map network drive',
'Mapped drive disappears after restart.',
2,
1,
'Louise Dahl',
'louise.dahl@email.com',
1,
4,
NOW(),
NOW(),
NULL
),

-- 22
(
'Need access to CRM system',
'User requires access to customer management platform.',
2,
2,
'Victor Møller',
'victor.moller@email.com',
2,
5,
NOW(),
NOW(),
NULL
),

-- 23
(
'Email spam filtering issue',
'Important emails incorrectly marked as spam.',
2,
1,
'Helene Berg',
'helene.berg@email.com',
3,
1,
NOW(),
NOW(),
NULL
),

-- 24
(
'Second monitor flickering',
'External monitor flashes intermittently.',
1,
1,
'Rasmus Friis',
'rasmus.friis@email.com',
4,
5,
NOW(),
NOW(),
NULL
),

-- 25
(
'Software crashes on startup',
'Business application closes immediately when opened.',
3,
2,
'Mathias Løyche',
'mathias.loyche@email.com',
1,
5,
NOW(),
NOW(),
NULL
);