# Применение MathCodingFractal в UI-программировании

UI-код — это место, где формальные методы дают наибольший выигрыш. Эта заметка объясняет почему и как.

## Почему UI — не «слишком прикладное» для формальных методов

UI-компоненты имеют четыре свойства, которые делают формализацию выгодной:

1. **Конечное число состояний.** Модальный диалог обычно укладывается в 5–20 состояний. Этот диапазон TLC проверяет полностью за секунды.

2. **Сложные переходы.** Когда есть `opening`, `closing`, `confirming`, `canceling`, `error` — переходы между ними легко нарисовать неправильно. Формальная модель делает ошибку видимой сразу.

3. **Liveness-свойства.** «Пользователь всегда может закрыть диалог», «форма всегда доходит до финального состояния». TLA+ выражает и проверяет такие свойства напрямую.

4. **Race conditions.** Граница между UI-циклом и асинхронной работой — главный источник багов в реальных проектах. Формальная модель делает эти баги видимыми до продакшна.

## Реалистичные примеры

### Пример 1: модальный диалог подтверждения

**Сценарий:** десктопное приложение с диалогом «Вы уверены?»

Возможные состояния:

```
closed
   ↓ Open
opening → (анимация)
   ↓ FinishOpen
open (видим и интерактивен)
   ↓ Confirm / Cancel / Dismiss
confirming / canceling (async в полёте)
   ↓ Resolve / Reject
closing (анимация) → closed
   ↓ FinishClose

error (если async упал) → Retry / ErrorDismiss → closing → closed
```

**Без формализации** типичные баги:

- диалог остаётся в `confirming`, потому что `Resolve` не был вызван
- `Dismiss` срабатывает после `Confirm`, и состояние становится inconsistent
- `animationFinish` вызывается дважды, и второй раз происходит сбой
- пользователь не может закрыть `error`, потому что `Retry` «съедает» все события

**С MathCodingFractal:**

```tla
Spec == Init /\ [][Next]_<<state, pendingResult>> /\
  WF_<<state, pendingResult>>(Open) /\
  WF_<<state, pendingResult>>(Confirm) /\
  SF_<<state, pendingResult>>(ErrorDismiss) /\
  WF_<<state, pendingResult>>(FinishClose)

Liveness ==
  /\ [](state = "open" ~> state \in {"closing", "error"})
  /\ [](state = "error" ~> state = "closed")
```

Сильная fairness (`SF_`) на `ErrorDismiss` формализует дизайн-решение: пользователь **обязан** иметь возможность закрыть диалог из состояния ошибки. TLC проверяет, что если это свойство объявлено, модель его выполняет — на каждой достижимой трассе.

### Пример 2: форма с асинхронной валидацией username

**Сценарий:** форма регистрации с проверкой «username уже занят» через API.

Возможные состояния:

```
idle
   ↓ OnChange
validating
   ↓ Resolve / Reject
valid / invalid / taken
   ↓ Reset
idle
```

Типичные баги:

- поле показывает «username занят» для уже отредактированного ввода
- три параллельных запроса валидации возвращаются в разном порядке
- после успешной submit форма не очищается

В TLA+ модели это выражается явно:

```tla
\* Valid input doesn't show stale "taken" state
StalenessInvariant ==
  pendingResult = "none" \/ state \in {"validating", "valid", "invalid", "taken"}

\* Only one validation in flight
SingleFlightInvariant ==
  pendingRequestId = "none" \/ state = "validating"
```

### Пример 3: многошаговый мастер (wizard)

**Сценарий:** onboarding flow из 4 шагов.

Состояния:

```
step1 → step2 → step3 → step4 → done
   ↓        ↓        ↓
back     back      back
```

Типичные баги:

- пользователь застревает на шаге 2, потому что кнопка «назад» не работает
- данные шага 1 теряются при переходе на шаг 2
- нельзя пропустить шаги, даже если они уже были заполнены

В TLA+:

```tla
\* Можно вернуться назад
BackEnabledInvariant ==
  state \in {"step1", "step2", "step3"} =>
    \E p \in Pages: CanGoBack(p, state)

\* Данные не теряются
DataPreservationInvariant ==
  \A s \in {"step1", "step2", "step3"}:
    state = s => stepData[s] # "empty"
```

### Пример 4: real-time список с optimistic updates

**Сценарий:** список сообщений, где отправка происходит сначала локально (optimistic), а потом синхронизируется с сервером.

Состояния для одного сообщения:

```
pending → sent → confirmed
       ↘ failed → retrying → ...
```

Здесь формальная модель нужна для:

- порядка сообщений при race conditions
- retry логики с exponential backoff
- обработки дубликатов от сервера

## Пошаговый рецепт для UI-пакета

### 1. Опишите задачу в `problem.md`

Перечислите:

- какие состояния UI видимы
- какие переходы между состояниями возможны
- какие свойства должны выполняться всегда
- какие свойства должны выполняться «в конце концов»

