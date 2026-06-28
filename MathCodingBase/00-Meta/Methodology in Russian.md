# Что такое MathCodingFractal

`MathCodingFractal` перестраивает разработку. Из vibe-coding, где код пишется по ощущению «локально правильно», мы делаем мат-кодинг: сначала формальная модель, потом её механическая проверка, и только после этого код.

Фрактальность здесь не метафора. Методология применяет собственные правила к самой себе. В `methodology/self-spec/` лежат её собственная задача, её assumptions, её TLA+-спека и её verified evidence. Методология описывает сама себя через собственный pipeline.

## Зачем это нужно

### Проблема вайб-кодинга

Вайб-кодинг даёт код, который выглядит разумно, но семантически ничем не зафиксирован. Я вижу четыре повторяющихся дефекта в любом проекте, где спецификация живёт только в чате.

1. **Скрытые предположения.** «Отменить заказ» у разработчика, у тестировщика и у продакт-менеджера означает три разные вещи. И нигде это не записано.
2. **Непроверяемые свойства.** Агент пишет «этот код корректен», но чем корректность меряется — не сказано.
3. **Нет evidence.** Доказательство — уверенность автора в момент написания. Через полгода этой уверенности уже нет, а код остался.
4. **Повторяющиеся дефекты.** Race conditions, состояния-призраки, сломанные инварианты. Один и тот же класс ошибок кочует из проекта в проект, потому что нет артефакта, на котором можно показать, в чём именно проблема.

### Что предлагается

`MathCodingFractal` перестраивает процесс вокруг артефактов:

- `problem.md` — формулировка задачи, которую можно проверить.
- `assumptions.yaml` — явные допущения со статусом.
- `Model.tla` — формальная модель.
- `Model.cfg` — параметры bounded-проверки.
- `verification.json` — evidence прогона SANY и TLC.
- `refinement.md` — как модель превращается в код.
- `traceability.json` — карта связей модель → код.
- `implementation/` — каталог с реализацией.

Каждый из этих файлов канонический. Чат, устное обсуждение, сам промпт — transient. Если чего-то нет в артефактах, для методологии этого не существует.

## Как это работает

### Шаг 1. Захват проблемы

Прежде чем писать хоть что-то про код, разработчик (или агент) пишет `problem.md` — формулировку задачи, которую можно проверить.

Пример для UI-модального диалога:

```markdown
# Problem: UI Modal Dialog State Machine

## Task
A desktop application needs a modal confirmation dialog with the following visible states:
- `closed`
- `opening`
- `open`
- `confirming`
- `canceling`
- `closing`
- `error`

## Desired Outcome
The dialog never gets stuck in an interactive state while a background
operation is running. The dialog is never simultaneously `open` and `closed`.
```

### Шаг 2. Извлечение assumptions

Каждая неоднозначность из задачи превращается в явное допущение. У каждого assumption есть три статуса:

- `user-confirmed` — пользователь подтвердил
- `agent-inferred` — агент вывел сам
- `open` — требует уточнения

```yaml
task_id: ui-modal-dialog
assumptions:
  - id: A1
    statement: There is exactly one modal dialog instance.
    status: user-confirmed
  - id: A5
    statement: The Dismiss action (click outside) is treated as a cancel.
    status: agent-inferred
  - id: A6
    statement: The model uses bounded state set so TLC can exhaustively check.
    status: agent-inferred
```

Главный принцип: никакой код не должен молча опираться на `open` assumption. Если assumption критичен и открыт — либо спрашиваем пользователя, либо ветвим модель на оба случая.

### Шаг 3. Формализация

Создаётся `Model.tla`. Здесь действует правило трёх уровней строгости:

- **L1: контракты** — обязательны всегда. Это `Precondition`, `Postcondition`, `Invariant`.
- **L2: машина состояний** — обязательна, если есть состояние, конкурентность, временные свойства.
- **L3: категории** — необязательна, но полезна для композиционных структур.

Пример L2 для UI-диалога (сокращённо):

