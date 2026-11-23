function scoreProduct(product, words) {
  const text = [
    product.name,
    product.description || "",
    product.category || ""
  ].join(" ").toLowerCase();

  return words.reduce(
    (score, word) => score + (text.includes(word) ? 1 : 0),
    0
  );
}

function extractMaxPrice(query) {
  const match = query.match(/(?:under|below)\s+(\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) : null;
}

function smartSearch(query, products) {
  const maxPrice = extractMaxPrice(query);

  const words = query
    .replace(/(?:under|below)\s+\d+(?:\.\d+)?/gi, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2);

  return products
    .filter(p => maxPrice === null || Number(p.price) <= maxPrice)
    .map(p => ({ product: p, score: scoreProduct(p, words) }))
    .filter(result => words.length === 0 || result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(result => result.product);
}
 const smartInput = document.getElementById("smart-search");
const smartResults = document.getElementById("smart-results");

smartInput.addEventListener("input", async () => {
  const query = smartInput.value.trim();
  smartResults.textContent = "";

  if (query.length < 3) return;

  smartResults.textContent = "Searching...";

  const { data, error } = await supabaseClient
    .from("product")
    .select("*");

  // Ignore an older response if the query has changed.
  if (smartInput.value.trim() !== query) return;

  if (error) {
    smartResults.textContent = "Search failed: " + error.message;
    return;
  }

  const matches = smartSearch(query, data || []);
  smartResults.textContent = "";

  if (matches.length === 0) {
    smartResults.textContent = "No matches. Try different words.";
    return;
  }

  matches.forEach(product => {
    const row = document.createElement("p");
    row.textContent =
      `${product.name} — AED ${Number(product.price).toFixed(2)}`;
    smartResults.appendChild(row);
  });
});