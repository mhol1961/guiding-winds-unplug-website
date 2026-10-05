-- Per-visitor form limits shared by every Worker instance (an in-memory
-- limiter only sees its own isolate). key = "<route>:<ip>", bucket = hour.
CREATE TABLE IF NOT EXISTS ip_hits (
  key TEXT NOT NULL,
  bucket INTEGER NOT NULL,
  n INTEGER NOT NULL,
  PRIMARY KEY (key, bucket)
);
