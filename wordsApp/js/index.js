import Nodes from "./nodes.js";

Nodes.searchButton.addEventListener("click", searchResults);

function searchResults() {
  const searchWord = Nodes.searchField.value;
  sendRequestsForResults(searchWord)
    .then((results) => {
      showResults(results);
    })
    .catch(() => showAlert());
}

async function sendRequestsForResults(searchWord) {
  const results = await Promise.all([
    sendRequest({ searchWord, requestTitle: "definitions" }),
    sendRequest({ searchWord, requestTitle: "synonyms" }),
    sendRequest({ searchWord, requestTitle: "antonyms" }),
    sendRequest({ searchWord, requestTitle: "examples" }),
  ]);
  return results;
}

async function sendRequest({ searchWord, requestTitle }) {
  const response = await fetch(
    `https://wordsapiv1.p.rapidapi.com/words/${searchWord}/${requestTitle}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "5d97fee4a9mshd416ddf0f7afa3ap1344fdjsn8b4d313c9c07",
      },
    }
  );
  return response.json();
}

function showResults(results) {
  processRequestForDefinitions(results[0]);
  processRequestForSynonyms(results[1]);
  processRequestForAntonyms(results[2]);
  processRequestForExamples(results[3]);
  Nodes.resultsNode.style.display = "flex";
  Nodes.alertNode.style.display = "none";
}

function showAlert() {
  Nodes.resultsNode.style.display = "none";
  Nodes.alertNode.style.display = "block";
}

function processRequestForDefinitions(data) {
  const { word, definitions } = data;
  Nodes.searchWordNode.innerHTML = `<u>${word.toUpperCase()}</u>`;
  Nodes.definitionsNode.innerHTML = `<em>${definitions
    .map((item, index) => `${index + 1}) ${item.definition}`)
    .join("; ")}</em>`;
}

function processRequestForSynonyms(data) {
  const { word, synonyms } = data;
  Nodes.synonymsNode.innerHTML =
    synonyms.length === 0
      ? `Synonyms for "${word}" were not found`
      : `<strong>Synonyms:</strong> <em>${synonyms.join(", ")}</em>`;
}

function processRequestForAntonyms(data) {
  const { word, antonyms } = data;
  Nodes.antonymsNode.innerHTML =
    antonyms.length === 0
      ? `Antonyms for "${word}" were not found`
      : `<strong>Antonyms:</strong> <em>${antonyms.join(", ")}</em>`;
}

function processRequestForExamples(data) {
  const { word, examples } = data;
  Nodes.examplesNode.innerHTML =
    examples.length === 0
      ? `Examples for "${word}" were not found`
      : `<strong>Using (examples):</strong> <em>${examples.join("; ")}</em>`;
}
