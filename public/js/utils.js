export function nonEmpty(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  return true;
}

//create 1 single row for details page
export function labeledRow(label, value) {
  if (!nonEmpty(value)) return "";
  return `<p><strong>${label}:</strong> ${value}</p>`;
}

//determines best animal image source
export function getImageSrc(animal) {
  if (nonEmpty(animal.image_url)) return animal.image_url;
  if (nonEmpty(animal.image)) return animal.image;
  return "img/default.jpg";
};
