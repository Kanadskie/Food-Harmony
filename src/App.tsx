import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import person from './assets/person.jpeg';
import healthy from './assets/healthy.jpeg';
import lifestyle from './assets/lifestyle.jpeg'
import logo from './assets/logo.svg';
import qr from './assets/qr.svg';

const navLinks = [
  { label: 'Философия', href: '#philosophy' },
  { label: 'Путь клиента', href: '#journey' },
  { label: 'Прайс', href: '#pricing' },
  { label: 'Отзывы', href: '#stories' },
  { label: 'Записаться', href: '#contact' },
];

const highlights = [
  {
    title: 'Осознанность',
    text: 'Настраиваем связь с телом: учим прислушиваться к сигналам и выбирать еду осознанно.',
  },
  {
    title: 'Индивидуальность',
    text: 'Каждый план — результат глубокого интервью, анализов и вашего темпа жизни.',
  },
  {
    title: 'Поддержка',
    text: 'Сопровождаем на каждом этапе, корректируем программу и вдохновляем действовать мягко.',
  },
  {
    title: 'Здоровое долголетие',
    text: 'Создаём устойчивые привычки, которые работают годами, а не неделями.',
  },
];

const stats = [
  { value: '1200+', label: 'разработанных программ' },
  { value: '4.9/5', label: 'уровень удовлетворённости' },
  { value: '45 дней', label: 'средний срок сопровождения' },
];

const steps = [
  {
    title: 'Глубокое знакомство',
    text: 'Интервью, анализ образа жизни, привычек, целей и ограничений.',
  },
  {
    title: 'Научная диагностика',
    text: 'Читаем анализы, отслеживаем биомаркеры, подключаем врачей-партнёров.',
  },
  {
    title: 'Персональный план',
    text: 'Недельные меню, гибкая структура приёмов пищи, продуктовые подборки.',
  },
  {
    title: 'Поддержка и адаптация',
    text: 'Еженедельная связь, коррекции, чаты-вдохновители и апдейты плана.',
  },
];

const testimonials = [
  {
    quote:
      'Food Harmony помогли мне перестать жить в качелях и обрести стабильную энергию. Команда слышит и поддерживает, а меню не хочется нарушать.',
    author: 'Анна, 36 лет',
  },
  {
    quote:
      'После двух месяцев программы нормализовал сон и вес, научился есть вне дома без стресса. Это не диета, а новый стиль жизни.',
    author: 'Михаил, 42 года',
  },
  {
    quote:
      'Работа с Анной изменила мое отношение к еде. Теперь я понимаю, что ем и зачем. Энергия стабильная, настроение ровное, вес пришел в норму естественным образом.',
    author: 'Елена, 38 лет',
  },
  {
    quote:
      'Программа "Глубокая проработка" помогла решить проблемы с пищеварением, которые мучили меня годами. Подход научный, рекомендации работают.',
    author: 'Дмитрий, 45 лет',
  },
  {
    title: 'Особенно ценю индивидуальный подход',
    quote: 'Мой план учитывает мой график, путешествия и даже праздники. Никаких жестких ограничений, только понимание своего тела.',
    author: 'Мария, 41 год',
  },
  {
    quote:
      'Детокс-программа FMD стала для меня открытием. Легко, эффективно, без голода. Чувствую себя обновленной и полной сил.',
    author: 'Ольга, 35 лет',
  },
];

const faqs = [
  {
    q: 'С чего начинается сотрудничество?',
    a: 'Мы проводим онлайн-встречу, собираем анамнез, изучаем анализы и образ жизни. Далее формируем гипотезы и создаём роудмап изменений.',
  },
  {
    q: 'Работаете ли вы с семьями?',
    a: 'Да, мы адаптируем меню под всех членов семьи, выделяя персональные ориентиры для каждого.',
  },
  {
    q: 'Нужны ли БАДы?',
    a: 'Только по показаниям. Основной фокус — на питании, сне и мягкой активности. Решения о добавках принимаются вместе с врачом.',
  },
];

