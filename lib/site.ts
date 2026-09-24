/**
 * MB TECHNIC — single source of truth for all business content.
 *
 * EVERY FACT IN THIS FILE IS SOURCED. Nothing here is invented:
 *  - 2GIS business card 70000001103562456 (address, phones, hours, rating, rubrics,
 *    service attributes, photo set, customer reviews)
 *  - Instagram @mb_technic.kz (profile, captions, permalinks, extra media)
 *  - Client brief (positioning, brand name MB TECHNIC, Mercedes-Benz specialisation)
 *
 * Fields that could NOT be verified against a source are explicitly marked
 * `verified: false` and are NOT rendered as claims anywhere on the site.
 * See README.md → "Content integrity" for the full list.
 */

export const site = {
  brand: "MB TECHNIC",
  legalName: "Mb Technic",
  category: "СТО · премиальный сервис Mercedes-Benz",
  tagline: "Сервис Mercedes-Benz в Астане",
  positioning: "Специализированный сервис для владельцев Mercedes-Benz.",
  city: "Астана",
  country: "Казахстан",

  /* 2GIS: «Улица Аркайым, 7, Астана», Алматы район, ж/м Юго-Восток (правая сторона), Z00G5P4, 1 этаж */
  address: "улица Аркайым, 7",
  addressLine: "улица Аркайым, 7, Астана",
  addressFull: "Астана, улица Аркайым, 7 · Алматы район, ж/м Юго-Восток, 1 этаж",
  postalCode: "Z00G5P4",
  geo: { lat: 51.145083, lng: 71.501582 },
  nearestStop: "проспект Момышулы — 430 м",

  /* 2GIS: +7 700 706 22 20 и +7 771 149 24 99 (оба с WhatsApp) */
  phones: [
    { display: "+7 700 706 22 20", tel: "+77007062220", whatsapp: "77007062220" },
    { display: "+7 771 149 24 99", tel: "+77711492499", whatsapp: "77711492499" },
  ],
  primaryPhone: { display: "+7 700 706 22 20", tel: "+77007062220", whatsapp: "77007062220" },
  onlineChat: "http://jivo.chat/t3antKVsqg",

  /* 2GIS info tab: identical hours every day of the week */
  hours: "Ежедневно 09:00 — 19:00",
  hoursShort: "09:00 — 19:00",
  hoursNote: "Ежедневно, без выходных",

  /* 2GIS: 5.0 · 37 оценок · 14 отзывов (снято 23.09.2026) */
  rating: {
    value: 5.0,
    valueLabel: "5.0",
    ratings: 37,
    reviews: 14,
    source: "2ГИС",
    sourceUrl: "https://2gis.kz/astana/firm/70000001103562456",
    capturedAt: "23.09.2026",
  },

  links: {
    twoGis: "https://2gis.kz/astana/firm/70000001103562456",
    twoGisReviews: "https://2gis.kz/astana/firm/70000001103562456/tab/reviews",
    twoGisGallery: "https://2gis.kz/astana/gallery/firm/70000001103562456",
    twoGisRoute:
      "https://2gis.kz/astana/directions/points/%7C71.501582%2C51.145083%3B70000001103562456",
    instagram: "https://www.instagram.com/mb_technic.kz/",
    tiktok: "https://www.tiktok.com/@mbtechnic",
    mapEmbed:
      "https://www.openstreetmap.org/export/embed.html?bbox=71.496582%2C51.142083%2C71.506582%2C51.148083&layer=mapnik&marker=51.145083%2C71.501582",
  },

  instagram: {
    handle: "@mb_technic.kz",
    url: "https://www.instagram.com/mb_technic.kz/",
    /* Not rendered as a claim — present for admin/analytics context only. */
    followers: 1321,
    posts: 53,
    capturedAt: "23.09.2026",
  },
} as const;

/**
 * Unverified claims — deliberately NOT displayed.
 * The client brief asks for a "10+ лет опыта" badge but explicitly says to use it only
 * when the source confirms it. Neither 2GIS (card created 01.09.2025, no founding date)
 * nor Instagram states a founding year, so the badge is switched OFF.
 * Flip `verified: true` here (and nothing else) to publish it once the owner confirms.
 */
export const unverifiedClaims = {
  experienceYears: { value: "10+", label: "лет опыта", verified: false, source: null },
  warranty: { value: null, verified: false, source: null },
  certificates: { value: null, verified: false, source: null },
} as const;

