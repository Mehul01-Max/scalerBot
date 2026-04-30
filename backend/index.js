import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import { AshumanSystemPrompt } from "./AshumanSystemPrompt.js";
import { AbhimanyuSystemPrompt } from "./AbhimanyuSystemPrompt.js";
import { KshitijSystemPrompt } from "./KshitijSystemPrompt.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({}));

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

let messages = [{ role: "system", content: AshumanSystemPrompt }];

let personas = {
  Anshuman: AshumanSystemPrompt,
  Abhimanyu: AbhimanyuSystemPrompt,
  Kshitij: KshitijSystemPrompt,
};

app.post("/chat", async (req, res) => {
  let { query } = req.body;
  messages.push({
    role: "user",
    content: query,
  });
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: messages,
  });
  messages.push({
    role: "assistant",
    content: response.choices[0].message.content,
  });

  res.json({ response: response.choices[0].message });
});

app.put("/changePersona/:persona", (req, res) => {
  let { persona } = req.params;
  messages = [{ role: "system", content: personas[persona] }];
  console.log(persona);
  console.log(messages);
  res.json({ response: "Change successful " });
});

app.use(express.json());

app.listen(3000, () => {
  console.log("listening to port 3000");
});
