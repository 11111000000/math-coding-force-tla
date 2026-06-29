#!/usr/bin/env bash
# validate-panels.sh — structural validation of comic-v3 SVG panels
# Asserts: dimensions match refinement.md, palette discipline, Maya consistency.
# Exits 0 on success, 1 on any failure.

set -u

cd "$(dirname "$0")"
FAIL=0
CHECKS=0

EXPECTED=(
  "01-looks-right.svg 800 600 blue yes"
  "02-ship-it.svg 600 400 blue yes"
  "03-the-clicks.svg 600 400 green no"
  "04-the-bug.svg 1000 800 red no"
  "05-alone.svg 800 600 red yes"
  "06-the-mentor.svg 800 600 purple yes"
  "07-the-model.svg 800 600 purple yes"
  "08-tlc-finds-it.svg 1000 800 green no"
  "09-fix-first.svg 800 600 green yes"
  "10-better-world.svg 800 600 green no"
  "11-the-stamp.svg 600 400 green yes"
)

PALETTE_HEXES=(
  "blue:#3b82f6"
  "green:#22c55e"
  "red:#ef4444"
  "purple:#a855f7"
  "amber:#f59e0b"
)

hex_for() {
  for entry in "${PALETTE_HEXES[@]}"; do
    k="${entry%%:*}"
    if [ "$k" = "$1" ]; then echo "${entry#*:}"; return 0; fi
  done
  echo ""
}

echo "Validating comic-v3 panels in $(pwd)"
echo "======================================"

for row in "${EXPECTED[@]}"; do
  CHECKS=$((CHECKS+1))
  read -r file w h palette need_maya <<< "$row"
  fpath="$file"

  if [ ! -f "$fpath" ]; then
    echo "FAIL  $file — missing"
    FAIL=$((FAIL+1))
    continue
  fi

  gwidth=$(grep -oE 'width="[0-9]+"' "$fpath" | head -1 | grep -oE '[0-9]+')
  gheight=$(grep -oE 'height="[0-9]+"' "$fpath" | head -1 | grep -oE '[0-9]+')
  if [ "$gwidth" != "$w" ] || [ "$gheight" != "$h" ]; then
    echo "FAIL  $file — dimensions $gwidth x $gheight, expected $w x $h"
    FAIL=$((FAIL+1))
    continue
  fi

  bg=$(grep -oE 'fill="#0d1117"' "$fpath" | head -1)
  if [ -z "$bg" ]; then
    echo "FAIL  $file — background not #0d1117"
    FAIL=$((FAIL+1))
    continue
  fi

  hex=$(hex_for "$palette")
  if [ -z "$hex" ]; then
    echo "FAIL  $file — unknown palette '$palette'"
    FAIL=$((FAIL+1))
    continue
  fi
  if ! grep -q "$hex" "$fpath"; then
    echo "FAIL  $file — palette '$palette' ($hex) not used in SVG"
    FAIL=$((FAIL+1))
    continue
  fi

  has_maya=$(grep -c 'data-maya="present"' "$fpath" || true)
  if [ "$need_maya" = "yes" ]; then
    if [ "$has_maya" -eq 0 ]; then
      echo "FAIL  $file — Maya required but data-maya='present' not found"
      FAIL=$((FAIL+1))
      continue
    fi
  fi

  opens=$(grep -oE '<[a-zA-Z]+' "$fpath" | wc -l)
  closes=$(grep -oE '</[a-zA-Z]+>' "$fpath" | wc -l)
  self_close=$(grep -oE '/>' "$fpath" | wc -l)
  if [ $((opens - self_close)) -ne "$closes" ]; then
    echo "FAIL  $file — tag imbalance: $opens open tags, $closes close, $self_close self-close"
    FAIL=$((FAIL+1))
    continue
  fi

  echo "OK    $file  ${w}x${h}  ${palette}  maya=${need_maya}"
done

echo "======================================"
echo "Checks: $CHECKS   Failures: $FAIL"

if [ "$FAIL" -eq 0 ]; then
  echo "VALIDATION OK"
  exit 0
else
  echo "VALIDATION FAILED"
  exit 1
fi