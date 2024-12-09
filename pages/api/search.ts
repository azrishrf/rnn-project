import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { wordsArray, semanticType } = req.body;

  console.log("test: ", semanticType);

  if (!wordsArray || !Array.isArray(wordsArray)) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    // Load stopwords
    const stopwordPath = path.join(process.cwd(), "public", "data", "stopword", "malay.txt");
    const stopwordContent = fs.readFileSync(stopwordPath, "utf-8");
    const stopwords = stopwordContent
      .split("\n")
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);

    // Filter stopwords from wordsArray
    const wordsArrayLower = wordsArray.map((word) => word.toLowerCase());
    const removedWords = wordsArrayLower.filter((word) => stopwords.includes(word));
    let filteredWordsArray = wordsArray.filter((word) => !stopwords.includes(word.toLowerCase()));

    // Handle semantic type expansion
    if (semanticType === "Semantic") {
      const semanticPath = path.join(process.cwd(), "public", "data", "semantic", "malay.txt");
      const semanticContent = fs.readFileSync(semanticPath, "utf-8");
      const semanticMappings = semanticContent
        .split("\n")
        .map((line) => line.trim().split(/\s+/).filter(Boolean));

      const expandedWords = new Set(filteredWordsArray);

      // Expand filteredWordsArray using semantic mappings
      filteredWordsArray.forEach((word) => {
        semanticMappings.forEach((group) => {
          if (group.includes(word)) {
            group.forEach((relatedWord) => expandedWords.add(relatedWord));
          }
        });
      });

      filteredWordsArray = Array.from(expandedWords);
    }

    // Path to the directory containing the files
    const directoryPath = path.join(process.cwd(), "public", "data", "quran", "malay");
    const files = fs.readdirSync(directoryPath);

    const matchingFiles: { fileName: string; content: string }[] = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      console.log("test: ", filteredWordsArray);
      const containsMatch = filteredWordsArray.some((word) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, "i");
        return wordRegex.test(fileContent);
      });

      if (containsMatch) {
        matchingFiles.push({ fileName: file, content: fileContent });
      }
    }

    return res.status(200).json({
      matchingFiles,
      removedWords,
      filteredWordsArray,
    });
  } catch (error) {
    console.error("Error reading files:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
