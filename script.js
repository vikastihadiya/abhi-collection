/* =========================================================
   ABHI COLLECTION - MAIN SCRIPT
   ========================================================= */


/* =========================================================
   1. SUPABASE PRODUCT IMAGE HELPER
   ========================================================= */

function getImagesArray(images) {

    if (!images) {
        return [];
    }

    if (Array.isArray(images)) {
        return images;
    }

    if (typeof images === "string") {

        try {

            const parsed = JSON.parse(images);

            if (Array.isArray(parsed)) {
                return parsed;
            }

            if (typeof parsed === "string") {
                return [parsed];
            }

        } catch (error) {

            if (
                images.startsWith("http://") ||
                images.startsWith("https://")
            ) {
                return [images];
            }

        }
    }

    return [];
}


/* =========================================================
   2. PRODUCT SIZE HELPER
   ========================================================= */

function getSizesArray(sizes) {

    if (!sizes) {
        return [];
    }

    if (Array.isArray(sizes)) {
        return sizes;
    }

    if (typeof sizes === "string") {

        try {

            const parsed = JSON.parse(sizes);

            if (Array.isArray(parsed)) {
                return parsed;
            }

            if (typeof parsed === "string") {
                return [parsed];
            }

        } catch (error) {

            return sizes
                .split(",")
                .map(function (size) {
                    return size.trim();
                })
                .filter(Boolean);

        }
    }

    return [];
}


/* =========================================================
   3. CART
   ========================================================= */

let cart = [];


/* =========================================================
   4. FORCE PRODUCT SIZE
   ========================================================= */

