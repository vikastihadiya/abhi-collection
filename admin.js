/* =====================================================
   ABHI COLLECTION
   ADMIN PANEL — SUPABASE
===================================================== */


/* =====================================================
   HELPER — CONVERT IMAGES TO ARRAY
===================================================== */

function getImagesArray(images) {

    if (!images) {
        return [];
    }

    // Already an array
    if (Array.isArray(images)) {
        return images;
    }

    // Stored as text
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

            // If it is simply a URL
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
   ADMIN LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const loginSection =
    document.getElementById("loginSection");

const adminContainer =
    document.querySelector(".admin-container");


async function checkAdminLogin() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    if (session) {

        if (loginSection) {
            loginSection.style.display = "none";
        }

        if (adminContainer) {
            adminContainer.style.display = "block";
        }

    } else {

        if (loginSection) {
            loginSection.style.display = "block";
        }

        if (adminContainer) {
            adminContainer.style.display = "none";
        }
    }
}


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("adminEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("adminPassword")
                    .value;

            const loginMessage =
                document.getElementById(
                    "loginMessage"
                );


            loginMessage.textContent =
                "Logging in...";


            const {
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email: email,

                        password: password

                    });


            if (error) {

                console.error(error);

                loginMessage.textContent =
                    "Login failed: " +
                    error.message;

                return;
            }


            loginMessage.textContent =
                "Login successful!";


            await checkAdminLogin();

            await displayAdminProducts();
        }
    );
}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

const forgotPasswordButton =
    document.getElementById(
        "forgotPasswordButton"
    );


if (forgotPasswordButton) {

    forgotPasswordButton.addEventListener(
        "click",
        async function () {

            const email =
                document
                    .getElementById("adminEmail")
                    .value
                    .trim();

            const loginMessage =
                document.getElementById(
                    "loginMessage"
                );


            if (!email) {

                loginMessage.textContent =
                    "Please enter your admin email first.";

                return;
            }


            loginMessage.textContent =
                "Sending password reset email...";


            const {
                error
            } =
                await supabaseClient.auth
                    .resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                "https://vikastihadiya.github.io/abhi-collection/reset-password.html"
                        }
                    );


            if (error) {

                console.error(error);

                loginMessage.textContent =
                    "Failed to send password recovery: " +
                    error.message;

                return;
            }


            loginMessage.textContent =
                "Password reset email sent. Check your email.";
        }
    );
}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

const imageInput =
    document.getElementById(
        "productImages"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );


if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            imagePreview.innerHTML = "";

            const files =
                Array.from(this.files);


            if (files.length > 5) {

                alert(
                    "Please select maximum 5 photos."
                );

                this.value = "";

                return;
            }


            files.forEach(file => {

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        const img =
                            document.createElement(
                                "img"
                            );

                        img.src =
                            event.target.result;

                        imagePreview.appendChild(
                            img
                        );
                    };


                reader.readAsDataURL(file);
            });

        }
    );
}


/* =====================================================
   ADD PRODUCT
===================================================== */

const productForm =
    document.getElementById(
        "productForm"
    );


if (productForm) {

    productForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("productName")
                    .value
                    .trim();


            const price =
                Number(
                    document
                        .getElementById("productPrice")
                        .value
                );


            const mrp =
                Number(
                    document
                        .getElementById("productMRP")
                        .value
                );


            const description =
                document
                    .getElementById(
                        "productDescription"
                    )
                    .value
                    .trim();


            const sizes =
                document
                    .getElementById("productSizes")
                    .value
                    .split(",")
                    .map(
                        size => size.trim()
                    )
                    .filter(
                        size => size !== ""
                    );


            const files =
                imageInput
                    ? Array.from(
                        imageInput.files
                    )
                    : [];


            /* CHECK IMAGES */

            if (files.length === 0) {

                alert(
                    "Please select at least one product photo."
                );

                return;
            }


            if (files.length > 5) {

                alert(
                    "Maximum 5 photos allowed."
                );

                return;
            }


            const saveButton =
                document.querySelector(
                    "#productForm .save-button"
                );


            if (saveButton) {

                saveButton.disabled = true;

                saveButton.textContent =
                    "Uploading...";
            }


            let product = null;

            const uploadedFilePaths = [];


            try {

                /* =================================================
                   STEP 1 — CREATE PRODUCT
                ================================================= */

                const {
                    data,
                    error: productError
                } =
                    await supabaseClient
                        .from("products")
                        .insert([
                            {
                                name: name,

                                price: price,

                                mrp: mrp,

                                description:
                                    description,

                                // sizes column is TEXT
                                sizes:
                                    JSON.stringify(
                                        sizes
                                    )
                            }
                        ])
                        .select()
                        .single();


                if (productError) {
                    throw productError;
                }


                product = data;


                /* =================================================
                   STEP 2 — UPLOAD IMAGES
                ================================================= */

                const imageUrls = [];


                for (
                    let i = 0;
                    i < files.length;
                    i++
                ) {

                    const file =
                        files[i];


                    /* Get extension safely */

                    const originalName =
                        file.name || "";


                    const extension =
                        originalName
                            .split(".")
                            .pop()
                            .toLowerCase();


                    const safeExtension =
                        extension || "jpg";


                    /* Unique file path */

                    const filePath =
                        `${product.id}/${Date.now()}-${i}.${safeExtension}`;


                    /* Upload */

                    const {
                        error: uploadError
                    } =
                        await supabaseClient
                            .storage
                            .from(
                                "product-images"
                            )
                            .upload(
                                filePath,
                                file,
                                {
                                    cacheControl:
                                        "3600",

                                    upsert:
                                        false,

                                    contentType:
                                        file.type ||
                                        "image/jpeg"
                                }
                            );


                    if (uploadError) {
                        throw uploadError;
                    }


                    uploadedFilePaths.push(
                        filePath
                    );


                    /* =================================================
                       STEP 3 — GET PUBLIC URL
                    ================================================= */

                    const {
                        data:
                            publicUrlData
                    } =
                        supabaseClient
                            .storage
                            .from(
                                "product-images"
                            )
                            .getPublicUrl(
                                filePath
                            );


                    if (
                        !publicUrlData ||
                        !publicUrlData.publicUrl
                    ) {

                        throw new Error(
                            "Could not create image URL."
                        );
                    }


                    imageUrls.push(
                        publicUrlData.publicUrl
                    );
                }


                /* =================================================
                   STEP 4 — SAVE IMAGE URLS AS TEXT
                ================================================= */

                const {
                    error: updateError
                } =
                    await supabaseClient
                        .from("products")
                        .update({

                            // IMPORTANT:
                            // images column is TEXT
                            images:
                                JSON.stringify(
                                    imageUrls
                                )

                        })
                        .eq(
                            "id",
                            product.id
                        );


                if (updateError) {
                    throw updateError;
                }


                /* =================================================
                   SUCCESS
                ================================================= */

                alert(
                    "Product saved successfully!"
                );


                productForm.reset();


                if (imagePreview) {
                    imagePreview.innerHTML =
                        "";
                }


                await displayAdminProducts();


            } catch (error) {

                console.error(
                    "Product save error:",
                    error
                );


                /* If product was created but image
                   upload failed, remove product */

                if (product && product.id) {

                    try {

                        await supabaseClient
                            .from("products")
                            .delete()
                            .eq(
                                "id",
                                product.id
                            );

                    } catch (cleanupError) {

                        console.error(
                            "Cleanup error:",
                            cleanupError
                        );
                    }
                }


                /* Remove any uploaded images */

                if (
                    uploadedFilePaths.length >
                    0
                ) {

                    try {

                        await supabaseClient
                            .storage
                            .from(
                                "product-images"
                            )
                            .remove(
                                uploadedFilePaths
                            );

                    } catch (cleanupError) {

                        console.error(
                            "Image cleanup error:",
                            cleanupError
                        );
                    }
                }


                alert(
                    "Something went wrong:\n" +
                    error.message
                );

            } finally {

                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Save Product";
                }
            }
        }
    );
}


