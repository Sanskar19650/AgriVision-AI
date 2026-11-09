/**
 * AgriVision AI - Gemini Agricultural Assistant Service
 * Calls server-side proxy route `/api/chat` using Gemini 3.8 Flash.
 */

export interface AssistantResponse {
  text: string;
  category?: 'disease' | 'soil' | 'scheme' | 'market' | 'general';
}

export async function askGeminiAgronomist(
  message: string,
  history: { role: 'user' | 'model'; parts: string }[] = []
): Promise<AssistantResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || 'I analyzed your agricultural query, but received an empty response. Please try rephrasing.',
      category: data.category || 'general'
    };
  } catch (error) {
    console.warn('Gemini server API unreachable, using resilient agricultural fallback:', error);
    
    // Domain-aware fallback responses for offline or disconnected runs
    const lower = message.toLowerCase();
    let text = "Hello Farmer! I am your AgriVision Agronomy AI assistant. I can guide you on crop nutrition, biological pest control, irrigation scheduling, government schemes (PM-KISAN, PMFBY), and market trends. How can I help you today?";
    
    if (lower.includes('curl') || lower.includes('chilli') || lower.includes('leaf curl')) {
      text = "### Treatment for Leaf Curl in Chilli (Chilli Leaf Curl Virus):\n" +
             "1. **Vector Management:** Leaf curl is transmitted by whiteflies (*Bemisia tabaci*) and thrips. Controlling the vector is essential.\n" +
             "2. **Organic Spray:** Spray Neem Oil (10,000 ppm) @ 3 ml/L or Pongamia pinnata oil @ 5 ml/L.\n" +
             "3. **Chemical Option:** Imidacloprid 17.8% SL @ 0.5 ml/L or Diafenthiuron 50% WP @ 1.2 g/L.\n" +
             "4. **Traps:** Install yellow sticky traps (15-20 per acre) and blue sticky traps (for thrips) at crop canopy level.";
    } else if (lower.includes('fertilizer') || lower.includes('urea') || lower.includes('npk') || lower.includes('wheat')) {
      text = "### Balanced Fertilizer Schedule for High-Yield Wheat:\n" +
             "• **Recommended NPK Ratio:** 120:60:40 kg/ha.\n" +
             "• **Basal Dose (at Sowing):** Full P (DAP @ 130 kg/ha), full K (MOP @ 67 kg/ha), and 1/3rd of total Nitrogen (Urea @ 55 kg/ha).\n" +
             "• **1st Top Dressing:** At Crown Root Initiation stage (21 DAS) with 1/3rd Urea @ 65 kg/ha before first irrigation.\n" +
             "• **2nd Top Dressing:** At jointing stage (40-45 DAS) with remaining Urea @ 65 kg/ha.\n" +
             "• **Micro-nutrient:** If zinc deficient, spray 0.5% Zinc Sulfate heptahydrate + 0.25% unslaked lime at tillering.";
    } else if (lower.includes('organic') || lower.includes('aphid') || lower.includes('pest')) {
      text = "### Organic & Bio-Pesticide Solutions for Aphids and Sucking Pests:\n" +
             "1. **Neem Seed Kernel Extract (NSKE 5%):** Soak 50g crushed neem seed powder in 1L water overnight, filter and spray with 1ml soap liquid.\n" +
             "2. **Dashaparni Ark / Agniastra:** Traditional fermented botanical repellent prepared from neem, karanj, custard apple leaves, and garlic-chilli paste.\n" +
             "3. **Bio-agents:** Release green lacewing (*Chrysoperla carnea*) larvae @ 2,000 per acre or spray *Verticillium lecanii* entomopathogenic fungus @ 5g/L during evening hours.";
    } else if (lower.includes('scheme') || lower.includes('subsidy') || lower.includes('drip') || lower.includes('pm')) {
      text = "### Key Government Agricultural Schemes & Subsidies:\n" +
             "1. **PMKSY (Per Drop More Crop):** Offers 45% to 55% capital subsidy on micro-irrigation (Drip & Sprinkler) for small/marginal farmers.\n" +
             "2. **PMFBY (Pradhan Mantri Fasal Bima Yojana):** Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest.\n" +
             "3. **Soil Health Card Scheme:** Free laboratory testing of 12 soil parameters every 2 years with customized crop-specific fertilizer recommendations.\n" +
             "4. **SMAM (Sub-Mission on Agricultural Mechanization):** 40-50% subsidy on rotavators, laser land levelers, and power weeders.";
    }

    return {
      text,
      category: 'general'
    };
  }
}
