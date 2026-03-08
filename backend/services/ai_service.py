import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
client = None
api_key = os.getenv('OPENAI_API_KEY')
if api_key:
    client = AsyncOpenAI(api_key=api_key)


async def generate_resume_tips(
    job_title: str,
    company: str,
    job_description: str,
    resume_summary: str = None
) -> dict:
    """
    Generate AI-powered resume tips, keywords, interview questions, and cover letter advice
    """
    if not client:
        return {
            "error": "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file"
        }
    
    prompt = f"""You are an expert career coach and resume consultant.
Analyze this job posting and provide specific, actionable advice.

Job Title: {job_title}
Company: {company}
Job Description: {job_description[:1500]}

Provide the following in JSON format:
{{
  "keywords": ["keyword1", "keyword2", ...],  // 8-10 important keywords from job description
  "resume_tips": ["tip1", "tip2", ...],  // 5 specific resume improvement suggestions
  "cover_letter_opener": "One strong opening paragraph for a cover letter",
  "interview_questions": ["question1", "question2", ...],  // 5 likely interview questions
  "skills_to_highlight": ["skill1", "skill2", ...]  // 5 key skills to emphasize
}}

Return ONLY valid JSON, no markdown formatting."""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional career coach. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith('```json'):
            content = content[7:]
        if content.startswith('```'):
            content = content[3:]
        if content.endswith('```'):
            content = content[:-3]
        content = content.strip()
        
        # Parse JSON response
        result = json.loads(content)
        return result
        
    except json.JSONDecodeError as e:
        return {
            "error": "Failed to parse AI response",
            "resume_tips": [content] if content else []
        }
    except Exception as e:
        return {
            "error": f"AI service error: {str(e)}"
        }


async def generate_cover_letter(
    job_title: str,
    company: str, 
    job_description: str,
    user_background: str
) -> str:
    """
    Generate a full cover letter based on job details and user background
    """
    if not client:
        return "OpenAI API key not configured"
    
    prompt = f"""Write a professional cover letter for this job application:

Job Title: {job_title}
Company: {company}
Job Description: {job_description[:1000]}

Applicant Background: {user_background}

Write a concise, professional cover letter (3-4 paragraphs) that:
1. Opens with a strong hook
2. Highlights relevant skills and experience
3. Shows enthusiasm for the role and company
4. Closes with a call to action

Return only the cover letter text, no additional formatting."""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional cover letter writer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        return f"Error generating cover letter: {str(e)}"
