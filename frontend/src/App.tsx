import { useState } from "react";
import { Search, Calendar, ExternalLink, Globe } from "lucide-react";
import Modal from "react-modal";

type NewsType = {
  title: string;
  link: string;
  pub_date: string;
  news_channel: string;
  news_channel_link: string;
};

export default function App() {
  const [query, setQuery] = useState("");
  const [news, setNews] = useState<NewsType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/news/?query=${query}`,
        {
          method: "GET",
        }
      );
      const newsResponse = await response?.json();
      setNews(JSON.parse(newsResponse?.news)?.items || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}

      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📰 News Summarizer
            </h1>
            <p className="text-gray-600">
              Stay informed with the latest news from around the world
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for news topics, keywords, or events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              className="w-full pl-12 pr-32 py-4 border border-gray-300 rounded-xl text-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {news?.length > 0 && (
            <div className="text-center">
              <p className="text-gray-600">
                Found{" "}
                <span className="font-semibold text-gray-900">
                  {news.length}
                </span>{" "}
                articles
              </p>
            </div>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {news?.length > 0 ? (
              news.map((item, index) => (
                <NewsCard key={item.link} {...item} index={index} />
              ))
            ) : !isLoading ? (
              <div className="col-span-full text-center py-16">
                <div className="mb-4">
                  <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Ready to explore the news
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Enter a keyword or topic above to discover the latest
                    articles and stay up to date with current events.
                  </p>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}

function NewsCard({
  title,
  link,
  pub_date,
  news_channel,
  news_channel_link,
  index,
}: NewsType & { index: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [summarizedNews, setSummarizedNews] = useState<string>("");
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  async function handleSummarize(title: string, news_channel: string) {
    setIsModalOpen(true);

    const response = await fetch(
      `http://localhost:8000/news/summarize/?news=${JSON.stringify({
        title,
        news_channel,
        news_channel_link,
        pub_date,
        link,
      })}`
    );
    const newsSummary = await response?.json();
    setSummarizedNews(newsSummary?.summary);
  }

  return (
    <article
      className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 group"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setSummarizedNews("");
        }}
        className="max-w-[80%] mx-auto p-6 bg-white rounded-xl shadow-lg"
        overlayClassName="fixed inset-0  bg-opacity-50 flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Summarized News
          </h2>
          <p className="text-gray-600">
            {summarizedNews ? summarizedNews : "Summarizing..."}
          </p>
        </div>
      </Modal>
      <div className="flex flex-col h-full">
        {/* Title */}
        <h2 className="font-semibold text-xl mb-3 text-gray-900 leading-tight line-clamp-3 group-hover:text-blue-700 transition-colors duration-200">
          {title}
        </h2>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(pub_date)}</span>
          </div>
        </div>

        {/* Links */}
        <div className="mt-auto space-y-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group/link"
          >
            <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform duration-200" />
            Read Full Article
          </a>

          <div className="flex flex-row items-center justify-between border-t border-gray-100 pt-3">
            <a
              href={news_channel_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{news_channel}</span>
            </a>
            <button
              onClick={() => handleSummarize(title, news_channel)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-bold cursor-pointer duration-200"
            >
              Summarize
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
document.head.appendChild(style);
