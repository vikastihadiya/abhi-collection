/* =====================================================
   ABHI COLLECTION
   PUBLIC WEBSITE — SUPABASE
===================================================== */


/* =====================================================
   CART
===================================================== */

let cart = [];


/* =====================================================
   IMAGE HELPER
===================================================== */

function getImagesArray(images) {

    if (!images) {
        return [];
    }


    /* Already an array */

    if (Array.isArray(images)) {
        return images;
    }


    /* TEXT */

    if (typeof images === "string") {

        try {

            const parsed =
                JSON.parse(images);


            if (Array.isArray(parsed)) {
                return parsed;
            }


            if (
                typeof parsed ===
                "string"
            ) {
                return [parsed];
            }

        } catch (error) {

            /* Direct URL */

            if (
                images.startsWith(
                    "http://"
                ) ||
                images.startsWith(
                    "https://"
                )
            ) {
                return [images];
            }
        }
    }


    return [];
}


/* =====================================================
   SIZE HELPER
===================================================== */

function getSizesArray(sizes) {

    if (!sizes) {
        return [];
    }


    if (Array.isArray(sizes)) {
        return sizes;
    }


    if (typeof sizes === "string") {

        try {

            const parsed =
                JSON.parse(sizes);


            if (Array.isArray(parsed)) {
                return parsed;
            }

        } catch (error) {

            return sizes
                .split(",")
                .map(
                    size =>
                        size.trim()
                )
                .filter(
                    size =>
                        size !== ""
                );
        }
    }


    return [];
}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    const productsContainer =
        document.getElementById(
            "products"
        ) ||
        document.getElementById(
            "productsGrid"
        ) ||
        document.getElementById(
            "productGrid"
        );


    if (!productsContainer) {

        console.error(
            "Product container not found."
        );

        return;
    }


    productsContainer.innerHTML =
        `
        <div class="loading-products">
            Loading collection...
        </div>
        `;


    try {

        const {
            data: products,
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


        if (error) {
            throw error;
        }


        productsContainer.innerHTML =
            "";


        if (
            !products ||
            products.length === 0
        ) {

            productsContainer.innerHTML =
                `
                <div class="empty-products">
                    <h3>
                        Collection Coming Soon
                    </h3>

                    <p>
                        New styles are being added.
                    </p>
                </div>
                `;

            return;
        }


        products.forEach(
            product => {

                createProductCard(
                    product,
                    productsContainer
                );
            }
        );


    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        productsContainer.innerHTML =
            `
            <div class="empty-products">
                <h3>
                    Unable to load products
                </h3>

                <p>
                    Please refresh the page.
                </p>
            </div>
            `;
    }
}


/* =====================================================
   CREATE PRODUCT CARD
===================================================== */

function createProductCard(
    product,
    container
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "product-card";


    /* IMAGE */

    const images =
        getImagesArray(
            product.images
        );


    const image =
        images.length > 0
            ? images[0]
            : "";


    /* SIZES */

    const sizes =
        getSizesArray(
            product.sizes
        );


    const sizeText =
        sizes.length > 0
            ? sizes.join(", ")
            : "Available sizes";


    /* PRICE */

    const price =
        Number(
            product.price
        ) || 0;


    const mrp =
        Number(
            product.mrp
        ) || 0;


    /* DISCOUNT */

    let discountText = "";


    if (
        mrp > price &&
        mrp > 0
    ) {

        const discount =
            Math.round(
                (
                    (mrp - price) /
                    mrp
                ) * 100
            );


        discountText =
            `
            <span class="discount">
                ${discount}% OFF
            </span>
            `;
    }


    /* IMAGE HTML */

    const imageHTML =
        image
            ? `
                <div class="product-image">
                    <img
                        src="${image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="
                            this.style.display='none';
                            this.parentElement.classList.add('image-error');
                        "
                    >
                </div>
            `
            : `
                <div class="product-image image-error">
                    <span>
                        Image unavailable
                    </span>
                </div>
            `;


    card.innerHTML =
        `

        ${imageHTML}

        <div class="product-info">

            <h3 class="product-name">
                ${product.name}
            </h3>


            <div class="product-price">

                <strong>
                    ₹${price}
                </strong>

                ${
                    mrp > price
                        ? `
                            <del>
                                ₹${mrp}
                            </del>
                        `
                        : ""
                }

                ${discountText}

            </div>


            <p class="product-description">
                ${
                    product.description ||
                    ""
                }
            </p>


            <p class="product-sizes">
                <strong>
                    Sizes:
                </strong>

                ${sizeText}
            </p>


            <button
                class="add-to-cart-button"
                type="button"
            >
                Add to Cart
            </button>

        </div>

        `;


    /* ADD TO CART */

    const addButton =
        card.querySelector(
            ".add-to-cart-button"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                addToCart(
                    product.name,
                    price,
                    product.id,
                    image,
                    sizes
                );
            }
        );
    }


    container.appendChild(
        card
    );
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(
    productName,
    price,
    productId = null,
    image = "",
    sizes = []
) {

    const existing =
        cart.find(
            item =>
                item.id ===
                productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id:
                productId ||
                Date.now(),

            name:
                productName,

            price:
                Number(price) || 0,

            image:
                image,

            sizes:
                sizes,

            quantity:
                1
        });
    }


    updateCartCount();

    updateCartDisplay();


    alert(
        productName +
        " added to cart."
    );
}


