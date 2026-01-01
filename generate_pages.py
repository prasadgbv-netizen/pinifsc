import json
import os

BASE_URL = "https://pinifsc.in"

PIN_JSON = "data/pincode.json"
IFSC_JSON = "data/ifsc.json"

PIN_DIR = "pincode"
IFSC_DIR = "ifsc"

os.makedirs(PIN_DIR, exist_ok=True)
os.makedirs(IFSC_DIR, exist_ok=True)

def canonical(path):
    return f"{BASE_URL}/{path}"

# ---------------- LOAD DATA ----------------
with open(PIN_JSON, "r", encoding="utf-8") as f:
    pin_data = json.load(f)

with open(IFSC_JSON, "r", encoding="utf-8") as f:
    ifsc_data = json.load(f)

# ================= PIN PAGES =================
for pin, branches in pin_data.items():

    pin_clean = str(pin).strip()

    if not isinstance(branches, list) or not branches:
        continue

    lat = branches[0].get("latitude")
    lng = branches[0].get("longitude")

    rows = ""

    for b in branches:
        map_link = ""
        if lat and lng:
            map_link = (
                f'<a href="https://www.google.com/maps?q={lat},{lng}" '
                f'target="_blank" rel="noopener">📍 Map</a>'
            )

        rows += f"""
        <tr>
          <td>{b.get("bank","")}</td>
          <td>{b.get("branch","")}</td>
          <td>
            <a href="../ifsc/{b.get("ifsc","")}.html">
              {b.get("ifsc","")}
            </a>
          </td>
          <td>{map_link}</td>
        </tr>
        """

    page_path = f"pincode/{pin_clean}.html"

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IFSC Codes in PIN Code {pin_clean} | PinIFSC</title>
<meta name="description" content="Find all bank IFSC codes available in PIN code {pin_clean} across India.">
<link rel="canonical" href="{canonical(page_path)}">
<link rel="stylesheet" href="../assets/style.css">
</head>

<body>

<header class="header">
  <div class="container">
    <div class="logo">
      <a href="/" style="color:#fff;text-decoration:none;">PinIFSC India</a>
    </div>
  </div>
</header>

<main class="container">

<h1>IFSC Codes in PIN Code {pin_clean}</h1>

<table border="1" cellpadding="8" cellspacing="0" width="100%">
<tr>
  <th>Bank</th>
  <th>Branch</th>
  <th>IFSC</th>
  <th>Map</th>
</tr>
{rows}
</table>

</main>

</body>
</html>
"""

    with open(f"{PIN_DIR}/{pin_clean}.html", "w", encoding="utf-8") as f:
        f.write(html)

# ================= IFSC PAGES =================
for ifsc, info in ifsc_data.items():

    ifsc_clean = str(ifsc).strip()
    pin_clean = str(info.get("pincode", "")).strip()

    page_path = f"ifsc/{ifsc_clean}.html"

    lat = info.get("latitude")
    lng = info.get("longitude")

    map_block = ""
    if lat and lng:
        map_block = f"""
        <p>
          <a href="https://www.google.com/maps?q={lat},{lng}"
             target="_blank" rel="noopener">
            📍 View on Google Maps
          </a>
        </p>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{ifsc_clean} IFSC Code | {info.get("bank","")}</title>
<meta name="description" content="IFSC code {ifsc_clean} of {info.get("bank","")} {info.get("branch","")}.">
<link rel="canonical" href="{canonical(page_path)}">
<link rel="stylesheet" href="../assets/style.css">
</head>

<body>

<header class="header">
  <div class="container">
    <div class="logo">
      <a href="/" style="color:#fff;text-decoration:none;">PinIFSC India</a>
    </div>
  </div>
</header>

<main class="container">

<h1>{ifsc_clean} – {info.get("bank","")}</h1>

<p><strong>Branch:</strong> {info.get("branch","N/A")}</p>
<p><strong>Address:</strong> {info.get("address","N/A")}</p>
<p><strong>MICR:</strong> {info.get("micr","N/A")}</p>

<p><strong>PIN:</strong>
  <a href="../pincode/{pin_clean}.html">{pin_clean}</a>
</p>

{map_block}

</main>

</body>
</html>
"""

    with open(f"{IFSC_DIR}/{ifsc_clean}.html", "w", encoding="utf-8") as f:
        f.write(html)

print("✅ PIN & IFSC pages generated successfully (uniform header + home navigation)")
