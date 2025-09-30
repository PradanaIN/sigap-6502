export function showLoader(show = true) {
  const pageLoader = document.getElementById("pageLoader");
  if (!pageLoader) return;
  pageLoader.classList.toggle("hidden", !show);
}
