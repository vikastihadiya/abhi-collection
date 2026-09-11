/* =====================================================
   ABHI COLLECTION
   PUBLIC WEBSITE — SUPABASE + PRODUCT GALLERY
===================================================== */


/* =====================================================
   CART
===================================================== */

let cart = [];


/* =====================================================
   IMAGE DATA HELPER
   Supports:
   - Array
   - JSON text array
   - Single URL
===================================================== */

function getImagesArray(images) {

    if (!images) {
        return [];
    }

    /* Already an array */
    if (Array.isArray(images)) {
        return images.filter(Boolean);
    }

    /* Text stored in Supabase */
    if (typeof images === "string") {

        try {

            const parsed = JSON.parse(images);

            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean);
            }

            if (typeof parsed === "string") {
                return [parsed];
            }

        } catch (error) {

            /* If it is simply a URL */
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


/* =====================================================
   SIZE DATA HELPER
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

            const parsed = JSON.parse(sizes);

            if (Array.isArray(parsed)) {
                return parsed;
            }

        } catch (error) {

            return sizes
                .split(",")
                .map(size => size.trim())
                .filter(Boolean);
        }
    }

    return [];
}


/* =====================================================
   UPDATE CART COUNT
===================================================== */

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    cartCount.textContent = cart.length;
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productName, price) {

    cart.push({
        name: productName,
        price: Number(price)
    });

    updateCartCount();

    alert(
        productName +
        " has been added to your cart."
    );
}


/* =====================================================
   SHOW CART
===================================================== */

function showCart() {

    if (cart.length === 0) {

        alert(
            "Your Abhi Collection cart is empty."
        );

        return;
    }

    let message =
        "Your Abhi Collection Cart\n\n";

    let total = 0;

    cart.forEach((item, index) => {

        message +=
            (index + 1) +
            ". " +
            item.name +
            " - ₹" +
            item.price +
            "\n";

        total += Number(item.price);
    });

    message +=
        "\nTotal: ₹" +
        total;

    message +=
        "\n\nTo order, contact us on WhatsApp.";

    alert(message);
}


/* =====================================================
   WHATSAPP ORDER
===================================================== */

function orderOnWhatsApp(productName, price) {

    const phoneNumbers = [
        "7088443473",
        "8958123749"
    ];

    const message =
        "Hello Abhi Collection,%0A%0A" +
        "I want to order:%0A" +
        productName +
        "%0APrice: ₹" +
        price +
        "%0A%0APlease share availability and order details.";

    const whatsappURL =
        "https://wa.me/" +
        phoneNumbers[0] +
        "?text=" +
        message;

    window.open(
        whatsappURL,
        "_blank"
    );
}


/* =====================================================
   PRODUCT GALLERY
===================================================== */

function createProductGallery(images, productName) {

    const gallery =
        document.createElement("div");

    gallery.className =
        "product-gallery";


    /* =================================================
       MAIN IMAGE
    ================================================= */

    const mainImageContainer =
        document.createElement("div");

    mainImageContainer.className =
        "product-main-image";


    const mainImage =
        document.createElement("img");

    mainImage.className =
        "main-product-image";

    mainImage.alt =
        productName;


    if (images.length > 0) {

        mainImage.src =
            images[0];

    } else {

        mainImage.style.display =
            "none";

        const noImage =
            document.createElement("div");

        noImage.className =
            "no-product-image";

        noImage.textContent =
            "Product Image";

        mainImageContainer.appendChild(
            noImage
        );
    }


    mainImageContainer.appendChild(
        mainImage
    );

    gallery.appendChild(
        mainImageContainer
    );


    /* =================================================
       THUMBNAILS
    ================================================= */

    if (images.length > 1) {

        const thumbnails =
            document.createElement("div");

        thumbnails.className =
            "product-thumbnails";


        images.forEach(
            (imageURL, index) => {

                const thumbnailButton =
                    document.createElement("button");

                thumbnailButton.type =
                    "button";

                thumbnailButton.className =
                    "product-thumbnail";


                if (index === 0) {

                    thumbnailButton.classList.add(
                        "active"
                    );
                }


                const thumbnailImage =
                    document.createElement("img");

                thumbnailImage.src =
                    imageURL;

                thumbnailImage.alt =
                    productName +
                    " photo " +
                    (index + 1);


                thumbnailButton.appendChild(
                    thumbnailImage
                );


                /* ===============================
                   CHANGE MAIN IMAGE
                =============================== */

                thumbnailButton.addEventListener(
                    "click",
                    function () {

                        mainImage.src =
                            imageURL;


                        document
                            .querySelectorAll(
                                ".product-thumbnail"
                            )
                            .forEach(
                                button => {

                                    button.classList.remove(
                                        "active"
                                    );
                                }
                            );


                        thumbnailButton.classList.add(
                            "active"
                        );
                    }
                );


                thumbnails.appendChild(
                    thumbnailButton
                );
            }
        );


        gallery.appendChild(
            thumbnails
        );
    }


    return gallery;
}


