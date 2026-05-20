const productsContainer = document.querySelector(".container")
const categoriesContainer = document.getElementById("categories")

const baseURL = "https://dummyjson.com"

let allProducts = []
let filteredProducts = []

let currentPage = 1
const itemsPerPage = 17

let activeCategory = "all"

let cart = JSON.parse(localStorage.getItem("cart")) || []



const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart))
}

const findCartItem = (id) => {
    return cart.find(item => item.id === id)
}



function renderStars(rating) {

    let stars = ""

    for (let i = 1; i <= 5; i++) {

        if (rating >= i) {
            stars += `<i class="fa-solid fa-star text-yellow-400"></i>`
        }

        else if (rating >= i - 0.5) {
            stars += `<i class="fa-solid fa-star-half-stroke text-yellow-400"></i>`
        }

        else {
            stars += `<i class="fa-regular fa-star text-yellow-400"></i>`
        }
    }

    return stars
}



function createCard(product) {

    return `
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.03] transition duration-300">

            <div class="relative">

                <img
                    src="${product.thumbnail}"
                    class="w-full h-[260px] object-cover"
                />

                <span class="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                    -${Math.round(product.discountPercentage)}%
                </span>

            </div>

            <div class="p-5">

                <div class="flex items-center justify-between mb-3">

                    <p class="text-sm text-orange-500 font-medium capitalize">
                        ${product.category}
                    </p>

                    <p class="${product.stock < 10 ? "text-red-500" : "text-green-500"}">
                        ${product.stock < 10 ? "Low Stock" : "In Stock"}
                    </p>

                </div>

                <h3 class="text-xl font-bold mb-3 line-clamp-1">
                    ${product.title}
                </h3>

                <p class="text-gray-500 text-sm leading-6 mb-5 line-clamp-3">
                    ${product.description}
                </p>

                <div class="flex items-center justify-between mb-5">

                    <div class="flex items-center gap-2">

                        ${renderStars(product.rating)}

                        <p class="text-sm text-gray-500">
                            ${product.rating}
                        </p>

                    </div>

                    <p class="text-sm text-gray-400">
                        Stock: ${product.stock}
                    </p>

                </div>

                <div class="flex items-center justify-between">

                    <div>

                        <p class="text-gray-400 text-sm">
                            Price
                        </p>

                        <h4 class="text-3xl font-bold text-orange-500">
                            $${product.price}
                        </h4>

                    </div>

                    <button
                        data-id="${product.id}"
                        class="addBtns bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl transition"
                    >

                        <div class="flex items-center gap-2">

                            <i class="fa-solid fa-cart-plus"></i>

                            <span>Add</span>

                        </div>

                    </button>

                </div>

            </div>

        </div>
    `
}



