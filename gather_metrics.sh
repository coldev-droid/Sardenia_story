#!/bin/bash
cd /app/applet/saga_data/master_atlas || exit 1

echo "=== MANIFEST ==="
for f in *; do
  size=$(wc -c < "$f")
  sha=$(sha256sum "$f" | awk '{print $1}')
  echo "$f | Size: $size bytes | SHA256: $sha"
done

echo ""
echo "=== CSV RECORD COUNTS (excluding headers) ==="
for f in *.csv; do
  count=$(tail -n +2 "$f" | wc -l)
  echo "$f: $count records"
done

echo ""
echo "=== JSON CLAIM COUNT ==="
claim_count=$(grep -c '"id":' 11_double_verified_source_ledger.json)
echo "11_double_verified_source_ledger.json: $claim_count claims"

echo ""
echo "=== UNIQUE SOURCE DOMAINS ==="
grep -E '"url[12]":' 11_double_verified_source_ledger.json | awk -F'"' '{print $4}' | awk -F/ '{print $3}' | sort | uniq -c