/* =====================================================
   UPDATE CART COUNT
===================================================== */

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        ) ||
        document.getElementById(
            "cartCount"
        );


    if (!cartCount) {
        return;
    }


    const totalItems =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;
}


/* =====================================================
   SHOW CART
===================================================== */

function showCart() {

    updateCartDisplay();


    const cartModal =
        document.getElementById(
            "cartModal"
        );


    if (cartModal) {

        cartModal.style.display =
            "flex";

        return;
    }


    /* If no modal exists,
       show cart information */

    if (cart.length === 0) {

        alert(
            "Your Abhi Collection cart is empty."
        );

        return;
    }


    const message =
        cart
            .map(
                item =>
                    `${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`
            )
            .join("\n");


    alert(
        "Your Cart:\n\n" +
        message
    );
}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const cartModal =
        document.getElementById(
            "cartModal"
        );


    if (cartModal) {

        cartModal.style.display =
            "none";
    }
}


/* =====================================================
   UPDATE CART DISPLAY
===================================================== */

function updateCartDisplay() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (cartItems) {

        cartItems.innerHTML =
            "";


        if (cart.length === 0) {

            cartItems.innerHTML =
                `
                <p>
                    Your cart is empty.
                </p>
                `;

        } else {

            cart.forEach(
                (item, index) => {

                    const itemDiv =
                        document.createElement(
                            "div"
                        );


                    itemDiv.className =
                        "cart-item";


                    itemDiv.innerHTML =
                        `

                        ${
                            item.image
                                ? `
                                    <img
                                        src="${item.image}"
                                        alt="${item.name}"
                                    >
                                `
                                : ""
                        }

                        <div>

                            <h4>
                                ${item.name}
                            </h4>

                            <p>
                                ₹${item.price}
                            </p>

                            <p>
                                Quantity:
                                ${item.quantity}
                            </p>

                            <button
                                type="button"
                                onclick="
                                    removeFromCart(${index})
                                "
                            >
                                Remove
                            </button>

                        </div>

                        `;


                    cartItems.appendChild(
                        itemDiv
                    );
                }
            );
        }
    }


    if (cartTotal) {

        const total =
            cart.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    (
                        item.price *
                        item.quantity
                    ),
                0
            );


        cartTotal.textContent =
            "₹" + total;
    }
}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(
    index
) {

    if (
        index >= 0 &&
        index < cart.length
    ) {

        cart.splice(
            index,
            1
        );
    }


    updateCartCount();

    updateCartDisplay();
}


/* =====================================================
   WHATSAPP ORDER
===================================================== */

function orderOnWhatsApp(
    phoneNumber
) {

    if (
        !phoneNumber
    ) {

        phoneNumber =
            "7088443473";
    }


    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    let message =
        "Hello Abhi Collection,%0A%0AI would like to order:%0A";


    cart.forEach(
        item => {

            message +=
                `%0A• ${item.name} × ${item.quantity} - ₹${item.price * item.quantity}`;
        }
    );


    const total =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    message +=
        `%0A%0ATotal: ₹${total}`;


    const whatsappURL =
        `https://wa.me/91${phoneNumber}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );
}


/* =====================================================
   MAKE FUNCTIONS AVAILABLE
===================================================== */

window.addToCart =
    addToCart;

window.showCart =
    showCart;

window.closeCart =
    closeCart;

window.removeFromCart =
    removeFromCart;

window.orderOnWhatsApp =
    orderOnWhatsApp;

window.updateCartCount =
    updateCartCount;


/* =====================================================
   CART BUTTON
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const cartButton =
            document.getElementById(
                "cartButton"
            );


        if (cartButton) {

            cartButton.addEventListener(
                "click",
                showCart
            );
        }


        /* Close modal when clicking
           outside */

        const cartModal =
            document.getElementById(
                "cartModal"
            );


        if (cartModal) {

            cartModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        cartModal
                    ) {

                        closeCart();
                    }
                }
            );
        }


        updateCartCount();

        updateCartDisplay();
    }
);


/* =====================================================
   LOAD PRODUCTS
===================================================== */

loadProducts();
