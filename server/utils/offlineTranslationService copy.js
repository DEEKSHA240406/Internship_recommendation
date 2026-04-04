// utils/offlineTranslationService.js
// Simple, fast, offline translation - no API calls needed

class OfflineTranslationService {
  constructor() {
    // Comprehensive translation mappings for Internship Recommendation
    this.translations = {
      // Tamil translations
      "ta-IN": {
        // Technical Skills
        ரியாக்ட்: "react",
        ரியாத்: "react",
        ரியாக்: "react",
        நோட்ஜேஎஸ்: "nodejs",
        "நோட் ஜே எஸ்": "nodejs",
        நோட்: "nodejs",
        ஜாவாஸ்கிரிப்ட்: "javascript",
        பைதான்: "python",
        பைத்தான்: "python",
        ஜாவா: "java",
        எச்டிஎம்எல்: "html",
        எக்ஸ்பிரஸ்: "express",
        சிஎஸ்எஸ்: "css",
        எஸ்க்யூஎல்: "sql",
        பிஎச்பி: "php",
        மாதம்: "month",
        "சி பிளஸ் பிளஸ்": "cpp",
        சி: "c",
        ஆண்ட்ராய்டு: "android",
        ஐஓஎஸ்: "ios",
        யூனிட்டி: "unity",
        மாங்கோடிபி: "mongodb",
        மைஎஸ்க்யூஎல்: "mysql",
        போஸ்ட்கிரேஎஸ்க்யூஎல்: "postgresql",
        கிட்: "git",
        டாக்கர்: "docker",
        கூபர்நேட்ஸ்: "kubernetes",
        ஏடபிள்யூஎஸ்: "aws",
        அசூர்: "azure",
        "கூகிள் கிளவுட்": "google cloud",

        // Business Skills
        எக்செல்: "excel",
        பவர்பாயிண்ட்: "powerpoint",
        வேர்ட்: "word",
        "மைக்ரோசாப்ட் ஆபிஸ்": "microsoft office",
        ஃபோட்டோஷாப்: "photoshop",
        இல்லஸ்ட்ரேட்டர்: "illustrator",
        "காரல் ட்ரா": "corel draw",
        ஃபிக்மா: "figma",
        ஸ்கெட்ச்: "sketch",
        கேன்வா: "canva",

        // Data & Analytics
        "டேட்டா அனாலிசிஸ்": "data analysis",
        "டேட்டா சயன்ஸ்": "data science",
        "மிசின் லேர்னிங்": "machine learning",
        "ஆர்டிபிஸியல் இன்டலிஜென்ஸ்": "artificial intelligence",
        "டீப் லர்னிங்": "deep learning",
        "பிக் டேட்டா": "big data",
        "பவர் பிஐ": "power bi",
        டேப்லோ: "tableau",
        "ஆர் பிரோகிராமிங்": "r programming",
        "பைதான் பார் டேட்டா": "python for data",

        // Digital Marketing
        "டிஜிட்டல் மார்க்கெட்டிங்": "digital marketing",
        "சோஷியல் மீடியா மார்க்கெட்டிங்": "social media marketing",
        எஸ்சிஓ: "seo",
        எஸ்சிஎம்: "sem",
        "கூகிள் ஆட்ஸ்": "google ads",
        "ஃபேஸ்புக் ஆட்ஸ்": "facebook ads",
        "இன்ஸ்டாகிரம் மார்க்கெட்டிங்": "instagram marketing",
        "யூட்யூப் மார்க்கெட்டிங்": "youtube marketing",
        "இ-மெயில் மார்க்கெட்டிங்": "email marketing",
        "கண்டென்ட் மார்க்கெட்டிங்": "content marketing",

        // Industries/Interests
        "மென்பொருள் துறை": "software",
        தொழில்நுட்பம்: "technology",
        வங்கி: "banking",
        வித்து: "finance",
        சுகாதாரம்: "healthcare",
        கல்வி: "education",
        மார்க்கெட்டிங்: "marketing",
        விற்பனை: "sales",
        "மனித வளம்": "human resources",
        "கடன் துறை": "banking",
        ஊடகம்: "media",
        பொழுதுபோக்கு: "entertainment",
        விளையாட்டு: "sports",
        சுற்றுச்சூழல்: "environment",
        "சமூக சேவை": "social service",
        "சில்லறை வணிகம்": "retail",
        "இ-காமர்ஸ்": "ecommerce",
        லாஜிஸ்டிக்ஸ்: "logistics",
        ஆட்டோமொபைல்: "automobile",
        அழகுசாதனம்: "beauty",
        உணவு: "food",
        ஹோட்டல்: "hospitality",
        சுற்றுலா: "tourism",

        // Locations
        சென்னை: "chennai",
        கோயம்புத்தூர்: "coimbatore",
        மதுரை: "madurai",
        திருச்சி: "trichy",
        சேலம்: "salem",
        திருநெல்வேலி: "tirunelveli",
        வேலூர்: "vellore",
        ஈரோடு: "erode",
        தூத்துக்குடி: "thoothukudi",
        கன்னியாகுமரி: "kanyakumari",
        தமிழ்நாடு: "tamil nadu",
        பெங்களூரு: "bangalore",
        பெங்களூர்: "bangalore",
        மும்பை: "mumbai",
        டெல்லி: "delhi",
        ஹைதராபாத்: "hyderabad",
        புனே: "pune",
        அகமதாபாத்: "ahmedabad",
        கொல்கத்தா: "kolkata",
        ஜெய்ப்பூர்: "jaipur",
        லக்னோ: "lucknow",
        நாக்பூர்: "nagpur",
        இந்தூர்: "indore",
        போபால்: "bhopal",
        சண்டிகர்: "chandigarh",
        கோச்சி: "kochi",
        திருவனந்தபுரம்: "thiruvananthapuram",
      },

      // Hindi translations
      "hi-IN": {
        // Technical Skills
        रिएक्ट: "react",
        "नोड जेएस": "nodejs",
        नोड: "nodejs",
        जावास्क्रिप्ट: "javascript",
        पायथन: "python",
        जावा: "java",
        एचटीएमएल: "html",
        सीएसएस: "css",
        एसक्यूएल: "sql",
        पीएचपी: "php",
        "सी प्लस प्लस": "cpp",
        सी: "c",
        एंड्रॉइड: "android",
        आईओएस: "ios",
        यूनिटी: "unity",
        मोंगोडीबी: "mongodb",
        माईएसक्यूएल: "mysql",
        पोस्टग्रेएसक्यूएल: "postgresql",
        गिट: "git",
        डॉकर: "docker",
        कुबर्नेट्स: "kubernetes",
        एडब्ल्यूएस: "aws",
        अज़ूर: "azure",
        "गूगल क्लाउड": "google cloud",

        // Business Skills
        एक्सेल: "excel",
        पावरपॉइंट: "powerpoint",
        वर्ड: "word",
        "माइक्रोसॉफ्ट ऑफिस": "microsoft office",
        फोटोशॉप: "photoshop",
        इलस्ट्रेटर: "illustrator",
        "कोरल ड्रॉ": "corel draw",
        फिग्मा: "figma",
        स्केच: "sketch",
        कैनवा: "canva",

        // Data & Analytics
        "डेटा विश्लेषण": "data analysis",
        "डेटा साइंस": "data science",
        "मशीन लर्निंग": "machine learning",
        "कृत्रिम बुद्धिमत्ता": "artificial intelligence",
        "डीप लर्निंग": "deep learning",
        "बिग डेटा": "big data",
        "पावर बीआई": "power bi",
        टैब्लो: "tableau",
        "आर प्रोग्रामिंग": "r programming",
        "पायथन फॉर डेटा": "python for data",

        // Digital Marketing
        "डिजिटल मार्केटिंग": "digital marketing",
        "सोशल मीडिया मार्केटिंग": "social media marketing",
        एसईओ: "seo",
        एसईएम: "sem",
        "गूगल एड्स": "google ads",
        "फेसबुक एड्स": "facebook ads",
        "इंस्टाग्राम मार्केटिंग": "instagram marketing",
        "यूट्यूब मार्केटिंग": "youtube marketing",
        "ईमेल मार्केटिंग": "email marketing",
        "कंटेंट मार्केटिंग": "content marketing",

        // Industries
        सॉफ्टवेयर: "software",
        प्रौद्योगिकी: "technology",
        महीना: "month",
        बैंकिंग: "banking",
        वित्त: "finance",
        "स्वास्थ्य सेवा": "healthcare",
        शिक्षा: "education",
        विपणन: "marketing",
        बिक्री: "sales",
        "मानव संसाधन": "human resources",
        मीडिया: "media",
        मनोरंजन: "entertainment",
        खेल: "sports",
        पर्यावरण: "environment",
        "सामाजिक सेवा": "social service",
        खुदरा: "retail",
        "ई-कॉमर्स": "ecommerce",
        लॉजिस्टिक्स: "logistics",
        ऑटोमोबाइल: "automobile",
        सौंदर्य: "beauty",
        भोजन: "food",
        आतिथ्य: "hospitality",
        पर्यटन: "tourism",

        // Locations
        मुंबई: "mumbai",
        दिल्ली: "delhi",
        बेंगलुरु: "bangalore",
        हैदराबाद: "hyderabad",
        पुणे: "pune",
        अहमदाबाद: "ahmedabad",
        कोलकाता: "kolkata",
        जयपुर: "jaipur",
        लखनऊ: "lucknow",
        कानपुर: "kanpur",
        नागपुर: "nagpur",
        इंदौर: "indore",
        भोपाल: "bhopal",
        विशाखापत्तनम: "visakhapatnam",
        वडोदरा: "vadodara",
        चंडीगढ़: "chandigarh",
        कोच्चि: "kochi",
        तिरुवनंतपुरम: "thiruvananthapuram",
        गुवाहाटी: "guwahati",
        भुवनेश्वर: "bhubaneswar",
      },

      // Marathi translations
      "mr-IN": {
        // Technical Skills
        रिअॅक्ट: "react",
        "नोड जेएस": "nodejs",
        जावास्क्रिप्ट: "javascript",
        पायथन: "python",
        जावा: "java",
        एचटीएमएल: "html",
        सीएसएस: "css",
        एसक्यूएल: "sql",
        एक्सेल: "excel",
        "मायक्रोसॉफ्ट ऑफिस": "microsoft office",
        फोटोशॉप: "photoshop",
        "डेटा विश्लेषण": "data analysis",
        "मशीन लर्निंग": "machine learning",
        "डिजिटल मार्केटिंग": "digital marketing",

        // Industries
        सॉफ्टवेअर: "software",
        तंत्रज्ञान: "technology",
        बँकिंग: "banking",
        वित्त: "finance",
        "आरोग्य सेवा": "healthcare",
        शिक्षण: "education",
        विपणन: "marketing",
        विक्री: "sales",
        "मानव संसाधन": "human resources",
        मीडिया: "media",
        मनोरंजन: "entertainment",
        खेळ: "sports",
        पर्यावरण: "environment",
        "सामाजिक सेवा": "social service",

        // Locations
        मुंबई: "mumbai",
        पुणे: "pune",
        महिना: "month",
        नागपूर: "nagpur",
        नाशिक: "nashik",
        औरंगाबाद: "aurangabad",
        सोलापूर: "solapur",
        अमरावती: "amravati",
        कोल्हापूर: "kolhapur",
        अकोला: "akola",
        लातूर: "latur",
        महाराष्ट्र: "maharashtra",
      },

      // Gujarati translations
      "gu-IN": {
        // Technical Skills
        રિએક્ટ: "react",
        "નોડ જેએસ": "nodejs",
        જાવાસ્ક્રિપ્ટ: "javascript",
        પાયથન: "python",
        જાવા: "java",
        એચટીએમએલ: "html",
        સીએસએસ: "css",
        એસક્યુએલ: "sql",
        એક્સેલ: "excel",
        "માઇક્રોસોફ્ટ ઓફિસ": "microsoft office",
        ફોટોશોપ: "photoshop",
        "ડેટા એનાલિસિસ": "data analysis",
        "મશીન લર્નિંગ": "machine learning",
        "ડિજિટલ માર્કેટિંગ": "digital marketing",

        // Industries
        સોફ્ટવેર: "software",
        મહિનો: "month",
        ટેક્નોલોજી: "technology",
        બેંકિંગ: "banking",
        ફાઇનાન્સ: "finance",
        હેલ્થકેર: "healthcare",
        એજ્યુકેશન: "education",
        માર્કેટિંગ: "marketing",
        સેલ્સ: "sales",
        "હ્યુમન રિસોર્સ": "human resources",
        મીડિયા: "media",
        એન્ટરટેઇનમેન્ટ: "entertainment",
        સ્પોર્ટ્સ: "sports",
        એન્વાયરમેન્ટ: "environment",
        "સોશિયલ સર્વિસ": "social service",

        // Locations
        અમદાવાદ: "ahmedabad",
        સુરત: "surat",
        વડોદરા: "vadodara",
        રાજકોટ: "rajkot",
        ભાવનગર: "bhavnagar",
        જામનગર: "jamnagar",
        ગાંધીનગર: "gandhinagar",
        જુનાગઢ: "junagadh",
        નડિયાદ: "nadiad",
        મોરબી: "morbi",
        ગુજરાત: "gujarat",
      },
    };
  }

