const orderIdSpan = document.getElementById('orderId');
const orderId = new URLSearchParams(window.location.search).get('orderId');

/**
 * This function set the inner text of the orderIdSpan element with the id of the order. 
 * @param {string} id 
 */
function displayOrderId(id){
    orderIdSpan.innerText = id;
}

displayOrderId(orderId);