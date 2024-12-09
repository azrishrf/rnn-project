import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const directoryPath = path.join(process.cwd(), "public", "data", "quran", "malaytest");

  try {
    const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith(".txt"));
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    res.status(500).json({ error: "Unable to read files" });
  }
}
