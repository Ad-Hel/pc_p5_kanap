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

function createProduct(product){
    let productObj = new Product(product._id, product.name, product.description, product.price, product.imageUrl, product.altTxt);
    return productObj;
}

const Product = class{
    constructor(id, name, description, price, imageUrl, imageAltText){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.imageAltText = imageAltText;
    };
    url(){
        let url=document.createElement('a');
        url.setAttribute('href', './product.html?id='+this.id);
        return url;
    };
    img(){
        let img = document.createElement('img');
        img.setAttribute('src', this.imageUrl);
        img.setAttribute('alt', this.imageAltText);
        return img;
    };
    title(h){
        let title = document.createElement(h);
        // title.classList.add('productName');
        title.innerText = this.name;
        return title;
    };
    text(){
        let text = document.createElement('p');
        text.classList.add('productDescription');
        text.innerText = this.description;
        return text;
    };
    cost(e){
        let price = document.createElement(e);
        price.innerText = this.price + " €";
        return price;
    };
}

 