export type ServiceItem = {
  no: string;
  title: string;
  summary: string;
  tags: string[];
  image: string;
  imageAlt: string;
  /* 2GIS rubric name this row is taken from */
  rubric: string;
};

/**
 * Services are the 2GIS rubric list for this firm (9 rubrics) plus the service
 * attributes published on the same card. Wording of tags = 2GIS wording.
 */
export const services: ServiceItem[] = [
  {
    no: "01",
    title: "Ремонт двигателя",
    summary:
      "Основной профиль сервиса по данным 2ГИС — ремонт бензиновых двигателей Mercedes-Benz.",
    tags: ["Шлифовка", "Расточка", "Гильзовка", "Опрессовка"],
    image: "/media/opt/owner-video-04.jpg",
    imageAlt: "Разобранный двигатель Mercedes-Benz V8 в сервисе MB TECHNIC",
    rubric: "Ремонт бензиновых двигателей",
  },
  {
    no: "02",
    title: "Ходовая часть",
    summary:
      "Диагностика и ремонт ходовой части — включая работы по пневмоподвеске и стойкам.",
    tags: ["Пневмоподвеска", "Ремонт стоек", "Диагностика"],
    image: "/media/opt/interior-06.jpg",
    imageAlt: "Mercedes-Benz на подъёмнике в рабочей зоне MB TECHNIC",
    rubric: "Ремонт ходовой части автомобиля",
  },
  {
    no: "03",
    title: "Тормозная система",
    summary: "Работы по тормозной системе, включая проточку тормозных дисков.",
    tags: ["Проточка тормозных дисков"],
    image: "/media/opt/interior-04.jpg",
    imageAlt: "Mercedes-Benz на подъёмнике: работы по тормозной системе",
    rubric: "Ремонт ходовой части автомобиля",
  },
  {
    no: "04",
    title: "Кузовной ремонт",
    summary: "Кузовные работы со сваркой — восстановление геометрии и элементов кузова.",
    tags: ["Сварочные работы"],
    image: "/media/opt/owner-video-02.jpg",
    imageAlt: "Кузовные элементы Mercedes-Benz перед покраской",
    rubric: "Кузовной ремонт",
  },
  {
    no: "05",
    title: "Компьютерная диагностика",
    summary:
      "Компьютерная диагностика перед ремонтом: сначала причина, затем объём работ.",
    tags: ["Диагностика", "Ремонт электронных систем"],
    image: "/media/opt/owner-video-10.jpg",
    imageAlt: "Диагностика и разборка узлов Mercedes-Benz в сервисе",
    rubric: "Компьютерная диагностика автомобилей",
  },
  {
    no: "06",
    title: "Ремонт АКПП",
    summary: "Диагностика и ремонт автоматических коробок передач.",
    tags: ["АКПП"],
    image: "/media/opt/owner-video-09.jpg",
    imageAlt: "Mercedes-Benz E-Класс в цеху MB TECHNIC",
    rubric: "Ремонт АКПП",
  },
  {
    no: "07",
    title: "Климатические системы",
    summary: "Обслуживание автомобильных климатических систем.",
    tags: ["Кондиционер", "Климат-контроль"],
    image: "/media/opt/interior-05.jpg",
    imageAlt: "Рабочая зона сервиса MB TECHNIC",
    rubric: "Обслуживание автомобильных климатических систем",
  },
  {
    no: "08",
    title: "Замена масла",
    summary: "Аппаратная замена масла и плановое техническое обслуживание.",
    tags: ["Аппаратная замена", "ТО"],
    image: "/media/opt/owner-02.jpg",
    imageAlt: "Моторное масло Yacco VX 1000 5W-40 для Mercedes-Benz",
    rubric: "Замена масла",
  },
];

export const advantages = [
  {
    no: "01",
    title: "Специализация на Mercedes-Benz",
    text: "Сервис работает с Mercedes-Benz: E-Класс, S-Класс, G-Класс, SUV и AMG-версии — это видно по автомобилям в цеху.",
  },
  {
    no: "02",
    title: "Диагностика перед ремонтом",
    text: "Сначала диагностика и причина неисправности, затем согласованный объём работ.",
  },
  {
    no: "03",
    title: "Честная диагностика",
    text: "Клиенты отмечают в 2ГИС, что причина указывается реальная, без замены исправных узлов.",
  },
  {
    no: "04",
    title: "Один адрес в Астане",
    text: "Сервис на улице Аркайым, 7 — в Алматинском районе, ж/м Юго-Восток.",
  },
];

