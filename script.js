let productsGrid = document.getElementById('products-grid');
let productsArray = [];
let xhr = new XMLHttpRequest();
let url = 'https://fliper-dc51.restdb.io/rest';

xhr.open('GET', url + '/product');

xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("x-apikey", "65c88987c8b82559110da2cb");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.responseType = 'json'
xhr.onload = function () {
    productsArray = xhr.response;
    productsArray.innerHTML = null;
    productsArray.forEach(p => {
        productsArray.push(p);
        let pElem = document.createElement('div');
        pElem.classList.add('product');
        pElem.innerHTML = `
        <h2 class='product-name'>${p.name}</h2>
        <img class='product-photo' src='${p.photo_url}' alt='${p.name}'>
        <p class='product-price'><b>Price: </b>${p.price}$</p>
        <p class='product-description'><b>Description:</b>${p.description}</p>
        <a href='userProfile.html?id=${p.author_id}'>Seller profile</a>
        <button onclick="addProductToCart('${p.id}')">Buy</button>
        `;
        productsGrid.append(pElem);
    });
}
xhr.send();

// function addProductToCart(id) {
//     xhr.open('GET', `${url}/products/${id}`);
//     xhr.responseType = 'json'
//     xhr.onload = function () {
        
//     }
// }



let cartProd = document.getElementById('cart-products');

let cart = [];
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    drawCartProducts();
}


function addProductToCart(id) {
    let product = productsArray.find(function (p) {
        return p._id == id;
    })
    cart.push(product);
    drawCartProducts();
    localStorage.setItem("cart", JSON.stringify(cart));

    document.getElementById('cart-button').classList.add('active');
    setTimeout(function () {
        document.getElementById('cart-button').classList.remove('active');
    }, 500);
}

function drawCartProducts() {
    if(cartProd.length === 0) return cartProd.innerHTML = 'Cart is empty';
    cartProd.innerHTML = null;
    let sum = 0;
    cart.forEach(function(p){
        cartProd.innerHTML += `
        <p><img src="${p.photo_url}"> ${p.name} |${p.price}</p>
        <hr>
        `;
        sum += p.price;
    });
    cartProd.innerHTML +=`
    <p>Total Price: ${sum}$</p>
    <button onclick="buyAll()">Buy All</button>
    `;
}

function buyAll() {
    cart = [];
    cartProd.innerHTML = 'Money was withdrawn from your credit cart';
    localStorage.setItem("cart", '[]')
}

function openCart() {
    cartProd.classList.toggle('hide');
}

document.getElementById('order-form').addEventListener('submit', function (e) {
    e.preventDefault();//
    let data = JSON.stringify({
        "name": e.target['mame'].value,
        "address": e.target['address'].value,
        "phone": e.target['phone'].value,
        "post_number": e.target['post_number'].value,
        "status": "New"
        "products": localStorage.getItem('cart')
    });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + "/order");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-apikey", "65c88987c8b82559110da2cb");
    xhr.setRequestHeader("cache-cotrol", "no-cache");
    xhr.send(data);

    modal.style.display = "none";
    cart = [];
    cartProd.innerHTML = 'tell your money bye bye';
    localStorage.setItem("cart", '[]');
})