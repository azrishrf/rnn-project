import { useState } from "react";
import SearchResultPopup from "../../components/quran/SearchResultPopup";

const Quran = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedTxt, setSelectedTxt] = useState("1.txt");
  const [disabledValue, setDisabledValue] = useState(19);
  const [resultType, setResultType] = useState("Result word by word");
  const [semanticType, setSemanticType] = useState("Non semantic");
  const [processType, setProcessType] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleTxtChange = (e: any) => {
    const value = e.target.value;
    setSelectedTxt(value);

    if (value === "1.txt") {
      setDisabledValue(19);
    } else if (value === "2.txt") {
      setDisabledValue(74);
    } else if (value === "3.txt") {
      setDisabledValue(26);
    } else if (value === "4.txt") {
      setDisabledValue(3);
    } else if (value === "5.txt") {
      setDisabledValue(43);
    } else if (value === "6.txt") {
      setDisabledValue(10);
    } else if (value === "7.txt") {
      setDisabledValue(13);
    } else if (value === "8.txt") {
      setDisabledValue(8);
    } else if (value === "9.txt") {
      setDisabledValue(10);
    } else if (value === "10.txt") {
      setDisabledValue(6);
    } else if (value === "11.txt") {
      setDisabledValue(39);
    } else if (value === "12.txt") {
      setDisabledValue(1252);
    } else if (value === "13.txt") {
      setDisabledValue(8);
    } else if (value === "14.txt") {
      setDisabledValue(3);
    } else if (value === "15.txt") {
      setDisabledValue(51);
    } else {
      setDisabledValue(Math.floor(Math.random() * 50) + 1); // Random number for other txt
    }
  };

  const handleSearch = () => {
    setIsPopupOpen(true);

    console.log({
      searchText,
      selectedTxt,
      disabledValue,
      resultType,
      semanticType,
      processType,
    });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedTxt("1.txt");
    setDisabledValue(19);
    setResultType("Result word by word");
    setSemanticType("Non semantic");
    setProcessType("");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">CARIAN AYAT QURAN</h1>

      {/* Row 1 */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <label className="font-semibold text-gray-700 text-lg">Sila Masukan Perkataan:</label>
        <input
          type="text"
          id="searchSentence"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Enter text here..."
          className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
        <div>
          <label className="font-semibold text-gray-700 text-lg block mb-2">Sila Pilih:</label>
          <select
            value={selectedTxt}
            onChange={handleTxtChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {Array.from({ length: 36 }, (_, i) => (
              <option key={i} value={`${i + 1}.txt`}>
                {i + 1}.txt
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-gray-700 text-lg block mb-2">Jumlah:</label>
          <input
            type="text"
            value={disabledValue}
            disabled
            className="w-full p-3 border rounded-md shadow-sm bg-gray-200 text-gray-600"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <label className="font-semibold text-gray-700 text-lg">Sila pilih:</label>
        <select
          value={resultType}
          onChange={(e) => setResultType(e.target.value)}
          className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option>Result word by word</option>
          <option>Result by query</option>
        </select>
      </div>

      {/* Row 4 */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <label className="font-semibold text-gray-700 text-lg">Sila pilih:</label>
        <select
          value={semanticType}
          onChange={(e) => setSemanticType(e.target.value)}
          className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option>Non semantic</option>
          <option>Semantic</option>
          <option>Hybrid semantic</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mb-8">
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          Cari
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md shadow hover:bg-gray-600 focus:ring-2 focus:ring-gray-400"
        >
          Reset
        </button>
      </div>

      {/* Sentence */}
      <p className="font-semibold text-gray-700 text-lg mb-4">
        Sila Pilih Jenis Proses/Please Choose A Process:
      </p>

      {/* Radio Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          //   "Arabic Query Arabic Document",
          //   "Malay Query Malay Document",
          //   "English Query English Document",
          //   "Stemming Arabic Query Arabic Document",
          //   "Stemming Malay Query Malay Document",
          //   "Stemming English Query English Document",
          //   "Stemming Arabic Query Stemming Arabic Document",
          //   "Stemming Malay Query Stemming Malay Document",
          //   "Stemming English Query Stemming English Document",
          //   "Arabic Query English Document",
          //   "Malay Query English Document",
          //   "English Query Malay Document",
          //   "Stemming Arabic Query English Document",
          //   "Stemming Malay Query English Document",
          //   "Stemming English Query Malay Document",
          //   "Stemming Arabic Query Stemming English Document",
          //   "Stemming Malay Query Stemming English Document",
          //   "Stemming English Query Stemming Malay Document",
          //   "Arabic Query Malay Document",
          //   "Malay Query Arabic Document",
          //   "English Query Arabic Document",
          //   "Stemming Arabic Query Malay Document",
          //   "Stemming Malay Query Arabic Document",
          //   "Stemming English Query Arabic Document",
          //   "Stemming Arabic Query Stemming Malay Document",
          //   "Stemming Malay Query Stemming Arabic Document",
          //   "Stemming English Query Stemming Arabic Document",
          "Malay Query Malay Document",
          "Stemming Malay Query Malay Document",
          "Stemming Malay Query Stemming Malay Document",

          "English Query English Document",
          "Stemming English Query English Document",
          "Stemming English Query Stemming English Document",
        ].map((option, index) => (
          <label
            key={index}
            className="flex items-center space-x-2 p-2 border rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
          >
            <input
              type="radio"
              name="processType"
              value={option}
              checked={processType === option}
              onChange={(e) => setProcessType(e.target.value)}
              className="form-radio h-5 w-5 text-blue-500"
            />
            <span className="text-gray-700">{option}</span>
            <br />
          </label>
        ))}
      </div>

      {/* Render Popup */}
      {isPopupOpen && (
        <SearchResultPopup
          searchText={searchText}
          //   selectedTxt={selectedTxt}
          resultType={resultType}
          semanticType={semanticType}
          processType={processType}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Quran;
