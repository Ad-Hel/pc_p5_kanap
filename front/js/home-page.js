const items = document.getElementById('items');

function writeHtml(products){
    products.forEach(element => {
    let item = itemTemplate(element);
    items.insertAdjacentHTML('beforeend', item);
    });
}
async function showProducts(){
    const products = await getProducts();
    writeHtml(products);

}

showProducts();