/* =====================================================
   CREATE PRODUCT CARD
===================================================== */

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className =
        "product-card";


    /* =================================================
       PRODUCT IMAGES
    ================================================= */

    const images =
        getImagesArray(
            product.images
        );


    /* =================================================
       GALLERY
    ================================================= */

    const gallery =
        createProductGallery(
            images,
            product.name || "Product"
        );


    card.appendChild(
        gallery
    );


    /* =================================================
       PRODUCT INFO
    ================================================= */

    const productInfo =
        document.createElement("div");

    productInfo.className =
        "product-info";


    /* =================================================
       PRODUCT NAME
    ================================================= */

    const title =
        document.createElement("h3");

    title.textContent =
        product.name ||
        "Product";


    productInfo.appendChild(
        title
    );


    /* =================================================
       PRICE AREA
    ================================================= */

    const priceRow =
        document.createElement("div");

    priceRow.className =
        "product-price-row";


    const price =
        document.createElement("strong");

    price.textContent =
        "₹" +
        Number(product.price || 0);


    priceRow.appendChild(
        price
    );


    /* MRP */

    if (
        product.mrp &&
        Number(product.mrp) >
        Number(product.price)
    ) {

        const mrp =
            document.createElement("del");

        mrp.textContent =
            "₹" +
            Number(product.mrp);


        priceRow.appendChild(
            mrp
        );
    }


    productInfo.appendChild(
        priceRow
    );


    /* =================================================
       DESCRIPTION
    ================================================= */

    if (product.description) {

        const description =
            document.createElement("p");

        description.className =
            "product-description";

        description.textContent =
            product.description;


        productInfo.appendChild(
            description
        );
    }


    /* =================================================
       SIZES
    ================================================= */

    const sizes =
        getSizesArray(
            product.sizes
        );


    if (sizes.length > 0) {

        const sizeText =
            document.createElement("p");

        sizeText.className =
            "product-sizes";


        const sizeLabel =
            document.createElement("strong");

        sizeLabel.textContent =
            "Sizes: ";


        sizeText.appendChild(
            sizeLabel
        );


        sizeText.appendChild(
            document.createTextNode(
                sizes.join(", ")
            )
        );


        productInfo.appendChild(
            sizeText
        );
    }


    /* =================================================
       BUTTON AREA
    ================================================= */

    const buttonArea =
        document.createElement("div");

    buttonArea.className =
        "product-buttons";


    /* ADD TO CART */

    const cartButton =
        document.createElement("button");

    cartButton.type =
        "button";

    cartButton.className =
        "add-cart";

    cartButton.textContent =
        "Add to Cart";


    cartButton.addEventListener(
        "click",
        function () {

            addToCart(
                product.name,
                product.price
            );
        }
    );


    buttonArea.appendChild(
        cartButton
    );


    /* =================================================
       WHATSAPP BUTTON
    ================================================= */

    const whatsappButton =
        document.createElement("button");

    whatsappButton.type =
        "button";

    whatsappButton.className =
        "whatsapp-order";

    whatsappButton.textContent =
        "Order on WhatsApp";


    whatsappButton.addEventListener(
        "click",
        function () {

            orderOnWhatsApp(
                product.name,
                product.price
            );
        }
    );


    buttonArea.appendChild(
        whatsappButton
    );


    productInfo.appendChild(
        buttonArea
    );


    /* =================================================
       FINISH CARD
    ================================================= */

    card.appendChild(
        productInfo
    );


    return card;
}


