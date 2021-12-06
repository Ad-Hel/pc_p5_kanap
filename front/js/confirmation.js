const orderIdSpan = document.getElementById('orderId');
const orderId = new URLSearchParams(window.location.search).get('orderId');
function displayOrderId(id){
    orderIdSpan.innerText = id;
}

displayOrderId(orderId);