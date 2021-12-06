
function createProductsArray(products){
    const productsArray = []
    let productsArrayCount = 0;
    products.forEach(
        function(product){
            productsArray[productsArrayCount] = createProduct(product);
            productsArrayCount ++;
        }
    )
    return productsArray;
}

function writeHtml(products){
    data = createProductsArray(products);
    data.forEach(
        function(product){
            let items = document.getElementById('items');
            let articleLink = product.url();
            let article = document.createElement('article');
            let productName = product.title('h3');
            articleLink.appendChild(article);
            article.appendChild(product.img());
            article.appendChild(productName);
            article.appendChild(product.text());
            items.appendChild(articleLink)
        }
    )
}

async function showProducts(){
    const products = await getProducts();
    writeHtml(products);

}

showProducts();

