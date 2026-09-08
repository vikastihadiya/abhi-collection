/* =====================================================
ABHI COLLECTION
MEN'S CLOTHING WEBSITE
PRODUCTS WILL BE ADDED THROUGH ADMIN PANEL
===================================================== */

/* ================= PRODUCTS ================= */
/*
IMPORTANT:
There are currently NO sample products.

Later:
Firebase will provide the real products
uploaded from the Admin Panel.
*/

const products = [];

/* ================= CART ================= */

let cart =
JSON.parse(
localStorage.getItem("abhiCart")
) || [];

/* ================= DISPLAY PRODUCTS ================= */

function displayProducts() {

```
const grid =
    document.getElementById("productGrid");

grid.innerHTML = "";


/* No products uploaded yet */

if (products.length === 0) {

    grid.innerHTML = `

        <div class="empty-collection">

            <div class="empty-icon">
                👔
            </div>

            <h3>
                Collection Coming Soon
            </h3>

            <p>
                Our latest men's clothing collection
                will be available here soon.
            </p>

            <p>
                Stay connected with Abhi Collection
                for new arrivals.
            </p>

        </div>

    `;

    return;
}


/* Display real products later */

products.forEach(product => {

    const card =
        document.createElement("div");

    card.className =
        "product-card";


    card.innerHTML = `

        <div class="product-image">

            <img
                src="${product.images[0]}"
                alt="${product.name}"
            >

        </div>


        <div class="product-info">

            <h3>
                ${product.name}
            </h3>


            <p class="product-description">
                ${product.description}
            </p>


            <div class="price">

                <span class="sale-price">
                    ₹${product.price}
                </span>

                <span class="mrp">
                    ₹${product.mrp}
                </span>

            </div>


            <div class="sizes">

                <strong>Sizes:</strong>

                ${product.sizes.join(", ")}

            </div>


            <button
                class="add-cart"
                onclick="addToCart(${product.id})">

                Add to Cart

            </button>

        </div>

    `;


    grid.appendChild(card);

});
```

}

/* ================= ADD TO CART ================= */

function addToCart(productId) {

```
const product =
    products.find(
        p => p.id === productId
    );


if (!product) {
    return;
}


const existing =
    cart.find(
        item => item.id === productId
    );


if (existing) {

    existing.quantity++;

} else {

    cart.push({

        id: product.id,

        name: product.name,

        price: product.price,

        image: product.images[0],

        quantity: 1

    });

}


saveCart();

updateCart();

openCart();
```

}

/* ================= SAVE CART ================= */

function saveCart() {

```
localStorage.setItem(
    "abhiCart",
    JSON.stringify(cart)
);
```

}

/* ================= UPDATE CART ================= */

function updateCart() {

```
const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );


cartItems.innerHTML = "";


let total = 0;

let count = 0;


cart.forEach((item, index) => {

    total +=
        item.price *
        item.quantity;

    count +=
        item.quantity;


    const div =
        document.createElement("div");

    div.className =
        "cart-item";


    div.innerHTML = `

        <img
            src="${item.image}"
            alt="${item.name}"
        >


        <div class="cart-item-info">

            <h4>
                ${item.name}
            </h4>

            <p>
                ₹${item.price}
            </p>


            <div class="quantity">

                <button
                    onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(${index}, 1)">
                    +
                </button>


                <button
                    class="remove"
                    onclick="removeItem(${index})">

                    Remove

                </button>

            </div>

        </div>

    `;


    cartItems.appendChild(div);

});


cartCount.innerText =
    count;

cartTotal.innerText =
    "₹" + total;
```

}

/* ================= CHANGE QUANTITY ================= */

function changeQuantity(index, change) {

```
if (!cart[index]) {
    return;
}


cart[index].quantity +=
    change;


if (cart[index].quantity <= 0) {

    cart.splice(index, 1);

}


saveCart();

updateCart();
```

}

/* ================= REMOVE ITEM ================= */

function removeItem(index) {

```
cart.splice(index, 1);

saveCart();

updateCart();
```

}

/* ================= OPEN CART ================= */

function openCart() {

```
document
    .getElementById("cartOverlay")
    .classList.add("active");
```

}

/* ================= CLOSE CART ================= */

function closeCart() {

```
document
    .getElementById("cartOverlay")
    .classList.remove("active");
```

}

/* ================= WHATSAPP ORDER ================= */

function orderWhatsApp(phoneNumber) {

```
if (cart.length === 0) {

    alert(
        "Your cart is empty."
    );

    return;

}


let message =
    "Hello Abhi Collection!%0A%0A";

message +=
    "*I want to order the following products:*%0A%0A";


let total = 0;


cart.forEach((item, index) => {

    const itemTotal =
        item.price *
        item.quantity;

    total +=
        itemTotal;


    message +=
        `${index + 1}. ${item.name}%0A`;

    message +=
        `Quantity: ${item.quantity}%0A`;

    message +=
        `Price: ₹${item.price}%0A`;

    message +=
        `Subtotal: ₹${itemTotal}%0A%0A`;

});


message +=
    `*Total: ₹${total}*%0A%0A`;

message +=
    "Please confirm my order.";


const whatsappURL =
    `https://wa.me/91${phoneNumber}?text=${message}`;


window.open(
    whatsappURL,
    "_blank"
);
```

}

/* ================= INITIALIZE ================= */

displayProducts();

updateCart();

