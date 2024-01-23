// Template for displaying items when using the functions:
export const htmlTemplate = (item, mainClass) => {
    return `
        <div class="${mainClass}">
            <span class="notification hidden">
                Product added to the cart!
            </span>
            <img src="${item.imgSrc}" alt="fox">
            <div class="add-to-cart">
                <span>+</span>
                <span>Add</span>
            </div>
            <div class="${mainClass}__info">
                <span>${item.itemName}</span>
                <span class="${mainClass}__amount" data-initial-amount=${item.itemPrice}>&#36;${item.itemPrice}</span>
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

// Calculate the total amount of money of all items in the cart:
export function amountMoneyAllItemsInBag(addedItems, mainClass) {
    const totalCheckout = document.querySelector('.checkout h2');
    const itemsFoxes = addedItems.querySelectorAll(`.${mainClass}`);
    let totalAmountAllItems = 0;

    itemsFoxes.forEach((itemFox) => {
        const amountMoney = itemFox.querySelector(`.${mainClass}__amount`).textContent;
        const pricePerItem = parseFloat(amountMoney.replace(/[^\d.]/g, ''));

        totalAmountAllItems += pricePerItem;
    });

    totalCheckout.textContent = `Total: $${totalAmountAllItems.toFixed(2)}`;
}

// Function to update cookies:
export function setCookie(currentButton, currentValue, mainClass) {
    const imgSrc = currentButton.closest(`.${mainClass}`).querySelector('img').src;
    const itemFox = currentButton.closest(`.${mainClass}`);
    const itemName = itemFox.querySelector(`.${mainClass}__info span`).textContent;
    const amountMoney = itemFox.querySelector(`.${mainClass}__amount`);
    const initialAmount = parseFloat(amountMoney.getAttribute('data-initial-amount').replace(/[^\d.]/g, ''));

    const cookieValue = encodeURIComponent(imgSrc);
    const cookieName = `item-${cookieValue}`;
    const amountMoneyForCookie = amountMoney.textContent.replace(/[^\d.]/g, '');

    const date = new Date();
    date.setHours(date.getHours() + 2);

    const cookieString = `${cookieName}=${cookieValue}=${currentValue}=${amountMoneyForCookie}=${initialAmount}=${itemName}; expires=${date}; path=/`;
    document.cookie = cookieString;
}
