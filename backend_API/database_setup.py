#!/usr/bin/env python3
"""
Database Setup Script for Employee Tracking System
Run this file to create tables and optionally seed with test data
"""

import os
import sys
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

# Add the current directory to Python path to import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Organization, User, EmployeeProfile, AttendanceRecord, LeaveRequest, OTPLog

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created successfully!")
            return True
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            return False

def drop_tables():
    """Drop all database tables (use with caution!)"""
    print("⚠️  Dropping all database tables...")
    response = input("Are you sure? This will delete all data! (yes/no): ")
    if response.lower() == 'yes':
        with app.app_context():
            try:
                db.drop_all()
                print("✅ All tables dropped successfully!")
                return True
            except Exception as e:
                print(f"❌ Error dropping tables: {e}")
                return False
    else:
        print("❌ Operation cancelled")
        return False

def seed_test_data():
    """Add test data to the database"""
    print("Seeding database with test data...")
    
    with app.app_context():
        try:
            # Check if data already exists
            if Organization.query.first():
                print("⚠️  Database already contains data. Skipping seed.")
                return True
            
            # Create test organization
            org = Organization(
                name="ABC Construction Company",
                description="Main construction projects and site management"
            )
            db.session.add(org)
            db.session.flush()  # Get the ID
            
            # Create owner
            owner = User(
                email="owner@abc.com",
                role='owner',
                organization_id=org.id,
                email_verified=True
            )
            owner.set_password("password123")
            org.owner_id = owner.id
            db.session.add(owner)
            
            # Create supervisor 1
            supervisor1 = User(
                email="supervisor1@abc.com",
                role='supervisor',
                organization_id=org.id,
                email_verified=True
            )
            supervisor1.set_password("password123")
            db.session.add(supervisor1)
            
            # Create supervisor 1 profile
            supervisor1_profile = EmployeeProfile(
                user_id=supervisor1.id,
                first_name="John",
                last_name="Smith",
                nin="11111111111",
                phone_number="+1234567890",
                address="123 Supervisor St, City, State",
                emergency_contact_name="Jane Smith",
                emergency_contact_phone="+1234567891"
            )
            db.session.add(supervisor1_profile)
            
            # Create supervisor 2
            supervisor2 = User(
                email="supervisor2@abc.com",
                role='supervisor',
                organization_id=org.id,
                email_verified=True
            )
            supervisor2.set_password("password123")
            db.session.add(supervisor2)
            
            # Create supervisor 2 profile
            supervisor2_profile = EmployeeProfile(
                user_id=supervisor2.id,
                first_name="Sarah",
                last_name="Johnson",
                nin="22222222222",
                phone_number="+1234567892",
                address="456 Supervisor Ave, City, State",
                emergency_contact_name="Mike Johnson",
                emergency_contact_phone="+1234567893"
            )
            db.session.add(supervisor2_profile)
            
            db.session.flush()  # Get supervisor IDs
            
            # Create employees under supervisor 1
            employees_data = [
                {
                    "email": "employee1@abc.com",
                    "first_name": "Alice",
                    "last_name": "Wilson",
                    "nin": "33333333333",
                    "supervisor_id": supervisor1.id
                },
                {
                    "email": "employee2@abc.com",
                    "first_name": "Bob",
                    "last_name": "Davis",
                    "nin": "44444444444",
                    "supervisor_id": supervisor1.id
                },
                {
                    "email": "employee3@abc.com",
                    "first_name": "Charlie",
                    "last_name": "Brown",
                    "nin": "55555555555",
                    "supervisor_id": supervisor1.id
                }
            ]
            
            # Create employees under supervisor 2
            employees_data.extend([
                {
                    "email": "employee4@abc.com",
                    "first_name": "Diana",
                    "last_name": "Miller",
                    "nin": "66666666666",
                    "supervisor_id": supervisor2.id
                },
                {
                    "email": "employee5@abc.com",
                    "first_name": "Edward",
                    "last_name": "Garcia",
                    "nin": "77777777777",
                    "supervisor_id": supervisor2.id
                }
            ])
            
            employees = []
            for i, emp_data in enumerate(employees_data, 1):
                employee = User(
                    email=emp_data["email"],
                    role='employee',
                    organization_id=org.id,
                    supervisor_id=emp_data["supervisor_id"],
                    email_verified=True
                )
                employee.set_password("password123")
                db.session.add(employee)
                employees.append(employee)
                
                # Create employee profile
                profile = EmployeeProfile(
                    user_id=employee.id,
                    first_name=emp_data["first_name"],
                    last_name=emp_data["last_name"],
                    nin=emp_data["nin"],
                    phone_number=f"+123456789{i}",
                    address=f"{i}00 Employee St, City, State",
                    emergency_contact_name=f"Emergency Contact {i}",
                    emergency_contact_phone=f"+198765432{i}"
                )
                db.session.add(profile)
            
            db.session.flush()  # Get employee IDs
            
            # Create some sample attendance records (last 5 days)
            print("Creating sample attendance records...")
            for day_offset in range(5):
                date = datetime.utcnow().date() - timedelta(days=day_offset)
                
                for employee in employees[:4]:  # 4 out of 5 employees attended
                    clock_in_time = datetime.combine(date, datetime.min.time()) + timedelta(hours=8, minutes=30)
                    clock_out_time = clock_in_time + timedelta(hours=8)
                    
                    attendance = AttendanceRecord(
                        employee_id=employee.id,
                        clock_in_time=clock_in_time,
                        clock_out_time=clock_out_time,
                        clock_in_method='fingerprint',
                        clock_out_method='fingerprint',
                        device_ip='192.168.1.100',
                        device_id='device_001',
                        date=date
                    )
                    db.session.add(attendance)
            
            # Create some sample leave requests
            print("Creating sample leave requests...")
            leave_requests_data = [
                {
                    "employee": employees[0],
                    "supervisor_id": supervisor1.id,
                    "start_date": datetime.utcnow().date() + timedelta(days=10),
                    "end_date": datetime.utcnow().date() + timedelta(days=12),
                    "reason": "Family vacation",
                    "status": "pending"
                },
                {
                    "employee": employees[1],
                    "supervisor_id": supervisor1.id,
                    "start_date": datetime.utcnow().date() + timedelta(days=5),
                    "end_date": datetime.utcnow().date() + timedelta(days=5),
                    "reason": "Medical appointment",
                    "status": "approved"
                },
                {
                    "employee": employees[3],
                    "supervisor_id": supervisor2.id,
                    "start_date": datetime.utcnow().date() + timedelta(days=15),
                    "end_date": datetime.utcnow().date() + timedelta(days=17),
                    "reason": "Personal emergency",
                    "status": "pending"
                }
            ]
            
            for leave_data in leave_requests_data:
                leave_request = LeaveRequest(
                    employee_id=leave_data["employee"].id,
                    supervisor_id=leave_data["supervisor_id"],
                    start_date=leave_data["start_date"],
                    end_date=leave_data["end_date"],
                    reason=leave_data["reason"],
                    status=leave_data["status"]
                )
                if leave_data["status"] == "approved":
                    leave_request.approved_at = datetime.utcnow()
                
                db.session.add(leave_request)
            
            # Commit all changes
            db.session.commit()
            print("✅ Test data created successfully!")
            
            # Print login credentials
            print("\n" + "="*50)
            print("TEST LOGIN CREDENTIALS")
            print("="*50)
            print("Owner:")
            print("  Email: owner@abc.com")
            print("  Password: password123")
            print()
            print("Supervisors:")
            print("  Email: supervisor1@abc.com")
            print("  Password: password123")
            print("  Email: supervisor2@abc.com")  
            print("  Password: password123")
            print()
            print("Employees:")
            for i, emp in enumerate(employees, 1):
                print(f"  Email: employee{i}@abc.com")
                print(f"  Password: password123")
            print("="*50)
            
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding data: {e}")
            return False

