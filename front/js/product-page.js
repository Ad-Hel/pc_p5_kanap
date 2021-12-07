/**
 * Get html element to populate
 */
const img = document.querySelector('.item__img img');
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colors = document.getElementById('colors');
const quantity = document.getElementById('quantity');
const addToCart = document.getElementById('addToCart');

/**
 * Get the id within the url
 */
let id = new URLSearchParams(window.location.search).get('id');

function writeDetailProduct(product){
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altText);
    title.innerText = product.name;
    description.innerText = product.description;
}

function writeColorsOptions(productColors){
    productColors.forEach(color => {
        colors.insertAdjacentHTML('beforeend', optionTemplate(color));
    });
}

async function showProduct(){
    let product = await getProducts(id);
    writeDetailProduct(product);
    writeColorsOptions(product.colors);
}

addToCart.addEventListener('click', function(){
    getLocalCart();
    let color = colors.value;
    let number = parseInt(quantity.value, 10);
    addCartEntry(id, color, number);
    setLocalCart(cart);
})

showProduct();

