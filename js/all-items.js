import { json } from "./json.js";

// Manipulate with items on the page:
function initAllItems() {
    const itemsFoxesContainer = document.querySelector('.all-items__fox');
    const addedItems = document.querySelector('.added-items');

    itemsFoxesContainer && itemsFoxesContainer.addEventListener('click', (event) => {
        const addButton = event.target.closest('.add-to-cart');
        const notificationItemsContainer = document.querySelector('.notification__items-container');

        // Manipulations with item when click on the "Add" button inside the item bag on the page:
        if (addButton) {
            const itemContainer = addButton.closest('.item-fox');
            const imgSrc = itemContainer.querySelector('img').src;
            const existingItem = addedItems.querySelector(`.item-fox img[src="${imgSrc}"]`);

            if (existingItem) {
                // If the item exists, then change the counter on one specific item in the bag (instead of creating a new one):
                increaseCounter(addButton, existingItem);
            } else {
                // If the item does not exist, then creates a new item in the bag:
                createNewElement(addButton);
            }
        }

        // Notify if items are not found in the page:
        if (!itemsFoxesContainer.querySelector('.item-fox')) {
            notificationItemsContainer.classList.remove('hidden');
        } else {
            notificationItemsContainer.classList.add('hidden');
        }
    });

    // When adding an item in the bag, but if a specific item is already in the bag, then increase the counter in this added item (instead of creating the same item):
    function increaseCounter(button, existingItem) {
        const itemContainer = button.closest('.item-fox');
        const counter = existingItem.closest('.item-fox').querySelector('.counter h3');
        const itemFox = existingItem.closest('.item-fox');
        const amountMoney = itemFox.querySelector('.item-fox__amount');
        const initialAmount = parseFloat(amountMoney.getAttribute('data-initial-amount').replace(/[^\d.]/g, ''));
        const pricePerItem = parseFloat(amountMoney.textContent.replace(/[^\d.]/g, ''));

        // Updating the item counter:
        let currentValue = parseInt(counter.textContent, 10);
        currentValue += 1;
        counter.textContent = currentValue;

        // Updating the item's money amount:
        const totalAmount = pricePerItem + initialAmount;
        amountMoney.textContent = `$${totalAmount.toFixed(2)}`;

        setCookie(existingItem, currentValue);
        amountMoneyAllItemsInBag();
        countAllItemsInTheBag();
        notificationInsideItem(itemContainer);
    }

    // When adding an item in the bag and if the item is not in the bag, then create a new item:
    function createNewElement(button) {
        const itemContainer = button.closest('.item-fox');
        const imgSrc = itemContainer.querySelector('img').src;
        const itemName = itemContainer.querySelector('.item-fox__info span').textContent;
        const itemPrice = itemContainer.querySelector('.item-fox__info span:nth-child(2)').textContent.replace(/[^\d.]/g, '');
        const notificationEmptyBag = document.querySelector('.notification__empty-bag');
        const currentValue = 1;

        notificationEmptyBag.classList.add('hidden');

        addedItems.insertAdjacentHTML('beforeend', `
            <div class="item-fox">
                <div class="item-fox__inner">
                    <img src="${imgSrc}" alt="fox">
                    <div class="item-fox__info">
                        <span>${itemName}</span>
                        <span class="item-fox__amount" data-initial-amount=${itemPrice}>$${itemPrice}</span>
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

        setCookie(itemContainer, currentValue);
        amountMoneyAllItemsInBag();
        countAllItemsInTheBag();
        notificationInsideItem(itemContainer);
    }

    // Function to update cookies:
    function setCookie(currentButton, currentValue) {
        const imgSrc = currentButton.closest('.item-fox').querySelector('img').src;
        const itemFox = currentButton.closest('.item-fox');
        const itemName = itemFox.querySelector('.item-fox__info span').textContent;
        const amountMoney = itemFox.querySelector('.item-fox__amount');
        const initialAmount = parseFloat(amountMoney.getAttribute('data-initial-amount').replace(/[^\d.]/g, ''));

        const cookieValue = encodeURIComponent(imgSrc);
        const cookieName = `item-${cookieValue}`;
        const amountMoneyForCookie = amountMoney.textContent.replace(/[^\d.]/g, '');

        const date = new Date();
        date.setHours(date.getHours() + 2);

        const cookieString = `${cookieName}=${cookieValue}=${currentValue}=${amountMoneyForCookie}=${initialAmount}=${itemName}; expires=${date}; path=/`;
        document.cookie = cookieString;
    }

    // Updating the number of items in the bag in Header by clicking 'Add' button:
    function countAllItemsInTheBag() {
        const cartCount = document.querySelector('.cart-count');
        const itemCount = addedItems.querySelectorAll('.item-fox').length;

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

    // Calculate the total amount of money of all items in the cart:
    function amountMoneyAllItemsInBag() {
        const totalCheckout = document.querySelector('.checkout h2');
        const itemsFoxes = addedItems.querySelectorAll('.item-fox');
        let totalAmountAllItems = 0;

        itemsFoxes.forEach((itemFox) => {
            const amountMoney = itemFox.querySelector('.item-fox__amount').textContent;
            const pricePerItem = parseFloat(amountMoney.replace(/[^\d.]/g, ''));

            totalAmountAllItems += pricePerItem;
        });

        totalCheckout.textContent = `Total: $${totalAmountAllItems.toFixed(2)}`;
    }

    // Display all items on the page when DOMContentLoaded:
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
                    <span class="item-fox__amount" data-initial-amount=${item.itemPrice}>&#36;${item.itemPrice}</span>
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

    const allItemsHtml = json.map(htmlTemplate).join('');
    itemsFoxesContainer.insertAdjacentHTML('beforeend', allItemsHtml);
}

document.addEventListener('DOMContentLoaded', initAllItems);
