import { FC } from "react";

const Home: FC = () => {
  const redirectToQuran = () => {
    window.location.href = "/quran";
  };

  const redirectToHadith = () => {
    window.location.href = "/hadith";
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-400">
      <h1 className="text-4xl font-bold text-blue-900">SISTEM CARIAN AYAT QURAN AND HADITH</h1>
      <br />

      <p className="text-lg text-gray-700 mt-4">
        <button
          onClick={redirectToQuran}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          QURAN
        </button>
        <br /> <br />
        <button
          onClick={redirectToHadith}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          HADITH
        </button>
      </p>
    </div>
  );
};

export default Home;
