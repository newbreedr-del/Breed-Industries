-- =====================================================
-- CLIENT WORK MANAGEMENT & SECRETARY SYSTEM
-- Database Setup for Breed Industries
-- =====================================================

-- -----------------------------------------------------
-- 1. CLIENTS TABLE - Store client information
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  industry TEXT NOT NULL, -- e.g., "Construction", "Retail", "Technology"
  status TEXT DEFAULT 'active', -- active, inactive, completed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------
-- 2. SERVICES TABLE - Services Breed Industries offers
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g., "Business Registration", "Tax Filing", "Website Development"
  category TEXT NOT NULL, -- e.g., "Legal", "Tech", "Financial"
  description TEXT,
  estimated_hours INTEGER, -- Estimated time to complete
  priority INTEGER DEFAULT 1, -- 1-5 priority level
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (name, category, description, estimated_hours, priority) VALUES
  ('Business Registration', 'Legal', 'Register new company with CIPC', 4, 3),
  ('Tax Registration', 'Financial', 'Register for SARS tax numbers', 3, 4),
  ('Website Development', 'Tech', 'Build and deploy company website', 40, 3),
  ('Logo & Branding Design', 'Creative', 'Create logo and brand identity', 12, 2),
  ('Business Banking Setup', 'Financial', 'Open business bank account', 2, 4),
  ('Annual Compliance', 'Legal', 'File annual returns and compliance docs', 6, 5),
  ('Marketing Strategy', 'Marketing', 'Develop marketing plan and campaigns', 20, 2),
  ('Social Media Setup', 'Marketing', 'Create and configure social accounts', 8, 2),
  ('Contract Drafting', 'Legal', 'Draft business contracts and agreements', 10, 3),
  ('Invoice System Setup', 'Tech', 'Setup automated invoicing system', 15, 3)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------
-- 3. CLIENT_TASKS TABLE - Tasks assigned to clients
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS client_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  task_name TEXT NOT NULL,
  task_description TEXT,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Reminder settings
  reminder_frequency TEXT NOT NULL, -- daily, weekly, monthly
  reminder_day INTEGER, -- Day of week (0=Sun, 6=Sat) for weekly, or day of month (1-31) for monthly
  reminder_time TIME DEFAULT '09:00', -- Time to send reminder
  
  -- Completion tracking
  last_completed_at TIMESTAMP WITH TIME ZONE,
  next_due_date DATE,
  completion_count INTEGER DEFAULT 0,
  
  -- WhatsApp notification settings
  whatsapp_enabled BOOLEAN DEFAULT true,
  whatsapp_number TEXT, -- Override client's phone if different
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------
-- 4. TASK_COMPLETION_LOG - Track when tasks are completed
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS task_completion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES client_tasks(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_by TEXT, -- Who marked it complete
  notes TEXT,
  next_scheduled_date DATE
);

-- -----------------------------------------------------
-- 5. WHATSAPP_REMINDERS - Log of sent WhatsApp messages
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS whatsapp_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES client_tasks(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- daily, weekly, monthly, overdue
  message_text TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent', -- sent, delivered, failed, pending
  error_message TEXT,
  whatsapp_message_id TEXT
);

-- -----------------------------------------------------
-- 6. SECRETARY_DASHBOARD_SETTINGS - User preferences
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS secretary_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  default_whatsapp_number TEXT,
  daily_summary_enabled BOOLEAN DEFAULT true,
  daily_summary_time TIME DEFAULT '08:00',
  overdue_alerts_enabled BOOLEAN DEFAULT true,
  reminder_sound_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------
