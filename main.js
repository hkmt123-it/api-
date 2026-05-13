const productsContainer = document.querySelector(".container")

function createCard(product) {
    return `
    <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300">

        
                    <div class="relative">

                        <img src="${product.thumbnail}"
                            alt="" class="w-full h-[260px] object-cover" />

            
                        <span class="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                            -${product.discountPercentage.toFixed()}%
                        </span>

                    
                        <button
                            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">

                            <i class="fa-regular fa-heart"></i>

                        </button>

                    </div>


                    <div class="p-5">

                
                        <div class="flex items-center justify-between mb-3">

                            <p class="text-sm text-orange-500 font-medium capitalize">
                                ${product.category}
                            </p>

                            <p class="${product.availabilityStatus.toLowerCase().includes('low') ? 'text-red-500' : 'text-green-500'}">
                                ${product.availabilityStatus}
                            </p>

                        </div>

            
                        <h3 class="text-2xl font-bold mb-3 line-clamp-1">
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

                
                        <div class="flex items-center gap-2 mb-5">

                            <i class="fa-solid fa-tag text-orange-500"></i>

                            <p class="text-gray-600 text-sm">
                                Brand:
                                <span class="font-semibold">
                                    ${product.brand}
                                </span>
                            </p>

                        </div>

            
                        <div class="flex items-center justify-between">

                
                            <div>

                                <p class="text-gray-400 text-sm">
                                    Price
                                </p>

                                <div class="flex items-center gap-2">

                                    <h4 class="text-3xl font-bold text-orange-500">
                                        $${product.price}
                                    </h4>

                                </div>

                            </div>

                    
                            <button
                                class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl transition addBtns">

                                <div class="flex items-center gap-2">

                                    <i class="fa-solid fa-cart-plus"></i>

                                    <span>
                                        Add
                                    </span>

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

        const response = await fetch("https://dummyjson.com/products")
        const data = await response.json()

        await new Promise(resolve => setTimeout(resolve, 500))

        productsContainer.innerHTML = ""

        data.products.forEach(product => {
            productsContainer.innerHTML += createCard(product)
        })

        const topHtml = document.querySelector(".top")
        topHtml.innerHTML += `
    <h2 class="text-3xl font-bold">
                Total:
                <span class="text-orange-500">
                    ${data.products.length}
                </span>
                Products
            </h2>
`

    } catch (error) {
        console.log(error)
    } finally {
        loading.classList.add("hidden")
    }
}
getProducts()




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


const cartBtn = document.querySelector(".cartBtn")

const cartSidebar = document.getElementById("cartSidebar")

const closeCart = document.getElementById("closeCart")


cartBtn.addEventListener("click", () => {

    cartSidebar.classList.remove("translate-x-[-100%]")

})


closeCart.addEventListener("click", () => {

    cartSidebar.classList.add("translate-x-[-100%]")

})