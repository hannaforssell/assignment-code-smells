import { CartItem } from "./vgModels/CartItem";
import { CartProduct } from "./vgModels/CartProduct";
import { Item } from "./vgModels/Item";
import { Product } from "./vgModels/Product";
import { SortOrder } from "./vgModels/SortOrder";

/*
1. Se om du kan hitta problem med koden nedan och se om du kan göra den bättre.
*/

//Jag visste ej om du ville att jag skulle använda klasser mellan uppgifterna,
//eller skapa egna klasser för varje enskild uppgift
//så jag gjorde det sistnämnda
function sortProducts(products: Product[], sortOrder: SortOrder) {
  let retProducts = [...products];

  switch (sortOrder) {
    case SortOrder.PRICE_ASCENDING:
      sortByPriceAscending(retProducts);
      break;
    case SortOrder.PRICE_DESCENDING:
      sortByPriceDescending(retProducts);
      break;
    case SortOrder.NAME_ALPHABETIC:
      sortByNameDescending(retProducts);
      break;
    case SortOrder.NAME_ALPHABETIC_REVERSE:
      sortByNameAscending(retProducts);
      break;
    default:
      break;
  }

  return retProducts;
}

function sortByPriceDescending(products: Product[]) {
  products.sort((product1, product2) => product1.price - product2.price);
}

function sortByPriceAscending(products: Product[]) {
  products.sort((product1, product2) => product2.price - product1.price);
}

function sortByNameDescending(products: Product[]) {
  products.sort((product1, product2) => product1.name.localeCompare(product2.name));
}

function sortByNameAscending(products: Product[]) {
  products.sort((product1, product2) => product2.name.localeCompare(product1.name));
}

/*
  2. Refaktorera funktionen createProductHtml :)
  */

const CART_STORAGE_NAME = 'savedItemsInCart';
const SHOP_STORAGE_NAME = 'savedItemsInShop';

export let itemsInCart = JSON.parse(localStorage.getItem(CART_STORAGE_NAME) || "[]") as CartItem[];
export let itemsInShop = JSON.parse(localStorage.getItem(SHOP_STORAGE_NAME) || "[]") as Item[];

let cartQtyHTML = document.getElementById("floatingcartnumber") as HTMLElement;

export function renderAllHTML(cartItems: CartItem[], shopItems: Item[]) {
  renderCartQuantity(cartItems);

  for (const item of shopItems) {
    let categoryHTML = document.getElementById(item.category) as HTMLElement | null;
    if (categoryHTML == null) {
      continue;
    }

    addItemToHTML(categoryHTML, item);
  }

  localStorage.setItem(SHOP_STORAGE_NAME, JSON.stringify(itemsInShop));
  sessionStorage.clear();
}

function renderCartQuantity(cartItems: CartItem[]) {
  cartQtyHTML.innerHTML = cartItems.reduce((ack, item) => ack + item.quantity, 0).toString();
}

function addItemToHTML(parent: HTMLElement, item: Item) {
  parent.innerHTML +=
    /*html*/
    `
      <div id="parentContainer" class="dogproduct">
        <div class="dogimgcontainer">
          <img src="${item.picture}" alt="${item.pictureAlt}">
          <div class="cartSymbolContainer">
            <i class="cartSymbol bi bi-bag-plus">Cart</i>
          </div>
        </div>

        <h5>${item.name}</h5>
        <p>$ ${item.price}</p>
        <p>${item.info}</p>
      </div>
    `;
  addItemListeners(parent, item);
}

function addItemListeners(el: HTMLElement, item: Item) {
  let cartSymbolContainer = el.querySelector('.cartSymbolContainer') as HTMLDivElement;
  let image = el.querySelector('img') as HTMLDivElement;
  let cartSymbol = el.querySelector('.cartSymbol') as HTMLElement;

  image.addEventListener("mouseover", () => {
    cartSymbolContainer.classList.add("hover");
    image.classList.add("hover");
  });

  image.addEventListener("mouseout", () => {
    cartSymbolContainer.classList.remove("hover");
    image.classList.remove("hover");
  });

  item.productSpec = false;
  image.addEventListener("click", () => {
    item.productSpec = !item.productSpec;
    window.location.href = "product-spec.html#backArrow";
    localStorage.setItem(SHOP_STORAGE_NAME, JSON.stringify(itemsInShop));
  });

  cartSymbol.addEventListener("click", () => {
    addToCart(item, 1);
  });
}

function addToCart(item: Item, quantity: number) {
  let cartItem = mapToCartItem(item, quantity);
  itemsInCart.push(cartItem);
  localStorage.setItem(CART_STORAGE_NAME, JSON.stringify(itemsInCart));
}

function mapToCartItem(item: Item, quantity: number): CartItem {
  return new CartItem(
    item.picture,
    item.pictureAlt,
    item.name,
    item.price,
    item.info,
    item.productSpec,
    item.category,
    quantity);
}

/*
  3. Refaktorera funktionen getfromstorage
  */

function renderCartProducts() {
  let cartProducts: CartProduct[] = JSON.parse(localStorage.getItem("cartArray") || "[]");

  let titleRow = document.getElementById("title-container") as HTMLTableRowElement;
  let changeAmountRow = document.getElementById("product-quantity") as HTMLTableRowElement;
  let amountContainer = document.getElementById("amount-checkout-container2") as HTMLDivElement;

  initializeTables(titleRow, changeAmountRow, amountContainer);  

  for (let product of cartProducts) {
    renderCartProduct(titleRow, changeAmountRow, amountContainer, product);
  }

  calculateProductPrice(cartProducts);
  renderTotalPrice(cartProducts);

}

function initializeTables(titleRow: HTMLTableRowElement, changeAmountRow: HTMLTableRowElement, amountContainer: HTMLDivElement) {
  titleRow.innerHTML = /*html*/`
    <strong>products:</strong>
  `;

  changeAmountRow.innerHTML += /*html*/`
    <th>change quantity:</th>
  `;

  amountContainer.innerHTML += /*html*/`
    <strong>amount:</strong>
  `;
}

function renderCartProduct(
  titleRow: HTMLTableRowElement,
  changeAmountRow: HTMLTableRowElement,
  amountContainer: HTMLDivElement,
  product: CartProduct
  ) {
  titleRow.innerHTML += /*html*/`
    <th class="hej">${product.name}</th>
  `;

  //Jag behöll den här delen av koden eftersom jag inte kunde replikera koden med string literals
  //och jag ej förstår varför vi lägger th-taggar direkt under en div
  let amountHTML: HTMLTableCellElement = document.createElement("th");
  amountContainer.appendChild(amountHTML);
  amountHTML.innerHTML = "x" + product.amount;
  amountHTML.className = "hej";

  changeAmountRow.innerHTML += /*html*/`
    <th class="hej">
      <button class="minusbtn">
        <i class="fas fa-minus"></i>
      </button>
      <button class="plusbtn">
        <i class="fas fa-plus"></i>
      </button>
    </th>
`;
}

function calculateProductPrice(cartProducts: CartProduct[]) {
  cartProducts.forEach((p) => p.price *= p.amount)
}

function renderTotalPrice(cartProducts: CartProduct[]) {
  let checkkouttotal2 = document.getElementById("title-total") as HTMLTableCellElement;

  let cartTotal = cartProducts.reduce((ack, p) => ack + p.price, 0);
  checkkouttotal2.innerHTML += `total: ${cartTotal}$`;
}
