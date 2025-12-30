from canonical import get_canonical_url

import json
import os

# ---------------- CONFIG ----------------
BASE_URL = "https://pinifsc.in"
BATCH_SIZE = 5000

PIN_JSON = "data/pincode.json"
IFSC_JSON = "data/ifsc.json"

PIN_DIR = "pincode"
IFSC_DIR = "ifsc"

os.makedirs(PIN_DIR, exist_ok=True)
os.makedirs(IFSC_DIR, exist_ok=True)

# ---------------- LOAD DATA ----------------
with open(PIN_JSON, "r", encoding="utf-8") as f:
    pincode_data = json.load(f)

with open(IFSC_JSON, "r", encoding="utf-8") as f:
    ifsc_data = json.load(f)

# ---------------- PIN PAGES (BATCHED) ----------------
pin_items = list(pincode_data.items())

for i in range(0, len(pin_items), BATCH_SIZE):
    batch = pin_items[i:i + BATCH_SIZE]
    print(f"Generating PIN pages {i} → {i + len(batch)}")

    for pin, branches in batch:
        rows = ""

        for b in branches:
            rows += f"""
            <tr>
              <td>{b['bank']}</td>
              <td>{b['branch']}</td>
              <td><a href="../ifsc/{b['ifsc']}.html">{b['ifsc']}</a></td>
            </tr>
            """

        page_path = f"pincode/{pin}.html"

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IFSC Codes in PIN Code {pin} | PinIFSC</title>
<meta name="description" content="Find all bank IFSC codes in PIN code {pin}.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="../assets/style.css">
<link rel="canonical" href="{get_canonical_url(page_path)}">
</head>
<body>

<h1>IFSC Codes in PIN Code {pin}</h1>

<table border="1" cellpadding="8" cellspacing="0">
<tr>
  <th>Bank</th>
  <th>Branch</th>
  <th>IFSC</th>
</tr>
{rows}
</table>

</body>
</html>
"""

        with open(f"{PIN_DIR}/{pin}.html", "w", encoding="utf-8") as f:
            f.write(html)

# ---------------- IFSC PAGES (BATCHED) ----------------
ifsc_items = list(ifsc_data.items())

for i in range(0, len(ifsc_items), BATCH_SIZE):
    batch = ifsc_items[i:i + BATCH_SIZE]
    print(f"Generating IFSC pages {i} → {i + len(batch)}")

    for ifsc, info in batch:
        page_path = f"ifsc/{ifsc}.html"

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{ifsc} IFSC Code | {info['bank']}</title>
<meta name="description" content="IFSC code {ifsc} of {info['bank']} {info['branch']}.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="../assets/style.css">
<link rel="canonical" href="{get_canonical_url(page_path)}">
</head>
<body>

<h1>{ifsc} – {info['bank']}</h1>

<p><strong>Branch:</strong> {info['branch']}</p>
<p><strong>PIN:</strong>
  <a href="../pincode/{info['pincode']}.html">
    {info['pincode']}
  </a>
</p>

</body>
</html>
"""

        with open(f"{IFSC_DIR}/{ifsc}.html", "w", encoding="utf-8") as f:
            f.write(html)

print("✅ HTML generation completed with SAFE canonical URLs")
