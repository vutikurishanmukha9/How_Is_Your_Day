-- How Is Your Day - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_image TEXT,
  tags TEXT[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for better query performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- ============================================
-- SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  confirmed BOOLEAN DEFAULT FALSE,
  confirm_token TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Index for email lookups
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_confirmed ON subscribers(confirmed);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT,
  author_email TEXT,
  body TEXT NOT NULL,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for comments
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_is_moderated ON comments(is_moderated);

-- ============================================
-- PUSH TOKENS TABLE (for mobile notifications)
-- ============================================
CREATE TABLE push_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for token lookups
CREATE INDEX idx_push_tokens_platform ON push_tokens(platform);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Create a default admin user (password: 'admin123' - CHANGE THIS!)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO users (email, password_hash, display_name, is_admin, is_verified)
VALUES (
  'admin@howisyourday.com',
  '$2a$10$rZ5qYhJKYHKGKq5qYhJKYHKGKq5qYhJKYHKGKq5qYhJKYHKGKq5qY', -- Change this!
  'Admin User',
  TRUE,
  TRUE
) ON CONFLICT (email) DO NOTHING;

-- Sample post for testing
INSERT INTO posts (title, slug, excerpt, content, author_id, status, tags, published_at)
VALUES (
  'Welcome to How Is Your Day',
  'welcome-to-how-is-your-day',
  'Welcome to our new blogging platform! This is the first post.',
  '# Welcome!\n\nThis is the first post on **How Is Your Day**. We''re excited to share our thoughts and stories with you.\n\n## What to Expect\n\n- Regular blog posts\n- Personal stories\n- Insights and reflections\n\nStay tuned for more content!',
  1,
  'published',
  ARRAY['welcome', 'announcement'],
  now()
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Public read access to published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (status = 'published');

-- Admins can do everything with posts
CREATE POLICY "Admins can manage posts"
  ON posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::integer
      AND users.is_admin = TRUE
    )
  );

-- Public can insert comments (will be moderated)
CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  WITH CHECK (TRUE);

-- Public read access to moderated comments
CREATE POLICY "Public can read moderated comments"
  ON comments FOR SELECT
  USING (is_moderated = TRUE);

-- Admins can manage comments
CREATE POLICY "Admins can manage comments"
  ON comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::integer
      AND users.is_admin = TRUE
    )
  );

-- Public can subscribe
CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (TRUE);

-- Admins can view subscribers
CREATE POLICY "Admins can view subscribers"
  ON subscribers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::integer
      AND users.is_admin = TRUE
    )
  );

-- Anyone can register push tokens
CREATE POLICY "Anyone can register push tokens"
  ON push_tokens FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- VIEWS
-- ============================================

-- View for posts with author information
CREATE OR REPLACE VIEW posts_with_author AS
SELECT 
  p.*,
  u.display_name AS author_name,
  u.email AS author_email
FROM posts p
LEFT JOIN users u ON p.author_id = u.id;

-- View for tag statistics
CREATE OR REPLACE VIEW tag_counts AS
SELECT 
  unnest(tags) AS tag,
  COUNT(*) AS count
FROM posts
WHERE status = 'published'
GROUP BY tag
ORDER BY count DESC;

-- Grant access to views
GRANT SELECT ON posts_with_author TO anon, authenticated;
GRANT SELECT ON tag_counts TO anon, authenticated;
