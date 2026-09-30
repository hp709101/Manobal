import re
from typing import Dict, Any, Tuple
from app.config import HELPLINES
from app.security import redact_pii

# Crisis triggers (Self-harm, suicide, acute danger)
RED_PATTERNS = [
    r'\b(suicid|kill my ?self|end my life|want to die|hang my ?self|shoot my ?self)\b',
    r'\b(no reason to live|better off dead|can\'?t go on anymore|slit my wrists|end it all)\b',
    r'\b(harm others|shoot everyone|kill someone)\b',
    r'\b(mar jana chahta|jaan dena|jeene ka man nahi|khudkushi|aatmhatya)\b'
]

# Amber triggers (Persistent low mood, insomnia, feeling overwhelmed, helplessness)
AMBER_PATTERNS = [
    r'\b(hopeless|worthless|can\'?t sleep for (?:weeks|days)|insomnia|panic attack)\b',
    r'\b(crying (?:every day|constantly)|overwhelmed|depressed|can\'?t take it)\b',
    r'\b(heavy chest|numb|completely lost|isolated|nobody cares)\b',
    r'\b(neend nahi aati|pareshan hu|bahut udas|koi rasta nahi|dum ghut raha)\b'
]

RED_REGEX = re.compile('|'.join(RED_PATTERNS), re.IGNORECASE)
AMBER_REGEX = re.compile('|'.join(AMBER_PATTERNS), re.IGNORECASE)

def process_chat_message(message: str, language: str = "en") -> Dict[str, Any]:
    """
    Evaluates message tier (Green, Amber, Red), redacts PII, applies crisis guardrails,
    and returns appropriate supportive response with minimal escalation triggers.
    """
    cleaned = redact_pii(message.strip())

    # Check Red Crisis
    if RED_REGEX.search(cleaned):
        if language == "hi":
            reply = (
                "मुझे आपकी बहुत चिंता है और आपकी सुरक्षा सबसे महत्वपूर्ण है। कृपया अकेले न रहें। "
                "हमने आपातकालीन सहायता स्क्रीन सक्रिय कर दी है। आप तुरंत हमारे सैन्य चिकित्सा अधिकारी या राष्ट्रीय टेली-मानस (14416) हेल्पलाइन से संपर्क करें।"
            )
        else:
            reply = (
                "I am deeply concerned about what you are sharing, and your safety is our utmost priority. "
                "Please do not stay alone right now. I have opened the Emergency Support Screen with 24x7 verified helplines. "
                "Please connect immediately with the Medical Officer or call Tele-MANAS (14416)."
            )
        return {
            "tier": "Red",
            "reply": reply,
            "trigger_reason": "Acute crisis / self-harm indication detected",
            "show_crisis_modal": True,
            "helplines": HELPLINES,
            "requires_immediate_welfare_alert": True,
            "can_continue_chat": False,
            "suggested_exercises": []
        }

    # Check Amber Distress
    if AMBER_REGEX.search(cleaned):
        if language == "hi":
            reply = (
                "मैं समझ सकता हूँ कि आप इस समय अत्यधिक तनाव और भारीपन महसूस कर रहे हैं। इस तरह के कठिन समय में किसी पेशेवर से बात करना बहुत मददगार होता है। "
                "क्या आप चाहेंगे कि मैं हमारे यूनिट कल्याण अधिकारी/काउंसलर को एक गोपनीय संदेश भेजूँ ताकि वे आपसे संपर्क कर सकें? "
                "आप चाहें तो पूरी तरह अज्ञात (Anonymous) रहकर भी बात कर सकते हैं।"
            )
        else:
            reply = (
                "I hear how heavy and exhausting things feel for you right now. Carrying persistent stress or sleep loss takes a real toll. "
                "Connecting with a trained welfare officer or counsellor can provide real relief and confidential support. "
                "Would you like me to notify a counsellor for you? You can also choose an anonymous-first consultation."
            )
        return {
            "tier": "Amber",
            "reply": reply,
            "trigger_reason": "Persistent distress / prolonged sleep loss / feeling overwhelmed",
            "show_crisis_modal": False,
            "helplines": HELPLINES,
            "requires_immediate_welfare_alert": False,
            "offer_counsellor_consent": True,
            "can_continue_chat": True,
            "suggested_exercises": ["box_breathing", "sleep_hygiene", "grounding"]
        }

    # Default Green (Everyday stress, venting, routine duty fatigue)
    # Context-sensitive supportive responses
    lower = cleaned.lower()
    if any(w in lower for w in ["sleep", "tired", "thaka", "neend", "exhausted"]):
        if language == "hi":
            reply = (
                "ड्यूटी और कठिन परिस्थितियों में शारीरिक और मानसिक थकान स्वाभाविक है। "
                "आज सोने से 30 मिनट पहले स्क्रीन बंद करने और बॉक्स ब्रीदिंग (Box Breathing) का अभ्यास करने का प्रयास करें। क्या आप 2 मिनट का श्वास व्यायाम शुरू करना चाहते हैं?"
            )
        else:
            reply = (
                "Operational duties and long shifts put high physical and cognitive demands on you. "
                "Fatigue is your body's signal to reset. Would you like to run through a quick 2-minute tactical box-breathing exercise to help lower your heart rate?"
            )
        suggested = ["box_breathing", "sleep_hygiene"]
    elif any(w in lower for w in ["family", "home", "ghar", "parivar", "miss"]):
        if language == "hi":
            reply = (
                "घर और परिवार से दूर रहना आसान नहीं होता, खासकर जब जिम्मेदारियाँ दोनों तरफ हों। "
                "अपने साथी जवानों से बात करना या अपनी भावनाओं को प्राइवेट जर्नल में लिखना मन को हल्का कर सकता है। याद रखें कि यह स्पेस पूरी तरह गोपनीय है।"
            )
        else:
            reply = (
                "Being stationed away from family while carrying heavy service duties is genuinely challenging. "
                "Taking a moment to write in your private journal or checking in with a trusted buddy can help ground you. This space remains completely private to you."
            )
        suggested = ["private_journal", "grounding"]
    else:
        if language == "hi":
            reply = (
                "आप जो महसूस कर रहे हैं, उसे साझा करने के लिए धन्यवाद। मनोबल साथी आपकी बात सुनने और तनाव कम करने में मदद के लिए 24x7 उपलब्ध है। "
                "आप कैसा महसूस कर रहे हैं, या क्या आप कोई विश्राम व्यायाम (Relaxation Exercise) आजमाना चाहते हैं?"
            )
        else:
            reply = (
                "Thank you for checking in. Manobal Buddy is here to listen and help you decompress. "
                "Take things one step at a time. What is on your mind today, or would you like to explore our tactical grounding tools?"
            )
        suggested = ["box_breathing", "grounding"]

    return {
        "tier": "Green",
        "reply": reply,
        "trigger_reason": "Everyday operational stress / venting",
        "show_crisis_modal": False,
        "helplines": HELPLINES,
        "requires_immediate_welfare_alert": False,
        "offer_counsellor_consent": False,
        "can_continue_chat": True,
        "suggested_exercises": suggested
    }
