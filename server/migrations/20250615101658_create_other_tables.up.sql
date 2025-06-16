-- migrations/{timestamp}_create_users_table.up.sql

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE organisations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE    
);

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    org_id INT NOT NULL,
    member_type ENUM('ADMIN', 'MANAGER') NOT NULL DEFAULT 'MANAGER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE    
);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,    
    service_status ENUM('OPERATIONAL', 'DEGRADED', 'MINOR', 'MAJOR', 'OFF') NOT NULL DEFAULT 'OFF',
    service_type ENUM('SERVICE', 'SOCKET', 'MESSAGE', 'DB') NOT NULL DEFAULT 'SERVICE',
    org_id INT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE    
);

CREATE TABLE incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,    
    incident_status ENUM('OPEN', 'CLOSE') NOT NULL DEFAULT 'OPEN',
    service_type ENUM('SERVICE', 'SOCKET', 'MESSAGE', 'DB') NOT NULL DEFAULT 'SERVICE',
    description VARCHAR(255),
    service_id INT NOT NULL,
    org_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,    
    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE    
);

CREATE TABLE service_log (
    id INT AUTO_INCREMENT PRIMARY KEY,    
    service_id INT NOT NULL,
    service_status ENUM('OPERATIONAL', 'DEGRADED', 'MINOR', 'MAJOR', 'OFF') NOT NULL DEFAULT 'OFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE    
);

CREATE TABLE incident_comment (
    id INT AUTO_INCREMENT PRIMARY KEY,    
    incident_id INT NOT NULL,
    comment VARCHAR(1024),
    comment_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE    
);

CREATE TABLE service_maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,    
    service_id INT NOT NULL,
    maintenance_time TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);