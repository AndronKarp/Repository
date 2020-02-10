import Nodes from "./variables.js"

Nodes.searchButton.addEventListener("click", sendJSONRequestsForResults);

async function sendJSONRequestsForResults() {
    const searchWord = Nodes.searchField.value;
    try {
        const results = await Promise.all([
            sendJSONRequest({ searchWord, requestTitle: "definitions" }),
            sendJSONRequest({ searchWord, requestTitle: "synonyms" }),
            sendJSONRequest({ searchWord, requestTitle: "antonyms" }),
            sendJSONRequest({ searchWord, requestTitle: "examples" })
        ]);
        processDataForDefinitions(results[0]);
        processDataForSynonyms(results[1]);
        processDataForAntonyms(results[2]);
        processDataForExamples(results[3]);
    }
    catch (err) {
        console.error(err);
    }
    Nodes.resultsBlock.classList.remove("d-none");
}

async function sendJSONRequest({ searchWord, requestTitle }) {
    try {
        const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${searchWord}/${requestTitle}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": "5d97fee4a9mshd416ddf0f7afa3ap1344fdjsn8b4d313c9c07"
            },
        });
        return response.status === 404 ? new Error("Error while sending JSON request") : response.json();
    }
    catch (err) {
        console.error(err);
    }
}

function processDataForDefinitions(dataObj) {
    const { word, definitions } = dataObj;
    Nodes.searchWordNode.innerHTML = `<u>${word.toUpperCase()}</u>`;
    Nodes.definitionsNode.innerHTML = `<em>${definitions.map((item, index) => `${index + 1}) ${item.definition}`).join("; ")}</em>`;
}

function processDataForSynonyms(dataObj) {
    const { word, synonyms } = dataObj;
    Nodes.synonymsNode.innerHTML = synonyms.length === 0 ? `Synonyms for "${word}" were not founded` : `<strong>Synonyms:</strong> <em>${synonyms.join(", ")}</em>`;
}

function processDataForAntonyms(dataObj) {
    const { word, antonyms } = dataObj;
    Nodes.antonymsNode.innerHTML = antonyms.length === 0 ? `Antonyms for "${word}" were not founded` : `<strong>Antonyms:</strong> <em>${antonyms.join(", ")}</em>`;
}

function processDataForExamples(dataObj) {
    const { word, examples } = dataObj;
    Nodes.examplesNode.innerHTML = examples.length === 0 ? `Examples for "${word}" were not founded` : `<strong>Using (examples):</strong> <em>${examples.join("; ")}</em>`;
}