function setupProductLayout() {

    const style = document.createElement("style");

    style.innerHTML = `

        /* PRODUCT GRID */

        .product-grid {
            display: grid !important;
            grid-template-columns: repeat(
                auto-fill,
                minmax(220px, 1fr)
            ) !important;

            gap: 24px !important;

            width: 100% !important;
            max-width: 1200px !important;

            margin-left: auto !important;
            margin-right: auto !important;
        }


        /* PRODUCT CARD */

        .product-card {
            width: 100% !important;
            max-width: 280px !important;

            margin-left: auto !important;
            margin-right: auto !important;

            overflow: hidden !important;

            box-sizing: border-box !important;
        }


        /* PRODUCT IMAGE BOX */

        .product-image {
            width: 100% !important;

            height: 280px !important;

            overflow: hidden !important;

            position: relative !important;

            background: #f7f7f7 !important;

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;
        }


        /* PRODUCT IMAGE */

        .product-image img {

            width: 100% !important;

            height: 280px !important;

            max-width: 100% !important;

            object-fit: contain !important;

            display: block !important;
        }


        /* PRODUCT INFORMATION */

        .product-info {
            padding: 14px !important;
        }


        /* TABLET */

        @media (max-width: 900px) {

            .product-grid {

                grid-template-columns:
                    repeat(2, minmax(0, 1fr))
                !important;

                gap: 18px !important;
            }

            .product-card {
                max-width: 100% !important;
            }

            .product-image {
                height: 260px !important;
            }

            .product-image img {
                height: 260px !important;
            }
        }


        /* MOBILE */

        @media (max-width: 600px) {

            .product-grid {

                grid-template-columns:
                    repeat(2, minmax(0, 1fr))
                !important;

                gap: 10px !important;
            }

            .product-image {

                height: 220px !important;
            }

            .product-image img {

                height: 220px !important;
            }

            .product-info {

                padding: 10px !important;
            }
        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   5. LOAD PRODUCTS FROM SUPABASE
   ========================================================= */

async function loadProducts() {

    const productGrid =
        document.querySelector(".product-grid");

    if (!productGrid) {
        return;
    }

    productGrid.innerHTML =
        "<p>Loading products...</p>";


    try {

        const {
            data: products,
            error
        } = await supabaseClient
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


        productGrid.innerHTML = "";


        if (
            !products ||
            products.length === 0
        ) {

            productGrid.innerHTML = `
                <div class="no-products">
                    <h3>Collection Coming Soon</h3>
                    <p>New products will be added soon.</p>
                </div>
            `;

            return;
        }


        products.forEach(function (product) {

            createProductCard(
                productGrid,
                product
            );

        });


        updateCartCount();

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        productGrid.innerHTML = `
            <div class="no-products">
                <h3>Unable to load products</h3>
                <p>Please refresh the page.</p>
            </div>
        `;
    }
}


/* =========================================================
   6. CREATE PRODUCT CARD
   ========================================================= */

function createProductCard(
    productGrid,
    product
) {

    const article =
        document.createElement("article");


    article.className =
        "product-card";


    article.setAttribute(
        "data-product-id",
        product.id
    );


    const images =
        getImagesArray(product.images);


    const image =
        images.length > 0
            ? images[0]
            : "";


    const sizes =
        getSizesArray(product.sizes);


    let sizeText = "";


    if (sizes.length > 0) {

        sizeText =
            `<p class="product-sizes">
                Sizes: ${sizes.join(", ")}
            </p>`;

    }


    const price =
        Number(product.price) || 0;


    const mrp =
        Number(product.mrp) || 0;


    let imageHTML = "";


    if (image) {

        imageHTML = `
            <img
                src="${image}"
                alt="${product.name || "Product"}"
                loading="lazy"
            >
        `;

    } else {

        imageHTML = `
            <div class="no-product-image">
                No Image
            </div>
        `;

    }


    article.innerHTML = `

        <div class="product-image">

            <span class="sale-tag">
                NEW
            </span>

            ${imageHTML}

        </div>


        <div class="product-info">

            <h3>
                ${product.name || "Product"}
            </h3>


            ${
                product.description
                    ? `<p class="product-description">
                        ${product.description}
                       </p>`
                    : ""
            }


            ${sizeText}


            <div class="price-area">

                <strong>
                    ₹${price}
                </strong>

                ${
                    mrp > price
                        ? `<del>
                            ₹${mrp}
                           </del>`
                        : ""
                }

            </div>


            <button
                class="add-cart"
                type="button"
                onclick="addToCart(
                    '${String(
                        product.name || "Product"
                    ).replace(/'/g, "\\'")}',
                    ${price}
                )"
            >
                Add to Cart
            </button>

        </div>

    `;


    productGrid.appendChild(article);
}


/* =========================================================
   7. ADD TO CART
   ========================================================= */

function addToCart(
    productName,
    price
) {

    cart.push({
        name: productName,
        price: price
    });


    updateCartCount();


    alert(
        productName +
        " added to cart!"
    );
}


/* =========================================================
   8. UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {

    const cartCount =
        document.querySelector(
            ".cart-count"
        );


    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }
}


/* =========================================================
   9. SHOW CART
   ========================================================= */

function showCart() {

    if (cart.length === 0) {

        alert(
            "Your Abhi Collection cart is empty."
        );

        return;
    }


    let message =
        "Your Cart:\n\n";


    let total = 0;


    cart.forEach(function (item, index) {

        message +=
            `${index + 1}. ${item.name} - ₹${item.price}\n`;

        total +=
            Number(item.price);

    });


    message +=
        `\nTotal: ₹${total}`;


    alert(message);
}


/* =========================================================
   10. WHATSAPP ORDER
   ========================================================= */

function orderOnWhatsApp(
    phoneNumber
) {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    let message =
        "Hello Abhi Collection,%0A%0A";


    message +=
        "I want to order:%0A";


    let total = 0;


    cart.forEach(function (item, index) {

        message +=
            `${index + 1}. ${item.name} - ₹${item.price}%0A`;

        total +=
            Number(item.price);

    });


    message +=
        `%0ATotal: ₹${total}`;


    const whatsappURL =
        `https://wa.me/91${phoneNumber}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );
}


/* =========================================================
   11. CART BUTTON
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".cart-button, #cartButton, #cart-btn"
            );


        if (button) {

            showCart();

        }

    }
);


/* =========================================================
   12. INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupProductLayout();

        loadProducts();

        console.log(
            "ABHI COLLECTION WEBSITE LOADED"
        );

    }
);


/* =========================================================
   13. MAKE FUNCTIONS AVAILABLE TO HTML
   ========================================================= */

window.addToCart =
    addToCart;

window.showCart =
    showCart;

window.updateCartCount =
    updateCartCount;

window.orderOnWhatsApp =
    orderOnWhatsApp;