/* =====================================================
   DISPLAY ADMIN PRODUCTS
===================================================== */

async function displayAdminProducts() {

    const container =
        document.getElementById(
            "adminProducts"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading products...</p>";


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

        console.error(error);

        container.innerHTML =
            "<p>Unable to load products.</p>";

        return;
    }


    container.innerHTML = "";


    if (
        !products ||
        products.length === 0
    ) {

        container.innerHTML =
            "<p>No products added yet.</p>";

        return;
    }


    products.forEach(
        product => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-product";


            /* IMPORTANT:
               Convert TEXT/JSON into array */

            const images =
                getImagesArray(
                    product.images
                );


            const firstImage =
                images.length > 0
                    ? images[0]
                    : "";


            div.innerHTML = `

                ${
                    firstImage
                        ? `
                            <img
                                src="${firstImage}"
                                alt="${product.name}"
                            >
                        `
                        : `
                            <div>
                                No image
                            </div>
                        `
                }

                <div class="admin-product-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${product.price}
                    </p>

                    <button
                        class="delete-button"
                        onclick="deleteProduct(${product.id})"
                    >
                        Delete
                    </button>

                </div>
            `;


            container.appendChild(
                div
            );
        }
    );
}


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(
    productId
) {

    const confirmDelete =
        confirm(
            "Delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        /* =================================================
           GET PRODUCT
        ================================================= */

        const {
            data: product,
            error: fetchError
        } =
            await supabaseClient
                .from("products")
                .select("images")
                .eq(
                    "id",
                    productId
                )
                .single();


        if (fetchError) {
            throw fetchError;
        }


        /* =================================================
           CONVERT IMAGE TEXT TO ARRAY
        ================================================= */

        const images =
            getImagesArray(
                product.images
            );


        /* =================================================
           GET STORAGE PATHS
        ================================================= */

        const filePaths =
            images
                .map(url => {

                    if (
                        typeof url !==
                        "string"
                    ) {
                        return null;
                    }


                    const marker =
                        "/product-images/";


                    const position =
                        url.indexOf(
                            marker
                        );


                    if (
                        position === -1
                    ) {
                        return null;
                    }


                    return url.substring(
                        position +
                        marker.length
                    );

                })
                .filter(
                    Boolean
                );


        /* =================================================
           DELETE STORAGE IMAGES
        ================================================= */

        if (
            filePaths.length > 0
        ) {

            const {
                error:
                    storageError
            } =
                await supabaseClient
                    .storage
                    .from(
                        "product-images"
                    )
                    .remove(
                        filePaths
                    );


            if (storageError) {

                console.error(
                    "Storage delete error:",
                    storageError
                );

                // Continue deleting product
                // even if image cleanup fails.
            }
        }


        /* =================================================
           DELETE DATABASE PRODUCT
        ================================================= */

        const {
            error: deleteError
        } =
            await supabaseClient
                .from("products")
                .delete()
                .eq(
                    "id",
                    productId
                );


        if (deleteError) {
            throw deleteError;
        }


        alert(
            "Product deleted successfully!"
        );


        await displayAdminProducts();

    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to delete product:\n" +
            error.message
        );
    }
}


/* =====================================================
   MAKE DELETE FUNCTION AVAILABLE
===================================================== */

window.deleteProduct =
    deleteProduct;


/* =====================================================
   INITIALIZE
===================================================== */

checkAdminLogin();

displayAdminProducts();
