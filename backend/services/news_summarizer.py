from langchain.llms import ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain


prompt=PromptTemplate(
    input_variables=["news"],
    template="Summarize the following news in about 100 words: {news}",
)

llm=ollama.Ollama(
    model="llama2",
    temperature=0.5,
    top_p=0.5,
    top_k=50,
    max_tokens=1024,
)

chain=LLMChain(
    llm=llm,
    prompt=prompt,
)

def summarize_news(news:str):
    return chain.run(news)