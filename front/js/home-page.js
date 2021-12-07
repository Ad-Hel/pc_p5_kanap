const items = document.getElementById('items');

function writeHtml(products){
    products.forEach(element => {
        console.log(element);
    let item = itemTemplate(element);
    console.log(item);
    items.insertAdjacentHTML('beforeend', item);
    });
}
async function showProducts(){
    const products = await getProducts();
    writeHtml(products);

}

showProducts();

