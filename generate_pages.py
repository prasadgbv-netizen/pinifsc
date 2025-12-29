import json
import os

BASE_URL = "https://pinifsc.in"

# Paths
PINCODE_JSON = "data/pincode.json"
IFSC_JSON = "data/ifsc.json"
PIN_DIR = "pincode"
IFSC_DIR = "ifsc"

os.makedirs(PIN_DIR, exist_ok=True)
os.makedirs(IFSC_DIR, exist_ok=True)

# Load data
with open(PINCODE_JSON, "r", encoding="utf-8") as f:
    pincodes = json.load(f)

with open(IFSC_JSON, "r", encoding="utf-8") as f:
    ifscs = json.load(f)

sitemap_urls = [f"{BASE_URL}/"]

# -------- Generate PIN pages --------
for pin, branches in pincodes.items():
    rows = ""
    for b in branches:
        rows += f"""
        <tr>
          <td>{b['bank']}</td>
          <td>{b['branch']}</td>
          <td>
            <a href="../ifsc/{b['ifsc']}.html">{b['ifsc']}</a>
          </td>
        </tr>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IFSC Codes in PIN Code {pin} | PinIFSC</title>
  <meta name="description" content="Find all bank IFSC codes in PIN code {pin}.">
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header class="header">
  <div class="container"><div class="logo">PinIFSC India</div></div>
</header>

<main class="container">
<h1>IFSC Codes in PIN Code {pin}</h1>
<table border="1" width="100%" cellpadding="10">
<tr><th>Bank</th><th>Branch</th><th>IFSC</th></tr>
{rows}
</table>
</main>
</body>
</html>
"""

    file_path = f"{PIN_DIR}/{pin}.html"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)

    sitemap_urls.append(f"{BASE_URL}/pincode/{pin}.html")

# -------- Generate IFSC pages --------
for ifsc, info in ifscs.items():
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{ifsc} IFSC Code | {info['bank']} {info['branch']}</title>
  <meta name="description" content="IFSC code {ifsc} belongs to {info['bank']} {info['branch']}.">
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header class="header">
  <div class="container"><div class="logo">PinIFSC India</div></div>
</header>

<main class="container">
<h1>{ifsc} – {info['bank']}</h1>
<p><strong>Branch:</strong> {info['branch']}</p>
<p><strong>PIN Code:</strong>
  <a href="../pincode/{info['pincode']}.html">{info['pincode']}</a>
</p>
</main>
</body>
</html>
"""

    file_path = f"{IFSC_DIR}/{ifsc}.html"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)

    sitemap_urls.append(f"{BASE_URL}/ifsc/{ifsc}.html")

# -------- Generate sitemap.xml --------
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for url in sitemap_urls:
        f.write(f"  <url><loc>{url}</loc></url>\n")
    f.write('</urlset>')

print("✅ Pages & sitemap generated successfully")
