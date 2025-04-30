// JavaScript for poet-selection.html

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("poet-search");
    const eraFilter = document.getElementById("era-filter");
    const countryFilter = document.getElementById("country-filter");
    const poetCards = document.querySelectorAll(".poet-card");

    function filterPoets() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedEra = eraFilter.value;
        const selectedCountry = countryFilter.value;

        poetCards.forEach(card => {
            const poetName = card.querySelector("h3").textContent.toLowerCase();
            const poetEra = card.dataset.era;
            const poetCountry = card.dataset.country;

            const nameMatch = poetName.includes(searchTerm);
            const eraMatch = (selectedEra === "all" || poetEra === selectedEra);
            const countryMatch = (selectedCountry === "all" || poetCountry === selectedCountry);

            if (nameMatch && eraMatch && countryMatch) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    searchInput.addEventListener("input", filterPoets);
    eraFilter.addEventListener("change", filterPoets);
    countryFilter.addEventListener("change", filterPoets);

    // Initial filter on load (optional, if needed)
    // filterPoets(); 
});
