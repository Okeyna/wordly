const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const elements = {};

const formatList = (items) => {
    return Array.isArray(items) && items.length ? items.join(", ") : "N/A";
};

const showMessage = (message, className = "") => {
    elements.resultsContainer.innerHTML = `
        <div class="placeholder-state ${className}">
            <p>${message}</p>
        </div>
    `;
};

const showPlaceholder = (message = "Enter a word above to see its definition, pronunciation, antonyms, and synonyms.") => {
    showMessage(message);
};

const createResultCard = ({ word, phonetic, partOfSpeech, definition, synonyms, antonyms }) => {
    const card = document.createElement("article");
    card.className = "word-card";

    card.innerHTML = `
        <div class="word-header">
            <div>
                <h2>${word}</h2>
                <p class="part-of-speech">${partOfSpeech}</p>
            </div>
            <span class="pronunciation">${phonetic || "N/A"}</span>
        </div>
        <p><strong>Definition:</strong> ${definition}</p>
        <p><strong>Synonyms:</strong> ${synonyms}</p>
        <p><strong>Antonyms:</strong> ${antonyms}</p>
    `;

    return card;
};

const renderResults = (entries) => {
    elements.resultsContainer.innerHTML = "";

    if (!Array.isArray(entries) || !entries.length) {
        showMessage("No definitions found. Please try another word.", "error");
        return;
    }

    entries.forEach((entry) => {
        const { word, phonetic, meanings } = entry;

        meanings.forEach((meaning) => {
            const { partOfSpeech, definitions, antonyms, synonyms } = meaning;
            const antonymsText = formatList(antonyms);
            const synonymsText = formatList(synonyms);

            definitions.forEach((definitionObject) => {
                const definitionText = definitionObject.definition;
                const card = createResultCard({
                    word,
                    phonetic,
                    partOfSpeech,
                    definition: definitionText,
                    synonyms: synonymsText,
                    antonyms: antonymsText,
                });
                elements.resultsContainer.appendChild(card);
            });
        });
    });
};

const fetchWordData = async (word) => {
    const response = await fetch(`${apiUrl}${word}`);
    if (!response.ok) {
        throw new Error("Word not found");
    }
    return response.json();
};

const clearResults = () => {
    elements.searchInput.value = "";
    showPlaceholder();
    elements.searchInput.focus();
};

const handleSearchSubmit = async (event) => {
    event.preventDefault();

    const word = elements.searchInput.value.trim();
    if (!word) {
        return;
    }

    showMessage("Loading...");

    try {
        const data = await fetchWordData(word);
        renderResults(data);
    } catch (error) {
        console.error("Error fetching word data:", error);
        showMessage("Error fetching word data. Please try again.", "error");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    elements.searchForm = document.getElementById("search-form");
    elements.searchInput = document.getElementById("search-input");
    elements.clearButton = document.getElementById("clear-btn");
    elements.resultsContainer = document.getElementById("results-container");

    elements.searchForm.addEventListener("submit", handleSearchSubmit);
    elements.clearButton.addEventListener("click", clearResults);
});
