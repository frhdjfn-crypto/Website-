import type { Book, Download } from "@/lib/types"
import { fileScanner } from "./file-scanner"

export const booksData: Book[] = [
  {
    id: 1,
    title: "الخيميائي",
    author: "باولو كويلو",
    category: "رواية",
    rating: 4.5,
    year: 1988,
    pages: 163,
    language: "العربية",
    description:
      "رواية تحكي قصة شاب راعي أغنام إسباني قرر السفر بحثًا عن حلمه وكنزه الشخصي، وتتناول موضوعات الحلم والمصير والحب. تعتبر من أشهر الروايات في الأدب المعاصر وقد ترجمت إلى أكثر من 80 لغة حول العالم.",
    downloadUrl: "/books/pdf/الخيميائي.pdf",
    fileSize: "2.1 MB",
    format: "PDF",
    downloadCount: 15420,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    comments: [
      { text: "رواية رائعة تغير نظرة الإنسان للحياة والأحلام!", author: "أحمد", date: "2024-01-15" },
      { text: "قرأتها عدة مرات وفي كل مرة أكتشف معاني جديدة.", author: "سارة", date: "2024-01-10" },
    ],
    addedDate: "2024-01-03",
  },
  {
    id: 2,
    title: "العادات السبع",
    author: "ستيفن كوفي",
    category: "تنمية بشرية",
    rating: 4.0,
    year: 1989,
    pages: 381,
    language: "العربية",
    description:
      "كتاب في التنمية البشرية يقدم سبع عادات فعالة تساعد على النجاح في الحياة الشخصية والمهنية. يركز الكتاب على تطوير الشخصية من الداخل وبناء علاقات قوية مع الآخرين.",
    downloadUrl: "/books/pdf/العادات_السبع.pdf",
    fileSize: "3.5 MB",
    format: "PDF",
    downloadCount: 12890,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780743269513-L.jpg",
    comments: [{ text: "كتاب ممتاز يغير طريقة التفكير والتعامل مع الآخرين.", author: "محمد", date: "2024-01-12" }],
    addedDate: "2024-01-05",
  },
  {
    id: 30,
    title: "قوة العادات",
    author: "تشارلز دويج",
    category: "تنمية بشرية",
    rating: 4.2,
    year: 2012,
    pages: 371,
    language: "العربية",
    description:
      "يشرح الكتاب كيف تتشكل العادات وكيف يمكن تغييرها لتحسين الحياة الشخصية والمهنية. كتاب عملي مليء بالأمثلة الواقعية والاستراتيجيات المجربة.",
    downloadUrl: "/books/قوة العادات_41565_Foulabook.com_.pdf",
    fileSize: "4.2 MB",
    format: "PDF",
    downloadCount: 8950,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg",
    comments: [
      { text: "كتاب رائع ومفيد جداً في تطوير العادات الإيجابية", author: "سارة", date: "2024-02-28" },
      { text: "أسلوب سهل ومفهوم مع أمثلة عملية", author: "أحمد", date: "2024-02-27" },
    ],
    addedDate: "2024-02-26",
  },
  {
    id: 31,
    title: "كتاب التوحيد",
    author: "محمد بن عبد الوهاب",
    category: "دين",
    rating: 4.8,
    year: 1758,
    pages: 156,
    language: "العربية",
    description:
      "كتاب أساسي في العقيدة الإسلامية، يشرح مفهوم التوحيد وأنواعه بأسلوب واضح ومبسط مع الأدلة من القرآن والسنة.",
    downloadUrl: "/books/كتاب_التوحيد.pdf",
    fileSize: "2.8 MB",
    format: "PDF",
    downloadCount: 12340,
    imageUrl: "/images/covers/kitab-tawheed.webp", // تحديث مسار الصورة
    comments: [
      { text: "كتاب مهم جداً لفهم أساسيات العقيدة الإسلامية", author: "عبدالله", date: "2024-02-28" },
      { text: "شرح واضح ومفصل مع الأدلة", author: "فاطمة", date: "2024-02-27" },
    ],
    addedDate: "2024-02-28",
  },
  {
    id: 3,
    title: "الإنسان العاقل",
    author: "يوفال نوح هراري",
    category: "تاريخ",
    rating: 4.8,
    year: 2011,
    pages: 443,
    language: "العربية",
    description:
      "كتاب يتناول تاريخ البشرية من العصر الحجري إلى العصر الحديث، ويشرح كيف تطور الإنسان وأصبح النوع المهيمن على الأرض.",
    downloadUrl: "/books/pdf/الإنسان_العاقل.pdf",
    fileSize: "4.2 MB",
    format: "PDF",
    downloadCount: 18750,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    comments: [{ text: "كتاب مذهل يفتح آفاق جديدة في فهم التاريخ البشري.", author: "فاطمة", date: "2024-01-08" }],
    addedDate: "2024-01-07",
  },
  {
    id: 5,
    title: "الرحيق المختوم",
    author: "صفي الرحمن المباركفوري",
    category: "سيرة",
    rating: 4.9,
    year: 1976,
    pages: 635,
    language: "العربية",
    description: "سيرة شاملة للنبي محمد صلى الله عليه وسلم، تتناول حياته من الولادة حتى الوفاة بأسلوب علمي موثق.",
    downloadUrl: "/books/pdf/الرحيق_المختوم.pdf",
    fileSize: "5.5 MB",
    format: "PDF",
    downloadCount: 22580,
    imageUrl: "https://i.imgur.com/8YzKQxL.jpg",
    comments: [
      { text: "أفضل كتاب في السيرة النبوية، مكتوب بأسلوب رائع ومفصل.", author: "عبدالله", date: "2024-01-03" },
    ],
    addedDate: "2024-01-11",
  },
  {
    id: 6,
    title: "مئة عام من العزلة",
    author: "غابرييل غارسيا ماركيز",
    category: "رواية",
    rating: 4.7,
    year: 1967,
    pages: 417,
    language: "العربية",
    description:
      "رواية ملحمية تحكي قصة عائلة بوينديا عبر سبعة أجيال في قرية ماكوندو الخيالية، وتعتبر من أعظم أعمال الأدب اللاتيني.",
    downloadUrl: "/books/pdf/مئة_عام_من_العزلة.pdf",
    fileSize: "4.0 MB",
    format: "PDF",
    downloadCount: 16920,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg",
    comments: [{ text: "رواية ساحرة تجمع بين الواقع والخيال بطريقة مذهلة.", author: "ليلى", date: "2024-01-20" }],
    addedDate: "2024-01-13",
  },
  {
    id: 7,
    title: "فكر تصبح غنياً",
    author: "نابليون هيل",
    category: "تنمية بشرية",
    rating: 4.3,
    year: 1937,
    pages: 320,
    language: "العربية",
    description: "كتاب كلاسيكي في مجال النجاح المالي والشخصي، يقدم مبادئ أساسية لتحقيق الثراء والنجاح.",
    downloadUrl: "/books/pdf/فكر_تصبح_غنياً_العربية.pdf",
    fileSize: "3.2 MB",
    format: "PDF",
    downloadCount: 14350,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg",
    comments: [{ text: "كتاب مؤثر جداً في تغيير طريقة التفكير حول المال والنجاح.", author: "خالد", date: "2024-01-18" }],
    addedDate: "2024-01-15",
  },
  {
    id: 8,
    title: "البداية والنهاية",
    author: "ابن كثير",
    category: "تاريخ",
    rating: 4.8,
    year: 1365,
    pages: 2400,
    language: "العربية",
    description: "موسوعة تاريخية شاملة تغطي تاريخ العالم من بداية الخلق حتى نهاية الزمان من منظور إسلامي.",
    downloadUrl: "/books/pdf/البداية_والنهاية.pdf",
    fileSize: "15.5 MB",
    format: "PDF",
    downloadCount: 20100,
    imageUrl: "https://i.imgur.com/9KzLmNx.jpg",
    comments: [{ text: "مرجع تاريخي لا غنى عنه لكل مهتم بالتاريخ الإسلامي.", author: "أحمد", date: "2024-01-16" }],
    addedDate: "2024-01-17",
  },
  {
    id: 9,
    title: "الأسود يليق بك",
    author: "أحلام مستغانمي",
    category: "رواية",
    rating: 4.2,
    year: 1993,
    pages: 350,
    language: "العربية",
    description: "رواية عربية معاصرة تتناول قصة حب معقدة على خلفية الأحداث السياسية في الجزائر.",
    downloadUrl: "/books/pdf/الأسود_يليق_بك.pdf",
    fileSize: "3.7 MB",
    format: "PDF",
    downloadCount: 13680,
    imageUrl: "https://i.imgur.com/7XzKmPx.jpg",
    comments: [{ text: "رواية مؤثرة تعكس الواقع العربي بصدق وجمال.", author: "نور", date: "2024-01-14" }],
    addedDate: "2024-01-19",
  },
  {
    id: 10,
    title: "الذكاء العاطفي",
    author: "دانييل جولمان",
    category: "علم نفس",
    rating: 4.4,
    year: 1995,
    pages: 352,
    language: "العربية",
    description: "كتاب رائد في مجال الذكاء العاطفي، يشرح أهمية فهم وإدارة المشاعر في النجاح الشخصي والمهني.",
    downloadUrl: "/books/pdf/الذكاء_العاطفي.pdf",
    fileSize: "3.9 MB",
    format: "PDF",
    downloadCount: 15020,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780553375060-L.jpg",
    comments: [{ text: "كتاب مهم جداً لفهم النفس البشرية والتعامل مع الآخرين.", author: "مريم", date: "2024-01-12" }],
    addedDate: "2024-01-21",
  },
  {
    id: 11,
    title: "تاريخ الطبري",
    author: "الطبري",
    category: "تاريخ",
    rating: 4.6,
    year: 915,
    pages: 1800,
    language: "العربية",
    description: "من أهم المصادر التاريخية الإسلامية، يغطي تاريخ العالم من بداية الخلق حتى عصر المؤلف.",
    downloadUrl: "/books/pdf/تاريخ_الطبري.pdf",
    fileSize: "12.0 MB",
    format: "PDF",
    downloadCount: 17450,
    imageUrl: "https://i.imgur.com/5KzNmQx.jpg",
    comments: [{ text: "مصدر تاريخي أساسي لا يمكن الاستغناء عنه.", author: "عبدالرحمن", date: "2024-01-10" }],
    addedDate: "2024-01-23",
  },
  {
    id: 12,
    title: "كيف تكسب الأصدقاء وتؤثر في الناس",
    author: "ديل كارنيجي",
    category: "تنمية بشرية",
    rating: 4.5,
    year: 1936,
    pages: 291,
    language: "العربية",
    description: "كتاب كلاسيكي في مجال العلاقات الإنسانية والتأثير الإيجابي، يقدم مبادئ عملية للتعامل مع الناس.",
    downloadUrl: "/books/pdf/كيف_تكسب_الأصدقاء_وتؤثر_في_الناس.pdf",
    fileSize: "3.0 MB",
    format: "PDF",
    downloadCount: 14890,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg",
    comments: [{ text: "كتاب عملي ومفيد جداً في تحسين العلاقات الشخصية والمهنية.", author: "سلمى", date: "2024-01-08" }],
    addedDate: "2024-01-25",
  },
  {
    id: 13,
    title: "1984",
    author: "جورج أورويل",
    category: "رواية",
    rating: 4.6,
    year: 1949,
    pages: 328,
    language: "العربية",
    description: "رواية ديستوبية تصور مجتمعاً شمولياً يراقب كل شيء، وتعتبر من أهم الأعمال الأدبية في القرن العشرين.",
    downloadUrl: "/books/pdf/1984.pdf",
    fileSize: "3.4 MB",
    format: "PDF",
    downloadCount: 16230,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg",
    comments: [{ text: "رواية مخيفة ومؤثرة تحذر من مخاطر الأنظمة الشمولية.", author: "يوسف", date: "2024-01-22" }],
    addedDate: "2024-01-27",
  },
  {
    id: 14,
    title: "الأسرار السبعة للفعالية الشخصية",
    author: "ستيفن كوفي",
    category: "تنمية بشرية",
    rating: 4.3,
    year: 1989,
    pages: 372,
    language: "العربية",
    description: "دليل شامل لتطوير الفعالية الشخصية والمهنية من خلال سبعة مبادئ أساسية.",
    downloadUrl: "/books/pdf/الأسرار_السبعة_لفعالية_الشخصية.pdf",
    fileSize: "3.6 MB",
    format: "PDF",
    downloadCount: 13950,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780743269513-L.jpg",
    comments: [{ text: "كتاب تحويلي حقاً، غير طريقة تفكيري في الحياة.", author: "هند", date: "2024-01-21" }],
    addedDate: "2024-01-29",
  },
  {
    id: 15,
    title: "تفسير ابن كثير",
    author: "ابن كثير",
    category: "دين",
    rating: 4.9,
    year: 1365,
    pages: 3200,
    language: "العربية",
    description: "من أشهر كتب التفسير في التراث الإسلامي، يفسر القرآن الكريم بأسلوب علمي مبسط.",
    downloadUrl: "/books/pdf/تفسير_ابن_كثير.pdf",
    fileSize: "18.0 MB",
    format: "PDF",
    downloadCount: 21470,
    imageUrl: "https://i.imgur.com/6KzPmRx.jpg",
    comments: [{ text: "مرجع أساسي لكل من يريد فهم القرآن الكريم.", author: "إبراهيم", date: "2024-01-20" }],
    addedDate: "2024-01-31",
  },
  {
    id: 16,
    title: "الأب الغني والأب الفقير",
    author: "روبرت كيوساكي",
    category: "اقتصاد",
    rating: 4.2,
    year: 1997,
    pages: 336,
    language: "العربية",
    description: "كتاب يعلم الذكاء المالي والاستثمار من خلال قصة شخصية مؤثرة.",
    downloadUrl: "/books/pdf/الأب_الغني_والأب_الفقير.pdf",
    fileSize: "3.5 MB",
    format: "PDF",
    downloadCount: 13120,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780446677462-L.jpg",
    comments: [{ text: "كتاب ممتاز لتعلم أساسيات الاستثمار والذكاء المالي.", author: "عمر", date: "2024-01-19" }],
    addedDate: "2024-02-02",
  },
  {
    id: 17,
    title: "مقدمة ابن خلدون",
    author: "ابن خلدون",
    category: "فلسفة",
    rating: 4.7,
    year: 1377,
    pages: 890,
    language: "العربية",
    description: "عمل رائد في علم الاجتماع والتاريخ، يحلل طبيعة المجتمعات البشرية وتطورها.",
    downloadUrl: "/books/pdf/مقدمة_ابن_خلدون.pdf",
    fileSize: "7.5 MB",
    format: "PDF",
    downloadCount: 19840,
    imageUrl: "https://i.imgur.com/4KzLmOx.jpg",
    comments: [{ text: "عمل عبقري يسبق عصره في فهم المجتمعات البشرية.", author: "زينب", date: "2024-01-18" }],
    addedDate: "2024-02-04",
  },
  {
    id: 18,
    title: "الجريمة والعقاب",
    author: "فيودور دوستويفسكي",
    category: "رواية",
    rating: 4.5,
    year: 1866,
    pages: 671,
    language: "العربية",
    description: "رواية نفسية عميقة تتناول قصة طالب فقير يرتكب جريمة قتل ويواجه عواقبها النفسية.",
    downloadUrl: "/books/pdf/الجريمة_والعقاب.pdf",
    fileSize: "5.8 MB",
    format: "PDF",
    downloadCount: 15790,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780486415871-L.jpg",
    comments: [{ text: "رواية عميقة تستكشف أعماق النفس البشرية.", author: "ريم", date: "2024-01-17" }],
    addedDate: "2024-02-06",
  },
  {
    id: 19,
    title: "تاريخ الحضارة الإسلامية",
    author: "جرجي زيدان",
    category: "تاريخ",
    rating: 4.4,
    year: 1902,
    pages: 1200,
    language: "العربية",
    description: "موسوعة شاملة عن تاريخ الحضارة الإسلامية من بداياتها حتى العصر الحديث.",
    downloadUrl: "/books/pdf/تاريخ_الحضارة_الإسلامية.pdf",
    fileSize: "9.0 MB",
    format: "PDF",
    downloadCount: 14260,
    imageUrl: "https://i.imgur.com/3KzNmPx.jpg",
    comments: [{ text: "مرجع ممتاز لفهم تاريخ الحضارة الإسلامية.", author: "حسام", date: "2024-01-16" }],
    addedDate: "2024-02-08",
  },
  {
    id: 20,
    title: "علم النفس الإيجابي",
    author: "مارتن سليجمان",
    category: "علم نفس",
    rating: 4.3,
    year: 2011,
    pages: 294,
    language: "العربية",
    description: "كتاب يركز على الجوانب الإيجابية في علم النفس وكيفية تحقيق السعادة والرفاهية.",
    downloadUrl: "/books/pdf/علم_النفس_الإيجابي.pdf",
    fileSize: "3.1 MB",
    format: "PDF",
    downloadCount: 13520,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781857883329-L.jpg",
    comments: [{ text: "كتاب ملهم يساعد على فهم أسرار السعادة الحقيقية.", author: "لينا", date: "2024-01-15" }],
    addedDate: "2024-02-10",
  },
  {
    id: 21,
    title: "الكيمياء العامة",
    author: "لينوس بولينغ",
    category: "علوم",
    rating: 4.1,
    year: 1947,
    pages: 992,
    language: "العربية",
    description: "كتاب أساسي في الكيمياء العامة، يغطي المبادئ الأساسية والتطبيقات العملية.",
    downloadUrl: "/books/pdf/الكيمياء_الأساسية.pdf",
    fileSize: "8.2 MB",
    format: "PDF",
    downloadCount: 12980,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780486656229-L.jpg",
    comments: [{ text: "مرجع ممتاز لطلاب الكيمياء والمهتمين بالعلوم.", author: "طارق", date: "2024-01-14" }],
    addedDate: "2024-02-12",
  },
  {
    id: 23,
    title: "الاقتصاد في عصر واحد",
    author: "هنري هازليت",
    category: "اقتصاد",
    rating: 4.0,
    year: 1946,
    pages: 218,
    language: "العربية",
    description: "مقدمة مبسطة لعلم الاقتصاد تشرح المبادئ الأساسية بطريقة سهلة ومفهومة.",
    downloadUrl: "/books/pdf/الاقتصاد_في_عصر_واحد.pdf",
    fileSize: "2.8 MB",
    format: "PDF",
    downloadCount: 12610,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780517548202-L.jpg",
    comments: [{ text: "كتاب ممتاز لفهم أساسيات الاقتصاد.", author: "كريم", date: "2024-01-12" }],
    addedDate: "2024-02-16",
  },
  {
    id: 24,
    title: "تكنولوجيا المعلومات",
    author: "بيل جيتس",
    category: "تكنولوجيا",
    rating: 4.2,
    year: 1995,
    pages: 316,
    language: "العربية",
    description: "نظرة على مستقبل التكنولوجيا وتأثيرها على المجتمع والاقتصاد.",
    downloadUrl: "/books/pdf/تكنولوجيا_المعلومات.pdf",
    fileSize: "3.3 MB",
    format: "PDF",
    downloadCount: 13070,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780670772063-L.jpg",
    comments: [{ text: "رؤية مستقبلية ثاقبة من رائد التكنولوجيا.", author: "سامي", date: "2024-01-11" }],
    addedDate: "2024-02-18",
  },
  {
    id: 25,
    title: "فن الحرب",
    author: "سون تزو",
    category: "فلسفة",
    rating: 4.4,
    year: -500,
    pages: 273,
    language: "العربية",
    description: "كتاب كلاسيكي في الاستراتيجية العسكرية والحياتية، يقدم حكماً عملية للنجاح.",
    downloadUrl: "/books/pdf/فن_الحرب.pdf",
    fileSize: "2.9 MB",
    format: "PDF",
    downloadCount: 14530,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780486425573-L.jpg",
    comments: [{ text: "حكم عملية تطبق في الحياة والعمل وليس فقط الحرب.", author: "ماجد", date: "2024-01-10" }],
    addedDate: "2024-02-20",
  },
  {
    id: 26,
    title: "السياسة",
    author: "أرسطو",
    category: "سياسة",
    rating: 4.3,
    year: -350,
    pages: 368,
    language: "العربية",
    description: "عمل فلسفي كلاسيكي يتناول طبيعة الدولة والحكم والمجتمع السياسي.",
    downloadUrl: "/books/pdf/السياسة.pdf",
    fileSize: "3.8 MB",
    format: "PDF",
    downloadCount: 13890,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780486414249-L.jpg",
    comments: [{ text: "أساس الفكر السياسي الغربي، عمل خالد عبر التاريخ.", author: "رانيا", date: "2024-01-09" }],
    addedDate: "2024-02-22",
  },
  {
    id: 27,
    title: "حياة الصحابة",
    author: "محمد يوسف الكاندهلوي",
    category: "سيرة",
    rating: 4.8,
    year: 1959,
    pages: 1800,
    language: "العربية",
    description: "موسوعة شاملة عن حياة صحابة رسول الله وسيرهم العطرة.",
    downloadUrl: "/books/pdf/حياة_الصحابا.pdf",
    fileSize: "11.5 MB",
    format: "PDF",
    downloadCount: 20710,
    imageUrl: "https://i.imgur.com/2KzLmNx.jpg",
    comments: [{ text: "كتاب مؤثر يعرض نماذج رائعة من الصحابة الكرام.", author: "عائشة", date: "2024-01-08" }],
    addedDate: "2024-02-24",
  },
  {
    id: 28,
    title: "الفيزياء الحديثة",
    author: "ألبرت أينشتاين",
    category: "علوم",
    rating: 4.5,
    year: 1905,
    pages: 456,
    language: "العربية",
    description: "مقدمة في الفيزياء الحديثة ونظرية النسبية وتطبيقاتها.",
    downloadUrl: "/books/pdf/الفيزياء_الحديثة.pdf",
    fileSize: "4.6 MB",
    format: "PDF",
    downloadCount: 15370,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780486251523-L.jpg",
    comments: [{ text: "كتاب معقد لكنه يفتح آفاق جديدة في فهم الكون.", author: "أسامة", date: "2024-01-07" }],
    addedDate: "2024-02-26",
  },
]

