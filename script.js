/* =====================================================
   ABHI COLLECTION
   PUBLIC WEBSITE
   SUPABASE + PRODUCT GALLERY + SIZES + CART
===================================================== */

let cart = [];


/* =====================================================
   IMAGE HELPER
===================================================== */

function getImagesArray(images) {

    if (!images) {
        return [];
    }

    if (Array.isArray(images)) {
        return images.filter(Boolean);
    }

    if (typeof images === "string") {

        try {

            const parsed =
                JSON.parse(images);

            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean);
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


/* =====================================================
   SIZE HELPER
===================================================== */

function getSizesArray(sizes) {

    if (!sizes) {
        return [];
    }

    if (Array.isArray(sizes)) {
        return sizes.filter(Boolean);
    }

    if (typeof sizes === "string") {

        try {

            const parsed =
                JSON.parse(sizes);

            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean);
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
   CART COUNT
===================================================== */

function updateCartCount() {

    /*
       Try the main cart-count ID first.
    */

    let cartCount =
        document.getElementById("cart-count");


    /*
       Also support common alternatives.
       This makes the counter more reliable.
    */

    if (!cartCount) {

        cartCount =
            document.querySelector(
                ".cart-count"
            );
    }


    if (!cartCount) {

        cartCount =
            document.querySelector(
                "[data-cart-count]"
            );
    }


    if (!cartCount) {
        console.warn(
            "Cart count element not found."
        );

        return;
    }


    /*
       Number of products in cart.
    */

    cartCount.textContent =
        String(cart.length);


    /*
       Make sure it is visible.
    */

    cartCount.style.display =
        "inline-flex";
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(
    productName,
    price,
    size = ""
) {

    cart.push({

        name: productName,

        price: Number(price),

        size: size
    });


    /*
       IMPORTANT:
       Update immediately after adding.
    */

    updateCartCount();


    alert(
        productName +
        (size
            ? " — Size: " + size
            : "") +
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


    cart.forEach(
        (item, index) => {

            message +=
                (index + 1) +
                ". " +
                item.name +
                "\n";


            message +=
                "Price: ₹" +
                item.price +
                "\n";


            if (item.size) {

                message +=
                    "Size: " +
                    item.size +
                    "\n";
            }


            message += "\n";


            total +=
                Number(item.price);
        }
    );


    message +=
        "Total: ₹" +
        total;


    message +=
        "\n\nTo order, contact us on WhatsApp.";


    alert(message);
}


/* =====================================================
   WHATSAPP ORDER
===================================================== */

function orderOnWhatsApp(
    productName,
    price,
    size = ""
) {

    const message =
        "Hello Abhi Collection,\n\n" +
        "I want to order:\n" +
        "Product: " +
        productName +
        "\n" +
        "Price: ₹" +
        price +
        "\n" +
        (
            size
                ? "Size: " + size + "\n"
                : ""
        ) +
        "\nPlease share availability and order details.";


    const encodedMessage =
        encodeURIComponent(message);


    const whatsappURL =
        "https://wa.me/7088443473?text=" +
        encodedMessage;


    window.open(
        whatsappURL,
        "_blank"
    );
}


/* =====================================================
   PRODUCT GALLERY
   SUPPORTS UP TO 10 IMAGES
===================================================== */

function createProductGallery(
    images,
    productName
) {

    const gallery =
        document.createElement("div");

    gallery.className =
        "product-gallery";


    /* MAIN IMAGE */

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


    /* THUMBNAILS */

    if (images.length > 1) {

        const thumbnails =
            document.createElement("div");

        thumbnails.className =
            "product-thumbnails";


        /*
           All uploaded images are displayed here.
           Maximum supported = 10.
        */

        images.slice(0, 10).forEach(
            (imageURL, index) => {

                const thumbnailButton =
                    document.createElement(
                        "button"
                    );

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
                    document.createElement(
                        "img"
                    );

                thumbnailImage.src =
                    imageURL;

                thumbnailImage.alt =
                    productName +
                    " photo " +
                    (index + 1);


                thumbnailButton.appendChild(
                    thumbnailImage
                );


                thumbnailButton.addEventListener(
                    "click",
                    function () {

                        mainImage.src =
                            imageURL;


                        thumbnails
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
   SIZE SELECTOR
===================================================== */

function createSizeSelector(
    sizes,
    productCard
) {

    if (sizes.length === 0) {
        return null;
    }


    const sizeSection =
        document.createElement("div");

    sizeSection.className =
        "size-selection";


    const sizeLabel =
        document.createElement("div");

    sizeLabel.className =
        "size-label";

    sizeLabel.textContent =
        "Select Size:";


    sizeSection.appendChild(
        sizeLabel
    );


    const sizeButtons =
        document.createElement("div");

    sizeButtons.className =
        "size-buttons";


    sizes.forEach(size => {

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "size-button";

        button.textContent =
            size;


        button.addEventListener(
            "click",
            function () {

                sizeButtons
                    .querySelectorAll(
                        ".size-button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );
                    });


                button.classList.add(
                    "selected"
                );


                productCard.dataset.selectedSize =
                    size;


                const message =
                    sizeSection.querySelector(
                        ".size-required-message"
                    );


                if (message) {

                    message.style.display =
                        "none";
                }
            }
        );


        sizeButtons.appendChild(
            button
        );
    });


    sizeSection.appendChild(
        sizeButtons
    );


    const message =
        document.createElement("small");

    message.className =
        "size-required-message";

    message.textContent =
        "Please select a size.";

    message.style.display =
        "none";


    sizeSection.appendChild(
        message
    );


    return sizeSection;
}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className =
        "product-card";


    /* IMAGES */

    const images =
        getImagesArray(
            product.images
        );


    const gallery =
        createProductGallery(
            images,
            product.name || "Product"
        );


    card.appendChild(
        gallery
    );


    /* PRODUCT INFO */

    const productInfo =
        document.createElement("div");

    productInfo.className =
        "product-info";


    /* NAME */

    const title =
        document.createElement("h3");

    title.textContent =
        product.name || "Product";


    productInfo.appendChild(
        title
    );


    /* PRICE */

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


    /* DESCRIPTION */

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


    /* SIZES */

    const sizes =
        getSizesArray(
            product.sizes
        );


    const sizeSelector =
        createSizeSelector(
            sizes,
            card
        );


    if (sizeSelector) {

        productInfo.appendChild(
            sizeSelector
        );
    }


    /* BUTTON AREA */

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

            let selectedSize = "";


            if (sizes.length > 0) {

                selectedSize =
                    card.dataset.selectedSize ||
                    "";


                if (!selectedSize) {

                    if (sizeSelector) {

                        const message =
                            sizeSelector.querySelector(
                                ".size-required-message"
                            );

                        if (message) {

                            message.style.display =
                                "block";
                        }
                    }


                    alert(
                        "Please select a size first."
                    );

                    return;
                }
            }


            addToCart(
                product.name,
                product.price,
                selectedSize
            );
        }
    );


    buttonArea.appendChild(
        cartButton
    );


    /* WHATSAPP */

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

            let selectedSize = "";


            if (sizes.length > 0) {

                selectedSize =
                    card.dataset.selectedSize ||
                    "";


                if (!selectedSize) {

                    if (sizeSelector) {

                        const message =
                            sizeSelector.querySelector(
                                ".size-required-message"
                            );

                        if (message) {

                            message.style.display =
                                "block";
                        }
                    }


                    alert(
                        "Please select a size first."
                    );

                    return;
                }
            }


            orderOnWhatsApp(
                product.name,
                product.price,
                selectedSize
            );
        }
    );


    buttonArea.appendChild(
        whatsappButton
    );


    productInfo.appendChild(
        buttonArea
    );


    card.appendChild(
        productInfo
    );


    return card;
}


/* =====================================================
   PRODUCT STYLING
===================================================== */

function setupProductLayout() {

    const style =
        document.createElement("style");


    style.textContent = `

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


        .product-card {
            width: 100% !important;
            max-width: 280px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }


        .product-gallery {
            width: 100% !important;
            box-sizing: border-box !important;
        }


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


        .main-product-image {
            width: 100% !important;
            height: 280px !important;
            max-width: 100% !important;
            object-fit: contain !important;
            display: block !important;
            margin: 0 !important;
        }


        .product-thumbnails {
            display: flex !important;
            gap: 8px !important;
            margin-top: 10px !important;
            overflow-x: auto !important;
            padding-bottom: 4px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }


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


        .product-thumbnail.active {
            border: 2px solid #111 !important;
        }


        .product-thumbnail img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
        }


        .size-selection {
            margin-top: 12px !important;
            margin-bottom: 10px !important;
        }


        .size-label {
            font-size: 14px !important;
            font-weight: 600 !important;
            margin-bottom: 7px !important;
        }


        .size-buttons {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 7px !important;
        }


        .size-button {
            min-width: 42px !important;
            height: 38px !important;
            padding: 5px 10px !important;
            background: white !important;
            color: #111 !important;
            border: 1px solid #bbb !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
        }


        .size-button.selected {
            background: #111 !important;
            color: white !important;
            border-color: #111 !important;
        }


        .size-required-message {
            color: #c00 !important;
            margin-top: 6px !important;
            font-size: 12px !important;
        }


        .product-info {
            padding-top: 12px !important;
        }


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


        .product-description {
            font-size: 14px !important;
            line-height: 1.5 !important;
        }


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


            .size-button {
                min-width: 38px !important;
                height: 36px !important;
            }
        }
    `;


    document.head.appendChild(style);
}


/* =====================================================
   LOAD PRODUCTS
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


        productGrid.innerHTML = "";


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


        products.forEach(product => {

            const card =
                createProductCard(product);

            productGrid.appendChild(
                card
            );
        });


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
        document.getElementById(
            "cartButton"
        );


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            showCart
        );
    }


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
   GLOBAL FUNCTIONS
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

        /*
           Set initial cart count to 0.
        */

        updateCartCount();

        loadProducts();
    }
);
