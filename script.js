/* ============================================
   Shetkari Krushi Seva Kendra - Main JavaScript
   Premium Agricultural Website
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initNavigation();
    initTheme();
    initSearch();
    initScrollEffects();
    initFAQ();
    initProductFilter();
    initChatbot();
    initContactForm();
    initGallery();
    initScrollTop();
    initAnimations();
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('hidden');
            }, 500);
        });
    }
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu on link click
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   THEME (Dark Mode)
   ============================================ */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

/* ============================================
   SEARCH
   ============================================ */
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = searchBar ? searchBar.querySelector('input') : null;
    const searchButton = searchBar ? searchBar.querySelector('button') : null;
    
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function() {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                searchInput.focus();
            }
        });
        
        // Close search on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchBar.classList.remove('active');
            }
        });
    }
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            // Redirect to products page with search query
            window.location.href = 'products.html?search=' + encodeURIComponent(query);
        }
    }
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
}

/* ============================================
   PRODUCT FILTER
   ============================================ */
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    // Check URL for search query
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        filterProducts(searchQuery.toLowerCase());
        // Update filter button if applicable
        filterButtons.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === 'all' || 
                btn.textContent.toLowerCase().includes(searchQuery.toLowerCase())) {
                btn.classList.add('active');
            }
        });
    }
    
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    function filterProducts(filter) {
        productCards.forEach(function(card) {
            const category = card.getAttribute('data-category');
            const name = card.getAttribute('data-name') || '';
            
            if (filter === 'all' || 
                category === filter || 
                name.toLowerCase().includes(filter.toLowerCase())) {
                card.style.display = 'block';
                setTimeout(function() {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(function() {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

/* ============================================
   CHATBOT - Krushi Mitra AI
   ============================================ */
function initChatbot() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotBtn = document.querySelector('.chatbot-btn');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatMessages = document.querySelector('.chatmessages');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendBtn = document.querySelector('.chatbot-input button');
    const quickButtons = document.querySelectorAll('.chat-quick-btn');
    
    // Knowledge base
    const knowledgeBase = {
        greetings: {
            en: "🙏 Namaste! I'm Krushi Mitra AI, your agricultural assistant. How can I help you today? I can assist you with fertilizers, seeds, pesticides, and more!",
            hi: "🙏 नमस्ते! मैं कृषि मित्र AI हूँ, आपका कृषि सहायक। आज मैं आपकी कैसे मदद कर सकता हूँ? मैं खाद, बीज, कीटनाशक और बहुत कुछ में सहायता कर सकता हूँ!",
            mr: "🙏 नमस्कार! मी कृषी मित्र AI आहे, तुमचा कृषी सहायक। आज मी तुम्हाला कशी मदत करू शकतो? मी खते, बियाणे, कीटकनाशके आणि बऱ्याच गोष्टींमध्ये मदत करू शकतो!"
        },
        fertilizers: {
            urea: {
                en: "Urea (46-0-0) is a high-nitrogen fertilizer essential for vegetative growth. Apply 50-100 kg per acre. Best applied before irrigation or rainfall.",
                hi: "यूरिया (46-0-0) एक उच्च नाइट्रोजन वाला उर्वरक है जो वानस्पतिक वृद्धि के लिए आवश्यक है। प्रति एकड़ 50-100 किलो लगाएं। सिंचन या वर्षा से पहले लगाना सबसे अच्छा है।",
                mr: "युरिया (46-0-0) हे एक उच्च नाइट्रोजन असलेले खत आहे जे वनस्पती वाढीसाठी आवश्यक आहे। प्रति एकर 50-100 किलो वापरा. सिंचन किंवा पावसापूर्वी लावणे सर्वोत्तम आहे."
            },
            dap: {
                en: "DAP (18-46-0) provides nitrogen and phosphorus. Ideal for sowing time application. Apply 50-80 kg per acre. Helps in root development and early growth.",
                hi: "DAP (18-46-0) नाइट्रोजन और फॉस्फोरस प्रदान करता है। बुवाई के समय लगाने के लिए आदर्श। प्रति एकड़ 50-80 किलो लगाएं। जड़ विकास और प्रारंभिक वृद्धि में सहायक।",
                mr: "DAP (18-46-0) हे नाइट्रोजन आणि फॉस्फरस पुरवते. पेरणीच्या वेळी वापरायासाठी योग्य. प्रति एकर 50-80 किलो वापरा. मुळ विकास आणि लवकर वाढीसाठी उपयुक्त."
            },
            potash: {
                en: "Muriate of Potash (0-0-60) is essential for fruit quality and disease resistance. Apply 30-50 kg per acre. Important for sugarcane, cotton, and fruits.",
                hi: "म्यूरेट ऑफ पोटाश (0-0-60) फल की गुणवत्ता और रोग प्रतिरोध के लिए आवश्यक है। प्रति एकड़ 30-50 किलो लगाएं। गन्ना, कपास और फलों के लिए महत्वपूर्ण।",
                mr: "म्युरेट ऑफ पोटॅश (0-0-60) हे फळांची गुणवत्ता आणि रोग प्रतिकारक शक्तीसाठी आवश्यक आहे. प्रति एकर 30-50 किलो वापरा. ऊस, कापूस आणि फळांसाठी महत्त्वाचे."
            },
            ammoniumSulphate: {
                en: "Ammonium Sulphate (21-0-0-24S) provides nitrogen and sulphur. Ideal for sulphur-deficient soils. Apply 40-60 kg per acre. Good for oilseeds and pulses.",
                hi: "अमोनियम सल्फेट (21-0-0-24S) नाइट्रोजन और सल्फर प्रदान करता है। सल्फर की कमी वाली मिट्टी के लिए आदर्श। प्रति एकड़ 40-60 किलो लगाएं। तिलहन और दलहन के लिए अच्छा।",
                mr: "अमोनियम सल्फेट (21-0-0-24S) हे नाइट्रोजन आणि सल्फर पुरवते. सल्फर कमतरता असलेल्या मातीसाठी योग्य. प्रति एकर 40-60 किलो वापरा. तेलबिया आणि डाळींसाठी चांगले."
            },
            npk24: {
                en: "NPK 24:24:0 is a balanced fertilizer for vegetative growth. Suitable for most crops at sowing. Apply 50-75 kg per acre.",
                hi: "NPK 24:24:0 वानस्पतिक वृद्धि के लिए एक संतुलित उर्वरक है। बुवाई के समय अधिकांश फसलों के लिए उपयुक्त। प्रति एकड़ 50-75 किलो लगाएं।",
                mr: "NPK 24:24:0 हे वनस्पती वाढीसाठी एक संतुलित खत आहे. पेरणीच्या वेळी बहुतेक पिकांसाठी योग्य. प्रति एकर 50-75 किलो वापरा."
            },
            npk12: {
                en: "NPK 12:32:16 is excellent for root development and flowering. Apply 50-75 kg per acre. Ideal for cotton, soybean, and vegetable crops.",
                hi: "NPK 12:32:16 जड़ विकास और फूल आने के लिए उत्कृष्ट है। प्रति एकड़ 50-75 किलो लगाएं। कपास, सोयाबीन और सब्जी फसलों के लिए आदर्श।",
                mr: "NPK 12:32:16 हे मुळ विकास आणि फुलपाणीसाठी उत्कृष्ट आहे. प्रति एकर 50-75 किलो वापरा. कापूस, सोयाबीन आणि भाजीपाला पिकांसाठी योग्य."
            }
        },
        seeds: {
            en: "We offer high-quality certified seeds for various crops including cotton, soybean, maize, wheat, and vegetables. Our seeds are sourced from trusted companies like Mahyco, JK Agri, and Bayer.",
            hi: "हम कपास, सोयाबीन, मक्का, गेहूं और सब्जियों सहित विभिन्न फसलों के लिए उच्च गुणवत्ता वाले प्रमाणित बीज प्रदान करते हैं। हमारे बीज Mahyco, JK Agri और Bayer जैसी विश्वसनीय कंपनियों से आते हैं।",
            mr: "आम्ही कापूस, सोयाबीन, मका, गहू आणि भाजीपाला यांसह विविध पिकांसाठी उच्च दर्जाचे प्रमाणित बियाणे देतो. आमची बियाणे Mahyco, JK Agri आणि Bayer सारख्या विश्वासार्ह कंपनींकडून येतात."
        },
        pesticides: {
            insecticides: {
                en: "We stock a wide range of insecticides for pest control including organophosphates, pyrethroids, and neem-based products. Consult our experts for the right product for your crop.",
                hi: "हमारे पास कीट नियंत्रण के लिए विभिन्न प्रकार के कीटनाशक उपलब्ध हैं। अपनी फसल के लिए सही उत्पादन के लिए हमारे विशेषज्ञों से सलाह लें।",
                mr: "आमच्याकडे कीड नियंत्रणासाठी विविध प्रकारची कीटकनाशके उपलब्ध आहेत. तुमच्या पिकासाठी योग्य उत्पादनासाठी आमच्या तज्ञांशी सल्ला घ्या."
            },
            fungicides: {
                en: "Our fungicide range helps prevent and control fungal diseases in crops. We have contact and systemic fungicides for various crop diseases.",
                hi: "हमारी कवकनाशी श्रेणी फसलों में कवक रोगों को रोकने और नियंत्रित करने में मदद करती है। विभिन्न फसल रोगों के लिए संपर्क और प्रणालीगत कवकनाशी उपलब्ध हैं।",
                mr: "आमच्या बुरशीनाशक श्रेणीत पिकांमधील बुरशीजन्य रोगांना प्रतिबंधित करण्यात आणि नियंत्रित करण्यात मदत होते. विविध पिक रोगांसाठी संपर्क आणि व्यवस्थित बुरशीनाशके उपलब्ध आहेत."
            },
            herbicides: {
                en: "We provide effective herbicides for weed management in all major crops. Pre-emergence and post-emergence options available.",
                hi: "हम सभी प्रमुख फसलों में खरपतवान प्रबंधन के लिए प्रभावी शाकनाशी प्रदान करते हैं। पूर्व-उद्भव और उद्भव-पश्चात विकल्प उपलब्ध हैं।",
                mr: "आम्ही सर्व प्रमुख पिकांमधील तण व्यवस्थापनासाठी प्रभावी तणनाशके पुरवतो. पूर्व-उगवा आणि उगवा-नंतर पर्याय उपलब्ध आहेत."
            }
        },
        micronutrients: {
            en: "Micronutrients like Zinc, Boron, Iron, and Manganese are essential for crop health. Deficiency leads to poor yield. We have various micronutrient formulations available.",
            hi: "जस्त, बोरॉन, लोहा और मैंगनीज जैसे सूक्ष्म पोषक तत्व फसल स्वास्थ्य के लिए आवश्यक हैं। हम विभिन्न सूक्ष्म पोषक तत्व सूत्र उपलब्ध हैं।",
            mr: "झिंक, बोरॉन, लोखंड आणि मळगनीज सारखे सूक्ष्म पोषक तत्व पिकांच्या आरोग्यासाठी आवश्यक आहेत. आमच्याकडे विविध सूक्ष्म पोषक तत्व सूत्रे उपलब्ध आहेत."
        },
        plantGrowth: {
            en: "Plant Growth Promoters like amino acids, humic acid, and seaweed extract help improve crop vigor and yield. Available in liquid and powder forms.",
            hi: "एमिनो एसिड, ह्यूमिक एसिड और सीवीड एक्सट्रैक्ट जैसे प्लांट ग्रोथ प्रमोटर फसल की शक्ति और उपज में सुधार करने में मदद करते हैं।",
            mr: "अ‍ॅमिनो अ‍ॅसिड, ह्युमिक अ‍ॅसिड आणि सीव्हीड एक्स्ट्रॅक्ट सारखे वनस्पती वाढ प्रवर्तक पिकांच्या जोर आणि उत्पन्न सुधारण्यात मदत करतात."
        },
        equipment: {
            en: "We offer quality agricultural equipment including sprayers, drip irrigation parts, tools, and farm accessories. All products come with warranty.",
            hi: "हम गुणवत्ता कृषि उपकरण प्रदान करते हैं जिसमें स्प्रेयर, ड्रिप सिंचन पार्ट्स, उपकरण और फार्म एक्सेसरी शामिल हैं।",
            mr: "आम्ही स्प्रेयर, ड्रिप सिंचन भागे, उपकरणे आणि शेत उपकरणे यांसह गुणवत्ता कृषी उपकरणे पुरवतो."
        },
        timings: {
            en: "🕐 Shop Timings:\n\nMonday - Saturday: 8:00 AM - 8:00 PM\nSunday: 9:00 AM - 2:00 PM\n\nWe are open on most public holidays.",
            hi: "🕐 दुकान का समय:\n\nसोमवार - शनिवार: सुबह 8:00 - रात 8:00\nरविवार: सुबह 9:00 - दोपहर 2:00\n\nअधिकांश सार्वजनिक अवकाशों में खुला रहता है।",
            mr: "🕐 दुकानाचे वेळ:\n\nसोमवार - शनिवार: सकाळी 8:00 - रात्री 8:00\nरविवार: सकाळी 9:00 - दुपारी 2:00\n\nआम्ही बहुतेक सार्वजनिक सुट्टींमध्ये उघडे असतो."
        },
        contact: {
            en: "📞 Contact Us:\n\nPhone: +91 9270949653\nWhatsApp: +91 9270949653\n\n📍 Address:\nAundh Road, Rahimatpur, Satara, Maharashtra – 415511\n\nFor expert advice, please call or visit our shop!",
            hi: "📞 हमसे संपर्क करें:\n\nफोन: +91 9270949653\nWhatsApp: +91 9270949653\n\n📍 पता:\nऔंध रोड, रहिमतपुर, सातारा, महाराष्ट्र – 415511\n\nविशेषज्ञ सलाह के लिए, कृपया कॉल करें या हमारी दुकान पर आएं!",
            mr: "📞 आमच्याशी संपर्क साधा:\n\nफोन: +91 9270949653\nWhatsApp: +91 9270949653\n\n📍 पत्ता:\nऔंध रोड, रहिमतपुर, सातारा, महाराष्ट्र – 415511\n\nतज्ञ सल्ल्यासाठी, कृपया फोन करा किंवा आमच्या दुकानात या!"
        },
        expert: {
            en: "For detailed expert advice, I recommend you contact our experienced team directly. Call us at +91 9270949653 or visit our shop for personalized guidance.",
            hi: "विस्तृत विशेषज्ञ सलाह के लिए, मैं आपको हमारी अनुभवी टीम से सीधे संपर्क करने की सलाह देता हूं। हमें +91 9270949653 पर कॉल करें।",
            mr: "विस्तृत तज्ञ सल्ल्यासाठी, मी तुम्हाला आमच्या अनुभवी संघाशी थेट संपर्क साधण्याचा सल्ला देतो. आम्हाला +91 9270949653 वर कॉल करा."
        }
    };
    
    // Detect language
    function detectLanguage(text) {
        const hindiPattern = /[\u0900-\u097F]/;
        const marathiPattern = /[\u0900-\u097F]/;
        
        if (hindiPattern.test(text)) {
            // Could be Hindi or Marathi, check for specific words
            const marathiWords = ['आहे', 'करा', 'आम्ही', 'तुम्ही', 'येते', 'जाते'];
            const hindiWords = ['है', 'करें', 'हम', 'आप', 'आता', 'जाता'];
            
            if (marathiWords.some(function(word) { return text.includes(word); })) {
                return 'mr';
            } else if (hindiWords.some(function(word) { return text.includes(word); })) {
                return 'hi';
            }
            return 'hi';
        }
        return 'en';
    }
    
    // Get response based on user input
    function getResponse(input) {
        var lowerInput = input.toLowerCase();
        var lang = detectLanguage(input);
        
        // Greetings
        if (lowerInput.match(/^(hi|hello|hey|namaste|namaskar|नमस्ते|नमस्कार|🙏)/)) {
            return knowledgeBase.greetings[lang] || knowledgeBase.greetings.en;
        }
        
        // Timings
        if (lowerInput.match(/(timing|time|hours|open|close|कब|समय|वेळ|शоп|shop|दुकान)/)) {
            return knowledgeBase.timings[lang] || knowledgeBase.timings.en;
        }
        
        // Contact
        if (lowerInput.match(/(contact|phone|call|number|address|location|map|संपर्क|फोन|पता|contact|पत्ता)/)) {
            return knowledgeBase.contact[lang] || knowledgeBase.contact.en;
        }
        
        // Fertilizers - Urea
        if (lowerInput.match(/(urea|यूरिया|युरिया)/)) {
            return knowledgeBase.fertilizers.urea[lang] || knowledgeBase.fertilizers.urea.en;
        }
        
        // DAP
        if (lowerInput.match(/(dap|डीएपी)/)) {
            return knowledgeBase.fertilizers.dap[lang] || knowledgeBase.fertilizers.dap.en;
        }
        
        // Potash
        if (lowerInput.match(/(potash|पोटाश|पोटॅश|mop)/)) {
            return knowledgeBase.fertilizers.potash[lang] || knowledgeBase.fertilizers.potash.en;
        }
        
        // Ammonium Sulphate
        if (lowerInput.match(/(ammonium|सल्फेट|sulphate)/)) {
            return knowledgeBase.fertilizers.ammoniumSulphate[lang] || knowledgeBase.fertilizers.ammoniumSulphate.en;
        }
        
        // NPK 24:24:0
        if (lowerInput.match(/(24.?24|npk.*24)/)) {
            return knowledgeBase.fertilizers.npk24[lang] || knowledgeBase.fertilizers.npk24.en;
        }
        
        // NPK 12:32:16
        if (lowerInput.match(/(12.?32|npk.*12|npk.*32)/)) {
            return knowledgeBase.fertilizers.npk12[lang] || knowledgeBase.fertilizers.npk12.en;
        }
        
        // General fertilizer
        if (lowerInput.match(/(fertilizer|fertiliser|khad|खाद|खत|उर्वरक|fert|urea|npk|dap|potash|शेती|सुपारी)/)) {
            return "We offer a wide range of fertilizers:\n\n• Urea (46-0-0)\n• DAP (18-46-0)\n• Potash (0-0-60)\n• Ammonium Sulphate (21-0-0)\n• NPK 24:24:0\n• NPK 12:32:16\n\nWhich fertilizer would you like to know about?";
        }
        
        // Seeds
        if (lowerInput.match(/(seed|बीज|बियाणे|पेरणी|sow|crop)/)) {
            return knowledgeBase.seeds[lang] || knowledgeBase.seeds.en;
        }
        
        // Insecticides
        if (lowerInput.match(/(insecticide|कीटनाशक|कीटकनाशक|कीड|pest|insect|bug)/)) {
            return knowledgeBase.pesticides.insecticides[lang] || knowledgeBase.pesticides.insecticides.en;
        }
        
        // Fungicides
        if (lowerInput.match(/(fungicide|बुरशीनाशक|fungal|fungus|बुरशी)/)) {
            return knowledgeBase.pesticides.fungicides[lang] || knowledgeBase.pesticides.fungicides.en;
        }
        
        // Herbicides
        if (lowerInput.match(/(herbicide|शाकनाशक|तणनाशक|weed|तण|grass)/)) {
            return knowledgeBase.pesticides.herbicides[lang] || knowledgeBase.pesticides.herbicides.en;
        }
        
        // Pesticides general
        if (lowerInput.match(/(pesticide|कीटनाशक|कीटकनाशक|pesticide|spray|दवा|औषध)/)) {
            return "We have a complete range of crop protection products:\n\n🛡️ Insecticides\n🍄 Fungicides\n🌿 Herbicides\n\nWhat type of protection do you need for your crop?";
        }
        
        // Micronutrients
        if (lowerInput.match(/(micronutrient|सूक्ष्म|nutrient|पोषक|zinc|boron|iron|deficiency|कमी)/)) {
            return knowledgeBase.micronutrients[lang] || knowledgeBase.micronutrients.en;
        }
        
        // Plant Growth Promoters
        if (lowerInput.match(/(growth|promoter|वाढ|प्रवर्तक|hormone|amino|humic)/)) {
            return knowledgeBase.plantGrowth[lang] || knowledgeBase.plantGrowth.en;
        }
        
        // Equipment
        if (lowerInput.match(/(equipment|tool|साधन|उपकरण|sprayer|drip|irrigation|सिंचन)/)) {
            return knowledgeBase.equipment[lang] || knowledgeBase.equipment.en;
        }
        
        // Price
        if (lowerInput.match(/(price|किंमत|दाम|cost|rate|how much)/)) {
            return "For current prices and best deals, please contact us directly:\n\n📞 Phone: +91 9270949653\n💬 WhatsApp: +91 9270949653\n\nWe offer competitive prices and bulk discounts for farmers!";
        }
        
        // Product suggestion
        if (lowerInput.match(/(suggest|recommend|which|क्या|कोनसा|कोणते|काय|advice)/)) {
            return knowledgeBase.expert[lang] || knowledgeBase.expert.en;
        }
        
        // Thank you
        if (lowerInput.match(/(thank|thanks|धन्यवाद|धन्यवाद|Thank you|thank u)/)) {
            return "🙏 You're welcome! If you have any more questions, feel free to ask. Happy farming! 🌾\n\nCall us: +91 9270949653";
        }
        
        // Default response
        return knowledgeBase.expert[lang] || knowledgeBase.expert.en;
    }
    
    if (chatbotBtn && chatbotContainer) {
        chatbotBtn.addEventListener('click', function() {
            chatbotContainer.classList.toggle('active');
            if (chatbotContainer.classList.contains('active')) {
                chatInput.focus();
                // Send greeting if no messages
                if (chatMessages.children.length === 0) {
                    setTimeout(function() {
                        addBotMessage(knowledgeBase.greetings.en);
                    }, 500);
                }
            }
        });
    }
    
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }
    
    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Quick action buttons
    quickButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            chatInput.value = this.textContent;
            sendMessage();
        });
    });
    
    function sendMessage() {
        var message = chatInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        chatInput.value = '';
        
        // Show typing indicator
        var typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.innerHTML = '<div class="chat-message-avatar">🌾</div><div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate AI thinking
        setTimeout(function() {
            chatMessages.removeChild(typingDiv);
            var response = getResponse(message);
            addBotMessage(response);
        }, 1000 + Math.random() * 1000);
    }
    
    function addUserMessage(text) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.innerHTML = '<div class="chat-message-avatar">👤</div><div class="chat-bubble">' + escapeHtml(text) + '</div>';
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addBotMessage(text) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        var formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = '<div class="chat-message-avatar">🌾</div><div class="chat-bubble">' + formattedText + '</div>';
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add quick action buttons after bot message
        var quickActions = document.createElement('div');
        quickActions.className = 'chat-quick-actions';
        quickActions.innerHTML = '<button class="chat-quick-btn">🕐 Shop Timings</button><button class="chat-quick-btn">📞 Contact Us</button><button class="chat-quick-btn">🌾 Products</button>';
        chatMessages.appendChild(quickActions);
        
        // Add click handlers to new quick buttons
        quickActions.querySelectorAll('.chat-quick-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                chatInput.value = this.textContent;
                sendMessage();
            });
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            var formData = new FormData(this);
            var name = formData.get('name');
            var phone = formData.get('phone');
            var message = formData.get('message');
            
            // Simple validation
            if (!name || !phone || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Create WhatsApp message
            var whatsappMessage = 'Hello! I am ' + name + '. ' + message;
            var whatsappUrl = 'https://wa.me/919270949653?text=' + encodeURIComponent(whatsappMessage);
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            showNotification('Message sent! Opening WhatsApp...', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

function showNotification(message, type) {
    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:15px 25px;border-radius:10px;color:white;z-index:9999;font-weight:500;animation:slideIn 0.3s ease;' + 
        (type === 'success' ? 'background:#4caf50;' : 'background:#f44336;');
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/* ============================================
   GALLERY LIGHTBOX
   ============================================ */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var img = this.querySelector('img');
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   SCROLL TO TOP
   ============================================ */
function initScrollTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initAnimations() {
    var elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(function(el) {
        observer.observe(el);
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounters() {
    var counters = document.querySelectorAll('.counter');
    
    counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-target'));
        var duration = 2000;
        var start = 0;
        var increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                counter.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        }
        
        updateCounter();
    });
}

// Start counter animation when hero stats are visible
var heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    var counterObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            animateCounters();
            counterObserver.disconnect();
        }
    });
    counterObserver.observe(heroStats);
}
