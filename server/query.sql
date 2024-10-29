CREATE DATABASE admin_db;
USE admin_db;

CREATE TABLE organization (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE branch (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    organization_id CHAR(36),
    FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE
);

CREATE TABLE department (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branch_id CHAR(36),
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE
);

CREATE TABLE user (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'orgadmin', 'branchadmin', 'dprtadmin', 'member') NOT NULL,
    access_id CHAR(36)
);
