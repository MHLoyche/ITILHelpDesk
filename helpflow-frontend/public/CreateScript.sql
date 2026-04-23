CREATE DATABASE IF NOT EXISTS helpflowdb;
USE helpflowdb;

-- =========================
-- PRIORITIES
-- =========================
CREATE TABLE priorities (
    priority_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- =========================
-- STATUS
-- =========================
CREATE TABLE status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- =========================
-- SUPPORTERS
-- =========================
CREATE TABLE supporters (
    supporter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- =========================
-- SLA
-- =========================
CREATE TABLE sla (
    sla_id INT AUTO_INCREMENT PRIMARY KEY,
    serviceName VARCHAR(150) NOT NULL,
    responseHours INT NOT NULL,
    resolveHours INT NOT NULL
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sla_id INT,
    
    CONSTRAINT fk_categories_sla
		FOREIGN KEY (sla_id)
        REFERENCES sla(sla_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- ARTICLES
-- =========================
CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    supporter_id INT,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    category_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_articles_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
        
	CONSTRAINT fk_articles_supporter
		FOREIGN KEY (supporter_id)
        REFERENCES supporters(supporter_id)
        ON UPDATE CASCADE
);

-- =========================
-- TICKETS
-- =========================
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,

    priority_id INT,
    status_id INT,

    requesterName VARCHAR(150) NOT NULL,
    requesterEmail VARCHAR(255) NOT NULL,

    supporter_id INT NULL,
    category_id INT NULL,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closedAt DATETIME NULL,

    CONSTRAINT fk_tickets_priority
        FOREIGN KEY (priority_id)
        REFERENCES priorities(priority_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_status
        FOREIGN KEY (status_id)
        REFERENCES status(status_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_supporter
        FOREIGN KEY (supporter_id)
        REFERENCES supporters(supporter_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- COMMENTS
-- =========================
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    authorName VARCHAR(150) NOT NULL,

    CONSTRAINT fk_comments_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(ticket_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);