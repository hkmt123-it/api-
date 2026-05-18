const productsContainer = document.querySelector(".container")

let allProducts = []
let cart = JSON.parse(localStorage.getItem("cart")) || []

// ─── HELPERS ───────────────────────────────────────

const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart))
}

const findCartItem = (id) => cart.find(item => item.id === id)

// ─── PRODUCT CARD ───────────────────────────────────────

function createCard(product) {
    return `
    <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.05] transition duration-300">

        <div class="relative">
            <img src="${product.thumbnail}" alt="" class="w-full h-[260px] object-cover" />
            <span class="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                -${product.discountPercentage.toFixed()}%
            </span>
            <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                <i class="fa-regular fa-heart"></i>
            </button>
        </div>

        <div class="p-5">
            <div class="flex items-center justify-between mb-3">
                <p class="text-sm text-orange-500 font-medium capitalize">${product.category}</p>
                <p class="${product.availabilityStatus.toLowerCase().includes('low') ? 'text-red-500' : 'text-green-500'}">
                    ${product.availabilityStatus}
                </p>
            </div>

            <h3 class="text-2xl font-bold mb-3 line-clamp-1">${product.title}</h3>
            <p class="text-gray-500 text-sm leading-6 mb-5 line-clamp-3">${product.description}</p>

            <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-2">
                    ${renderStars(product.rating)}
                    <p class="text-sm text-gray-500">${product.rating}</p>
                </div>
                <p class="text-sm text-gray-400">Stock: ${product.stock}</p>
            </div>

            <div class="flex items-center gap-2 mb-5">
                <i class="fa-solid fa-tag text-orange-500"></i>
                <p class="text-gray-600 text-sm">Brand: <span class="font-semibold">${product.brand ?? "—"}</span></p>
            </div>

            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-400 text-sm">Price</p>
                    <h4 class="text-3xl font-bold text-orange-500">$${product.price}</h4>
                </div>
                <button data-id="${product.id}" class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl transition addBtns">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-cart-plus"></i>
                        <span>Add</span>
                    </div>
                </button>
            </div>
        </div>

    </div>`
}

// ─── STARS ───────────────────────────────────────

function renderStars(rating) {
    let stars = ""

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars += `<i class="fa-solid fa-star text-yellow-400"></i>`
        } else if (rating >= i - 0.5) {
            stars += `<i class="fa-solid fa-star-half-stroke text-yellow-400"></i>`
        } else {
            stars += `<i class="fa-regular fa-star text-yellow-400"></i>`
        }
    }

    return stars
}

// ─── FETCH PRODUCTS ───────────────────────────────────────

async function getProducts() {
    const loading = document.getElementById("loading")

    try {
        const response = await fetch("https://dummyjson.com/products")
        const data = await response.json()

        allProducts = data.products

        productsContainer.innerHTML = allProducts
            .map(product => createCard(product))
            .join("")

        attachAddToCartListeners()

    } catch (error) {
        console.log(error)
    } finally {
        loading.classList.add("hidden")
    }
}

getProducts()

// ─── ADD TO CART BUTTONS ───────────────────────────────────────

function attachAddToCartListeners() {
    document.querySelectorAll(".addBtns").forEach(btn => {
        btn.addEventListener("click", function () {

            const id = +this.dataset.id
            const product = allProducts.find(p => p.id === id)

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

// ─── CART ELEMENTS ───────────────────────────────────────

const cartBtn = document.querySelector(".cartBtn")
const cartSidebar = document.getElementById("cartSidebar")
const closeCart = document.getElementById("closeCart")
const cartItemsEl = document.getElementById("cartItems")

cartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("translate-x-[-100%]")
})

closeCart.addEventListener("click", () => {
    cartSidebar.classList.add("translate-x-[-100%]")
})

// ─── CART FUNCTIONS ───────────────────────────────────────

function addToCart(product) {

    const existingItem = findCartItem(product.id)

    if (existingItem) {
        existingItem.quantity++
    } else {
        cart.push({ ...product, quantity: 1 })
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
        cart = cart.filter(item => item.id !== id)
    }

    saveCart()
    renderCart()
}

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id)

    saveCart()
    renderCart()
}

// ─── BADGE ───────────────────────────────────────

function updateCartBadge() {

    const badge = document.getElementById("cartBadge")

    const total = cart.reduce((sum, item) => {
        return sum + item.quantity
    }, 0)

    badge.textContent = total

    badge.classList.toggle("hidden", total === 0)
}

// ─── RENDER CART ───────────────────────────────────────

function renderCart() {

    const totalEl = document.querySelector("#cartSidebar .text-orange-500.text-3xl")

    updateCartBadge()

    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0)

    if (totalEl) {
        totalEl.textContent = "$" + totalPrice.toFixed(2)
    }

    if (!cart.length) {

        cartItemsEl.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                <i class="fa-solid fa-cart-shopping text-6xl"></i>
                <p class="text-lg font-medium">Your cart is empty</p>
            </div>`

        return
    }

    cartItemsEl.innerHTML = ""

    cart.forEach(item => {

        const div = document.createElement("div")

        div.className = "flex gap-3 bg-gray-50 rounded-2xl p-3"

        div.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}" class="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-sm line-clamp-1 mb-1">${item.title}</h4>
                <p class="text-orange-500 font-bold text-base mb-2">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="flex items-center gap-2">
                    <button onclick="decreaseQuantity(${item.id})"
                        class="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-orange-100 transition font-bold">−</button>

                    <span class="w-6 text-center font-semibold text-sm">${item.quantity}</span>

                    <button onclick="increaseQuantity(${item.id})"
                        class="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-orange-100 transition font-bold">+</button>

                    <button onclick="removeFromCart(${item.id})"
                        class="ml-auto w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 transition flex items-center justify-center text-red-500">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            </div>`

        cartItemsEl.appendChild(div)
    })
}

renderCart()


const searchInput = document.getElementById("searchInput")

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase()

    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(value)
    )

    productsContainer.innerHTML = ""

    filtered.forEach(product => {
        productsContainer.innerHTML += createCard(product)
    })

    attachAddToCartListeners()
})