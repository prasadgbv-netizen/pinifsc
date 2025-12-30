import csv
import json

PIN_JSON = "data/pincode.json"
PIN_CSV = "data/pincode_raw.csv"

# ---------------- LOAD PIN JSON ----------------
with open(PIN_JSON, "r", encoding="utf-8") as f:
    pincode_data = json.load(f)

print(f"Loaded {len(pincode_data)} PIN records from JSON")

# ---------------- READ CSV ----------------
with open(PIN_CSV, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    print("Detected PIN CSV columns:", reader.fieldnames)

    updated = 0
    skipped = 0

    for row in reader:
        pin = row.get("pincode", "").strip()
        lat = row.get("latitude", "").strip()
        lon = row.get("longitude", "").strip()

        if not pin or pin not in pincode_data:
            skipped += 1
            continue

        # pincode_data[pin] is a LIST of branches
        for branch in pincode_data[pin]:
            branch["latitude"] = lat or None
            branch["longitude"] = lon or None

        updated += 1

print(f"✅ Updated PINs: {updated}")
print(f"⚠ Skipped rows: {skipped}")

# ---------------- SAVE BACK ----------------
with open(PIN_JSON, "w", encoding="utf-8") as f:
    json.dump(pincode_data, f, ensure_ascii=False, indent=2)

print("✅ PIN latitude & longitude merged successfully")
