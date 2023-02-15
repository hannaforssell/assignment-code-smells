import { CartItem } from "./vgModels/CartItem";
import { Item } from "./vgModels/Item";
import { ItemCategory } from "./vgModels/ItemCategory";
import { Product } from "./vgModels/Product";
import { SortOrder } from "./vgModels/SortOrder";

/*
1. Se om du kan hitta problem med koden nedan och se om du kan göra den bättre.
*/

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

 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
  2. Refaktorera funktionen createProductHtml :)
  */

const CART_STORAGE_NAME = 'savedItemsInCart';
const SHOP_STORAGE_NAME = 'savedItemsInShop';

export let itemsInCart = JSON.parse(localStorage.getItem(CART_STORAGE_NAME) || "[]");
export let itemsInShop = JSON.parse( `
  [
    {
      "picture": "https://tinypng.com/images/social/website.jpg",
      "pictureAlt": "picAlt",
      "name": "name",
      "price": 20,
      "info": "info",
      "productSpec": false,
      "category": "kriminella"
    }
  ]
`) as Item[];

class Cart {
  addToCart(i: number) { }
}

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
            <i class="bi bi-bag-plus"></i>
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
  let iTag = el.querySelector('i') as HTMLElement;

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

  iTag.addEventListener("click", () => {
    addToCart(item, 1);
  });
}

function addToCart(item: Item, quantity: number) {
  let cartItem = mapToCartItem(item, quantity);
  itemsInCart.push(cartItem);
  localStorage.setItem(CART_STORAGE_NAME, JSON.stringify(itemsInCart));
}

function mapToCartItem(item: Item, quantity: number): CartItem {
  return new CartItem(item.picture, item.pictureAlt, item.name, item.price, item.info, item.productSpec, item.category, quantity);
}

renderAllHTML(itemsInCart, itemsInShop);





































/*
  3. Refaktorera funktionen getfromstorage
  */
export class CartProduct {
  constructor(
    public name: string,
    public image: string,
    public price: number,
    public amount: number
  ) { }
}

function getfromstorage() {
  let container = document.getElementById("checkout-table");

  let fromstorage: string = localStorage.getItem("cartArray") || "";
  let astext: CartProduct[] = JSON.parse(fromstorage);

  let productcontainer = document.getElementById(
    "product-ckeckout-container"
  ) as HTMLDivElement;

  let amountcontainer = document.getElementById(
    "amount-checkout-container2"
  ) as HTMLDivElement;
  let amounttext: HTMLTableCellElement = document.createElement("th");
  amountcontainer.appendChild(amounttext);
  amounttext.innerHTML = "amount:";

  let titlecontainer = document.getElementById(
    "title-container"
  ) as HTMLTableRowElement;
  titlecontainer.innerHTML = "<strong>products:</strong>";

  let productquantity = document.getElementById(
    "product-quantity"
  ) as HTMLTableRowElement;
  let qttext: HTMLTableCellElement = document.createElement("th");
  productquantity.appendChild(qttext);
  qttext.innerHTML = "change quantity:";

  let checkkouttotal2 = document.getElementById(
    "title-total"
  ) as HTMLTableCellElement;
  let totaltext: HTMLTableCellElement = document.createElement("th");
  checkkouttotal2.appendChild(totaltext);
  totaltext.innerHTML = "total:";

  for (let i: number = 0; i < astext.length; i++) {
    let productt: HTMLTableCellElement = document.createElement("th");
    titlecontainer.appendChild(productt);
    productt.innerHTML = astext[i].name;
    productt.className = "hej";

    let amountt: HTMLTableCellElement = document.createElement("th");
    amountcontainer.appendChild(amountt);
    amountt.innerHTML = "x" + astext[i].amount;
    amountt.className = "hej";

    let amountqt: HTMLTableCellElement = document.createElement("th");
    productquantity.appendChild(amountqt);
    let amountplusbtn: HTMLButtonElement = document.createElement("button");
    amountqt.appendChild(amountplusbtn);
    amountqt.className = "hej";

    let icon: HTMLSpanElement = document.createElement("i");
    amountplusbtn.appendChild(icon);

    icon.className = "fas fa-minus";
    amountplusbtn.className = "plusbtn";

    let icon2: HTMLSpanElement = document.createElement("i");
    icon2.className = "fas fa-plus";

    let amountminusbtn: HTMLButtonElement = document.createElement("button");
    amountqt.appendChild(amountminusbtn);
    amountminusbtn.appendChild(icon2);
    amountminusbtn.className = "minusbtn";
  }

  let addition: number = 0;

  for (let i = 0; i < astext.length; i++) {
    addition += astext[i].price *= astext[i].amount;
  }

  let totalprice2: HTMLTableCellElement = document.createElement("th");
  checkkouttotal2.appendChild(totalprice2);
  totalprice2.innerHTML = addition + "$";
  totalprice2.id = "totalincenter";
}

export function test() {
  console.log('test')
}