const consultations = [
  {
    title: 'Первичная консультация',
    duration: '60–75 мин',
    price: '4 000 ₽',
    features: [
      'анализ рациона и образа жизни',
      'разбор жалоб и целей',
      'оценку пищевого поведения',
      'рекомендации по питанию',
      'план первичной коррекции (питание + режим + нутритивная поддержка)',
    ],
  },
  {
    title: 'Повторная консультация',
    duration: '40–50 мин',
    price: '2 500 ₽',
    features: [
      'анализ динамики',
      'корректировку плана питания',
      'подбор добавок (по необходимости)',
      'ответы на вопросы, поддержка',
    ],
  },
];

const programs = [
  {
    title: '«Рестарт»',
    duration: '2 недели',
    price: '10 000 ₽',
    features: [
      'индивидуальный план питания',
      'расшифровка лабораторных анализов',
      'рекомендации по режиму',
      '2 онлайн-связи для корректировок',
      'чат-поддержка',
    ],
  },
  {
    title: '«Лёгкость и стройность»',
    duration: '1 месяц',
    price: '20 000 ₽',
    accent: true,
    features: [
      'персональная программа питания',
      'подбор нутритивной поддержки',
      'расшифровка лабораторных анализов',
      '4 онлайн-связи для корректировок',
      'еженедельные корректировки',
      'сопровождение в чате',
    ],
  },
  {
    title: '«Глубокая проработка»',
    duration: '2 месяца',
    price: '30 000 ₽',
    features: [
      'коррекция пищевого поведения',
      'расшифровка лабораторных анализов',
      'оптимизация ЖКТ',
      'уменьшение воспаления',
      'детальный план питания',
      '5 онлайн-связей для корректировок',
      'чат-сопровождение (ежедневно)',
    ],
  },
];

const additionalServices = [
  {
    title: 'Анализ текущего рациона',
    price: '2 000 ₽',
    description: 'Подробный разбор меню на 3 дня, рекомендации по улучшению.',
  },
  {
    title: 'Расшифровка лабораторных анализов',
    price: '3 000 ₽',
    description: 'Подробное описание выявленных дефицитов по витаминам и минералам, информация на что обратить внимание.',
  },
  {
    title: 'Подбор нутрицевтиков',
    price: '1 500 ₽',
    description: 'Профессиональный подбор БАДов по цели и состоянию (без навязывания брендов).',
  },
];

const detoxProgram = {
  title: 'Авторская Detox-программа FMD',
  description: 'Основана на протоколе имитации голодания (Fasting Mimicking Diet)',
  duration: '2 недели',
  options: [
    { type: 'Групповая программа', price: '3 500 ₽' },
    { type: 'Индивидуальный формат', price: '6 500 ₽' },
  ],
};

type ContactForm = {
  name: string;
  email: string;
  goal: string;
  message: string;
};

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const baseTransition = {
  duration: 0.8,
  ease: easing,
};

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: baseTransition,
};

