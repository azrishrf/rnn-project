import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { processType, wordsArray, semanticType } = req.body;

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

    // Apply stemming if processType requires it
    if (
      processType === "Stemming Malay Query Malay Document" ||
      processType === "Stemming English Query English Document"
    ) {
      // Stemming function to find and apply the most specific match
      const applyStemming = (word: string) => {
        let bestMatch = { prefix: "", suffix: "", length: 0 };

        for (const entry of suffixList) {
          const [prefix, suffix] = entry.split("+"); // Split into prefix and suffix
          const startsWithPrefix = word.startsWith(prefix);
          const endsWithSuffix = word.endsWith(suffix);

          if (startsWithPrefix && endsWithSuffix) {
            const matchLength = prefix.length + suffix.length; // Total match length
            if (matchLength > bestMatch.length) {
              bestMatch = { prefix, suffix, length: matchLength }; // Update best match
            }
          }
        }

        // Apply the best match, if found
        if (bestMatch.length > 0) {
          const { prefix, suffix } = bestMatch;
          return word.slice(prefix.length, word.length - suffix.length);
        }

        return word; // Return original word if no match
      };

      // Example usage
      let stemmingPath;
      if (processType === "Stemming Malay Query Malay Document") {
        stemmingPath = path.join(process.cwd(), "public", "data", "stemming", "malay.txt");
      } else if (processType === "Stemming English Query English Document") {
        stemmingPath = path.join(process.cwd(), "public", "data", "stemming", "english.txt");
      }

      const stemmingContent = fs.readFileSync(stemmingPath as string, "utf-8");
      const suffixList = stemmingContent
        .split("\n")
        .map((suffix) => suffix.trim().toLowerCase())
        .filter(Boolean);

      filteredWordsArray = filteredWordsArray.map(applyStemming);

      console.log("test: ", filteredWordsArray);
    }

    if (
      processType === "Stemming Malay Query Stemming Malay Document" ||
      processType === "Stemming English Query Stemming English Document"
    ) {
      // Function to generate variations of the root word
      const generateWordVariations = (rootWord: string) => {
        const variations = new Set<string>();
        suffixList.forEach((entry) => {
          const [, suffix] = entry.split("+"); // Use only the suffix part
          variations.add(rootWord + suffix);
        });
        return Array.from(variations);
      };

      // Stemming function to find and apply the most specific match
      const applyStemming = (word: string) => {
        let bestMatch = { prefix: "", suffix: "", length: 0 };

        for (const entry of suffixList) {
          const [prefix, suffix] = entry.split("+"); // Split into prefix and suffix
          const startsWithPrefix = word.startsWith(prefix);
          const endsWithSuffix = word.endsWith(suffix);

          if (startsWithPrefix && endsWithSuffix) {
            const matchLength = prefix.length + suffix.length; // Total match length
            if (matchLength > bestMatch.length) {
              bestMatch = { prefix, suffix, length: matchLength }; // Update best match
            }
          }
        }

        // Apply the best match, if found
        if (bestMatch.length > 0) {
          const { prefix, suffix } = bestMatch;
          return word.slice(prefix.length, word.length - suffix.length);
        }

        return word; // Return original word if no match
      };

      // Load the appropriate stemming list based on processType
      let stemmingPath;
      if (processType === "Stemming Malay Query Stemming Malay Document") {
        stemmingPath = path.join(process.cwd(), "public", "data", "stemming", "malay.txt");
      } else if (processType === "Stemming English Query Stemming English Document") {
        stemmingPath = path.join(process.cwd(), "public", "data", "stemming", "english.txt");
      }

      const stemmingContent = fs.readFileSync(stemmingPath as string, "utf-8");
      const suffixList = stemmingContent
        .split("\n")
        .map((suffix) => suffix.trim().toLowerCase())
        .filter(Boolean);

      // Extract root words and generate variations
      const wordVariationsSet = new Set<string>();

      filteredWordsArray.forEach((word) => {
        const rootWord = applyStemming(word); // Extract root word
        const variations = generateWordVariations(rootWord); // Generate variations
        variations.forEach((variant) => wordVariationsSet.add(variant)); // Add to the set
      });

      // Update the filteredWordsArray to include all variations
      filteredWordsArray = Array.from(wordVariationsSet);

      console.log("Generated variations: ", filteredWordsArray);
    }

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

    // Load surah names
    const surahPath = path.join(process.cwd(), "public", "data", "quran", "surah.txt");
    const surahContent = fs.readFileSync(surahPath, "utf-8");
    const surahNames = surahContent
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    // Path to the directory containing the files
    let directoryPath;
    if (
      processType === "Malay Query Malay Document" ||
      processType === "Stemming Malay Query Malay Document" ||
      processType === "Stemming Malay Query Stemming Malay Document"
    ) {
      directoryPath = path.join(process.cwd(), "public", "data", "quran", "malay");
    } else if (
      processType === "English Query English Document" ||
      processType === "Stemming English Query English Document" ||
      processType === "Stemming English Query Stemming English Document"
    ) {
      directoryPath = path.join(process.cwd(), "public", "data", "quran", "english");
    }
    const files = fs.readdirSync(directoryPath as string);

    const matchingFiles: { fileName: string; content: string; surah: string }[] = [];

    for (const file of files) {
      const filePath = path.join(directoryPath as string, file);
      let fileContent = fs.readFileSync(filePath, "utf-8");

      // Remove leading numbers or "|" from each line
      fileContent = fileContent
        .split("\n")
        .map((line) => line.replace(/^[0-9.,|]+/, "").trim())
        .join("\n");

      const containsMatch = filteredWordsArray.some((word) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, "i");
        return wordRegex.test(fileContent);
      });

      if (containsMatch) {
        // Extract surah number and ayat
        const surahNumber = parseInt(file.substring(1, 4), 10); // Extract digits after "q"
        const surahName = surahNames[surahNumber - 1] || "Unknown Surah";
        // Remove the .txt extension from the file name
        const fileNameWithoutExtension = path.parse(file).name;

        matchingFiles.push({
          fileName: fileNameWithoutExtension,
          content: fileContent,
          surah: surahName,
        });
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
