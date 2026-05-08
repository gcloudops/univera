CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'applicant',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    duration_years INTEGER,
    total_seats INTEGER,
    available_seats INTEGER,
    fee_per_semester DECIMAL(10,2),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    course_id UUID REFERENCES courses(id),
    phone VARCHAR(20),
    percentage DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    course_id UUID REFERENCES courses(id),
    semester INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_type VARCHAR(50),
    amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    leave_type VARCHAR(50),
    from_date DATE,
    to_date DATE,
    days INTEGER,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO departments (name,code) VALUES
    ('Computer Science','CS'),
    ('Business Administration','MBA'),
    ('Electronics Engineering','EC')
ON CONFLICT DO NOTHING;

INSERT INTO courses (name,code,department_id,duration_years,total_seats,available_seats,fee_per_semester,description)
SELECT 'B.S. Computer Science','BSCS',id,4,120,120,18500,'AI, Systems, Cybersecurity'
FROM departments WHERE code='CS' ON CONFLICT DO NOTHING;

INSERT INTO courses (name,code,department_id,duration_years,total_seats,available_seats,fee_per_semester,description)
SELECT 'Master of Business Admin','MBA',id,2,60,60,24000,'Full-time and Executive MBA'
FROM departments WHERE code='MBA' ON CONFLICT DO NOTHING;