import { } from  './script.js'


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7NSonfkYq5jMcQCh8LKcEXta7jQ-6v94",
  authDomain: "web-project-deneme.firebaseapp.com",
  databaseURL: "https://web-project-deneme-default-rtdb.firebaseio.com",
  projectId: "web-project-deneme",
  storageBucket: "web-project-deneme.appspot.com",
  messagingSenderId: "131016870019",
  appId: "1:131016870019:web:6f16c089a4f7368a4bf3b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getDatabase, ref, set, child, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const realdb = getDatabase();

var OuterDiv = document.getElementById('productsDiv');
var ArrayOfProducts = [];
window.addEventListener('load', GetAllProducts);

function GetAllProducts(){
    const dbref = ref(realdb);
    
    get(child(dbref, "TheProductRealdb"))
    .then((snapshot)=>{ 
        snapshot.forEach(prod =>{
            ArrayOfProducts.push(prod.val());
        });
        AddAllProducts();
    })
}

function AddAllProducts(){
    let i = 0;
    ArrayOfProducts.forEach(prod => {
        AddAProduct(prod, i++);
    });
}

function AddAProduct(product, index){
    let html = 
    `
    <img src="`+ product +`" class="thumb mt-2" id="thumb1` + index + `" >
            <p class="title" id="title1 ` + index + `"> ` + product.ProductTitle +`</p>
            `+
            GetUl(product.points)
            +
            GenerateStockLabel(product.stock)
            +
            `
            <h5 class="price">Rs. `+ product.price +` </h5>
            <button class="btn" id="detbtn"></button>
    `

    let newProd = document.createElement('div');
    newProd.classList.add('productcard');
    newProd.innerHTML = html;
    OuterDiv.append(newProd);
}


function GenerateStockLabel(stock){
    let stocklabel = document.createElement('h5');
    stocklabel.classList.add('stock');

    if(stock > 0){
        stocklabel.innerHTML='IN STOCK';
        stocklabel.classList.add('test-success');
    }
    else{
        stocklabel.innerHTML='OUT OF STOCK';
        stocklabel.classList.add('text-warning');
    }
    return stocklabel.outerHTML;
}

function GetUl(param_array){
    let ul = document.createElement('ul');
    ul.classList.add('points');
    param_array.forEach(element => {
        let li = document.createElement('li')
        li.innerText=element;
        ul.append(li);

    });

    return ul.outerHTML;
}