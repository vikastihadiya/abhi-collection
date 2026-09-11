/* =====================================================
   ABHI COLLECTION
   PUBLIC WEBSITE
   SUPABASE + PRODUCT GALLERY + SIZES + CART
   STEP 1 - PROFESSIONAL CART
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

            const parsed = JSON.parse(images);

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

            const parsed = JSON.parse(sizes);

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

    let cartCount =
        document.getElementById("cart-count");


    if (!cartCount) {

        cartCount =
            document.getElementById("cartCount");
    }


    if (!cartCount) {

        cartCount =
            document.querySelector(".cart-count");
    }


    if (!cartCount) {

        cartCount =
            document.querySelector("[data-cart-count]");
    }


    if (!cartCount) {

        console.warn(
            "Cart count element not found."
        );

        return;
    }


    /*
       Total quantity, not just number of
       different products.
    */

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 1),
            0
        );


    cartCount.textContent =
        String(totalQuantity);


    cartCount.style.display =
        "inline-flex";
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(
    productName,
    price,
    size = "",
    image = ""
) {

    const existingIndex =
        cart.findIndex(
            item =>
                item.name === productName &&
                item.size === size
        );


    /*
       If same product + same size already
       exists, increase quantity.
    */

    if (existingIndex !== -1) {

        cart[existingIndex].quantity += 1;

    } else {

        cart.push({

            name: productName,

            price: Number(price),

            size: size,

            image: image,

            quantity: 1
        });
    }


    updateCartCount();

    renderCart();


    alert(
        productName +
        (size
            ? " — Size: " + size
            : "") +
        " has been added to your cart."
    );
}


/* =====================================================
   REMOVE CART ITEM
===================================================== */

function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    const item =
        cart[index];


    const confirmRemove =
        confirm(
            "Remove " +
            item.name +
            " from your cart?"
        );


    if (!confirmRemove) {
        return;
    }


    cart.splice(index, 1);


    updateCartCount();

    renderCart();
}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeCartQuantity(
    index,
    change
) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    const item =
        cart[index];


    item.quantity =
        Number(item.quantity || 1) +
        change;


    /*
       If quantity reaches zero,
       remove the item.
    */

    if (item.quantity <= 0) {

        cart.splice(index, 1);
    }


    updateCartCount();

    renderCart();
}


/* =====================================================
   CLEAR CART
===================================================== */

function clearCart() {

    if (cart.length === 0) {
        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear your entire cart?"
        );


    if (!confirmClear) {
        return;
    }


    cart = [];


    updateCartCount();

    renderCart();
}


