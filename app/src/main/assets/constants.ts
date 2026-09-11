
import { Subject } from './types';

export const SUBJECTS_DATA: Record<string, Subject> = {
  "1": {
    id: "1",
    name: "বাংলা প্রথম পত্র",
    icon: "📚",
    chapters: [
      { id: "1.1", title: "গদ্য-১: কাবুলিওয়ালা", pdfUrl: "https://drive.google.com/file/d/11jHoTPS4xCCXx-iQ4z_5qKLJkMRi8WnX/preview" },
      { id: "1.2", title: "গদ্য-২: লখার একুশে", pdfUrl: "https://drive.google.com/file/d/1n4g3Tr5nFSVjQwQruPNJE9q-qq9x14-P/preview" },
      { id: "1.3", title: "গদ্য-৩: মরু-ভাস্কর", pdfUrl: "https://drive.google.com/file/d/1weNsD3ueHlYcfrCu0z6cbAtzuevbdIJ1/preview" },
      { id: "1.4", title: "গদ্য-৪: শব্দ থেকে কবিতা", pdfUrl: "https://drive.google.com/file/d/1WF4Pgq595xFWF18MZNB5xLITWqd7d3NL/preview" },
      { id: "1.5", title: "গদ্য-৫: পাখি", pdfUrl: "https://drive.google.com/file/d/1kOBYci9bpT7dPqTvSHcXiDp7E0mdT4PL/preview" },
      { id: "1.6", title: "গদ্য-৬: পিতৃপুরুষের গল্প", pdfUrl: "https://drive.google.com/file/d/1m3CoQ0yVD-2Mk83pepdyvTW6H7rQOn6T/preview" },
      { id: "1.7", title: "গদ্য-৭: ছবির রং", pdfUrl: "https://drive.google.com/file/d/1fIvgCSjDC3pfT70TDpwAe7zFvnRn7UdH/preview" },
      { id: "1.8", title: "গদ্য-৮: সেই ছেলেটি", pdfUrl: "https://drive.google.com/file/d/1n4sWY12R-2HKMh8OK5vR6aSDJiZfdxhV/preview" },
      { id: "1.9", title: "গদ্য-৯: বহু জাতিসত্তার দেশ - বাংলাদেশ", pdfUrl: "https://drive.google.com/file/d/1SIa6cLBTLZmJx0IN3gwiuvEY4SlhxqCH/preview" },
      { id: "1.10", title: "পদ্য-১: নতুন দেশ", pdfUrl: "https://drive.google.com/file/d/1Fsb7KECDbhoU7FifLnZfWvj6Ub3cMf3W/preview" },
      { id: "1.11", title: "পদ্য-২: কুলি-মজুর", pdfUrl: "https://drive.google.com/file/d/1dyE-JwKXtiUuUq_vBAruvcol5s6VPCNF/preview" },
      { id: "1.12", title: "পদ্য-৩: আমার বাড়ি", pdfUrl: "https://drive.google.com/file/d/1fXz25pzvjw6K6qDlTjrNl8wMlvdjtSOy/preview" },
      { id: "1.13", title: "পদ্য-৪: শ্রাবণে", pdfUrl: "https://drive.google.com/file/d/1ABR_b4jB5DfR0X53Wt7Zgiqz22A63GhN/preview" },
      { id: "1.14", title: "পদ্য-৫: গরবিনী মা-জননী", pdfUrl: "https://drive.google.com/file/d/1HZpWXcQKel6_92b8kz6Tn3O4MyS5d-4M/preview" },
      { id: "1.15", title: "পদ্য-৬: সাম্য", pdfUrl: "https://drive.google.com/file/d/1HZpWXcQKel6_92b8kz6Tn3O4MyS5d-4M/preview" },
      { id: "1.16", title: "পদ্য-৭: মেলা", pdfUrl: "https://drive.google.com/file/d/1AslOoIkGl6zt9dJ3800gZReB_E15xmdt/preview" },
      { id: "1.17", title: "পদ্য-৮: এই অক্ষরে", pdfUrl: "https://drive.google.com/file/d/1bRRQxD3V91cmocUtYzurA7Y_VgVEDkXB/preview" },
      { id: "1.18", title: "পদ্য-৯: সিঁথি", pdfUrl: "https://drive.google.com/file/d/1bRRQxD3V91cmocUtYzurA7Y_VgVEDkXB/preview" },
      { id: "1.19", title: "গল্প-১: তোতা-কাহিনী", pdfUrl: "https://drive.google.com/file/d/1Yql5sz7ORnWAM5IKYghV4JMByRLdypCk/preview" },
      { id: "1.20", title: "গল্প-২: জিদ", pdfUrl: "https://drive.google.com/file/d/1fnRBczMR_c0Bjrnkk2UaIkDzDXxYb4tN/preview" },
      { id: "1.21", title: "গল্প-৩: খুদে গোয়েন্দার অভিযান", pdfUrl: "https://drive.google.com/file/d/1fnRBczMR_c0Bjrnkk2UaIkDzDXxYb4tN/preview" },
      { id: "1.22", title: "গল্প-৪: দীক্ষা", pdfUrl: "https://drive.google.com/file/d/1zbc9AaPdkbHEYtGUF4M_oZzLLV02I6j7/preview" },
      { id: "1.23", title: "গল্প-৫: পদ্য লেখার জোরে", pdfUrl: "https://drive.google.com/file/d/1XtjCrLQnUVv-WO4AcOn4SChxbkAyRStw/preview" },
      { id: "1.24", title: "গল্প-৬: কোকিল", pdfUrl: "https://drive.google.com/file/d/13DYKIJ7YfBh39VoCy-pfOfDovziLGIiT/preview" },
      { id: "1.25", title: "গল্প-৭: কিং লিয়ার", pdfUrl: "https://drive.google.com/file/d/1VcL-G5xdsPF_DaifbLdDugGE3E63bb3B/preview" },
      { id: "1.26", title: "গল্প-৮: যুদ্ধক্ষেত্রে পিতাপুত্র", pdfUrl: "https://drive.google.com/file/d/10JAzOJFvfp-1-fYJ6Z7zXY1Mpb3fjWV5/preview" },
      { id: "1.27", title: "নাটক: জাগো সুন্দর", pdfUrl: "https://drive.google.com/file/d/1WY7GFQuLe7f7KhLPVEwd7qInMrHrKf_k/preview" },
      { id: "1.28", title: "মডেল টেস্ট: বাংলা ১ম পত্র", pdfUrl: "https://drive.google.com/file/d/1keGeGeaIliYVGJLuDZYFREKUk3KVTsz8/preview" }
    ],
    altChapters: [
      { id: "A1.1", title: "গদ্য-১: কাবুলিওয়ালা", pdfUrl: "" },
      { id: "A1.2", title: "গদ্য-২: লখার একুশে", pdfUrl: "" },
      { id: "A1.3", title: "গদ্য-৩: মরু-ভাস্কর", pdfUrl: "" },
      { id: "A1.4", title: "গদ্য-৪: শব্দ থেকে কবিতা", pdfUrl: "" },
      { id: "A1.5", title: "গদ্য-৫: পাখি", pdfUrl: "" },
      { id: "A1.6", title: "গদ্য-৬: পিতৃপুরুষের গল্প", pdfUrl: "" },
      { id: "A1.7", title: "গদ্য-৭: ছবির রং", pdfUrl: "" },
      { id: "A1.8", title: "গদ্য-৮: সেই ছেলেটি", pdfUrl: "" },
      { id: "A1.9", title: "গদ্য-৯: বহু জাতিসত্তার দেশ - বাংলাদেশ", pdfUrl: "" },
      { id: "A1.10", title: "পদ্য-১: নতুন দেশ", pdfUrl: "" },
      { id: "A1.11", title: "পদ্য-২: কুলি-মজুর", pdfUrl: "" },
      { id: "A1.12", title: "পদ্য-৩: আমার বাড়ি", pdfUrl: "" },
      { id: "A1.13", title: "পদ্য-৪: শ্রাবণে", pdfUrl: "" },
      { id: "A1.14", title: "পদ্য-৫: গরবিনী মা-জননী", pdfUrl: "" },
      { id: "A1.15", title: "পদ্য-৬: সাম্য", pdfUrl: "" },
      { id: "A1.16", title: "পদ্য-৭: মেলা", pdfUrl: "" },
      { id: "A1.17", title: "পদ্য-৮: এই অক্ষরে", pdfUrl: "" },
      { id: "A1.18", title: "পদ্য-৯: সিঁথি", pdfUrl: "" },
      { id: "A1.19", title: "গল্প-১: তোতা-কাহিনী", pdfUrl: "" },
      { id: "A1.20", title: "গল্প-২: জিদ", pdfUrl: "" },
      { id: "A1.21", title: "গল্প-৩: খুদে গোয়েন্দার অভিযান", pdfUrl: "" },
      { id: "A1.22", title: "গল্প-৪: দীক্ষা", pdfUrl: "" },
      { id: "A1.23", title: "গল্প-৫: পদ্য লেখার জোরে", pdfUrl: "" },
      { id: "A1.24", title: "গল্প-৬: কোকিল", pdfUrl: "" },
      { id: "A1.25", title: "গল্প-৭: কিং লিয়ার", pdfUrl: "" },
      { id: "A1.26", title: "গল্প-৮: যুদ্ধক্ষেত্রে পিতাপুত্র", pdfUrl: "" },
      { id: "A1.27", title: "নাটক: জাগো সুন্দর", pdfUrl: "" },
      { id: "A1.28", title: "মডেল টেস্ট: বাংলা ১ম পত্র", pdfUrl: "" }
    ]
  },
  "2": {
      id: "2",
      name: "বাংলা দ্বিতীয় পত্র",
      icon: "🖋️",
      chapters: [
        { id: "2.1", title: "১ম অধ্যায়- ভাষা ও ব্যাকরণ", pdfUrl: "https://drive.google.com/file/d/1xV40R27WrarYQHSgerYVUXoCZUmtau8d/preview" },
        { id: "2.2", title: "২য় অধ্যায়- ধ্বনিতত্ত্ব", pdfUrl: "https://drive.google.com/file/d/1ECBJpBBMvKoRJx4cO8tYsDTixSpWoDs2/preview" },
        { id: "2.3", title: "৩য় অধ্যায়- শব্দ প্রকরণ", pdfUrl: "https://drive.google.com/file/d/1gdrf66bwJbFONcb31DrMktlQDrsOhrzn/preview" },
        { id: "2.4", title: "৪র্থ অধ্যায়- পদ প্রকরণ", pdfUrl: "https://drive.google.com/file/d/1hikVZQ1RFmL_TxOf3SwsK6r0qfnkuf9P/preview" },
        { id: "2.5", title: "৫ম অধ্যায়- বাক্য প্রকরণ", pdfUrl: "https://drive.google.com/file/d/1Ms61qJKKGCS3ttUHIBtKtIQIg-zgjpuG/preview" },
        { id: "2.6", title: "৬ষ্ঠ অধ্যায়- বিরামচিহ্ন", pdfUrl: "https://drive.google.com/file/d/1CT7K2J0n4x8PQEpSH6J9A7ibo_QO6Wfz/preview" },
        { id: "2.7", title: "৭ম অধ্যায়- শব্দার্থ", pdfUrl: "https://drive.google.com/file/d/1YSBPbeyuqy_hnoosyLd6u-NShq6ImdEL/preview" },
        { id: "2.8", title: "৮ম অধ্যায়-  অভিধান", pdfUrl: "https://drive.google.com/file/d/1pulLztHAO0xTGt_AMiEeb3T_4_pDg1ZM/preview" },
        { id: "2.9", title: "৯ম অধ্যায়- অনুচ্ছেদ রচনা", pdfUrl: "https://drive.google.com/file/d/1UMbWR7msJ8PGWiOFJNgwaJFzv5S-0owc/preview" },
        { id: "2.10", title: "১০ম অধ্যায়- অনুধাবন পরীক্ষা", pdfUrl: "https://drive.google.com/file/d/1-uqNCUggpJajsWqerbUkKrRjGEbVgFY1/preview" },
        { id: "2.11", title: "১১শ অধ্যায়- সারাংশ ও সারমর্ম লিখন", pdfUrl: "https://drive.google.com/file/d/1ttLZwpupIr5ulyGTlWqyHGfi021txUs-/preview" },
        { id: "2.12", title: "১২শ অধ্যায়- ভাব-সম্প্রসারণ লিখন", pdfUrl: "https://drive.google.com/file/d/1Ou2srfG4E4Quuuofh9MtayEbrXK_gbqL/preview" },
        { id: "2.13", title: "১৩শ অধ্যায়- পত্র লিখন", pdfUrl: "https://drive.google.com/file/d/1EwouRB8GqgHiYhZ3B7CWicsnS4zvzsr-/preview" },
        { id: "2.14", title: "১৪শ অধ্যায়- অনুবাদ", pdfUrl: "https://drive.google.com/file/d/1bT3qX4Pz8C85NetBB0Gk5PaSdvMNwFZV/preview" },
        { id: "2.15", title: "১৫শ অধ্যায়- প্রবন্ধ রচনা", pdfUrl: "https://drive.google.com/file/d/1pYwL8somdqp6-0V2d9hZJK4S854tH9wl/preview" },
        { id: "2.16", title: "মডেল টেস্ট", pdfUrl: "https://drive.google.com/file/d/1LEFIdVRXnM-JXskY4fSfsUlI64jWA4BN/preview" }
      ],
      altChapters: [
        { id: "A2.1", title: "১ম অধ্যায়- ভাষা ও ব্যাকরণ", pdfUrl: "" },
        { id: "A2.2", title: "২য় অধ্যায়- ধ্বনিতত্ত্ব", pdfUrl: "" },
        { id: "A2.3", title: "৩য় অধ্যায়- পদ প্রকরণ", pdfUrl: "" },
        { id: "A2.4", title: "৪র্থ অধ্যায়- বাক্য প্রকরণ", pdfUrl: "" },
        { id: "A2.5", title: "৫ম অধ্যায়- বিরামচিহ্ন", pdfUrl: "" },
        { id: "A2.6", title: "৬ষ্ঠ অধ্যায়- শব্দার্থ", pdfUrl: "" },
        { id: "A2.7", title: "৭ম অধ্যায়- অভিধান", pdfUrl: "" },
        { id: "A2.8", title: "৮ম অধ্যায়- শব্দ প্রকরণ", pdfUrl: "" },
        { id: "A2.9", title: "৯ম অধ্যায়- অনুচ্ছেদ রচনা", pdfUrl: "" },
        { id: "A2.10", title: "১০ম অধ্যায়- অনুধাবন পরীক্ষা", pdfUrl: "" },
        { id: "A2.11", title: "১১শ অধ্যায়- সারাংশ ও সারমর্ম লিখন", pdfUrl: "" },
        { id: "A2.12", title: "১২শ অধ্যায়- ভাব-সম্প্রসারণ লিখন", pdfUrl: "" },
        { id: "A2.13", title: "১৩শ অধ্যায়- পত্র লিখন", pdfUrl: "" },
        { id: "A2.14", title: "১৪শ অধ্যায়- অনুবাদ", pdfUrl: "" },
        { id: "A2.15", title: "১৫শ অধ্যায়- প্রবন্ধ রচনা", pdfUrl: "3" },
        { id: "A2.16", title: "মডেল টেস্ট", pdfUrl: "" }
      ]
    },
  "3": {
    id: "3",
    name: "ইংরেজি প্রথম পত্র",
    icon: "🔤",
    chapters: [
      { id: "3.1", title: "Unit-01: Attention, Please", pdfUrl: "https://drive.google.com/file/d/1JfpyhhI1f_CRrIQ57VLuqoL7aFwWQAY-/preview" },
      { id: "3.2", title: "Unit-02: My Study Guide", pdfUrl: "https://drive.google.com/file/d/12Sk9mynikzLmogvTp37eI7802m8fnEfK/preview" },
      { id: "3.3", title: "Unit-03: What are Friends for?", pdfUrl: "https://drive.google.com/file/d/1rjL6SD5oO9ghqRPuaYVx5Ngom7nOw64q/preview" },
      { id: "3.4", title: "Unit-04: People Who Make a Difference", pdfUrl: "https://drive.google.com/file/d/1scGcGMr4gvqFkq-7DwVAHwDPE7uVVBEa/preview" },
      { id: "3.5", title: "Unit-05: Great Women to Remember", pdfUrl: "https://drive.google.com/file/d/1cZAOki0sAq64RNH0GQYhvsH7-Tbw4a8o/preview" },
      { id: "3.6", title: "Unit-06: Leisure", pdfUrl: "https://drive.google.com/file/d/1-idmpla4YoRkTWdN5wrf3RoB482Qiwra/preview" },
      { id: "3.7", title: "Unit-07: Games and Sports", pdfUrl: "https://drive.google.com/file/d/1VdU1cYd_c_gqQy3rFVJkP3piGkRa0WRQ/preview" },
      { id: "3.8", title: "Unit-08: Likes and Dislikes", pdfUrl: "https://drive.google.com/file/d/1_-1o3dLg4sFmybE16QGfM7-J2JybzE84/preview" },
      { id: "3.9", title: "Unit-09: Climate Change", pdfUrl: "https://drive.google.com/file/d/1N5IZDr_tbK1DYKcAo4q6tEJhai8rVQTF/preview" },
      { id: "3.10", title: "Sample Question For Grade 7", pdfUrl: "https://drive.google.com/file/d/1hLPy0OpBaLsBCrcnPglL3YXooccCxegR/preview" }
    ],
    altChapters: [
      { id: "A3.1", title: "Unit-01: Attention, Please", pdfUrl: "" },
      { id: "A3.2", title: "Unit-02: My Study Guide", pdfUrl: "" },
      { id: "A3.3", title: "Unit-03: What are Friends for?", pdfUrl: "" },
      { id: "A3.4", title: "Unit-04: People Who Make a Difference", pdfUrl: "" },
      { id: "A3.5", title: "Unit-05: Great Women to Remember", pdfUrl: "" },
      { id: "A3.6", title: "Unit-06: Leisure", pdfUrl: "" },
      { id: "A3.7", title: "Unit-07: Games and Sports", pdfUrl: "" },
      { id: "A3.8", title: "Unit-08: Likes and Dislikes", pdfUrl: "" },
      { id: "A3.9", title: "Unit-09: Climate Change", pdfUrl: "" }
    ]
  },
  "4": {
    id: "4",
    name: "ইংরেজি দ্বিতীয় পত্র",
    icon: "🌍",
    chapters: [
      { id: "4.1", title: "Part - 1 Grammar", pdfUrl: "" },
      { id: "4.2", title: "Lesson- 1 - Paragraph Writing", pdfUrl: "https://drive.google.com/file/d/162ffBUw0GEHeOXhJYWmFdYcamk-rtLJy/preview" },
      { id: "4.3", title: "Lesson- 2 - Instruction Paragraph", pdfUrl: "https://drive.google.com/file/d/15mAmBLyhY8yljX1ahUJ8QqxFkjMZsYzp/preview" },
      { id: "4.4", title: "Lesson- 3 - Completing Story Writing", pdfUrl: "https://drive.google.com/file/d/1efd_DWSxyuH8OMLMpMrkwebIlU5MuLnZ/preview" },
      { id: "4.5", title: "Lesson- 4 - Dialogue Writing", pdfUrl: "https://drive.google.com/file/d/148JbVYEZytYpOS_dLWUrRK_pjB1myrKo/preview" },
      { id: "4.6", title: "Lesson- 5 - Letter Writing", pdfUrl: "https://drive.google.com/file/d/1ExTlTkshJoAQwtsXNLPmstbSEPtGXMvM/preview" },
      { id: "4.7", title: "Lesson- 6 - E-mail & Formal E-mail", pdfUrl: "https://drive.google.com/file/d/1qTx1pvHMAE2bcCpMxYxiWhTV3NSUqL8C/preview" },
      { id: "4.8", title: "Lesson- 7 - CV Writing", pdfUrl: "https://drive.google.com/file/d/19P8WbAr80YCEueX5BH6XZfiOJ8YS2yDb/preview" },
      { id: "4.9", title: "Lesson- 8 - Composition Writing", pdfUrl: "https://drive.google.com/file/d/1bL6Txu2Kv91q63WypUVaJgbov1XHcf6P/preview" },
      { id: "4.10", title: "Part - 3 - Board Book", pdfUrl: "https://drive.google.com/file/d/1DDihsUSe_hIQGzr33kIIzHXZt0yKfU61/preview" },
      { id: "4.11", title: "Part- 5 - Model Test", pdfUrl: "https://drive.google.com/file/d/13murhTL7ocAsiA-m_qsqZRWaeEA8wdD9/preview" }
    ],
    altChapters: [
        { id: "A4.1", title: "Part - 1 Grammar", pdfUrl: "" },
        { id: "A4.2", title: "Lesson- 1 - Paragraph Writing", pdfUrl: "" },
        { id: "A4.3", title: "Lesson- 2 - Instruction Paragraph", pdfUrl: "" },
        { id: "A4.4", title: "Lesson- 3 - Completing Story Writing", pdfUrl: "" },
        { id: "A4.5", title: "Lesson- 4 - Dialogue Writing", pdfUrl: "" },
        { id: "A4.6", title: "Lesson- 5 - Letter Writing", pdfUrl: "" },
        { id: "A4.7", title: "Lesson- 6 - E-mail & Formal E-mail", pdfUrl: "" },
        { id: "A4.8", title: "Lesson- 7 - CV Writing", pdfUrl: "" },
        { id: "A4.9", title: "Lesson- 8 - Composition Writing", pdfUrl: "" },
        { id: "A4.10", title: "Part - 3 - Board Book", pdfUrl: "" },
        { id: "A4.11", title: "Part- 5 - Model Test", pdfUrl: "" }
    ]
  },
  "5": {
    id: "5",
    name: "গণিত",
    icon: "📐",
    chapters: [
      { id: "5.1", title: "১ম অধ্যায়- মূলদ ও অমূলদ সংখ্যা", pdfUrl: "https://drive.google.com/file/d/1QMf8TkRBKGJwQ4gp2qKgey-KtRyiMryM/preview" },
      { id: "5.2", title: "২য় অধ্যায়- সমানুপাত ও লাভ ক্ষতি", pdfUrl: "https://drive.google.com/file/d/16hYxQzQu9UflcCykfowunO1xm_ruwDGH/preview" },
      { id: "5.3", title: "৩য় অধ্যায়- পরিমাপ", pdfUrl: "https://drive.google.com/file/d/1T0S2CM_zPwL_AHyeW8ZRqW4OZIu0pK8g/preview" },
      { id: "5.4", title: "৪র্থ অধ্যায়- বীজগাণিতীয় রাশির গুণ ও ভাগ", pdfUrl: "https://drive.google.com/file/d/1zDnub1k0p3k6oFjp3zp1UAe0Y_llv5zw/preview" },
      { id: "5.5", title: "৫ম অধ্যায়- বীজগাণিতীয় সূত্রাবলি ও প্রয়োগ", pdfUrl: "https://drive.google.com/file/d/1Ulaw8mEZiE4aYOgyjF98sJTLQtCJ6BJq/preview" },
      { id: "5.6", title: "৬ষ্ঠ অধ্যায়- বীজগাণিতীয় ভগ্নাংশ", pdfUrl: "https://drive.google.com/file/d/1lmJaMJbEeD1aH__jRcQ1ERyDmfhrhdJs/preview" },
      { id: "5.7", title: "৭ম অধ্যায়- সরল সমীকরণ", pdfUrl: "https://drive.google.com/file/d/1CpimhfPwi_OWRtgNV3kwOrusZc8uk4a9/preview" },
      { id: "5.8", title: "৮ম অধ্যায়- সমান্তরাল সরলরেখা", pdfUrl: "https://drive.google.com/file/d/1fabiaF9-sai06VvbKuVM_RzGrWkOn_R5/preview" },
      { id: "5.9", title: "৯ম অধ্যায়- ত্রিভুজ", pdfUrl: "https://drive.google.com/file/d/1KpIjxgbXWITCEHgV77DGKlfZ99De7qrK/preview" },
      { id: "5.10", title: "১০ম অধ্যায়- সর্বসমতা ও সদৃশতা", pdfUrl: "https://drive.google.com/file/d/1qXT-tUgBzDCTbkwZRQqPHOA-zkTlCnIm/preview" },
      { id: "5.11", title: "১১শ অধ্যায়- তথ্য ও উপাত্ত", pdfUrl: "https://drive.google.com/file/d/1uOD_LphaZpPJxmG8MTBrzGAK_5sfQd9N/preview" },
      { id: "5.12", title: "দক্ষতা যাচাই", pdfUrl: "https://drive.google.com/file/d/1DuYfOybZCnLHqvUHNJqqwiK2hN50styO/preview" }
    ],
    altChapters: [
      { id: "A5.1", title: "১ম অধ্যায়- মূলদ ও অমূলদ সংখ্যা", pdfUrl: "" },
      { id: "A5.2", title: "২য় অধ্যায়- সমানুপাত ও লাভ ক্ষতি", pdfUrl: "" },
      { id: "A5.3", title: "৩য় অধ্যায়- পরিমাপ", pdfUrl: "" },
      { id: "A5.4", title: "৪র্থ অধ্যায়- বীজগাণিতীয় রাশির গুণ ও ভাগ", pdfUrl: "" },
      { id: "A5.5", title: "৫ম অধ্যায়- বীজগাণিতীয় সূত্রাবলি ও প্রয়োগ", pdfUrl: "" },
      { id: "A5.6", title: "৬ষ্ঠ অধ্যায়- বীজগাণিতীয় ভগ্নাংশ", pdfUrl: "" },
      { id: "A5.7", title: "৭ম অধ্যায়- সরল সমীকরণ", pdfUrl: "" },
      { id: "A5.8", title: "৮ম অধ্যায়- সমান্তরাল সরলরেখা", pdfUrl: "" },
      { id: "A5.9", title: "৯ম অধ্যায়- ত্রিভুজ", pdfUrl: "" },
      { id: "A5.10", title: "১০ম অধ্যায়- সর্বসমতা ও সদৃশতা", pdfUrl: "3" },
      { id: "A5.11", title: "১১শ অধ্যায়- তথ্য ও উপাত্ত", pdfUrl: "" },
      { id: "A5.12", title: "দক্ষতা যাচাই", pdfUrl: "" }
    ]
  },
  "6": {
    id: "6",
    name: "ডিজিটাল প্রযুক্তি",
    icon: "💻",
    chapters: [
      { id: "6.1", title: "১ম অধ্যায়: প্রাত্যহিক জীবনে তথ্য ও যোগাযোগ প্রযুক্তি", pdfUrl: "https://drive.google.com/file/d/1TgbpzYiTPvnJtfVCj3V27ZHYli5V3R8m/preview" },
      { id: "6.2", title: "২য় অধ্যায়: কম্পিউটার-সংশ্লিষ্ট যন্ত্রপাতি", pdfUrl: "https://drive.google.com/file/d/1aWHV7wAGH7PPdDyEgAKKQOTdCABzpduH/preview" },
      { id: "6.3", title: "৩য় অধ্যায়: নিরাপদ ও নৈতিক ব্যবহার", pdfUrl: "https://drive.google.com/file/d/1TNoq5Rc3LyLUwCVJbYaq4JINDU8VnH4u/preview" },
      { id: "6.4", title: "৪র্থ অধ্যায়: ওয়ার্ড প্রসেসিং", pdfUrl: "https://drive.google.com/file/d/1BGSBJQ_tRqcsBPN7YfKnntjw4F9BIigI/preview" },
      { id: "6.5", title: "৫ম অধ্যায়: শিক্ষায় ইন্টারনেটের ব্যবহার", pdfUrl: "https://drive.google.com/file/d/14rr7qoBvwjkLlpCBqcemcpqkXqVjerqW/preview" },
      { id: "6.6", title: "ব্যবহারিক অংশ", pdfUrl: "https://drive.google.com/file/d/1I_tWoJ9L9jnZ8GwLIvnFpYkM02xd4-PC/preview" }
    ],
    altChapters: [
      { id: "A6.1", title: "১ম অধ্যায়: প্রাত্যহিক জীবনে তথ্য ও যোগাযোগ প্রযুক্তি", pdfUrl: "" },
      { id: "A6.2", title: "২য় অধ্যায়: কম্পিউটার-সংশ্লিষ্ট যন্ত্রপাতি", pdfUrl: "" },
      { id: "A6.3", title: "৩য় অধ্যায়: নিরাপদ ও নৈতিক ব্যবহার", pdfUrl: "" },
      { id: "A6.4", title: "৪র্থ অধ্যায়: ওয়ার্ড প্রসেসিং", pdfUrl: "" },
      { id: "A6.5", title: "৫ম অধ্যায়: শিক্ষায় ইন্টারনেটের ব্যবহার", pdfUrl: "" },
      { id: "A6.6", title: "ব্যবহারিক অংশ", pdfUrl: "" }
    ]
  },
  "7": {
    id: "7",
    name: "বাংলাদেশ ও বিশ্বপরিচয়",
    icon: "🗺️",
    chapters: [
      { id: "7.1", title: "১ম অধ্যায়- বাংলাদেশের মুক্তি সংগ্রাম", pdfUrl: "https://drive.google.com/file/d/1QCs7lYgTs-oG-QaXp7H3J45dx0tjcTAg/preview" },
      { id: "7.2", title: "২য় অধ্যায়- বাংলাদেশের সংস্কৃতি ও সাংস্কৃতিক বৈচিত্র্য", pdfUrl: "https://drive.google.com/file/d/1GO-_mI_2SV_wMVG_PMNdLGUo3KKWKRLb/preview" },
      { id: "7.3", title: "৩য় অধ্যায়- পরিবারে শিশুদের বেড়ে ওঠা", pdfUrl: "https://drive.google.com/file/d/1u7daa2ouotkza6TIrgs0Fm3oo2Y1HM4I/preview" },
      { id: "7.4", title: "৪র্থ অধ্যায়- বাংলাদেশের অর্থনীতি", pdfUrl: "https://drive.google.com/file/d/1NbnnQyLo05jqVgWTqN1tE4RZHVlxPyS8/preview" },
      { id: "7.5", title: "৫ম অধ্যায়- বাংলাদেশ ও বাংলাদেশের নাগরিক", pdfUrl: "https://drive.google.com/file/d/12EOqjj0ezJsYnf_a7h9N_6nWdNiJVJGS/preview" },
      { id: "7.6", title: "৬ষ্ঠ অধ্যায়- বাংলাদেশের জলবায়ু", pdfUrl: "https://drive.google.com/file/d/1mmwTs1p5ZqUIDB2bZo2ojYBHNZdVYt8m/preview" },
      { id: "7.7", title: "৭ম অধ্যায়- বাংলাদেশের জনসংখ্যা পরিচিতি", pdfUrl: "https://drive.google.com/file/d/10uhe6F1KAO1RYB25SPksmKz0MpC-VUL9/preview" },
      { id: "7.8", title: "৮ম অধ্যায়- বাংলাদেশের সামাজিক সমস্যা", pdfUrl: "https://drive.google.com/file/d/1aot2ZHhT88U7TCA2cJI3y73JOJcFpQjP/preview" },
      { id: "7.9", title: "৯ম অধ্যায়- বাংলাদেশের প্রবীণ ব্যক্তি ও নারী অধিকার", pdfUrl: "https://drive.google.com/file/d/1tNPoV6P73_NhgQ7dJsHesLJi4wpCToM5/preview" },
      { id: "7.10", title: "১০ম অধ্যায়- এশিয়ার কয়েকটি দেশ", pdfUrl: "https://drive.google.com/file/d/1xBh7Dspcdo6AZa-cZ-czFHewzPeuGp4M/preview" },
      { id: "7.11", title: "১১শ অধ্যায়- বাংলাদেশ ও আন্তর্জাতিক সহযোগিতা", pdfUrl: "https://drive.google.com/file/d/1a1c0VpUXS4_adN_FW29BC5H5olRPoOjA/preview" },
      { id: "7.12", title: "অর্ধ বার্ষিক", pdfUrl: "https://drive.google.com/file/d/1RSPEkaVp6c_Rz0PUSfUJMfazpmTz_1R0/preview" }
    ],
    altChapters: [
      { id: "A7.1", title: "১ম অধ্যায়- বাংলাদেশের মুক্তি সংগ্রাম", pdfUrl: "" },
      { id: "A7.2", title: "২য় অধ্যায়- বাংলাদেশের সংস্কৃতি ও সাংস্কৃতিক বৈচিত্র্য", pdfUrl: "" },
      { id: "A7.3", title: "৩য় অধ্যায়- পরিবারে শিশুদের বেড়ে ওঠা", pdfUrl: "" },
      { id: "A7.4", title: "৪র্থ অধ্যায়- বাংলাদেশের অর্থনীতি", pdfUrl: "" },
      { id: "A7.5", title: "৫ম অধ্যায়- বাংলাদেশ ও বাংলাদেশের নাগরিক", pdfUrl: "" },
      { id: "A7.6", title: "৬ষ্ঠ অধ্যায়- বাংলাদেশের জলবায়ু", pdfUrl: "" },
      { id: "A7.7", title: "৭ম অধ্যায়- বাংলাদেশের জনসংখ্যা পরিচিতি", pdfUrl: "" },
      { id: "A7.8", title: "৮ম অধ্যায়- বাংলাদেশের সামাজিক সমস্যা", pdfUrl: "" },
      { id: "A7.9", title: "৯ম অধ্যায়- বাংলাদেশের প্রবীণ ব্যক্তি ও নারী অধিকার", pdfUrl: "" },
      { id: "A7.10", title: "১০ম অধ্যায়- এশিয়ার কয়েকটি দেশ", pdfUrl: "" },
      { id: "A7.11", title: "১১শ অধ্যায়- বাংলাদেশ ও আন্তর্জাতিক সহযোগিতা", pdfUrl: "" },
      { id: "A7.12", title: "অর্ধ বার্ষিক", pdfUrl: "" }
    ]
  },
  "8": {
    id: "8",
    name: "বিজ্ঞান",
    icon: "🧪",
    chapters: [
      { id: "8.1", title: "১ম অধ্যায়- নিম্নশ্রেণির জীব", pdfUrl: "https://drive.google.com/file/d/1sVOelxILQaSN_c6bTLAfWAX9qFuvedbR/preview" },
      { id: "8.2", title: "২য় অধ্যায়- উদ্ভিদ ও প্রাণীর কোষীয় সংগঠন", pdfUrl: "https://drive.google.com/file/d/1MTpi76AhVeKNG36AQJERvHik8qTx-LEc/preview" },
      { id: "8.3", title: "৩য় অধ্যায়- উদ্ভিদের বাহ্যিক বৈশিষ্ট্য", pdfUrl: "https://drive.google.com/file/d/1HfCWnz0emxddh06axqa1IN5wMdl3XB7M/preview" },
      { id: "8.4", title: "৪র্থ অধ্যায়- শ্বসন", pdfUrl: "https://drive.google.com/file/d/14-BoSmdcKllCzGvKstP9a9fuAo9KPbUn/preview" },
      { id: "8.5", title: "৫ম অধ্যায়- পরিপাকতন্ত্র এবং রক্ত সংবহনতন্ত্র", pdfUrl: "https://drive.google.com/file/d/1wQxIb85R3OwVQe0NlO-uQHNUkE3-NK_a/preview" },
      { id: "8.6", title: "৬ষ্ঠ অধ্যায়- পদার্থের গঠন", pdfUrl: "https://drive.google.com/file/d/11E1iZowTsJYHGQdIp7Qjr57KbHWdZCX6/preview" },
      { id: "8.7", title: "৭ম অধ্যায়- শক্তির ব্যবহার", pdfUrl: "https://drive.google.com/file/d/1EchnlwS6gavaQMScztCQXGbDmY285o3R/preview" },
      { id: "8.8", title: "৮ম অধ্যায়- শব্দের কথা", pdfUrl: "https://drive.google.com/file/d/1oP93HF6Ycg4rjWiPmRrdJ-4F0fbnB0AG/preview" },
      { id: "8.9", title: "৯ম অধ্যায়- তাপ ও তাপমাত্রা", pdfUrl: "https://drive.google.com/file/d/1wzKL7-Yuhi9FEyFbsrsKv1urfczvotbM/preview" },
      { id: "8.10", title: "১০ম অধ্যায়- বিদ্যুৎ ও চুম্বকের ঘটনা", pdfUrl: "https://drive.google.com/file/d/1cqzXs710cn6NFuteahvK6R8X8etvz-PE/preview" },
      { id: "8.11", title: "১১শ অধ্যায়- পারিপার্শ্বিক পরিবর্তন ও বিভিন্ন ঘটনা", pdfUrl: "https://drive.google.com/file/d/1CbRf--g5xYX25AAoDyxAdibz_078Hktc/preview" },
      { id: "8.12", title: "১২শ অধ্যায়- সৌরজগৎ ও আমাদের পৃথিবী", pdfUrl: "https://drive.google.com/file/d/1XGU_DAhLFXk7BvtCNpOxWQsglM3RxMY1/preview" },
      { id: "8.13", title: "১৩শ অধ্যায়- প্রাকৃতিক পরিবেশ এবং দূষণ", pdfUrl: "https://drive.google.com/file/d/1B-rNVe3kBj9-g78pTkK4VO2hFGItJSKR/preview" },
      { id: "8.14", title: "১৪শ অধ্যায়- জলবায়ু পরিবর্তন", pdfUrl: "https://drive.google.com/file/d/1cpyktvAL0HFpssZTsRO41Un2x_VNL5eH/preview" },
      { id: "8.15", title: "মডেল টেস্ট", pdfUrl: "https://drive.google.com/file/d/1E8K2Sict4XUvjSflQOYVh4RH_22k-cG2/preview" }
    ],
    altChapters: [
      { id: "A8.1", title: "১ম অধ্যায়- নিম্নশ্রেণির জীব", pdfUrl: "" },
      { id: "A8.2", title: "২য় অধ্যায়- উদ্ভিদ ও প্রাণীর কোষীয় সংগঠন", pdfUrl: "" },
      { id: "A8.3", title: "৩য় অধ্যায়- উদ্ভিদের বাহ্যিক বৈশিষ্ট্য", pdfUrl: "" },
      { id: "A8.4", title: "৪র্থ অধ্যায়- শ্বসন", pdfUrl: "" },
      { id: "A8.5", title: "৫ম অধ্যায়- পরিপাকতন্ত্র এবং রক্ত সংবহনতন্ত্র", pdfUrl: "" },
      { id: "A8.6", title: "৬ষ্ঠ অধ্যায়- পদার্থের গঠন", pdfUrl: "" },
      { id: "A8.7", title: "৭ম অধ্যায়- শক্তির ব্যবহার", pdfUrl: "" },
      { id: "A8.8", title: "৮ম অধ্যায়- শব্দের কথা", pdfUrl: "" },
      { id: "A8.9", title: "৯ম অধ্যায়- তাপ ও তাপমাত্রা", pdfUrl: "" },
      { id: "A8.10", title: "১০ম অধ্যায়- বিদ্যুৎ ও চুম্বকের ঘটনা", pdfUrl: "" },
      { id: "A8.11", title: "১১শ অধ্যায়- পারিপার্শ্বিক পরিবর্তন ও বিভিন্ন ঘটনা", pdfUrl: "" },
      { id: "A8.12", title: "১২শ অধ্যায়- সৌরজগৎ ও আমাদের পৃথিবী", pdfUrl: "" },
      { id: "A8.13", title: "১৩শ অধ্যায়- প্রাকৃতিক পরিবেশ এবং দূষণ", pdfUrl: "" },
      { id: "A8.14", title: "১৪শ অধ্যায়- জলবায়ু পরিবর্তন", pdfUrl: "" },
      { id: "A8.15", title: "মডেল টেস্ট", pdfUrl: "" }
    ]
  },
  "9": {
    id: "9",
    name: "শারীরিক শিক্ষা ও স্বাস্থ্য",
    icon: "🤸",
    chapters: [
        { id: "9.1", title: "১ম অধ্যায়- শরীরচর্চা ও সুস্থজীবন", pdfUrl: "https://drive.google.com/file/d/1pCg4h-SXuXo3-FSJOJgoSll02XvouTHj/preview" },
        { id: "9.2", title: "২য় অধ্যায়- স্কাউটিং ও গার্ল গাইডিং", pdfUrl: "https://drive.google.com/file/d/1DyfsEnYPB5T9eWtlKWPhnpeONqqRYMqT/preview" },
        { id: "9.3", title: "৩য় অধ্যায়- স্বাস্থ্যবিজ্ঞান পরিচিতি ও স্বাস্থ্যসেবা", pdfUrl: "https://drive.google.com/file/d/1qN-9WtA-YaFFc9mM-ewLYVH841Xm1ZPN/preview" },
            { id: "9.4", title: "৪র্থ অধ্যায়- বয়ঃসন্ধিকালে ব্যক্তিগত নিরাপত্তা", pdfUrl: "https://drive.google.com/file/d/15Q-7nikCUUrPizaAhtgkS_wIC1zHj1Kr/preview" },
        { id: "9.5", title: "৫ম অধ্যায়- জীবনের জন্য খেলাধুলা", pdfUrl: "https://drive.google.com/file/d/1_ySKubOVHrCSdjLd-MFDbuvX-LjN97kd/preview" },
        { id: "9.6", title: "ব্যবহারিক", pdfUrl: "https://drive.google.com/file/d/1P6KVZaa6Jhvenf4ml2JEfeRTTZioU77C/preview" }
    ],
    altChapters: [
        { id: "A9.1", title: "১ম অধ্যায়- শরীরচর্চা ও সুস্থজীবন", pdfUrl: "" },
        { id: "A9.2", title: "২য় অধ্যায়- স্কাউটিং ও গার্ল গাইডিং", pdfUrl: "" },
        { id: "A9.3", title: "৩য় অধ্যায়- স্বাস্থ্যবিজ্ঞান পরিচিতি ও স্বাস্থ্যসেবা", pdfUrl: "" },
        { id: "A9.4", title: "৪র্থ অধ্যায়- বয়ঃসন্ধিকালে ব্যক্তিগত নিরাপত্তা", pdfUrl: "" },
        { id: "A9.5", title: "৫ম অধ্যায়- জীবনের জন্য খেলাধুলা", pdfUrl: "" },
        { id: "A9.6", title: "ব্যবহারিক", pdfUrl: "" }
    ]
  },
  "10": {
    id: "10",
    name: "কর্ম ও জীবনমুখী শিক্ষা",
    icon: "🛠️",
    chapters: [
        { id: "10.1", title: "১ম অধ্যায়", pdfUrl: "https://drive.google.com/file/d/19gF2pUec8kqo1CnMm0TOj1Nd8HGk39mM/preview" },
        { id: "10.2", title: "২য় অধ্যায়", pdfUrl: "https://drive.google.com/file/d/1ztVlDrwDy0aMoz2W4SnAov13u3Z4SYOP/preview" },
        { id: "10.3", title: "৩য় অধ্যায়", pdfUrl: "https://drive.google.com/file/d/1Fe4u0o8U6tjov18hrrGFhyZTsrSbv2E_/preview" },
        { id: "10.4", title: "ব্যবহারিক", pdfUrl: "https://drive.google.com/file/d/1Zbpji2ZpPqt5X4iAKr0ONEAEpHzomgRn/preview" }
    ],
    altChapters: [
        { id: "A10.1", title: "১ম অধ্যায়", pdfUrl: "" },
        { id: "A10.2", title: "২য় অধ্যায়", pdfUrl: "" },
        { id: "A10.3", title: "৩য় অধ্যায়", pdfUrl: "" },
        { id: "A10.4", title: "ব্যবহারিক", pdfUrl: "" }
    ]
  },
  "11": {
    id: "11",
    name: "কৃষিশিক্ষা",
    icon: "🌱",
    chapters: [
        { id: "11.1", title: "১ম অধ্যায়- কৃষি এবং আমাদের সংস্কৃতি", pdfUrl: "https://drive.google.com/file/d/1rDsvhjqELcbUYkht7Sb13HaoUozVZVZP/preview" },
        { id: "11.2", title: "২য় অধ্যায়- কৃষি প্রযুক্তি", pdfUrl: "https://drive.google.com/file/d/149EUD4orFsLI6-bSHPdMWOuryceWe-Sl/preview" },
        { id: "11.3", title: "৩য় অধ্যায়- কৃষি উপকরণ", pdfUrl: "https://drive.google.com/file/d/1bO-iitWml3PDmE_g-1oQVz-TnVfOkOF7/preview" },
            { id: "11.4", title: "৪র্থ অধ্যায়- কৃষি ও জলবায়ু", pdfUrl: "https://drive.google.com/file/d/1LlAuRV_o6h9Br_l1D8rxWYFHoBCn5c9n/preview" },
        { id: "11.5", title: "৫ম অধ্যায়- কৃষি উৎপাদন", pdfUrl: "https://drive.google.com/file/d/1Cp4oLNb_H2FPFkwcjIE-gE0ggOQNz5_d/preview" },
        { id: "11.6", title: "৬ষ্ঠ অধ্যায়- বনায়ন", pdfUrl: "https://drive.google.com/file/d/1jwlp8Z42Ib15CXiuYBoc_yHEwGCQMYOw/preview" }
    ],
    altChapters: [
        { id: "A11.1", title: "১ম অধ্যায়- কৃষি এবং আমাদের সংস্কৃতি", pdfUrl: "" },
        { id: "A11.2", title: "২য় অধ্যায়- কৃষি প্রযুক্তি", pdfUrl: "" },
        { id: "A11.3", title: "৩য় অধ্যায়- কৃষি উপকরণ", pdfUrl: "" },
        { id: "A11.4", title: "৪র্থ অধ্যায়- কৃষি ও জলবায়ু", pdfUrl: "" },
        { id: "A11.5", title: "৫ম অধ্যায়- কৃষি উৎপাদন", pdfUrl: "" },
        { id: "A11.6", title: "৬ষ্ঠ অধ্যায়- বনায়ন", pdfUrl: "" }
    ]
  },
  "12": {
    id: "12",
    name: "গার্হস্থ্য বিজ্ঞান",
    icon: "🏠",
    chapters: [
      { id: "12.1", title: "অধ্যায়-১: গৃহ ব্যবস্থাপনার স্তর ও গৃহসম্পদ", pdfUrl: "https://drive.google.com/file/d/1szQG_Kkea5_nly4UcTG6o47hxwDaHO7W/preview" },
      { id: "12.2", title: "অধ্যায়-২: গৃহসামগ্রী ক্রয়", pdfUrl: "https://drive.google.com/file/d/16Wk4oLGRgDHUNdpdV5U6fz189iJxfQNA/preview" },
      { id: "12.3", title: "অধ্যায়-৩: গৃহকে মনোরম ও আকর্ষণীয় করার নীতি", pdfUrl: "https://drive.google.com/file/d/1qhKBbHwkYlqQEOe0rOM_ZeZIK0luCY58/preview" },
      { id: "12.4", title: "অধ্যায়-৪: পরিবার ও সমাজের সদস্য হিসেবে শিশু", pdfUrl: "https://drive.google.com/file/d/12B5xOvpVvVoQ7WAxfDBocr0xchPsJyxo/preview" },
      { id: "12.5", title: "অধ্যায়-৫: শিশুর বিকাশে খেলাধুলা", pdfUrl: "https://drive.google.com/file/d/1h_9yGsqvzheuvP1RKq8rOOrA-eaXb6Et/preview" },
      { id: "12.6", title: "অধ্যায়-৬: প্রতিবন্ধী শিশু", pdfUrl: "https://drive.google.com/file/d/1PPjpVk3TT23AwTjSbw4BW60vix-FAo4S/preview" },
      { id: "12.7", title: "অধ্যায়-৭: জাতিসংঘ সনদ অনুযায়ী শিশুর অধিকার", pdfUrl: "https://drive.google.com/file/d/1hHKKip1AsDYrPM_UybHwNsuh8wGt0KkG/preview" },
      { id: "12.8", title: "অধ্যায়-৮: খাদ্য উপাদান, পরিপাক ও শোষণ", pdfUrl: "https://drive.google.com/file/d/11yaSX-Q2PjVsJnOsChPTEALhAbckDpF3/preview" },
      { id: "12.9", title: "অধ্যায়-৯: মৌলিক খাদ্যগোষ্ঠী", pdfUrl: "https://drive.google.com/file/d/1yvkow4YjGr-0MstJbhfCO5Ab5PnnS_Yt/preview" },
      { id: "12.10", title: "অধ্যায়-১০: রোগীর পথ্য ও পথ্য পরিকল্পনা", pdfUrl: "https://drive.google.com/file/d/1vM-BeDTzGTaw9TQv9bF8LFD3ZoHYxKjG/preview" },
      { id: "12.11", title: "অধ্যায়-১১: খাদ্য সংরক্ষণ", pdfUrl: "https://drive.google.com/file/d/14X0CnLA_q_6GApmaZcZuoK5T2ymn-Yz4/preview" },
      { id: "12.12", title: "অধ্যায়-১২: বয়ন তন্তুর গুণাগুণ", pdfUrl: "https://drive.google.com/file/d/1D9f2CFR3A7OdFzacwQZ3ub1agUHvPsM_/preview" },
      { id: "12.13", title: "অধ্যায়-১৩: বসত্র অলংকরণ", pdfUrl: "https://drive.google.com/file/d/1mySc-uN80fol1hxY1bFdrnNL6jNMdrri/preview" },
      { id: "12.14", title: "অধ্যায়-১৪: পোশাকের পারিপাট্য ও ব্যক্তিত্ব", pdfUrl: "https://drive.google.com/file/d/1oedT3YUA3peF07vLLP6tZ7qy34tqH5pu/preview" },
      { id: "12.15", title: "অধ্যায়-১৫: পোশাকের পরিচ্ছন্নতা", pdfUrl: "https://drive.google.com/file/d/1_0zUxWjNzZW1XN-wDVAAxOOIO7xp4Fm0/preview" }
    ],
    altChapters: [
      { id: "A12.1", title: "অধ্যায়-১: গৃহ ব্যবস্থাপনার স্তর ও গৃহসম্পদ", pdfUrl: "" },
      { id: "A12.2", title: "অধ্যায়-২: গৃহসামগ্রী ক্রয়", pdfUrl: "" },
      { id: "A12.3", title: "অধ্যায়-৩: গৃহকে মনোরম ও আকর্ষণীয় করার নীতি", pdfUrl: "" },
      { id: "A12.4", title: "অধ্যায়-৪: পরিবার ও সমাজের সদস্য হিসেবে শিশু", pdfUrl: "" },
      { id: "A12.5", title: "অধ্যায়-৫: শিশুর বিকাশে খেলাধুলা", pdfUrl: "" },
      { id: "A12.6", title: "অধ্যায়-৬: প্রতিবন্ধী শিশু", pdfUrl: "" },
      { id: "A12.7", title: "অধ্যায়-৭: জাতিসংঘ সনদ অনুযায়ী শিশুর অধিকার", pdfUrl: "" },
      { id: "A12.8", title: "অধ্যায়-৮: খাদ্য উপাদান, পরিপাক ও শোষণ", pdfUrl: "" },
      { id: "A12.9", title: "অধ্যায়-৯: মৌলিক খাদ্যগোষ্ঠী", pdfUrl: "" },
      { id: "A12.10", title: "অধ্যায়-১০: রোগীর পথ্য ও পথ্য পরিকল্পনা", pdfUrl: "" },
      { id: "A12.11", title: "অধ্যায়-১১: খাদ্য সংরক্ষণ", pdfUrl: "" },
      { id: "A12.12", title: "অধ্যায়-১২: বয়ন তন্তুর গুণাগুণ", pdfUrl: "" },
      { id: "A12.13", title: "অধ্যায়-১৩: বসত্র অলংকরণ", pdfUrl: "" },
      { id: "A12.14", title: "অধ্যায়-১৪: পোশাকের পারিপাট্য ও ব্যক্তিত্ব", pdfUrl: "" },
      { id: "A12.15", title: "অধ্যায়-১৫: পোশাকের পরিচ্ছন্নতা", pdfUrl: "" }
    ]
  },
  "13": {
    id: "13",
    name: "চারু ও কারুকলা",
    icon: "🎨",
    chapters: [
        { id: "13.1", title: "১ম অধ্যায়: বাংলাদেশে চারুকলা শিক্ষার ইতিহাস", pdfUrl: "https://drive.google.com/file/d/1ZN2boMoLEX7SyqIfDSkYK9WppJ1-I_Qe/preview" },
        { id: "13.2", title: "২য় অধ্যায়: চিত্রকলা সর্বকালে সব মানুষের ভাষা", pdfUrl: "https://drive.google.com/file/d/1xuobQ7vZ-9_Fdh1SWCrCtQo_JRRTSQ42/preview" },
        { id: "13.3", title: "৩য় অধ্যায়: বাংলাদেশের লোকশিল্প ও কারুশিল্প", pdfUrl: "https://drive.google.com/file/d/1e467h4IkiMJeBaujH1kO-IDFmalJsAFN/preview" },
        { id: "13.4", title: "৪র্থ অধ্যায়: ছবি আঁকার বিভিন্ন মাধ্যম", pdfUrl: "https://drive.google.com/file/d/1hiLM6dQKObfwpcRSbfvg00fOA6T4dalG/preview" },
        { id: "13.5", title: "৫ম অধ্যায়: ছবি আঁকার নানারকম আনন্দদায়ক অনুশীলন", pdfUrl: "https://drive.google.com/file/d/1m1miUIXqIY0KQz7XPdAbWMZ7rcrv6hPy/preview" },
        { id: "13.6", title: "৬ষ্ঠ অধ্যায়: বিভিন্ন প্রকার শিল্পকর্ম", pdfUrl: "https://drive.google.com/file/d/18E9sMd9YOlKMIKSgWKOJ9LD0kifEdElN/preview" },
        { id: "13.7", title: "৭ম অধ্যায়: রঙ ও রঙের ব্যবহার", pdfUrl: "https://drive.google.com/file/d/19h8qZs57CcaPPgFrnLebZoLM6a-An0Pu/preview" }
    ],
    altChapters: [
        { id: "A13.1", title: "১ম অধ্যায়: বাংলাদেশে চারুকলা শিক্ষার ইতিহাস", pdfUrl: "" },
        { id: "A13.2", title: "২য় অধ্যায়: চিত্রকলা সর্বকালে সব মানুষের ভাষা", pdfUrl: "" },
        { id: "A13.3", title: "৩য় অধ্যায়: বাংলাদেশের লোকশিল্প ও কারুশিল্প", pdfUrl: "" },
        { id: "A13.4", title: "৪র্থ অধ্যায়: ছবি আঁকার বিভিন্ন মাধ্যম", pdfUrl: "" },
        { id: "A13.5", title: "৫ম অধ্যায়: ছবি আঁকার নানারকম আনন্দদায়ক অনুশীলন", pdfUrl: "" },
        { id: "A13.6", title: "৬ষ্ঠ অধ্যায়: বিভিন্ন প্রকার শিল্পকর্ম", pdfUrl: "" },
        { id: "A13.7", title: "৭ম অধ্যায়: রঙ ও রঙের ব্যবহার", pdfUrl: "" }
    ]
  },
  "14": {
    id: "14",
    name: "ইসলাম শিক্ষা",
    icon: "🕌",
    chapters: [
      { id: "14.1", title: "অধ্যায়-০১: আকাইদ", pdfUrl: "https://drive.google.com/file/d/1iV0G0RuBdWo6cCvhp1LGuQEJ90xZAu_F/preview" },
      { id: "14.2", title: "অধ্যায়-০২: ইবাদত", pdfUrl: "https://drive.google.com/file/d/1icHly4n0dqWL5nqCBcKq7R2RdBuikVo_/preview" },
      { id: "14.3", title: "অধ্যায়-০৩: কুরআন ও হাদিস শিক্ষা", pdfUrl: "https://drive.google.com/file/d/1420QwPI_qR3HflJqdJDclux_sqAhFSoj/preview" },
      { id: "14.4", title: "অধ্যায়-০৪: আখলাক", pdfUrl: "https://drive.google.com/file/d/17T6elCVfVmX7WR8E_OmU-jTltaL1DEg2/preview" },
      { id: "14.5", title: "অধ্যায়-০৫: আদর্শ জীবনচরিত", pdfUrl: "https://drive.google.com/file/d/1kc3VPdFcCs2s_OLzJsm5INA2u3vrHDz3/preview" }
    ],
    altChapters: [
      { id: "A14.1", title: "অধ্যায়-০১: আকাইদ", pdfUrl: "" },
      { id: "A14.2", title: "অধ্যায়-০২: ইবাদত", pdfUrl: "" },
      { id: "A14.3", title: "অধ্যায়-০৩: কুরআন ও হাদিস শিক্ষা", pdfUrl: "" },
      { id: "A14.4", title: "অধ্যায়-০৪: আখলাক", pdfUrl: "" },
      { id: "A14.5", title: "অধ্যায়-০৫: আদর্শ জীবনচরিত", pdfUrl: "" }
    ]
  },
  "15": {
    id: "15",
    name: "হিন্দুধর্ম শিক্ষা",
    icon: "🕉️",
    chapters: [
        { id: "15.1", title: "ঈশ্বরের স্বরূপ", pdfUrl: "https://drive.google.com/file/d/1NFx8qDITqT-yBAVglKGsjl8EzPDtSnOr/preview" },
        { id: "15.2", title: "ধর্মগ্রন্থ", pdfUrl: "https://drive.google.com/file/d/1WL-xaxSuL4YnKEgRHCjAWVtIP2jety6-/preview" },
        { id: "15.3", title: "হিন্দুধর্মের স্বরূপ ও বিশ্বাস", pdfUrl: "https://drive.google.com/file/d/1LxwsMS2OU1L0YonerQIOwJTlHA2q3IRm/preview" },
        { id: "15.4", title: "নিত্যকর্ম ও যোগাসন", pdfUrl: "https://drive.google.com/file/d/1enPlHOAKBrizFZUgL-nAmY1QiDxYmbC-/preview" },
        { id: "15.5", title: "দেব-দেবী ও পূজা-পার্বণ", pdfUrl: "https://drive.google.com/file/d/16WoCw9r9h3W8e-VHRUjOZelQaFr_7nmY/preview" },
        { id: "15.6", title: "ধর্মীয় উপাখ্যানে নৈতিক শিক্ষা", pdfUrl: "https://drive.google.com/file/d/1ABXKySkiWvUSgu024rp6aH4tiA52DmhG/preview" },
        { id: "15.7", title: "আদর্শ জীবনচরিত", pdfUrl: "https://drive.google.com/file/d/12_DLHyd41bekKrlByjK9TszvCMsPbx4K/preview" },
        { id: "15.8", title: "হিন্দুধর্ম ও নৈতিক মূল্যবোধ", pdfUrl: "https://drive.google.com/file/d/1fhM5oPJjEeIan8s3PvGtR7xdL6ijjJGp/preview" },
        { id: "15.9", title: "মডেল টেস্ট", pdfUrl: "https://drive.google.com/file/d/1IVyr6KffJU2bm-WdqDLTKRA4baxOSb5p/preview" }
    ],
    altChapters: [
        { id: "A15.1", title: "ঈশ্বরের স্বরূপ", pdfUrl: "" },
        { id: "A15.2", title: "ধর্মগ্রন্থ", pdfUrl: "" },
        { id: "A15.3", title: "হিন্দুধর্মের স্বরূপ ও বিশ্বাস", pdfUrl: "" },
        { id: "A15.4", title: "নিত্যকর্ম ও যোগাসন", pdfUrl: "" },
        { id: "A15.5", title: "দেব-দেবী ও পূজা-পার্বণ", pdfUrl: "" },
        { id: "A15.7", title: "আদর্শ জীবনচরিত", pdfUrl: "" },
        { id: "A15.8", title: "হিন্দুধর্ম ও নৈতিক মূল্যবোধ", pdfUrl: "" },
        { id: "A15.9", title: "মডেল টেস্ট", pdfUrl: "" }
    ]
  }
};
