import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { REAL_DISHES_SOURCE } from "../../data/dishes";
import { evolveMenu } from "../../utils/mutationEngine";
import { normalizeDescription } from "../../utils/normalizeDescription";
import { imageFor } from "../../utils/serverDishImages";

export const dynamic = "force-dynamic";
const directory = path.join(process.cwd(), ".dish-images");
const stateFile = path.join(directory,"restaurant.json");
const jobs = globalThis.restaurantJobs ??= { tail: Promise.resolve(), running: new Set() };
function serialized(fn) {
  const task = jobs.tail.then(fn);
  jobs.tail = task.catch(() => {});
  return task;
}
async function load() {
  try { return JSON.parse(await readFile(stateFile,"utf8")); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const menu = REAL_DISHES_SOURCE.map((dish,i) => {
    const {en,zh} = normalizeDescription(dish.desc);
    return {...dish,id:"real-"+i,type:"real",orderCount:0,desc_en:en,desc_zh:zh};
  });
  return {menu,evolutionStep:0,orders:{}};
}
async function save(state) {
  await mkdir(directory,{recursive:true});
  const temp = stateFile + randomUUID();
  await writeFile(temp,JSON.stringify(state));
  await rename(temp,stateFile);
}
function view(state) {return {menu:state.menu,evolutionStep:state.evolutionStep};}
function runImages(dishes) {
  for (const dish of dishes.filter(d=>d.imagePending)) {
    if (jobs.running.has(dish.id)) continue;
    jobs.running.add(dish.id);
    imageFor(dish.id).then(()=>null,error=>error).then(error=>serialized(async()=>{
      const state=await load();
      const current=state.menu.find(d=>d.id===dish.id);
      if (current) Object.assign(current,{imagePending:false,imageFailed:Boolean(error),retryAt:error?.dailyQuota ? (Math.floor(Date.now()/86400000)+1)*86400000+60000 : null});
      await save(state);
    })).finally(()=>jobs.running.delete(dish.id));
  }
}
export async function GET() {
  const state=await load();
  runImages(state.menu.filter(d => (d.imageFailed && d.retryAt && Date.now() >= d.retryAt) || d.imagePending).map(d => ({...d,imagePending:true})));
  return Response.json(view(state),{headers:{"Cache-Control":"no-store"}});
}
export async function POST(request) {
  const {key,items}=await request.json();
  if (!/^[\da-f-]{36}$/i.test(key) || !Array.isArray(items) || !items.length || items.some(i=>!Number.isSafeInteger(i.qty)||i.qty<1)) return new Response(null,{status:400});
  return serialized(async()=>{
    const state=await load();
    let order=state.orders[key];
    if (!order) {
      const cart=items.map(i=>({dish:state.menu.find(d=>d.id===i.id),qty:i.qty}));
      if (cart.some(i=>!i.dish)) return new Response(null,{status:409});
      const {nextMenu,newDishes}=evolveMenu({menu:state.menu,cart,evolutionStep:state.evolutionStep});
      await mkdir(directory,{recursive:true});
      for (const d of newDishes) {
        d.imagePending=true;
        const refs=cart.slice(0,4).map(i=>i.dish.id);
        const prompt=d.name+". "+d.desc_en+". Fuse the pictured ingredients from this order: "+cart.map(i=>i.dish.name+" x"+i.qty).join(", ");
        await writeFile(path.join(directory,d.id+".json"),JSON.stringify({refs,prompt}));
      }
      state.menu=nextMenu;
      state.evolutionStep++;
      order={items:cart,newDishes,evolutionStep:state.evolutionStep};
      state.orders[key]=order;
      await save(state);
    }
    runImages(state.menu);
    return Response.json({...view(state),order});
  });
}
