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

import {getStorage, ref as sRef, uploadBytesResumable,getDownloadURL} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import {getDatabase, ref, set, child, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const realdb = getDatabase();



//r-------------references and variables----------------//
var files=[];
var fileReaders=[];
var imageLinksArray=[];

const imgdiv= document.getElementById('imagesDiv');
const selBtn= document.getElementById('selimgsbtn');
const addBtn= document.getElementById('addprodbtn');
const proglab= document.getElementById('loadlab');

const name= document.getElementById('nameinp');
const category= document.getElementById('catinp');
const description= document.getElementById('desarea');
const price= document.getElementById('priceinp');
const stock= document.getElementById('stockinp');

const p1= document.getElementById('p1inp');
const p2= document.getElementById('p2inp');
const p3= document.getElementById('p3inp');
const p4= document.getElementById('p4inp');


function OpenFileDialog(){
    let inp = document.createElement('input');
    inp.type='file';
    inp.multiple='multiple';

    inp.onchange = (e) => {
        AssignImgsToFilesArray(e.target.files);
        CreateImgTags();
    }
    inp.click();
}

    

function AssignImgsToFilesArray(thefiles){
    let num = files.length + thefiles.length;
    let looplim = (num <= 10) ? thefiles.length : (10 - files.length);

    for (let i=0; i<looplim; i++){
        files.push(thefiles[i]);
    }
    if(num>10) alert("max 10 images are allowed");
}

function CreateImgTags(){
    imgdiv.innerHTML='';
    imgdiv.classList.add('imagesDivStyle');

    for (let i = 0; i<files.length; i++) {
        fileReaders[i] = new FileReader();

        fileReaders[i].onload = function(){
            var img= document.createElement('img');
            img.id='imgNo'+i;
            img.classList.add('imgs');
            img.src=fileReaders[i].result;
            imgdiv.append(img);
        }

        fileReaders[i].readAsDataURL(files[i]);
    }
    let lab = document.getElementById('label');
    lab.innerHTML('clear images');
    lab.style = 'cursor:pointer;display:block;color:navy; font-size:12px';
    lab.addEventListener('click', ClearImages);
    imgdiv.append(lab);
}

function ClearImages(){
    files=[];
    imageLinksArray=[];
    imgdiv.innerHTML='';
    imgdiv.classList.remove('imagesDivStyle');

}

function getShortTitle(){
    let namey = name.value.substring(0,50);
    return namey.replace(/[^a-zA-Z0-9]/g,"");
}

function GetImgUploadProgress(){
    return 'Images Uploaded' + imageLinksArray.length+ ' of ' + files.length;
}

function IsAllImagesUploaded(){
    return imageLinksArray.length == files.length;
}

function GetPoints(){
    let points = [];
   if(p1.value.length > 0) points.push(p1.value);
   if(p2.value.length > 0) points.push(p2.value);
   if(p3.value.length > 0) points.push(p3.value);
   if(p4.value.length > 0) points.push(p4.value);

   return points;
}

function RestoreBack(){
    selBtn.disabled=false;
    addBtn.disabled=false;
    proglab.innerHTML='';
}



//---------------------------------events------------------//
if(selBtn){selBtn.addEventListener('click', OpenFileDialog);}

if(addBtn){addBtn.addEventListener('click', UploadAllImages);}

//-------------------upload image----------------------//

function UploadAllImages(){
    selBtn.disabled=true;
    addBtn.disabled=true;

    imageLinksArray=[];

    for(let i=0; i<files.length; i++){
        UploadAnImage(files[i], i);
    }
}



function UploadAnImage(imgToUpload, imgNo){
    const metadata = {
        contentType: imgToUpload.type
    };

    const storage = getStorage();
    const ImageAddress="images/" + getShortTitle()+ "/img#"+ (imgNo+1);
    const storageRef = sRef(storage, ImageAddress);
    const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metadata);
    
    uploadTask.on('state_changed', (snapshot) =>{
        proglab.innerHTML= GetImgUploadProgress();
    },

    (error)=>{
        alert("error: image uplaod failed" + error);
    },

    ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            imageLinksArray.push(downloadURL);
            if(IsAllImagesUploaded()){
                proglab.innerHTML='all images uploaded';
                UploadAProduct();
            }
        });
    }
    );
}

let catga = document.getElementById('catinp');

//--------------------upload a product----------------//
    function UploadAProduct(){
        set(ref(realdb,category.value + getShortTitle()),{
            ProductTitle: name.value,
            category: category.value,
            description: description.value,
            price: price.value,
            stock: stock.value,
            points: GetPoints(),
            LinksOfImagesArray: imageLinksArray
        });
        alert("upload successful");
        RestoreBack();
    }

    