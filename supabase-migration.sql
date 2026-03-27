-- ============================================
-- Lightning SimRacing - Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Drop existing tables (if migrating from JSON)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT DEFAULT '',
  category TEXT DEFAULT 'accessory',
  type TEXT CHECK (type IN ('sale', 'rent', 'both')) DEFAULT 'sale',
  condition TEXT DEFAULT 'good',
  sale_price INTEGER,
  original_price INTEGER,
  rent_price_per_day INTEGER,
  rent_price_per_week INTEGER,
  rent_price_per_month INTEGER,
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  specs JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rented', 'inactive')),
  featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT 'site_settings',
  hero_image TEXT,
  hero_card_title TEXT,
  hero_card_price TEXT,
  site_name TEXT,
  phone TEXT,
  line_id TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read products (for shop page)
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (status = 'active');

-- Public can read settings
CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);

-- Service role (admin) can do everything
CREATE POLICY "Service role full access products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access settings"
  ON settings FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- HELPER FUNCTION: increment views
-- ============================================
CREATE OR REPLACE FUNCTION increment_views(product_id TEXT)
RETURNS VOID AS $$
  UPDATE products
  SET views = views + 1,
      updated_at = NOW()
  WHERE id = product_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- SEED DATA: Products
-- ============================================
INSERT INTO products (id, title, brand, category, type, condition, sale_price, original_price, description, features, specs, images, status, featured, stock_quantity, views, created_at, updated_at) VALUES

('p001', 'Fanatec GT DD Pro 8Nm Bundle', 'Fanatec', 'bundle', 'sale', 'like-new', 32900, 42900,
 'ชุด Fanatec GT DD Pro สภาพเหมือนใหม่ ใช้งานไม่ถึง 3 เดือน ครบชุดพร้อมเล่น รวม Clubsport V3 และ NLR GT Elite',
 '["Direct Drive 8Nm","Clubsport V3 Pedals (LoadCell)","NLR GT Elite Cockpit","34\" UltraWide 165Hz","ประกันยังเหลืออยู่"]',
 '{"Wheel Base": "Fanatec GT DD Pro 8Nm", "Pedals": "Fanatec Clubsport V3", "Cockpit": "NLR GT Elite", "Monitor": "34\" 165Hz UltraWide", "Max Torque": "8Nm"}',
 '["https://images.unsplash.com/photo-1636036704268-017faa3b6557?w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1752959807835-3af0030dc3a9?w=800&auto=format&fit=crop"]',
 'active', true, 1, 127, '2025-03-01T00:00:00.000Z', '2025-03-01T00:00:00.000Z'),

('p002', 'Simagic Alpha Mini 10Nm', 'Simagic', 'wheel-base', 'sale', 'good', 18500, 26900,
 'Simagic Alpha Mini สภาพดี Direct Drive 10Nm ใช้กับ PC และ PS5 ได้ มี FFB แรงมาก',
 '["Direct Drive 10Nm","รองรับ PC + PS5","Quick Release included","Simagic M10 Wheel included","มี Original Box"]',
 '{"Max Torque": "10Nm", "Motor Type": "Direct Drive", "Connection": "USB", "Compatibility": "PC, PS5"}',
 '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop"]',
 'active', true, 1, 89, '2025-03-05T00:00:00.000Z', '2025-03-05T00:00:00.000Z'),

('p003', 'Moza R9 V2 9Nm + CRP Pedals', 'Moza', 'bundle', 'sale', 'like-new', 24900, 31900,
 'Moza R9 V2 + CRP Pedals ครบชุด สภาพเหมือนใหม่ ใช้งาน 2 เดือน รวม ES Steering Wheel ด้วย',
 '["Direct Drive 9Nm","CRP Load Cell Pedals","ES Formula Wheel","Moza Pit House Software","USB Hub included"]',
 '{"Wheel Base": "Moza R9 V2", "Pedals": "CRP 3-Pedal Set", "Wheel": "Moza ES Steering Wheel", "Max Torque": "9Nm"}',
 '["https://images.unsplash.com/photo-1760553121003-93afc4d88ae0?w=800&auto=format&fit=crop"]',
 'active', true, 1, 64, '2025-03-08T00:00:00.000Z', '2025-03-08T00:00:00.000Z'),

('p004', 'Logitech G923 TrueForce + Pedals', 'Logitech', 'bundle', 'sale', 'good', 8900, 13900,
 'Logitech G923 ชุดมือสอง สภาพดี เหมาะสำหรับมือใหม่ ราคาคุ้มค่า TrueForce Feedback',
 '["TrueForce Haptic Feedback","3-Pedal Set","รองรับ PC + PS5","Shift Paddles","900° Rotation"]',
 '{"Feedback": "TrueForce (Gear-Drive)", "Rotation": "900°", "Pedals": "3-Pedal (Clutch, Brake, Gas)", "Compatibility": "PC, PS4, PS5"}',
 '["https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&auto=format&fit=crop"]',
 'active', false, 2, 203, '2025-02-20T00:00:00.000Z', '2025-02-20T00:00:00.000Z'),