type Testimonial = {
  quote: string;
  author: string;
};

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth < 1024 ? 1 : 2);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const visibleItems = testimonials.slice(currentIndex, currentIndex + itemsPerView);
  if (visibleItems.length < itemsPerView && currentIndex > 0) {
    visibleItems.push(...testimonials.slice(0, itemsPerView - visibleItems.length));
  }

  return (
    <div className="relative mt-8 overflow-hidden">
      <div className={`grid gap-4 ${itemsPerView === 2 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <AnimatePresence mode="wait">
          {visibleItems.map((item, idx) => (
            <motion.article
              key={`${currentIndex}-${item.author}-${idx}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-2xl border border-sage/20 bg-cream/40 p-4 shadow-md sm:rounded-3xl sm:p-6"
            >
              <p className="text-sm leading-relaxed text-charcoal/80 sm:text-base">"{item.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-charcoal sm:mt-6 sm:text-base">{item.author}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-center gap-2 sm:mt-6">
        {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index * itemsPerView)}
            className={`h-2 rounded-full transition ${
              Math.floor(currentIndex / itemsPerView) === index ? 'w-6 bg-sage' : 'w-2 bg-sage/30'
            }`}
            aria-label={`Перейти к отзывам ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
        window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const onSubmit = async (values: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.table(values);
    setStatus('success');
    reset();
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sage/25 blur-3xl" />
          <div className="absolute top-12 right-10 h-72 w-72 rounded-full bg-coral/15 blur-[120px]" />
        </div>

        <header className="fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-4 sm:py-5 lg:px-14">
          <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-cream/95 px-2 py-2 sm:px-4 sm:py-3 shadow-gentle backdrop-blur">
            <a href="#" className="flex items-center">
              <img
                src={logo}
                alt="Food Harmony"
                className="h-7 w-auto sm:h-12"
              />
            </a>
            <button
              type="button"
              className="rounded-full border border-sage px-2.5 py-1.5 text-[10px] font-semibold text-sage transition hover:bg-sage/10 sm:px-3 sm:py-2 sm:text-xs lg:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Переключить меню"
              aria-expanded={menuOpen}
            >
              {menuOpen ? 'Скрыть' : 'Меню'}
            </button>
            <ul className="hidden items-center gap-8 text-sm font-medium lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition hover:text-sage"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="hidden rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-sage lg:inline-block"
            >
              Начать путь
            </a>
          </nav>
          {menuOpen && (
            <div className="mx-auto mt-3 max-w-6xl rounded-3xl bg-cream/95 px-4 py-4 text-sm shadow-gentle lg:hidden">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex justify-between rounded-2xl bg-cream/70 px-4 py-3 font-medium text-charcoal transition hover:text-sage"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                      <span aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full rounded-full border border-coral px-6 py-3 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
                onClick={() => {
                  setMenuOpen(false);
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                type="button"
              >
                Записаться
              </button>
            </div>
          )}
        </header>

        <main className="pt-16 sm:pt-20">
          <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-3 py-8 sm:gap-10 sm:px-4 sm:py-12 lg:grid-cols-2 lg:px-14 lg:py-18">
            <motion.div {...sectionMotion}>
              <p className="text-[10px] uppercase tracking-[0.35em] text-sage sm:text-sm">
                Гармония тела • ума • энергии
              </p>
              <h1 className="mt-3 font-serif text-2xl leading-tight text-charcoal sm:mt-4 sm:text-4xl sm:leading-tight lg:text-6xl">
                Осознанное питание без жёстких правил и диет
              </h1>
              <p className="mt-4 text-sm text-charcoal/80 sm:mt-6 sm:text-lg">
                Мы превращаем сложные процессы в понятный ритуал заботы. Наши программы
                помогают поддерживать энергию, ясность и лёгкость в насыщенном графике.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                <a
                  href="#contact"
                  className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-sage sm:px-8 sm:py-3 sm:text-base"
                >
                  Получить план
                </a>
                <a
                  href="#journey"
                  className="rounded-full border border-charcoal/20 px-5 py-2 text-sm font-semibold text-charcoal transition hover:border-sage hover:text-sage sm:px-8 sm:py-3 sm:text-base"
                >
                  Как это работает
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-charcoal/70 sm:mt-10 sm:gap-8 sm:text-sm">
                {stats.map((item) => (
                  <div key={item.label}>
                    <p className="text-xl font-semibold text-sage sm:text-3xl">{item.value}</p>
                    <p className="text-[10px] sm:text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              {...sectionMotion}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sage/10 via-cream/95 to-coral/10 p-6 shadow-xl sm:rounded-3xl"
            >
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-sage/20 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-coral/20 blur-2xl" />
              <div className="relative z-10">
                <div className="mb-4 flex-shrink-0">
                  <img
                    src={person}
                    alt="Николаева Анна"
                    className="h-48 w-full rounded-xl object-cover shadow-lg sm:h-80 sm:rounded-2xl"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-serif text-2xl text-charcoal sm:text-3xl">Николаева Анна</h3>
                <p className="mt-1 text-sm font-medium text-sage sm:text-base">Дипломированный нутрициолог</p>
                <ul className="mt-4 space-y-2 text-sm text-charcoal/80 sm:mt-6 sm:space-y-3 sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sand" />
                    <span>Спикер научных конференций</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sand" />
                    <span>Автор детокс-программы на основе FMD-протокола</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sand" />
                    <span>Куратор проекта "Российское долголетие"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sand" />
                    <span>Автор и ведущий образовательных программ</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </section>

          <div id="philosophy" className="scroll-mt-10 sm:scroll-mt-14">
            <section className="bg-cream/70 py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-14">
                <motion.div {...sectionMotion} className="mb-8 grid gap-6 rounded-2xl bg-cream/95 p-6 shadow-lg sm:mb-12 sm:rounded-3xl sm:p-8 lg:grid-cols-2">
                  <div className="flex-shrink-0">
                    <img
                      src={healthy}
                      alt="Нутрициология"
                      className="h-full w-full rounded-xl object-cover sm:rounded-2xl"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-sand sm:text-sm">Философия</p>
                    <h2 className="mt-2 font-serif text-2xl text-charcoal sm:mt-3 sm:text-4xl">Зачем нужна нутрициология?</h2>
                    <p className="mt-3 text-sm text-charcoal/80 sm:mt-4 sm:text-base">
                      Нутрициология — это наука о питании и поддержке здоровья через правильный рацион, коррекцию образа жизни и подбор нутритивной поддержки. В связке с массажем результаты улучшаются:
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-charcoal/80 sm:mt-6 sm:space-y-2 sm:text-base">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-sage" />
                        <span>быстрее уходят отёки</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-sage" />
                        <span>уменьшается воспаление</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-sage" />
                        <span>ускоряется метаболизм и лимфодренаж</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-sage" />
                        <span>повышается энергия</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-sage" />
                        <span>стабилизируется вес</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                  {highlights.map((item, index) => (
                    <motion.article
                      key={item.title}
                      {...sectionMotion}
                      transition={{ ...sectionMotion.transition, delay: 0.1 * index }}
                      className="rounded-xl border border-sage/25 bg-cream/95 p-4 shadow-sm sm:rounded-2xl sm:p-6"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-sage sm:text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-2 break-words font-serif text-lg text-charcoal sm:mt-3 sm:text-xl">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-charcoal/80 sm:mt-3 sm:text-sm">
                        {item.text}
                      </p>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div id="journey" className="scroll-mt-10 sm:scroll-mt-14">
            <section className="bg-cream py-12 sm:py-16">
              <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 sm:px-6 lg:flex-row lg:items-stretch lg:gap-10 lg:px-14">
                <motion.div {...sectionMotion} className="lg:w-1/3 flex flex-col">
                  <div className="flex-grow">
                    <p className="text-xs uppercase tracking-[0.35em] text-sage sm:text-sm">Путь клиента</p>
                    <h2 className="mt-3 font-serif text-2xl text-charcoal sm:mt-4 sm:text-4xl">
                      Трансформация в четыре шага
                    </h2>
                    <p className="mt-3 text-sm text-charcoal/80 sm:mt-4 sm:text-base">
                      Мы строим поддерживающую систему вокруг вашей жизни: от кухни до графика
                      встреч и путешествий.
                    </p>
                  </div>
                  
                  <div className="mt-4 flex-shrink-0">
                    <img
                      src={lifestyle}
                      alt="Трансформация образа жизни"
                      className="w-full rounded-xl shadow-lg sm:rounded-2xl"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
                
                <div className="space-y-4 lg:w-2/3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      {...sectionMotion}
                      transition={{ ...sectionMotion.transition, delay: index * 0.07 }}
                      className="flex flex-col gap-3 rounded-2xl border border-cream/70 bg-cream/95 p-4 shadow-md sm:rounded-3xl sm:flex-row sm:items-start sm:gap-4 sm:p-6"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 font-semibold text-sage sm:h-12 sm:w-12">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-charcoal sm:text-2xl">{step.title}</h3>
                        <p className="mt-1 text-sm text-charcoal/70 sm:mt-2 sm:text-base">{step.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div id="pricing" className="scroll-mt-10 sm:scroll-mt-14">
            <section className="bg-cream/70 py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-14">
                <motion.div {...sectionMotion} className="text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-sand sm:text-sm">Прайс-лист</p>
                  <h2 className="mt-3 font-serif text-2xl text-charcoal sm:mt-4 sm:text-4xl">Услуги и программы</h2>
                </motion.div>

                <div className="mt-8 sm:mt-12">
                  <h3 className="mb-4 font-serif text-xl text-charcoal sm:mb-6 sm:text-2xl">Консультации</h3>
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                    {consultations.map((item, index) => (
                      <motion.article
                        key={item.title}
                        {...sectionMotion}
                        transition={{ ...sectionMotion.transition, delay: index * 0.1 }}
                        className="flex h-full flex-col rounded-2xl border border-sage/30 bg-cream/90 p-4 shadow-md sm:rounded-3xl sm:p-6"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between lg:flex-col lg:items-start lg:gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-lg leading-tight text-charcoal sm:text-xl lg:text-2xl lg:leading-tight lg:h-16 lg:flex lg:items-center">
                              {item.title}
                            </h4>
                            <p className="mt-1 text-xs text-charcoal/70 sm:text-sm lg:mt-2">{item.duration}</p>
                          </div>
                          <p className="text-2xl font-semibold text-coral whitespace-nowrap sm:text-3xl sm:mt-0 mt-2 lg:mt-0 lg:self-start">
                            {item.price}
                          </p>
                        </div>
                        <p className="mt-3 text-xs font-semibold text-sage sm:mt-4 sm:text-sm lg:mt-6">Включает:</p>
                        <ul className="mt-2 flex-grow space-y-1 text-xs text-charcoal/80 sm:mt-3 sm:space-y-2 sm:text-sm">
                          {item.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sage flex-shrink-0 sm:mt-1.5 sm:h-2 sm:w-2" />
                              <span className="break-words">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <a
                          href="#contact"
                          className="mt-4 inline-flex items-center justify-center rounded-full border border-charcoal/20 bg-cream px-4 py-2 text-xs font-semibold text-charcoal transition hover:border-sage hover:text-sage sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
                        >
                          Записаться
                        </a>
                      </motion.article>
                    ))}
                  </div>
                </div>

                <div className="mt-8 sm:mt-12">
                  <h3 className="mb-4 font-serif text-xl text-charcoal sm:mb-6 sm:text-2xl">Программы сопровождения</h3>
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    {programs.map((program, index) => (
                      <motion.article
                        key={program.title}
                        {...sectionMotion}
                        transition={{ ...sectionMotion.transition, delay: index * 0.1 }}
                        className={`flex h-full flex-col rounded-2xl border ${
                          program.accent ? 'border-coral bg-cream' : 'border-sage/30 bg-cream/90'
                        } p-4 shadow-md sm:rounded-3xl sm:p-6`}
                      >
                        <div className="flex min-h-[60px] items-start justify-between sm:min-h-[80px]">
                          <div className="flex-1">
                            <h4 className="font-serif text-xl text-charcoal sm:text-2xl">{program.title}</h4>
                            <p className="mt-1 text-xs text-charcoal/70 sm:text-sm">{program.duration}</p>
                          </div>
                        </div>
                        <p className="mt-3 min-h-[40px] text-2xl font-semibold text-coral sm:mt-4 sm:min-h-[48px] sm:text-3xl">{program.price}</p>
                        <ul className="mt-4 flex-grow space-y-1 text-xs text-charcoal/80 sm:mt-6 sm:space-y-2 sm:text-sm">
                          {program.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand sm:mt-1.5 sm:h-2 sm:w-2" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <a
                          href="#contact"
                          className={`mt-6 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition sm:mt-8 sm:px-6 sm:py-3 sm:text-sm ${
                            program.accent
                              ? 'bg-coral text-white hover:bg-sage'
                              : 'border border-charcoal/20 text-charcoal hover:border-sage hover:text-sage'
                          }`}
                        >
                          Записаться
                        </a>
                      </motion.article>
                    ))}
                  </div>
                </div>

                <div className="mt-8 sm:mt-12">
                  <h3 className="mb-4 font-serif text-xl text-charcoal sm:mb-6 sm:text-2xl">Дополнительные услуги</h3>
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    {additionalServices.map((service, index) => (
                      <motion.article
                        key={service.title}
                        {...sectionMotion}
                        transition={{ ...sectionMotion.transition, delay: index * 0.1 }}
                        className="flex h-full flex-col rounded-2xl border border-sage/30 bg-cream/90 p-4 shadow-md sm:rounded-3xl sm:p-6"
                      >
                        <h4 className="min-h-[48px] font-serif text-lg text-charcoal sm:min-h-[56px] sm:text-xl">{service.title}</h4>
                        <p className="mt-2 min-h-[40px] text-xl font-semibold text-coral sm:mt-3 sm:min-h-[48px] sm:text-2xl">{service.price}</p>
                        <p className="mt-2 flex-grow text-xs text-charcoal/80 sm:mt-3 sm:text-sm">{service.description}</p>
                        <a
                          href="#contact"
                          className="mt-4 inline-flex items-center justify-center rounded-full border border-charcoal/20 bg-cream px-4 py-2 text-xs font-semibold text-charcoal transition hover:border-sage hover:text-sage sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
                        >
                          Записаться
                        </a>
                      </motion.article>
                    ))}
                  </div>
                </div>

                <motion.div
                  {...sectionMotion}
                  className="relative mt-8 overflow-hidden rounded-2xl border-2 border-coral/40 bg-gradient-to-br from-coral/10 via-cream to-sage/10 p-6 shadow-xl sm:mt-12 sm:rounded-3xl sm:p-8"
                >
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-coral/20 blur-2xl sm:-right-20 sm:-top-20 sm:h-40 sm:w-40 sm:blur-3xl" />
                  <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-sage/20 blur-2xl sm:-bottom-20 sm:-left-20 sm:h-40 sm:w-40 sm:blur-3xl" />
                  <div className="relative z-10">
                    <p className="mb-3 text-xs uppercase tracking-[0.35em] text-coral sm:mb-4 sm:text-sm">Специальное предложение</p>
                    <h3 className="font-serif text-2xl text-charcoal sm:text-3xl">{detoxProgram.title}</h3>
                    <p className="mt-2 text-sm font-medium text-charcoal/90 sm:mt-3 sm:text-base">{detoxProgram.description}</p>
                    <p className="mt-1 text-xs font-semibold text-sage sm:mt-2 sm:text-sm">{detoxProgram.duration}</p>
                    <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                      {detoxProgram.options.map((option) => (
                        <div
                          key={option.type}
                          className="rounded-xl border-2 border-coral/30 bg-cream/80 p-4 shadow-md transition-colors duration-200 hover:border-coral/50 hover:shadow-lg sm:rounded-2xl sm:p-5"
                        >
                          <p className="text-sm font-semibold text-charcoal sm:text-base">{option.type}</p>
                          <p className="mt-2 text-2xl font-bold text-coral sm:mt-3 sm:text-3xl">{option.price}</p>
                        </div>
                      ))}
                    </div>
                    <a
                      href="#contact"
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-sage hover:shadow-xl sm:mt-8 sm:px-8 sm:py-4 sm:text-base"
                    >
                      Записаться на программу
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>
          </div>

          <div id="stories" className="scroll-mt-10 sm:scroll-mt-14">
            <section className="bg-cream py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-3 lg:px-14">
                <motion.div {...sectionMotion} className="text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-sage sm:text-sm">Истории</p>
                  <h2 className="mt-3 font-serif text-2xl text-charcoal sm:mt-4 sm:text-4xl">
                    «Энергия для активной жизни» - говорят клиенты
                  </h2>
                </motion.div>
                <TestimonialsCarousel testimonials={testimonials} />
              </div>
            </section>
          </div>

          <div id="request" className="scroll-mt-10 sm:scroll-mt-14">
            <section className="bg-cream/70 py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-14">
                <motion.div {...sectionMotion} className="grid gap-8 lg:grid-cols-2">
                  {/* Форма */}
                  <div className="rounded-2xl bg-cream/95 p-6 shadow-lg sm:rounded-3xl sm:p-8">
                    <p className="text-xs uppercase tracking-[0.35em] text-sand sm:text-sm">Запрос</p>
                    <h2 className="mt-2 font-serif text-2xl text-charcoal sm:mt-3 sm:text-4xl">Расскажите о цели</h2>
                    <p className="mt-3 text-sm text-charcoal/80 sm:mt-4 sm:text-base">
                      Мы ответим в течение рабочего дня и предложим формат, который подойдёт именно вам.
                    </p>
                    <form className="mt-4 space-y-4 sm:mt-6 sm:space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div>
                        <label className="text-xs font-semibold sm:text-sm">Имя</label>
                        <input
                          aria-label="Имя"
                          className="mt-1 w-full rounded-xl border border-charcoal/15 bg-cream/60 px-3 py-2 text-sm focus:border-sage focus:outline-none sm:mt-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
                          {...register('name', { required: 'Введите имя' })}
                          type="text"
                          placeholder=""
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-coral sm:text-sm">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold sm:text-sm">Email</label>
                        <input
                          aria-label="Email"
                          className="mt-1 w-full rounded-xl border border-charcoal/15 bg-cream/60 px-3 py-2 text-sm focus:border-sage focus:outline-none sm:mt-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
                          type="email"
                          placeholder="your@email.com"
                          {...register('email', {
                            required: 'Укажите email',
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Проверьте формат' },
                          })}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-coral sm:text-sm">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold sm:text-sm">Цель</label>
                        <select
                          aria-label="Цель программы"
                          className="mt-1 w-full rounded-xl border border-charcoal/15 bg-cream/60 px-3 py-2 text-sm focus:border-sage focus:outline-none sm:mt-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
                          {...register('goal', { required: 'Выберите цель' })}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Выберите направление
                          </option>
                          <option value="energy">Энергия и ясность</option>
                          <option value="digestion">Комфорт пищеварения</option>
                          <option value="longevity">Здоровое долголетие</option>
                          <option value="other">Другое</option>
                        </select>
                        {errors.goal && (
                          <p className="mt-1 text-xs text-coral sm:text-sm">{errors.goal.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold sm:text-sm">Что важно учесть?</label>
                        <textarea
                          aria-label="Сообщение"
                          className="mt-1 h-24 w-full rounded-xl border border-charcoal/15 bg-cream/60 px-3 py-2 text-sm focus:border-sage focus:outline-none sm:mt-2 sm:h-28 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
                          placeholder="Опишите образ жизни, привычки и ожидания"
                          {...register('message', { minLength: { value: 10, message: 'Расскажите чуть подробнее' } })}
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs text-coral sm:text-sm">{errors.message.message}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage disabled:cursor-not-allowed disabled:bg-coral/60 sm:px-6 sm:py-3 sm:text-base"
                      >
                        {isSubmitting ? 'Отправляем...' : 'Получить консультацию'}
                      </button>
                      {status === 'success' && (
                        <p className="text-center text-xs text-sage sm:text-sm">
                          Спасибо! Мы вернёмся с ответом в течение рабочего дня.
                        </p>
                      )}
                    </form>
                  </div>

                  {/* FAQ */}
                  <div className="rounded-2xl bg-cream/90 p-6 shadow-inner sm:rounded-3xl sm:p-8">
                    <p className="text-xs uppercase tracking-[0.35em] text-sage sm:text-sm">FAQ</p>
                    <h2 className="mt-2 font-serif text-2xl text-charcoal sm:mt-3 sm:text-4xl">Частые вопросы</h2>
                    <p className="mt-3 text-sm text-charcoal/80 sm:mt-4 sm:text-base">
                      Если вы не нашли ответ — напишите нам, и мы подготовим персональное решение.
                    </p>
                    <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                      {faqs.map((item, index) => (
                        <motion.details
                          key={item.q}
                          {...sectionMotion}
                          transition={{ ...sectionMotion.transition, delay: index * 0.1 }}
                          className="group rounded-2xl border border-charcoal/10 bg-cream/80 p-4 sm:rounded-3xl sm:p-6"
                        >
                          <summary className="cursor-pointer text-sm font-semibold text-charcoal sm:text-lg">
                            {item.q}
                          </summary>
                          <p className="mt-2 text-xs text-charcoal/80 sm:mt-3 sm:text-sm">{item.a}</p>
                        </motion.details>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </div>

          <div id="contact" className="scroll-mt-10 sm:scroll-mt-14">
            <section className="bg-cream py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-14">
                <motion.div {...sectionMotion} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sage/10 via-cream/95 to-coral/10 p-6 shadow-xl sm:rounded-3xl sm:p-8">
                  <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-sage/20 blur-xl sm:-right-16 sm:-top-16 sm:h-32 sm:w-32 sm:blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-coral/20 blur-xl sm:-bottom-16 sm:-left-16 sm:h-32 sm:w-32 sm:blur-2xl" />
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.35em] text-sand sm:text-sm">Контакты</p>
                    <h2 className="mt-2 font-serif text-2xl text-charcoal sm:mt-3 sm:text-4xl">Свяжитесь со мной</h2>
                    <p className="mt-3 text-sm text-charcoal/80 sm:mt-4 sm:text-base">
                      Выберите удобный способ связи.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                      <a
                        href="tel:+79257558859"
                        className="group rounded-xl border-2 border-sage/30 bg-cream/80 p-4 transition hover:border-sage hover:bg-cream hover:shadow-lg sm:rounded-2xl sm:p-6"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 transition group-hover:bg-sage/30 sm:mb-4 sm:h-12 sm:w-12">
                          <svg className="h-5 w-5 text-sage sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-charcoal sm:text-base">Телефон</p>
                        <p className="mt-1 text-base font-semibold text-coral group-hover:text-sage sm:mt-2 sm:text-lg">+7 (925) 755-88-59</p>
                      </a>
                      <a
                        href="https://wa.me/79257558859"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-xl border-2 border-sage/30 bg-cream/80 p-4 transition hover:border-sage hover:bg-cream hover:shadow-lg sm:rounded-2xl sm:p-6"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 transition group-hover:bg-sage/30 sm:mb-4 sm:h-12 sm:w-12">
                          <svg className="h-5 w-5 text-sage sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-charcoal sm:text-base">WhatsApp</p>
                        <p className="mt-1 text-base font-semibold text-coral group-hover:text-sage sm:mt-2 sm:text-lg">Написать в WhatsApp</p>
                      </a>
                      <a
                        href="https://t.me/Nutriciolog_Anatolevna"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-xl border-2 border-sage/30 bg-cream/80 p-4 transition hover:border-sage hover:bg-cream hover:shadow-lg sm:rounded-2xl sm:p-6"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 transition group-hover:bg-sage/30 sm:mb-4 sm:h-12 sm:w-12">
                          <svg className="h-5 w-5 text-sage sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-charcoal sm:text-base">Telegram</p>
                        <p className="mt-1 text-base font-semibold text-coral group-hover:text-sage sm:mt-2 sm:text-lg">Написать в Telegram</p>
                        <div className="mt-3 flex justify-start">
                          <img src={qr} alt="QR код" className="h-16 w-16 sm:h-20 sm:w-20" />
                        </div>
                      </a>
                      <div className="group rounded-xl border-2 border-sage/30 bg-cream/80 p-4 transition hover:border-sage hover:bg-cream hover:shadow-lg sm:rounded-2xl sm:p-6">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 transition group-hover:bg-sage/30 sm:mb-4 sm:h-12 sm:w-12">
                          <svg className="h-5 w-5 text-sage sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-charcoal sm:text-base">Часы работы</p>
                        <p className="mt-1 text-base font-semibold text-coral group-hover:text-sage sm:mt-2 sm:text-lg">9:00 - 21:00</p>
                        <p className="mt-1 text-xs text-charcoal/70 sm:text-sm">Ежедневно</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </div>

        </main>

        <footer className="bg-charcoal px-3 py-8 text-cream sm:px-6 sm:py-10 lg:px-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-xl sm:text-2xl">Food Harmony</p>
              <p className="text-xs text-cream/70 sm:text-sm">Гармония науки и образа жизни</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-cream/70 sm:gap-4 sm:text-sm">
              <a href="tel:+79257558859" className="flex items-center gap-1 hover:text-sand sm:gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +7 (925) 755-88-59
              </a>
              <a href="https://wa.me/79257558859" className="flex items-center gap-1 hover:text-sand sm:gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
              <a href="https://t.me/Nutriciolog_Anatolevna" className="flex items-center gap-1 hover:text-sand sm:gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram
              </a>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-6xl text-xs text-cream/50 sm:mt-6">
            © {new Date().getFullYear()} Food Harmony. Все права защищены. Устойчивый результат начинается с осознанного выбора.
          </p>
        </footer>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: showScrollTop ? 1 : 0, 
            scale: showScrollTop ? 1 : 0.8 
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-sage text-white shadow-lg transition-all duration-300 hover:bg-coral hover:shadow-xl sm:bottom-8 sm:right-8 sm:h-14 sm:w-14 ${
            showScrollTop ? 'cursor-pointer' : 'cursor-default pointer-events-none'
          }`}
          aria-label="Наверх"
        >
          <svg 
            className="h-6 w-6 sm:h-7 sm:w-7" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 15l7-7 7 7" 
            />
          </svg>
        </motion.button>

      </div>
    </div>
  );
}

export default App;