export const processSteps = [
  {
    no: "01",
    title: "Запись",
    text: "Вы выбираете услугу, дату и время — онлайн на сайте либо по телефону.",
  },
  {
    no: "02",
    title: "Диагностика",
    text: "Специалисты определяют причину неисправности.",
  },
  {
    no: "03",
    title: "Согласование",
    text: "Обсуждаем необходимые работы и объём до начала ремонта.",
  },
  {
    no: "04",
    title: "Ремонт",
    text: "Выполняем согласованные работы.",
  },
  {
    no: "05",
    title: "Выдача",
    text: "Автомобиль готов к эксплуатации.",
  },
];

/**
 * Real customer reviews published on the 2GIS card (13 with visible author + text,
 * captured 23.09.2026). Text is reproduced verbatim; only line breaks are normalised.
 */
export type Review = {
  author: string;
  date: string;
  rating: number;
  text: string;
};

export const reviews: Review[] = [
  {
    author: "Explosive 01",
    date: "23 марта 2026",
    rating: 5,
    text: "Топовый сервис! Когда-то посоветовали Бакыджана, уже года три ремонтирую свои машины только у него, мужики знают своё дело и к каждой проблеме, по какой бы я не обратился подходят ответственно и не было такой проблемы которую бы они не могли решить, начиная от дворников, печки, мультимедийной системы, прошивки ЭБУ двигателя, заканчивая ходовой, заменой магистрали тормозной системы и капитальным ремонтом двигателя. 2 года назад делал капиталку после клина двигателя, тфай тфай, всё отлично работает до сих пор, расход масла просто ноль. Всем рекомендую!",
  },
  {
    author: "Городская легенда",
    date: "6 апреля 2026",
    rating: 5,
    text: "Была проблема с ГУР. Звенел. Думал предстоит замена насоса но пацаны без обмана указали реальную причину (сетка бачка). Пусть Аллах вознаградит за честный труд",
  },
  {
    author: "Берик Оралбаев",
    date: "1 апреля 2026",
    rating: 5,
    text: "Очень крутой сервис из всех которые я знаю. Мастер знает свое дело, все четко и не дорого, запчасти сразу найдут сами и поставят, в общем все круто",
  },
  {
    author: "D D",
    date: "1 марта 2026",
    rating: 5,
    text: "Опытный мастер своего дела. Если есть проблемы с Мерсами, рекомендую обращаться",
  },
  {
    author: "Диас Сабыркен",
    date: "5 июля 2026",
    rating: 5,
    text: "Нашли проблему, устранили, однозначно советую",
  },
  {
    author: "Ерлан Жакупов",
    date: "26 января 2026",
    rating: 5,
    text: "Жақсы специалистер",
  },
  {
    author: "Merey Rakhmetzhan",
    date: "31 января 2026",
    rating: 5,
    text: "Жақсы жігіттер. Проблемамды тауып берді. Қолдарың дерт көрмесін.",
  },
  {
    author: "Елдос Джуматов",
    date: "2 июля 2026",
    rating: 5,
    text: "Адал жұмыс атқаратын екен.",
  },
  {
    author: "Дина Куралова",
    date: "2 июля 2026",
    rating: 5,
    text: "Өз ісінің маманы, топ мастер",
  },
  {
    author: "Асылан Марат",
    date: "12 марта 2026",
    rating: 5,
    text: "Мастерлері жақсы, әдемі жасап берді",
  },
  {
    author: "Самат Жолболдиев",
    date: "30 июня 2026",
    rating: 5,
    text: "Супер",
  },
];

