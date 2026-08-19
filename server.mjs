import express from "express";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();
app.use(express.json({ limit: "2mb" }));

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.gemini_api_key;

const systemPrompt = `You are Aira, TLC Holidays' expert India travel concierge. You have a warm, concise, highly attentive voice. Your job is to discover what would make a genuinely great holiday and then create a thoughtful package.

Ask only ONE useful question per turn. Do not repeat facts the traveler already gave. Prioritize, in order: departure city, approximate dates or month, number of nights, total budget, pace, interests, hotel comfort, food or mobility needs. Set ready_to_build true only when destination/region, travelers, departure city, dates/month, duration, budget, pace, interests and hotel comfort are all known. At that point, ask the traveler to review and confirm their request summary; do not imply that the package has already been generated.

Make this a tap-first experience. For every question, include 3 to 6 concise quick_replies that are realistic answers to the exact question. Each option needs a short label, the complete value to send back, and one suitable emoji. If the trip is ready, return quick_replies for refinement such as “Looks perfect”, “Change the pace”, and “Adjust budget”. Never include an “Other” option because the interface provides it automatically.

TLC is an Indian travel company. Unless the traveler explicitly says otherwise, suggest Indian departure cities, show budgets in Indian rupees, and use Indian travel context.

This is a prototype. Never claim live availability or confirmed prices. For emergencies, tell users to call local emergency services rather than relying solely on the app. Return valid JSON matching the requested shape. Keep reply under 70 words.`;

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: { type: "string" },
    ready_to_build: { type: "boolean" },
    completion: { type: "integer" },
    quick_replies: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          emoji: { type: "string" },
        },
        required: ["label", "value", "emoji"],
      },
    },
    profile: {
      type: "object",
      additionalProperties: false,
      properties: {
        destination: { type: "string" },
        departure_city: { type: "string" },
        travel_dates: { type: "string" },
        duration: { type: "string" },
        budget: { type: "string" },
        travelers: { type: "string" },
        interests: { type: "array", items: { type: "string" } },
        hotel_style: { type: "string" },
        pace: { type: "string" },
      },
      required: [
        "destination",
        "departure_city",
        "travel_dates",
        "duration",
        "budget",
        "travelers",
        "interests",
        "hotel_style",
        "pace",
      ],
    },
    package: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        subtitle: { type: "string" },
        price: { type: "string" },
        days: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              day: { type: "integer" },
              place: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
            },
            required: ["day", "place", "title", "description"],
          },
        },
        highlights: { type: "array", items: { type: "string" } },
        assumptions: { type: "array", items: { type: "string" } },
      },
      required: [
        "title",
        "subtitle",
        "price",
        "days",
        "highlights",
        "assumptions",
      ],
    },
  },
  required: [
    "reply",
    "ready_to_build",
    "completion",
    "quick_replies",
    "profile",
    "package",
  ],
};

