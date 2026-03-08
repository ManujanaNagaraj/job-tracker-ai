from datetime import datetime, timedelta
import random
from database import SessionLocal, engine, Base
from models import JobApplication

# Sample data
companies = ["Google", "Meta", "Amazon", "Apple", "Netflix", "Stripe", "Uber", "Airbnb", "Microsoft", "OpenAI"]
job_titles = [
    "Software Engineer",
    "Frontend Developer", 
    "Full Stack Engineer",
    "Backend Engineer",
    "ML Engineer",
    "Product Engineer",
    "Software Engineer",
    "Frontend Developer",
    "Full Stack Engineer",
    "Backend Engineer"
]
locations = ["Remote", "San Francisco CA", "New York NY", "Seattle WA", "Austin TX", "Remote", "San Francisco CA", "New York NY", "Seattle WA", "Austin TX"]
statuses = ["Applied", "Screening", "Interview", "Offer", "Rejected", "Ghosted", "Applied", "Screening", "Interview", "Applied"]
salary_ranges = ["$120k - $180k", "$100k - $150k", "$140k - $200k", "$130k - $190k", "$150k - $220k", "$110k - $160k", "$125k - $175k", "$135k - $195k", "$145k - $210k", "$120k - $170k"]

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Clear existing data
    db.query(JobApplication).delete()
    db.commit()
    
    # Create 10 sample applications
    for i in range(10):
        days_ago = random.randint(0, 30)
        applied_date = datetime.now() - timedelta(days=days_ago)
        
        application = JobApplication(
            company=companies[i],
            job_title=job_titles[i],
            job_url=f"https://{companies[i].lower()}.com/careers/job-{i+1000}",
            job_description=f"Exciting opportunity to work as a {job_titles[i]} at {companies[i]}. We are looking for passionate engineers to join our team.",
            status=statuses[i],
            applied_date=applied_date,
            salary_range=salary_ranges[i],
            location=locations[i],
            notes=f"Applied {days_ago} days ago. Waiting for response.",
            resume_version=f"Resume_v{random.randint(1, 3)}.pdf",
            reminder_sent=False,
            follow_up_date=applied_date + timedelta(days=7) if i % 3 == 0 else None
        )
        db.add(application)
    
    db.commit()
    db.close()
    
    print("✅ Database seeded with 10 job applications!")

if __name__ == "__main__":
    seed_database()
