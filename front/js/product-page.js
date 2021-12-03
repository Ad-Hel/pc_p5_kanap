/**
 * Get html element to populate
 */
const img = document.querySelector('.item__img');
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



function writeImg(product){
    let imgProduct = document.createElement('img');
    imgProduct.setAttribute('src', product.imageUrl);
    imgProduct.setAttribute('alt', product.altTxt);
    img.appendChild(imgProduct);
}

function writeColors(product){
    product.colors.forEach(
        function(color) {
        let colorHtml = document.createElement('option');
        colorHtml.setAttribute('value', color);
        colorHtml.innerText = color;
        colors.appendChild(colorHtml);
    });
}

function writeProduct(product){
    writeImg(product);
    title.innerText = product.name;
    price.innerText = product.price;
    description.innerText = product.description;
    writeColors(product);
}

async function showProduct(){
    let product = await getProducts(id);
    writeProduct(product);
}

showProduct();

