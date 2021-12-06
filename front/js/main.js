let cart = [];

function findCartEntry (id, color){
    let cartEntry = cart.find(element => element.id === id && element.color === color);
    return cartEntry;
 }
 
 
 function addCartEntry(id, color, quantity){
     if (findCartEntry(id, color) != undefined){
         findCartEntry(id, color).quantity += quantity;
     } else{
         cart.push({id: id, color:color, quantity: quantity})
     }
 }

 function modifyCartEntry(id, color, quantity){
    if (findCartEntry(id, color) != undefined){
        findCartEntry(id,color).quantity = quantity;
    } else{
        cart.push({id: id, color: color, quantity: quantity})
    }
}

function deleteCartEntry(id, color){
    if (findCartEntry(id, color) != undefined){
        findCartEntry(id, color).quantity = 0;
    } else{
        console.log("Impossible to delete undefined cart entry. Id = "+id +" Color: "+color)
    }
}

function cleanCart(){
    cart = cart.filter(entry => entry.quantity > 0)
}

function setLocalCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart))
}

function getLocalCart(){
    if (localStorage.getItem('cart') != null){
        cart = JSON.parse(localStorage.getItem('cart'));
    } else{
        cart = [];
    }
}

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
    let productObj = new Product(product._id, product.name, product.description, product.price, product.imageUrl, product.altTxt, product.colors);
    return productObj;
}

const Product = class{
    constructor(id, name, description, price, imageUrl, imageAltText, colors){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.imageAltText = imageAltText;
        this.colors = colors;
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
        // text.classList.add('productDescription');
        text.innerText = this.description;
        return text;
    };
    cost(e){
        let price = document.createElement(e);
        price.innerText = new Intl.NumberFormat('fr-FR', {style: 'currency', currency:'EUR'}).format(this.price);
        return price;
    };
    colorsOptions(){
        let colorsOptions = [];
        this.colors.forEach( color =>{
            let colorHtml = document.createElement('option');
            colorHtml.setAttribute('value', color);
            colorHtml.innerText = color;
            colorsOptions.push(colorHtml);
        });
        return colorsOptions;
    }

}

 