```tla
VARIABLES state, pendingResult

Init == /\ state = "closed"
        /\ pendingResult = "none"

Open == /\ state = "closed"
        /\ state' = "opening"
        /\ UNCHANGED pendingResult

Confirm == /\ state = "open"
           /\ state' = "confirming"
           /\ pendingResult' = "in-flight"

Resolve == /\ state \in {"confirming", "canceling"}
           /\ pendingResult = "in-flight"
           /\ state' = "closing"
           /\ pendingResult' = "ok"

Spec == Init /\ [][Next]_<<state, pendingResult>> /\
        WF_<<state, pendingResult>>(Open) /\
        SF_<<state, pendingResult>>(ErrorDismiss) /\
        WF_<<state, pendingResult>>(FinishClose)
```

Здесь важно зафиксировать три вещи: что считается корректным состоянием, какие переходы разрешены и какие fairness-гипотезы лежат в основе модели. Любой агент или человек может позже спросить: «почему именно так?»

### Шаг 4. Механическая верификация

Модель подаётся в SANY (синтаксис/семантика) и TLC (bounded model checking):

```bash
./bin/verify examples/ui-modal-dialog
```

Это обязательный этап. Дальше — три возможных сценария.

Если `verification.json` имеет verdict `VERIFIED`, значит SANY прошёл, TLC нашёл все reachable state'ы, все инварианты и temporal-свойства выполняются.

Если verdict `NEEDS_REVISION` — TLC уже нашёл counterexample, и модель нужно переделать.

Если verdict `UNVERIFIABLE` — нет инструмента, и любая уверенность в модели не имеет основания.

Реальный пример из репозитория:

```
TLC2 Version 2.16 of 31 December 2020
...
13 states generated, 8 distinct states found, 0 states left on queue.
The depth of the complete state graph search is 6.
Model checking completed. No error has been found.
```

Модель проверена на всех 8 reachable состояниях, ни одно свойство не нарушено.

### Шаг 5. Refinement

`refinement.md` описывает, как именно модель становится кодом. Этот этап разработчики чаще всего пропускают. И зря: без него verified модель превращается в код, который не сохраняет её свойства.

```markdown
# Refinement: UI Modal Dialog State Machine

## State Mapping
- Model variable `state` → TS union type `DialogState`
- Model variable `pendingResult` → `dialog.pendingOperation`

## Operation Mapping
- Open → dialog.open()
- FinishClose → dialog.animationFinish('out')

## Invariant Preservation
- StateInvariant — TypeScript union type
- NoPendingIfSettled — reducer post-condition

## Why SF on ErrorDismiss
The UI must always render a dismiss button in error state.
```

### Шаг 6. Traceability

`traceability.json` связывает каждый элемент модели с местом в реализации:

```json
{
  "source": "StateInvariant",
  "target": "TS union type narrowing",
  "kind": "invariant"
}
```

Позволяет ответить на вопрос: «где в коде выполняется инвариант X?»

## Как это помогает в обычном программировании UI

UI-код кажется «слишком прикладным» для формальных методов. На практике это место, где формальные методы дают наибольший выигрыш, потому что UI-компоненты:

1. Имеют **конечное число состояний** (5–20 обычно).
2. Имеют **сложные переходы**, которые легко нарисовать неправильно.
3. Имеют **liveness-свойства** («пользователь всегда может закрыть диалог»).
4. Имеют **race-conditions**, которые появляются на границе асинхронной работы и UI-цикла.

### Конкретный пример: модальный диалог

Без формализации типичный путь:

```ts
const [state, setState] = useState('closed')
const [pending, setPending] = useState(null)

const confirm = async () => {
  setState('confirming')
  setPending('in-flight')
  try {
    await api.confirm()
    setPending('ok')
    setState('closing')
  } catch {
    setPending('failed')
    setState('error')
  }
}
```

Этот код **компилируется** и **выглядит правильно**. Но он не отвечает на вопросы:

- Может ли диалог оказаться одновременно в `confirming` и `canceling`?
- Что если пользователь нажал «Отмена» во время `confirming`?
- Гарантировано ли, что диалог когда-нибудь закроется после `error`?
- Что если `animationFinish` вызывается дважды?

С `MathCodingFractal` эти вопросы задаются **до написания кода** и проверяются механически:

1. В `Model.tla` зафиксировано, что `canceling` и `confirming` не могут существовать одновременно.
2. В `Spec` есть fairness, гарантирующая что background операция завершится.
3. В Liveness явно сказано `error ~> closed`.
4. В `refinement.md` зафиксировано, что `ErrorDismiss` требует сильной fairness, поэтому в UI всегда видна кнопка закрытия.

