import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const app = express();
app.use(express.json({ limit: '2mb' }));

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.gemini_api_key;

const systemPrompt = `You are Aira, TLC Holidays' expert India travel concierge. You have a warm, concise, highly attentive voice. Your job is to discover what would make a genuinely great holiday and then create a thoughtful package.

Ask only ONE useful question per turn. Do not repeat facts the traveler already gave. Prioritize, in order: departure city, approximate dates or month, number of nights, total budget, pace, interests, hotel comfort, food or mobility needs. When enough information is present (destination/region, travelers, dates/month, duration, budget), set ready_to_build true and create a package. Make sensible assumptions for lesser preferences and clearly list them.

Make this a tap-first experience. For every question, include 3 to 6 concise quick_replies that are realistic answers to the exact question. Each option needs a short label, the complete value to send back, and one suitable emoji. If the trip is ready, return quick_replies for refinement such as “Looks perfect”, “Change the pace”, and “Adjust budget”. Never include an “Other” option because the interface provides it automatically.

TLC is an Indian travel company. Unless the traveler explicitly says otherwise, suggest Indian departure cities, show budgets in Indian rupees, and use Indian travel context.

This is a prototype. Never claim live availability or confirmed prices. For emergencies, tell users to call local emergency services rather than relying solely on the app. Return valid JSON matching the requested shape. Keep reply under 70 words.`;

const schema = {
  type: 'object', additionalProperties: false,
  properties: {
    reply: { type: 'string' },
    ready_to_build: { type: 'boolean' },
    completion: { type: 'integer' },
    quick_replies: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      label: { type: 'string' }, value: { type: 'string' }, emoji: { type: 'string' }
    }, required: ['label','value','emoji'] } },
    profile: {
      type: 'object', additionalProperties: false,
      properties: {
        destination: { type: 'string' }, departure_city: { type: 'string' },
        travel_dates: { type: 'string' }, duration: { type: 'string' }, budget: { type: 'string' },
        travelers: { type: 'string' }, interests: { type: 'array', items: { type: 'string' } },
        hotel_style: { type: 'string' }, pace: { type: 'string' }
      },
      required: ['destination','departure_city','travel_dates','duration','budget','travelers','interests','hotel_style','pace']
    },
    package: {
      type: 'object', additionalProperties: false,
      properties: {
        title: { type: 'string' }, subtitle: { type: 'string' }, price: { type: 'string' },
        days: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
          day: { type: 'integer' }, place: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }
        }, required: ['day','place','title','description'] } },
        highlights: { type: 'array', items: { type: 'string' } },
        assumptions: { type: 'array', items: { type: 'string' } }
      }, required: ['title','subtitle','price','days','highlights','assumptions']
    }
  }, required: ['reply','ready_to_build','completion','quick_replies','profile','package']
};

