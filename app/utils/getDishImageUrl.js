import files from "../data/image-files.json";
export default function getDishImageUrl(dish) {
  return { primary: files[dish.id] ? "/menu-images/" + files[dish.id] : "/api/dish-image?id=" + encodeURIComponent(dish.id) };
}
