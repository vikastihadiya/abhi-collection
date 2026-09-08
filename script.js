/* =====================================================
   ABHI COLLECTION
   MAIN WEBSITE JAVASCRIPT
===================================================== */


/* ================= SAMPLE PRODUCTS ================= */

const products = [

    {
        id: 1,

        name: "Elegant Black Kurti",

        price: 699,

        mrp: 999,

        description: "Stylish and comfortable everyday kurti.",

        sizes: ["S", "M", "L", "XL"],

        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=80"
        ]
    },


    {
        id: 2,

        name: "Premium Women's Dress",

        price: 899,

        mrp: 1299,

        description: "Beautiful dress for casual and special occasions.",

        sizes: ["S", "M", "L", "XL"],

        images: [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80"
        ]
    },


    {
        id: 3,

        name: "Trendy Cotton Kurti",

        price: 749,

        mrp: 1099,

        description: "Soft cotton fabric with a modern look.",

        sizes: ["M", "L", "XL", "XXL"],

        images: [
            "https://images.unsplash.com/photo-1585488433560-8d7f7e8e3f6b?auto=format&fit=crop&w=700&q=80"
        ]
    },


    {
        id: 4,

        name: "Designer Women's Top",

        price: 599,

        mrp: 899,

        description: "Trendy top perfect for everyday styling.",

        sizes: ["S", "M", "L", "XL"],

        images: [
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80"
        ]
    }

];


/* ================= CART ================= */

let cart = JSON.parse(
    localStorage.getItem("abhiCart")
) || [];


/* ================= SHOW PRODUCTS ================= */

function displayProducts() {

    const grid =
        document.getElementById("productGrid");

    grid.innerHTML = "";


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


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

}


/* ================= ADD TO CART ================= */

function addToCart(productId) {

    const product =
        products.find(
            p => p.id === productId
        );


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

}


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "abhiCart",
        JSON.stringify(cart)
    );

}


/* ================= UPDATE CART ================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    cartItems.innerHTML = "";


    let total = 0;

    let count = 0;


    cart.forEach((item, index) => {

        total +=
            item.price * item.quantity;

        count += item.quantity;


        const div =
            document.createElement("div");

        div.className = "cart-item";


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


    cartCount.innerText = count;

    cartTotal.innerText =
        "₹" + total;

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(index, change) {

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();

}


/* ================= REMOVE ================= */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


/* ================= OPEN CART ================= */

function openCart() {

    document
        .getElementById("cartOverlay")
        .classList.add("active");

}


/* ================= CLOSE CART ================= */

function closeCart() {

    document
        .getElementById("cartOverlay")
        .classList.remove("active");

}


/* ================= WHATSAPP ORDER ================= */

function orderWhatsApp(phoneNumber) {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    let message =
        "Hello Abhi Collection!%0A%0A";

    message +=
        "*I want to order:%*%0A%0A";


    let total = 0;


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


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

}


/* ================= INITIALIZE ================= */

displayProducts();

updateCart();