  // Translate single term
  translateTerm(term, language) {
    if (!term || typeof term !== "string") {
      return ""; // Return empty string for invalid terms
    }

    if (language === "en-IN") {
      return term.toLowerCase().trim();
    }

    const langMappings = this.translations[language];
    if (!langMappings) {
      return term.toLowerCase().trim();
    }

    const normalizedTerm = term.toLowerCase().trim();
    return langMappings[normalizedTerm] || normalizedTerm;
  }

  // Translate array of terms
  translateArray(terms, language) {
    if (!Array.isArray(terms)) return [];
    return terms
      .filter((term) => term && typeof term === "string") // Filter out invalid terms
      .map((term) => this.translateTerm(term, language))
      .filter(Boolean); // Remove empty results
  }

  // Enhanced fuzzy matching
  findBestMatch(inputTerm, language) {
    const directTranslation = this.translateTerm(inputTerm, language);
    if (directTranslation !== inputTerm.toLowerCase()) {
      return directTranslation;
    }

    // If no direct match, try partial matching
    const langMappings = this.translations[language];
    if (!langMappings) return inputTerm.toLowerCase();

    const normalizedInput = inputTerm.toLowerCase().trim();

    // Find partial matches
    for (const [localTerm, englishTerm] of Object.entries(langMappings)) {
      if (
        normalizedInput.includes(localTerm) ||
        localTerm.includes(normalizedInput)
      ) {
        return englishTerm;
      }
    }

    return inputTerm.toLowerCase();
  }

