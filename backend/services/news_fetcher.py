from bs4 import BeautifulSoup
import requests
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/91.0.4472.124 Safari/537.36"
}


def fetch_news(query: str) -> bytes:
    url = f"https://news.google.com/rss/search?q={query}&hl=en&gl=US&ceid=US:en"
    result = requests.get(url, headers=headers)
    return result.content


def news_parser(xml_text: bytes):
    soup = BeautifulSoup(xml_text, "xml")

    # Main container for JSON
    json_data = {
        "channel_title": soup.find("title").text,
        "channel_link": soup.find("link").text,
        "items": [],
    }

    # Collect items
    for item in soup.find_all("item"):
        news_item = {
            "title": item.title.text if item.title else None,
            "link": item.link.text if item.link else None,
            "pub_date": item.pubDate.text if item.pubDate else None,
            "news_channel": item.source.text if item.source else None,
            "news_channel_link": item.source["url"] if item.source else None,
        }
        json_data["items"].append(news_item)

    return json.dumps(json_data, indent=4)


# Run
result = fetch_news("ai")
parsed_news = news_parser(result)

