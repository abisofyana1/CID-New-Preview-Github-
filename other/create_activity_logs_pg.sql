-- Activity User Log (PostgreSQL compatible)
CREATE TABLE IF NOT EXISTS tbl_activity_log_user (
  id SERIAL PRIMARY KEY,
  iduser INTEGER DEFAULT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity App Log (PostgreSQL compatible)
CREATE TABLE IF NOT EXISTS tbl_activity_log_app (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'Normal', -- ENUM can be complex, using VARCHAR for simplicity
  description TEXT DEFAULT NULL,
  recommendation TEXT DEFAULT NULL,
  iduser INTEGER DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
