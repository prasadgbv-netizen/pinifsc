import os

BASE_URL = "https://pinifsc.in"
OUT_DIR = "sitemaps"
MAX_URLS = 25000

os.makedirs(OUT_DIR, exist_ok=True)

def write_sitemap(name, urls):
    with open(f"{OUT_DIR}/{name}", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in urls:
            f.write(f"<url><loc>{u}</loc></url>\n")
        f.write("</urlset>")

# PIN sitemaps
pins = [f"{BASE_URL}/pincode/{f}" for f in os.listdir("pincode") if f.endswith(".html")]
for i in range(0, len(pins), MAX_URLS):
    write_sitemap(f"sitemap-pincode-{i//MAX_URLS+1}.xml", pins[i:i+MAX_URLS])

# IFSC sitemaps
ifscs = [f"{BASE_URL}/ifsc/{f}" for f in os.listdir("ifsc") if f.endswith(".html")]
for i in range(0, len(ifscs), MAX_URLS):
    write_sitemap(f"sitemap-ifsc-{i//MAX_URLS+1}.xml", ifscs[i:i+MAX_URLS])

# Sitemap index
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for sm in os.listdir(OUT_DIR):
        f.write(f"<sitemap><loc>{BASE_URL}/sitemaps/{sm}</loc></sitemap>\n")
    f.write("</sitemapindex>")

print("✅ Sitemaps generated")
