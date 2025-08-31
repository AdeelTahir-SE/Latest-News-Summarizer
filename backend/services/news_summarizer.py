import os
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]  # Make sure this is set

# Define prompt template
prompt = PromptTemplate(
    input_variables=["news"],
    template=(
        "You are a news summarization agent. "
        "Summarize the following news in about 300 words. "
        "Do not add any commentary or extra text—only provide the summary.\n\n"
        "News:\n{news}"
    ),
)


# Initialize Gemini via LangChain
llm = GoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.5,
    google_api_key=GOOGLE_API_KEY,
)

chain = LLMChain(llm=llm, prompt=prompt)


def summarize_news(news: str):
    summarized_news = chain.run(news)
    return summarized_news
print(summarize_news("ai"))