async function getProducts() {

    const loading = document.getElementById("loading")

    try {

        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${baseURL}/products?limit=200`),
            fetch(`${baseURL}/products/categories`)
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        allProducts = productsData.products
        filteredProducts = allProducts

        renderCategories(categoriesData)

        renderProducts()

    } catch (error) {

        console.log(error)

    } finally {

        loading.classList.add("hidden")
    }
}

getProducts()



function renderProducts() {

    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage

    const paginatedProducts = filteredProducts.slice(start, end)

    productsContainer.innerHTML = paginatedProducts
        .map(product => createCard(product))
        .join("")

    attachAddToCartListeners()

    renderPagination()
}



function renderPagination() {

    const pagination = document.getElementById("pagination")

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

    pagination.innerHTML = ""

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `
            <button
                class="
                    pageBtn
                    px-4 py-2 rounded-xl border transition
                    ${currentPage === i
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white hover:bg-orange-100 border-gray-300"}
                "
                data-page="${i}"
            >
                ${i}
            </button>
        `
    }

    document.querySelectorAll(".pageBtn").forEach(btn => {

        btn.addEventListener("click", () => {

            currentPage = +btn.dataset.page

            renderProducts()

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
    })
}



function renderCategories(categoriesData) {

    categoriesContainer.innerHTML = `
        <button
            class="categoryBtn px-5 py-2 rounded-2xl whitespace-nowrap bg-orange-500 text-white"
            data-category="all"
        >
            All
        </button>
    `

    categoriesData.forEach(category => {

        const categoryName =
            typeof category === "string"
                ? category
                : category.slug

        categoriesContainer.innerHTML += `
            <button
                class="categoryBtn px-5 py-2 rounded-2xl whitespace-nowrap bg-white hover:bg-orange-100 transition"
                data-category="${categoryName}"
            >
                ${categoryName}
            </button>
        `
    })

    document.querySelectorAll(".categoryBtn").forEach(btn => {

        btn.addEventListener("click", () => {

            activeCategory = btn.dataset.category

            currentPage = 1

            document.querySelectorAll(".categoryBtn").forEach(button => {

                button.classList.remove(
                    "bg-orange-500",
                    "text-white"
                )

                button.classList.add("bg-white")
            })

            btn.classList.add(
                "bg-orange-500",
                "text-white"
            )

            applyFilters()
        })
    })
}



const searchInput = document.getElementById("searchInput")

searchInput.addEventListener("input", () => {

    currentPage = 1

    applyFilters()
})



function applyFilters() {

    const searchValue =
        searchInput.value.toLowerCase()

    filteredProducts = allProducts.filter(product => {

        const matchesSearch =
            product.title
                .toLowerCase()
                .includes(searchValue)

        const matchesCategory =
            activeCategory === "all"
                ? true
                : product.category === activeCategory

        return matchesSearch && matchesCategory
    })

    renderProducts()
}



function attachAddToCartListeners() {

    document.querySelectorAll(".addBtns").forEach(btn => {

        btn.addEventListener("click", function () {

            const id = +this.dataset.id

            const product =
                allProducts.find(p => p.id === id)

            if (product) {

                addToCart(product)

                renderCart()
            }

            this.classList.add("scale-90")

            setTimeout(() => {
                this.classList.remove("scale-90")
            }, 150)
        })
    })
}


const cartBtn = document.querySelector(".cartBtn")

const cartSidebar =
    document.getElementById("cartSidebar")

const closeCart =
    document.getElementById("closeCart")

const cartItemsEl =
    document.getElementById("cartItems")

cartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("translate-x-[-100%]")
})

closeCart.addEventListener("click", () => {
    cartSidebar.classList.add("translate-x-[-100%]")
})



function addToCart(product) {

    const existingItem =
        findCartItem(product.id)

    if (existingItem) {

        existingItem.quantity++

    } else {

        cart.push({
            ...product,
            quantity: 1
        })
    }

    saveCart()

    updateCartBadge()
}

function increaseQuantity(id) {

    const item = findCartItem(id)

    if (item) {
        item.quantity++
    }

    saveCart()

    renderCart()
}

function decreaseQuantity(id) {

    const item = findCartItem(id)

    if (!item) return

    if (item.quantity > 1) {

        item.quantity--

    } else {

        cart = cart.filter(
            item => item.id !== id
        )
    }

    saveCart()

    renderCart()
}

function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    )

    saveCart()

    renderCart()
}



function updateCartBadge() {

    const badge =
        document.getElementById("cartBadge")

    const total = cart.reduce((sum, item) => {
        return sum + item.quantity
    }, 0)

    badge.textContent = total

    badge.classList.toggle(
        "hidden",
        total === 0
    )
}


function renderCart() {

    updateCartBadge()

    const totalEl =
        document.querySelector(
            "#cartSidebar .text-orange-500.text-3xl"
        )

    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0)

    totalEl.textContent =
        "$" + totalPrice.toFixed(2)

    if (!cart.length) {

        cartItemsEl.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-400">

                <i class="fa-solid fa-cart-shopping text-6xl"></i>

                <p class="text-lg font-medium">
                    Your cart is empty
                </p>

            </div>
        `

        return
    }

    cartItemsEl.innerHTML = ""

    cart.forEach(item => {

        const div = document.createElement("div")

        div.className =
            "flex gap-3 bg-gray-50 rounded-2xl p-3"

        div.innerHTML = `
            <img
                src="${item.thumbnail}"
                class="w-20 h-20 object-cover rounded-xl flex-shrink-0"
            />

            <div class="flex-1 min-w-0">

                <h4 class="font-semibold text-sm line-clamp-1 mb-1">
                    ${item.title}
                </h4>

                <p class="text-orange-500 font-bold text-base mb-2">
                    $${(item.price * item.quantity).toFixed(2)}
                </p>

                <div class="flex items-center gap-2">

                    <button
                        onclick="decreaseQuantity(${item.id})"
                        class="w-7 h-7 rounded-full bg-white shadow"
                    >
                        −
                    </button>

                    <span class="w-6 text-center font-semibold text-sm">
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${item.id})"
                        class="w-7 h-7 rounded-full bg-white shadow"
                    >
                        +
                    </button>

                    <button
                        onclick="removeFromCart(${item.id})"
                        class="ml-auto w-7 h-7 rounded-full bg-red-100 text-red-500"
                    >
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>

                </div>

            </div>
        `

        cartItemsEl.appendChild(div)
    })
}

renderCart()