  // Translate complete profile
  translateProfile(profileData) {
    const language = profileData.language || "en-IN";

    return {
      ...profileData,
      skills: this.translateArray(profileData.skills || [], language),
      sector_interests: this.translateArray(
        profileData.sector_interests || [],
        language,
      ),
      preferred_locations: this.translateArray(
        profileData.preferred_locations || [],
        language,
      ),
    };
  }

  // Enhanced matching for recommendations
  enhancedMatch(userTerm, internshipTerms, language) {
    const translatedUserTerm = this.findBestMatch(userTerm, language);

    return internshipTerms.some((internshipTerm) => {
      const lowerInternshipTerm = internshipTerm.toLowerCase();
      const lowerUserTerm = translatedUserTerm.toLowerCase();

      // Exact match
      if (lowerUserTerm === lowerInternshipTerm) return true;

      // Partial match
      if (
        lowerUserTerm.includes(lowerInternshipTerm) ||
        lowerInternshipTerm.includes(lowerUserTerm)
      )
        return true;

      // Check for common variations
      return this.checkCommonVariations(lowerUserTerm, lowerInternshipTerm);
    });
  }

  // Check common technical term variations
  checkCommonVariations(term1, term2) {
    const variations = {
      javascript: ["js", "javascript", "java script"],
      react: ["reactjs", "react.js"],
      nodejs: ["node", "node.js"],
      "artificial intelligence": ["ai", "machine learning", "aiml", "aids"],
      "machine learning": ["ml", "ai", "aiml"],
      "web development": ["web dev", "frontend", "backend"],
      "data analysis": ["data analytics", "analytics"],
      "digital marketing": ["online marketing", "social media marketing"],
    };

    const term1Variations = variations[term1] || [term1];
    const term2Variations = variations[term2] || [term2];

    return term1Variations.some((v1) =>
      term2Variations.some((v2) => v1.includes(v2) || v2.includes(v1)),
    );
  }

  // Get stats
  getStats() {
    const stats = {};
    for (const [lang, mappings] of Object.entries(this.translations)) {
      stats[lang] = Object.keys(mappings).length;
    }
    return {
      supportedLanguages: Object.keys(this.translations),
      termsPerLanguage: stats,
      totalTerms: Object.values(stats).reduce((sum, count) => sum + count, 0),
    };
  }
}

module.exports = new OfflineTranslationService();
