-- Table pour les vidéos de démonstration
CREATE TABLE IF NOT EXISTS demo_videos (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration INT, -- en secondes
    category VARCHAR(100), -- 'tutorial', 'feature', 'overview', etc.
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table pour les interactions CRM (tickets, notes, activités)
CREATE TABLE IF NOT EXISTS crm_interactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    type ENUM('ticket', 'note', 'call', 'email', 'meeting') NOT NULL,
    title VARCHAR(255),
    description TEXT,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to BIGINT UNSIGNED, -- admin_id ou user_id
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Table pour les statistiques CRM
CREATE TABLE IF NOT EXISTS crm_statistics (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    metric_name VARCHAR(100) NOT NULL, -- 'last_login', 'tickets_count', 'subscriptions_count', etc.
    metric_value VARCHAR(255),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Table pour les notes et tags sur les clients
CREATE TABLE IF NOT EXISTS client_notes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255),
    content TEXT,
    tags JSON, -- ['important', 'vip', 'prospect', etc.]
    created_by BIGINT UNSIGNED, -- admin_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Insérer des vidéos de démonstration par défaut
INSERT INTO demo_videos (title, description, video_url, category, display_order) VALUES
    ('Présentation générale', 'Découvrez les fonctionnalités principales de la plateforme', 'https://example.com/video1.mp4', 'overview', 1),
    ('Gestion des domaines', 'Apprenez à créer et gérer vos domaines', 'https://example.com/video2.mp4', 'tutorial', 2),
    ('Gestion des participants', 'Comment ajouter et organiser vos participants', 'https://example.com/video3.mp4', 'tutorial', 3),
    ('Création de templates', 'Créez vos propres templates personnalisés', 'https://example.com/video4.mp4', 'feature', 4);

-- Index pour améliorer les performances
CREATE INDEX idx_client_status ON clients(status);
CREATE INDEX idx_subscription_status ON subscriptions(status);
CREATE INDEX idx_subscription_end_date ON subscriptions(end_date);
CREATE INDEX idx_crm_interactions_client ON crm_interactions(client_id);
CREATE INDEX idx_crm_interactions_status ON crm_interactions(status);
