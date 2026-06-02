-- V3: create remaining entity-backed tables missing from Neon

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(255),
  payload TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seller_requests (
  id VARCHAR(255) PRIMARY KEY,
  requester_id VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(255) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_seller_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);
