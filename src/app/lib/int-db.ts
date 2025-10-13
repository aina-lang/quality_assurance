// lib/init-db.ts
import { pool } from './db';

export async function initDatabase() {
  const queries = [

    `CREATE TABLE IF NOT EXISTS clients (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      legal_info VARCHAR(255) NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      status ENUM('active', 'inactive', 'pending_payment') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS account_types (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      duration_days INT NOT NULL DEFAULT 365,
      max_domains INT NOT NULL DEFAULT 10,
      features JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS subscriptions (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      client_id BIGINT UNSIGNED NOT NULL,
      account_type_id BIGINT UNSIGNED NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME NULL,
      status ENUM('active','expired','cancelled','pending_payment') DEFAULT 'active',
      payment_method VARCHAR(50) NULL,
      payment_reference VARCHAR(100) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_sub_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      CONSTRAINT fk_sub_plan FOREIGN KEY (account_type_id) REFERENCES account_types(id)
    )`,

    `CREATE TABLE IF NOT EXISTS domains (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      client_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_domain_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS participants (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      domain_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      poste VARCHAR(100) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_participant_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS templates (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      domain_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(255) NOT NULL,
      content JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_template_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS template_files (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      template_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      file_type VARCHAR(50) NULL,
      size_bytes BIGINT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_file_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
    )`
  ];

  for (const query of queries) {
    await pool.query(query);
  }

  console.log('✅ Tables vérifiées / créées');
}
