const items = document.getElementById('items');

/**
 * This function iterate an array to pass its elements as param of another function.
 * The second function return a html snippet who take some elements property in the html returned.
 * The itemTemplate function is declared inside the file index.html at line 55.
 * @param {array of object} products {id: string, name: string, price: integer, imageUrl: string, description: string, altText: string}
 */
function writeHtml(products){
    products.forEach(element => {
    let item = itemTemplate(element);
    items.insertAdjacentHTML('beforeend', item);
    });
}
/**
 * This function has for only purpose to call the API fetch function and pass the response to the writeHtml as param.
 */
async function showProducts(){
    const products = await getAllProducts();
    writeHtml(products);

}

showProducts();