function demoFallback(messages) {
  const profile = {
    destination: "",
    departure_city: "",
    travel_dates: "",
    duration: "",
    budget: "",
    travelers: "",
    interests: [],
    hotel_style: "",
    pace: "",
  };
  const months =
    "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec";
  let previous = "";
  for (const message of messages) {
    const text = String(message.content || "");
    if (message.role === "assistant") {
      previous = text.toLowerCase();
      continue;
    }
    const lower = text.toLowerCase();
    if (
      /north.?east|meghalaya|shillong|cherrapunji|assam|sikkim|arunachal/.test(
        lower,
      )
    )
      profile.destination = /sikkim/.test(lower)
        ? "Sikkim"
        : /arunachal/.test(lower)
          ? "Arunachal Pradesh"
          : "Meghalaya & North East India";
    if (/family of 4|four of us|4 people/.test(lower))
      profile.travelers = "2 adults · 2 children (9 & 13)";
    if (/daughter|child|kid/.test(lower) && !profile.travelers)
      profile.travelers = "Family with children";
    const city = text.match(
      /(?:from|depart(?:ing)? from|starting from)\s+([A-Za-z ]{3,30})/i,
    );
    if (city) profile.departure_city = city[1].trim();
    else if (
      /depart|starting city|fly from|which city|begin your journey/.test(
        previous,
      ) &&
      text.length < 40
    )
      profile.departure_city = text.trim();
    const date = text.match(
      new RegExp(
        `(?:${months})(?:\\s+\\d{4})?|\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${months})(?:\\s+\\d{4})?`,
        "i",
      ),
    );
    if (date) profile.travel_dates = date[0];
    else if (/when|date|month/.test(previous) && text.length < 60)
      profile.travel_dates = text.trim();
    const duration = text.match(/\b(\d{1,2})\s*(nights?|days?)\b/i);
    if (duration) profile.duration = `${duration[1]} ${duration[2]}`;
    else if (
      /how long|duration|nights|days/.test(previous) &&
      /^\s*\d{1,2}\s*$/.test(text)
    )
      profile.duration = `${text.trim()} days`;
    const budget = text.match(
      /(?:₹|rs\.?|inr)?\s*([\d,.]+)\s*(lakh|lac|k|thousand)?/i,
    );
    if (
      (/budget|₹|lakh|lac|inr|rs\.?/i.test(text) || /budget/.test(previous)) &&
      budget
    )
      profile.budget = `₹${budget[1]}${budget[2] ? ` ${budget[2]}` : ""}`;
    if (/nature|waterfall|scenic/.test(lower)) profile.interests.push("Nature");
    if (/adventure|trek|kayak|cav/.test(lower))
      profile.interests.push("Soft adventure");
    if (/food|culture|local/.test(lower))
      profile.interests.push("Culture & food");
    if (/luxury|5 star|five star/.test(lower))
      profile.hotel_style = "Luxury 5★";
    else if (/premium|4 star|four star/.test(lower))
      profile.hotel_style = "Premium 4★";
    if (/relax|slow|easy/.test(lower)) profile.pace = "Relaxed";
    else if (/packed|active|adventure/.test(lower))
      profile.pace = "Active but balanced";
  }
  profile.interests = [...new Set(profile.interests)];
  if (!profile.destination) profile.destination = "North East India";
  if (!profile.travelers) profile.travelers = "Family of 4";
  const essentials = [
    profile.destination,
    profile.travelers,
    profile.departure_city,
    profile.travel_dates,
    profile.duration,
    profile.budget,
  ];
  const completion = Math.min(
    96,
    18 +
      essentials.filter(Boolean).length * 12 +
      [profile.interests.length, profile.hotel_style, profile.pace].filter(
        Boolean,
      ).length *
        5,
  );
  let reply = "";
  if (!profile.departure_city)
    reply =
      "That sounds wonderful—the North East is magical for a family adventure. Which city would you like to begin your journey from?";
  else if (!profile.travel_dates)
    reply = `Perfect, I’ll plan the journey from ${profile.departure_city}. When would you like to travel—do you have dates or at least a preferred month?`;
  else if (!profile.duration)
    reply =
      "Lovely timing. How many days or nights would feel comfortable for this holiday?";
  else if (!profile.budget)
    reply =
      "And what approximate total budget would you like me to design around, including stays and local travel?";
  else if (!profile.pace)
    reply =
      "What pace would feel best for everyone—relaxed, balanced, or active?";
  else if (!profile.interests.length)
    reply = "Which experience mix matters most to your family?";
  else if (!profile.hotel_style)
    reply = "What level of hotel comfort would you like me to shortlist?";
  else
    reply =
      "I have everything I need. Please review your request summary and confirm it before I curate the complete holiday.";
  const ready =
    essentials.every(Boolean) &&
    Boolean(profile.pace) &&
    Boolean(profile.interests.length) &&
    Boolean(profile.hotel_style);
  const quickReplies = !profile.departure_city
    ? [
        { label: "Mumbai", value: "We will depart from Mumbai", emoji: "🏙️" },
        { label: "Delhi", value: "We will depart from Delhi", emoji: "✈️" },
        {
          label: "Bengaluru",
          value: "We will depart from Bengaluru",
          emoji: "🌆",
        },
      ]
    : !profile.travel_dates
      ? [
          {
            label: "October",
            value: "We would like to travel in October 2026",
            emoji: "🍂",
          },
          {
            label: "November",
            value: "We would like to travel in November 2026",
            emoji: "🌤️",
          },
          {
            label: "December",
            value: "We would like to travel in December 2026",
            emoji: "❄️",
          },
        ]
      : !profile.duration
        ? [
            {
              label: "5 days",
              value: "We have 5 days for this holiday",
              emoji: "⚡",
            },
            {
              label: "7 days",
              value: "We have 7 days for this holiday",
              emoji: "✨",
            },
            {
              label: "9 days",
              value: "We have 9 days for this holiday",
              emoji: "🌿",
            },
          ]
        : !profile.budget
          ? [
              {
                label: "Up to ₹2L",
                value: "Our total budget is up to ₹2 lakh",
                emoji: "💚",
              },
              {
                label: "₹2–3 lakh",
                value: "Our total budget is between ₹2 and ₹3 lakh",
                emoji: "⭐",
              },
              {
                label: "₹3–5 lakh",
                value: "Our total budget is between ₹3 and ₹5 lakh",
                emoji: "💎",
              },
            ]
          : !profile.pace
            ? [
                {
                  label: "Relaxed",
                  value:
                    "We prefer a relaxed pace with plenty of breathing room",
                  emoji: "🌿",
                },
                {
                  label: "Balanced",
                  value:
                    "We prefer a balanced pace with a mix of activity and rest",
                  emoji: "⚖️",
                },
                {
                  label: "Active",
                  value: "We prefer an active itinerary with full days",
                  emoji: "⚡",
                },
              ]
            : !profile.interests.length
              ? [
                  {
                    label: "Nature & scenery",
                    value: "We care most about nature, scenery and wildlife",
                    emoji: "🌄",
                  },
                  {
                    label: "Culture & food",
                    value: "We care most about local culture and food",
                    emoji: "🥘",
                  },
                  {
                    label: "Family adventure",
                    value:
                      "We want a mix of family-friendly adventure and iconic sights",
                    emoji: "🧗",
                  },
                ]
              : !profile.hotel_style
                ? [
                    {
                      label: "Comfortable 3★",
                      value: "We prefer comfortable three-star hotels",
                      emoji: "🛏️",
                    },
                    {
                      label: "Premium 4★",
                      value: "We prefer premium four-star hotels",
                      emoji: "⭐",
                    },
                    {
                      label: "Luxury 5★",
                      value: "We prefer luxury five-star hotels",
                      emoji: "💎",
                    },
                  ]
                : [
                    {
                      label: "Looks perfect",
                      value:
                        "This direction looks perfect. Please create the package.",
                      emoji: "✨",
                    },
                    {
                      label: "More relaxed",
                      value: "Please make the pace more relaxed",
                      emoji: "🌿",
                    },
                    {
                      label: "More adventure",
                      value: "Please add more family-friendly adventure",
                      emoji: "🧗",
                    },
                  ];
  return {
    reply,
    ready_to_build: ready,
    completion,
    quick_replies: quickReplies,
    profile,
    package: {
      title:
        profile.pace === "Relaxed"
          ? "The Gentle Wild of Meghalaya"
          : "Clouds, Canyons & Living Roots",
      subtitle: `A ${profile.duration || "7-day"} family journey through Meghalaya`,
      price: profile.budget || "₹2,84,000",
      highlights: [
        "Living root bridges",
        "Dawki river picnic",
        "Private family vehicle",
        "Curated local host",
      ],
      assumptions: [
        "Subject to availability",
        "Flights estimated separately",
        "Private transfers included",
      ],
      days: [
        {
          day: 1,
          place: "Guwahati · Shillong",
          title: "Into the clouds",
          description:
            "Airport welcome, a scenic private drive and an easy evening in Shillong.",
        },
        {
          day: 2,
          place: "Shillong",
          title: "Falls, forests & flavours",
          description:
            "Elephant Falls, Laitlum Canyon and a private Khasi food experience.",
        },
        {
          day: 3,
          place: "Cherrapunji",
          title: "Waterfall country",
          description:
            "Nohkalikai Falls, limestone caves and a quiet nature resort.",
        },
        {
          day: 4,
          place: "Nongriat",
          title: "The living bridge",
          description:
            "A guided, family-paced walk towards the iconic living root bridges.",
        },
        {
          day: 5,
          place: "Dawki · Mawlynnong",
          title: "River of glass",
          description:
            "Private boat ride, riverside picnic and a slow village walk.",
        },
        {
          day: 6,
          place: "Shillong",
          title: "Choose your rhythm",
          description:
            "Kayaking at Umiam or a relaxed café and local-shopping trail.",
        },
        {
          day: 7,
          place: "Guwahati",
          title: "A beautiful way home",
          description: "Sunrise by the lake and an assisted airport transfer.",
        },
      ],
    },
    demo_mode: true,
  };
}

const packageSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    price: { type: "string" },
    duration: { type: "string" },
    destination: { type: "string" },
    departure_city: { type: "string" },
    travel_dates: { type: "string" },
    travelers: { type: "string" },
    pace: { type: "string" },
    hotel_style: { type: "string" },
    interests: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
    highlights: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    route: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          place: { type: "string" },
          nights: { type: "string" },
          drive: { type: "string" },
        },
        required: ["place", "nights", "drive"],
      },
    },
    days: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          day: { type: "integer" },
          place: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          morning: { type: "string" },
          afternoon: { type: "string" },
          evening: { type: "string" },
          transfer: { type: "string" },
          meals: { type: "string" },
          stay_area: { type: "string" },
        },
        required: [
          "day",
          "place",
          "title",
          "description",
          "morning",
          "afternoon",
          "evening",
          "transfer",
          "meals",
          "stay_area",
        ],
      },
    },
    cost_breakdown: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" }, amount: { type: "string" } },
        required: ["label", "amount"],
      },
    },
    weather: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string" },
        summary: { type: "string" },
        low: { type: "string" },
        high: { type: "string" },
        packing: { type: "array", items: { type: "string" } },
      },
      required: ["label", "summary", "low", "high", "packing"],
    },
    hotel_options: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          place: { type: "string" },
          type: { type: "string" },
          rating: { type: "string" },
          price: { type: "string" },
          tag: { type: "string" },
        },
        required: ["name", "place", "type", "rating", "price", "tag"],
      },
    },
    experience_options: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          icon: { type: "string" },
          title: { type: "string" },
          meta: { type: "string" },
          price: { type: "string" },
        },
        required: ["icon", "title", "meta", "price"],
      },
    },
    safety: {
      type: "object",
      additionalProperties: false,
      properties: {
        hospitals: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              location: { type: "string" },
              phone: { type: "string" },
            },
            required: ["name", "location", "phone"],
          },
        },
        police: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              location: { type: "string" },
              phone: { type: "string" },
            },
            required: ["name", "location", "phone"],
          },
        },
        taxi_rates: { type: "array", items: { type: "string" } },
        common_issues: { type: "array", items: { type: "string" } },
        advice: { type: "array", items: { type: "string" } },
      },
      required: [
        "hospitals",
        "police",
        "taxi_rates",
        "common_issues",
        "advice",
      ],
    },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { title: { type: "string" }, url: { type: "string" } },
        required: ["title", "url"],
      },
    },
  },
  required: [
    "title",
    "subtitle",
    "price",
    "duration",
    "destination",
    "departure_city",
    "travel_dates",
    "travelers",
    "pace",
    "hotel_style",
    "interests",
    "summary",
    "highlights",
    "assumptions",
    "route",
    "days",
    "cost_breakdown",
    "weather",
    "hotel_options",
    "experience_options",
    "safety",
    "sources",
  ],
};

