getLocalCart();
const cartItems = document.getElementById('cart__items');
const cartItem = document.getElementsByClassName('cart__item');
const itemImg = document.getElementsByClassName('cart__item__img');
const itemDescription = document.getElementsByClassName('cart__item__content__description');
const itemDelete = document.getElementsByClassName('deleteItem');
const itemQuantity = document.getElementsByClassName('itemQuantity');

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

function getCartEntry(e){
    let id = e.target.closest('article').getAttribute('data-id');
    let color = e.target.closest('article').getAttribute('data-color');
    return [id, color];
}

function removeItem(e){
    let [id, color] = getCartEntry(e);
    if (e.target.classList.contains('deleteItem')){
        console.log('click supprimer')
        deleteCartEntry(id, color);
        cleanCart();
        setLocalCart(cart)
        e.target.closest('article').remove();
    }
}

function modifyQuantity(e){
    let [id, color] = getCartEntry(e);
    let quantity = parseInt(e.target.value, 10);
    if (e.target.classList.contains('itemQuantity')){
        console.log('change quantity');
        modifyCartEntry(id, color, quantity);
        cleanCart();
        setLocalCart(cart)
    }
}

function writeHtml(cartItem){
    cartItems.insertAdjacentHTML('beforeend', 
    `<article class="cart__item" data-id="${cartItem.id}" data-color="${cartItem.color}">
        <div class="cart__item__img">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <p>${cartItem.color}</p>
            </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
            </div>
        </div>
    </article>`
    )
}

async function displayCartItems(){
    for (element of itemDescription){
        let product = await getProducts(element.closest('article').getAttribute('data-id'));
        let productObj = createProduct(product);
        element.insertAdjacentElement('afterbegin', productObj.title('h2'));
        element.insertAdjacentElement('beforeend', productObj.cost('p'));
    }
    for (element of cartItem){
        let product = await getProducts(element.getAttribute('data-id'));
        let productObj = createProduct(product);
        element.children[0].appendChild(productObj.img())
    }
}

for (item of cart){
    writeHtml(item);
}
displayCartItems()

cartItems.addEventListener('click', removeItem);
cartItems.addEventListener('change', modifyQuantity);
cartOrderForm.addEventListener('change', function(e){
    verifyInput(e.target)
})
