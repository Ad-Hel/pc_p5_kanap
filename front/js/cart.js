const cartItems = document.getElementById('cart__items');
const cartItem = document.getElementsByClassName('cart__item');
const itemImg = document.getElementsByClassName('cart__item__img');
const itemDescription = document.getElementsByClassName('cart__item__content__description');
const itemDelete = document.getElementsByClassName('deleteItem');
const itemQuantity = document.getElementsByClassName('itemQuantity');
const totalPrice = document.getElementById('totalPrice');
const totalQuantity = document.getElementById('totalQuantity');
const cartOrderForm = document.getElementsByClassName('cart__order__form')[0];
const orderButton = document.getElementById('order');
const regexMail = /\S+@\S+\.\S+/g;
const regexNoNumber = /[A-Za-zÀ-ÖØ-öø-ÿ]+-{0,1}\'{0,1}[A-Za-zÀ-ÖØ-öø-ÿ]*/g;
const regexAddress = /\S+ \S+ \S+/g;
let orderContact = '';

// ================================
// === Order building functions ===
// ================================

/**
 * This function make an object with a object contact and an array 'products'.
 * The objet 'contact' is made from a formdata object.
 * The array 'products' is made from the variable cart, only the id of the cart entry are taken.
 * @returns object {method: POST, body: json, mode: 'cors' header: object}
 */
function makeOrder(){
    let contact = {};
    let products = [];
    let order = {contact, products};
    for (let [key, value] of orderContact.entries()) { 
        contact[key] = value;
    }
    for (let product of cart){
        products.push(product.id);
    }
    let init = {
        method: 'POST',
        body: JSON.stringify(order),
        mode: 'cors',
        headers: new Headers({
            "Content-Type": "application/json"
          })
    }
    return init;
}
/**
 * This function list all inputs, exclude the submit button and use the verifyInput function on them.
 * This function iterate the inputs and check if an error message is present.
 * If an error message is found, then the valid variable is set to false.
 * The valid variable is returned.
 * @returns boolean
 */
function validAllInputs(){
    let valid = true;
    let inputs = cartOrderForm.querySelectorAll('input');
    for (let input of inputs){
        if (input.id != 'order'){
            if (input.value != ''){
                verifyInput(input)
            } else {
                input.nextElementSibling.innerText = 'Merci de remplir le champ ci-dessus.'
            }
        }
    }
    for (let input of inputs){
        if (input.id != 'order'){
            if (input.nextElementSibling.innerText != ''){
                valid = false;
            }
        }
    }
    return valid;
}

// ========================
// === Control function ===
// ========================

/**
 * This function apply RegExp test on input value.
 * The test depends of the type of content expected.
 * @param {element} input 
 */
function verifyInput(input){
    if (input.value == ''){
        input.nextElementSibling.innerText = 'Ce champ est obligatoire';
    } else {
        if (input.id == 'email'){
            regexMail.lastIndex = 0;          
            if (regexMail.test(input.value)){
                input.nextElementSibling.innerText = '';
            } else{
                input.nextElementSibling.innerText = 'Le mail doit être au format : adresse@domain.dot';
            }
        } else if(input.id == 'address'){
            regexAddress.lastIndex = 0; 
            if (regexAddress.test(input.value)){
                input.nextElementSibling.innerText = '';
            } else{
                input.nextElementSibling.innerText = 'L\'adresse semble incorrecte. Format attendu : N° typerue nomderue';
            }
        } else{
            regexNoNumber.lastIndex = 0; 
            if (regexNoNumber.test(input.value)){
                input.nextElementSibling.innerText = '';
            } else{
                input.nextElementSibling.innerText = 'Les nombres ne sont pas autorisés.'; 
            }
        }
    }  
}

// =============================
// === Cart modify functions ===
// =============================

/**
 * This function get a couple of value from parent element data attributes and returns it.
 * @param {event} e 
 * @returns an array with the couple of value
 */
function getCartItem(e){
    let id = e.target.closest('article').getAttribute('data-id');
    let color = e.target.closest('article').getAttribute('data-color');
    return [id, color];
}
/**
 * This function call getCartItem and affect the returned values to two variables.
 * This values are pass as params of the deleteCartEntry function.
 * After the cleanCart function is called, le localStorage cart is update and the element is removed.
 * The function displayTotal is called to actualize the total price and quantity of the cart.
 * @param {event} e 
 */
function removeCartItem(e){
    let [id, color] = getCartItem(e);
    if (e.target.classList.contains('deleteItem')){
        deleteCartEntry(id, color);
        cleanCart();
        setLocalCart(cart)
        e.target.closest('article').remove();
    }
    displayTotal();
}
/**
 * This function call getCartItem and affect the returned values to two variables.
 * It converts to integer the value of the event target.
 * This values are used as params of the modifyCartEntry function.
 * The localStorage cart is updated.
 * The displayTotal function is used to actualize the total price and quantity. 
 * @param {event} e 
 */
function modifyCartItemQuantity(e){
    let [id, color] = getCartItem(e);
    let quantity = parseInt(e.target.value, 10);
    if (e.target.classList.contains('itemQuantity')){
        modifyCartEntry(id, color, quantity);
        cleanCart();
        setLocalCart(cart)
    }
    displayTotal();
}

// ==============================
// === Cart display functions ===
// ==============================

/**
 * This function iterates the entries of the cart to call the cartItemTemplate function.
 * This function return a snippet of HTML and is declared in cart.html at line 52.
 * @param {array} cart 
 */
function writeHtml(cart){
    cart.forEach(item => {
        console.log(item);
        cartItems.insertAdjacentHTML('beforeend', cartItemTemplate(item));
    })
}

/**
 * This function iterates the itemDescription elements, gets the Product related and use it to set the title and the price.
 */
async function displayCartItemsDetail(){
    for (element of itemDescription){
        let product = await getProducts(element.closest('article').getAttribute('data-id'));
        element.querySelector('h2').innerText = product.name;
        element.querySelector('p').nextElementSibling.innerText = product.price+' €';
    }
}

/**
 * This function iterates the cartItem elements, gets the Product related and use it to set the image and the alt text.
 */
async function displayCartItemsImage(){
    for (element of cartItem){
        let product = await getProducts(element.getAttribute('data-id'));
        element.querySelector('img').setAttribute('src', product.imageUrl);
        element.querySelector('img').setAttribute('alt', product.altText);
    }
}

/**
 * This function iterate the cart entries to display the total quantity and price.
 */
 async function displayTotal(){
    let price = 0;
    let quantity = 0;
    for (let item of cart){
        let product = await getProducts(item.id);
        price += product.price * item.quantity;
        quantity += item.quantity;
    }
    totalPrice.innerText = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(price);
    totalQuantity.innerText = quantity;
}

/**
 * This function is used to call the functions in the correct order to build the interface of the cart.
 */
async function showCart(){
    getLocalCart();
    writeHtml(cart);
    await displayCartItemsDetail();
    await displayCartItemsImage();
    displayTotal();

}




showCart();
cartItems.addEventListener('click', removeCartItem);
cartItems.addEventListener('change', modifyCartItemQuantity);
cartOrderForm.addEventListener('input', function(e){
    verifyInput(e.target)
})
orderButton.addEventListener('click', async function(e){
    e.preventDefault();
    if (validAllInputs()){
        orderContact = new FormData(cartOrderForm);
    }
    let res = await sendOrder();
})