-- INDEXES for performance
-- -----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients(industry);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_client_tasks_client_id ON client_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_client_tasks_status ON client_tasks(status);
CREATE INDEX IF NOT EXISTS idx_client_tasks_next_due ON client_tasks(next_due_date);
CREATE INDEX IF NOT EXISTS idx_client_tasks_reminder ON client_tasks(reminder_frequency, reminder_day);
CREATE INDEX IF NOT EXISTS idx_task_completion_task_id ON task_completion_log(task_id);
CREATE INDEX IF NOT EXISTS idx_task_completion_date ON task_completion_log(completed_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_reminders_sent ON whatsapp_reminders(sent_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_reminders_status ON whatsapp_reminders(status);

-- -----------------------------------------------------
-- VIEWS for easy querying
-- -----------------------------------------------------

-- View: Tasks Due Today
CREATE OR REPLACE VIEW tasks_due_today AS
SELECT 
  ct.id as task_id,
  ct.task_name,
  ct.task_description,
  ct.reminder_frequency,
  ct.next_due_date,
  ct.status,
  ct.priority,
  c.id as client_id,
  c.name as client_name,
  c.company_name,
  c.industry,
  c.phone as client_phone,
  ct.whatsapp_enabled,
  ct.whatsapp_number as task_whatsapp_override,
  s.name as service_name,
  s.category as service_category
FROM client_tasks ct
JOIN clients c ON ct.client_id = c.id
LEFT JOIN services s ON ct.service_id = s.id
WHERE ct.status IN ('pending', 'in_progress')
  AND ct.next_due_date <= CURRENT_DATE
  AND ct.whatsapp_enabled = true;

-- View: Weekly Summary
CREATE OR REPLACE VIEW client_work_summary AS
SELECT 
  c.id as client_id,
  c.name as client_name,
  c.company_name,
  c.industry,
  COUNT(ct.id) as total_tasks,
  COUNT(CASE WHEN ct.status = 'completed' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN ct.status = 'pending' THEN 1 END) as pending_tasks,
  COUNT(CASE WHEN ct.status = 'in_progress' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN ct.next_due_date < CURRENT_DATE AND ct.status != 'completed' THEN 1 END) as overdue_tasks,
  MAX(ct.last_completed_at) as last_activity
FROM clients c
LEFT JOIN client_tasks ct ON c.id = ct.client_id
GROUP BY c.id, c.name, c.company_name, c.industry;

-- -----------------------------------------------------
-- FUNCTIONS for automated updates
-- -----------------------------------------------------

-- Function: Update next due date when task is completed
CREATE OR REPLACE FUNCTION update_next_due_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate next due date based on frequency
  IF NEW.reminder_frequency = 'daily' THEN
    NEW.next_due_date := CURRENT_DATE + INTERVAL '1 day';
  ELSIF NEW.reminder_frequency = 'weekly' THEN
    NEW.next_due_date := CURRENT_DATE + INTERVAL '1 week';
  ELSIF NEW.reminder_frequency = 'monthly' THEN
    NEW.next_due_date := CURRENT_DATE + INTERVAL '1 month';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update next_due_date when task is marked complete
CREATE OR REPLACE TRIGGER trigger_update_next_due
  BEFORE UPDATE ON client_tasks
  FOR EACH ROW
  WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION update_next_due_date();

-- Function: Log completion to history
CREATE OR REPLACE FUNCTION log_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    INSERT INTO task_completion_log (task_id, client_id, completed_at, next_scheduled_date)
    VALUES (NEW.id, NEW.client_id, NOW(), NEW.next_due_date);
    
    NEW.completion_count := COALESCE(OLD.completion_count, 0) + 1;
    NEW.last_completed_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_log_completion
  BEFORE UPDATE ON client_tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_completion();

-- -----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) Policies
-- -----------------------------------------------------
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE secretary_settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all on client_tasks" ON client_tasks FOR ALL USING (true);
CREATE POLICY "Allow all on task_completion_log" ON task_completion_log FOR ALL USING (true);
CREATE POLICY "Allow all on whatsapp_reminders" ON whatsapp_reminders FOR ALL USING (true);
CREATE POLICY "Allow all on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow all on secretary_settings" ON secretary_settings FOR ALL USING (true);

-- -----------------------------------------------------
-- SUCCESS MESSAGE
-- -----------------------------------------------------
SELECT 'Client Secretary System tables created successfully!' as status;
