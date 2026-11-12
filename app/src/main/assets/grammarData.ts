// Comprehensive Grammar Data for Class 7 Guide (English & Bangla)

export interface GrammarItem {
  title: string;
  subtitle?: string;
  explanation: string;
  structure?: string;
  examples: string[];
  tips?: string;
}

export interface GrammarCategory {
  id: string;
  title: string;
  bengaliTitle: string;
  badge: string;
  items: GrammarItem[];
}

export const COMPREHENSIVE_GRAMMAR: GrammarCategory[] = [
  {
    id: "parts_of_speech",
    title: "Parts of Speech",
    bengaliTitle: "পদ প্রকরণ (৮ প্রকার)",
    badge: "মূল ভিত্তি",
    items: [
      {
        title: "1. Noun (বিশেষ্য)",
        subtitle: "Naming Word",
        explanation: "যে Word দ্বারা কোনো ব্যক্তি, বস্তু, স্থান, গুণ বা অবস্থার নাম বোঝায়, তাকে Noun বলে।",
        structure: "প্রকারভেদ: ৫ প্রকার (Proper, Common, Collective, Material, Abstract)",
        examples: [
          "Proper Noun: Shakib Al Hasan, Dhaka, The Padma (নির্দিষ্ট নাম)",
          "Common Noun: boy, girl, river, city, student (একজাতীয় সাধারণ নাম)",
          "Collective Noun: class, army, team, family, crowd (সমষ্টিগত নাম)",
          "Material Noun: water, gold, iron, milk, rice (পদার্থের নাম যা গণনা করা যায় না)",
          "Abstract Noun: honesty, beauty, kindness, freedom (গুণ বা অনুভূতির নাম)"
        ],
        tips: "চেনার উপায়: বাক্যে Subject বা Object হিসেবে বসে।"
      },
      {
        title: "2. Pronoun (সর্বনাম)",
        subtitle: "Used in place of a Noun",
        explanation: "Noun-এর বারবার ব্যবহার রোধ করতে তার পরিবর্তে যে Word ব্যবহৃত হয় তাকে Pronoun বলে।",
        structure: "প্রধান প্রকারভেদ: Personal, Demonstrative, Relative, Interrogative, Reflexive",
        examples: [
          "Personal: I, we, you, he, she, they, it",
          "Demonstrative: this, that, these, those",
          "Relative: who, which, that, whose, whom",
          "Interrogative: Who, What, Which, Whom",
          "Reflexive: myself, himself, herself, themselves"
        ],
        tips: "উদাহরণ: 'Rahim is a student. He goes to school every day.' এখানে He হলো Pronoun।"
      },
      {
        title: "3. Adjective (বিশেষণ)",
        subtitle: "Describing Word",
        explanation: "যে Word কোনো Noun বা Pronoun-এর দোষ, গুণ, অবস্থা, সংখ্যা বা পরিমাণ প্রকাশ করে তাকে Adjective বলে।",
        structure: "Degree of Comparison: Positive -> Comparative -> Superlative",
        examples: [
          "গুণ/অবস্থা: honest, good, rich, poor, beautiful, clever",
          "সংখ্যা/পরিমাণ: five, many, much, little, all, some",
          "Degree: Good -> Better -> Best | Tall -> Taller -> Tallest"
        ],
        tips: "বাক্যে কেমন? কতটুকু? কয়টি? প্রশ্ন করলে Adjective পাওয়া যায়।"
      },
      {
        title: "4. Verb (ক্রিয়া)",
        subtitle: "Action / Being Word",
        explanation: "যে Word দ্বারা কোনো কিছু করা, হওয়া, যাওয়া, খাওয়া বা অবস্থান করা বোঝায় তাকে Verb বলে। বাক্য Verb ছাড়া গঠিত হতে পারে না।",
        structure: "Principal Verb (Main) + Auxiliary Verb (Helping)",
        examples: [
          "Action Verbs: read, write, play, run, study, eat",
          "Auxiliary Verbs (Primary): am, is, are, was, were, have, has, had, do, does, did",
          "Modal Auxiliaries: can, could, may, might, shall, should, will, would, must",
          "বাক্য: She writes a poem. / We are learning English."
        ],
        tips: "Finite Verb সমাপিকা ক্রিয়া এবং Non-finite Verb অসমাপিকা ক্রিয়া (to + v1 / v+ing)।"
      },
      {
        title: "5. Adverb (ক্রিয়া বিশেষণ)",
        subtitle: "Modifies Verb, Adjective or another Adverb",
        explanation: "যে Word কোনো Verb, Adjective বা অন্য কোনো Adverb-কে বিশেষভাবে বিশেষিত করে তাকে Adverb বলে।",
        structure: "প্রকারভেদ: Adverb of Time, Place, Manner, Frequency",
        examples: [
          "Manner (কীভাবে?): slowly, quickly, happily, bravely, carefully",
          "Time (কখন?): now, yesterday, soon, today, early",
          "Place (কোথায়?): here, there, outside, everywhere",
          "Frequency (কতবার?): always, never, often, seldom, daily"
        ],
        tips: "বেশিরভাগ Adjective-এর শেষে 'ly' যুক্ত হয়ে Adverb গঠিত হয় (যেমন: quick -> quickly)।"
      },
      {
        title: "6. Preposition (পদান্বয়ী অব্যয়)",
        subtitle: "Placed before Noun/Pronoun to show relationship",
        explanation: "যে Word কোনো Noun বা Pronoun-এর পূর্বে বসে বাক্যের অন্য Word-এর সাথে সম্পর্ক স্থাপন করে তাকে Preposition বলে।",
        structure: "গুরুত্বপূর্ণ প্রিপজিশনসমূহ: in, on, at, by, for, from, of, to, with, under, into, between, among",
        examples: [
          "in (বড় স্থান বা সময়ের ক্ষেত্রে): in Dhaka, in 2026, in the morning",
          "at (ছোট স্থান বা নির্দিষ্ট সময়): at 7 AM, at Mirpur, at school",
          "on (কোনো কিছুর উপরে স্পর্শ অবস্থায়): The book is on the table.",
          "between (দুজনের মধ্যে) vs among (অনেকের মধ্যে): Divide the mango between two brothers."
        ],
        tips: "সপ্তম শ্রেণির জন্য Appropriate Preposition: fond of, good at, abide by, proud of, look after, aim at।"
      },
      {
        title: "7. Conjunction (সংযোজক অব্যয়)",
        subtitle: "Joining Word",
        explanation: "যে Word দুই বা ততোধিক Word, Phrase বা Clause-কে যুক্ত করে তাকে Conjunction বলে।",
        structure: "Coordinating (and, but, or) | Subordinating (because, if, though, since)",
        examples: [
          "and (একজাতীয় ধারণা): Rahim and Karim are good friends.",
          "but (বিপরীত ভাব): He is poor but honest.",
          "or (বিকল্প): Do or die. / Read attentively or you will fail.",
          "because (কারণ): I could not go to school because I was ill."
        ],
        tips: "সংযোজক সেতু হিসেবে কাজ করে।"
      },
      {
        title: "8. Interjection (আবেগসূচক অব্যয়)",
        subtitle: "Expresses sudden feelings or emotions",
        explanation: "যে Word মনের আকস্মিক আনন্দ, দুঃখ, বিস্ময় বা ভয় প্রকাশ করে তাকে Interjection বলে।",
        structure: "Interjection-এর পর সাধারণত Note of Exclamation (!) বসে।",
        examples: [
          "Hurrah! (আনন্দ): Hurrah! We have won the cricket match.",
          "Alas! (দুঃখ): Alas! His grandfather passed away.",
          "Bravo! (প্রশংসা): Bravo! You played exceptionally well.",
          "Hush! (চুপ করার নির্দেশ): Hush! The baby is sleeping."
        ],
        tips: "সবসময় আবেগ বা অনুভূতি ব্যক্ত করতে ব্যবহার হয়।"
      }
    ]
  },
  {
    id: "tense",
    title: "Tense",
    bengaliTitle: "ক্রিয়ার কাল (১২ প্রকার গঠন ও নিয়ম)",
    badge: "ব্যাকরণের প্রাণ",
    items: [
      {
        title: "Present Indefinite Tense (সাধারণ বর্তমান)",
        subtitle: "দৈনন্দিন অভ্যাস, চিরন্তন সত্য ও সাধারণ ঘটনা",
        explanation: "কোনো কাজ বর্তমানে সাধারণভাবে হয় বা ঘটে, কিংবা কোনো অভ্যাস বা চিরন্তন সত্য বোঝালে Present Indefinite Tense হয়।",
        structure: "Subject + Verb(base form) + (s/es যদি Subject ৩য় পুরুষ একবচন হয়) + Object",
        examples: [
          "Affirmative: I read a book. / He plays cricket.",
          "Negative: I do not read a book. / He does not play cricket.",
          "Interrogative: Do you read a book? / Does he play cricket?",
          "Universal Truth: The sun rises in the east. / Water boils at 100°C."
        ],
        tips: "Subject যদি He, She, It বা যেকোনো একক নাম হয়, তবে verb-এর শেষে s/es যুক্ত হবে।"
      },
      {
        title: "Present Continuous Tense (ঘটমান বর্তমান)",
        subtitle: "বর্তমানে কাজটি চলতেছে বোঝালে",
        explanation: "বর্তমান সময়ে কোনো কাজ চলছে বা হচ্ছে বোঝালে Present Continuous Tense হয়।",
        structure: "Subject + am / is / are + Verb(ing) + Object",
        examples: [
          "I am reading a story book.",
          "She is drawing a nice picture.",
          "They are playing football in the field.",
          "We are preparing for our examination."
        ],
        tips: "I-এর সাথে am; He/She/It/একবচনের সাথে is; We/You/They/বহুবচনের সাথে are বসে।"
      },
      {
        title: "Present Perfect Tense (পুরাঘটিত বর্তমান)",
        subtitle: "কাজ শেষ হয়েছে কিন্তু ফল বিদ্যমান",
        explanation: "কোনো কাজ এইমাত্র শেষ হয়েছে কিন্তু তার ফলাফল এখনো বর্তমান রয়েছে এমন বোঝালে Present Perfect Tense হয়।",
        structure: "Subject + have / has + Verb(Past Participle - V3) + Object",
        examples: [
          "I have completed my homework.",
          "He has eaten rice.",
          "They have won the match.",
          "She has written a letter."
        ],
        tips: "He/She/It/একক নামের সাথে has; বাকি সবার সাথে have বসে।"
      },
      {
        title: "Present Perfect Continuous Tense",
        subtitle: "অতীতে শুরু হয়ে এখনো চলছে",
        explanation: "কোনো কাজ অতীতে শুরু হয়ে এখনো চলতেছে বোঝালে এবং সময়ের উল্লেখ থাকলে এই Tense হয়।",
        structure: "Subject + have been / has been + Verb(ing) + since / for + Time",
        examples: [
          "It has been raining since morning. (সকাল থেকে বৃষ্টি হচ্ছে - নির্দিষ্ট সময় তাই since)",
          "We have been living in Dhaka for five years. (৫ বছর ধরে - সময়ের পরিমাণ তাই for)",
          "He has been reading for two hours."
        ],
        tips: "নির্দিষ্ট শুরুর সময় বোঝালে 'since' এবং মোট সময় বা ব্যাপ্তি বোঝালে 'for' বসে।"
      },
      {
        title: "Past Indefinite Tense (সাধারণ অতীত)",
        subtitle: "অতীতের সাধারণ ঘটনা",
        explanation: "অতীতকালে কোনো কাজ সাধারণভাবে ঘটেছিল বোঝালে Past Indefinite Tense হয়।",
        structure: "Subject + Verb(Past form - V2) + Object",
        examples: [
          "Affirmative: We visited the national zoo yesterday.",
          "She wrote a letter to her mother.",
          "Negative: We did not visit the zoo. (did আসলে verb V1 হয়)",
          "Interrogative: Did you finish the task?"
        ],
        tips: "yesterday, ago, last night, last year থাকলে সর্বদা Past Indefinite হয়।"
      },
      {
        title: "Past Continuous Tense (ঘটমান অতীত)",
        subtitle: "অতীতে কোনো কাজ চলতেছিল",
        explanation: "অতীতকালে কোনো কাজ কিছুক্ষণ ধরে চলছিল বোঝালে Past Continuous Tense হয়।",
        structure: "Subject + was / were + Verb(ing) + Object",
        examples: [
          "I was reading when he came.",
          "They were playing in the rain.",
          "The teacher was explaining the lesson."
        ],
        tips: "একবচনের সাথে was এবং বহুবচনে were বসে।"
      },
      {
        title: "Past Perfect Tense (পুরাঘটিত অতীত)",
        subtitle: "অতীতে দুইটি কাজের মধ্যে অপেক্ষাকৃত পূর্ববর্তী কাজ",
        explanation: "অতীতকালে দুটি কাজ সম্পন্ন হয়ে থাকলে অপেক্ষাকৃত আগের কাজের জন্য Past Perfect এবং পরের কাজের জন্য Past Indefinite হয়।",
        structure: "১ম কাজ: Subject + had + V3 | ২য় কাজ: Past Indefinite (before / after)",
        examples: [
          "The patient had died before the doctor came.",
          "The train had left before we reached the station.",
          "We went out after the rain had stopped."
        ],
        tips: "before-এর আগে had + V3 বসে; after-এর পরে had + V3 বসে।"
      },
      {
        title: "Future Indefinite Tense (সাধারণ ভবিষ্যৎ)",
        subtitle: "ভবিষ্যতে কোনো কাজ ঘটবে বোঝালে",
        explanation: "ভবিষ্যৎ সময়ে কোনো কাজ সাধারণভাবে ঘটবে বা হবে বোঝালে Future Indefinite Tense হয়।",
        structure: "Subject + shall / will + Verb(base form - V1) + Object",
        examples: [
          "I will help you tomorrow.",
          "They will arrange a study tour next week.",
          "She will sing a patriotic song."
        ],
        tips: "tomorrow, next day, soon থাকলে Future Indefinite নির্দেশ করে।"
      }
    ]
  },
  {
    id: "voice_change",
    title: "Voice Change",
    bengaliTitle: "বাচ্য পরিবর্তন (Active to Passive Rules)",
    badge: "পরীক্ষার বিশেষ",
    items: [
      {
        title: "Active থেকে Passive করার মূল ৫টি নিয়ম",
        subtitle: "Golden 5 Steps",
        explanation: "যেকোনো সাধারণ বাক্যের Active থেকে Passive রূপান্তরের সার্বজনীন ৫টি ধাপ:",
        structure: "1. Active-এর Object -> Passive-এর Subject\n2. Tense অনুযায়ী Auxiliary Verb\n3. মূল Verb-এর সর্বদা Past Participle (V3)\n4. সাধারণত preposition 'by' (বা to/at/with)\n5. Active-এর Subject -> Passive-এর Object (Me, Us, Him, Her, Them)",
        examples: [
          "Active: He eats rice. -> Passive: Rice is eaten by him.",
          "Active: She is writing a letter. -> Passive: A letter is being written by her.",
          "Active: They played cricket. -> Passive: Cricket was played by them.",
          "Active: We have done the work. -> Passive: The work has been done by us."
        ],
        tips: "Continuous Tense হলে auxiliary verb-এর সাথে সর্বদা 'being' যুক্ত হয়।"
      },
      {
        title: "Imperative Sentence-এর Voice Change",
        subtitle: "আদেশ, নিষেধ ও অনুরোধমূলক বাক্য",
        explanation: "আদেশ বা নির্দেশমূলক বাক্যে 'Let' দিয়ে Passive শুরু করতে হয়।",
        structure: "Let + Object + be + Verb(V3)",
        examples: [
          "Active: Open the door. -> Passive: Let the door be opened.",
          "Active: Do not waste your time. -> Passive: Let not your time be wasted.",
          "Active: Help the poor. -> Passive: Let the poor be helped.",
          "Active: Please sit down. -> Passive: You are requested to sit down."
        ],
        tips: "না-বোধক হলে 'Let not' দিয়ে শুরু হয়।"
      }
    ]
  },
  {
    id: "right_forms_of_verbs",
    title: "Right Forms of Verbs",
    bengaliTitle: "ক্রিয়ার সঠিক রূপের সেরা নিয়মাবলী",
    badge: "নিয়ম ও কৌশল",
    items: [
      {
        title: "Rule 1: Subject 3rd Person Singular Number",
        subtitle: "He, She, It বা যেকোনো একবচন নাম",
        explanation: "Present Indefinite Tense-এ Subject যদি Third Person Singular Number হয়, তবে মূল Verb-এর শেষে s বা es যোগ করতে হয়।",
        structure: "Subject(3rd Singular) + Verb(s/es) + Object",
        examples: [
          "Incorrect: He go to school. -> Correct: He goes to school.",
          "Incorrect: The boy play well. -> Correct: The boy plays well.",
          "Incorrect: Ruma sing sweetly. -> Correct: Ruma sings sweetly."
        ]
      },
      {
        title: "Rule 2: Universal Truth & Habitual Fact",
        subtitle: "চিরন্তন সত্য ও ঐতিহাসিক সত্য",
        explanation: "বাক্য দ্বারা চিরন্তন সত্য বা অভ্যাসগত কাজ বোঝালে সর্বদাই Present Indefinite Tense ব্যবহৃত হয়।",
        structure: "Universal fact -> Simple Present",
        examples: [
          "The earth moves round the sun.",
          "Ice floats on water.",
          "Virtue brings its own reward."
        ]
      },
      {
        title: "Rule 3: Modal Auxiliaries-এর পর Base Form",
        subtitle: "can, could, may, might, shall, should, will, would, must",
        explanation: "Modal Auxiliary Verb-এর পর সবসময় মূল Verb-এর বেস ফর্ম (V1) বসে। কোনো s/es/ing যোগ হয় না।",
        structure: "Modal + V1",
        examples: [
          "He can solve the problem easily.",
          "You must obey your parents and teachers.",
          "We should respect our elders."
        ]
      },
      {
        title: "Rule 4: Preposition-এর পর Verb+ing (ব্যতিক্রম: To)",
        subtitle: "in, on, of, for, with, by, without, about",
        explanation: "Preposition-এর পর সরাসরি verb আসলে তার সাথে 'ing' যোগ হয়। তবে সাধারণ 'to' এর পর verb-এর base form বসে।",
        structure: "Preposition + Verb(ing) | To + Verb(base)",
        examples: [
          "He went there for learning English.",
          "She is good at drawing pictures.",
          "We went to the library to read books (Infinitive: to + read)."
        ],
        tips: "ব্যতিক্রম: look forward to, with a view to, get used to-এর পর verb+ing হয়।"
      }
    ]
  },
  {
    id: "articles",
    title: "Articles",
    bengaliTitle: "A, An, The ও ক্রস (x) ব্যবহারের নিয়ম",
    badge: "নির্ভুল প্রয়োগ",
    items: [
      {
        title: "A এবং An-এর সঠিক ব্যবহার",
        subtitle: "Indefinite Articles",
        explanation: "সাধারণত Consonant সাউন্ডের আগে 'A' এবং Vowel সাউন্ডের (a, e, i, o, u) আগে 'An' বসে। তবে বানানের চেয়ে উচ্চারণ প্রধান।",
        structure: "শব্দের শুরুর উচ্চারণ অনুযায়ী নির্ধারণ",
        examples: [
          "A boy, A book, A pen, A tiger",
          "An apple, An orange, An umbrella, An elephant",
          "উচ্চারণ 'ইউ' বা 'ওয়া' হলে A বসে: A university, A useful book, A one-taka note",
          "নীরব 'H' এর আগে An বসে: An honest man, An hour, An heir"
        ],
        tips: "শব্দটি শুরু হওয়া অক্ষরের সাউন্ড খেয়াল করুন, অক্ষর নয়।"
      },
      {
        title: "Definite Article 'The'-এর ব্যবহার",
        subtitle: "নির্দিষ্ট ব্যক্তি, বস্তু ও ভৌগোলিক নাম",
        explanation: "নির্দিষ্ট কোনো ব্যক্তি বা বস্তু এবং জগতে যেসকল জিনিস মাত্র একটি রয়েছে তাদের নামের পূর্বে 'The' বসে।",
        structure: "নদী, সাগর, পর্বতমালা, ধর্মগ্রন্থ, সংবাদপত্র, বিখ্যাত অট্টালিকা",
        examples: [
          "নদী ও সাগর: The Padma, The Jamuna, The Bay of Bengal",
          "ধর্মগ্রন্থ ও পত্রিকা: The Holy Quran, The Daily Star",
          "অনন্য মহাজাগতিক বস্তু: The sun, The moon, The earth",
          "জাতির নাম: The English, The Bengalis",
          "Superlative Degree: He is the best student in the class."
        ],
        tips: "একক পর্বত বা দ্বীপের নামের পূর্বে The বসে না (যেমন: Mount Everest-এর আগে The বসে না)।"
      }
    ]
  },
  {
    id: "bangla_grammar",
    title: "বাংলা ব্যাকরণ",
    bengaliTitle: "সন্ধি, কারক ও গুরুত্বপূর্ণ বাগধারা",
    badge: "বাংলা ব্যাকরণ ও নির্মিতি",
    items: [
      {
        title: "স্বরসন্ধি ও ব্যঞ্জনসন্ধি",
        subtitle: "দুই বর্ণের মিলনকে সন্ধি বলে",
        explanation: "সন্ধির প্রধান কাজ হলো উচ্চারণে সহজবোধ্যতা ও শ্রুতিমধুরতা আনা। সপ্তম শ্রেণির গুরুত্বপূর্ণ সন্ধি বিচ্ছেদসমূহ:",
        structure: "স্বরবর্ণ + স্বরবর্ণ = স্বরসন্ধি | স্বর+ব্যঞ্জন বা ব্যঞ্জন+ব্যঞ্জন = ব্যঞ্জনসন্ধি",
        examples: [
          "বিদ্যালয় = বিদ্যা + আলয়",
          "সূর্যোদয় = সূর্য + উদয়",
          "হিমাচল = হিম + অচল",
          "দিগন্ত = দিক্ + অন্ত",
          "উজ্জ্বল = উৎ + জ্বল",
          "সজ্জন = সৎ + জন",
          "পবিত্র = পো + ইত্র",
          "গায়ক = গৈ + অক"
        ]
      },
      {
        title: "কারক ও বিভক্তি নির্ণয়ের জাদু",
        subtitle: "ক্রিয়াপদের সাথে সম্বন্ধযুক্ত পদ",
        explanation: "বাক্যস্থিত ক্রিয়াপদের সঙ্গে নামপদের যে সম্পর্ক, তাকে কারক বলে। কারক ৬ প্রকার:",
        structure: "কে? -> কর্তা | কী/কাকে? -> কর্ম | কী দ্বারা? -> করণ | কার জন্য? -> সম্প্রদান | কোথা হতে? -> অপাদান | কোথায়/কখন? -> অধিকরণ",
        examples: [
          "কর্তিকারক: বুলবুলিতে ধান খেয়েছে (কে ধান খেয়েছে? - বুলবুলিতে)",
          "কর্মকারক: ডাক্তার ডাকো (কাকে ডাকো? - ডাক্তার)",
          "করণকারক: ছেলেরা বল খেলে (কী দ্বারা খেলে? - বল দ্বারা)",
          "সম্প্রদানকারক: ভিক্ষুককে ভিক্ষা দাও (নিঃস্বার্থ দান)",
          "অপাদানকারক: তিলে তৈল হয় / গাছ থেকে পাতা পড়ে (বিচ্যুত/উৎপন্ন)",
          "অধিকরণকারক: নদীতে মাছ আছে / তিনি অংকে কাঁচা কিন্তু ব্যাকরণে ভালো (স্থান/বিষয়)"
        ]
      },
      {
        title: "সপ্তম শ্রেণির শীর্ষ বাগধারা ও অর্থ",
        subtitle: "বাগধারা বাক্যকে আকর্ষণীয় করে তোলে",
        explanation: "যে সকল শব্দগুচ্ছ তাদের সাধারণ অর্থ প্রকাশ না করে বিশেষ অর্থ প্রকাশ করে তাদেরকে বাগধারা বলে।",
        structure: "বাগধারা ও তার বাস্তবিক অর্থ",
        examples: [
          "আকাশ কুসুম -> অসম্ভব কল্পনা",
          "ডুমুরের ফুল -> দুর্লভ বস্তু (যা সচরাচর দেখা যায় না)",
          "বিড়াল তপস্বী -> ভণ্ড সাধু",
          "কান পাতলা -> সহজে বিশ্বাসপ্রবণ ব্যক্তি",
          "ভিজে বেড়াল -> কপট শান্ত ব্যক্তি",
          "গোবর গণেশ -> মূর্খ বা নির্বোধ",
          "হাতের পাঁচ -> শেষ সম্বল",
          "সোনার পাথরবাটি -> অসম্ভব বস্তু"
        ]
      }
    ]
  }
];
