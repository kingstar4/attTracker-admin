from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import uuid
import secrets
import string
import os
from functools import wraps
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///employee_tracking.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-here')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
app.config['BASE_URL'] = os.getenv('BASE_URL', 'http://localhost:5000')

# Email config
# app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
# app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_SERVER'] = os.environ['MAIL_SERVER']
app.config['MAIL_PORT'] = os.environ['MAIL_PORT']
app.config['MAIL_USE_TLS'] = os.environ['MAIL_USE_TLS']
app.config['MAIL_USERNAME'] = os.environ['MAIL_USERNAME']
app.config['MAIL_PASSWORD'] = os.environ['MAIL_PASSWORD']
app.config['MAIL_DEFAULT_SENDER'] = os.environ['MAIL_DEFAULT_SENDER']

print("MAIL_USERNAME:", app.config['MAIL_USERNAME'])
print("MAIL_PASSWORD:", app.config['MAIL_PASSWORD'])
print("MAIL_SERVER:", app.config['MAIL_SERVER'])

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
mail = Mail(app)

# ========================
# DATABASE MODELS
# ========================

class Organization(db.Model):
    __tablename__ = 'organizations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat()
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.Enum('owner', 'supervisor', 'employee', name='user_roles'), nullable=False)
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    supervisor_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)
    setup_token = db.Column(db.String(100))  # For employee account setup
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'organization_id': self.organization_id,
            'supervisor_id': self.supervisor_id,
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'created_at': self.created_at.isoformat()
        }

class EmployeeProfile(db.Model):
    __tablename__ = 'employee_profiles'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    nin = db.Column(db.String(50), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    emergency_contact_name = db.Column(db.String(100), nullable=False)
    emergency_contact_phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f"{self.first_name} {self.last_name}",
            'nin': self.nin,
            'phone_number': self.phone_number,
            'address': self.address,
            'emergency_contact_name': self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone
        }

class AttendanceRecord(db.Model):
    __tablename__ = 'attendance_records'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    clock_in_time = db.Column(db.DateTime)
    clock_out_time = db.Column(db.DateTime)
    clock_in_method = db.Column(db.Enum('fingerprint', 'otp', name='clock_methods'))
    clock_out_method = db.Column(db.Enum('fingerprint', 'otp', name='clock_methods'))
    device_ip = db.Column(db.String(45), nullable=False)
    device_id = db.Column(db.String(100))
    status = db.Column(db.Enum('present', 'late', 'absent', name='attendance_status'), default='present')
    date = db.Column(db.Date, default=datetime.utcnow().date())
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'clock_in_time': self.clock_in_time.isoformat() if self.clock_in_time else None,
            'clock_out_time': self.clock_out_time.isoformat() if self.clock_out_time else None,
            'clock_in_method': self.clock_in_method,
            'clock_out_method': self.clock_out_method,
            'status': self.status,
            'date': self.date.isoformat(),
            'device_ip': self.device_ip
        }

class LeaveRequest(db.Model):
    __tablename__ = 'leave_requests'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    supervisor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('pending', 'approved', 'rejected', name='leave_status'), default='pending')
    approved_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'supervisor_id': self.supervisor_id,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'reason': self.reason,
            'status': self.status,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'created_at': self.created_at.isoformat()
        }