В результате код, который появится в `implementation/`, будет проверяться через traceability map. Если кто-то добавит баг, нарушающий инвариант, это станет видно при ревью.

### Конкретный пример: форма с асинхронной валидацией

Допустим, нужно сделать форму, которая проверяет username через API. Возможные состояния:

- `idle` — пользователь ничего не делает
- `validating` — идёт запрос
- `valid` — успех
- `invalid` — есть ошибки
- `taken` — username уже занят

Без формализации легко получить ситуацию, когда форма показывает «username уже занят» для пользователя, который начал печатать заново. С TLA+ моделью это сразу всплывёт как нарушение инварианта, и TLC найдёт counterexample.

### Конкретный пример: мастер с несколькими шагами

Многошаговый мастер (wizard) — классический кандидат на ошибки «застрял на шаге 2, назад не вернуться». TLA+ модель позволяет явно зафиксировать, какие шаги достижимы из каких, и проверить, что пользователь всегда может либо завершить мастер, либо откатиться.

## Почему именно TLA+

TLA+ выбран как стандартный язык спецификаций по нескольким причинам:

1. **Executable** — TLC может проверить bounded модели.
2. **State-based** — подходит для систем с состоянием.
3. **Industry adoption** — Amazon, Microsoft и др. используют TLA+ для критических систем.
4. **Ecosystem** — инструменты SANY, TLC, TLAPS существуют и поддерживаются.
5. **Математическая чистота** — формальная логика, не DSL.

Но TLA+ — **не единственный** поддерживаемый формализм. Методология отделена от формализма. Можно использовать:

- TLA+ для stateful систем
- Alloy для реляционных ограничений
- Coq/Lean для глубоких доказательств
- Property-based testing как «lightweight» вариант

Главное: evidence должен быть машинно проверяемым. Никаких «экспертных оценок».

## Какие инструменты включены

### `bin/mathpacket`

Генерирует новый task packet:

```bash
./bin/mathpacket my-task "My Task"
```

Создаёт канонический набор файлов под `artifacts/my-task/`.

### `bin/verify`

Запускает SANY + TLC и пишет `verification.json` с реальными результатами:

```bash
./bin/verify artifacts/my-task
```

Если модели нет или есть ошибки — verdict будет `NEEDS_REVISION` с counterexample.

### `bin/validate-packet`

Делает структурную проверку packet’а: все ли обязательные файлы есть, согласован ли `task_id`, валиден ли `verification.json`.

### `bin/tla-sany` и `bin/tla-tlc`

Низкоуровневые обёртки. Используются, если нужно прогнать только парсер или только model checker.

### `flake.nix`

Предоставляет reproducible devShell с `jdk21` и публикует `bin/*` как `apps`. Это позволяет:

```bash
nix run .#mathpacket -- my-task "My Task"
nix run .#verify -- artifacts/my-task
```

## Структура репозитория

```
MathCodingFractal/
├── README.md                      краткое описание
├── AGENTS.md                      правила репозитория
├── QUICKSTART.md                  operational quickstart
├── opencode.json                  portable opencode integration
├── flake.nix                      reproducible environment
│
├── schemas/                       machine-readable schemas
│   ├── packet-manifest.schema.json
│   ├── assumptions.schema.json
│   ├── verification-report.schema.json
│   └── traceability.schema.json
│
├── bin/                           operational scripts
│   ├── mathpacket
│   ├── verify
│   ├── validate-packet
│   ├── tla-sany
│   ├── tla-tlc
│   └── locate-tla2tools
│
├── MathCodingBase/                Obsidian knowledge base
│   ├── 00-Meta/                   Manifesto, Dialectical Analysis, Fractal Principle
│   ├── 01-Theory/                 Mathematical Development Cycle, TLA+ Role, Refinement
│   ├── 02-Protocols/              Task Packet, Assumption, Verification Evidence, Refinement, Traceability
│   ├── 03-Architecture/           Artifact-Centered, Agent Portability, Mechanical Verification
│   └── 04-Fractal-Self/           Self Problem, Self Assumptions, Self Refinement, Self Justification
│
├── examples/                      verified example packets
│   ├── minimal-spec/              простая машина состояний
│   └── ui-modal-dialog/           реалистичный UI-state-machine
│
├── methodology/self-spec/         методология описывает сама себя
│
├── artifacts/                     canonical место для новых task packets
│
└── .opencode/                     opencode integration (skills, agents, commands)
```