function dynamicPackageFallback(profile = {}) {
  const destination = profile.destination || "your chosen destination";
  const count = Math.max(
    3,
    Math.min(10, Number(String(profile.duration || "").match(/\d+/)?.[0]) || 5),
  );
  const price = profile.budget || "Estimate pending";
  const days = Array.from({ length: count }, (_, index) => ({
    day: index + 1,
    place: destination,
    title:
      index === 0
        ? `Arrival in ${destination}`
        : index === count - 1
          ? "A relaxed journey home"
          : `Discover ${destination}`,
    description: `A thoughtfully paced day shaped around ${profile.interests?.join(", ") || "local highlights"}, with time kept flexible for the travelers.`,
    morning:
      index === 0
        ? "Arrival assistance and private transfer"
        : "Signature local experience",
    afternoon: "Curated sightseeing at a comfortable pace",
    evening: "Unhurried evening and local dining suggestions",
    transfer: "Private vehicle as required",
    meals: "Breakfast included; other meals suggested",
    stay_area: destination,
  }));
  return {
    title: `A thoughtfully curated ${destination} journey`,
    subtitle: `${count} days designed for ${profile.travelers || "your travelers"}`,
    price,
    duration: profile.duration || `${count} days`,
    destination,
    departure_city: profile.departure_city || "To be confirmed",
    travel_dates: profile.travel_dates || "Flexible",
    travelers: profile.travelers || "Travel party confirmed",
    pace: profile.pace || "Balanced",
    hotel_style: profile.hotel_style || "Comfortable hotels",
    interests: profile.interests?.length ? profile.interests : ["Local highlights"],
    summary: `${profile.pace || "Balanced"} holiday focused on ${profile.interests?.join(", ") || "local highlights"}.`,
    highlights: profile.interests?.length
      ? profile.interests
      : ["Local highlights", "Private transfers", "Flexible pacing"],
    assumptions: [
      "Live availability requires specialist confirmation",
      "Hotel and optional experience selection remains pending",
    ],
    route: [
      {
        place: destination,
        nights: `${Math.max(1, count - 1)} nights`,
        drive: "Private transfers planned",
      },
    ],
    days,
    cost_breakdown: [
      { label: "Complete land package estimate", amount: price },
    ],
    weather: {
      label: "Seasonal outlook",
      summary: "Weather will be reconfirmed before departure.",
      low: "Check closer to travel",
      high: "Check closer to travel",
      packing: [
        "Comfortable walking shoes",
        "Light layers",
        "Personal medication",
      ],
    },
    hotel_options: [
      { name: `${destination} stay option A`, place: destination, type: profile.hotel_style || "Comfortable stay", rating: "Specialist review", price: "Contracted rate pending", tag: "Best route fit" },
      { name: `${destination} stay option B`, place: destination, type: profile.hotel_style || "Comfortable stay", rating: "Specialist review", price: "Contracted rate pending", tag: "Best family fit" },
      { name: `${destination} stay option C`, place: destination, type: profile.hotel_style || "Comfortable stay", rating: "Specialist review", price: "Contracted rate pending", tag: "Alternative option" }
    ],
    experience_options: (profile.interests?.length ? profile.interests : ["Local highlights", "Culture", "Nature"]).slice(0,4).map((interest, index) => ({ icon: ["✨","🌿","🥘","🧭"][index] || "✨", title: `${interest} experience`, meta: `${destination} · Specialist-curated option`, price: "Price on selection" })),
    safety: {
      hospitals: [{ name: `Nearest verified hospital for the ${destination} route`, location: "TLC specialist to reconfirm before departure", phone: "Emergency: 112" }],
      police: [{ name: `Nearest verified police station for the ${destination} route`, location: "TLC specialist to reconfirm before departure", phone: "Emergency: 112" }],
      taxi_rates: ["Local rates to be verified by the TLC specialist"],
      common_issues: ["Availability and operating hours may change"],
      advice: ["Keep emergency number 112 available throughout travel"],
    },
    sources: [],
    fallback: true,
  };
}

