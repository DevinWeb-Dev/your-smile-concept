/* YOUR SMILE.
   Fictional profiles — NOT verified credentials.
*/

export const DENTIST_EDITORIAL = {
  "dr-reyes": {
    number: "01",
    color: "lavender",
    chapter: "THE ART OF LISTENING",
    heading: "A softer first",
    italic: "conversation.",

    statement:
      "Good care starts before the first procedure—with questions, trust, and time to understand what matters.",

    philosophy:
      "This fictional profile explores how a dental clinic can communicate comfort, preventive thinking, and patient education without making promises about individual results.",

    focus: [
      "Everyday oral-health conversations",
      "Preventive-care planning",
      "Understanding patient questions",
    ],

    journey: [
      [
        "Listen first",
        "Discuss concerns and expectations without rushing toward a treatment.",
      ],
      [
        "Explore the basics",
        "Explain assessment needs and possible next steps in understandable language.",
      ],
      [
        "Leave informed",
        "Invite questions about ongoing care and follow-up.",
      ],
    ],

    serviceIds: [
      "consultation",
      "cleaning",
      "restorations",
    ],

    quote:
      "Care is not just what we do. It is how clearly we help someone understand the journey.",

    questions: [
      "What happens in an initial dental assessment?",
      "How might preventive appointments be planned?",
      "When would further examination be recommended?",
    ],
  },

  "dr-cruz": {
    number: "02",
    color: "peach",
    chapter: "THE STUDY OF EXPRESSION",
    heading: "Natural thinking.",
    italic: "Careful choices.",

    statement:
      "Aesthetic conversations feel better when they focus on people rather than a single definition of the perfect smile.",

    philosophy:
      "An illustrative dentist story built around explaining cosmetic and restorative possibilities, realistic expectations, individual variation, and informed decision-making.",

    focus: [
      "Cosmetic treatment discussions",
      "Restorative options and limitations",
      "Understanding realistic expectations",
    ],

    journey: [
      [
        "Share the vision",
        "Discuss concerns and the changes someone hopes to explore.",
      ],
      [
        "Discuss what is suitable",
        "A real clinician would assess oral health before considering options.",
      ],
      [
        "Review the details",
        "Ask about limitations, costs, alternatives and long-term care.",
      ],
    ],

    serviceIds: [
      "whitening",
      "restorations",
      "consultation",
    ],

    quote:
      "A beautiful conversation begins with an honest explanation of what is—and is not—possible.",

    questions: [
      "How are cosmetic treatment options evaluated?",
      "Could restorations affect whitening expectations?",
      "What risks and ongoing care should be considered?",
    ],
  },

  "dr-santos": {
    number: "03",
    color: "blue",
    chapter: "THE ARCHITECTURE OF ALIGNMENT",
    heading: "Patient progress.",
    italic: "Thoughtful planning.",

    statement:
      "Orthodontic journeys are individual. A clear explanation of options and commitments is part of good planning.",

    philosophy:
      "This sample professional journal shows how a clinic could present alignment consultation topics, long-term follow-up, and treatment-planning conversations responsibly.",

    focus: [
      "Alignment assessment discussions",
      "Orthodontic option explanations",
      "Long-term follow-up and retention",
    ],

    journey: [
      [
        "Start with an assessment",
        "A qualified practitioner would examine alignment, bite and related structures.",
      ],
      [
        "Discuss the options",
        "Review methods, responsibilities and the limits of proposed treatment.",
      ],
      [
        "Understand the timeline",
        "Learn about monitoring, potential changes and retention considerations.",
      ],
    ],

    serviceIds: [
      "aligners",
      "consultation",
      "cleaning",
    ],

    quote:
      "A thoughtful plan makes room for questions at every stage, not only the beginning.",

    questions: [
      "What examinations inform orthodontic planning?",
      "What is involved in monitoring and retention?",
      "How are expected treatment times discussed?",
    ],
  },
};

export const dentistStory = (id) =>
  DENTIST_EDITORIAL[id] ||
  DENTIST_EDITORIAL["dr-reyes"];