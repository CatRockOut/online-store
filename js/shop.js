import { json } from "./json.js";

// Filters manipulations:
function initShopFilter() {
    const searchInput = document.querySelector('.filter__search');
    if (!searchInput) {
        return;
    }

    const filterItemsButtons = document.querySelectorAll('.all-items__filter span');
    if (!filterItemsButtons) {
        return;
    }

    const inputRange = document.getElementById('price-range');
    if (!inputRange) {
        return;
    }

    const itemsFoxesContainer = document.querySelector('.all-items__fox');
    const priceRange = document.querySelector('.price');
    const allItemsButton = document.querySelector('.all-foxes__btn');

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

            // Reset all filters, input text and range, but display all items when press the "All foxes" button:
            allItemsButton.addEventListener('click', () => {
                const filterButtonAll = document.querySelector('.all-items__filter [data-category="All"]');

                filterButton.classList.remove('active');
                filterButtonAll.classList.add('active');

                searchItemsViaFilter(json, 'All');
                notifyIfItemsNotFound();

                searchInput.value = ''
                inputRange.value = 120;
                priceRange.textContent = 'Value: $' + inputRange.value;
            });

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
            const itemNameMatches = item.itemName.toLowerCase().startsWith(searchInputValue);
            const itemCategoryMatches = item.itemCategory.toLowerCase().startsWith(searchInputValue);
            const itemMatchesFilter = category === 'All' || item.itemCategory === category;

            const matchesNameOrCategory = itemNameMatches || itemCategoryMatches;
            const matchesFilter = itemMatchesFilter;

            return matchesNameOrCategory && matchesFilter;
        });

        const itemTemplate = filteredItems.map(htmlTemplate).join('');
        itemsFoxesContainer.insertAdjacentHTML('beforeend', itemTemplate);
    }

    // Search for items through the filter:
    function searchItemsViaFilter(json, category) {
        itemsFoxesContainer.innerHTML = '';

        const filteredItems = json.filter((item) => {
            return category === 'All' || item.itemCategory === category;
        });

        const itemTemplate = filteredItems.map(htmlTemplate).join('');
        itemsFoxesContainer.insertAdjacentHTML('beforeend', itemTemplate);
    }

    // Display items when using input range:
    function searchItemsViaRange(json) {
        const filteredItems = json.filter((item) => {
            const activeFilter = document.querySelector('.all-items__filter .active');
            let maxPrice = parseInt(inputRange.value);
            let minPrice = 0;

            const itemNameMatches = item.itemName.toLowerCase().startsWith(searchInput.value.toLowerCase());
            const itemCategoryMatches = item.itemCategory.toLowerCase().startsWith(searchInput.value.toLowerCase());
            const itemMatchesFilter = activeFilter
                ? activeFilter.getAttribute('data-category') === 'All' || item.itemCategory === activeFilter.getAttribute('data-category')
                : true;
            const itemMatchesPrice = item.itemPrice >= minPrice && item.itemPrice <= maxPrice;

            const matchesNameOrCategory = itemNameMatches || itemCategoryMatches;
            const isItemMatching = matchesNameOrCategory && itemMatchesFilter && itemMatchesPrice;

            return isItemMatching;
        });

        itemsFoxesContainer.innerHTML = '';

        const itemTemplate = filteredItems.map(htmlTemplate).join('');
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

        if (!itemsFoxesContainer.querySelector('.item-fox')) {
            notificationItemsContainer.classList.remove('hidden');
        } else {
            notificationItemsContainer.classList.add('hidden');
        }
    }

    // When DOMContentLoaded, the "All" button from the filter will be active color:
    const filterButton = document.querySelector('.all-items__filter [data-category="All"]');
    filterButton.classList.add('active');

    // Template for displaying items when using the functions:
    const htmlTemplate = (item) => {
        return `
            <div class="item-fox">
                <span class="notification hidden">
                    Product added to the cart!
                </span>
                <img src="${item.imgSrc}" alt="fox">
                <div class="add-to-cart">
                    <span>+</span>
                    <span>Add</span>
                </div>
                <div class="item-fox__info">
                    <span>${item.itemName}</span>
                    <span>&#36;${item.itemPrice}</span>
                    <div class="rating__container">
                        <input type="radio" id="star${item.itemRating}-1" name="rating${item.itemRating}-1" />
                        <label for="star${item.itemRating}-1"></label>
                        <input type="radio" id="star${item.itemRating}-2" name="rating${item.itemRating}-2" />
                        <label for="star${item.itemRating}-2"></label>
                        <input type="radio" id="star${item.itemRating}-3" name="rating${item.itemRating}-3" />
                        <label for="star${item.itemRating}-3"></label>
                        <input type="radio" id="star${item.itemRating}-4" name="rating${item.itemRating}-4" />
                        <label for="star${item.itemRating}-4"></label>
                        <input type="radio" id="star${item.itemRating}-5" name="rating${item.itemRating}-5" />
                        <label for="star${item.itemRating}-5"></label>
                    </div>
                    <p>${item.itemCategory}</p>
                </div>
            </div>
        `;
    };
}

document.addEventListener('DOMContentLoaded', initShopFilter);
