def get_canonical_url(page_path: str) -> str:
    """
    Returns a SAFE, self-referencing canonical URL.

    Rules:
    - Homepage → https://pinifsc.in/
    - All other pages → https://pinifsc.in/<path>
    """

    BASE = "https://pinifsc.in"

    # Normalize
    page_path = page_path.strip()

    # Homepage
    if page_path in ("", "/", "index.html"):
        return f"{BASE}/"

    # Remove leading slash if present
    if page_path.startswith("/"):
        page_path = page_path[1:]

    return f"{BASE}/{page_path}"