// تسجيل الملفات الموجودة فعلياً في مجلد public/books
export function initializeFileSystem(): void {
  // تسجيل الملفات الموجودة فعلياً
  fileScanner.registerFile(30, "قوة العادات", "تشارلز دويج", "/books/قوة العادات_41565_Foulabook.com_.pdf")
  fileScanner.registerFile(31, "كتاب التوحيد", "محمد بن عبد الوهاب", "/books/كتاب_التوحيد.pdf")

  // يمكن إضافة المزيد من الملفات هنا عند رفعها
}

// دالة للحصول على أحدث الكتب المتاحة فعلياً
export async function getNewestAvailableBooks(limit = 10): Promise<Book[]> {
  // فحص الملفات المتاحة
  await fileScanner.scanAllFiles()

  // الحصول على الملفات الحديثة
  const recentFiles = fileScanner.getRecentFiles(30)

  // ربط الملفات بالكتب
  const availableBooks = booksData.filter((book) => {
    return recentFiles.some((file) => file.id === book.id)
  })

  // ترتيب حسب تاريخ الإضافة
  return availableBooks
    .sort((a, b) => {
      const dateA = new Date(a.addedDate || "2024-01-01")
      const dateB = new Date(b.addedDate || "2024-01-01")
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

// دالة للحصول على أحدث الكتب (النسخة القديمة للتوافق)
export function getNewestBooks(limit = 10): Book[] {
  return booksData
    .sort((a, b) => {
      const dateA = new Date(a.addedDate || "2024-01-01")
      const dateB = new Date(b.addedDate || "2024-01-01")
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

// دالة للتحقق من وجود الملف
export async function checkFileExists(url: string): Promise<boolean> {
  return await fileScanner.checkFileExists(url)
}

// دالة للحصول على إحصائيات الملفات
export function getFileStats() {
  return fileScanner.getStats()
}

// دالة لتحميل الكتاب
export function downloadBook(book: Book): void {
  if (book.downloadUrl) {
    // إنشاء رابط تحميل
    const link = document.createElement("a")
    link.href = book.downloadUrl
    link.download = `${book.title}.${book.format?.toLowerCase() || "pdf"}`
    link.target = "_blank"

    // تشغيل التحميل
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // إضافة إلى سجل التحميلات
    addToDownloadHistory({
      bookId: book.id,
      bookTitle: book.title,
      author: book.author,
      downloadDate: new Date().toISOString(),
      fileSize: book.fileSize || "0 MB",
      format: book.format || "PDF",
      status: "completed",
    })
  }
}

export function getBookById(id: number): Book | undefined {
  return booksData.find((book) => book.id === id)
}

export function getAllBooks(): Book[] {
  return booksData
}

export function getBooksByCategory(category: string): Book[] {
  return booksData.filter((book) => book.category === category)
}

export function getBooksByAuthor(author: string): Book[] {
  return booksData.filter((book) => book.author === author)
}

export function searchBooks(query: string): Book[] {
  const lowercaseQuery = query.toLowerCase()
  return booksData.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.category.toLowerCase().includes(lowercaseQuery),
  )
}

export function getCategories(): string[] {
  const categories = [...new Set(booksData.map((book) => book.category))]
  return categories.sort()
}

export function getAuthors(): string[] {
  const authors = [...new Set(booksData.map((book) => book.author))]
  return authors.sort()
}

export function addBook(book: Omit<Book, "id">): Book {
  const newId = Math.max(...booksData.map((b) => b.id)) + 1
  const newBook: Book = { ...book, id: newId }
  booksData.push(newBook)
  return newBook
}

export function getLibraryStats() {
  const totalBooks = booksData.length
  const categories = getCategories()
  const authors = getAuthors()
  const averageRating = booksData.reduce((sum, book) => sum + book.rating, 0) / totalBooks
  const totalPages = booksData.reduce((sum, book) => sum + (book.pages || 0), 0)

  return {
    totalBooks,
    totalCategories: categories.length,
    totalAuthors: authors.length,
    averageRating: Math.round(averageRating * 10) / 10,
    totalPages,
  }
}

export function getDownloadHistory(): Download[] {
  if (typeof window === "undefined") return []
  const history = localStorage.getItem("downloadHistory")
  return history ? JSON.parse(history) : []
}

export function addToDownloadHistory(download: Omit<Download, "id">): void {
  if (typeof window === "undefined") return
  const history = getDownloadHistory()
  const newDownload: Download = {
    ...download,
    id: Date.now().toString(),
  }
  history.unshift(newDownload)
  localStorage.setItem("downloadHistory", JSON.stringify(history.slice(0, 50)))
}

export function getDownloadStats() {
  const history = getDownloadHistory()
  const totalDownloads = history.length
  const totalSize = history.reduce((sum, download) => {
    const size = Number.parseFloat(download.fileSize.replace(" MB", ""))
    return sum + size
  }, 0)

  return {
    totalDownloads,
    totalSize: `${totalSize.toFixed(1)} MB`,
    successRate:
      history.length > 0
        ? ((history.filter((d) => d.status === "completed").length / history.length) * 100).toFixed(1)
        : "0",
  }
}
