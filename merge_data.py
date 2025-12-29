import csv
import json
import re
from collections import defaultdict

PIN_CSV = "data/pincode_raw.csv"
IFSC_CSV = "data/ifsc_raw.csv"

PINCODE_JSON = "data/pincode.json"
IFSC_JSON = "data/ifsc.json"

# ---------- LOAD VALID PIN CODES ----------
valid_pins = set()

with open(PIN_CSV, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        row = {k.lower(): v for k, v in row.items()}
        pin = row.get("pincode")
        if pin and pin.isdigit() and len(pin) == 6:
            valid_pins.add(pin)

print(f"Valid PINs loaded: {len(valid_pins)}")

# ---------- PROCESS IFSC DATA ----------
pincode_data = defaultdict(list)
ifsc_data = {}

PIN_REGEX = re.compile(r"\b\d{6}\b")

with open(IFSC_CSV, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        row = {k.lower(): v for k, v in row.items()}

        ifsc = row.get("ifsc")
        bank = row.get("bank")
        branch = row.get("branch")
        address = row.get("address", "")

        if not ifsc or not address:
            continue

        match = PIN_REGEX.search(address)
        if not match:
            continue

        pin = match.group()

        if pin not in valid_pins:
            continue

        pincode_data[pin].append({
            "bank": bank,
            "branch": branch,
            "ifsc": ifsc
        })

        ifsc_data[ifsc] = {
            "bank": bank,
            "branch": branch,
            "pincode": pin
        }

# ---------- SAVE JSON ----------
with open(PINCODE_JSON, "w", encoding="utf-8") as f:
    json.dump(pincode_data, f, indent=2)

with open(IFSC_JSON, "w", encoding="utf-8") as f:
    json.dump(ifsc_data, f, indent=2)

print("✅ Data merged successfully")
print(f"PIN codes generated: {len(pincode_data)}")
print(f"IFSC codes generated: {len(ifsc_data)}")
