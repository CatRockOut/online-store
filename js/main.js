// Manipulate the bag on all pages:
function initBag() {
    const bag = document.querySelector('.bag');
    const btnCart = document.querySelector('.cart');
    const addedItems = document.querySelector('.added-items');
    const checkoutBtn = document.querySelector('.checkout__btn');

    // Open or close the bag when clicked 'Cart' img in Header:
    btnCart && btnCart.addEventListener('click', () => {
        if (bag.classList.contains('hidden')) {
            bag.classList.remove('hidden');
        }

        if (!bag.classList.contains('hidden')) {
            const closeBtnBag = document.querySelector('.close-btn');

            closeBtnBag.addEventListener('click', () => {
                bag.classList.add('hidden');
            });
        }
    });

    // Actions on items in the bag:
    addedItems && addedItems.addEventListener('click', (event) => {
        const removeItemBtn = event.target.closest('.remove-btn');
        const plusBtnCounter = event.target.closest('.plus-counter');
        const minusBtnCounter = event.target.closest('.minus-counter');

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
        const item = removeBtn.closest('.item-fox');
        const imgSrc = item.querySelector('img').src;
        const cookieValue = encodeURIComponent(imgSrc);
        const cookieName = `item-${cookieValue}`;

        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
        item.remove();

        // Notification about an empty bag inside the bag:
        if (!addedItems.querySelector('.item-fox')) {
            const notificationEmptyBag = addedItems.querySelector('.notification__empty-bag');
            notificationEmptyBag.classList.remove('hidden');
        }

        amountMoneyAllItemsInBag();
    }

    // Plus one item in the bag when you click on "+" button:
    function handlePlusItem(plusBtn) {
        const counter = plusBtn.parentElement.querySelector('.counter h3');
        
        let currentValue = parseInt(counter.textContent, 10);
        currentValue += 1;
        counter.textContent = currentValue;

        amountMoneyItemInBag(plusBtn, null);
        setCookie(plusBtn, currentValue);
    }

    // Minus one item in the bag when you click on "-" button:
    function handleMinusItem(minusBtn) {
        const itemFox = minusBtn.closest('.item-fox');
        const counter = minusBtn.parentElement.querySelector('.counter h3');

        let currentValue = parseInt(counter.textContent, 10);
        currentValue -= 1;
        counter.textContent = currentValue;

        if (currentValue > 0) {
            amountMoneyItemInBag(null, minusBtn);
        }

        setCookie(minusBtn, currentValue);

        if (currentValue === 0) {
            const confirmation = confirm('Are you sure you want to remove this item from the bag?');

            // Ask the user in the bag whether to delete an item when clicking on "-" when there is only 1 item left:
            if (confirmation) {
                const imgSrc = minusBtn.closest('.item-fox').querySelector('img').src;
                const cookieValue = encodeURIComponent(imgSrc);
                const cookieName = `item-${cookieValue}`;

                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
                itemFox.remove();
                amountMoneyAllItemsInBag();

                if (!addedItems.querySelector('.item-fox')) {
                    const notificationEmptyBag = addedItems.querySelector('.notification__empty-bag');
                    notificationEmptyBag.classList.remove('hidden');
                }
            } else {
                currentValue = 1;
                counter.textContent = currentValue;
            }
        }
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

    // Display the number of all items in the bag:
    function countAllItemsInTheBag() {
        const cartCount = document.querySelector('.cart-count');
        const itemCount = addedItems.querySelectorAll('.item-fox').length;

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
            ? plusBtn.closest('.item-fox')
            : minusBtn.closest('.item-fox');
        const amountMoney = itemFox.querySelector('.item-fox__amount');
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

        amountMoneyAllItemsInBag();
    }

    // Amount of money of all items in the bag:
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

    // Notification about order processing when you click on the "Checkout" button in the bag:
    checkoutBtn && checkoutBtn.addEventListener('click', () => {
        if (addedItems.querySelector('.item-fox')) {
            alert('Thank you for your order, our manager will contact you shortly!');
        }

        if (!addedItems.querySelector('.item-fox')) {
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
                <div class="item-fox">
                    <div class="item-fox__inner">
                        <img src="${imgSrc}" alt="fox">
                        <div class="item-fox__info">
                            <span>${cookieItemName}</span>
                            <span class="item-fox__amount" data-initial-amount=${cookieInitialAmount}>$${cookieAmountMoney}</span>
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
    amountMoneyAllItemsInBag();
}

document.addEventListener('DOMContentLoaded', initBag);
