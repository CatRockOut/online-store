import { amountMoneyAllItemsInBag, setCookie } from "./utils.js";

// Manipulate the bag on all pages:
function initBag() {
    const mainClass = 'item-fox';
    const bag = document.querySelector('.bag');
    const btnCart = document.querySelector('.cart');
    const addedItems = document.querySelector('.added-items');
    const checkoutBtn = document.querySelector('.checkout__btn');

    // Open or close the bag when clicked 'Cart' img in Header:
    btnCart && btnCart.addEventListener('click', () => {
        const bodyElement = document.body;

        if (bag.classList.contains('hidden')) {
            bag.classList.remove('hidden');
            bodyElement.classList.add('body-lock');
        }

        if (!bag.classList.contains('hidden')) {
            const closeBtnBag = document.querySelector('.close-btn');

            closeBtnBag.addEventListener('click', () => {
                bag.classList.add('hidden');
                bodyElement.classList.remove('body-lock');
            });
        }
    });

    // Actions on items in the bag:
    addedItems && addedItems.addEventListener('click', ({ target }) => {
        const removeItemBtn = target.closest('.remove-btn');
        const plusBtnCounter = target.closest('.plus-counter');
        const minusBtnCounter = target.closest('.minus-counter');

        if (removeItemBtn) {
            handleRemoveItem(removeItemBtn);
        }

        if (plusBtnCounter) {
            handlePlusItem(plusBtnCounter);
        }

        if (minusBtnCounter) {
            handleMinusItem(minusBtnCounter);
        }

        countAllItemsInTheBag();
    });

    // Deleting a specific item from the bag and cookie by clicking 'Remove' button:
    function handleRemoveItem(removeBtn) {
        const item = removeBtn.closest(`.${mainClass}`);
        const imgSrc = item.querySelector('img').src;
        const cookieValue = encodeURIComponent(imgSrc);
        const cookieName = `item-${cookieValue}`;

        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
        item.remove();

        // Notification about an empty bag inside the bag:
        if (!addedItems.querySelector(`.${mainClass}`)) {
            const notificationEmptyBag = addedItems.querySelector('.notification__empty-bag');
            notificationEmptyBag.classList.remove('hidden');
        }

        amountMoneyAllItemsInBag(addedItems, mainClass);
    }

    // Plus one item in the bag when you click on "+" button:
    function handlePlusItem(plusBtn) {
        const counter = plusBtn.parentElement.querySelector('.counter h3');
        
        let currentValue = parseInt(counter.textContent, 10);
        currentValue += 1;
        counter.textContent = currentValue;

        amountMoneyItemInBag(plusBtn, null);
        setCookie(plusBtn, currentValue, mainClass);
    }

    // Minus one item in the bag when you click on "-" button:
    function handleMinusItem(minusBtn) {
        const itemFox = minusBtn.closest(`.${mainClass}`);
        const counter = minusBtn.parentElement.querySelector('.counter h3');

        let currentValue = parseInt(counter.textContent, 10);
        currentValue -= 1;
        counter.textContent = currentValue;

        if (currentValue > 0) {
            amountMoneyItemInBag(null, minusBtn);
        }

        setCookie(minusBtn, currentValue, mainClass);

        if (currentValue === 0) {
            const confirmation = confirm('Are you sure you want to remove this item from the bag?');

            // Ask the user in the bag whether to delete an item when clicking on "-" when there is only 1 item left:
            if (confirmation) {
                const imgSrc = minusBtn.closest(`.${mainClass}`).querySelector('img').src;
                const cookieValue = encodeURIComponent(imgSrc);
                const cookieName = `item-${cookieValue}`;

                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
                itemFox.remove();
                amountMoneyAllItemsInBag(addedItems, mainClass);

                if (!addedItems.querySelector(`.${mainClass}`)) {
                    const notificationEmptyBag = addedItems.querySelector('.notification__empty-bag');
                    notificationEmptyBag.classList.remove('hidden');
                }
            } else {
                currentValue = 1;
                counter.textContent = currentValue;

                setCookie(minusBtn, currentValue, mainClass);
            }
        }
    }

    // Display the number of all items in the bag:
    function countAllItemsInTheBag() {
        const cartCount = document.querySelector('.cart-count');
        const itemCount = addedItems.querySelectorAll(`.${mainClass}`).length;

        if (itemCount > 0) {
            cartCount.classList.remove('hidden');
            cartCount.textContent = itemCount;
        } else {
            cartCount.classList.add('hidden');
        }
    }

    // Amount of money per item in the bag:
    function amountMoneyItemInBag(plusBtn, minusBtn) {
        const itemFox = plusBtn
            ? plusBtn.closest(`.${mainClass}`)
            : minusBtn.closest(`.${mainClass}`);
        const amountMoney = itemFox.querySelector(`.${mainClass}__amount`);
        const initialAmount = parseFloat(amountMoney.getAttribute('data-initial-amount').replace(/[^\d.]/g, ''));
        const pricePerItem = parseFloat(amountMoney.textContent.replace(/[^\d.]/g, ''));

        if (plusBtn) {
            const totalAmount = pricePerItem + initialAmount;
            amountMoney.textContent = `$${totalAmount.toFixed(2)}`;
        }

        if (minusBtn) {
            const totalAmount = pricePerItem - initialAmount;
            amountMoney.textContent = `$${totalAmount.toFixed(2)}`;
        }

        amountMoneyAllItemsInBag(addedItems, mainClass);
    }

    // Notification about order processing when you click on the "Checkout" button in the bag:
    checkoutBtn && checkoutBtn.addEventListener('click', () => {
        if (addedItems.querySelector(`.${mainClass}`)) {
            alert('Thank you for your order, our manager will contact you shortly!');
        }

        if (!addedItems.querySelector(`.${mainClass}`)) {
            alert('The order cannot be processed while the bag is empty...');
        }
    });

    // Display all items from cookies in the bag when DOMContentLoaded:
    const allCookies = document.cookie.split('; ');

    allCookies && allCookies.forEach((cookie) => {
        const [cookieName, cookieValue, cookieCounter, cookieAmountMoney, cookieInitialAmount, cookieItemName] = cookie.split('=');
        const imgSrc = decodeURIComponent(cookieValue);

        if (cookieName.trim() !== '') {
            addedItems.insertAdjacentHTML('beforeend', `
                <div class="${mainClass}">
                    <div class="${mainClass}__inner">
                        <img src="${imgSrc}" alt="fox">
                        <div class="${mainClass}__info">
                            <span>${cookieItemName}</span>
                            <span class="${mainClass}__amount" data-initial-amount=${cookieInitialAmount}>$${cookieAmountMoney}</span>
                        </div>
                    </div>
                    <div class="addition-counter">
                        <div class="plus-minus">
                            <span class="minus-counter">-</span>
                            <div class="counter">
                                <h3>${cookieCounter}</h3>
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
        } else {
            const notificationEmptyBag = document.querySelector('.notification__empty-bag');
            notificationEmptyBag.classList.remove('hidden');
        }
    });

    countAllItemsInTheBag();
    amountMoneyAllItemsInBag(addedItems, mainClass);
}

document.addEventListener('DOMContentLoaded', initBag);
