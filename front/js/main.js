// ====================
// === API REQUESTS ===
// ====================

//TO DO : Dupliquer cette fonction pour distinguer clairement la requête de l'ensemble des produits de celle d'un produit spécifique.
/**
 * This function send a get request to API and return the result.
 * @param {string} id 
 * @returns a javascript object
 */
 async function getProducts(id=""){
    products = fetch('http://localhost:3000/api/products/'+id)
    .then(function(res){
        if (res.ok){
            return res.json();
        }
    })
    .catch(function(err){
        console.log(err);
    })
    return products;
}
/**
 * This function send a get request to API and return the result.
 * @returns a javascript object
 */
 async function getAllProducts(){
    products = fetch('http://localhost:3000/api/products/')
    .then(function(res){
        if (res.ok){
            return res.json();
        }
    })
    .catch(function(err){
        console.log(err);
    })
    return products;
}

/**
 * This function fetch the API to post the order. 
 * Then it calls the clearCart function.
 * Then it redirects to the order confirmation page.
 */
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

// =======================
// === CART MANAGEMENT ===
// =======================

/**
 * Cart initialization to be used globally.
 */
 let cart = [];

 /**
  * This function is used to identify a cart entry by the id of the product and his color.
  * @param {string} id 
  * @param {string} color 
  * @returns the object cartEntry {id: string, color: string, quantity: integer}
  */
 function findCartEntry (id, color){
     let cartEntry = cart.find(element => element.id === id && element.color === color);
     return cartEntry;
  }
  
 /**
  * This function is used to add a new product in the cart.
  * First of all, it checks if an entry with the same product of the same color exists.
  * Then, either it updates the quantity if a match exists or it create a new cart entry.
  * @param {string} id 
  * @param {string} color 
  * @param {number} quantity 
  */
  function addCartEntry(id, color, quantity){
      if (findCartEntry(id, color) != undefined){
          findCartEntry(id, color).quantity += quantity;
      } else{
          cart.push({id: id, color:color, quantity: quantity})
      }
  }
 /**
  * This function is used to modify the quantity of an existing cart entry.
  * First of all, the existence of the entry to modify is checked.
  * Then, the quantity is replaced by the new value.
  * @param {string} id 
  * @param {string} color 
  * @param {number} quantity 
  */
 function modifyCartEntry(id, color, quantity){
     if (findCartEntry(id, color) != undefined){
         findCartEntry(id,color).quantity = quantity;
     } else{
         console.log("Impossible to modify undefined cart entry. Id = "+id +" Color: "+color)
     }
 }
 /**
  * This function deletes an existing cart entry.
  * First of all the existence of the entry to delete is checked.
  * Then, the quantity of it is put to 0. So the cleanCart function will erase it.
  * @param {string} id 
  * @param {string} color 
  */
 function deleteCartEntry(id, color){
     if (findCartEntry(id, color) != undefined){
         findCartEntry(id, color).quantity = 0;
     } else{
         console.log("Impossible to delete undefined cart entry. Id = "+id +" Color: "+color)
     }
 }

/**
 * This function delete the cart entries whose quantity property is inferior to zero.
 * This function has no direct effect on the localStorage item 'cart'.
 */
 function cleanCart(){
    cart = cart.filter(entry => entry.quantity > 0)
}

// ===========================
// === LOCALSTORAGE ACCESS ===
// ===========================

/**
 * This function save the array of objects into a json string to the localStorage.
 * @param {array of objects} cart 
 */
 function setLocalCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart))
}

/**
 * This function access the local storage to parse the json saved here to parse it into js variable.
 * If the item 'cart' doesn't exist in the local storage, the variable cart is reset to an empty array.
 */
 function getLocalCart(){
    if (localStorage.getItem('cart') != null){
        cart = JSON.parse(localStorage.getItem('cart'));
    } else{
        cart = [];
    }
}

/**
 * This function reset totally the cart.
 * The variable 'cart' is set to an empty array.
 * The localStorage item is removed.
 */
 function clearCart(){
    cart = [];
    localStorage.removeItem('cart');
}