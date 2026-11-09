import { readFile } from "node:fs/promises";
import path from "node:path";
import { validId } from "../../utils/serverDishImages";
export const dynamic = "force-dynamic";
export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!validId(id)) return new Response(null,{status:400});
  try {
    const bytes = await readFile(path.join(process.cwd(), ".dish-images", id + ".img"));
    return new Response(bytes,{headers:{"Content-Type":bytes[0]===137?"image/png":"image/jpeg"}});
  } catch { return new Response(null,{status:404,headers:{"Cache-Control":"no-store"}}); }
}