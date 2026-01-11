import json
import os
import re
from collections import defaultdict

PIN_JSON = "data/pincode.json"
OUT_FILE = "data/area_pin_index.json"


def normalize(text: str) -> str:
    """
    Normalize area names for reliable search:
    - lowercase
    - remove special chars
    - collapse spaces
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_area_candidates(branch: dict) -> list[str]:
    """
    Extract possible area/locality names from branch data
    """
    candidates = []

    branch_name = branch.get("branch", "")
    address = branch.get("address", "")

    if branch_name:
        candidates.append(branch_name)

    if address:
        # Split address into parts
        parts = re.split(r",|-", address)
        candidates.extend(parts)

    return candidates


def main():
    if not os.path.exists(PIN_JSON):
        raise FileNotFoundError(f"{PIN_JSON} not found")

    with open(PIN_JSON, "r", encoding="utf-8") as f:
        pin_data = json.load(f)

    index = defaultdict(dict)

    for pin, branches in pin_data.items():
        if not isinstance(branches, list):
            continue

        for b in branches:
            district = b.get("district", "").strip()
            state = b.get("state", "").strip()

            for raw_area in extract_area_candidates(b):
                area = normalize(raw_area)
                if not area or len(area) < 3:
                    continue

                # Deduplicate by PIN
                index[area][pin] = {
                    "pin": pin,
                    "district": district,
                    "state": state,
                }

    # Convert dict-of-dict to dict-of-list
    final_index = {
        area: list(pins.values())
        for area, pins in sorted(index.items())
    }

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(final_index, f, ensure_ascii=False, indent=2)

    print(f"✅ Area → PIN index generated: {OUT_FILE}")
    print(f"📦 Total unique areas: {len(final_index)}")


if __name__ == "__main__":
    main()
