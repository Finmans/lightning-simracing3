-- ============================================
-- HOMEPAGE SHOWCASE TABLE
-- For Equipment3D section (the 3 product cards)
-- ============================================

CREATE TABLE homepage_showcase (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  brand_color TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  product_image TEXT NOT NULL,
  product_highlight TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public can read
CREATE POLICY "Public can read homepage_showcase"
  ON homepage_showcase FOR SELECT
  USING (true);

-- Service role can do everything
CREATE POLICY "Service role full access homepage_showcase"
  ON homepage_showcase FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA: Initial 3 products for FANATEC
-- ============================================
INSERT INTO homepage_showcase (id, brand_id, brand_name, brand_color, product_name, product_type, product_image, product_highlight, sort_order) VALUES
('showcase-1', 'fanatec', 'FANATEC', '#3B82F6', 'GT DD Pro', 'Wheel Base', 'https://images.unsplash.com/photo-1570352481356-e633565f3b5c?w=400&auto=format&fit=crop', '8Nm Direct Drive', 1),
('showcase-2', 'fanatec', 'FANATEC', '#3B82F6', 'CSL DD+', 'Wheel Base', 'https://images.unsplash.com/photo-1614609953905-baeff400aab3?w=400&auto=format&fit=crop', '15Nm Force Feedback', 2),
('showcase-3', 'fanatec', 'FANATEC', '#3B82F6', 'Clubsport V3', 'Pedals', 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&auto=format', 'LoadCell Brake', 3);

-- ============================================
-- Done!
-- ============================================