class OTPLog(db.Model):
    __tablename__ = 'otp_logs'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), nullable=False)
    device_ip = db.Column(db.String(45), nullable=False)
    otp_code = db.Column(db.String(10), nullable=False)
    used = db.Column(db.Boolean, default=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ========================
# UTILITY FUNCTIONS
# ========================

def generate_otp(length=6):
    """Generate a random OTP code"""
    return ''.join(secrets.choice(string.digits) for _ in range(length))

def generate_setup_token():
    """Generate a token for employee account setup"""
    return secrets.token_urlsafe(32)

def send_email(to, subject, html_body):
    """Send email helper function"""
    if not app.config['MAIL_USERNAME']:
        print(f"Email would be sent to {to}: {subject}")
        return True
    
    try:
        msg = Message(subject=subject, recipients=[to], html=html_body)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def role_required(*allowed_roles):
    """Decorator to check user roles"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')
            if user_role not in allowed_roles:
                return jsonify({
                    'success': False,
                    'message': f'Access denied. Required roles: {", ".join(allowed_roles)}'
                }), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def success_response(data=None, message="Success"):
    """Standard success response"""
    return jsonify({
        'success': True,
        'data': data,
        'message': message
    })

def error_response(message, code=400):
    """Standard error response"""
    return jsonify({
        'success': False,
        'message': message
    }), code

# ========================
# AUTHENTICATION ROUTES
# ========================

@app.route('/api/auth/register-organization', methods=['POST'])
def register_organization():
    data = request.get_json()
    
    if not all(k in data for k in ['organization_name', 'owner_email', 'owner_password']):
        return error_response('Missing required fields')
    
    # Check if email already exists
    if User.query.filter_by(email=data['owner_email']).first():
        return error_response('Email already registered')
    
    try:
        # Create organization
        organization = Organization(
            name=data['organization_name'],
            description=data.get('description', '')
        )
        db.session.add(organization)
        db.session.flush()
        
        # Create owner
        owner = User(
            email=data['owner_email'],
            role='owner',
            organization_id=organization.id,
            email_verified=True
        )
        owner.set_password(data['owner_password'])
        
        organization.owner_id = owner.id
        db.session.add(owner)
        db.session.commit()
        
        return success_response({
            'organization': organization.to_dict(),
            'owner': owner.to_dict()
        }, 'Organization created successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create organization: {str(e)}', 500)

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ['email', 'password']):
        return error_response('Email and password required')
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']) and user.is_active:
        additional_claims = {
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
            "organization_id": user.organization_id
        }
        
        if user.role == 'employee' and user.supervisor_id:
            additional_claims["supervisor_id"] = user.supervisor_id
        
        access_token = create_access_token(
            identity=user.id,
            additional_claims=additional_claims
        )
        
        return success_response({
            'access_token': access_token,
            'user': user.to_dict()
        }, 'Login successful')
    
    return error_response('Invalid credentials', 401)

@app.route('/api/auth/request-otp', methods=['POST'])
def request_otp():
    data = request.get_json()
    
    if not all(k in data for k in ['email', 'device_ip']):
        return error_response('Email and device_ip required')
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return error_response('User not found', 404)
    
    # Check for suspicious activity (same IP requesting for multiple users)
    recent_otps = OTPLog.query.filter(
        OTPLog.device_ip == data['device_ip'],
        OTPLog.created_at > datetime.utcnow() - timedelta(hours=1)
    ).all()
    
    unique_emails = set([otp.email for otp in recent_otps])
    if len(unique_emails) > 2:  # Flag if more than 2 different users from same device
        return error_response('Suspicious activity detected. Contact administrator.', 403)
    
    # Generate and save OTP
    otp_code = generate_otp()
    otp_log = OTPLog(
        email=data['email'],
        device_ip=data['device_ip'],
        otp_code=otp_code,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    
    db.session.add(otp_log)
    db.session.commit()
    
    # Send OTP email
    email_body = f"""
    <h3>Your OTP Code</h3>
    <p>Your OTP code for attendance is: <strong>{otp_code}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    """
    
    send_email(data['email'], 'Your OTP Code', email_body)
    
    return success_response(None, 'OTP sent successfully')

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    
    if not all(k in data for k in ['email', 'otp_code', 'device_ip']):
        return error_response('Email, OTP code, and device_ip required')
    
    otp_log = OTPLog.query.filter_by(
        email=data['email'],
        otp_code=data['otp_code'],
        device_ip=data['device_ip'],
        used=False
    ).filter(OTPLog.expires_at > datetime.utcnow()).first()
    
    if not otp_log:
        return error_response('Invalid or expired OTP', 400)
    
    # Mark OTP as used
    otp_log.used = True
    db.session.commit()
    
    return success_response(None, 'OTP verified successfully')

# ========================
# OWNER ROUTES
# ========================

@app.route('/api/owner/supervisors', methods=['POST'])
@role_required('owner')
def create_supervisor():
    data = request.get_json()
    claims = get_jwt()
    
    if not all(k in data for k in ['email', 'first_name', 'last_name']):
        return error_response('Missing required fields')
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return error_response('Email already registered')
    
    try:
        # Create supervisor user
        supervisor = User(
            email=data['email'],
            role='supervisor',
            organization_id=claims['organization_id'],
            email_verified=False,
            setup_token=generate_setup_token()
        )
        
        # First add and flush to get the ID
        db.session.add(supervisor)
        db.session.flush()
        
        # Now create profile with the user_id
        profile = EmployeeProfile(
            user_id=supervisor.id,  # Now we have the ID
            first_name=data['first_name'],
            last_name=data['last_name'],
            nin=data.get('nin', ''),
            phone_number=data.get('phone_number', ''),
            address=data.get('address', ''),
            emergency_contact_name=data.get('emergency_contact_name', ''),
            emergency_contact_phone=data.get('emergency_contact_phone', '')
        )
        
        db.session.add(profile)
        db.session.commit()
        
        # Send setup email
        setup_url = f"http://localhost:5000/setup-account?token={supervisor.setup_token}"
        # setup_url = f"{app.config['BASE_URL']}/setup-account?token={supervisor.setup_token}"
        email_body = f"""
        <h3>Supervisor Account Created</h3>
        <p>Hello {data['first_name']},</p>
        <p>A supervisor account has been created for you. Click the link below to set up your password:</p>
        <p><a href="{setup_url}">Set up your account</a></p>
        """
        
        send_email(data['email'], 'Supervisor Account Setup', email_body)
        
        return success_response({
            'supervisor': supervisor.to_dict(),
            'profile': profile.to_dict()
        }, 'Supervisor created successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create supervisor: {str(e)}', 500)

@app.route('/api/owner/dashboard', methods=['GET'])
@role_required('owner')
def owner_dashboard():
    claims = get_jwt()
    org_id = claims['organization_id']
    
    # Get all employees in organization
    employees = User.query.filter_by(organization_id=org_id, role='employee').all()
    supervisors = User.query.filter_by(organization_id=org_id, role='supervisor').all()
    
    # Get today's attendance
    today = datetime.utcnow().date()
    today_attendance = AttendanceRecord.query.filter_by(date=today).join(User).filter(User.organization_id == org_id).all()
    
    # Get pending leave requests
    pending_leaves = LeaveRequest.query.join(User).filter(
        User.organization_id == org_id,
        LeaveRequest.status == 'pending'
    ).all()
    
    return success_response({
        'organization_stats': {
            'total_supervisors': len(supervisors),
            'total_employees': len(employees),
            'present_today': len(today_attendance),
            'pending_leave_requests': len(pending_leaves)
        },
        'recent_attendance': [att.to_dict() for att in today_attendance[:10]],
        'pending_leaves': [leave.to_dict() for leave in pending_leaves[:10]]
    })

# ========================
# SUPERVISOR ROUTES
# ========================

@app.route('/api/supervisor/employees', methods=['POST'])
@role_required('supervisor')
def create_employee():
    data = request.get_json()
    claims = get_jwt()
    
    required_fields = ['email', 'first_name', 'last_name', 'nin', 'phone_number', 'address', 'emergency_contact_name', 'emergency_contact_phone']
    if not all(k in data for k in required_fields):
        return error_response('Missing required fields')
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return error_response('Email already registered')
    
    try:
        # Create employee user first
        employee = User(
            email=data['email'],
            role='employee',
            organization_id=claims['organization_id'],
            supervisor_id=claims['user_id'],
            email_verified=False,
            setup_token=generate_setup_token()
        )
        
        # Add and flush to get the ID
        db.session.add(employee)
        db.session.flush()
        
        # Now create profile with the employee's ID
        profile = EmployeeProfile(
            user_id=employee.id,  # Now we have the ID
            first_name=data['first_name'],
            last_name=data['last_name'],
            nin=data['nin'],
            phone_number=data['phone_number'],
            address=data['address'],
            emergency_contact_name=data['emergency_contact_name'],
            emergency_contact_phone=data['emergency_contact_phone']
        )
        
        db.session.add(profile)
        db.session.commit()
        
        # Send setup email
        setup_url = f"http://localhost:5000/setup-account?token={employee.setup_token}"
        # setup_url = f"{app.config['BASE_URL']}/setup-account?token={employee.setup_token}"
        email_body = f"""
        <h3>Employee Account Created</h3>
        <p>Hello {data['first_name']},</p>
        <p>An employee account has been created for you. Click the link below to set up your password:</p>
        <p><a href="{setup_url}">Set up your account</a></p>
        """
        
        send_email(data['email'], 'Employee Account Setup', email_body)
        
        return success_response({
            'employee': employee.to_dict(),
            'profile': profile.to_dict()
        }, 'Employee created successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create employee: {str(e)}', 500)

@app.route('/api/supervisor/employees', methods=['GET'])
@role_required('supervisor')
def get_employees():
    claims = get_jwt()
    
    employees = db.session.query(User, EmployeeProfile).join(EmployeeProfile).filter(
        User.supervisor_id == claims['user_id']
    ).all()
    
    result = []
    for user, profile in employees:
        employee_data = user.to_dict()
        employee_data.update(profile.to_dict())
        result.append(employee_data)
    
    return success_response(result)

@app.route('/api/supervisor/attendance/clock-in', methods=['POST'])
@role_required('supervisor')
def clock_in_employee():
    data = request.get_json()
    
    if not all(k in data for k in ['employee_id', 'method', 'device_ip']):
        return error_response('Missing required fields')
    
    # Check if employee belongs to this supervisor
    claims = get_jwt()
    employee = User.query.filter_by(id=data['employee_id'], supervisor_id=claims['user_id']).first()
    if not employee:
        return error_response('Employee not found or access denied', 404)
    
    # Check if already clocked in today
    today = datetime.utcnow().date()
    existing_record = AttendanceRecord.query.filter_by(
        employee_id=data['employee_id'],
        date=today
    ).first()
    
    if existing_record and existing_record.clock_in_time:
        return error_response('Employee already clocked in today')
    
    # If method is OTP, verify it
    if data['method'] == 'otp':
        if 'otp_code' not in data:
            return error_response('OTP code required')
        
        # Verify OTP (this is a simplified version)
        otp_log = OTPLog.query.filter_by(
            email=employee.email,
            otp_code=data['otp_code'],
            device_ip=data['device_ip'],
            used=True  # Should have been used in verify-otp endpoint
        ).filter(OTPLog.expires_at > datetime.utcnow()).first()
        
        if not otp_log:
            return error_response('Invalid OTP')
    
    try:
        if existing_record:
            # Update existing record
            existing_record.clock_in_time = datetime.utcnow()
            existing_record.clock_in_method = data['method']
            existing_record.device_ip = data['device_ip']
            existing_record.device_id = data.get('device_id')
        else:
            # Create new record
            attendance = AttendanceRecord(
                employee_id=data['employee_id'],
                clock_in_time=datetime.utcnow(),
                clock_in_method=data['method'],
                device_ip=data['device_ip'],
                device_id=data.get('device_id'),
                date=today
            )
            db.session.add(attendance)
        
        db.session.commit()
        return success_response(None, 'Employee clocked in successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to clock in: {str(e)}', 500)

@app.route('/api/supervisor/attendance/clock-out', methods=['POST'])
@role_required('supervisor')
def clock_out_employee():
    data = request.get_json()
    
    if not all(k in data for k in ['employee_id', 'method', 'device_ip']):
        return error_response('Missing required fields')
    
    # Check if employee belongs to this supervisor
    claims = get_jwt()
    employee = User.query.filter_by(id=data['employee_id'], supervisor_id=claims['user_id']).first()
    if not employee:
        return error_response('Employee not found or access denied', 404)
    
    # Find today's attendance record
    today = datetime.utcnow().date()
    attendance = AttendanceRecord.query.filter_by(
        employee_id=data['employee_id'],
        date=today
    ).first()
    
    if not attendance or not attendance.clock_in_time:
        return error_response('Employee has not clocked in today')
    
    if attendance.clock_out_time:
        return error_response('Employee already clocked out today')
    
    # If method is OTP, verify it
    if data['method'] == 'otp':
        if 'otp_code' not in data:
            return error_response('OTP code required')
        
        otp_log = OTPLog.query.filter_by(
            email=employee.email,
            otp_code=data['otp_code'],
            device_ip=data['device_ip'],
            used=True
        ).filter(OTPLog.expires_at > datetime.utcnow()).first()
        
        if not otp_log:
            return error_response('Invalid OTP')
    
    try:
        attendance.clock_out_time = datetime.utcnow()
        attendance.clock_out_method = data['method']
        db.session.commit()
        
        return success_response(None, 'Employee clocked out successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to clock out: {str(e)}', 500)

@app.route('/api/supervisor/attendance/today', methods=['GET'])
@role_required('supervisor')
def today_attendance():
    claims = get_jwt()
    today = datetime.utcnow().date()
    
    # Get all employees under this supervisor
    employees = User.query.filter_by(supervisor_id=claims['user_id']).all()
    
    result = []
    for employee in employees:
        # Get employee profile
        profile = EmployeeProfile.query.filter_by(user_id=employee.id).first()
        
        # Get today's attendance
        attendance = AttendanceRecord.query.filter_by(
            employee_id=employee.id,
            date=today
        ).first()
        
        employee_data = {
            'id': employee.id,
            'name': f"{profile.first_name} {profile.last_name}" if profile else employee.email,
            'email': employee.email,
            'clock_in_time': attendance.clock_in_time.strftime('%H:%M:%S') if attendance and attendance.clock_in_time else None,
            'clock_out_time': attendance.clock_out_time.strftime('%H:%M:%S') if attendance and attendance.clock_out_time else None,
            'status': attendance.status if attendance else 'absent',
            'method': attendance.clock_in_method if attendance else None
        }
        result.append(employee_data)
    
    return success_response({
        'date': today.isoformat(),
        'employees': result
    })

@app.route('/api/supervisor/leave-requests', methods=['GET'])
@role_required('supervisor')
def get_leave_requests():
    claims = get_jwt()
    
    leave_requests = LeaveRequest.query.filter_by(supervisor_id=claims['user_id']).all()
    
    result = []
    for leave in leave_requests:
        leave_data = leave.to_dict()
        
        # Get employee info
        employee = User.query.get(leave.employee_id)
        profile = EmployeeProfile.query.filter_by(user_id=employee.id).first()
        
        leave_data['employee_name'] = f"{profile.first_name} {profile.last_name}" if profile else employee.email
        leave_data['employee_email'] = employee.email
        
        result.append(leave_data)
    
    return success_response(result)

@app.route('/api/supervisor/leave-requests/<leave_id>', methods=['PUT'])
@role_required('supervisor')
def update_leave_request(leave_id):
    claims = get_jwt()
    data = request.get_json()
    
    if 'status' not in data or data['status'] not in ['approved', 'rejected']:
        return error_response('Valid status (approved/rejected) required')
    
    leave_request = LeaveRequest.query.filter_by(
        id=leave_id,
        supervisor_id=claims['user_id']
    ).first()
    
    if not leave_request:
        return error_response('Leave request not found', 404)
    
    try:
        leave_request.status = data['status']
        leave_request.approved_at = datetime.utcnow() if data['status'] == 'approved' else None
        db.session.commit()
        
        # Send notification email to employee
        employee = User.query.get(leave_request.employee_id)
        profile = EmployeeProfile.query.filter_by(user_id=employee.id).first()
        
        status_text = "approved" if data['status'] == 'approved' else "rejected"
        email_body = f"""
        <h3>Leave Request {status_text.title()}</h3>
        <p>Hello {profile.first_name if profile else 'Employee'},</p>
        <p>Your leave request from {leave_request.start_date} to {leave_request.end_date} has been <strong>{status_text}</strong>.</p>
        <p>Reason: {leave_request.reason}</p>
        """
        
        send_email(employee.email, f'Leave Request {status_text.title()}', email_body)
        
        return success_response(leave_request.to_dict(), f'Leave request {status_text} successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update leave request: {str(e)}', 500)

# ========================
# EMPLOYEE ROUTES
# ========================

@app.route('/api/employee/setup-password', methods=['POST'])
def setup_employee_password():
    data = request.get_json()
    
    if not all(k in data for k in ['token', 'password', 'confirm_password']):
        return error_response('Missing required fields')
    
    if data['password'] != data['confirm_password']:
        return error_response('Passwords do not match')
    
    user = User.query.filter_by(setup_token=data['token']).first()
    if not user:
        return error_response('Invalid token', 404)
    
    try:
        user.set_password(data['password'])
        user.email_verified = True
        user.setup_token = None  # Clear the token
        db.session.commit()
        
        return success_response(user.to_dict(), 'Password set successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to set password: {str(e)}', 500)

@app.route('/api/employee/profile', methods=['GET'])
@role_required('employee')
def get_employee_profile():
    claims = get_jwt()
    
    user = User.query.get(claims['user_id'])
    profile = EmployeeProfile.query.filter_by(user_id=claims['user_id']).first()
    
    result = user.to_dict()
    if profile:
        result.update(profile.to_dict())
    
    return success_response(result)

@app.route('/api/employee/attendance', methods=['GET'])
@role_required('employee')
def get_employee_attendance():
    claims = get_jwt()
    
    # Get query parameters for date range
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = AttendanceRecord.query.filter_by(employee_id=claims['user_id'])
    
    if start_date:
        query = query.filter(AttendanceRecord.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        query = query.filter(AttendanceRecord.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    attendance_records = query.order_by(AttendanceRecord.date.desc()).all()
    
    return success_response([record.to_dict() for record in attendance_records])

@app.route('/api/employee/leave-requests', methods=['POST'])
@role_required('employee')
def create_leave_request():
    claims = get_jwt()
    data = request.get_json()
    
    if not all(k in data for k in ['start_date', 'end_date', 'reason']):
        return error_response('Missing required fields')
    
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        
        if start_date > end_date:
            return error_response('Start date cannot be after end date')
        
        if start_date < datetime.utcnow().date():
            return error_response('Cannot request leave for past dates')
        
        leave_request = LeaveRequest(
            employee_id=claims['user_id'],
            supervisor_id=claims['supervisor_id'],
            start_date=start_date,
            end_date=end_date,
            reason=data['reason']
        )
        
        db.session.add(leave_request)
        db.session.commit()
        
        # Send notification email to supervisor
        supervisor = User.query.get(claims['supervisor_id'])
        employee_profile = EmployeeProfile.query.filter_by(user_id=claims['user_id']).first()
        
        email_body = f"""
        <h3>New Leave Request</h3>
        <p>A new leave request has been submitted by {employee_profile.first_name + ' ' + employee_profile.last_name if employee_profile else 'Employee'}.</p>
        <p><strong>Dates:</strong> {start_date} to {end_date}</p>
        <p><strong>Reason:</strong> {data['reason']}</p>
        <p>Please review and approve/reject this request in your dashboard.</p>
        """
        
        send_email(supervisor.email, 'New Leave Request', email_body)
        
        return success_response(leave_request.to_dict(), 'Leave request submitted successfully')
        
    except ValueError:
        return error_response('Invalid date format. Use YYYY-MM-DD')
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create leave request: {str(e)}', 500)

@app.route('/api/employee/leave-requests', methods=['GET'])
@role_required('employee')
def get_employee_leave_requests():
    claims = get_jwt()
    
    leave_requests = LeaveRequest.query.filter_by(employee_id=claims['user_id']).order_by(LeaveRequest.created_at.desc()).all()
    
    return success_response([leave.to_dict() for leave in leave_requests])

@app.route('/api/employee/dashboard', methods=['GET'])
@role_required('employee')
def employee_dashboard():
    claims = get_jwt()
    
    # Get attendance summary for current month
    from calendar import monthrange
    now = datetime.utcnow()
    start_of_month = datetime(now.year, now.month, 1).date()
    days_in_month = monthrange(now.year, now.month)[1]
    end_of_month = datetime(now.year, now.month, days_in_month).date()
    
    attendance_records = AttendanceRecord.query.filter(
        AttendanceRecord.employee_id == claims['user_id'],
        AttendanceRecord.date >= start_of_month,
        AttendanceRecord.date <= end_of_month,
        AttendanceRecord.clock_in_time.isnot(None)
    ).all()
    
    # Get recent attendance (last 7 days)
    recent_attendance = AttendanceRecord.query.filter(
        AttendanceRecord.employee_id == claims['user_id'],
        AttendanceRecord.date >= datetime.utcnow().date() - timedelta(days=7)
    ).order_by(AttendanceRecord.date.desc()).all()
    
    # Get pending leave requests
    pending_leaves = LeaveRequest.query.filter_by(
        employee_id=claims['user_id'],
        status='pending'
    ).all()
    
    # Calculate working days in month (excluding weekends for simplicity)
    working_days = 0
    current_date = start_of_month
    while current_date <= min(end_of_month, now.date()):
        if current_date.weekday() < 5:  # Monday = 0, Sunday = 6
            working_days += 1
        current_date += timedelta(days=1)
    
    attendance_percentage = (len(attendance_records) / working_days * 100) if working_days > 0 else 0
    
    return success_response({
        'attendance_summary': {
            'days_present_this_month': len(attendance_records),
            'total_working_days': working_days,
            'attendance_percentage': round(attendance_percentage, 1)
        },
        'recent_attendance': [record.to_dict() for record in recent_attendance],
        'pending_leave_requests': [leave.to_dict() for leave in pending_leaves]
    })

# ========================
# SETUP ACCOUNT PAGE
# ========================

@app.route('/setup-account', methods=['GET'])
def setup_account_page():
    token = request.args.get('token')
    if not token:
        return "Invalid setup link", 400
    
    user = User.query.filter_by(setup_token=token).first()
    if not user:
        return "Invalid or expired setup link", 400
    
    profile = EmployeeProfile.query.filter_by(user_id=user.id).first()
    name = f"{profile.first_name} {profile.last_name}" if profile else user.email
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Account Setup</title>
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }}
            .form-group {{ margin-bottom: 15px; }}
            label {{ display: block; margin-bottom: 5px; font-weight: bold; }}
            input {{ width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }}
            button {{ background: #007bff; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; }}
            button:hover {{ background: #0056b3; }}
            .error {{ color: red; margin-top: 10px; }}
            .success {{ color: green; margin-top: 10px; }}
        </style>
    </head>
    <body>
        <h2>Welcome {name}!</h2>
        <p>Please set up your account password to complete registration.</p>
        
        <form id="setupForm">
            <input type="hidden" id="token" value="{token}">
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" required minlength="6">
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" required minlength="6">
            </div>
            
            <button type="submit">Set Password</button>
        </form>
        
        <div id="message"></div>
        
        <script>
            document.getElementById('setupForm').onsubmit = function(e) {{
                e.preventDefault();
                
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const token = document.getElementById('token').value;
                const messageDiv = document.getElementById('message');
                
                if (password !== confirmPassword) {{
                    messageDiv.innerHTML = '<p class="error">Passwords do not match!</p>';
                    return;
                }}
                
                fetch('/api/employee/setup-password', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify({{
                        token: token,
                        password: password,
                        confirm_password: confirmPassword
                    }})
                }})
                .then(response => response.json())
                .then(data => {{
                    if (data.success) {{
                        messageDiv.innerHTML = '<p class="success">Password set successfully! You can now log in.</p>';
                        document.getElementById('setupForm').style.display = 'none';
                    }} else {{
                        messageDiv.innerHTML = '<p class="error">' + data.message + '</p>';
                    }}
                }})
                .catch(error => {{
                    messageDiv.innerHTML = '<p class="error">An error occurred. Please try again.</p>';
                }});
            }};
        </script>
    </body>
    </html>
    """

# @app.route('/test-email')
# def test_email():
#     try:
#         test_recipient = "amahagodspower@gmail.com"  # Change this to any email you want to test
#         msg = Message('Test Email',
#                      sender=app.config['MAIL_USERNAME'],
#                      recipients=[test_recipient])
#         msg.body = 'This is a test email from the Employee Management System.'
#         mail.send(msg)
#         return jsonify({
#             'success': True, 
#             'message': f'Email sent successfully to {test_recipient}!'
#         })
#     except Exception as e:
#         return jsonify({
#             'success': False, 
#             'error': str(e),
#             'details': 'Check your SMTP settings in .env file'
#         })

# ========================
# HEALTH CHECK
# ========================

@app.route('/health', methods=['GET'])
def health_check():
    return success_response({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Employee Tracking System API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/*',
            'owner': '/api/owner/*',
            'supervisor': '/api/supervisor/*',
            'employee': '/api/employee/*'
        }
    })

# ========================
# ERROR HANDLERS
# ========================

@app.errorhandler(404)
def not_found(error):
    return error_response('Endpoint not found', 404)

@app.errorhandler(500)
def internal_error(error):
    return error_response('Internal server error', 500)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return error_response('Token has expired', 401)

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return error_response('Invalid token', 401)

@jwt.unauthorized_loader
def missing_token_callback(error):
    return error_response('Authentication required', 401)

# ========================
# MAIN
# ========================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
        print("Starting Employee Tracking System API...")
        print("Available endpoints:")
        print("  POST /api/auth/register-organization")
        print("  POST /api/auth/login")
        print("  GET  /health")
        print("  GET  /")
    
    app.run(debug=True, host='0.0.0.0', port=5000)