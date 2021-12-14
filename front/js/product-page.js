/**
 * Get html elements
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
const id = new URLSearchParams(window.location.search).get('id');

/**
 * This function set the attribues of the img element and set the inner text of the title and description elements.
 * @param {object} product {id: string, name: string, price: integer, imageUrl: string, description: string, altText: string}
 */
function writeDetailProduct(product){
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altText);
    price.innerText = Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(product.price);
    title.innerText = product.name;
    description.innerText = product.description;
}
/**
 * This function iterate the array of colors to create a html snippet with the optionTemplate function and insert it inside the colors element.
 * The function optionTemplate is declared in the product.html at line 70.
 * @param {array of string} productColors 
 */
function writeColorsOptions(productColors){
    productColors.forEach(color => {
        colors.insertAdjacentHTML('beforeend', optionTemplate(color));
    });
}
/**
 * This function call the API fetch and pass the response to two functions.
 */
async function showProduct(){
    let product = await getProducts(id);
    writeDetailProduct(product);
    writeColorsOptions(product.colors);
}
/**
 * This event lister is used ton add in the cart a new entry.
 * This entry is built with the value of the colors select, the value of the input number quantity and the id of the product.
 */
addToCart.addEventListener('click', function(){
    let color = colors.value;
    let quantityNumber = parseInt(quantity.value, 10);
    if (color != "" && quantityNumber > 0){
        console.log('C\'est dans le panier !');
        getLocalCart(); 
        addCartEntry(id, color, quantityNumber);
        setLocalCart(cart);
    } else {
        console.log('Veuillez sélectionner une quantité et une couleur.');
    }
})

showProduct();