/* =====================================================
   PRODUCT PAGE STYLING
===================================================== */

function setupProductLayout() {

    const style =
        document.createElement("style");

    style.textContent = `

        /* ==========================================
           PRODUCT GRID
        ========================================== */

        .product-grid {
            display: grid !important;
            grid-template-columns:
                repeat(
                    auto-fill,
                    minmax(220px, 1fr)
                ) !important;

            gap: 24px !important;

            max-width: 1200px !important;

            margin-left: auto !important;
            margin-right: auto !important;

            padding-left: 16px !important;
            padding-right: 16px !important;
        }


        /* ==========================================
           PRODUCT CARD
        ========================================== */

        .product-card {
            width: 100% !important;

            max-width: 280px !important;

            margin-left: auto !important;
            margin-right: auto !important;

            overflow: hidden !important;

            box-sizing: border-box !important;
        }


        /* ==========================================
           PRODUCT GALLERY
        ========================================== */

        .product-gallery {
            width: 100% !important;

            box-sizing: border-box !important;
        }


        /* ==========================================
           MAIN IMAGE AREA
        ========================================== */

        .product-main-image {
            width: 100% !important;

            height: 280px !important;

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            overflow: hidden !important;

            background: #f7f7f7 !important;

            border-radius: 10px !important;

            box-sizing: border-box !important;
        }


        /* ==========================================
           MAIN IMAGE
        ========================================== */

        .main-product-image {
            width: 100% !important;

            height: 280px !important;

            max-width: 100% !important;

            object-fit: contain !important;

            display: block !important;

            margin: 0 !important;
        }


        /* ==========================================
           THUMBNAILS
        ========================================== */

        .product-thumbnails {
            display: flex !important;

            gap: 8px !important;

            margin-top: 10px !important;

            overflow-x: auto !important;

            padding-bottom: 4px !important;

            width: 100% !important;

            box-sizing: border-box !important;
        }


        /* ==========================================
           THUMBNAIL BUTTON
        ========================================== */

        .product-thumbnail {
            width: 58px !important;

            height: 58px !important;

            min-width: 58px !important;

            padding: 2px !important;

            border: 1px solid #ddd !important;

            background: white !important;

            border-radius: 7px !important;

            cursor: pointer !important;

            overflow: hidden !important;

            box-sizing: border-box !important;
        }


        /* ==========================================
           ACTIVE THUMBNAIL
        ========================================== */

        .product-thumbnail.active {
            border: 2px solid #111 !important;
        }


        /* ==========================================
           THUMBNAIL IMAGE
        ========================================== */

        .product-thumbnail img {
            width: 100% !important;

            height: 100% !important;

            object-fit: cover !important;

            display: block !important;
        }


        /* ==========================================
           NO IMAGE
        ========================================== */

        .no-product-image {
            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            width: 100% !important;

            height: 100% !important;

            color: #777 !important;

            font-size: 14px !important;
        }


        /* ==========================================
           PRODUCT INFO
        ========================================== */

        .product-info {
            padding-top: 12px !important;
        }


        .product-info h3 {
            margin-top: 0 !important;
        }


        /* ==========================================
           PRICE
        ========================================== */

        .product-price-row {
            display: flex !important;

            align-items: center !important;

            gap: 8px !important;

            margin: 6px 0 !important;
        }


        .product-price-row strong {
            font-size: 18px !important;
        }


        .product-price-row del {
            color: #777 !important;

            font-size: 14px !important;
        }


        /* ==========================================
           DESCRIPTION
        ========================================== */

        .product-description {
            font-size: 14px !important;

            line-height: 1.5 !important;
        }


        /* ==========================================
           SIZES
        ========================================== */

        .product-sizes {
            font-size: 14px !important;
        }


        /* ==========================================
           BUTTONS
        ========================================== */

        .product-buttons {
            display: flex !important;

            flex-direction: column !important;

            gap: 8px !important;

            margin-top: 10px !important;
        }


        .product-buttons button {
            width: 100% !important;

            box-sizing: border-box !important;

            cursor: pointer !important;
        }


        .add-cart {
            padding: 10px 14px !important;
        }


        .whatsapp-order {
            padding: 10px 14px !important;

            border: 1px solid #111 !important;

            background: white !important;

            color: #111 !important;

            border-radius: 6px !important;
        }


        /* ==========================================
           TABLET
        ========================================== */

        @media (max-width: 768px) {

            .product-grid {
                grid-template-columns:
                    repeat(
                        2,
                        minmax(0, 1fr)
                    ) !important;

                gap: 18px !important;
            }


            .product-card {
                max-width: 260px !important;
            }


            .product-main-image {
                height: 260px !important;
            }


            .main-product-image {
                height: 260px !important;
            }
        }


        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 520px) {

            .product-grid {
                grid-template-columns:
                    repeat(
                        2,
                        minmax(0, 1fr)
                    ) !important;

                gap: 12px !important;

                padding-left: 8px !important;
                padding-right: 8px !important;
            }


            .product-card {
                max-width: 100% !important;
            }


            .product-main-image {
                height: 220px !important;
            }


            .main-product-image {
                height: 220px !important;
            }


            .product-thumbnail {
                width: 50px !important;

                height: 50px !important;

                min-width: 50px !important;
            }
        }

    `;

    document.head.appendChild(style);
}


