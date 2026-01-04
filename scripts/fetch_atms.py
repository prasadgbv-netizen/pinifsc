import json
import os
import time
import requests
from math import radians, cos, sin, asin, sqrt

# ---------------- CONFIG ----------------
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
RADIUS_METERS = 3000   # ✅ 3 KM
MAX_ATMS = 10
SLEEP_SECONDS = 2.5    # safer for Overpass

IFSC_JSON = "data/ifsc.json"
PIN_JSON = "data/pincode.json"

ATM_IFSC_DIR = "data/atm_ifsc"
ATM_PIN_DIR = "data/atm_pin"

os.makedirs(ATM_IFSC_DIR, exist_ok=True)
os.makedirs(ATM_PIN_DIR, exist_ok=True)

# ---------------- HELPERS ----------------
def safe_float(val):
    try:
        return float(val)
    except (TypeError, ValueError):
        return None

def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 6371000 * 2 * asin(sqrt(a))  # meters

def fetch_atms(lat, lon, retries=3):
    query = f"""
    [out:json][timeout:25];
    node
      ["amenity"="atm"]
      (around:{RADIUS_METERS},{lat},{lon});
    out tags center;
    """

    for attempt in range(retries):
        try:
            r = requests.post(OVERPASS_URL, data=query, timeout=60)
            r.raise_for_status()
            data = r.json().get("elements", [])

            results = []
            for e in data:
                d = haversine(lat, lon, e["lat"], e["lon"])
                results.append({
                    "name": e.get("tags", {}).get("name", "ATM"),
                    "operator": e.get("tags", {}).get("operator", ""),
                    "lat": e["lat"],
                    "lon": e["lon"],
                    "distance_m": int(d)
                })

            results.sort(key=lambda x: x["distance_m"])
            return results[:MAX_ATMS]

        except requests.exceptions.RequestException as ex:
            print(f"⚠ Overpass error (attempt {attempt + 1}/{retries}) — retrying...")
            time.sleep(3)

    return []

# ---------------- IFSC ATMS ----------------
with open(IFSC_JSON, "r", encoding="utf-8") as f:
    ifsc_data = json.load(f)

print("🔹 Fetching ATMs for IFSC pages (3 km)...")
for ifsc, info in ifsc_data.items():
    lat = safe_float(info.get("latitude"))
    lon = safe_float(info.get("longitude"))

    if lat is None or lon is None:
        continue

    out_file = f"{ATM_IFSC_DIR}/{ifsc}.json"
    if os.path.exists(out_file):
        continue

    atms = fetch_atms(lat, lon)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(atms, f, ensure_ascii=False, indent=2)

    print(f"✔ IFSC {ifsc}: {len(atms)} ATMs")
    time.sleep(SLEEP_SECONDS)

# ---------------- PIN ATMS ----------------
with open(PIN_JSON, "r", encoding="utf-8") as f:
    pin_data = json.load(f)

print("🔹 Fetching ATMs for PIN pages (3 km)...")
for pin, branches in pin_data.items():
    if not isinstance(branches, list) or not branches:
        continue

    lat = safe_float(branches[0].get("latitude"))
    lon = safe_float(branches[0].get("longitude"))

    if lat is None or lon is None:
        continue

    out_file = f"{ATM_PIN_DIR}/{pin}.json"
    if os.path.exists(out_file):
        continue

    atms = fetch_atms(lat, lon)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(atms, f, ensure_ascii=False, indent=2)

    print(f"✔ PIN {pin}: {len(atms)} ATMs")
    time.sleep(SLEEP_SECONDS)

print("✅ ATM data fetching completed (3 km radius)")
