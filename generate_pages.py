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

# ---------------- PIN PAGES ----------------
for pin, branches in pin_data.items():
    rows = ""

    for b in branches:
        map_link = ""
        if "latitude" in b and "longitude" in b:
            map_link = f'''
            <a href="https://www.google.com/maps?q={b["latitude"]},{b["longitude"]}"
               target="_blank" rel="noopener">📍 Map</a>
            '''

        rows += f"""
        <tr>
          <td>{b["bank"]}</td>
          <td>{b["branch"]}</td>
          <td><a href="../ifsc/{b["ifsc"]}.html">{b["ifsc"]}</a></td>
          <td>{map_link}</td>
        </tr>
        """

    page_path = f"pincode/{pin}.html"

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IFSC Codes in PIN Code {pin} | PinIFSC</title>
<meta name="description" content="Find all bank IFSC codes in PIN code {pin}.">
<link rel="canonical" href="{canonical(page_path)}">
<link rel="stylesheet" href="../assets/style.css">
</head>
<body>

<h1>IFSC Codes in PIN Code {pin}</h1>

<table border="1" cellpadding="8">
<tr>
<th>Bank</th>
<th>Branch</th>
<th>IFSC</th>
<th>Map</th>
</tr>
{rows}
</table>

</body>
</html>
"""

    with open(f"{PIN_DIR}/{pin}.html", "w", encoding="utf-8") as f:
        f.write(html)

# ---------------- IFSC PAGES ----------------
for ifsc, info in ifsc_data.items():
    page_path = f"ifsc/{ifsc}.html"

    map_block = ""
    if "latitude" in info and "longitude" in info:
        map_block = f"""
        <p>
        <a href="https://www.google.com/maps?q={info["latitude"]},{info["longitude"]}"
           target="_blank" rel="noopener">
        📍 View on Google Maps
        </a>
        </p>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{ifsc} IFSC Code | {info["bank"]}</title>
<meta name="description" content="IFSC code {ifsc} of {info["bank"]} {info["branch"]}.">
<link rel="canonical" href="{canonical(page_path)}">
<link rel="stylesheet" href="../assets/style.css">
</head>
<body>

<h1>{ifsc} – {info["bank"]}</h1>

<p><strong>Branch:</strong> {info["branch"]}</p>
<p><strong>Address:</strong> {info.get("address", "N/A")}</p>
<p><strong>MICR:</strong> {info.get("micr", "N/A")}</p>
<p><strong>PIN:</strong>
<a href="../pincode/{info["pincode"]}.html">{info["pincode"]}</a>
</p>

{map_block}

</body>
</html>
"""

    with open(f"{IFSC_DIR}/{ifsc}.html", "w", encoding="utf-8") as f:
        f.write(html)

print("✅ PIN & IFSC pages generated with maps + canonicals")
