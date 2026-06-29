# Оперативный старт

Этот репозиторий — скаффолд методологии мат-кодинга. Если вы здесь впервые, начните с `README.md` и `MathCodingBase/Index.md`.

## Первые шаги

1. Откройте репозиторий.
2. Прочитайте `README.md`.
3. Прочитайте `MathCodingBase/Index.md` и выберите точку входа, которая отвечает на ваш вопрос.
4. Возьмите существующий пакет под `artifacts/` или создайте новый.
5. Если работаете через opencode, используйте slash-команду `/mathpacket`. В остальном интерфейс тот же.

## Создать пакет

```bash
./bin/mathpacket demo-task "Demo Task"
```

Сценарий создаёт канонический скелет под `artifacts/demo-task/`.

## Написать модель

Откройте `Model.tla` и `Model.cfg`. Для систем с состоянием объявите `VARIABLES`, `Init`, `Next`, `Spec` и хотя бы одно свойство безопасности. Добавьте блоки `THEOREM ... PROOF`, если хотите, чтобы TLAPS снял обязательства, которые проверка модели снять не может.

## Запустить механическую верификацию

Обёртки ищут `tla2tools.jar` в таком порядке:

- `$TLA2TOOLS_JAR`
- `tools/tla2tools.jar`
- стандартные пользовательские и системные пути

Для TLAPS:

- `$TLAPM_BIN`
- `tools/tlaps/bin/tlapm`

Если `java` отсутствует, войдите в оболочку Nix:

```bash
nix shell nixpkgs#jdk21
```

### Все уровни одной командой

```bash
./bin/verify artifacts/<task-id>
```

Сценарий запускает SANY, TLC и TLAPS (если TLAPS доступен) и пишет `verification.json` с реальным выводом инструментов.

### По одному уровню

```bash
./bin/tla-sany  artifacts/<task-id>/Model.tla
./bin/tla-tlc   -config artifacts/<task-id>/Model.cfg artifacts/<task-id>/Model.tla
./bin/tla-tlaps artifacts/<task-id>/Model.tla
```

## Сгенерировать уточнение и трассируемость

```bash
./bin/refine-from-model artifacts/<task-id>
```

Сценарий читает разобранную TLA+ модель и пересобирает скелеты `refinement.md` и `traceability.json`. Связи с целевым языком дописываются вручную.

## Проверить пакет

```bash
./bin/validate-packet artifacts/<task-id>
```

Сообщает об отсутствующих файлах, ошибках схемы и связях `source -> TODO`, которые проскочили этап уточнения.

## Проверенные примеры

- `examples/minimal-spec` — вердикт `VERIFIED`, 2 достижимых состояния, 2 `THEOREM` доказаны через TLAPS
- `examples/ui-modal-dialog` — вердикт `VERIFIED`, 8 достижимых состояний
- `methodology/self-spec` — вердикт `VERIFIED`, 7 достижимых состояний

## Выбор адаптера

| Агент | Адаптер |
|-------|---------|
| opencode | `.opencode/` |
| Cursor | `adapters/cursor/` |
| Claude Code | `adapters/claude-code/` |
| Всё остальное | `adapters/generic/` (читайте как спецификацию) |

## Перенос на новую среду агента

Минимум, который нужно сохранить:

- `schemas/`
- `MathCodingBase/02-Protocols/`
- `AGENTS.md`
- `README.md`
- `bin/`

Остальное — слой интеграции.

## Сценарии в одной таблице

| Сценарий | Что делает |
|----------|------------|
| `bin/mathpacket` | Создаёт скелет нового пакета |
| `bin/refine-from-model` | Пересобирает `refinement.md` и `traceability.json` по разобранной модели |
| `bin/verify` | Запускает SANY + TLC + TLAPS и пишет `verification.json` |
| `bin/validate-packet` | Структурная проверка и поиск пробелов в трассируемости |
| `bin/tla-sany` | Низкоуровневая обёртка SANY |
| `bin/tla-tlc` | Низкоуровневая обёртка TLC |
| `bin/tla-tlaps` | Низкоуровневая обёртка TLAPS |
| `bin/locate-tla2tools` | Печатает путь к обнаруженному `tla2tools.jar` |