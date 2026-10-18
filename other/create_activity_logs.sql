-- Activity User Log
CREATE TABLE IF NOT EXISTS tbl_activity_log_user (
  id INT(11) NOT NULL AUTO_INCREMENT,
  iduser INT(11) DEFAULT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Activity App Log
CREATE TABLE IF NOT EXISTS tbl_activity_log_app (
  id INT(11) NOT NULL AUTO_INCREMENT,
  status ENUM('Normal', 'Down', 'Bug', 'Error') NOT NULL DEFAULT 'Normal',
  description TEXT DEFAULT NULL,
  recommendation TEXT DEFAULT NULL,
  iduser INT(11) DEFAULT NULL, -- User who reported/logged it
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
