import json
import html
import re
from bs4 import BeautifulSoup

# === CONFIGURATION ===
INPUT_FILE = 'projects.json'
OUTPUT_FILE = 'decoded_cleaned_projects.json'

def deep_unescape(text, passes=3):
    """Unescape HTML entities multiple times to catch layers of encoding."""
    for _ in range(passes):
        text = html.unescape(text)
    return text

def strip_html_tags(text):
    """Use BeautifulSoup to strip or replace HTML tags."""
    soup = BeautifulSoup(text, "html.parser")
    return soup.get_text(separator='\n')  # replaces <br>, <p> with newlines

def normalize_whitespace(text):
    """Clean up excessive whitespace and newlines."""
    text = re.sub(r'\r\n|\r', '\n', text)  # Normalize line endings
    text = re.sub(r'\n{2,}', '\n\n', text)  # Limit to max two newlines
    text = re.sub(r'[ \t]+', ' ', text)     # Collapse spaces
    return text.strip()

def clean_text(text):
    """Combine all cleaning steps on a string."""
    if not isinstance(text, str):
        return text
    text = deep_unescape(text)
    text = strip_html_tags(text)
    text = normalize_whitespace(text)
    return text

def clean_structure(obj):
    """Recursively clean all strings in a structure."""
    if isinstance(obj, dict):
        return {k: clean_structure(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_structure(item) for item in obj]
    elif isinstance(obj, str):
        return clean_text(obj)
    else:
        return obj

# === MAIN SCRIPT ===
if __name__ == '__main__':
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cleaned_data = clean_structure(data)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, ensure_ascii=False, indent=4)

    print(f"✅ Cleaned data written to: {OUTPUT_FILE}")