def show_database_info():
    """Show information about the current database"""
    print("Database Information:")
    print(f"Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    with app.app_context():
        try:
            # Count records in each table
            org_count = Organization.query.count()
            user_count = User.query.count()
            profile_count = EmployeeProfile.query.count()
            attendance_count = AttendanceRecord.query.count()
            leave_count = LeaveRequest.query.count()
            otp_count = OTPLog.query.count()
            
            print(f"Organizations: {org_count}")
            print(f"Users: {user_count}")
            print(f"Employee Profiles: {profile_count}")
            print(f"Attendance Records: {attendance_count}")
            print(f"Leave Requests: {leave_count}")
            print(f"OTP Logs: {otp_count}")
            
            if user_count > 0:
                print("\nUser breakdown:")
                owners = User.query.filter_by(role='owner').count()
                supervisors = User.query.filter_by(role='supervisor').count()
                employees = User.query.filter_by(role='employee').count()
                print(f"  Owners: {owners}")
                print(f"  Supervisors: {supervisors}")
                print(f"  Employees: {employees}")
            
        except Exception as e:
            print(f"❌ Error getting database info: {e}")

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print("Employee Tracking System - Database Setup")
        print("Usage:")
        print("  python database_setup.py create    - Create database tables")
        print("  python database_setup.py drop      - Drop all tables (DESTRUCTIVE!)")
        print("  python database_setup.py seed      - Add test data")
        print("  python database_setup.py reset     - Drop, create, and seed")
        print("  python database_setup.py info      - Show database information")
        return
    
    command = sys.argv[1].lower()
    
    if command == 'create':
        create_tables()
    
    elif command == 'drop':
        drop_tables()
    
    elif command == 'seed':
        if create_tables():  # Ensure tables exist first
            seed_test_data()
    
    elif command == 'reset':
        if drop_tables():
            if create_tables():
                seed_test_data()
    
    elif command == 'info':
        show_database_info()
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Use 'python database_setup.py' to see available commands")

if __name__ == '__main__':
    main()