/* =====================================================
   LOAD PRODUCTS FROM SUPABASE
===================================================== */

async function loadProducts() {

    const productGrid =
        document.querySelector(
            ".product-grid"
        );


    if (!productGrid) {

        console.error(
            "Product grid not found."
        );

        return;
    }


    productGrid.innerHTML =
        "<p>Loading products...</p>";


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


        productGrid.innerHTML =
            "";


        /* ==========================================
           NO PRODUCTS
        ========================================== */

        if (
            !products ||
            products.length === 0
        ) {

            productGrid.innerHTML = `
                <div class="empty-products">
                    <h3>Collection Coming Soon</h3>
                    <p>
                        New products will appear here soon.
                    </p>
                </div>
            `;

            return;
        }


        /* ==========================================
           DISPLAY PRODUCTS
        ========================================== */

        products.forEach(
            product => {

                const card =
                    createProductCard(
                        product
                    );

                productGrid.appendChild(
                    card
                );
            }
        );


    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        productGrid.innerHTML = `
            <div class="empty-products">
                <h3>Unable to load products</h3>
                <p>
                    Please refresh the page and try again.
                </p>
            </div>
        `;
    }
}


/* =====================================================
   CART BUTTON
===================================================== */

function setupCartButton() {

    const cartButton =
        document.querySelector(
            "#cartButton"
        );


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            showCart
        );
    }


    /*
       Also support a button
       with class .cart-button
    */

    const alternativeCartButton =
        document.querySelector(
            ".cart-button"
        );


    if (
        alternativeCartButton &&
        alternativeCartButton !== cartButton
    ) {

        alternativeCartButton.addEventListener(
            "click",
            showCart
        );
    }
}


/* =====================================================
   MAKE FUNCTIONS AVAILABLE
===================================================== */

window.addToCart =
    addToCart;

window.showCart =
    showCart;

window.orderOnWhatsApp =
    orderOnWhatsApp;


/* =====================================================
   START WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupProductLayout();

        setupCartButton();

        updateCartCount();

        loadProducts();
    }
);
