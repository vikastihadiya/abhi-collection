/* =====================================================
   ABHI COLLECTION
   ADMIN PANEL
===================================================== */


/* ================= PRODUCT STORAGE ================= */

let adminProducts =
    JSON.parse(
        localStorage.getItem("abhiProducts")
    ) || [];


/* ================= IMAGE PREVIEW ================= */

const imageInput =
    document.getElementById(
        "productImages"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );


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


            reader.onload = function (e) {

                const img =
                    document.createElement(
                        "img"
                    );

                img.src = e.target.result;

                imagePreview.appendChild(img);

            };


            reader.readAsDataURL(file);

        });

    }
);


/* ================= ADD PRODUCT ================= */

document
    .getElementById("productForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "productName"
                ).value;


            const price =
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                );


            const mrp =
                Number(
                    document.getElementById(
                        "productMRP"
                    ).value
                );


            const description =
                document.getElementById(
                    "productDescription"
                ).value;


            const sizes =
                document.getElementById(
                    "productSizes"
                ).value
                .split(",")
                .map(size => size.trim())
                .filter(size => size !== "");


            const files =
                Array.from(
                    imageInput.files
                );


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


            const readers = [];


            files.forEach(file => {

                readers.push(

                    new Promise(resolve => {

                        const reader =
                            new FileReader();


                        reader.onload =
                            () => resolve(
                                reader.result
                            );


                        reader.readAsDataURL(
                            file
                        );

                    })

                );

            });


            Promise.all(readers)
                .then(images => {


                    const product = {

                        id:
                            Date.now(),

                        name:
                            name,

                        price:
                            price,

                        mrp:
                            mrp,

                        description:
                            description,

                        sizes:
                            sizes,

                        images:
                            images

                    };


                    adminProducts.push(
                        product
                    );


                    localStorage.setItem(

                        "abhiProducts",

                        JSON.stringify(
                            adminProducts
                        )

                    );


                    alert(
                        "Product saved successfully!"
                    );


                    document
                        .getElementById(
                            "productForm"
                        )
                        .reset();


                    imagePreview.innerHTML =
                        "";


                    displayAdminProducts();

                });

        }
    );


/* ================= DISPLAY ADMIN PRODUCTS ================= */

function displayAdminProducts() {

    const container =
        document.getElementById(
            "adminProducts"
        );


    container.innerHTML = "";


    adminProducts.forEach(
        (product, index) => {


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-product";


            div.innerHTML = `

                <img
                    src="${product.images[0]}"
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
                        onclick="deleteProduct(${index})">

                        Delete

                    </button>

                </div>

            `;


            container.appendChild(div);

        }
    );

}


/* ================= DELETE ================= */

function deleteProduct(index) {

    const confirmDelete =
        confirm(
            "Delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    adminProducts.splice(
        index,
        1
    );


    localStorage.setItem(

        "abhiProducts",

        JSON.stringify(
            adminProducts
        )

    );


    displayAdminProducts();

}


/* ================= INITIALIZE ================= */

displayAdminProducts();
