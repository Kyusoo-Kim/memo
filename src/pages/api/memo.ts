import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbPath = path.join(process.cwd(), "public", "db.json");
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  if (req.method === "POST") {
    const { content, tags } = req.body;

    const newMemo = {
      id: uuidv4(),
      content,
      tags,
    };

    db.push(newMemo);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json(newMemo);
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    const updatedDb = db.filter((memo: { id: string }) => memo.id !== id);

    fs.writeFileSync(dbPath, JSON.stringify(updatedDb, null, 2));

    res.status(200).json({ message: "Memo deleted successfully" });
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}