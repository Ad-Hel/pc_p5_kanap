/**
 * Get html element to populate
 */
const img = document.querySelector('.item__img');
const titlePrice = document.querySelector('.item__content__titlePrice');
const description = document.querySelector('.item__content__description');
const colors = document.getElementById('colors');
const quantity = document.getElementById('quantity');
const addToCart = document.getElementById('addToCart');

/**
 * Get the id within the url
 */
let id = new URLSearchParams(window.location.search).get('id');

function writeProduct(product){
    let productObj = createProduct(product);

    img.appendChild(productObj.img());

    titlePrice.appendChild(productObj.title('h1'));

    titlePrice.appendChild(document.createElement('p'));
    titlePrice.lastElementChild.innerText = 'Prix : '
    titlePrice.lastElementChild.appendChild(productObj.cost('span'));

    description.appendChild(productObj.text());
    
    productObj.colorsOptions().forEach( color =>{
        colors.appendChild(color);
    });
}

async function showProduct(){
    let product = await getProducts(id);
    writeProduct(product);
}

addToCart.addEventListener('click', function(){
    getLocalCart();
    let color = colors.value;
    let number = parseInt(quantity.value, 10);
    addCartEntry(id, color, number);
    setLocalCart(cart);
})

showProduct();

