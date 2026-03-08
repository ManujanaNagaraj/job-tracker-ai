import httpx
from bs4 import BeautifulSoup
import re
import json


def clean_text(text: str) -> str:
    """Clean and truncate text"""
    if not text:
        return None
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Truncate to 2000 characters
    if len(text) > 2000:
        text = text[:2000] + "..."
    return text


async def parse_job_url(url: str) -> dict:
    """
    Parse job posting URL and extract job details
    Returns dict with job_title, company, job_description, location, salary_range, job_url
    """
    result = {
        "job_title": None,
        "company": None,
        "job_description": None,
        "location": None,
        "salary_range": None,
        "job_url": url,
        "error": None
    }
    
    try:
        # Make async HTTP request
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try JSON-LD first (most reliable for job postings)
            json_ld_scripts = soup.find_all('script', type='application/ld+json')
            for script in json_ld_scripts:
                try:
                    data = json.loads(script.string)
                    # Handle array of objects or single object
                    if isinstance(data, list):
                        data = next((item for item in data if item.get('@type') == 'JobPosting'), None)
                    
                    if data and data.get('@type') == 'JobPosting':
                        result['job_title'] = data.get('title')
                        
                        # Extract company name
                        hiring_org = data.get('hiringOrganization', {})
                        if isinstance(hiring_org, dict):
                            result['company'] = hiring_org.get('name')
                        
                        # Extract description
                        desc = data.get('description')
                        result['job_description'] = clean_text(desc)
                        
                        # Extract location
                        job_location = data.get('jobLocation', {})
                        if isinstance(job_location, dict):
                            address = job_location.get('address', {})
                            if isinstance(address, dict):
                                city = address.get('addressLocality', '')
                                region = address.get('addressRegion', '')
                                result['location'] = f"{city}, {region}".strip(', ')
                        
                        # Extract salary
                        salary = data.get('baseSalary', {})
                        if isinstance(salary, dict):
                            value = salary.get('value', {})
                            if isinstance(value, dict):
                                min_val = value.get('minValue')
                                max_val = value.get('maxValue')
                                currency = value.get('currency', '$')
                                if min_val and max_val:
                                    result['salary_range'] = f"{currency}{min_val} - {currency}{max_val}"
                        
                        # If we got good data, return early
                        if result['job_title'] and result['company']:
                            return result
                except (json.JSONDecodeError, KeyError, TypeError):
                    continue
            
            # Fallback to Open Graph meta tags
            if not result['job_title']:
                og_title = soup.find('meta', property='og:title')
                if og_title:
                    result['job_title'] = og_title.get('content')
            
            if not result['company']:
                og_site = soup.find('meta', property='og:site_name')
                if og_site:
                    result['company'] = og_site.get('content')
            
            if not result['job_description']:
                og_desc = soup.find('meta', property='og:description')
                if og_desc:
                    result['job_description'] = clean_text(og_desc.get('content'))
            
            # Fallback to HTML parsing
            if not result['job_title']:
                # Try h1 tag
                h1 = soup.find('h1')
                if h1:
                    result['job_title'] = clean_text(h1.get_text())
            
            if not result['company']:
                # Try common company name selectors
                company_selectors = [
                    {'class': 'company-name'},
                    {'class': 'employer'},
                    {'itemprop': 'hiringOrganization'},
                ]
                for selector in company_selectors:
                    company_elem = soup.find(attrs=selector)
                    if company_elem:
                        result['company'] = clean_text(company_elem.get_text())
                        break
            
            if not result['job_description']:
                # Try meta description
                meta_desc = soup.find('meta', attrs={'name': 'description'})
                if meta_desc:
                    result['job_description'] = clean_text(meta_desc.get('content'))
            
            # If still no data, set error
            if not result['job_title'] and not result['company']:
                result['error'] = "Could not parse URL - please enter details manually"
            
            return result
            
    except httpx.TimeoutException:
        result['error'] = "Request timed out - please try again"
        return result
    except httpx.HTTPError as e:
        result['error'] = f"Could not fetch URL: {str(e)}"
        return result
    except Exception as e:
        result['error'] = f"Error parsing URL: {str(e)}"
        return result
