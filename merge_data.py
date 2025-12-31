import json
import csv

PIN_JSON_PATH = "data/pincode.json"
PIN_CSV_PATH = "data/pincode_raw.csv"

# ---------------- LOAD PIN JSON ----------------
with open(PIN_JSON_PATH, "r", encoding="utf-8") as f:
    pincode_data = json.load(f)

print(f"Loaded {len(pincode_data)} PIN records from JSON")

# ---------------- LOAD CSV GEO DATA ----------------
pin_geo_map = {}

with open(PIN_CSV_PATH, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    print("Detected PIN CSV columns:", reader.fieldnames)

    for row in reader:
        pin = row.get("pincode", "").strip()
        lat = row.get("latitude", "").strip()
        lng = row.get("longitude", "").strip()

        if pin and lat and lng:
            pin_geo_map[pin] = {
                "latitude": lat,
                "longitude": lng
            }

print(f"Loaded {len(pin_geo_map)} PIN geo entries from CSV")

# ---------------- MERGE SAFELY ----------------
meta_updates = {}
updated = 0
skipped = 0

for pin in list(pincode_data.keys()):
    if pin in pin_geo_map:
        meta_updates[f"{pin}_meta"] = pin_geo_map[pin]
        updated += 1
    else:
        skipped += 1

# apply after loop
pincode_data.update(meta_updates)

# ---------------- SAVE ----------------
with open(PIN_JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(pincode_data, f, ensure_ascii=False, indent=2)

print("✅ PIN latitude & longitude merged successfully")
print(f"✔ Updated PINs : {updated}")
print(f"⚠ Skipped PINs : {skipped}")