/* =====================================================
   CALCULATE CART TOTAL
===================================================== */

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                );

        },
        0
    );
}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!overlay) {

        console.error(
            "Cart overlay not found."
        );

        return;
    }


    renderCart();


    overlay.classList.add(
        "active"
    );


    overlay.style.display =
        "flex";
}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.remove(
        "active"
    );


    overlay.style.display =
        "none";
}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (!cartItems) {
        return;
    }


    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add some products to your cart
                    and they will appear here.
                </p>

                <button
                    type="button"
                    class="continue-shopping"
                    onclick="closeCart(); document.getElementById('products')?.scrollIntoView({behavior:'smooth'});">

                    Continue Shopping

                </button>

            </div>

        `;


        if (cartTotal) {

            cartTotal.textContent =
                "₹0";
        }


        return;
    }


    /*
       Clear existing cart content.
    */

    cartItems.innerHTML = "";


    /* CART HEADER ACTIONS */

    const cartActions =
        document.createElement("div");

    cartActions.className =
        "cart-actions";


    const clearButton =
        document.createElement("button");

    clearButton.type =
        "button";

    clearButton.className =
        "clear-cart-button";

    clearButton.textContent =
        "Clear Cart 🗑️";


    clearButton.addEventListener(
        "click",
        clearCart
    );


    cartActions.appendChild(
        clearButton
    );


    cartItems.appendChild(
        cartActions
    );


    /* CART PRODUCTS */

    cart.forEach(
        (item, index) => {

            const cartItem =
                document.createElement("div");

            cartItem.className =
                "cart-item";


            /* IMAGE */

            const imageBox =
                document.createElement("div");

            imageBox.className =
                "cart-item-image";


            if (item.image) {

                const image =
                    document.createElement("img");

                image.src =
                    item.image;

                image.alt =
                    item.name;

                image.loading =
                    "lazy";


                imageBox.appendChild(
                    image
                );

            } else {

                imageBox.textContent =
                    "Product";
            }


            cartItem.appendChild(
                imageBox
            );


            /* DETAILS */

            const details =
                document.createElement("div");

            details.className =
                "cart-item-details";


            const name =
                document.createElement("h3");

            name.textContent =
                item.name;


            details.appendChild(
                name
            );


            if (item.size) {

                const size =
                    document.createElement("p");

                size.className =
                    "cart-item-size";

                size.textContent =
                    "Size: " +
                    item.size;


                details.appendChild(
                    size
                );
            }


            const unitPrice =
                document.createElement("p");

            unitPrice.className =
                "cart-item-price";

            unitPrice.textContent =
                "₹" +
                Number(item.price || 0) +
                " each";


            details.appendChild(
                unitPrice
            );


            /* QUANTITY CONTROLS */

            const quantityRow =
                document.createElement("div");

            quantityRow.className =
                "cart-quantity-row";


            const minusButton =
                document.createElement("button");

            minusButton.type =
                "button";

            minusButton.className =
                "quantity-button";

            minusButton.textContent =
                "−";


            minusButton.addEventListener(
                "click",
                function () {

                    changeCartQuantity(
                        index,
                        -1
                    );
                }
            );


            const quantity =
                document.createElement("span");

            quantity.className =
                "cart-quantity";

            quantity.textContent =
                item.quantity;


            const plusButton =
                document.createElement("button");

            plusButton.type =
                "button";

            plusButton.className =
                "quantity-button";

            plusButton.textContent =
                "+";


            plusButton.addEventListener(
                "click",
                function () {

                    changeCartQuantity(
                        index,
                        1
                    );
                }
            );


            quantityRow.appendChild(
                minusButton
            );

            quantityRow.appendChild(
                quantity
            );

            quantityRow.appendChild(
                plusButton
            );


            details.appendChild(
                quantityRow
            );


            /* SUBTOTAL */

            const subtotal =
                document.createElement("strong");

            subtotal.className =
                "cart-item-subtotal";

            subtotal.textContent =
                "₹" +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                );


            details.appendChild(
                subtotal
            );


            /* REMOVE */

            const removeButton =
                document.createElement("button");

            removeButton.type =
                "button";

            removeButton.className =
                "remove-cart-item";

            removeButton.textContent =
                "🗑️ Remove";


            removeButton.addEventListener(
                "click",
                function () {

                    removeFromCart(index);
                }
            );


            details.appendChild(
                removeButton
            );


            cartItem.appendChild(
                details
            );


            cartItems.appendChild(
                cartItem
            );
        }
    );


    /* UPDATE TOTAL */

    if (cartTotal) {

        cartTotal.textContent =
            "₹" +
            getCartTotal();
    }
}


/* =====================================================
   SHOW CART
   Compatibility with older code
===================================================== */

function showCart() {

    openCart();
}


/* =====================================================
   ORDER ENTIRE CART ON WHATSAPP
===================================================== */

function orderCartOnWhatsApp(
    phoneNumber
) {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    let message =
        "Hello Abhi Collection,\n\n" +
        "I want to place an order:\n\n";


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

            message +=
                "Quantity: " +
                item.quantity +
                "\n";

            message +=
                "Subtotal: ₹" +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ) +
                "\n\n";
        }
    );


    message +=
        "Total: ₹" +
        getCartTotal() +
        "\n\n";


    message +=
        "Please confirm availability and order details.";


    const encodedMessage =
        encodeURIComponent(message);


    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        encodedMessage;


    window.open(
        whatsappURL,
        "_blank"
    );
}


/* =====================================================
   PRODUCT WHATSAPP ORDER
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


    if (images.length > 1) {

        const thumbnails =
            document.createElement("div");

        thumbnails.className =
            "product-thumbnails";


        /*
           Maximum 10 images.
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


            /*
               Use first product image
               inside the cart.
            */

            const cartImage =
                images.length > 0
                    ? images[0]
                    : "";


            addToCart(
                product.name,
                product.price,
                selectedSize,
                cartImage
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
   CART + PRODUCT STYLING
===================================================== */

function setupProductLayout() {

    const style =
        document.createElement("style");


    style.textContent = `

        /* ================= PRODUCT GRID ================= */

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


        /* ================= SIZES ================= */

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


        /* ================= PRODUCT INFO ================= */

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


        /* =================================================
           CART
        ================================================= */

        .cart-overlay {
            position: fixed !important;
            inset: 0 !important;
            background: rgba(0, 0, 0, 0.55) !important;
            z-index: 99999 !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        }


        .cart-overlay.active {
            display: flex !important;
        }


        .cart {
            width: 100% !important;
            max-width: 600px !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            background: white !important;
            border-radius: 16px !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            box-shadow:
                0 20px 60px
                rgba(0, 0, 0, 0.25) !important;
        }


        .cart-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            border-bottom: 1px solid #eee !important;
            padding-bottom: 14px !important;
            margin-bottom: 12px !important;
        }


        .cart-header h2 {
            margin: 0 !important;
        }


        .cart-header button {
            width: 38px !important;
            height: 38px !important;
            border: none !important;
            background: #f3f3f3 !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 18px !important;
        }


        .cart-actions {
            display: flex !important;
            justify-content: flex-end !important;
            margin-bottom: 12px !important;
        }


        .clear-cart-button {
            border: none !important;
            background: transparent !important;
            color: #c00 !important;
            cursor: pointer !important;
            font-weight: 600 !important;
        }


        .cart-item {
            display: flex !important;
            gap: 14px !important;
            padding: 14px 0 !important;
            border-bottom: 1px solid #eee !important;
        }


        .cart-item-image {
            width: 90px !important;
            height: 110px !important;
            min-width: 90px !important;
            border-radius: 8px !important;
            background: #f5f5f5 !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 12px !important;
            color: #777 !important;
        }


        .cart-item-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
        }


        .cart-item-details {
            flex: 1 !important;
            min-width: 0 !important;
        }


        .cart-item-details h3 {
            margin: 0 0 5px !important;
            font-size: 16px !important;
        }


        .cart-item-size,
        .cart-item-price {
            margin: 3px 0 !important;
            font-size: 13px !important;
            color: #666 !important;
        }


        .cart-quantity-row {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            margin-top: 10px !important;
        }


        .quantity-button {
            width: 32px !important;
            height: 32px !important;
            border: 1px solid #ccc !important;
            background: white !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 20px !important;
            line-height: 1 !important;
        }


        .cart-quantity {
            min-width: 20px !important;
            text-align: center !important;
            font-weight: 600 !important;
        }


        .cart-item-subtotal {
            display: block !important;
            margin-top: 9px !important;
            font-size: 16px !important;
        }


        .remove-cart-item {
            border: none !important;
            background: transparent !important;
            color: #c00 !important;
            cursor: pointer !important;
            padding: 5px 0 !important;
            margin-top: 5px !important;
            font-size: 13px !important;
        }


        .empty-cart {
            text-align: center !important;
            padding: 45px 15px !important;
        }


        .empty-cart-icon {
            font-size: 50px !important;
            margin-bottom: 10px !important;
        }


        .empty-cart h3 {
            margin: 5px 0 !important;
        }


        .empty-cart p {
            color: #666 !important;
            line-height: 1.5 !important;
        }


        .continue-shopping {
            margin-top: 15px !important;
            padding: 11px 18px !important;
            border: none !important;
            background: #111 !important;
            color: white !important;
            border-radius: 7px !important;
            cursor: pointer !important;
        }


        .cart-total {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 18px 0 !important;
            border-top: 2px solid #111 !important;
            margin-top: 12px !important;
            font-size: 18px !important;
        }


        .cart-total strong {
            font-size: 21px !important;
        }


        /* ================= WHATSAPP ================= */

        .whatsapp-order {
            margin-top: 12px !important;
        }


        .whatsapp-order p {
            margin: 0 0 8px !important;
            font-weight: 600 !important;
        }


        .whatsapp-order button {
            width: 100% !important;
            padding: 12px !important;
            margin-top: 7px !important;
            border: none !important;
            background: #111 !important;
            color: white !important;
            border-radius: 7px !important;
            cursor: pointer !important;
            font-size: 14px !important;
        }


        /* =================================================
           MOBILE
        ================================================= */

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


            .product-main-image,
            .main-product-image {
                height: 260px !important;
            }


            .cart-overlay {
                padding: 10px !important;
            }


            .cart {
                max-height: 94vh !important;
                padding: 15px !important;
                border-radius: 12px !important;
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


            .product-main-image,
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


            .cart-item {
                gap: 10px !important;
            }


            .cart-item-image {
                width: 75px !important;
                height: 95px !important;
                min-width: 75px !important;
            }


            .cart-item-details h3 {
                font-size: 14px !important;
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

                    <h3>
                        Collection Coming Soon
                    </h3>

                    <p>
                        New products will appear here soon.
                    </p>

                </div>

            `;

            return;
        }


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

                <h3>
                    Unable to load products
                </h3>

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
            openCart
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

        /*
           Remove the inline onclick possibility
           from causing duplicate behaviour.
        */

        alternativeCartButton.addEventListener(
            "click",
            function () {

                openCart();
            }
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

window.openCart =
    openCart;

window.closeCart =
    closeCart;

window.removeFromCart =
    removeFromCart;

window.changeCartQuantity =
    changeCartQuantity;

window.clearCart =
    clearCart;

window.orderOnWhatsApp =
    orderOnWhatsApp;


/*
   IMPORTANT:
   Your current index.html uses:

   orderWhatsApp('7088443473')
   orderWhatsApp('8958123749')

   Therefore we provide this compatibility
   function as well.
*/

window.orderWhatsApp =
    orderCartOnWhatsApp;


/* =====================================================
   START WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupProductLayout();

        setupCartButton();

        updateCartCount();

        renderCart();

        loadProducts();
    }
);
