# Refinement: Math of Trust — v4 RU (Russian edition)

## State Mapping

Identical to `artifacts/comic-v4-en/refinement.md`. Both packets share
the same TLA+ model; the difference is the locale dimension (`"ru"` vs
`"en"`) which determines the panel SVG and the language of text within.

### Locale-driven mapping

| locale | panel SVG set | language | packets |
|---|---|---|---|
| `"en"` | `artifacts/comic-v4-en/implementation/*.svg` | English | v4-en |
| `"ru"` | `artifacts/comic-v4-ru/implementation/*.svg` | Russian | v4-ru |

`locale` is fixed for the entire read per `LocaleFixedInvariant`.

## Operation Mapping

| File | panelIndex | state (after) | palette | dims (v4) | beat |
|---|---|---|---|---|---|
| `01-looks-right.svg` | 0 | curious | blue | 1000×700 | confident |
| `02-ship-it.svg` | 1 | engaged | blue | 800×600 | triumphant |
| `03-the-clicks.svg` | 2 | curious | green | 800×600 | neutral |
| `04-the-bug.svg` | 3 | alarmed | red | 1200×900 | panicked |
| `05-alone.svg` | 4 | frustrated | red | 1000×700 | lonely |
| `06-the-mentor.svg` | 5 | hopeful | purple | 1000×700 | rescued |
| `07-the-model.svg` | 6 | hopeful | purple | 1000×700 | focused |
| `08-tlc-finds-it.svg` | 7 | enlightened | green | 1200×900 | triumphant |
| `09-fix-first.svg` | 8 | enlightened | green | 1000×700 | satisfied |
| `10-better-world.svg` | 9 | empowered | green | 1000×700 | grateful |
| `11-the-stamp.svg` | 10 | empowered | green | 800×600 | complete |

## Aesthetic Invariants — перевод

### Panel 01 — "Всё ОК" (confident, CHUCKLED)

- **Emotional beat**: Maya leans back in chair, slight smile.
- **Humor**: Stack Overflow логотип (`[SO]` на оранжевой наклейке) на
  рамке ноутбука. `// работает` в коде.
- **Caption**: «Пятница. 16:47. Maya собирается задеплоить диалог
  подтверждения оплаты.»
- **Maya**: «Компилируется. Тесты прошли. Деплоим.»

### Panel 02 — "Деплой!" (triumphant, CHUCKLED)

- **Emotional beat**: Maya triumphant, обе руки вверх — одна с
  кофе, другая указывает на ноутбук.
- **Humor**: красные «x» среди зелёных точек конфетти (предчувствие);
  часы `17:00 ⓘ` где `ⓘ` раскрывается в «Пятничный деплой».
- **Caption**: «17:00. Деплой завершён. Maya уходит на выходные.»
- **Maya**: «Залито в прод. До понедельника!»

### Panel 03 — "Клики" (neutral, CHUCKLED)

- **Emotional beat**: три пользователя с зелёными галочками.
- **Humor**: одна из полосок кода показывает `// у МЕНЯ работает`,
  другая `// бывает`.
- **Bottom**: «847 кликов. 847 подтверждений. 847 довольных
  пользователей.»

### Panel 04 — "Баг" (panicked, UNCERTAIN)

- **Emotional beat**: паника Maya, красные уведомления сверху.
- **No humor**: UNCERTAIN.
- **Maya**: «Как?! Тесты прошли. Ревью чистое. ОТКУДА это взялось?!»

### Panel 05 — "Одна" (lonely, UNCERTAIN)

- **Emotional beat**: Maya одна, лампа, красное свечение экрана.
- **No humor**: UNCERTAIN.
- **Maya**: «Что-то не так. Не могу понять что.»

### Panel 06 — "Ментор" (rescued, READING)

- **Emotional beat**: Формалист с планшетом, Maya наклоняется.
- **Humor (gentle)**: `♥ TLA+` иконка на планшете.
- **Maya**: «Можно доказать, что такого не случится. До деплоя.»

### Panel 07 — "Модель" (focused, CHUCKLED)

- **Emotional beat**: Maya в профиль, два монитора.
- **Humor**: в коде `// пожалуйста, работай, пожалуйста, работай`,
  `// в крайнем случае: // загуглить`.
- **Maya**: «Если state = 'confirming', пользователь не сможет
  кликнуть снова... да?»

### Panel 08 — "TLC Находит Баг" (triumphant, DEEPLY_FOCUSED)

- **Emotional beat**: TLC ловит баг зелёным лучом, рука Maya ко рту.
- **Subtle humor**: `0 regrets` в TLC, `state одновременно 'confirming'
  И 'closed'` как нарушение.
- **Maya**: «TLC: 14 сгенерировано, 12 различных, 0 сожалений.»
- **Bottom**: «Пятница. 14 сгенерировано. 12 различных. Один баг.
  Модель была права.»

### Panel 09 — "Сначала модель, потом код" (satisfied, READING)

- **Maya**: «Если модель верна, и код соответствует модели, то код
  верен.»

### Panel 10 — "Мир Стал Лучше" (grateful, READING)

- **Bottom**: «3 месяца. Ноль инцидентов. 12 фич. 47 пакетов.
  Спокойно. // да, серьёзно»

### Panel 11 — "Штамп" (complete, READING)

- **Maya**: «VERIFIED» (сохраняется латиницей как символ метода)
- **Subtitle**: «Математика Доверия»
- **Subtle humor**: `// все ваши тесты // принадлежат нам`

## Humor Discipline Rules (same as v4-en)

1. Easter eggs layer-2, не меняют emotional beat
2. Только в CHUCKLED/READING панелях (1,2,3,6,7,11)
3. ≤ 3 easter eggs на панель
4. 12-22px easter eggs, не крупнее
5. Каждая шутка должна быть понятна разработчику, не отвлекать
   остальных

## Readability (RU-specific)

- **Кириллица крупнее**: минимальный размер кириллического текста
  **20px** (vs 18px для латиницы) — кириллические глифы мельче
  визуально при одинаковом font-size
- **Без переноса строк внутри слов**: длинные русские подписи
  разнесены на 2 строки явно, не implicit word-wrap
- **Кавычки**: используется « » (ёлочки), не " "

## Test Obligations

1. Структурная (механическая): `validate-panels.sh` для 11 панелей
2. Локализация: `locale = "ru"` инвариантна на трассе
3. Readability: ручной обзор — все заголовки и подписи ≥ 20px

## Runtime Checks

Нет — статичный SVG комикс.

## Why v4-ru stands on v4-en

Модель та же. State machine та же. Палитра та же. Beat mapping та
же. Меняется только текст в `<text>` элементах и фоновая семантика
русского vs английского. v4-ru это не отдельная работа — это
локализация, не редизайн.