// utils/offlineTranslationService.js
// Complete offline translation with education eligibility support

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
        மாதங்கள்: "months",
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

        // Education qualifications - Degree and Stream focused
        "பி.எஸ்சி": "b.sc",
        "பி.எஸ்சி.": "b.sc",
        "பி.ஸி": "b.sc",
        "பேச்சலர் ஆஃப் சயின்ஸ்": "bachelor of science",
        "விஞ்ஞான பட்டம்": "bachelor of science",
        "பி.சி.ஏ": "bca",
        "பி.சி.ஏ.": "bca",
        "பேச்சலர் ஆஃப் கம்ப்யூட்டர் அப்ளிகேஷன்":
          "bachelor of computer applications",
        "கம்ப்யூட்டர் அப்ளிகேஷன் பட்டம்": "bachelor of computer applications",
        "பி.காம்": "b.com",
        "பி.காம்.": "b.com",
        "பேச்சலர் ஆஃப் காமர்ஸ்": "bachelor of commerce",
        "வணிகவியல் பட்டம்": "bachelor of commerce",
        "பி.ஏ": "b.a",
        "பி.ஏ.": "b.a",
        "பேச்சலர் ஆஃப் ஆர்ட்ஸ்": "bachelor of arts",
        "கலை பட்டம்": "bachelor of arts",
        "பி.டெக்": "b.tech",
        "பி.டெக்.": "b.tech",
        "பி டெக்.": "b.tech",
        "பேச்சலர் ஆஃப் டெக்னாலஜி": "bachelor of technology",
        "தொழில்நுட்ப பட்டம்": "bachelor of technology",
        "பி.இ": "b.e",
        "பி.இ.": "b.e",
        "பி இ": "b.e",
        பிஇ: "b.e",
        "பேச்சலர் ஆஃப் இன்ஜினியரிங்": "bachelor of engineering",
        "பொறியியல் பட்டம்": "bachelor of engineering",
        "எம்.டெக்": "m.tech",
        "எம்.டெக்.": "m.tech",
        "மாஸ்டர் ஆஃப் டெக்னாலஜி": "master of technology",
        "எம்.எஸ்சி": "m.sc",
        "எம்.எஸ்சி.": "m.sc",
        "மாஸ்டர் ஆஃப் சயின்ஸ்": "master of science",
        "எம்.பி.ஏ": "mba",
        "எம்.பி.ஏ.": "mba",
        "மாஸ்டர் ஆஃப் பிசினஸ் அட்மினிஸ்ட்ரேஷன்":
          "master of business administration",
        "எம்.சி.ஏ": "mca",
        "எம்.சி.ஏ.": "mca",
        "மாஸ்டர் ஆஃப் கம்ப்யூட்டர் அப்ளிகேஷன்":
          "master of computer applications",
        "பி.பார்ம்": "b.pharm",
        "பி.பார்ம்.": "b.pharm",
        "பேச்சலர் ஆஃப் பார்மசி": "bachelor of pharmacy",
        "எம்.பார்ம்": "m.pharm",
        "எம்.பார்ம்.": "m.pharm",
        "மாஸ்டர் ஆஃப் பார்மசி": "master of pharmacy",

        // Diploma qualifications
        டிப்ளோமா: "diploma",
        "இன்ஜினியரிங் டிப்ளோமா": "diploma in engineering",
        "கம்ப்யூட்டர் டிப்ளோமா": "diploma in computer",
        பாலிடெக்னிக்: "polytechnic",

        // Specific streams/specializations
        "கம்ப்யூட்டர் சயின்ஸ்": "computer science",
        "கம்ப்யூட்டர் அறிவியல்": "computer science",
        "இன்ஃபர்மேஷன் டெக்னாலஜி": "information technology",
        "தகவல் தொழில்நுட்பம்": "information technology",
        "எலெக்ட்ரானிக்ஸ் அண்ட் கம்யூனிகேஷன்": "electronics and communication",
        "மின்னணுவியல் மற்றும் தகவல் தொடர்பு": "electronics and communication",
        "மெக்கானிக்கல் இன்ஜினியரிங்": "mechanical engineering",
        "இயந்திர பொறியியல்": "mechanical engineering",
        "சிவில் இன்ஜினியரிங்": "civil engineering",
        "கட்டடக் கலை பொறியியல்": "civil engineering",
        "எலெக்ட்ரிக்கல் இன்ஜினியரிங்": "electrical engineering",
        "மின்சார பொறியியல்": "electrical engineering",
        "கெமிக்கல் இன்ஜினியரிங்": "chemical engineering",
        "வேதியியல் பொறியியல்": "chemical engineering",
        "ஏரோநாட்டிக்கல் இன்ஜினியரிங்": "aeronautical engineering",
        "விமான பொறியியல்": "aeronautical engineering",
        "ஆட்டோமொபைல் இன்ஜினியரிங்": "automobile engineering",
        "வாகன பொறியியல்": "automobile engineering",
        "பயோ டெக்னாலஜி": "biotechnology",
        "உயிரி தொழில்நுட்பம்": "biotechnology",
        "பயோ மெடிக்கல் இன்ஜினியரிங்": "biomedical engineering",

        // Commerce streams
        அக்கவுண்டிங்: "accounting",
        கணக்கியல்: "accounting",
        "பிசினஸ் அட்மினிஸ்ட்ரேஷன்": "business administration",
        "வணிக நிர்வாகம்": "business administration",
        பைனான்ஸ்: "finance",
        நிதியியல்: "finance",
        மார்க்கெட்டிங்: "marketing",
        சந்தைப்படுத்தல்: "marketing",
        "இ-காமர்ஸ்": "ecommerce",
        "மின்னணு வணிகம்": "ecommerce",
        "மிசின் லேர்னிங்": "machine learning",

        // Arts streams
        இங்கிலிஷ்: "english",
        ஆங்கிலம்: "english",
        தமிழ்: "tamil",
        தமிழியல்: "tamil",
        ஹிஸ்டரி: "history",
        வரலாறு: "history",
        சைக்காலஜி: "psychology",
        உளவியல்: "psychology",
        சோஷியாலஜி: "sociology",
        சமூகவியல்: "sociology",
        ஜர்னலிசம்: "journalism",
        பத்திரிகையியல்: "journalism",
        "மாஸ் கம்யூனிகேஷன்": "mass communication",
        "வெகுஜன தொடர்பு": "mass communication",

        // Science streams
        பிசிக்ஸ்: "physics",
        இயற்பியல்: "physics",
        கெமிஸ்ட்ரி: "chemistry",
        வேதியியல்: "chemistry",
        மேத்ஸ்: "mathematics",
        கணிதம்: "mathematics",
        பயாலஜி: "biology",
        உயிரியல்: "biology",
        "மைக்ரோ பயாலஜி": "microbiology",
        நுண்ணுயிரியல்: "microbiology",
        ஸ்டேடிஸ்டிக்ஸ்: "statistics",
        புள்ளியியல்: "statistics",

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
        महीने: "months",
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

        // Education qualifications - Degree and Stream focused
        "बी.एससी": "b.sc",
        "बी.एससी.": "b.sc",
        "बैचलर ऑफ साइंस": "bachelor of science",
        "विज्ञान स्नातक": "bachelor of science",
        "बी.सी.ए": "bca",
        "बी.सी.ए.": "bca",
        "बैचलर ऑफ कंप्यूटर एप्लीकेशन": "bachelor of computer applications",
        "कंप्यूटर एप्लीकेशन स्नातक": "bachelor of computer applications",
        "बी.कॉम": "b.com",
        "बी.कॉम.": "b.com",
        "बैचलर ऑफ कॉमर्स": "bachelor of commerce",
        "वाणिज्य स्नातक": "bachelor of commerce",
        "बी.ए": "b.a",
        "बी.ए.": "b.a",
        "बैचलर ऑफ आर्ट्स": "bachelor of arts",
        "कला स्नातक": "bachelor of arts",
        "बी.टेक": "b.tech",
        "बी.टेक.": "b.tech",
        "बैचलर ऑफ टेक्नोलॉजी": "bachelor of technology",
        "प्रौद्योगिकी स्नातक": "bachelor of technology",
        "बी.ई": "b.e",
        "बी.ई.": "b.e",
        "बैचलर ऑफ इंजीनियरिंग": "bachelor of engineering",
        "इंजीनियरिंग स्नातक": "bachelor of engineering",
        "एम.टेक": "m.tech",
        "एम.टेक.": "m.tech",
        "मास्टर ऑफ टेक्नोलॉजी": "master of technology",
        "एम.एससी": "m.sc",
        "एम.एससी.": "m.sc",
        "मास्टर ऑफ साइंस": "master of science",
        "विज्ञान परास्नातक": "master of science",
        "एम.बी.ए": "mba",
        "एम.बी.ए.": "mba",
        "मास्टर ऑफ बिजनेस एडमिनिस्ट्रेशन": "master of business administration",
        "एम.सी.ए": "mca",
        "एम.सी.ए.": "mca",
        "मास्टर ऑफ कंप्यूटर एप्लीकेशन": "master of computer applications",
        "बी.फार्म": "b.pharm",
        "बी.फार्म.": "b.pharm",
        "बैचलर ऑफ फार्मेसी": "bachelor of pharmacy",
        "एम.फार्म": "m.pharm",
        "एम.फार्म.": "m.pharm",
        "मास्टर ऑफ फार्मेसी": "master of pharmacy",

        // Diploma qualifications
        डिप्लोमा: "diploma",
        "इंजीनियरिंग डिप्लोमा": "diploma in engineering",
        "कंप्यूटर डिप्लोमा": "diploma in computer",
        पॉलिटेक्निक: "polytechnic",

        // Specific streams/specializations
        "कंप्यूटर साइंस": "computer science",
        "कंप्यूटर विज्ञान": "computer science",
        "इन्फॉर्मेशन टेक्नोलॉजी": "information technology",
        "सूचना प्रौद्योगिकी": "information technology",
        "इलेक्ट्रॉनिक्स एंड कम्युनिकेशन": "electronics and communication",
        "इलेक्ट्रॉनिक्स और संचार": "electronics and communication",
        "मैकेनिकल इंजीनियरिंग": "mechanical engineering",
        "यांत्रिक अभियांत्रिकी": "mechanical engineering",
        "सिविल इंजीनियरिंग": "civil engineering",
        "निर्माण अभियांत्रिकी": "civil engineering",
        "इलेक्ट्रिकल इंजीनियरिंग": "electrical engineering",
        "विद्युत अभियांत्रिकी": "electrical engineering",
        "केमिकल इंजीनियरिंग": "chemical engineering",
        "रासायनिक अभियांत्रिकी": "chemical engineering",
        "एरोनॉटिकल इंजीनियरिंग": "aeronautical engineering",
        "वैमानिकी अभियांत्रिकी": "aeronautical engineering",
        "ऑटोमोबाइल इंजीनियरिंग": "automobile engineering",
        "मोटर वाहन अभियांत्रिकी": "automobile engineering",
        "बायो टेक्नोलॉजी": "biotechnology",
        "जैव प्रौद्योगिकी": "biotechnology",
        "बायो मेडिकल इंजीनियरिंग": "biomedical engineering",

        // Commerce streams
        लेखांकन: "accounting",
        अकाउंटिंग: "accounting",
        "बिजनेस एडमिनिस्ट्रेशन": "business administration",
        "व्यापार प्रशासन": "business administration",
        वित्त: "finance",
        फाइनेंस: "finance",
        मार्केटिंग: "marketing",
        विपणन: "marketing",
        "ई-कॉमर्स": "ecommerce",
        "इलेक्ट्रॉनिक कॉमर्स": "ecommerce",

        // Arts streams
        अंग्रेजी: "english",
        इंग्लिश: "english",
        हिंदी: "hindi",
        हिन्दी: "hindi",
        इतिहास: "history",
        हिस्ट्री: "history",
        मनोविज्ञान: "psychology",
        साइकोलॉजी: "psychology",
        समाजशास्त्र: "sociology",
        सोशियोलॉजी: "sociology",
        पत्रकारिता: "journalism",
        जर्नलिज्म: "journalism",
        जनसंचार: "mass communication",
        "मास कम्युनिकेशन": "mass communication",

        // Science streams
        भौतिकी: "physics",
        फिजिक्स: "physics",
        रसायन: "chemistry",
        केमिस्ट्री: "chemistry",
        गणित: "mathematics",
        मैथ्स: "mathematics",
        "जीव विज्ञान": "biology",
        बायोलॉजी: "biology",
        "सूक्ष्म जीव विज्ञान": "microbiology",
        "माइक्रो बायोलॉजी": "microbiology",
        सांख्यिकी: "statistics",
        स्टेटिस्टिक्स: "statistics",

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
        महिना: "month",
        महिने: "months",

        // Education qualifications - Degree and Stream focused
        "बी.एससी": "b.sc",
        "बी.एससी.": "b.sc",
        "बॅचलर ऑफ सायन्स": "bachelor of science",
        "विज्ञान पदवी": "bachelor of science",
        "बी.सी.ए": "bca",
        "बी.सी.ए.": "bca",
        "बॅचलर ऑफ कॉम्प्युटर अप्लिकेशन": "bachelor of computer applications",
        "संगणक अनुप्रयोग पदवी": "bachelor of computer applications",
        "बी.कॉम": "b.com",
        "बी.कॉम.": "b.com",
        "बॅचलर ऑफ कॉमर्स": "bachelor of commerce",
        "वाणिज्य पदवी": "bachelor of commerce",
        "बी.ए": "b.a",
        "बी.ए.": "b.a",
        "बॅचलर ऑफ आर्ट्स": "bachelor of arts",
        "कला पदवी": "bachelor of arts",
        "बी.टेक": "b.tech",
        "बी.टेक.": "b.tech",
        "बॅचलर ऑफ टेक्नॉलॉजी": "bachelor of technology",
        "तंत्रज्ञान पदवी": "bachelor of technology",
        "बी.ई": "b.e",
        "बी.ई.": "b.e",
        "बॅचलर ऑफ इंजिनीअरिंग": "bachelor of engineering",
        "अभियांत्रिकी पदवी": "bachelor of engineering",
        "एम.टेक": "m.tech",
        "एम.एससी": "m.sc",
        "एम.बी.ए": "mba",
        "एम.सी.ए": "mca",

        // Diploma qualifications
        डिप्लोमा: "diploma",
        "अभियांत्रिकी डिप्लोमा": "diploma in engineering",
        "संगणक डिप्लोमा": "diploma in computer",
        पॉलिटेक्निक: "polytechnic",

        // Specific streams/specializations
        "संगणक शास्त्र": "computer science",
        "कॉम्प्युटर सायन्स": "computer science",
        "माहिती तंत्रज्ञान": "information technology",
        "इन्फॉर्मेशन टेक्नॉलॉजी": "information technology",
        "इलेक्ट्रॉनिक्स आणि संदेशवहन": "electronics and communication",
        "यांत्रिक अभियांत्रिकी": "mechanical engineering",
        "मेकॅनिकल इंजिनीअरिंग": "mechanical engineering",
        "बांधकाम अभियांत्रिकी": "civil engineering",
        "सिव्हिल इंजिनीअरिंग": "civil engineering",
        "विद्युत अभियांत्रिकी": "electrical engineering",
        "इलेक्ट्रिकल इंजिनीअरिंग": "electrical engineering",
        "रासायनिक अभियांत्रिकी": "chemical engineering",
        "केमिकल इंजिनीअरिंग": "chemical engineering",
        "जैव तंत्रज्ञान": "biotechnology",
        "बायो टेक्नॉलॉजी": "biotechnology",

        // Locations
        मुंबई: "mumbai",
        पुणे: "pune",
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
        મહિને: "months",
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

        // Education qualifications - Degree and Stream focused
        "બી.એસસી": "b.sc",
        "બી.એસસી.": "b.sc",
        "બેચલર ઓફ સાયન્સ": "bachelor of science",
        "વિજ્ઞાન સ્નાતક": "bachelor of science",
        "બી.સી.એ": "bca",
        "બી.સી.એ.": "bca",
        "બેચલર ઓફ કમ્પ્યુટર એપ્લિકેશન": "bachelor of computer applications",
        "કમ્પ્યુટર એપ્લિકેશન સ્નાતક": "bachelor of computer applications",
        "બી.કોમ": "b.com",
        "બી.કોમ.": "b.com",
        "બેચલર ઓફ કોમર્સ": "bachelor of commerce",
        "વાણિજ્ય સ્નાતક": "bachelor of commerce",
        "બી.એ": "b.a",
        "બી.એ.": "b.a",
        "બેચલર ઓફ આર્ટ્સ": "bachelor of arts",
        "કલા સ્નાતક": "bachelor of arts",
        "બી.ટેક": "b.tech",
        "બી.ટેક.": "b.tech",
        "બેચલર ઓફ ટેકનોલોજી": "bachelor of technology",
        "ટેકનોલોજી સ્નાતક": "bachelor of technology",
        "બી.ઈ": "b.e",
        "બી.ઈ.": "b.e",
        "બેચલર ઓફ એન્જિનિયરિંગ": "bachelor of engineering",
        "એન્જિનિયરિંગ સ્નાતક": "bachelor of engineering",
        "એમ.ટેક": "m.tech",
        "એમ.એસસી": "m.sc",
        "એમ.બી.એ": "mba",
        "એમ.સી.એ": "mca",

        // Diploma qualifications
        ડિપ્લોમા: "diploma",
        "એન્જિનિયરિંગ ડિપ્લોમા": "diploma in engineering",
        "કમ્પ્યુટર ડિપ્લોમા": "diploma in computer",
        પોલિટેકનિક: "polytechnic",

        // Specific streams/specializations
        "કમ્પ્યુટર સાયન્સ": "computer science",
        "કમ્પ્યુટર વિજ્ઞાન": "computer science",
        "માહિતી ટેકનોલોજી": "information technology",
        "ઇન્ફોર્મેશન ટેકનોલોજી": "information technology",
        "ઈલેક્ટ્રોનિક્સ અને કમ્યુનિકેશન": "electronics and communication",
        "યાંત્રિક અભિયાંત્રિકી": "mechanical engineering",
        "મિકેનિકલ એન્જિનિયરિંગ": "mechanical engineering",
        "સિવિલ એન્જિનિયરિંગ": "civil engineering",
        "બાંધકામ અભિયાંત્રિકી": "civil engineering",
        "વિદ્યુત અભિયાંત્રિકી": "electrical engineering",
        "ઈલેક્ટ્રિકલ એન્જિનિયરિંગ": "electrical engineering",
        "રાસાયણિક અભિયાંત્રિકી": "chemical engineering",
        "કેમિકલ એન્જિનિયરિંગ": "chemical engineering",
        "જૈવ ટેકનોલોજી": "biotechnology",
        "બાયો ટેકનોલોજી": "biotechnology",

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

    // Education hierarchy for eligibility checking (degree-based)
    this.educationHierarchy = {
      // Diploma level (Level 1)
      diploma: 1,
      polytechnic: 1,
      "diploma in engineering": 1,
      "diploma in computer": 1,

      // Bachelor's level (Level 2)
      "b.sc": 2,
      "b.com": 2,
      "b.a": 2,
      bca: 2,
      "bachelor of science": 2,
      "bachelor of arts": 2,
      "bachelor of commerce": 2,
      "bachelor of computer applications": 2,

      // Professional Bachelor's (Level 3)
      "b.tech": 3,
      "b.e": 3,
      "b.pharm": 3,
      "bachelor of engineering": 3,
      "bachelor of technology": 3,
      "bachelor of pharmacy": 3,

      // Master's level (Level 4)
      "m.sc": 4,
      "m.tech": 4,
      mca: 4,
      mba: 4,
      "m.pharm": 4,
      "master of science": 4,
      "master of technology": 4,
      "master of computer applications": 4,
      "master of business administration": 4,
      "master of pharmacy": 4,
    };

    this.currentLanguage = "en-IN";
  }

  // Translate single term
  translateTerm(term, language) {
    if (!term || typeof term !== "string") {
      return ""; // Return empty string for invalid terms
    }

    if (language === "en-IN") {
      return term.toLowerCase().trim();
    }

    // Handle duration format (6 months/years/days/hours)
    if (
      /^\d+\s*(month|months|year|years|day|days|hour|hours)$/i.test(term.trim())
    ) {
      const parts = term.trim().split(/\s+/);
      const numberPart = parts[0];
      const unitPart = parts[1].toLowerCase();

      const unitTranslations = {
        "ta-IN": {
          month: "மாதம்",
          months: "மாதங்கள்",
          year: "ஆண்டு",
          years: "ஆண்டுகள்",
          day: "நாள்",
          days: "நாட்கள்",
          hour: "மணி",
          hours: "மணிகள்",
        },
        "hi-IN": {
          month: "महीना",
          months: "महीने",
          year: "साल",
          years: "साल",
          day: "दिन",
          days: "दिन",
          hour: "घंटा",
          hours: "घंटे",
        },
        "mr-IN": {
          month: "महिना",
          months: "महिने",
          year: "वर्ष",
          years: "वर्षे",
          day: "दिवस",
          days: "दिवस",
          hour: "तास",
          hours: "तास",
        },
        "gu-IN": {
          month: "મહિનો",
          months: "મહિને",
          year: "વર્ષ",
          years: "વર્ષો",
          day: "દિવસ",
          days: "દિવસો",
          hour: "કલાક",
          hours: "કલાકો",
        },
      };

      const translatedUnit = unitTranslations[language]
        ? unitTranslations[language][unitPart]
        : unitPart;
      if (translatedUnit) {
        return `${numberPart} ${translatedUnit}`;
      } else {
        return term.toLowerCase().trim();
      }
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
      .filter((term) => term && typeof term === "string")
      .map((term) => this.translateTerm(term, language))
      .filter(Boolean);
  }

  // Enhanced fuzzy matching
  findBestMatch(inputTerm, language) {
    const directTranslation = this.translateTerm(inputTerm, language);
    if (directTranslation !== inputTerm.toLowerCase()) {
      return directTranslation;
    }

    const langMappings = this.translations[language];
    if (!langMappings) return inputTerm.toLowerCase();

    const normalizedInput = inputTerm.toLowerCase().trim();

    return inputTerm.toLowerCase();
  }

  // Enhanced translate term method to handle complex education strings
  translateEducationTerm(term, language) {
    if (!term || typeof term !== "string") {
      return "";
    }

    if (language === "en-IN") {
      return term.toLowerCase().trim();
    }

    const normalizedTerm = term.toLowerCase().trim();

    // First try direct translation
    const langMappings = this.translations[language];
    if (langMappings && langMappings[normalizedTerm]) {
      return langMappings[normalizedTerm];
    }

    // Enhanced degree extraction with specialization handling
    const degreeExtractionMap = {
      "ta-IN": {
        // Main degree patterns
        "பி\\s*டெக்": "b.tech",
        "பி\\s*இ": "b.e",
        "பி\\s*எஸ்சி": "b.sc",
        "பி\\s*காம்": "b.com",
        "பி\\s*ஏ": "b.a",
        "பி\\s*சி\\s*ஏ": "bca",
        "எம்\\s*டெக்": "m.tech",
        "எம்\\s*எஸ்சி": "m.sc",
        "எம்\\s*பி\\s*ஏ": "mba",
        "எம்\\s*சி\\s*ஏ": "mca",
        டிப்ளோமா: "diploma",
      },
      "hi-IN": {
        "बी\\s*टेक": "b.tech",
        "बी\\s*ई": "b.e",
        "बी\\s*एससी": "b.sc",
        "बी\\s*कॉम": "b.com",
        "बी\\s*ए": "b.a",
        "बी\\s*सी\\s*ए": "bca",
        "एम\\s*टेक": "m.tech",
        "एम\\s*एससी": "m.sc",
        "एम\\s*बी\\s*ए": "mba",
        "एम\\s*सी\\s*ए": "mca",
        डिप्लोमा: "diploma",
      },
      "mr-IN": {
        "बी\\s*टेक": "b.tech",
        "बी\\s*ई": "b.e",
        "बी\\s*एससी": "b.sc",
        "बी\\s*कॉम": "b.com",
        "बी\\s*ए": "b.a",
        "बी\\s*सी\\s*ए": "bca",
        "एम\\s*टेक": "m.tech",
        "एम\\s*एससी": "m.sc",
        "एम\\s*बी\\s*ए": "mba",
        "एम\\s*सी\\s*ए": "mca",
        डिप्लोमा: "diploma",
      },
      "gu-IN": {
        "બી\\s*ટેક": "b.tech",
        "બી\\s*ઈ": "b.e",
        "બી\\s*એસસી": "b.sc",
        "બી\\s*કોમ": "b.com",
        "બી\\s*એ": "b.a",
        "બી\\s*સી\\s*એ": "bca",
        "એમ\\s*ટેક": "m.tech",
        "એમ\\s*એસસી": "m.sc",
        "એમ\\s*બી\\s*એ": "mba",
        "એમ\\s*સી\\s*એ": "mca",
        ડિપ્લોમા: "diploma",
      },
    };

    const extractionMap = degreeExtractionMap[language];
    if (extractionMap) {
      // Try to find any degree pattern in the string
      for (const [pattern, englishDegree] of Object.entries(extractionMap)) {
        const regex = new RegExp(pattern, "gi");
        if (regex.test(normalizedTerm)) {
          console.log(
            `Found degree pattern "${pattern}" -> "${englishDegree}" in: ${normalizedTerm}`,
          );

          // Also try to extract specialization if present
          const specialization = this.extractSpecialization(
            normalizedTerm,
            language,
          );
          if (specialization) {
            return `${englishDegree} ${specialization}`;
          }

          return englishDegree;
        }
      }
    }

    console.log(`No degree pattern found for: ${normalizedTerm}`);
    return normalizedTerm;
  }

  // Helper method to extract specialization from education string
  extractSpecialization(educationString, language) {
    const specializationMappings = {
      "ta-IN": {
        "ஆர்ட்டிஃபிஷியல் இன்டெலிஜென்ஸ் அண்ட் மிசின் லேர்னிங்":
          "artificial intelligence and machine learning",
        "ஆர்ட்டிஃபிஷியல் இன்டெலிஜென்ஸ்": "artificial intelligence",
        "மிசின் லேர்னிங்": "machine learning",
        "கம்ப்யூட்டர் சயின்ஸ் அண்ட் இன்ஜினியரிங்":
          "computer science and engineering",
        "கம்ப்யூட்டர் அறிவியல்": "computer science",
        "இன்ஃபர்மேஷன் டெக்னாலஜி": "information technology",
        "தகவல் தொழில்நுட்பம்": "information technology",
        எலெக்ட்ரானிக்ஸ்: "electronics",
        மின்னணுவியல்: "electronics",
        மெக்கானிக்கல்: "mechanical",
        இயந்திர: "mechanical",
        சிவில்: "civil",
        "கட்டடக் கலை": "civil",
        எலெக்ட்ரிக்கல்: "electrical",
        மின்சார: "electrical",
      },
      "hi-IN": {
        "कृत्रिम बुद्धिमत्ता": "artificial intelligence",
        "मशीन लर्निंग": "machine learning",
        "कंप्यूटर साइंस": "computer science",
        "कंप्यूटर विज्ञान": "computer science",
        "सूचना प्रौद्योगिकी": "information technology",
        इलेक्ट्रॉनिक्स: "electronics",
        यांत्रिक: "mechanical",
        निर्माण: "civil",
        विद्युत: "electrical",
      },
      "mr-IN": {
        "कृत्रिम बुद्धिमत्ता": "artificial intelligence",
        "मशीन लर्निंग": "machine learning",
        "संगणक शास्त्र": "computer science",
        "माहिती तंत्रज्ञान": "information technology",
        इलेक्ट्रॉनिक्स: "electronics",
        यांत्रिक: "mechanical",
        बांधकाम: "civil",
        विद्युत: "electrical",
      },
      "gu-IN": {
        "કૃત્રિમ બુદ્ધિ": "artificial intelligence",
        "મશીન લર્નિંગ": "machine learning",
        "કમ્પ્યુટર સાયન્સ": "computer science",
        "માહિતી ટેકનોલોજી": "information technology",
        ઈલેક્ટ્રોનિક્સ: "electronics",
        યાંત્રિક: "mechanical",
        બાંધકામ: "civil",
        વિદ્યુત: "electrical",
      },
    };

    const mappings = specializationMappings[language];
    if (!mappings) return "";

    // Find specialization terms in the education string
    for (const [localTerm, englishTerm] of Object.entries(mappings)) {
      if (educationString.includes(localTerm)) {
        return englishTerm;
      }
    }

    return "";
  }

  // Helper method to extract degree and specialization
  extractDegreeAndSpecialization(educationString) {
    const parts = {
      degree: "",
      specialization: "",
    };

    // Normalize the education string first
    const normalizedString = educationString.toLowerCase().trim();

    // Enhanced degree patterns with variations and normalizations
    const degreePatterns = [
      // B.Tech variations
      {
        patterns: ["b\\.tech", "btech", "b tech", "bachelor of technology"],
        normalized: "b.tech",
      },
      // B.E variations
      {
        patterns: ["b\\.e\\.?", "be\\b", "b e\\b", "bachelor of engineering"],
        normalized: "b.e",
      },
      // B.Sc variations
      {
        patterns: ["b\\.sc\\.?", "bsc\\b", "b sc\\b", "bachelor of science"],
        normalized: "b.sc",
      },
      // B.Com variations
      {
        patterns: [
          "b\\.com\\.?",
          "bcom\\b",
          "b com\\b",
          "bachelor of commerce",
        ],
        normalized: "b.com",
      },
      // B.A variations
      {
        patterns: ["b\\.a\\.?", "ba\\b", "b a\\b", "bachelor of arts"],
        normalized: "b.a",
      },
      // BCA variations
      {
        patterns: [
          "b\\.c\\.a\\.?",
          "bca\\b",
          "b c a\\b",
          "bachelor of computer applications",
        ],
        normalized: "bca",
      },
      // M.Tech variations
      {
        patterns: [
          "m\\.tech\\.?",
          "mtech\\b",
          "m tech\\b",
          "master of technology",
        ],
        normalized: "m.tech",
      },
      // M.Sc variations
      {
        patterns: ["m\\.sc\\.?", "msc\\b", "m sc\\b", "master of science"],
        normalized: "m.sc",
      },
      // MBA variations
      {
        patterns: [
          "m\\.b\\.a\\.?",
          "mba\\b",
          "m b a\\b",
          "master of business administration",
        ],
        normalized: "mba",
      },
      // MCA variations
      {
        patterns: [
          "m\\.c\\.a\\.?",
          "mca\\b",
          "m c a\\b",
          "master of computer applications",
        ],
        normalized: "mca",
      },
      // Diploma variations
      { patterns: ["diploma", "polytechnic"], normalized: "diploma" },
      // Pharmacy variations
      {
        patterns: ["b\\.pharm\\.?", "bpharm\\b", "bachelor of pharmacy"],
        normalized: "b.pharm",
      },
      {
        patterns: ["m\\.pharm\\.?", "mpharm\\b", "master of pharmacy"],
        normalized: "m.pharm",
      },
    ];

    // Find the degree part
    for (const degreeGroup of degreePatterns) {
      for (const pattern of degreeGroup.patterns) {
        const regex = new RegExp(`\\b${pattern}`, "i");
        const match = normalizedString.match(regex);
        if (match) {
          parts.degree = degreeGroup.normalized;

          // Extract specialization (everything after the degree)
          const degreeEndIndex =
            normalizedString.indexOf(match[0]) + match[0].length;
          const remaining = normalizedString.substring(degreeEndIndex).trim();

          if (remaining) {
            // Clean up common connecting words and normalize specialization
            parts.specialization = remaining
              .replace(
                /^(in|of|with|specialization|specialisation|and)\s+/i,
                "",
              )
              .replace(/\s+/g, " ")
              .trim();
          }

          console.log(
            `Extracted: degree="${parts.degree}", specialization="${parts.specialization}"`,
          );
          return parts;
        }
      }
    }

    // If no degree found, treat the whole string as degree
    if (!parts.degree) {
      parts.degree = normalizedString;
    }

    return parts;
  }

  // Enhanced education eligibility check with detailed matching information
  checkEducationEligibility(userEducation, internshipEligibility) {
    if (
      !internshipEligibility ||
      !internshipEligibility.education ||
      internshipEligibility.education.length === 0
    ) {
      return {
        eligible: true,
        reason: "No specific education requirements",
        matchedWith: "No requirements specified",
        matchRule: "Default eligibility",
      };
    }

    // Translate user education to English
    const translatedUserEducation = this.translateEducationTerm(
      userEducation,
      this.currentLanguage,
    );

    console.log(`Original user education: ${userEducation}`);
    console.log(`Translated user education: ${translatedUserEducation}`);
    console.log(
      `Required education: ${internshipEligibility.education.join(" or ")}`,
    );

    // Check education eligibility with specific business rules
    let matchDetails = null;

    const educationMatch = internshipEligibility.education.some(
      (reqEducation) => {
        const normalizedReqEducation = reqEducation.toLowerCase().trim();
        const normalizedUserEducation = translatedUserEducation
          .toLowerCase()
          .trim();

        console.log(
          `Comparing user: "${normalizedUserEducation}" with requirement: "${normalizedReqEducation}"`,
        );

        // Extract degree and specialization for both user and requirement
        const userParts = this.extractDegreeAndSpecialization(
          normalizedUserEducation,
        );
        const reqParts = this.extractDegreeAndSpecialization(
          normalizedReqEducation,
        );

        console.log(`User parts:`, userParts);
        console.log(`Requirement parts:`, reqParts);

        // BUSINESS RULE 1: Direct exact match
        if (normalizedUserEducation === normalizedReqEducation) {
          console.log("✓ Rule 1: Direct exact match");
          matchDetails = {
            matchedWith: reqEducation,
            matchRule: "Direct exact match",
            userDegree: userParts.degree,
            userSpecialization: userParts.specialization,
            requiredDegree: reqParts.degree,
            requiredSpecialization: reqParts.specialization,
          };
          return true;
        }

        // BUSINESS RULE 1.5: Normalized degree match (handles BE vs B.E etc.)
        if (userParts.degree === reqParts.degree) {
          if (!userParts.specialization && !reqParts.specialization) {
            console.log("✓ Rule 1.5: Normalized degree match (both general)");
            matchDetails = {
              matchedWith: reqEducation,
              matchRule: "Normalized degree match (general)",
              userDegree: userParts.degree,
              userSpecialization: "None",
              requiredDegree: reqParts.degree,
              requiredSpecialization: "None",
            };
            return true;
          }
          if (userParts.specialization === reqParts.specialization) {
            console.log(
              "✓ Rule 1.5: Normalized degree and specialization match",
            );
            matchDetails = {
              matchedWith: reqEducation,
              matchRule: "Normalized degree and specialization match",
              userDegree: userParts.degree,
              userSpecialization: userParts.specialization,
              requiredDegree: reqParts.degree,
              requiredSpecialization: reqParts.specialization,
            };
            return true;
          }
        }

        // BUSINESS RULE 2: User has specialization, requirement is general degree
        // e.g., User: "b.tech information technology", Requirement: "b.tech"
        if (userParts.specialization && !reqParts.specialization) {
          if (userParts.degree === reqParts.degree) {
            console.log(
              "✓ Rule 2: User specialization matches general requirement",
            );
            matchDetails = {
              matchedWith: reqEducation,
              matchRule: "User specialization satisfies general requirement",
              userDegree: userParts.degree,
              userSpecialization: userParts.specialization,
              requiredDegree: reqParts.degree,
              requiredSpecialization: "None (General degree accepted)",
            };
            return true;
          }
        }

        // BUSINESS RULE 3: Both have specializations - must match exactly
        // e.g., User: "b.tech computer science", Requirement: "b.tech information technology" = NO MATCH
        if (userParts.specialization && reqParts.specialization) {
          if (
            userParts.degree === reqParts.degree &&
            userParts.specialization === reqParts.specialization
          ) {
            console.log("✓ Rule 3: Exact degree and specialization match");
            matchDetails = {
              matchedWith: reqEducation,
              matchRule: "Exact degree and specialization match",
              userDegree: userParts.degree,
              userSpecialization: userParts.specialization,
              requiredDegree: reqParts.degree,
              requiredSpecialization: reqParts.specialization,
            };
            return true;
          } else {
            console.log("✗ Rule 3: Different specializations - no match");
            return false;
          }
        }

        // BUSINESS RULE 4: Requirement has specialization, user has general degree
        // e.g., User: "b.tech", Requirement: "b.tech information technology" = NO MATCH
        if (!userParts.specialization && reqParts.specialization) {
          console.log(
            "✗ Rule 4: User general degree does not satisfy specialized requirement",
          );
          return false;
        }

        // BUSINESS RULE 5: Check education hierarchy for general degrees only
        if (!userParts.specialization && !reqParts.specialization) {
          const userLevel = this.educationHierarchy[userParts.degree] || 0;
          const reqLevel = this.educationHierarchy[reqParts.degree] || 0;

          console.log(`User level: ${userLevel}, Required level: ${reqLevel}`);

          if (userLevel >= reqLevel && reqLevel > 0) {
            console.log("✓ Rule 5: Hierarchy match for general degrees");
            matchDetails = {
              matchedWith: reqEducation,
              matchRule: "Education hierarchy match (higher level qualifies)",
              userDegree: userParts.degree,
              userSpecialization: "None",
              requiredDegree: reqParts.degree,
              requiredSpecialization: "None",
            };
            return true;
          }
        }

        // BUSINESS RULE 6: Check for degree variations/equivalents
        const variationMatch = this.checkEducationVariations(
          userParts.degree,
          reqParts.degree,
        );
        if (variationMatch) {
          // If both have same specialization or both don't have specialization
          if (userParts.specialization === reqParts.specialization) {
            console.log(
              "✓ Rule 6: Degree variation match with same specialization",
            );
            matchDetails = {
              matchedWith: reqEducation,
              matchRule: "Degree variation/equivalent match",
              userDegree: userParts.degree,
              userSpecialization: userParts.specialization || "None",
              requiredDegree: reqParts.degree,
              requiredSpecialization: reqParts.specialization || "None",
            };
            return true;
          }
        }

        console.log("✗ No matching rule found");
        return false;
      },
    );

    const result = {
      eligible: educationMatch,
      reason: educationMatch
        ? "Education requirement satisfied"
        : `Education requirement not met. Required: ${internshipEligibility.education.join(" or ")}, You have: ${userEducation}`,
      matchedWith: matchDetails?.matchedWith || "No match found",
      matchRule: matchDetails?.matchRule || "No matching rule applied",
      detailedMatch: matchDetails,
    };

    console.log("Final eligibility result:", result);
    return result;
  }

  // Enhanced education variations check
  checkEducationVariations(userEducation, reqEducation) {
    const variations = {
      "b.tech": [
        "b.e",
        "bachelor of technology",
        "bachelor of engineering",
        "engineering",
        "tech",
        "btech",
      ],
      "b.e": [
        "b.tech",
        "bachelor of engineering",
        "bachelor of technology",
        "engineering",
        "be",
      ],
      "b.sc": ["bachelor of science", "science graduate", "bsc"],
      "b.com": ["bachelor of commerce", "commerce graduate", "bcom"],
      "b.a": ["bachelor of arts", "arts graduate", "ba"],
      bca: [
        "bachelor of computer applications",
        "computer applications",
        "b.c.a",
      ],
      mca: [
        "master of computer applications",
        "computer applications master",
        "m.c.a",
      ],
      "m.tech": ["master of technology", "technology master", "mtech"],
      "m.sc": ["master of science", "science master", "msc"],
      mba: [
        "master of business administration",
        "business administration master",
        "m.b.a",
      ],
      diploma: ["polytechnic", "diploma in engineering", "diploma in computer"],

      // Add reverse mappings
      "bachelor of technology": ["b.tech", "b.e", "btech", "be"],
      "bachelor of engineering": ["b.tech", "b.e", "btech", "be"],
      "bachelor of science": ["b.sc", "bsc"],
      "bachelor of commerce": ["b.com", "bcom"],
      "bachelor of arts": ["b.a", "ba"],
      "bachelor of computer applications": ["bca", "b.c.a"],
      "master of technology": ["m.tech", "mtech"],
      "master of science": ["m.sc", "msc"],
      "master of business administration": ["mba", "m.b.a"],
      "master of computer applications": ["mca", "m.c.a"],
    };

    const userVariations = variations[userEducation] || [userEducation];
    const reqVariations = variations[reqEducation] || [reqEducation];

    // Check if any user variation matches any required variation
    const hasVariationMatch = userVariations.some((uVar) =>
      reqVariations.some((rVar) => {
        // Exact match
        if (uVar === rVar) return true;

        // Partial match (one contains the other)
        if (uVar.includes(rVar) || rVar.includes(uVar)) return true;

        // Check for common abbreviations
        return this.checkAbbreviations(uVar, rVar);
      }),
    );

    return hasVariationMatch;
  }

  // Check common abbreviations
  checkAbbreviations(term1, term2) {
    const abbreviationMap = {
      "b.tech": "bachelor of technology",
      "b.e": "bachelor of engineering",
      "b.sc": "bachelor of science",
      "b.com": "bachelor of commerce",
      "b.a": "bachelor of arts",
      bca: "bachelor of computer applications",
      "m.tech": "master of technology",
      "m.sc": "master of science",
      mba: "master of business administration",
      mca: "master of computer applications",
    };

    // Check if one is abbreviation of another
    return abbreviationMap[term1] === term2 || abbreviationMap[term2] === term1;
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
      education: this.translateEducationTerm(
        profileData.education || "",
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

      // Check for common variations
      return this.checkCommonVariations(lowerUserTerm, lowerInternshipTerm);
    });
  }

  // Check common technical term variations
  checkCommonVariations(term1, term2) {
    const variations = {
      javascript: ["js", "javascript"],
      react: ["reactjs", "react.js"],
      nodejs: ["node", "node.js"],
      "artificial intelligence": ["ai", "machine learning"],
      "machine learning": ["ml", "ai"],
      "web development": ["web dev", "frontend", "backend"],
      "data analysis": ["data analytics", "analytics"],
      "digital marketing": ["online marketing", "social media marketing"],
    };

    const term1Variations = variations[term1] || [term1];
    const term2Variations = variations[term2] || [term2];

    //return if exact match only
    return term1Variations === term2Variations;
  }

  // Set current language
  setCurrentLanguage(language) {
    this.currentLanguage = language;
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
