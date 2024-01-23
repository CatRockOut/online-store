import { json } from "./json.js";
import { htmlTemplate } from "./utils.js";

// Filters manipulations:
function initShopFilter() {
    const searchInput = document.querySelector('.filter__search');
    const filterItemsButtons = document.querySelectorAll('.all-items__filter span');
    const inputRange = document.getElementById('price-range');
    const itemsFoxesContainer = document.querySelector('.all-items__fox');
    const priceRange = document.querySelector('.price');
    const mainClass = 'item-fox';

    // ==> INPUT <==
    searchInput && searchInput.addEventListener('input', () => {
        const searchInputValue = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.all-items__filter .active');
        const category = activeFilter ? activeFilter.getAttribute('data-category') : 'All';

        if (searchInputValue !== '') {
            // If some filter is not selected, then the search will occur across all items:
            searchingItemViaInput(json, searchInputValue, category);
        } else {
            // If the input is empty, show items based on the selected filter category:
            searchItemsViaFilter(json, category);
        }

        notifyIfItemsNotFound();
        applyAllFilters();
    });

    // ==> FILTERS <==
    filterItemsButtons && filterItemsButtons.forEach((filterButton) => {
        filterButton.addEventListener('click', () => {
            const active = document.querySelector('.active');
            const category = filterButton.getAttribute('data-category');

            // Change the color of the active filter button:
            if (!filterButton.classList.contains('active')) {
                filterButton.classList.add('active');

                if (active) {
                    active.classList.remove('active');
                }
            }

            // Search for items using a filter buttons:
            if (category) {
                searchItemsViaFilter(json, category);
            }

            applyAllFilters(category);
        });
    });

    // ==> RANGE <==
    inputRange && inputRange.addEventListener('input', () => {
        priceRange.textContent = 'Value: $' + inputRange.value;

        searchItemsViaRange(json);
        notifyIfItemsNotFound();
    });

    // Search for items through the input:
    function searchingItemViaInput(json, searchInputValue, category) {
        itemsFoxesContainer.innerHTML = '';

        const filteredItems = json.filter((item) => {
            const itemNameMatches = item.itemName.toLowerCase().includes(searchInputValue);
            const itemCategoryMatches = item.itemCategory.toLowerCase().includes(searchInputValue);
            const itemMatchesFilter = category === 'All' || item.itemCategory === category;

            const matchesNameOrCategory = itemNameMatches || itemCategoryMatches;
            const matchesFilter = itemMatchesFilter;

            return matchesNameOrCategory && matchesFilter;
        });

        const itemTemplate = filteredItems.map((item) => htmlTemplate(item, mainClass)).join('');
        itemsFoxesContainer.insertAdjacentHTML('beforeend', itemTemplate);
    }

    // Search for items through the filter:
    function searchItemsViaFilter(json, category) {
        itemsFoxesContainer.innerHTML = '';

        const filteredItems = json.filter((item) => {
            return category === 'All' || item.itemCategory === category;
        });

        const itemTemplate = filteredItems.map((item) => htmlTemplate(item, mainClass)).join('');
        itemsFoxesContainer.insertAdjacentHTML('beforeend', itemTemplate);
    }

    // Display items when using input range:
    function searchItemsViaRange(json) {
        const filteredItems = json.filter((item) => {
            const activeFilter = document.querySelector('.all-items__filter .active');
            const maxPrice = parseInt(inputRange.value);
            const minPrice = 0;

            const itemNameMatches = item.itemName.toLowerCase().includes(searchInput.value.toLowerCase());
            const itemCategoryMatches = item.itemCategory.toLowerCase().includes(searchInput.value.toLowerCase());
            const itemMatchesFilter = activeFilter
                ? activeFilter.getAttribute('data-category') === 'All' || item.itemCategory === activeFilter.getAttribute('data-category')
                : true;
            const itemMatchesPrice = item.itemPrice >= minPrice && item.itemPrice <= maxPrice;

            const matchesNameOrCategory = itemNameMatches || itemCategoryMatches;
            const isItemMatching = matchesNameOrCategory && itemMatchesFilter && itemMatchesPrice;

            return isItemMatching;
        });

        itemsFoxesContainer.innerHTML = '';

        const itemTemplate = filteredItems.map((item) => htmlTemplate(item, mainClass)).join('');
        itemsFoxesContainer.insertAdjacentHTML('beforeend', itemTemplate);
    }

    // Filter items based on input text, category filters, and price range:
    function applyAllFilters() {
        const searchInputValue = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.all-items__filter .active');
        const category = activeFilter ? activeFilter.getAttribute('data-category') : 'All';

        searchItemsViaFilter(json, category);
        searchItemsViaRange(json, searchInputValue);
        notifyIfItemsNotFound();
    }

    // Notify if items are not found:
    function notifyIfItemsNotFound() {
        const notificationItemsContainer = document.querySelector('.notification__items-container');

        if (!itemsFoxesContainer.querySelector(`.${mainClass}`)) {
            notificationItemsContainer.classList.remove('hidden');
        } else {
            notificationItemsContainer.classList.add('hidden');
        }
    }

    // When DOMContentLoaded, the "All" button from the filter will be active color:
    const filterButton = document.querySelector('.all-items__filter [data-category="All"]');
    filterButton.classList.add('active');
}

document.addEventListener('DOMContentLoaded', initShopFilter);
