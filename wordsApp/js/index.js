import { antonymsNode, searchWordNode, resultsBlock, examplesNode, synonymsNode, definitionsNode, searchField, searchButton } from "/js/variables.js"

searchButton.addEventListener("click", sendJSONRequestsForResults);

async function sendJSONRequestsForResults() {
    const searchWord = searchField.value;
    try {
        const results = await Promise.all([sendJSONRequestForDefinitions(searchWord), sendJSONRequestForSynonyms(searchWord), sendJSONRequestForAntonyms(searchWord), sendJSONRequestForExamples(searchWord)]);
        processDataForDefinitions(results[0]);
        processDataForSynonyms(results[1]);
        processDataForAntonyms(results[2]);
        processDataForExamples(results[3]);
    }
    catch (err) {
        console.error(err);
    }
    resultsBlock.classList.remove("d-none");
}

function sendJSONRequestForDefinitions(searchWord) {
    const url = `https://wordsapiv1.p.rapidapi.com/words/${searchWord}/definitions`;
    return sendJSONRequest(url);
}

function sendJSONRequestForSynonyms(searchWord) {
    const url = `https://wordsapiv1.p.rapidapi.com/words/${searchWord}/synonyms`;
    return sendJSONRequest(url);
}

function sendJSONRequestForAntonyms(searchWord) {
    const url = `https://wordsapiv1.p.rapidapi.com/words/${searchWord}/antonyms`;
    return sendJSONRequest(url);
}

function sendJSONRequestForExamples(searchWord) {
    const url = `https://wordsapiv1.p.rapidapi.com/words/${searchWord}/examples`;
    return sendJSONRequest(url);
}

async function sendJSONRequest(url) {
    try {
        const response = await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": "5d97fee4a9mshd416ddf0f7afa3ap1344fdjsn8b4d313c9c07"
            },
        });
        if (response.status === 404) {
            throw new Error("Error while sending JSON request");
        }
        else {
            return response.json();
        }
    }
    catch (err) {
        console.error(err);
    }
}

function processDataForDefinitions(dataObj) {
    const { word, definitions } = dataObj;
    searchWordNode.innerHTML = `<u>${word.toUpperCase()}</u>`;
    definitionsNode.innerHTML = `<em>${definitions.map((item, index) => `${index + 1}) ${item.definition}`).join("; ")}</em>`;
}

function processDataForSynonyms(dataObj) {
    const { word, synonyms } = dataObj;
    if (synonyms.length === 0) {
        synonymsNode.textContent = `Synonyms for "${word}" were not founded`;
    } else {
        synonymsNode.innerHTML = `<strong>Synonyms:</strong> <em>${synonyms.join(", ")}</em>`;
    }
}

function processDataForAntonyms(dataObj) {
    const { word, antonyms } = dataObj;
    if (antonyms.length === 0) {
        antonymsNode.textContent = `Antonyms for "${word}" were not founded`;
    } else {
        antonymsNode.innerHTML = `<strong>Antonyms:</strong> <em>${antonyms.join(", ")}</em>`;
    }
}

function processDataForExamples(dataObj) {
    const { examples } = dataObj;
    examplesNode.innerHTML = `<strong>Using (examples):</strong> <em>${examples.join("; ")}</em>`;
}
