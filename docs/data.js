/* EE Business mobile call flow — competitor battle cards.
   Source: EE Business Competitor Battle Cards, BT Local Business London West, FY26/27.

   Node kinds:
   - "script": say variants + response options
   - "probe":  a Core Four question with why-it-matters and answer routing
   - "pain":   follow-up question, the PIC (problem/root cause/impact), attack line
   - "card":   renders the battle card for the provider captured in Q1
   - "end":    terminal state with checklist
*/

const DATA = {

  stages: ["Core Four", "The Pain", "Battle Card", "Close"],

  tree: {

    /* ---------------- CORE FOUR ---------------- */

    start: {
      kind: "probe",
      stage: 0,
      step: "1",
      title: "The Network",
      ask: "What network are you currently with?",
      why: "Routes you to the right battle card. Ask this first, every time.",
      tip: "Four questions on every mobile call, no exceptions. They take under two minutes and the answers route everything.",
      optionsLabel: "They're with",
      options: [
        { label: "Vodafone", to: "core_estate", set: { card: "vodafone" } },
        { label: "O2 / Virgin Media O2", to: "core_estate", set: { card: "o2" } },
        { label: "Three / VodafoneThree", to: "core_estate", set: { card: "three" } },
        { label: "Budget SIM-only or MVNO", to: "core_estate", set: { card: "mvno" } },
        { label: "Already EE, or not sure", to: "core_estate", set: { card: "unknown" } }
      ]
    },

    core_estate: {
      kind: "probe",
      stage: 0,
      step: "2",
      title: "The Estate",
      ask: "How many mobiles do you have, and any tablets or other SIM devices?",
      why: "Sizes the deal and surfaces hidden connections.",
      tip: "Chase the hidden SIMs: tablets, smartwatches, trackers, routers, card machines, CCTV. Hidden connections mean a bigger deal.",
      optionsLabel: "Size of the estate",
      options: [
        { label: "Small team, under 10 lines", to: "core_contract", set: { segment: "sme" } },
        { label: "10 or more, or multi-site", to: "core_contract", set: { segment: "corporate" } },
        { label: "They don't know", to: "core_contract", set: { segment: "unknown" } }
      ]
    },

    core_contract: {
      kind: "probe",
      stage: 0,
      step: "3",
      title: "The Contract",
      ask: "When does the contract end, and is it one end date or several?",
      why: "Timing to diarise, and it tees up the co-terminus question.",
      tip: "Misaligned estates renew site by site with zero leverage. That gap is your opening.",
      optionsLabel: "Their answer",
      options: [
        { label: "One aligned end date", to: "core_pain" },
        { label: "Several different dates", to: "core_pain" },
        { label: "Mid-contract", to: "objection_midcontract" },
        { label: "They don't know", to: "core_pain" }
      ]
    },

    core_pain: {
      kind: "probe",
      stage: 1,
      step: "4",
      title: "The Pain",
      ask: "What's the biggest frustration with mobile right now?",
      why: "The pain picks the PIC, and the PIC picks your attack.",
      tip: "Let them name it. Whatever they say, there's a branch for it below.",
      optionsLabel: "If the reply sounds like",
      options: [
        { label: "Signal's patchy, calls drop", to: "pain_coverage" },
        { label: "The bills keep creeping up", to: "pain_bills" },
        { label: "Everything goes through an account manager", to: "pain_portal" },
        { label: "Handsets are old or keep breaking", to: "pain_devices" },
        { label: "Honestly, it's all fine", to: "pain_fine" }
      ]
    },

    /* ---------------- PAIN BRANCHES ---------------- */

    pain_coverage: {
      kind: "pain",
      stage: 1,
      title: "Coverage and 5G",
      heard: "Signal's patchy, calls drop.",
      followUp: "Where exactly? Vans, sites, in town at peak times? And what does a lost customer call actually cost you?",
      pic: {
        name: "Coverage & 5G",
        problem: "Staff experience poor signal, dropped calls or slow data whilst working.",
        cause: "The current network doesn't provide reliable coverage where employees work.",
        impact: "Lost customer calls, lower productivity, delayed access to cloud applications and lost revenue."
      },
      attack: "Their card's coverage points, then the ESN proof: trusted when lives depend on it.",
      say: "The Home Office signed a £1.29 billion contract for EE to keep 300,000 police, fire and ambulance responders connected until 2032. If the network is trusted when lives depend on it, it will keep your team connected anywhere in the UK.",
      next: { label: "Play the battle card", to: "battle_card" }
    },

    pain_bills: {
      kind: "pain",
      stage: 1,
      title: "Out-of-tariff and unused connections",
      heard: "The bills keep creeping up.",
      followUp: "Who checks them? Any out-of-tariff charges, or SIMs nobody's used for months?",
      pic: {
        name: "Out-of-Tariff · Unused Connections",
        problem: "Monthly bills regularly exceed expectations, and the business pays for SIMs no longer in use.",
        cause: "No usage alerts, no proactive tariff management and no regular estate audits.",
        impact: "Unnecessary spend, budget overruns and poor financial control."
      },
      attack: "Cost-of-estate pivot. Never price-match. Offer the estate audit.",
      say: "Per line, maybe. Per business, rarely. Add up the dropped calls, out-of-tariff charges and SIMs nobody uses. The cheapest bill is rarely the cheapest estate.",
      flag: "One of the two most reps never ask about. Near-universal and easy to evidence.",
      next: { label: "Play the battle card", to: "battle_card" }
    },

    pain_portal: {
      kind: "pain",
      stage: 1,
      title: "Portal control",
      heard: "Everything goes through an account manager, changes take ages.",
      followUp: "How long to connect a new starter? Could you do it yourselves online, today, if you had to?",
      pic: {
        name: "Portal Control",
        problem: "The business has limited visibility and control of its mobile estate.",
        cause: "No effective self-service portal or central management.",
        impact: "Time wasted on administration, slower changes and poor cost control."
      },
      attack: "The Mobile Manager story: instant eSIMs, SIM swaps, bars, caps, online hardware ordering.",
      say: "Mobile Manager gives you 24/7 self-serve control. Deploy an eSIM instantly, swap a SIM, set data bars and caps, order hardware online. No waiting on an account manager.",
      next: { label: "Play the battle card", to: "battle_card" }
    },

    pain_devices: {
      kind: "pain",
      stage: 1,
      title: "Device lifecycle and SIM replacement",
      heard: "Handsets are old or keep breaking.",
      followUp: "How do you buy handsets today, and what happens mid-contract when one dies?",
      pic: {
        name: "Device Lifecycle · SIM Replacement",
        problem: "Employees use unreliable or outdated handsets, and are without service when a SIM is lost or damaged.",
        cause: "Devices aren't refreshed consistently, and replacement from the current provider is slow.",
        impact: "Reduced productivity, more IT support requests, downtime and a poorer customer experience."
      },
      attack: "Anytime Upgrades for SME, or the Hardware Fund for corporate. Never settle for SIM-only.",
      say: "Anytime Upgrades mean no being trapped with obsolete or broken handsets for 24 to 36 months. You refresh mid-contract as the business changes.",
      next: { label: "Play the battle card", to: "battle_card" }
    },

    pain_fine: {
      kind: "pain",
      stage: 1,
      title: "No pain today is not no deal",
      heard: "Honestly, it's all fine.",
      followUp: "Two quick ones then: are all your contracts on one end date? And is it genuinely full signal everywhere, even in town at 5pm?",
      pic: {
        name: "Co-terminus · Coverage & 5G",
        problem: "Contracts end at different times and coverage has never been properly tested.",
        cause: "Services added over several years without aligning renewal dates, and signal judged on bars rather than data.",
        impact: "Reduced buying power at renewal, and productivity lost in congestion without anyone attributing it to the network."
      },
      attack: "The alignment question, then diarise the renewal. No pain today does not mean no deal.",
      say: "Happy, or just used to them? When did you last test that against the market? A ten-minute review costs nothing, and unused SIMs alone usually pay for the call.",
      next: { label: "Play the battle card", to: "battle_card" }
    },

    /* ---------------- BATTLE CARD ---------------- */

    battle_card: {
      kind: "card",
      stage: 2,
      title: "Battle card",
      next: { label: "Ask the alignment question", to: "ask_alignment" }
    },

    ask_alignment: {
      kind: "script",
      stage: 2,
      title: "Ask on every call",
      segmentSay: {
        corporate: {
          label: "Corporate: the co-terminus question",
          text: "Are all your mobile contracts aligned to one end date? If not, you're renewing site by site instead of using your entire account to broker the best deal. Every EE corporate contract we write is co-terminus."
        },
        sme: {
          label: "SME: lead with Anytime Upgrades",
          text: "Anytime Upgrades mean you're never trapped with obsolete or broken handsets for 24 to 36 months. You refresh mid-contract as the business changes, so your tech keeps pace with your growth rather than decaying over a 36-month lock-in."
        },
        unknown: {
          label: "Corporate accounts",
          text: "Are all your mobile contracts aligned to one end date? If not, you're renewing site by site instead of using your entire account to broker the best deal. Every EE corporate contract we write is co-terminus."
        }
      },
      tip: "Co-terminus is a corporate offer. Never promise it to an SME. For SME prospects the equivalent hook is Anytime Upgrades.",
      optionsLabel: "Where it lands",
      options: [
        { label: "Interested, keep going", to: "close", primary: true },
        { label: "They raise an objection", to: "objections" },
        { label: "Contracts are misaligned", to: "close" }
      ]
    },

    /* ---------------- OBJECTIONS ---------------- */

    objections: {
      kind: "script",
      stage: 2,
      title: "Quick-fire objection handling",
      say: [
        {
          label: "The rule",
          text: "Never argue. The goal is to earn one more question."
        }
      ],
      tip: "Full objection list is in the Objections panel on the left. These are the four you'll hear most on a mobile call.",
      optionsLabel: "What they said",
      options: [
        { label: "We're mid-contract", to: "objection_midcontract" },
        { label: "You're more expensive", to: "objection_price" },
        { label: "The signal's fine", to: "objection_signal" },
        { label: "Just send me something over", to: "objection_send" },
        { label: "Back to the close", to: "close", primary: true }
      ]
    },

    objection_midcontract: {
      kind: "script",
      stage: 2,
      title: "We're mid-contract",
      say: [
        {
          label: "Answer",
          text: "Perfect timing, that's when you have leverage. Let's map your end dates now: are they all aligned? If not, we plan a co-terminus move ready for renewal day."
        }
      ],
      optionsLabel: "Then",
      options: [
        { label: "Keep qualifying", to: "core_pain", primary: true },
        { label: "Go to the close", to: "close" },
        { label: "Diarise and exit", to: "end_diarised" }
      ]
    },

    objection_price: {
      kind: "script",
      stage: 2,
      title: "You're more expensive",
      say: [
        {
          label: "Answer",
          text: "Per line, maybe. Per business, rarely. Add up the dropped calls, out-of-tariff charges and SIMs nobody uses. The cheapest bill is rarely the cheapest estate."
        },
        {
          label: "Pivot",
          text: "A cheaper bill means nothing if your team misses a critical closing call because their data stalled."
        }
      ],
      tip: "Never counter with a discount. O2, Three and the MVNOs all want a price fight because it's the only fight they can win.",
      optionsLabel: "Then",
      options: [
        { label: "Offer the estate audit", to: "close", primary: true },
        { label: "Another objection", to: "objections" }
      ]
    },

    objection_signal: {
      kind: "script",
      stage: 2,
      title: "The signal's fine",
      say: [
        {
          label: "Answer",
          text: "Everywhere? In the vans, on site, in town at 5pm? Full bars with no data is the complaint we hear most from O2 and MVNO users."
        }
      ],
      optionsLabel: "Then",
      options: [
        { label: "They admit a problem spot", to: "pain_coverage", primary: true },
        { label: "Still fine, move on", to: "ask_alignment" },
        { label: "Another objection", to: "objections" }
      ]
    },

    objection_send: {
      kind: "script",
      stage: 2,
      title: "Just send me something over",
      say: [
        {
          label: "Answer",
          text: "Happy to. Two quick questions so it's actually relevant: what network are you with, and how many connections do you have?"
        }
      ],
      optionsLabel: "Then",
      options: [
        { label: "They answer, keep going", to: "core_pain", primary: true },
        { label: "Send and diarise", to: "end_email" }
      ]
    },

    /* ---------------- CLOSE ---------------- */

    close: {
      kind: "script",
      stage: 3,
      title: "Close: the estate review",
      say: [
        {
          label: "The ask",
          text: "Based on what you've told me, the piece worth doing is a review of your estate: your end dates, your out-of-tariff spend and any SIMs nobody's using. It takes ten minutes, there's no obligation, and the unused connections alone usually pay for the call. Can we put twenty minutes in the diary this week or next?"
        },
        {
          label: "The one-line compass",
          text: "We don't sell the cheapest mobile bill. We sell the network your business runs on, the portal that controls it, and hardware that keeps pace with your growth."
        }
      ],
      tip: "Recap their own words first: their provider, the pain they named, their end dates. Then ask for a day, not a yes.",
      optionsLabel: "How it lands",
      options: [
        { label: "Review booked", to: "end_booked", primary: true },
        { label: "Not now, but renewal is dated", to: "end_diarised" },
        { label: "Send something over", to: "end_email" },
        { label: "They object", to: "objections" }
      ]
    },

    /* ---------------- ENDINGS ---------------- */

    end_booked: {
      kind: "end",
      stage: 3,
      tone: "success",
      title: "Estate review booked",
      text: "Lock it in while they're on the line.",
      checklist: [
        "Confirm the day and time back to them",
        "Confirm the best email and send the invite now",
        "Log the provider, connection count and every end date",
        "Note the pain they named and the PIC it opened",
        "Ask them to have a recent bill to hand for the review"
      ]
    },

    end_diarised: {
      kind: "end",
      stage: 3,
      tone: "neutral",
      title: "Renewal diarised",
      text: "No pain today does not mean no deal. The date is the asset.",
      checklist: [
        "Record every end date, not just the earliest",
        "Set the callback for 90 days before renewal",
        "Log which battle card applies for next time",
        "Note whether the estate is co-terminus or misaligned"
      ]
    },

    end_email: {
      kind: "end",
      stage: 3,
      tone: "neutral",
      title: "Follow-up sent",
      text: "Two quick questions so it's actually relevant: what network are you with, and how many connections do you have?",
      checklist: [
        "Get the network and connection count before you send",
        "Send it the same day",
        "Diarise the renewal date and a callback"
      ]
    }
  },

  /* ---------------- BATTLE CARDS ---------------- */

  cards: {

    vodafone: {
      number: "01",
      name: "Vodafone",
      know: "Vodafone sells to big business on multi-national pricing and expansive international roaming. That's their home turf and they're genuinely strong there. But day-to-day UK admin is slow and account-manager-dependent. Shift every conversation to UK operational speed, self-serve control and asset flexibility.",
      winOn: "speed · control · flexibility",
      loseOn: "international roaming scale",
      dont: [
        {
          title: "Global roaming country counts",
          text: "Vodafone's international footprint is huge. If you argue country for country or tariff for tariff, you lose.",
          pivot: "Unless your team spends most of the year abroad, you're paying a premium for destinations you never use, while sacrificing performance on the UK's best network where 90% of your business actually happens."
        },
        {
          title: "Bespoke multi-national corporate pricing",
          text: "Their enterprise pricing desks are built for global tenders. Don't get pulled into a complexity contest. If travel genuinely matters, offer the EE Roam Abroad Pass and move straight back to UK performance."
        }
      ],
      do: [
        { title: "Portal power, live 24/7 control", text: "Instant eSIM rollouts, SIM swaps and full lifecycle management through Mobile Manager. No carrier delays, no waiting on an account manager." },
        { title: "Hardware Funds vs rigid upgrades", text: "One centralised pot the client draws on when the fleet needs it, 50 iPads this month and 100 iPhones next, versus Vodafone's fixed user-by-user refresh dates." },
        { title: "White-glove onboarding", text: "A named set-up agent, structured connection database, SIMs via DPD and staggered porting for large fleets. New starters connected fast, not stuck in a queue." },
        { title: "Anytime Upgrades and premium extras (SME)", text: "Mid-contract refreshes keep small teams nimble, with TNT Sports, Apple TV and Apple Music built in." }
      ],
      killer: [
        "Do you have to contact customer services or wait on an account manager just to swap a SIM or activate an eSIM for a staff member?",
        "When you onboard a new starter, how long does it take to actually get them connected and up and running?",
        "If you have leftover tech budget at quarter-end, can you pool it into a flexible hardware fund, or are you locked to fixed upgrade dates per user?"
      ]
    },

    o2: {
      number: "02",
      name: "O2 Business (Virgin Media O2)",
      know: "O2 wins deals by undercutting on raw line rental, the cheap-bill pitch. But their network lags EE significantly on speed and capacity, and their enterprise backend is clunky. Hit them on network reliability, lost productivity and fleet control. Never on price.",
      winOn: "coverage · support · portal",
      loseOn: "price · SIM-only",
      dont: [
        {
          title: "Rock-bottom line rental",
          text: "O2 will always find a cheaper monthly number. If the conversation becomes a per-line price race, you've already lost it.",
          pivot: "A cheaper monthly bill means nothing if your team misses a critical closing call because their data stalled in a high-congestion zone."
        },
        {
          title: "Cost-cutting framing",
          text: "Don't let EE be positioned as the expensive one. Frame EE as a high-return business investment: quantify what dropped calls, stalled downloads and admin delays cost per week, then compare that to the line-rental difference."
        }
      ],
      do: [
        { title: "Network reliability and real 5G", text: "UK's Best Network, 25 times and counting, for speed and capacity out of the office: transport links, city centres, client sites. This is O2's weakest ground." },
        { title: "Dedicated Corporate Care", text: "A named team on phone, 24-hour email and even WhatsApp, plus a local BT Local Business account manager. Human support, not a call-centre queue." },
        { title: "Fleet productivity via the portal", text: "Mobile Manager removes the admin headaches of O2's clunky enterprise backend, with instant control over SIMs, eSIMs, bars and caps." },
        { title: "Financial reinvestment (SME)", text: "Anytime Upgrades plus built-in premium apps put tangible value back into the bottom line, value O2's cheap bill can't match." }
      ],
      killer: [
        "Have you noticed coverage or connectivity issues when the team is out of the office, especially on 5G, on transport links or in city centres?",
        "How often does the team complain their O2 signal shows full bars but the data completely grinds to a halt between meetings?",
        "If your team can't reliably download client files or join a video call on the move, how much is that dropped signal costing you every week?"
      ]
    },

    three: {
      number: "03",
      name: "Three (VodafoneThree network)",
      know: "Post-merger, Three pitches a massive combined future footprint and aggressive unlimited-data pricing. The reality: they're midway through a complex, multi-year network and backend integration. Sell EE's rock-solid stability today against their under-construction promises.",
      winOn: "stability · control · real business value",
      loseOn: "cheap unlimited data",
      dont: [
        {
          title: "Unlimited-data price wars",
          text: "Three has historically slashed prices to hit volume targets and will drop lower than you can match. Never price-match a data dump.",
          pivot: "Apart from cheap data, what actual business value is Three putting into your team's hands every day?"
        },
        {
          title: "The combined-network vision",
          text: "Don't debate the size of the future VodafoneThree footprint, the promise sounds big. Move the conversation to what their business risks during the multi-year integration: mast disruptions, blindspots and backend teething issues."
        }
      ],
      do: [
        { title: "Risk-free continuity", text: "EE is fully optimised and stable today, UK's Best Network 25 times and counting. No merger teething issues, no blindspots, and a named set-up agent plus dedicated Corporate Care at every stage of the move." },
        { title: "Deep corporate control", text: "Mobile Manager gives reliable, granular admin control that Three's legacy business systems have historically lacked." },
        { title: "Business value vs data dumps (SME)", text: "Anytime Upgrades, TNT Sports and Apple perks drive daily productivity, versus Three's basic no-frills data-only offer." }
      ],
      killer: [
        "With Vodafone and Three merging their networks, how confident are you that you won't suffer dropped signals and mast disruption during a multi-year integration?",
        "Are you comfortable being a guinea pig while they stitch two completely different technical backends together?",
        "Apart from basic cheap data, what premium services, Anytime Upgrades, TNT Sports, Apple tools, is Three actually giving your team?"
      ]
    },

    mvno: {
      number: "04",
      name: "Business MVNOs (e.g. Lebara Business)",
      know: "MVNOs win on one thing only: ultra-cheap SIM-only pricing. They own zero network infrastructure, run consumer-grade support and offer no corporate tooling. Sell direct network priority, security and the ability to actually scale a fleet.",
      winOn: "priority · security · scale",
      loseOn: "price · SIM-only",
      dont: [
        {
          title: "Price per gigabyte",
          text: "An MVNO's whole business model is being the cheapest SIM in the drawer. Comparing per-GB cost hands them the win.",
          pivot: "Keep the conversation on enterprise infrastructure, security with Scam Guard, and portal-level fleet management. Things they structurally cannot offer."
        },
        {
          title: "\"It's the same network anyway\"",
          text: "Don't concede that riding a host network equals direct access. It doesn't: MVNO traffic is deprioritised in congestion. That's your opening, not theirs."
        }
      ],
      do: [
        { title: "Network data priority", text: "Direct EE business lines get top-tier priority in congested areas, commuter hubs and city centres at 5pm, while MVNO traffic is pushed to the back of the queue." },
        { title: "Scale and fleet flexibility", text: "Hardware Funds for corporates, Anytime Upgrades and premium business perks for SMEs. Budget providers make staff pay full retail for handsets out of pocket." },
        { title: "Business-grade management, support and security", text: "Mobile Manager for the whole fleet including online hardware ordering against a fund, Scam Guard protection, and dedicated Corporate Care by phone, 24-hour email and WhatsApp, versus consumer-style billing and helplines." }
      ],
      killer: [
        "When commuter hubs get busy at 5pm, has your team noticed data speeds dropping off? Host networks push MVNO traffic behind direct corporate users.",
        "As you scale, how much time is being wasted managing connections across consumer-style billing with no business management portal?",
        "When staff need a phone upgrade, are you paying full retail out of pocket because your provider has no Anytime Upgrades or Hardware Fund?"
      ]
    },

    unknown: {
      number: "00",
      name: "No competitor named yet",
      know: "You don't have a card until you have a network. Go back and get it, or run the universal fact-find and let the answers point you to a card.",
      winOn: "network · local · control",
      loseOn: "nothing yet, you haven't picked a fight",
      dont: [
        {
          title: "Guessing at their setup",
          text: "Don't pitch features blind. Without the provider you can't know which ground is safe and which is theirs.",
          pivot: "Two quick questions so this is actually relevant: what network are you with, and how many connections do you have?"
        }
      ],
      do: [
        { title: "The power of the network", text: "UK's Best Network, 25 times and counting. Trusted by the Home Office to carry the Emergency Services Network to 2032 for 300,000+ responders. Direct EE business lines get enhanced network priority in congestion." },
        { title: "The power of local", text: "BT Local Business London West: a local account manager who knows the client's business, backed by a national carrier. White-glove onboarding, then dedicated Corporate Care by phone, 24-hour email and WhatsApp." },
        { title: "Control", text: "Mobile Manager for 24/7 self-serve control of the whole estate, plus Hardware Funds for corporates and Anytime Upgrades for SMEs." }
      ],
      killer: [
        "What network are you currently with?",
        "How many mobiles do you have, and how many staff could need one?",
        "Any other SIM-powered devices: tablets, smartwatches, trackers, routers, card machines, CCTV?"
      ]
    }
  },

  /* ---------------- OVERRIDE PANELS ---------------- */

  panels: {

    whyee: {
      title: "Why EE, why BT Local Business",
      sections: [
        {
          heading: "Pillar one: the power of the network",
          items: [
            "UK's Best Network, 25 times and counting (RootMetrics UK RootScore results).",
            "Trusted by the Home Office with a £1.29bn contract to carry the Emergency Services Network to 2032, for 300,000+ police, fire and ambulance responders.",
            "Direct EE business lines get enhanced network priority in congestion, where MVNO and consumer traffic queues behind them."
          ]
        },
        {
          heading: "Pillar two: the power of local",
          items: [
            "BT Local Business London West: a local account manager who knows the client's business, backed by a national carrier.",
            "White-glove onboarding with a named set-up agent.",
            "Dedicated Corporate Care by phone, 24-hour email and WhatsApp. Human support, not a call-centre queue."
          ]
        },
        {
          heading: "Corporate tariffs: fleets, estates, multi-site",
          items: [
            "Co-terminus contracts, always. Every line aligned to one end date, so they renew with the buying power of the whole account.",
            "Mobile Manager portal: instant eSIMs, SIM swaps, data bars and caps, users and permissions, online hardware ordering.",
            "Flexible Hardware Funds: one centralised pot drawn down when needed. Balance in-portal under Reports, Billed, Charges, Technology Funds.",
            "Enhanced network priority: corporate platform SIMs get top-tier data priority in congestion.",
            "White-glove onboarding: validations team, structured connection database, SIMs via DPD, staggered porting for large fleets.",
            "Dedicated Corporate Care plus Scam Guard protection on the lines."
          ]
        },
        {
          heading: "SME tariffs: growing teams that can't stand still",
          items: [
            "Anytime Upgrades: refresh handsets mid-contract, no being trapped with obsolete or damaged tech for 24 to 36 months.",
            "Premium Business Extras: TNT Sports, Apple TV and Apple Music bundled in, wiping those subscription costs off the balance sheet.",
            "The same number one network, at full speed on the road, on site and between meetings.",
            "Portal access for self-serve control of lines, usage and spend.",
            "Local support: the same BT Local Business team and Corporate Care access as the biggest accounts."
          ]
        },
        {
          heading: "The one-line compass",
          items: [
            "We don't sell the cheapest mobile bill. We sell the network your business runs on, the portal that controls it, and hardware that keeps pace with your growth."
          ]
        }
      ]
    },

    esn: {
      title: "The Emergency Services Network",
      sections: [
        {
          heading: "Say it on every call",
          items: [
            "The Home Office signed a £1.29 billion contract for EE to keep 300,000 police, fire and ambulance responders connected until 2032. If the network is trusted when lives depend on it, it will keep your team connected anywhere in the UK."
          ]
        },
        {
          heading: "The numbers",
          items: [
            "£1.29bn Home Office contract signed December 2024. EE carries the ESN to 2032 and beyond (7.25 years, plus a 1 year option).",
            "300,000+ frontline police, fire and ambulance responders supported.",
            "19,500+ EE 4G sites upgraded for ESN, plus expanded coverage in rural and critical operational areas.",
            "Since 1937 BT has handled every incoming 999 call. Nearly 90 years of trust when lives depend on the line."
          ]
        },
        {
          heading: "What the contract covers",
          items: [
            "A dedicated mission-critical core network for the emergency services, with priority and pre-emption engineered in over other users.",
            "Coverage where no one else goes: the London Underground, specific road and rail tunnels, air-to-ground for helicopters, and remote Extended Area Services sites.",
            "The country's largest ever indoor coverage roll-out, to meet public-safety operational standards.",
            "Deep public-sector trust: BT connects 43 police forces, 29 fire services and 200+ NHS trusts."
          ]
        },
        {
          heading: "What it proves to your clients",
          items: [
            "The Home Office doesn't gamble with 999 response. After a competitive market they chose EE, twice, for the network lives depend on.",
            "Reliability is engineered, not marketed. A network built to mission-critical standards is the same 4G RAN your client's business runs on.",
            "Remote coverage is a contractual obligation, not a promise: rural sites, tunnels, the Underground.",
            "Independent proof on top: UK's Best Network, 25 times and counting."
          ]
        },
        {
          heading: "Proof to share",
          items: [
            "rootmetrics.com for UK RootScore results.",
            "newsroom.bt.com for the full ESN announcement."
          ]
        }
      ]
    },

    pic: {
      title: "The Mobile PIC Library",
      note: "Surface the symptom with the fact-find, then build the full PIC (Problem, Root Cause, Business Impact) before you pitch a feature. Anchor on what it costs the business.",
      sections: [
        {
          heading: "Problem, root cause, business impact",
          rows: [
            { topic: "Coverage & 5G", problem: "Staff experience poor signal, dropped calls or slow data whilst working.", cause: "The current network doesn't provide reliable coverage where employees work.", impact: "Lost customer calls, lower productivity, delayed access to cloud applications and lost revenue." },
            { topic: "Roaming Costs", problem: "International usage creates unexpected mobile bills.", cause: "Roaming isn't optimised or managed correctly.", impact: "Increased operating costs, reduced profitability and reluctance for staff to use devices abroad." },
            { topic: "Portal Control", problem: "The business has limited visibility and control of its mobile estate.", cause: "No effective self-service portal or central management.", impact: "Time wasted on administration, slower changes and poor cost control." },
            { topic: "Co-terminus Contracts", problem: "Mobile contracts end at different times across the business.", cause: "Services added over several years without aligning renewal dates.", impact: "Reduced buying power, inability to review the whole estate together and higher long-term costs." },
            { topic: "SIM Replacement", problem: "Employees are without service when a SIM is lost or damaged.", cause: "Slow replacement process from the current provider.", impact: "Downtime, lost customer contact and reduced productivity." },
            { topic: "Out-of-Tariff Charges", problem: "Monthly bills regularly exceed expectations.", cause: "No usage alerts or proactive tariff management.", impact: "Unnecessary spend, budget overruns and poor financial control." },
            { topic: "Call Recording & Compliance", problem: "Customer calls are not recorded or stored compliantly.", cause: "No compliant mobile call recording solution.", impact: "GDPR and regulatory risk, potential fines, inability to evidence conversations and loss of customer trust." },
            { topic: "Security", problem: "Company data is at risk if a mobile device is lost or stolen.", cause: "Devices aren't centrally managed or protected.", impact: "Increased cyber risk, potential data breaches and reputational damage." },
            { topic: "Multiple Suppliers", problem: "Mobile services are spread across different providers.", cause: "Historic acquisitions or unmanaged procurement decisions.", impact: "Multiple invoices, inconsistent support, increased administration and reduced negotiating power." },
            { topic: "Device Lifecycle", problem: "Employees are using unreliable or outdated handsets.", cause: "Devices aren't refreshed consistently.", impact: "Reduced productivity, more IT support requests and a poorer customer experience." },
            { topic: "Fleet Management", problem: "The business struggles to know what devices, users and tariffs it has.", cause: "No central asset management or reporting.", impact: "Paying for unused connections, duplicated costs and poor financial visibility." },
            { topic: "Business Continuity", problem: "Staff cannot communicate effectively during outages or unexpected events.", cause: "No resilient mobile strategy or backup communication plan.", impact: "Missed customer opportunities, disruption to operations and loss of revenue." },
            { topic: "Unused Connections ★", problem: "The business is paying for SIMs that are no longer being used.", cause: "No regular mobile estate audits or lifecycle management.", impact: "Wasted monthly spend and unnecessary operating costs." },
            { topic: "MDM / Device Management ★", problem: "IT cannot remotely manage company mobiles.", cause: "No Mobile Device Management solution in place.", impact: "Higher security risk, slower onboarding and offboarding, inconsistent device configuration and increased IT workload." }
          ]
        },
        {
          heading: "The two nobody asks about",
          items: [
            "★ Unused Connections and MDM are near-universal, easy to evidence, and open commercial conversations no other rep is having."
          ]
        }
      ]
    },

    factfind: {
      title: "The Universal Fact-Find",
      note: "You don't need to know mobile, you need to know these questions. Work the four blocks in order: the answers size the deal, find the way in, and tell you which battle card to play.",
      sections: [
        {
          heading: "Block 1: the estate, size the opportunity",
          items: [
            "What network are you currently with? (picks your battle card)",
            "How many mobiles do you have, and how many staff could need one? (deal size and growth headroom)",
            "Do you use tablets for the business: field teams, vans, meeting rooms? (data SIMs they may not count)",
            "Any other SIM-powered devices: smartwatches, trackers, routers, card machines, CCTV? (hidden connections mean a bigger deal)"
          ]
        },
        {
          heading: "Block 2: the contract, find the way in",
          items: [
            "When is your contract up? (timing, diarise and re-contact early)",
            "Are all your lines on one end date, or spread across different agreements? (sets up the co-terminus power question)",
            "Have you had a mid-contract price rise recently? (dissatisfaction lever)",
            "Who looks after the mobile decision in the business? (route to the decision maker)"
          ]
        },
        {
          heading: "Block 3: the day-to-day, find the friction",
          items: [
            "How do you manage the account day to day, online portal or do you have to ring someone? (opens the Mobile Manager story)",
            "When a new starter joins, how long until they're actually connected? (onboarding and instant eSIM pitch)",
            "What happens when a handset breaks or gets lost mid-contract? (Anytime Upgrades or Hardware Fund)",
            "Who checks the bill, any surprises, roaming shocks or lines nobody uses? (portal control: bars, caps, reports)"
          ]
        },
        {
          heading: "Block 4: the experience, find the pain",
          items: [
            "Any coverage problems, certain sites, on the road, in town at busy times? (network and priority story)",
            "Does the team ever say they've got full bars but the data grinds to a halt? (congestion, EE priority wins)",
            "If mobile went down for a day, what would it actually cost you? (impact, the client sells themselves)"
          ]
        },
        {
          heading: "Then pick your card",
          items: [
            "Vodafone → Card 01. O2 → Card 02. Three → Card 03. Budget SIM-only → Card 04.",
            "Take the friction and pain from Blocks 3 and 4 straight into that card's Do discuss points and killer questions."
          ]
        }
      ]
    },

    rules: {
      title: "Rules of engagement",
      sections: [
        {
          heading: "Always do",
          items: [
            "Lead with the Mobile Manager portal. Frame it as a cost-saving operational tool that removes carrier friction, not a nice-to-have feature.",
            "Position Anytime Upgrades as asset protection. For SMEs, their tech matches their growth rate instead of decaying over a 36-month lock-in.",
            "Quantify the perks in pounds. TNT Sports, Apple TV and Apple Music built in means real subscription costs wiped off the balance sheet. Say the number.",
            "Sell the Hardware Fund as total control. For corporates, one centralised pot drawn down exactly when the fleet requires it, visible and orderable in Mobile Manager.",
            "Challenge their coverage and 5G on every call. Always ask: any problem spots, vans, sites, in town at busy times?",
            "Ask the alignment question on every call. Misaligned estates renew site by site with zero leverage."
          ]
        },
        {
          heading: "Never do",
          items: [
            "Mention consumer rewards. No high-street discounts, retail rewards or lifestyle perks. Keep it strictly on business productivity and continuity.",
            "Race to the bottom on price. Pivot immediately to reliability and total cost of the estate, never counter with a discount.",
            "Fight Vodafone on roaming country counts. Reframe to where 90% of their business actually happens: the UK, on the UK's best network.",
            "Settle for SIM-only. Always open the hardware conversation, that's the route to Anytime Upgrades and the Hardware Fund.",
            "Promise co-terminus to an SME. Co-terminus is a corporate offer. For SME prospects the equivalent hook is Anytime Upgrades."
          ]
        },
        {
          heading: "The price pivot, word for word",
          items: [
            "A cheaper bill means nothing if your team misses a critical closing call because their data stalled."
          ]
        }
      ]
    },

    objections: {
      title: "Quick-fire objection handling",
      note: "Never argue. The goal is to earn one more question.",
      sections: [
        {
          heading: "Model answers",
          pairs: [
            { q: "We're mid-contract.", a: "Perfect timing, that's when you have leverage. Let's map your end dates now: are they all aligned? If not, we plan a co-terminus move ready for renewal day." },
            { q: "We're happy with our current provider.", a: "Happy, or just used to them? When did you last test that against the market? A ten-minute review costs nothing, and unused SIMs alone usually pay for the call." },
            { q: "You're more expensive.", a: "Per line, maybe. Per business, rarely. Add up the dropped calls, out-of-tariff charges and SIMs nobody uses. The cheapest bill is rarely the cheapest estate." },
            { q: "Just send me something over.", a: "Happy to. Two quick questions so it's actually relevant: what network are you with, and how many connections do you have?" },
            { q: "We only need SIM-only.", a: "Understood. How do you buy handsets today, and what happens when one breaks mid-contract? That's usually where the real cost of ownership hides." },
            { q: "The signal's fine.", a: "Everywhere? In the vans, on site, in town at 5pm? Full bars with no data is the complaint we hear most from O2 and MVNO users." },
            { q: "We've always been with them.", a: "Loyalty rarely gets rewarded in mobile, the best deals go to new customers. When did they last proactively improve your account?" },
            { q: "I don't have time.", a: "Sixty seconds: are all your mobile contracts aligned to one end date? That single answer is usually worth thousands at renewal." },
            { q: "Our IT company handles mobiles.", a: "Great, and who checks the commercial side: the unused SIMs, out-of-tariff spend and end dates? That's the piece we'd review, alongside them." },
            { q: "Moving is too much hassle.", a: "It used to be. Now: a named set-up agent, SIMs by DPD, and porting typically completes in one working day, staggered for big fleets. We do the heavy lifting." }
          ]
        }
      ]
    },

    cards: {
      title: "Battle cards at a glance",
      note: "Red side: avoid. Green side: attack.",
      sections: [
        {
          heading: "01 Vodafone",
          items: [
            "Win on: speed, control, flexibility. Lose on: international roaming scale.",
            "Avoid: global roaming country counts, bespoke multi-national pricing.",
            "Attack: portal power, Hardware Funds vs rigid upgrades, white-glove onboarding, Anytime Upgrades for SME."
          ]
        },
        {
          heading: "02 O2 Business",
          items: [
            "Win on: coverage, support, portal. Lose on: price, SIM-only.",
            "Avoid: rock-bottom line rental, cost-cutting framing.",
            "Attack: network reliability and real 5G, dedicated Corporate Care, fleet productivity via the portal, financial reinvestment for SME."
          ]
        },
        {
          heading: "03 Three",
          items: [
            "Win on: stability, control, real business value. Lose on: cheap unlimited data.",
            "Avoid: unlimited-data price wars, the combined-network vision.",
            "Attack: risk-free continuity, deep corporate control, business value vs data dumps."
          ]
        },
        {
          heading: "04 Business MVNOs",
          items: [
            "Win on: priority, security, scale. Lose on: price, SIM-only.",
            "Avoid: price per gigabyte, conceding it's the same network anyway.",
            "Attack: network data priority, scale and fleet flexibility, business-grade management, support and security."
          ]
        },
        {
          heading: "The three rules",
          items: [
            "Identify their current provider early, it decides which card you play.",
            "Stay off the red side. If they raise a competitor strength, use the pivot line, never argue their numbers.",
            "Ask a killer question. Each card's questions surface pain the competitor can't fix, and let the client sell themselves."
          ]
        }
      ]
    }
  }
};
