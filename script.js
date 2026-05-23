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

const getPhoneticText = (entry) => {
    if (entry.phonetic) {
        return entry.phonetic;
    }

    if (Array.isArray(entry.phonetics)) {
        const firstText = entry.phonetics.find((item) => item.text && item.text.trim());
        return firstText ? firstText.text : "N/A";
    }

    return "N/A";
};

const getAudioUrl = (entry) => {
    if (!Array.isArray(entry.phonetics)) {
        return null;
    }

    const phoneticWithAudio = entry.phonetics.find((item) => item.audio && item.audio.trim());
    return phoneticWithAudio ? phoneticWithAudio.audio : null;
};

const playAudio = (url) => {
    if (!url) {
        return;
    }

    const normalizedUrl = url.startsWith("//") ? `https:${url}` : url;
    const audio = new Audio(normalizedUrl);

    audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
    });
};

const createResultCard = ({ word, phonetic, audioUrl, partOfSpeech, definition, synonyms, antonyms }) => {
    const card = document.createElement("article");
    card.className = "word-card";

    const audioButtonMarkup = audioUrl
        ? `<button type="button" class="audio-btn" data-audio-url="${audioUrl}" aria-label="Play pronunciation">🔊</button>`
        : "";

    card.innerHTML = `
        <div class="word-header">
            <div>
                <h2>${word}</h2>
                <p class="part-of-speech">${partOfSpeech}</p>
            </div>
            <div class="word-header-right">
                <span class="pronunciation">${phonetic || "N/A"}</span>
                ${audioButtonMarkup}
            </div>
        </div>
        <p><strong>Definition:</strong> ${definition}</p>
        <p><strong>Synonyms:</strong> ${synonyms}</p>
        <p><strong>Antonyms:</strong> ${antonyms}</p>
    `;

    const audioButton = card.querySelector(".audio-btn");
    if (audioButton) {
        audioButton.addEventListener("click", () => playAudio(audioButton.dataset.audioUrl));
    }

    return card;
};

const renderResults = (entries) => {
    elements.resultsContainer.innerHTML = "";

    if (!Array.isArray(entries) || !entries.length) {
        showMessage("No definitions found. Please try another word.", "error");
        return;
    }

    entries.forEach((entry) => {
        const phoneticText = getPhoneticText(entry);
        const audioUrl = getAudioUrl(entry);

        const { word, meanings } = entry;

        meanings.forEach((meaning) => {
            const { partOfSpeech, definitions, antonyms, synonyms } = meaning;
            const antonymsText = formatList(antonyms);
            const synonymsText = formatList(synonyms);

            definitions.forEach((definitionObject) => {
                const definitionText = definitionObject.definition;
                const card = createResultCard({
                    word,
                    phonetic: phoneticText,
                    audioUrl,
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