export const faq = [
  {
    q: "Вы специализируетесь только на Mercedes-Benz?",
    a: "Основной профиль сервиса по данным 2ГИС — ремонт бензиновых двигателей и обслуживание легковых автомобилей. В цеху и в публикациях сервиса — автомобили Mercedes-Benz: E-Класс, S-Класс, G-Класс, SUV и AMG.",
  },
  {
    q: "Сколько стоит ремонт?",
    a: "Прайс-лист на карточке 2ГИС не опубликован, поэтому мы не показываем цены на сайте. Стоимость определяется после диагностики и согласования объёма работ — уточните по телефону или в WhatsApp.",
  },
  {
    q: "Как записаться?",
    a: "Онлайн на этой странице: услуга → автомобиль → дата → время → контакты. Заявка сохраняется, и мы связываемся с вами для подтверждения. Либо по телефону и в WhatsApp.",
  },
  {
    q: "Сколько ждать подтверждения заявки?",
    a: "Мы связываемся по выбранному вами каналу связи в рабочее время сервиса: ежедневно с 09:00 до 19:00.",
  },
  {
    q: "Какие часы работы?",
    a: "Ежедневно с 09:00 до 19:00, без выходных. Данные с карточки 2ГИС.",
  },
  {
    q: "Где вы находитесь?",
    a: "Астана, улица Аркайым, 7 — Алматинский район, ж/м Юго-Восток (правая сторона), 1 этаж. Остановка «проспект Момышулы» — около 430 метров.",
  },
  {
    q: "Можно приехать на диагностику без записи?",
    a: "Запись занимает минуту и позволяет подготовить пост к вашему приезду, поэтому лучше записаться заранее — онлайн или по телефону.",
  },
];

/** Photo set — real MB TECHNIC media (2GIS card + Instagram). */
export type Media = { src: string; alt: string; w: number; h: number; tag: string };