## Что уже verified

Три packet’а прошли механическую верификацию:

| Packet | Verdict | States |
|--------|---------|--------|
| `examples/minimal-spec` | `VERIFIED` | 2 |
| `examples/ui-modal-dialog` | `VERIFIED` | 8 |
| `methodology/self-spec` | `VERIFIED` | 7 |

Это **доказательство**, что pipeline работает end-to-end на нетривиальных моделях.

## Чего методология не делает

1. **Не генерирует код автоматически.** Код пишется человеком или агентом после `VERIFIED`. Методология говорит, когда можно начинать; сам код — за пределами методологии.

2. **Не заменяет тесты.** После синтеза нужны unit-тесты, integration-тесты, e2e-тесты. Они проверяют код; модель проверяет дизайн.

3. **Не гарантирует, что модель правильно описывает задачу.** Модель может быть verified, но описывать не то, что хотел пользователь. Поэтому assumptions выносятся на отдельный артефакт и валидируются с пользователем.

4. **Не решает unbounded задачи.** TLC делает bounded model checking. Для unbounded свойств нужен TLAPS или индуктивные доказательства.

5. **Не подходит для всего.** Где-то проще написать прототип и выкинуть, чем строить формальную модель. Методология для случаев, где важна корректность.

## Как начать использовать

### Минимальный сценарий

1. Скопируйте репозиторий.
2. Запустите `./bin/mathpacket my-feature "My Feature"`.
3. Заполните `problem.md` и `assumptions.yaml`.
4. Напишите `Model.tla` и `Model.cfg`.
5. Запустите `./bin/verify artifacts/my-feature`.
6. Если `NEEDS_REVISION` — посмотрите counterexample в `verification.json`, исправьте модель, повторите.
7. Если `VERIFIED` — пишите `refinement.md` и реализацию.

### В opencode

Используйте команду `/mathpacket` или команду `MathCodingFractal.mathpacket` для прямой работы через агента. Скиллы `.opencode/skills/` содержат инструкции для агентов, как именно создавать и верифицировать пакеты.

### Через Nix

```bash
nix develop
nix run .#mathpacket -- my-task "My Task"
nix run .#verify -- artifacts/my-task
```

## Резюме

`MathCodingFractal` — инфраструктура для превращения разработки из разговора о коде в работу с формальными артефактами. Артефакты имеют машино-читаемую форму, утверждения о корректности опираются на evidence, шаги фиксируются в файлах.

Особенно полезно это для UI-кода, где состояния и переходы часто становятся источниками трудноуловимых багов. С TLA+ моделью и механической верификацией эти баги находятся **до** того, как они попадут в продакшн.

## Связанные документы

- [Manifesto](./Manifesto.md) — краткий манифест методологии
- [Dialectical Analysis](./Dialectical Analysis.md) — диалектический разбор задачи
- [Fractal Principle](./Fractal Principle.md) — почему методология сама себя описывает
- [Mathematical Development Cycle](../01-Theory/Mathematical Development Cycle.md) — полный цикл
- [Three Layers of Rigor](../01-Theory/Three Layers of Rigor.md) — L1/L2/L3
- [TLA+ Role](../01-Theory/TLA+ Role.md) — где заканчивается TLA+ и начинается методология
- [Refinement as Bridge](../01-Theory/Refinement as Bridge.md) — почему refinement обязателен
- [Task Packet Protocol](../02-Protocols/Task Packet Protocol.md) — каноническая структура пакетов
- [Assumption Protocol](../02-Protocols/Assumption Protocol.md) — работа с assumptions
- [Verification Evidence Protocol](../02-Protocols/Verification Evidence Protocol.md) — что такое verification
- [Refinement Protocol](../02-Protocols/Refinement Protocol.md) — как писать refinement
- [Traceability Protocol](../02-Protocols/Traceability Protocol.md) — связь между моделью и кодом
- [Artifact-Centered Architecture](../03-Architecture/Artifact-Centered Architecture.md) — архитектура системы
- [Agent Portability Model](../03-Architecture/Agent Portability Model.md) — переносимость на другие агенты
- [Mechanical Verification Model](../03-Architecture/Mechanical Verification Model.md) — место верификации в системе