function demoFallback(messages) {
  const profile = { destination: '', departure_city: '', travel_dates: '', duration: '', budget: '', travelers: '', interests: [], hotel_style: '', pace: '' };
  const months = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
  let previous = '';
  for (const message of messages) {
    const text = String(message.content || '');
    if (message.role === 'assistant') { previous = text.toLowerCase(); continue; }
    const lower = text.toLowerCase();
    if (/north.?east|meghalaya|shillong|cherrapunji|assam|sikkim|arunachal/.test(lower)) profile.destination = /sikkim/.test(lower) ? 'Sikkim' : /arunachal/.test(lower) ? 'Arunachal Pradesh' : 'Meghalaya & North East India';
    if (/family of 4|four of us|4 people/.test(lower)) profile.travelers = '2 adults · 2 children (9 & 13)';
    if (/daughter|child|kid/.test(lower) && !profile.travelers) profile.travelers = 'Family with children';
    const city = text.match(/(?:from|depart(?:ing)? from|starting from)\s+([A-Za-z ]{3,30})/i);
    if (city) profile.departure_city = city[1].trim();
    else if (/depart|starting city|fly from|which city|begin your journey/.test(previous) && text.length < 40) profile.departure_city = text.trim();
    const date = text.match(new RegExp(`(?:${months})(?:\\s+\\d{4})?|\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${months})(?:\\s+\\d{4})?`, 'i'));
    if (date) profile.travel_dates = date[0];
    else if (/when|date|month/.test(previous) && text.length < 60) profile.travel_dates = text.trim();
    const duration = text.match(/\b(\d{1,2})\s*(nights?|days?)\b/i);
    if (duration) profile.duration = `${duration[1]} ${duration[2]}`;
    else if (/how long|duration|nights|days/.test(previous) && /^\s*\d{1,2}\s*$/.test(text)) profile.duration = `${text.trim()} days`;
    const budget = text.match(/(?:₹|rs\.?|inr)?\s*([\d,.]+)\s*(lakh|lac|k|thousand)?/i);
    if ((/budget|₹|lakh|lac|inr|rs\.?/i.test(text) || /budget/.test(previous)) && budget) profile.budget = `₹${budget[1]}${budget[2] ? ` ${budget[2]}` : ''}`;
    if (/nature|waterfall|scenic/.test(lower)) profile.interests.push('Nature');
    if (/adventure|trek|kayak|cav/.test(lower)) profile.interests.push('Soft adventure');
    if (/food|culture|local/.test(lower)) profile.interests.push('Culture & food');
    if (/luxury|5 star|five star/.test(lower)) profile.hotel_style = 'Luxury 5★';
    else if (/premium|4 star|four star/.test(lower)) profile.hotel_style = 'Premium 4★';
    if (/relax|slow|easy/.test(lower)) profile.pace = 'Relaxed';
    else if (/packed|active|adventure/.test(lower)) profile.pace = 'Active but balanced';
  }
  profile.interests = [...new Set(profile.interests)];
  if (!profile.destination) profile.destination = 'North East India';
  if (!profile.travelers) profile.travelers = 'Family of 4';
  const essentials = [profile.destination, profile.travelers, profile.departure_city, profile.travel_dates, profile.duration, profile.budget];
  const completion = Math.min(96, 18 + essentials.filter(Boolean).length * 12 + [profile.interests.length,profile.hotel_style,profile.pace].filter(Boolean).length * 5);
  let reply = '';
  if (!profile.departure_city) reply = 'That sounds wonderful—the North East is magical for a family adventure. Which city would you like to begin your journey from?';
  else if (!profile.travel_dates) reply = `Perfect, I’ll plan the journey from ${profile.departure_city}. When would you like to travel—do you have dates or at least a preferred month?`;
  else if (!profile.duration) reply = 'Lovely timing. How many days or nights would feel comfortable for this holiday?';
  else if (!profile.budget) reply = 'And what approximate total budget would you like me to design around, including stays and local travel?';
  else reply = 'I have enough to shape something special. I’ve kept the rhythm family-friendly, mixed signature nature experiences with breathing room, and prepared a first journey for you.';
  const ready = essentials.every(Boolean);
  const quickReplies = !profile.departure_city ? [
    {label:'Mumbai',value:'We will depart from Mumbai',emoji:'🏙️'},{label:'Delhi',value:'We will depart from Delhi',emoji:'✈️'},{label:'Bengaluru',value:'We will depart from Bengaluru',emoji:'🌆'}
  ] : !profile.travel_dates ? [
    {label:'October',value:'We would like to travel in October 2026',emoji:'🍂'},{label:'November',value:'We would like to travel in November 2026',emoji:'🌤️'},{label:'December',value:'We would like to travel in December 2026',emoji:'❄️'}
  ] : !profile.duration ? [
    {label:'5 days',value:'We have 5 days for this holiday',emoji:'⚡'},{label:'7 days',value:'We have 7 days for this holiday',emoji:'✨'},{label:'9 days',value:'We have 9 days for this holiday',emoji:'🌿'}
  ] : !profile.budget ? [
    {label:'Up to ₹2L',value:'Our total budget is up to ₹2 lakh',emoji:'💚'},{label:'₹2–3 lakh',value:'Our total budget is between ₹2 and ₹3 lakh',emoji:'⭐'},{label:'₹3–5 lakh',value:'Our total budget is between ₹3 and ₹5 lakh',emoji:'💎'}
  ] : [{label:'Looks perfect',value:'This direction looks perfect. Please create the package.',emoji:'✨'},{label:'More relaxed',value:'Please make the pace more relaxed',emoji:'🌿'},{label:'More adventure',value:'Please add more family-friendly adventure',emoji:'🧗'}];
  return {
    reply, ready_to_build: ready, completion, quick_replies: quickReplies, profile,
    package: {
      title: profile.pace === 'Relaxed' ? 'The Gentle Wild of Meghalaya' : 'Clouds, Canyons & Living Roots',
      subtitle: `A ${profile.duration || '7-day'} family journey through Meghalaya`,
      price: profile.budget || '₹2,84,000',
      highlights: ['Living root bridges','Dawki river picnic','Private family vehicle','Curated local host'],
      assumptions: ['Subject to availability','Flights estimated separately','Private transfers included'],
      days: [
        {day:1,place:'Guwahati · Shillong',title:'Into the clouds',description:'Airport welcome, a scenic private drive and an easy evening in Shillong.'},
        {day:2,place:'Shillong',title:'Falls, forests & flavours',description:'Elephant Falls, Laitlum Canyon and a private Khasi food experience.'},
        {day:3,place:'Cherrapunji',title:'Waterfall country',description:'Nohkalikai Falls, limestone caves and a quiet nature resort.'},
        {day:4,place:'Nongriat',title:'The living bridge',description:'A guided, family-paced walk towards the iconic living root bridges.'},
        {day:5,place:'Dawki · Mawlynnong',title:'River of glass',description:'Private boat ride, riverside picnic and a slow village walk.'},
        {day:6,place:'Shillong',title:'Choose your rhythm',description:'Kayaking at Umiam or a relaxed café and local-shopping trail.'},
        {day:7,place:'Guwahati',title:'A beautiful way home',description:'Sunrise by the lake and an assisted airport transfer.'}
      ]
    }, demo_mode: true
  };
}

app.post('/api/concierge', async (req, res) => {
  if (!geminiApiKey) return res.json(demoFallback(req.body.messages || []));
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages.slice(-16) : [];
    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiApiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        generationConfig: { responseMimeType: 'application/json', responseJsonSchema: schema, temperature: 0.45 }
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'Gemini request failed');
    const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('');
    const result = JSON.parse(text);
    res.json({ ...result, provider: 'gemini' });
  } catch (error) {
    console.error(error);
    res.json(demoFallback(req.body.messages || []));
  }
});

app.get('/api/gemini-live-token', async (_req, res) => {
  if (!geminiApiKey) return res.status(503).json({ error: 'Gemini API key is not configured.' });
  try {
    const client = new GoogleGenAI({ apiKey: geminiApiKey });
    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: 'gemini-3.1-flash-live-preview',
          config: { responseModalities: ['AUDIO'], inputAudioTranscription: {} }
        }
      }
    });
    res.json({ token: token.name, model: 'gemini-3.1-flash-live-preview' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
app.use(vite.middlewares);
app.listen(5173, () => console.log('TLC TravelOS running at http://localhost:5173'));
