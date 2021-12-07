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
const controlMail = '.{1,}@.{1,}\..';
const controlNoNumber = '[A-Za-zÀ-ÖØ-öø-ÿ]+-{0,1}\'{0,1}[A-Za-zÀ-ÖØ-öø-ÿ]+'
const controlAddress = '.+ .+ .+'
let orderContact = '';

async function sendOrder(){
    let init = makeOrder()
    orderNumber = fetch('http://localhost:3000/api/products/order/', init)
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    } )
    .then(function(res){
        clearCart();
        window.location.href = './confirmation.html?orderId='+res.orderId;
    })
    .catch(function(err){
        console.log("Oh non une erreur s'est produite : "+err);
    })
}

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

function verifyInput(input){
    if (input.id == 'email'){
        let control = new RegExp(controlMail);
        if (control.test(input.value)){
            input.nextElementSibling.innerText = '';
        } else{
            input.nextElementSibling.innerText = 'Le mail doit être au format : adresse@domain.dot';
        }
    } else if(input.id == 'address'){
        let control = new RegExp(controlAddress);
        if (control.test(input.value)){
            input.nextElementSibling.innerText = '';
        } else{
            input.nextElementSibling.innerText = 'L\'adresse semble incorrecte. Format attendu : N° typerue nomderue';
        }
    } else{
        let control = new RegExp(controlNoNumber);
        if (control.test(input.value)){
            input.nextElementSibling.innerText = '';
        } else{
            input.nextElementSibling.innerText = 'Les nombres ne sont pas autorisés.'; 
        }
    }
}

function getCartItem(e){
    let id = e.target.closest('article').getAttribute('data-id');
    let color = e.target.closest('article').getAttribute('data-color');
    return [id, color];
}

function removeCartItem(e){
    let [id, color] = getCartItem(e);
    if (e.target.classList.contains('deleteItem')){
        console.log('click supprimer')
        deleteCartEntry(id, color);
        cleanCart();
        setLocalCart(cart)
        e.target.closest('article').remove();
    }
    displayTotal();
}

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

function writeHtml(cart){
    cart.forEach(item => {
        cartItems.insertAdjacentHTML('beforeend', cartItemTemplate(item));
    })
}

async function displayTotal(){
    let price = 0;
    let quantity = 0;
    for (let item of cartItem){
        let product = await getProducts(item.getAttribute('data-id'));
        let productQuantity = item.querySelector("input.itemQuantity").value;
        price += product.price * productQuantity;
        quantity += parseInt(productQuantity, 10);
    }
    totalPrice.innerText = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(price);
    totalQuantity.innerText = quantity;
}

async function displayCartItemsDetail(){
    for (element of itemDescription){
        let product = await getProducts(element.closest('article').getAttribute('data-id'));
        element.querySelector('h2').innerText = product.name;
        element.querySelector('p').nextElementSibling.innerText = product.price+' €';
    }
}

async function displayCartItemsImage(){
    for (element of cartItem){
        let product = await getProducts(element.getAttribute('data-id'));
        element.querySelector('img').setAttribute('src', product.imageUrl);
        element.querySelector('img').setAttribute('alt', product.altText);
    }
}

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
cartOrderForm.addEventListener('change', function(e){
    verifyInput(e.target)
})
orderButton.addEventListener('click', async function(e){
    e.preventDefault();
    if (validAllInputs()){
        orderContact = new FormData(cartOrderForm);
    }
    let res = await sendOrder();
})

