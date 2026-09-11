/* =====================================================
   ABHI COLLECTION
   MEN'S CLOTHING WEBSITE
   PRODUCTS LOADED FROM SUPABASE
===================================================== */


/* ================= SUPABASE PRODUCTS ================= */

let products = [];


/* ================= CART ================= */

let cart =
    JSON.parse(
        localStorage.getItem("abhiCart")
    ) || [];


/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {

    const grid =
        document.getElementById("productGrid");

    if (!grid) {
        return;
    }


    /* Show loading message */

    grid.innerHTML = `

        <div class="empty-collection">

            <div class="empty-icon">
                👔
            </div>

            <h3>
                Loading Collection...
            </h3>

            <p>
                Please wait while we load our
                latest products.
            </p>

        </div>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("products")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        /* ================= ERROR ================= */

        if (error) {

            console.error(
                "Supabase product error:",
                error
            );

            grid.innerHTML = `

                <div class="empty-collection">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load products
                    </h3>

                    <p>
                        Please refresh the page
                        and try again.
                    </p>

                </div>

            `;

            return;
        }


        /* Save products */

        products =
            data || [];


        /* Display products */

        displayProducts();


    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        grid.innerHTML = `

            <div class="empty-collection">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    Please refresh the website
                    and try again.
                </p>

            </div>

        `;

    }

}


/* ================= DISPLAY PRODUCTS ================= */

function displayProducts() {

    const grid =
        document.getElementById("productGrid");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    /* ================= NO PRODUCTS ================= */

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
                    Our latest men's clothing
                    collection will be available here soon.
                </p>

                <p>
                    Stay connected with
                    Abhi Collection for new arrivals.
                </p>

            </div>

        `;

        return;
    }


    /* ================= DISPLAY PRODUCTS ================= */

    products.forEach(
        function(product) {


            const card =
                document.createElement("div");


            card.className =
                "product-card";


            /* Make sure image exists */

            const firstImage =
                product.images &&
                product.images.length > 0
                    ? product.images[0]
                    : "";


            /* Make sure sizes exist */

            let sizesText = "";


            if (
                Array.isArray(product.sizes)
            ) {

                sizesText =
                    product.sizes.join(", ");

            } else if (
                typeof product.sizes === "string"
            ) {

                sizesText =
                    product.sizes;

            }


            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${firstImage}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>


                <div class="product-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <p class="product-description">
                        ${product.description || ""}
                    </p>


                    <div class="price">

                        <span class="sale-price">
                            ₹${product.price}
                        </span>


                        <span class="mrp">
                            ₹${product.mrp}
                        </span>

                    </div>


                    ${
                        sizesText
                            ? `
                                <div class="sizes">

                                    <strong>
                                        Sizes:
                                    </strong>

                                    ${sizesText}

                                </div>
                            `
                            : ""
                    }


                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})">

                        Add to Cart

                    </button>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}


/* ================= ADD TO CART ================= */

function addToCart(productId) {

    const product =
        products.find(
            function(p) {
                return p.id === productId;
            }
        );


    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        return;

    }


    const existing =
        cart.find(
            function(item) {
                return item.id === productId;
            }
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                Number(product.price),

            image:
                product.images &&
                product.images.length > 0
                    ? product.images[0]
                    : "",

            quantity:
                1

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


    if (
        !cartItems ||
        !cartCount ||
        !cartTotal
    ) {

        return;

    }


    cartItems.innerHTML = "";


    let total = 0;

    let count = 0;


    cart.forEach(
        function(item, index) {


            total +=
                Number(item.price) *
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

        }
    );


    cartCount.innerText =
        count;


    cartTotal.innerText =
        "₹" + total;

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(
    index,
    change
) {

    if (!cart[index]) {

        return;

    }


    cart[index].quantity +=
        change;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    }


    saveCart();

    updateCart();

}


/* ================= REMOVE ITEM ================= */

function removeItem(index) {

    if (!cart[index]) {

        return;

    }


    cart.splice(
        index,
        1
    );


    saveCart();

    updateCart();

}


/* ================= OPEN CART ================= */

function openCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }

}


/* ================= CLOSE CART ================= */

function closeCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }

}


/* ================= WHATSAPP ORDER ================= */

function orderWhatsApp(
    phoneNumber
) {

    if (
        cart.length === 0
    ) {

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


    cart.forEach(
        function(item, index) {


            const itemTotal =
                Number(item.price) *
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

        }
    );


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

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

        loadProducts();

    }
);
