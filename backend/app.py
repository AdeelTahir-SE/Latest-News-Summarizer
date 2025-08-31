from fastapi import FastAPI
from services.news_fetcher import fetch_news, news_parser
from services.news_summarizer import summarize_news
import logging

# from services.news_summarizer import summarize_news
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/news/")
async def get_news(query: str):
    logging.info(f"Fetching news for query: {query}")
    try:
        news = fetch_news(query)
        parsed_news = news_parser(news)
        if not parsed_news:
            return {"news": []}  # ✅ always return a list
        return {"news": parsed_news}
    except Exception as e:
        logging.error(f"Error fetching news: {e}")
        return {"news": []}  # ✅ never return empty body


@app.get("/news/summarize/")
async def summarize_news_controller(news: str):
    logging.info(f"Summarizing news: {news}")
    try:
        logging.log(level=logging.INFO, msg=f"Summarizing news {news}")
        summarized_news = summarize_news(news)
    except Exception as e:
        logging.error(f"Error summarizing news: {e}")
        return {"summary": ""}
    return {"summary": summarized_news}