('p005', 'NLR GT Elite Cockpit', 'Next Level Racing', 'cockpit', 'sale', 'good', 15900, 22900,
 'Next Level Racing GT Elite Cockpit ใช้งานได้กับทุก wheel/pedal set ปรับระดับได้หมด',
 '["Adjustable Seat Position","Universal Wheel Mount","Pedal Plate included","Monitor Mount Option","Weight Capacity 120kg"]',
 '{"Material": "Steel Frame", "Max Load": "120kg", "Adjustment": "Full Adjustable", "Compatibility": "Universal"}',
 '["https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&auto=format&fit=crop"]',
 'active', false, 1, 45, '2025-03-10T00:00:00.000Z', '2025-03-10T00:00:00.000Z'),

('p006', 'Fanatec Clubsport V3 Pedals', 'Fanatec', 'pedals', 'sale', 'like-new', 12500, 17900,
 'Fanatec Clubsport V3 Pedals สภาพเหมือนใหม่ มี Load Cell Brake ความแม่นยำสูง',
 '["Load Cell Brake","Vibration Motor","Adjustable Brake Force","Aluminum Pedal Faces","USB Direct Connection"]',
 '{"Brake Type": "Load Cell", "Pedals": "3-Pedal (Clutch, Brake, Gas)", "Material": "Aluminum + Steel", "Connection": "USB"}',
 '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop"]',
 'active', false, 1, 58, '2025-03-12T00:00:00.000Z', '2025-03-12T00:00:00.000Z'),

('p007', 'Fanatec CSL DD+ 15Nm ชุดเช่าสมบูรณ์', 'Fanatec', 'bundle', 'rent', 'new', NULL, NULL,
 'ชุดเช่า Fanatec CSL DD+ 15Nm พร้อม GT3 V2 Wheel และ CSL Load Cell Pedals ครบชุด จัดส่งติดตั้งถึงบ้าน',
 '["Direct Drive 15Nm","CSL DD+ Boost Kit","GT3 V2 Steering Wheel","CSL Load Cell Pedals","จัดส่ง+ติดตั้งฟรี"]',
 '{"Wheel Base": "Fanatec CSL DD+ 15Nm", "Wheel": "GT3 V2", "Pedals": "CSL Load Cell", "Max Torque": "15Nm"}',
 '["https://images.unsplash.com/photo-1570352481356-e633565f3b5c?w=800&auto=format&fit=crop"]',
 'active', true, 3, 76, '2025-03-15T00:00:00.000Z', '2025-03-15T00:00:00.000Z'),

('p008', 'Samsung 32" Odyssey G5 165Hz Curved', 'Samsung', 'monitor', 'sale', 'like-new', 11900, 16900,
 'Samsung Odyssey G5 32" 165Hz 1440p Curved VA Panel เหมาะสำหรับ Sim Racing มาก',
 '["32\" 1440p (QHD)","165Hz Refresh Rate","1ms Response Time","VA Curved Panel","FreeSync Premium"]',
 '{"Size": "32 inch", "Resolution": "2560x1440 (QHD)", "Refresh Rate": "165Hz", "Panel": "VA Curved", "Response Time": "1ms"}',
 '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop"]',
 'active', false, 1, 92, '2025-03-18T00:00:00.000Z', '2025-03-18T00:00:00.000Z'),

('p009', 'Moza R5 Bundle + SR-P Pedals ชุดเช่า', 'Moza', 'bundle', 'rent', 'new', NULL, NULL,
 'ชุดเช่า Moza R5 + SR-P Pedals สภาพใหม่ เหมาะสำหรับผู้เริ่มต้นถึงระดับกลาง จัดส่งถึงบ้าน',
 '["Direct Drive 5.5Nm","SR-P 3-Pedal Set","ES Steering Wheel","Moza Pit House","จัดส่ง+ติดตั้งฟรี"]',
 '{"Wheel Base": "Moza R5 5.5Nm", "Pedals": "SR-P 3-Pedal", "Wheel": "ES Steering Wheel", "Max Torque": "5.5Nm"}',
 '["https://images.unsplash.com/photo-1597334948548-88e11f75a946?w=800&auto=format&fit=crop"]',
 'active', true, 2, 34, '2025-03-20T00:00:00.000Z', '2025-03-20T00:00:00.000Z'),

('p010', 'Logitech G923 + NLR GT Lite Cockpit ชุดเช่า', 'Logitech', 'bundle', 'rent', 'good', NULL, NULL,
 'ชุดเช่าระดับเริ่มต้น Logitech G923 + Cockpit ครบชุด เหมาะสำหรับทดลองเล่นก่อนตัดสินใจซื้อ',
 '["TrueForce Feedback","GT Lite Cockpit","3-Pedal Set","รองรับ PC + PS5","จัดส่งฟรี กทม."]',
 '{"Wheel": "Logitech G923", "Cockpit": "NLR GT Lite", "Pedals": "3-Pedal", "Compatibility": "PC, PS4, PS5"}',
 '["https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&auto=format&fit=crop"]',
 'active', false, 2, 21, '2025-03-22T00:00:00.000Z', '2025-03-22T00:00:00.000Z');

-- ============================================
-- SEED DATA: Settings
-- ============================================
INSERT INTO settings (id, hero_image, hero_card_title, hero_card_price, site_name, phone, line_id, address)
VALUES (
  'site_settings',
  '/uploads/1774381875438.png',
  'Fanatec GT DD Pro Bundle',
  '฿32,900',
  'Lightning SimRacing',
  '099-999-9999',
  '@lightningsimracing',
  'กรุงเทพมหานคร และปริมณฑล'
);

-- ============================================
-- Done!
-- ============================================
