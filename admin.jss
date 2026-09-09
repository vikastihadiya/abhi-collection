/* ================= ADMIN LOGIN ================= */

const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");

const adminContainer =
    document.querySelector(".admin-container");


async function checkAdminLogin() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    if (session) {

        loginSection.style.display = "none";
        adminContainer.style.display = "block";

    } else {

        loginSection.style.display = "block";
        adminContainer.style.display = "none";

    }
}


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    const loginMessage =
        document.getElementById("loginMessage");


    loginMessage.textContent = "Logging in...";


    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

    });


    if (error) {

        console.error(error);

        loginMessage.textContent =
            "Login failed: " + error.message;

        return;
    }


    loginMessage.textContent =
        "Login successful!";


    checkAdminLogin();

});


/* ================= CHECK LOGIN ================= */

checkAdminLogin();



/* =====================================================
   ABHI COLLECTION
   ADMIN PANEL — SUPABASE
===================================================== */


/* ================= IMAGE PREVIEW ================= */

const imageInput = document.getElementById("productImages");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", function () {

    imagePreview.innerHTML = "";

    const files = Array.from(this.files);

    if (files.length > 5) {
        alert("Please select maximum 5 photos.");
        this.value = "";
        return;
    }

    files.forEach(file => {

        const reader = new FileReader();

        reader.onload = function (e) {

            const img = document.createElement("img");

            img.src = e.target.result;

            imagePreview.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
});


/* ================= ADD PRODUCT ================= */

document
    .getElementById("productForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("productName").value.trim();

        const price =
            Number(document.getElementById("productPrice").value);

        const mrp =
            Number(document.getElementById("productMRP").value);

        const description =
            document.getElementById("productDescription").value.trim();

        const sizes =
            document.getElementById("productSizes").value
                .split(",")
                .map(size => size.trim())
                .filter(size => size !== "");

        const files =
            Array.from(imageInput.files);


        /* CHECK IMAGES */

        if (files.length === 0) {

            alert("Please select at least one product photo.");

            return;
        }

        if (files.length > 5) {

            alert("Maximum 5 photos allowed.");

            return;
        }


        /* DISABLE BUTTON */

        const saveButton =
            document.querySelector(".save-button");

        saveButton.disabled = true;

        saveButton.textContent = "Uploading...";


        try {

            /* ================= INSERT PRODUCT ================= */

            const { data: product, error: productError } =
                await supabaseClient
                    .from("products")
                    .insert([
                        {
                            name: name,
                            price: price,
                            mrp: mrp,
                            description: description,
                            sizes: sizes
                        }
                    ])
                    .select()
                    .single();


            if (productError) {
                throw productError;
            }


            /* ================= UPLOAD IMAGES ================= */

            const imageUrls = [];


            for (let i = 0; i < files.length; i++) {

                const file = files[i];

                const fileExtension =
                    file.name.split(".").pop();

                const filePath =
                    `${product.id}/${Date.now()}-${i}.${fileExtension}`;


                const { error: uploadError } =
                    await supabaseClient
                        .storage
                        .from("product-images")
                        .upload(filePath, file, {
                            cacheControl: "3600",
                            upsert: false
                        });


                if (uploadError) {
                    throw uploadError;
                }


                /* ================= PUBLIC URL ================= */

                const { data: publicUrlData } =
                    supabaseClient
                        .storage
                        .from("product-images")
                        .getPublicUrl(filePath);


                imageUrls.push(
                    publicUrlData.publicUrl
                );
            }


            /* ================= SAVE IMAGE URLS ================= */

            const { error: updateError } =
                await supabaseClient
                    .from("products")
                    .update({
                        images: imageUrls
                    })
                    .eq("id", product.id);


            if (updateError) {
                throw updateError;
            }


            alert("Product saved successfully!");


            /* RESET FORM */

            document
                .getElementById("productForm")
                .reset();

            imagePreview.innerHTML = "";


            /* RELOAD PRODUCTS */

            displayAdminProducts();


        } catch (error) {

            console.error(error);

            alert(
                "Something went wrong:\n" +
                error.message
            );

        } finally {

            saveButton.disabled = false;

            saveButton.textContent = "Save Product";
        }

    });


/* ================= DISPLAY PRODUCTS ================= */

async function displayAdminProducts() {

    const container =
        document.getElementById("adminProducts");

    container.innerHTML =
        "<p>Loading products...</p>";


    const { data: products, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load products.</p>";

        return;
    }


    container.innerHTML = "";


    if (!products || products.length === 0) {

        container.innerHTML =
            "<p>No products added yet.</p>";

        return;
    }


    products.forEach(product => {

        const div =
            document.createElement("div");

        div.className =
            "admin-product";


        const firstImage =
            product.images &&
            product.images.length > 0
                ? product.images[0]
                : "";


        div.innerHTML = `

            <img
                src="${firstImage}"
                alt="${product.name}"
            >

            <div class="admin-product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ₹${product.price}
                </p>

                <button
                    class="delete-button"
                    onclick="deleteProduct(${product.id})">

                    Delete

                </button>

            </div>

        `;


        container.appendChild(div);

    });

}


/* ================= DELETE PRODUCT ================= */

async function deleteProduct(productId) {

    const confirmDelete =
        confirm("Delete this product?");


    if (!confirmDelete) {
        return;
    }


    try {

        /* GET PRODUCT */

        const { data: product, error: fetchError } =
            await supabaseClient
                .from("products")
                .select("images")
                .eq("id", productId)
                .single();


        if (fetchError) {
            throw fetchError;
        }


        /* DELETE IMAGES */

        if (product.images && product.images.length > 0) {

            const filePaths =
                product.images.map(url => {

                    const marker =
                        "/product-images/";

                    const position =
                        url.indexOf(marker);

                    return position !== -1
                        ? url.substring(
                            position + marker.length
                        )
                        : null;

                }).filter(Boolean);


            if (filePaths.length > 0) {

                const { error: storageError } =
                    await supabaseClient
                        .storage
                        .from("product-images")
                        .remove(filePaths);


                if (storageError) {
                    throw storageError;
                }
            }
        }


        /* DELETE PRODUCT */

        const { error: deleteError } =
            await supabaseClient
                .from("products")
                .delete()
                .eq("id", productId);


        if (deleteError) {
            throw deleteError;
        }


        alert("Product deleted successfully!");


        displayAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete product:\n" +
            error.message
        );

    }
}


/* ================= INITIALIZE ================= */

displayAdminProducts();