export const gallery: Media[] = [
  { src: "/media/opt/owner-03.jpg", alt: "Mercedes-Benz E-Класс (W211) в цеху MB TECHNIC", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/owner-video-04.jpg", alt: "Двигатель Mercedes-Benz V8 после разборки", w: 1400, h: 1736, tag: "Двигатель" },
  { src: "/media/opt/owner-video-03.jpg", alt: "Решётка радиатора и оптика Mercedes-Benz", w: 1400, h: 1736, tag: "Детали" },
  { src: "/media/opt/user-01.jpg", alt: "Mercedes-Benz S-Класс (W221) на подъёмнике", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/owner-video-06.jpg", alt: "Работы на подъёмнике: тормозная система", w: 1400, h: 1736, tag: "Тормоза" },
  { src: "/media/opt/owner-video-01.jpg", alt: "Mercedes-Benz G-Класс в сервисе", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/interior-03.jpg", alt: "Сервисная зона MB TECHNIC: автомобили на подъёмниках", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/owner-02.jpg", alt: "Масло Yacco VX 1000 5W-40 — плановое ТО", w: 1400, h: 1736, tag: "ТО" },
  { src: "/media/opt/user-02.jpg", alt: "Mercedes-AMG с открытым капотом", w: 1400, h: 1736, tag: "Двигатель" },
  { src: "/media/opt/owner-video-02.jpg", alt: "Кузовные элементы Mercedes-Benz перед покраской", w: 1400, h: 2315, tag: "Кузов" },
  { src: "/media/opt/owner-04.jpg", alt: "Эмблема Mercedes-Benz в сервисе MB TECHNIC", w: 1400, h: 1736, tag: "Бренд" },
  { src: "/media/opt/exterior-01.jpg", alt: "Вывеска MB TECHNIC", w: 1400, h: 1736, tag: "Бренд" },
  { src: "/media/opt/owner-video-11.jpg", alt: "Mercedes-Benz S-Класс в сервисе", w: 1400, h: 2314, tag: "Сервис" },
  { src: "/media/opt/interior-01.jpg", alt: "Моторное масло Yacco для планового ТО", w: 1400, h: 1736, tag: "ТО" },
  { src: "/media/opt/owner-01.jpg", alt: "Mercedes-Benz E-Класс (W211) на подъёмнике", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/owner-video-08.jpg", alt: "Подготовка кузова Mercedes-Benz", w: 1400, h: 2315, tag: "Кузов" },
  { src: "/media/opt/user-06.jpg", alt: "Mercedes-Benz E-Класс у сервиса MB TECHNIC", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/owner-video-07.jpg", alt: "Mercedes-Benz ML в работе", w: 1400, h: 2314, tag: "Сервис" },
  { src: "/media/opt/owner-video-10.jpg", alt: "Ремонт двигателя: снятые узлы", w: 1400, h: 1736, tag: "Двигатель" },
  { src: "/media/opt/user-04.jpg", alt: "Mercedes-Benz E-Класс (W211): задняя часть", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/interior-06.jpg", alt: "Сервисная зона MB TECHNIC", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/exterior-02.jpg", alt: "Неоновая вывеска MB TECHNIC", w: 1400, h: 976, tag: "Бренд" },
  { src: "/media/opt/entrance-01.jpg", alt: "Mercedes-Benz E-Класс у входа в сервис", w: 1400, h: 1736, tag: "Сервис" },
  { src: "/media/opt/user-05.jpg", alt: "Mercedes-Benz E-Класс (W211) в цеху", w: 1400, h: 1736, tag: "Сервис" },
];

/** Real @mb_technic.kz posts — image, caption, permalink. */
export type InstagramPost = { src: string; caption: string; href: string };

export const instagramPosts: InstagramPost[] = [
  {
    src: "/media/instagram/ig-11.jpg",
    caption: "Mercedes-Benz E-Класс (W211) у сервиса",
    href: "https://www.instagram.com/mb_technic.kz/reel/DMvxKTfofcF/",
  },
  {
    src: "/media/instagram/ig-07.jpg",
    caption: "Дистроник в комплекте на W211 рестайлинг, и много ништяков",
    href: "https://www.instagram.com/mb_technic.kz/p/DNnUMVooScS/",
  },
  {
    src: "/media/instagram/ig-08.jpg",
    caption: "Эндоскопия",
    href: "https://www.instagram.com/mb_technic.kz/reel/DNRSObWIG4Y/",
  },
  {
    src: "/media/instagram/ig-05.jpg",
    caption: "Разборка и дефектовка двигателя",
    href: "https://www.instagram.com/mb_technic.kz/reel/DNvynsU0CRB/",
  },
  {
    src: "/media/instagram/ig-12.jpg",
    caption: "Сервисная зона MB TECHNIC",
    href: "https://www.instagram.com/mb_technic.kz/p/DOeav1UCP_c/",
  },
  {
    src: "/media/instagram/ig-06.jpg",
    caption: "Шторки оригинальные",
    href: "https://www.instagram.com/mb_technic.kz/p/DNnUmksoAJX/",
  },
  {
    src: "/media/instagram/ig-04.jpg",
    caption: "Рабочий день в сервисе",
    href: "https://www.instagram.com/mb_technic.kz/p/DMyZyQ7IT-p/",
  },
  {
    src: "/media/instagram/ig-09.jpg",
    caption: "Комплектующие для Mercedes-Benz",
    href: "https://www.instagram.com/mb_technic.kz/reel/DNOou0ho4xU/",
  },
  {
    src: "/media/instagram/ig-01.jpg",
    caption: "Разборка узлов",
    href: "https://www.instagram.com/mb_technic.kz/reel/DbIWyAJIKE3/",
  },
  {
    src: "/media/instagram/ig-03.jpg",
    caption: "Тест-драйв после ремонта",
    href: "https://www.instagram.com/mb_technic.kz/reel/DY23FraoHpr/",
  },
  {
    src: "/media/instagram/ig-10.jpg",
    caption: "Работы в цеху",
    href: "https://www.instagram.com/mb_technic.kz/p/DMvvzRhIvHO/",
  },
];

/** Mercedes-Benz model list for the booking form (public model range). */
export const mercedesModels = [
  "A-Класс",
  "B-Класс",
  "C-Класс (W202/W203/W204/W205/W206)",
  "E-Класс (W210/W211/W212/W213)",
  "S-Класс (W220/W221/W222/W223)",
  "CLA / CLS",
  "G-Класс",
  "GLA / GLB / GLC / GLE / GLS",
  "M-Класс / ML",
  "V-Класс / Vito",
  "SL / SLK / SLC",
  "AMG-версия",
  "Другая модель Mercedes-Benz",
];

export const serviceOptions = [
  "Плановое обслуживание",
  "Диагностика",
  "Ходовая часть",
  "Пневмоподвеска",
  "Тормозная система",
  "Двигатель",
  "Кузовной ремонт",
  "Ремонт АКПП",
  "Климатическая система",
  "Замена масла",
  "Другое",
];

export const contactChannels = ["Телефон", "WhatsApp", "Telegram"] as const;

export const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export const heroImage = {
  src: "/media/opt/owner-03.jpg",
  alt: "Mercedes-Benz E-Класс в цеху MB TECHNIC, улица Аркайым 7, Астана",
  w: 1400,
  h: 1736,
};
