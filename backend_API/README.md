# Employee Tracking System API

A simple Flask-based REST API for tracking employees, attendance, and leave requests within an organization. Features role-based access control with three user types: Project Owners, Supervisors, and Employees.

## Features

- **Multi-role Authentication** (Owner, Supervisor, Employee)
- **Attendance Tracking** with fingerprint and OTP fallback
- **Leave Management System** with approval workflow
- **Real-time Dashboard** data for all user types
- **Email Notifications** for account setup and leave requests
- **Security Features** including OTP fraud detection
- **RESTful API** with JWT authentication

## Quick Start

### 1. Installation

```bash
# Clone or download the project files
# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Setup

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your settings
# At minimum, change the SECRET_KEY and JWT_SECRET_KEY
```

### 3. Database Setup

```bash
# Create database tables
python database_setup.py create

# Add test data (optional but recommended for trying out the API)
python database_setup.py seed

# Or do both in one step
python database_setup.py reset
```

### 4. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Test Credentials (if you ran seed command)

### Owner Account
- **Email**: `owner@abc.com`
- **Password**: `password123`

### Supervisor Accounts
- **Email**: `supervisor1@abc.com` / **Password**: `password123`
- **Email**: `supervisor2@abc.com` / **Password**: `password123`

### Employee Accounts
- **Email**: `employee1@abc.com` through `employee5@abc.com`
- **Password**: `password123` (for all)

## API Endpoints

### Authentication
- `POST /api/auth/register-organization` - Create new organization and owner
- `POST /api/auth/login` - Login for all user types
- `POST /api/auth/request-otp` - Request OTP for attendance
- `POST /api/auth/verify-otp` - Verify OTP code

### Owner Endpoints
- `POST /api/owner/supervisors` - Create supervisor accounts
- `GET /api/owner/dashboard` - Get organization overview
- `GET /api/owner/employees` - Get all employees
- `GET /api/owner/attendance-summary` - Get attendance analytics

### Supervisor Endpoints
- `POST /api/supervisor/employees` - Register new employees
- `GET /api/supervisor/employees` - Get supervised employees
- `POST /api/supervisor/attendance/clock-in` - Clock in employee
- `POST /api/supervisor/attendance/clock-out` - Clock out employee
- `GET /api/supervisor/attendance/today` - Get today's attendance
- `GET /api/supervisor/leave-requests` - Get leave requests
- `PUT /api/supervisor/leave-requests/:id` - Approve/reject leave

### Employee Endpoints
- `POST /api/employee/setup-password` - Complete account setup
- `GET /api/employee/profile` - Get own profile
- `GET /api/employee/attendance` - Get attendance history
- `POST /api/employee/leave-requests` - Request leave
- `GET /api/employee/leave-requests` - Get own leave requests
- `GET /api/employee/dashboard` - Get employee dashboard

## Usage Examples

### 1. Create Organization (First Step)

```bash
curl -X POST http://localhost:5000/api/auth/register-organization \
  -H "Content-Type: application/json" \
  -d '{
    "organization_name": "My Company",
    "owner_email": "owner@mycompany.com",
    "owner_password": "securepassword",
    "description": "My construction company"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@mycompany.com",
    "password": "securepassword"
  }'
```

### 3. Create Supervisor (as Owner)

```bash
curl -X POST http://localhost:5000/api/owner/supervisors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "supervisor@mycompany.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "address": "123 Main St"
  }'
```

### 4. Register Employee (as Supervisor)

```bash
curl -X POST http://localhost:5000/api/supervisor/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "employee@mycompany.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "nin": "1234567890",
    "phone_number": "+1234567891",
    "address": "456 Oak Ave",
    "emergency_contact_name": "John Smith",
    "emergency_contact_phone": "+1234567892"
  }'
```

### 5. Clock In Employee (as Supervisor)

```bash
curl -X POST http://localhost:5000/api/supervisor/attendance/clock-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employee_id": "EMPLOYEE_UUID",
    "method": "fingerprint",
    "device_ip": "192.168.1.100",
    "device_id": "device_001"
  }'
```

### 6. Request Leave (as Employee)

```bash
curl -X POST http://localhost:5000/api/employee/leave-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "start_date": "2024-02-01",
    "end_date": "2024-02-03",
    "reason": "Family vacation"
  }'
```

## Database Commands

```bash
# Show database information
python database_setup.py info

# Create tables only
python database_setup.py create

# Add test data only (tables must exist)
python database_setup.py seed

# Drop all tables (DESTRUCTIVE!)
python database_setup.py drop

# Reset everything (drop, create, seed)
python database_setup.py reset
```

## Email Configuration

To enable email notifications (for OTP and account setup):

1. Update `.env` file with your email settings
2. For Gmail, use an "App Password" instead of your regular password
3. Enable "Less secure app access" or use OAuth2 for production

Example Gmail setup:
```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
```

## Security Features

- **JWT Authentication** with role-based access control
- **OTP Fraud Detection** - flags suspicious activity when same device requests OTP for multiple users
- **Device Tracking** - logs all clock-in/out activities with IP and device ID
- **Rate Limiting Ready** - structured to easily add rate limiting
- **Password Hashing** using Werkzeug's secure methods

## File Structure

```
employee-tracking-api/
├── app.py                 # Main application file
├── database_setup.py      # Database creation and seeding
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .env                  # Your environment variables (create this)
├── README.md             # This file
└── employee_tracking.db  # SQLite database (created automatically)
```

## Database Schema

The system uses 6 main tables:
- `organizations` - Company/project information
- `users` - All user types (owner, supervisor, employee)
- `employee_profiles` - Detailed employee information
- `attendance_records` - Clock in/out records
- `leave_requests` - Leave applications and approvals
- `otp_logs` - OTP tracking for security

## Development Tips

1. **Start with test data**: Run `python database_setup.py seed` to get started quickly
2. **Check logs**: The app prints helpful information to the console
3. **Test with curl**: Use the examples above to test API endpoints
4. **Use JWT tokens**: Save the token from login response for subsequent requests
5. **Check database**: Use `python database_setup.py info` to see current data

## Production Deployment

For production use:

1. Change `FLASK_ENV=production` in `.env`
2. Use a proper database (PostgreSQL/MySQL) instead of SQLite
3. Set strong, unique values for `SECRET_KEY` and `JWT_SECRET_KEY`
4. Configure proper email settings
5. Add HTTPS/SSL termination
6. Consider using Redis for rate limiting
7. Add proper logging and monitoring

## Troubleshooting

### Common Issues

1. **"Module not found" error**: Make sure you activated the virtual environment
2. **"Table doesn't exist"**: Run `python database_setup.py create`
3. **"Invalid token" error**: Make sure to include `Bearer ` before the JWT token
4. **Email not sending**: Check email configuration in `.env` file
5. **Permission denied**: Make sure JWT token has correct role for the endpoint

### Getting Help

1. Check the console output for error messages
2. Use `python database_setup.py info` to verify database state
3. Test with the provided test credentials first
4. Verify your `.env` file configuration

## License

This project is created for educational and business use. Modify as needed for your requirements.