import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple

# Pre-defined military and welfare tags
TAG_KEYWORDS = {
    "bereavement": [
        "death", "died", "passed away", "expired", "funeral", "lost family", 
        "road accident", "cremation", "fatal", "father demise", "mother demise", "brother died"
    ],
    "family_illness": [
        "hospital", "cancer", "surgery", "icu", "critical illness", "paralysis", 
        "heart attack", "chemotherapy", "medical emergency", "ailing parents"
    ],
    "financial_strain": [
        "debt", "loan", "moneylender", "property dispute", "mortgage", "scam", 
        "bank notice", "bankruptcy", "legal fees", "land grabbing"
    ],
    "conflict": [
        "dispute", "fight", "court case", "divorce", "marital", "separation", 
        "domestic violence", "police case", "property litigate"
    ],
    "injury": [
        "fracture", "gunshot", "splinter", "rehab", "physio", "hospitalized", 
        "ligament tear", "blast injury", "amputation"
    ],
    "deployment_strain": [
        "siachen", "high altitude", "loc", "border post", "continuous patrol", 
        "cold injury", "isolated post", "extended standoff", "sub-zero"
    ]
}

def analyze_remark(free_text: str, user_selected_tags: List[str] = None) -> Dict[str, Any]:
    """
    NLP & Keyword based extraction for life-event tags and proposed severity.
    Does NOT diagnose psychological conditions. Returns proposed severity for human review.
    """
    text_lower = free_text.lower()
    detected_tags = set(user_selected_tags or [])

    for tag, keywords in TAG_KEYWORDS.items():
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                detected_tags.add(tag)
                break

    # Determine proposed life-event severity
    # Bereavement, ICU/critical illness, or acute debt are categorized as High severity life events
    high_severity_matches = ["bereavement", "injury"]
    moderate_severity_matches = ["family_illness", "financial_strain", "conflict", "deployment_strain"]

    if any(t in detected_tags for t in high_severity_matches):
        proposed_severity = "High"
    elif any(t in detected_tags for t in moderate_severity_matches):
        proposed_severity = "Moderate"
    elif detected_tags:
        proposed_severity = "Low"
    else:
        # Check text length / sentiment keywords
        if any(w in text_lower for w in ["urgent", "severe", "critical", "immediate", "emergency"]):
            proposed_severity = "Moderate"
        else:
            proposed_severity = "Low"

    # Default expiry: 90 days for review
    expiry_date = (datetime.utcnow() + timedelta(days=90)).strftime("%Y-%m-%d")

    return {
        "tags": list(detected_tags),
        "proposed_severity": proposed_severity,
        "is_human_confirmed": False,
        "suggested_expiry_date": expiry_date,
        "notice": "Severity is an automated life-event classification and requires human verification."
    }