function pcmToWav(pcm, sampleRate = 24000) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

app.post("/api/concierge", async (req, res) => {
  if (!geminiApiKey) return res.json(demoFallback(req.body.messages || []));
  try {
    const messages = Array.isArray(req.body.messages)
      ? req.body.messages.slice(-16)
      : [];
    const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: schema,
            temperature: 0.45,
          },
        }),
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data?.error?.message || "Gemini request failed");
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");
    const result = JSON.parse(text);
    const fallback = demoFallback(req.body.messages || []);
    const validQuickReplies = Array.isArray(result.quick_replies)
      ? result.quick_replies
          .filter((option) => option?.label && option?.value)
          .slice(0, 6)
      : [];
    const quickReplies =
      validQuickReplies.length >= 3
        ? validQuickReplies
        : fallback.quick_replies;
    res.json({ ...result, quick_replies: quickReplies, provider: "gemini" });
  } catch (error) {
    console.error(error);
    res.json(demoFallback(req.body.messages || []));
  }
});

app.post("/api/package", async (req, res) => {
  const profile = req.body.profile || {};
  const messages = Array.isArray(req.body.messages)
    ? req.body.messages.slice(-20)
    : [];
  const fallback = dynamicPackageFallback(profile);
  if (!geminiApiKey)
    return res.json({ package: fallback, provider: "local-fallback" });
  try {
    const model = process.env.GEMINI_PACKAGE_MODEL || "gemini-3-flash-preview";
    const prompt = `Create a complete, presentation-ready holiday package for TLC Holidays from the confirmed traveler brief below.

Use Google Search to research the requested destination and travel period. Ground attractions, realistic drive logic, seasonal weather, approximate taxi pricing, hospitals and police stations in current public information. Prefer official tourism, hospital, police/government and established travel sources. Do not claim live availability or that any hotel has a TLC contract. Hotel and optional tour/experience choices must remain pending for the TLC specialist and traveler to select.

Every required field must contain useful destination-specific information. Create exactly the number of itinerary days requested where practical. Costs must be in INR and remain within the stated total budget. The price is an estimate, not a confirmed booking. Avoid generic placeholders such as “to be decided”, except where live availability genuinely requires specialist confirmation.

CONFIRMED PROFILE:
${JSON.stringify(profile, null, 2)}

CONVERSATION CONTEXT:
${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: packageSchema,
            temperature: 0.35,
          },
        }),
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data?.error?.message || "Package generation failed");
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");
    const result = JSON.parse(text);
    const groundedSources = (
      data.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    )
      .map((chunk) => chunk.web)
      .filter((source) => source?.uri && source?.title)
      .map((source) => ({ title: source.title, url: source.uri }));
    const packageData = {
      ...fallback,
      ...result,
      destination:
        result.destination || profile.destination || fallback.destination,
      departure_city:
        result.departure_city ||
        profile.departure_city ||
        fallback.departure_city,
      travel_dates:
        result.travel_dates || profile.travel_dates || fallback.travel_dates,
      duration: result.duration || profile.duration || fallback.duration,
      travelers: result.travelers || profile.travelers || fallback.travelers,
      days:
        Array.isArray(result.days) && result.days.length
          ? result.days
          : fallback.days,
      route:
        Array.isArray(result.route) && result.route.length
          ? result.route
          : fallback.route,
      cost_breakdown:
        Array.isArray(result.cost_breakdown) && result.cost_breakdown.length
          ? result.cost_breakdown
          : fallback.cost_breakdown,
      hotel_options: Array.isArray(result.hotel_options)
        ? result.hotel_options
        : [],
      experience_options: Array.isArray(result.experience_options)
        ? result.experience_options
        : [],
      sources: groundedSources.length
        ? groundedSources.slice(0, 8)
        : (result.sources || []).slice(0, 8),
    };
    res.json({
      package: packageData,
      provider: "gemini-grounded",
      researched_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.json({
      package: fallback,
      provider: "local-fallback",
      warning:
        "Live research was unavailable; specialist verification required.",
    });
  }
});

app.get("/api/gemini-live-token", async (_req, res) => {
  if (!geminiApiKey)
    return res.status(503).json({ error: "Gemini API key is not configured." });
  try {
    const client = new GoogleGenAI({ apiKey: geminiApiKey });
    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: "gemini-3.1-flash-live-preview",
          config: {
            responseModalities: ["AUDIO"],
            inputAudioTranscription: {},
            realtimeInputConfig: {
              automaticActivityDetection: {
                disabled: false,
                startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
                endOfSpeechSensitivity: "END_SENSITIVITY_LOW",
                prefixPaddingMs: 80,
                silenceDurationMs: 1800,
              },
            },
          },
        },
      },
    });
    res.json({ token: token.name, model: "gemini-3.1-flash-live-preview" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/speech", async (req, res) => {
  if (!geminiApiKey)
    return res.status(503).json({ error: "Gemini API key is not configured." });
  const text = String(req.body.text || "")
    .trim()
    .slice(0, 1200);
  if (!text) return res.status(400).json({ error: "Speech text is required." });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  res.on("close", () => controller.abort());
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Synthesize speech for the transcript below.\n\nVoice profile: warm, polished adult female travel concierge. Calm confidence, natural conversational rhythm, subtle Indian English pronunciation, gentle warmth, crisp articulation, medium pace. Sound premium and human, never theatrical, breathy, robotic, or overly cheerful. Do not add, remove, or paraphrase words.\n\nTranscript:\n${text}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
            },
          },
        }),
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data?.error?.message || "Gemini speech generation failed",
      );
    const audio = data.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData,
    )?.inlineData;
    if (!audio?.data) throw new Error("Gemini did not return audio");
    const pcm = Buffer.from(audio.data, "base64");
    res.set({ "Content-Type": "audio/wav", "Cache-Control": "no-store" });
    res.send(pcmToWav(pcm, 24000));
  } catch (error) {
    if (!controller.signal.aborted) console.error(error);
    if (!res.headersSent && !res.destroyed)
      res
        .status(controller.signal.aborted ? 504 : 500)
        .json({
          error: controller.signal.aborted
            ? "Speech generation timed out"
            : error.message,
        });
  } finally {
    clearTimeout(timeout);
  }
});

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "spa",
});
app.use(vite.middlewares);
app.listen(5173, () =>
  console.log("TLC TravelOS running at http://localhost:5173"),
);
