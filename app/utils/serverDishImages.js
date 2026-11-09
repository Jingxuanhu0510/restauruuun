import { REAL_DISHES_SOURCE } from "../data/dishes";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import files from "../data/image-files.json";
const folder = path.join(process.cwd(), ".dish-images");
const pending = new Map();
let queue = Promise.resolve();
export const validId = id => typeof id === "string" && /^(real-\d+|evo-(real|ai)-\d+-\d+)$/.test(id);

async function recipe(id) {
  if (id.startsWith("real-")) {
    const dish = REAL_DISHES_SOURCE[Number(id.slice(5))];
    if (!dish) throw new Error("Unknown dish");
    return { prompt: dish.name + ", " + dish.desc, refs: [] };
  }
  return JSON.parse(await readFile(path.join(folder, id + ".json"), "utf8"));
}

export async function imageFor(id) {
  if (files[id]) return readFile(path.join(process.cwd(), "public/menu-images", files[id]));
  const filename = path.join(folder, id + ".img");
  try { return await readFile(filename); } catch (error) { if (error.code !== "ENOENT") throw error; }
  if (pending.has(id)) return pending.get(id);
  const job = (async () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is required");
    const { prompt, refs } = await recipe(id);
    const parts = [{text: "Generate one fine dining food photograph combining the reference dishes. No text or watermarks. " + prompt}];
    for (const ref of refs) {
      const bytes = await imageFor(ref);
      parts.push({inlineData:{mimeType:bytes[0]===137?"image/png":"image/jpeg",data:bytes.toString("base64")}});
    }
    const generate = async () => {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent", {
        method: "POST", headers: {"x-goog-api-key":key,"Content-Type":"application/json"},
        body: JSON.stringify({contents:[{parts}],generationConfig:{responseModalities:["IMAGE"]}}), signal: AbortSignal.timeout(120000)
      });
      if (!res.ok) throw new Error("Gemini HTTP " + res.status);
      const data = (await res.json()).candidates?.[0]?.content?.parts?.find(p=>p.inlineData)?.inlineData;
      if (!data) throw new Error("Gemini returned no image");
      const bytes = Buffer.from(data.data,"base64");
      if (bytes[0] !== 137 && bytes[0] !== 255) throw new Error("Unsupported image");
      await mkdir(folder, { recursive: true });
      const tmp = filename + randomUUID();
      await writeFile(tmp, bytes);
      await rename(tmp, filename);
      return bytes;
    };
    const task = queue.then(generate);
    queue = task.catch(() => {});
    return task;
  })();
  pending.set(id, job);
  try { return await job; } finally { pending.delete(id); }
}