### 2. Выпишите assumptions

Каждое неявное предположение — в `assumptions.yaml`:

- Что считается «одним» диалогом? (одна инстанция? вкладка? окно?)
- Кто имеет право нажимать кнопки в каждом состоянии?
- Что делает background-job (асинхронный запрос) — может ли он «зависнуть»?
- Как обрабатывается ситуация «пользователь нажал Отмена во время Confirm»?

### 3. Напишите `Model.tla`

Начните с L1 контрактов:

```tla
Precondition == state \in DialogStates
Postcondition(old, new) == new \in DialogStates
Invariant == state \in DialogStates
```

Затем L2 state machine. Выпишите все переходы. Каждый переход — отдельный оператор:

```tla
Open == /\ state = "closed"
        /\ state' = "opening"
        /\ UNCHANGED pendingResult
```

Если есть асинхронная работа — добавьте переменную типа `pendingResult`:

```tla
VARIABLES state, pendingResult
```

### 4. Определите Spec с fairness

```tla
Spec == Init /\ [][Next]_<<state, pendingResult>> /\
  WF_<<state, pendingResult>>(Open) /\
  WF_<<state, pendingResult>>(Confirm)
```

Здесь важно понимать разницу:

- `WF` (weak fairness): если действие **постоянно** enabled, оно когда-нибудь случится
- `SF` (strong fairness): если действие **бесконечно часто** enabled, оно когда-нибудь случится

Для пользовательских действий обычно достаточно `WF`. Для гарантий безопасности (типа «пользователь всегда может закрыть диалог») — `SF`.

### 5. Добавьте Liveness

```tla
Liveness ==
  /\ [](state = "open" ~> state \in {"closing", "error"})
  /\ [](state = "error" ~> state = "closed")
```

`~>` означает «в конце концов». Это **временное** свойство, отличающееся от инварианта тем, что проверяет не текущее состояние, а его эволюцию.

### 6. Запустите `./bin/verify`

TLC найдёт все reachable states и проверит:

- Все инварианты выполняются на каждом reachable state
- Все safety-свойства (`[]X`) выполняются вдоль всех трасс
- Все liveness-свойства (`X ~> Y`) выполняются при fairness-гипотезах

Если TLC найдёт counterexample — он покажет трассу, которая нарушает свойство. Это **подарок**: вместо того, чтобы баг нашёлся пользователем через месяц, вы видите его сразу. В `examples/ui-modal-dialog` такого counterexample нет, но его можно намеренно ввести в `Model.tla` и убедиться, что TLC его ловит.

### 7. Напишите refinement

В `refinement.md` опишите, как каждое действие становится кодом:

| TLA+ действие | UI код |
|---|---|
| `Open` | `dialog.open()` |
| `FinishOpen` | callback после анимации |
| `Confirm` | `dialog.confirm()` |
| `Resolve` | `then(api.confirm)` в reducer |
| `Reject` | `catch(api.confirm)` в reducer |
| `FinishClose` | callback после close-анимации |

Это превращает модель в **чеклист для разработчика**: каждый пункт — конкретная функция.

### 8. Создайте implementation

После `VERIFIED` verdict и написанного refinement можно писать код. Используйте `traceability.json` как карту: каждое свойство должно появиться в коде.

## Типичные UI-сценарии, которые ловятся сразу

| Сценарий | Что ловит TLA+ модель |
|----------|------------------------|
| Кнопка не работает в каком-то состоянии | Deadlock в state machine |
| Диалог не закрывается после ошибки | Liveness `error ~> closed` не выполняется |
| Асинхронный запрос приходит после отмены | Staleness invariant нарушен |
| Race condition между двумя операциями | Параллельные трассы, не учтённые в Next |
| Состояние, которое «никогда не должно быть» | Инвариант нарушен |
| Потеря данных при переходе между шагами | Data preservation invariant |
| Возможность кликнуть «Отмена» после закрытия | Запрещённый переход существует |

## Что НЕ нужно делать в UI-пакете

- **Не пытайтесь моделировать анимации покадрово.** Достаточно атомарных `opening` и `closing`.
- **Не моделируйте сеть.** Достаточно считать, что запрос либо `in-flight`, либо завершился успехом/ошибкой.
- **Не моделируйте все 100 полей формы.** Достаточно состояния «форма» в целом + критичные поля.
- **Не пытайтесь доказать UX-свойства** («пользователю нравится интерфейс»). Это вне scope формальных методов.

## Связанные документы

- [Methodology in Russian](../00-Meta/Methodology in Russian.md) — главный вводный документ
- [Example - UI Modal Dialog](../../examples/ui-modal-dialog/) — реализованный пример
- [Three Layers of Rigor](../01-Theory/Three Layers of Rigor.md) — L1/L2/L3
- [Refinement Protocol](../02-Protocols/Refinement Protocol.md) — как писать refinement
- [Mechanical Verification Model](./Mechanical Verification Model.md) — как работает верификация
