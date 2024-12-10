import { JSX, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

type PopupProps = {
  searchText: string;
  resultType: string;
  semanticType: string;
  processType: string;
  onClose: () => void;
};

const SearchResultPopupHadith = ({
  searchText,
  resultType,
  semanticType,
  processType,
  onClose,
}: PopupProps) => {
  const [results, setResults] = useState<{ fileName: string; content: string }[]>([]);
  const [stopWords, setStopWords] = useState<string[]>([]);
  const [filteredWordsArray, setFilteredWordsArray] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const wordsArray =
    resultType === "Result word by word"
      ? searchText.split(" ").filter((word) => word.trim() !== "")
      : [searchText];

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/searchQuran", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ processType, wordsArray, semanticType }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const { matchingFiles, removedWords, filteredWordsArray } = await response.json();
        setResults(matchingFiles);
        setStopWords(removedWords);
        setFilteredWordsArray(filteredWordsArray);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, []);

  console.log("test: ", stopWords);

  let totalPages: number;
  let paginatedResults: { fileName: string; content: string; word?: string }[];

  if (resultType === "Result word by word") {
    // Group sentences by words
    const groupedResults: { [key: string]: { fileName: string; content: string }[] } = {};

    filteredWordsArray.forEach((word) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, "i"); // Exact word matching with word boundaries

      groupedResults[word] = results.filter((result) => wordRegex.test(result.content));
    });

    // Combine sentences in an ordered sequence (nabi first, then musa, etc.)
    const combinedResults = Object.entries(groupedResults).flatMap(([word, sentences]) => {
      return sentences.map((sentence) => ({ word, ...sentence }));
    });

    totalPages = Math.ceil(combinedResults.length / itemsPerPage);

    paginatedResults = combinedResults.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  } else {
    totalPages = Math.ceil(results.length / itemsPerPage);

    paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }

  const highlightKeywords = (content: string) => {
    return filteredWordsArray.reduce((acc, word) => {
      const wordRegex = new RegExp(`\\b(${word})\\b`, "gi"); // Word boundary ensures exact word matching
      return acc.replace(wordRegex, `<span class="bg-yellow-300">$1</span>`);
    }, content);
  };

  const renderPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex space-x-2 justify-center mt-2">
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-4 py-2 rounded ${
              num === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  const renderResults = () => {
    const displayedWords = new Set<string>();
    const elements: JSX.Element[] = [];

    paginatedResults.forEach((sentence: any, idx) => {
      if (!displayedWords.has(sentence.word)) {
        displayedWords.add(sentence.word);
        elements.push(
          <p key={`header-${sentence.word}`} className="mb-4">
            <strong> Word: </strong> {sentence.word}
          </p>
        );
      }

      elements.push(
        <div key={`file-${idx}`} className="mb-2">
          <p className="text-gray-500 italic text-sm">{sentence.surah}</p>
          <p className="text-gray-500 italic text-sm">
            {`${sentence.fileName}:${parseInt(sentence.fileName.slice(-3), 10)}`}{" "}
          </p>
          <div
            className="bg-gray-100 p-2 rounded break-words whitespace-normal"
            dangerouslySetInnerHTML={{ __html: highlightKeywords(sentence.content) }}
          />
        </div>
      );
    });

    return elements;
  };

  return (
    <div className="fixed inset-0 bg-blue-800 bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-3/4 h-5/6 overflow-hidden flex flex-col text-sm">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 font-bold text-xl rounded-full"
        >
          x
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Search Results</h2>

        {error ? (
          <div className="text-red-500">{error}</div>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex-1 overflow-y-scroll">
            <p>
              <strong> Full Query Without Stop Word(s): </strong>
              {filteredWordsArray.join(" ")}
            </p>

            <p>
              <strong> Stop Word(s): </strong>
              {stopWords.join(", ")}
            </p>

            {renderResults()}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-300"
          >
            First Page
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-red-400"
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPopupHadith;
