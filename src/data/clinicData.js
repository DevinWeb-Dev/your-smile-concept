// YOUR SMILE — Central clinic concept configuration

export const BRAND = {
  name: "YOUR SMILE",
  wordmark: "YOUR SMILE.",
  descriptor: "DENTAL · ORTHODONTICS · COSMETIC CARE",
  tagline: "A brighter smile. A gentler experience.",
  description:
    "A modern dental clinic website concept where thoughtful design meets a more comfortable appointment experience.",
  developer: "Website Concept Made by: Web Developer Devin Planas",
  isConcept: true,
};

export const COLORS = {
  deepTeal: "#173D43",
  teal: "#315E63",
  sage: "#BDD7CB",
  powderBlue: "#DBEBEE",
  ivory: "#F9F8F3",
  cream: "#F1F0E9",
  clay: "#C58E7A",
  white: "#FFFFFF",
};

export const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1500&q=85",

  clinic:
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1500&q=85",

  treatment:
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1400&q=85",

  details:
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1400&q=85",

  dentist1:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=750&q=85",

  dentist2:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=750&q=85",

  dentist3:
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=750&q=85",
};

export const CATEGORIES = [
  "All Treatments",
  "Preventive",
  "Cosmetic",
  "Orthodontics",
  "Restorative",
  "Consultation",
];

export const TREATMENTS = [
  {
    id: "consultation",
    number: "01",
    category: "Consultation",
    name: "Dental Consultation",
    short: "A thoughtful first step toward your smile goals.",
    description:
      "A sample consultation pathway for discussing concerns, learning about possible care options, and understanding the next steps.",
    duration: 30,
    priceFrom: 500,
    image: IMAGES.clinic,
    featured: true,
    features: [
      "Initial discussion",
      "General assessment preview",
      "Care plan overview",
    ],
  },
  {
    id: "cleaning",
    number: "02",
    category: "Preventive",
    name: "Cleaning & Polishing",
    short: "Everyday smile care, made more comfortable.",
    description:
      "Preventive dental care concept focused on professional cleaning, healthy routines, and long-term oral wellness.",
    duration: 45,
    priceFrom: 1200,
    image: IMAGES.treatment,
    featured: true,
    features: [
      "Professional cleaning",
      "Polishing",
      "Oral hygiene guidance",
    ],
  },
  {
    id: "whitening",
    number: "03",
    category: "Cosmetic",
    name: "Teeth Whitening",
    short: "Explore options for a brighter-looking smile.",
    description:
      "An illustrative cosmetic dental treatment overview with consultation-led suitability and care instructions.",
    duration: 60,
    priceFrom: 4500,
    image: IMAGES.details,
    featured: true,
    features: [
      "Suitability consultation",
      "Whitening option overview",
      "Aftercare information",
    ],
  },
  {
    id: "aligners",
    number: "04",
    category: "Orthodontics",
    name: "Orthodontic Care",
    short: "A personalized approach to smile alignment.",
    description:
      "Concept treatment planning for braces and clear-aligner consultations, timelines, and individualized treatment options.",
    duration: 45,
    priceFrom: 2000,
    image: IMAGES.clinic,
    featured: false,
    features: [
      "Alignment consultation",
      "Treatment options",
      "Estimated care journey",
    ],
  },
  {
    id: "restorations",
    number: "05",
    category: "Restorative",
    name: "Dental Restorations",
    short: "Function, comfort, and natural-looking results.",
    description:
      "An overview of restorative dental services such as fillings and other repair options assessed by a licensed professional.",
    duration: 60,
    priceFrom: 1800,
    image: IMAGES.treatment,
    featured: false,
    features: [
      "Dental assessment",
      "Restoration options",
      "Post-treatment advice",
    ],
  },
  {
    id: "implants",
    number: "06",
    category: "Restorative",
    name: "Implant Consultation",
    short: "Explore long-term tooth replacement options.",
    description:
      "A concept consultation for understanding dental implant suitability, procedures, and individualized treatment planning.",
    duration: 45,
    priceFrom: 1500,
    image: IMAGES.details,
    featured: false,
    features: [
      "Eligibility discussion",
      "Treatment pathway",
      "Estimated next steps",
    ],
  },
];

// Fictional names and illustrative portraits.
// These are NOT real verified clinic staff profiles.
export const DENTISTS = [
  {
    id: "dr-reyes",
    name: "Dr. Alexandra Reyes",
    role: "General Dentistry",
    specialty: "Preventive & Comprehensive Care",
    image: IMAGES.dentist1,
    bio: "An illustrative team profile representing a calm, patient-focused approach to everyday dental care.",
    tag: "CARE & PREVENTION",
  },
  {
    id: "dr-cruz",
    name: "Dr. Miguel Cruz",
    role: "Cosmetic Dentistry",
    specialty: "Smile Aesthetics & Restorative Options",
    image: IMAGES.dentist3,
    bio: "A fictional provider profile highlighting consultation-led cosmetic and restorative treatment planning.",
    tag: "SMILE AESTHETICS",
  },
  {
    id: "dr-santos",
    name: "Dr. Sofia Santos",
    role: "Orthodontic Care",
    specialty: "Alignment Consultation & Planning",
    image: IMAGES.dentist2,
    bio: "An illustrative professional profile for personalized orthodontic consultations and longer-term care journeys.",
    tag: "ALIGNMENT CARE",
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export const FAQS = [
  {
    question: "How do I request an appointment?",
    answer:
      "On this demo website, select a treatment, sample provider, preferred date and time. Your request is saved only in this browser. A real clinic website would require a secure backend and staff confirmation.",
  },
  {
    question: "Are the listed treatment prices final?",
    answer:
      "No. These are illustrative Philippine peso rates for demonstrating a treatment catalog. Actual costs depend on the clinic, clinical assessment and recommended treatment.",
  },
  {
    question: "Can I request a consultation before a treatment?",
    answer:
      "Yes. The concept includes a Dental Consultation option to demonstrate an initial inquiry or appointment request.",
  },
  {
    question: "Are the dentist profiles real?",
    answer:
      "No. Names, biographies and photographs are illustrative placeholders. They should be replaced with verified, consented staff information for a real clinic.",
  },
];

export function formatPeso(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatTime(value) {
  if (!value || !value.includes(":")) return "—";

  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);

  return `${hour % 12 || 12}:${minute} ${
    hour >= 12 ? "PM" : "AM"
  }`;
}

export function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T12:00:00`);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
}