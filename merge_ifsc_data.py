import json
import csv

IFSC_JSON = "data/ifsc.json"
IFSC_CSV  = "data/ifsc_raw.csv"

# -----------------------------
# Load IFSC JSON
# -----------------------------
with open(IFSC_JSON, "r", encoding="utf-8") as f:
    ifsc_data = json.load(f)

print(f"Loaded {len(ifsc_data)} IFSC records from JSON")

# -----------------------------
# Load IFSC CSV into lookup
# -----------------------------
csv_lookup = {}

with open(IFSC_CSV, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    print("Detected IFSC CSV columns:", reader.fieldnames)

    for row in reader:
        ifsc = row.get("IFSC", "").strip()
        if ifsc:
            csv_lookup[ifsc] = row

print(f"Loaded {len(csv_lookup)} IFSC rows from CSV")

# -----------------------------
# Merge DATA
# -----------------------------
updated = 0
skipped = 0

for ifsc, info in ifsc_data.items():
    csv_row = csv_lookup.get(ifsc)

    if not csv_row:
        skipped += 1
        continue

    info["address"] = csv_row.get("ADDRESS", "").strip()
    info["micr"]    = csv_row.get("MICR", "").strip()
    info["city"]    = csv_row.get("CITY", "").strip()
    info["state"]   = csv_row.get("STATE", "").strip()

    updated += 1

# -----------------------------
# Save back to JSON
# -----------------------------
with open(IFSC_JSON, "w", encoding="utf-8") as f:
    json.dump(ifsc_data, f, ensure_ascii=False, indent=2)

print("✅ IFSC merge completed")
print(f"✔ Updated IFSCs : {updated}")
print(f"⚠ Skipped IFSCs : {skipped}")
