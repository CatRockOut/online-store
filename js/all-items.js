import { json } from "./json.js";
import { htmlTemplate, amountMoneyAllItemsInBag, setCookie } from "./utils.js";

// Manipulate with items on the page:
function initAllItems() {
    const mainClass = 'item-fox';
    const itemsFoxesContainer = document.querySelector('.all-items__fox');
    const addedItems = document.querySelector('.added-items');

    itemsFoxesContainer && itemsFoxesContainer.addEventListener('click', ({ target }) => {
        const addButton = target.closest('.add-to-cart');
        const notificationItemsContainer = document.querySelector('.notification__items-container');

        // Manipulations with item when click on the "Add" button inside the item bag on the page:
        if (addButton) {
            const itemContainer = addButton.closest(`.${mainClass}`);
            const imgSrc = itemContainer.querySelector('img').src;
            const existingItem = addedItems.querySelector(`.${mainClass} img[src="${imgSrc}"]`);

            if (existingItem) {
                // If the item exists, then change the counter on one specific item in the bag (instead of creating a new one):
                increaseCounter(addButton, existingItem);
            } else {
                // If the item does not exist, then creates a new item in the bag:
                createNewElement(addButton);
            }
        }

        // Notify if items are not found in the page:
        if (!itemsFoxesContainer.querySelector(`.${mainClass}`)) {
            notificationItemsContainer.classList.remove('hidden');
        } else {
            notificationItemsContainer.classList.add('hidden');
        }
    });

    // When adding an item in the bag, but if a specific item is already in the bag, then increase the counter in this added item (instead of creating the same item):
    function increaseCounter(button, existingItem) {
        const itemContainer = button.closest(`.${mainClass}`);
        const counter = existingItem.closest(`.${mainClass}`).querySelector('.counter h3');
        const itemFox = existingItem.closest(`.${mainClass}`);
        const amountMoney = itemFox.querySelector(`.${mainClass}__amount`);
        const initialAmount = parseFloat(amountMoney.getAttribute('data-initial-amount').replace(/[^\d.]/g, ''));
        const pricePerItem = parseFloat(amountMoney.textContent.replace(/[^\d.]/g, ''));

        // Updating the item counter:
        let currentValue = parseInt(counter.textContent, 10);
        currentValue += 1;
        counter.textContent = currentValue;

        // Updating the item's money amount:
        const totalAmount = pricePerItem + initialAmount;
        amountMoney.textContent = `$${totalAmount.toFixed(2)}`;

        setCookie(existingItem, currentValue, mainClass);
        amountMoneyAllItemsInBag(addedItems, mainClass);
        countAllItemsInTheBag();
        notificationInsideItem(itemContainer);
    }

    // When adding an item in the bag and if the item is not in the bag, then create a new item:
    function createNewElement(button) {
        const itemContainer = button.closest(`.${mainClass}`);
        const imgSrc = itemContainer.querySelector('img').src;
        const itemName = itemContainer.querySelector(`.${mainClass}__info span`).textContent;
        const itemPrice = itemContainer.querySelector(`.${mainClass}__info span:nth-child(2)`).textContent.replace(/[^\d.]/g, '');
        const notificationEmptyBag = document.querySelector('.notification__empty-bag');
        const currentValue = 1;

        notificationEmptyBag.classList.add('hidden');

        addedItems.insertAdjacentHTML('beforeend', `
            <div class="${mainClass}">
                <div class="${mainClass}__inner">
                    <img src="${imgSrc}" alt="fox">
                    <div class="${mainClass}__info">
                        <span>${itemName}</span>
                        <span class="${mainClass}__amount" data-initial-amount=${itemPrice}>$${itemPrice}</span>
                    </div>
                </div>
                <div class="addition-counter">
                    <div class="plus-minus">
                        <span class="minus-counter">-</span>
                        <div class="counter">
                            <h3>${currentValue}</h3>
                        </div>
                        <span class="plus-counter">+</span>
                    </div>
                    <div class="remove-item">
                        <span>Remove</span>
                        <div class="remove-btn"></div>
                    </div>
                </div>
            </div>
        `);

        setCookie(itemContainer, currentValue, mainClass);
        amountMoneyAllItemsInBag(addedItems, mainClass);
        countAllItemsInTheBag();
        notificationInsideItem(itemContainer);
    }

    // Updating the number of items in the bag in Header by clicking 'Add' button:
    function countAllItemsInTheBag() {
        const cartCount = document.querySelector('.cart-count');
        const itemCount = addedItems.querySelectorAll(`.${mainClass}`).length;

        if (itemCount > 0) {
            cartCount.classList.remove('hidden');
            cartCount.textContent = itemCount;
        }
    }

    // Notification that an item has been added to the bag:
    function notificationInsideItem(itemContainer) {
        const notification = itemContainer.querySelector('.notification');
        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 2000);
    }

    // Display all items on the page when DOMContentLoaded:
    const allItemsHtml = json.map((item) => htmlTemplate(item, mainClass)).join('');
    itemsFoxesContainer.insertAdjacentHTML('beforeend', allItemsHtml);
}

document.addEventListener('DOMContentLoaded', initAllItems);
