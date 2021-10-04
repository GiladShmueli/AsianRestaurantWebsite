function getDishes() {
    db.collection("dishes").get().then(snapshot => {
        info = [];
        snapshot.docs.forEach(doc => {

            info.unshift({
                name: doc.data().name,
                id: doc.id,
                price: doc.data().price,
                type: doc.data().type,
                image: doc.data().image,
                category: doc.data().category
            });

        });
    }).then ( () => {
        renderDishes();
    })
}

function renderDishes() {
    const dishes = document.querySelector("#dishes");
    const drinks = document.querySelector("#drinks");
    info.forEach(element => {
        let menudiv = document.createElement("div");
        menudiv.setAttribute("class", "menubox");
        menudiv.setAttribute("id", element.id);
        let namep = document.createElement("p");
        namep.className = "center-text";
        namep.innerText = element.name;
        let img = document.createElement("img");
        img.src = element.image;
        img.className = "menu-img";
        let imgbox = document.createElement("center");
        imgbox.appendChild(img);
        let pricep = document.createElement("p");
        pricep.innerText = element.price + shekel;
        pricep.className = "center-text";
        menudiv.appendChild(namep);
        menudiv.appendChild(imgbox);
        menudiv.appendChild(pricep);
        if(element.type=="dish")
            dishes.appendChild(menudiv);
        else
            drinks.appendChild(menudiv);   
    });
}

let filled_flag = false;
let order_array = [];

function dishByMousePos(event) {
    let block = document.getElementById("fill-page");
    let x = event.clientX;
    let y = event.clientY;
    if (about2order(x,y))
        return;
    if (checkAndMove2Order(x, y))
        return;
    if (filled_flag == false) { //I chose a dish from the menu
        console.log("hello");
        let element = document.elementFromPoint(x, y).closest(".menubox");
        if(element != null) {
            setExtendedDish(element);  
            displayChoice("flex");
            filled_flag = true;
        }
    } else { //I accept or remove the choice
        let element = document.elementFromPoint(x, y).closest(".a-button");
        if (element != null) {
            if(element.id == "add-dish") {
               order_array.push({
                   name: document.getElementById("dish-name").innerText,
                   category: getChoice(),
                   price: parseFloat(document.getElementById("dish-price").innerText.replace(shekel,""))
               });
            }
            displayChoice("none");
            filled_flag = false;
        }
    }
  }

function about2order(x,y){
    if(document.getElementById("order-div").style.display == "none")
        return false;
    let element = document.elementFromPoint(x, y).closest(".order-button");
    if (element == null) {
        return false;
    }
    if (element.id == "cancel-order"){
        filled_flag = false;
        displayChoice("none");
        document.getElementById("order-div").style.display = "none";
    }
    if (element.id == "accept-order"){
        sessionStorage.setItem("dishes", JSON.stringify(order_array));
        window.location.href = '/checkout/';
    }
    return true;
}


function checkAndMove2Order(x, y) {
    let element = document.elementFromPoint(x, y).closest("#details");
    let sum = 0;
    if (element == null) {
        return false;
    }
    else {
        //print the order
        //TODO: add a remove dish button
        let block = document.getElementById("fill-page");
        let dish = document.getElementById("dish-extended");
        let order = document.getElementById("order-div");
        let details = document.getElementById("order-details");
        details.innerHTML = "";
        order_array.forEach(element => {
            let row = document.createElement("div");
            row.className = "row flex-wrap justify-content-center";
            row.style.color = "whitesmoke";
            let name = document.createElement("p");
            name.className = "col-5";
            let category = document.createElement("p");
            category.className = "col-4";
            let price = document.createElement("p");
            price.className = "col-3";
            name.innerText = element.name;
            category.innerText = element.category!=null? element.category: "";
            price.innerText = element.price + shekel;
            sum += element.price;
            row.appendChild(name);
            row.appendChild(category);
            row.appendChild(price);
            details.appendChild(row);
        });
        let total = document.createElement("p");
        total.style.color = "whitesmoke";
        total.innerText ="\nסכום הזמנה: " + sum + shekel;
        details.appendChild(total);
        block.style.display = "flex";
        dish.style.display = "none";
        order.style.display = "table";
        return true;
    }
}


function getChoice() {
    if (document.getElementById("radios").childElementCount == 0)
        return null;
    const rbs = document.querySelectorAll('input[name="category"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            return selectedValue = rb.value;
        }
    }
    return null;
}


function setExtendedDish(element){
    let dish_image = document.getElementById("dish-image");
    let dish_name = document.getElementById("dish-name");
    let dish_price = document.getElementById("dish-price");
    let dish_buttons = document.getElementById("dish-buttons");
    let radios = document.getElementById("radios");
    let dish = info.find(d => d.id == element.id);
    dish_image.setAttribute("src", dish.image);
    dish_name.innerText = dish.name;
    dish_price.innerText = dish.price + shekel;
    removeAllChildNodes(radios);

    if(dish.category != null && dish.category.length > 0) {
        dish.category.forEach(type => {
            let radio_input = document.createElement("input");
            radio_input.type = "radio";
            radio_input.name = "category";
            radio_input.value = type;
            radio_input.className = "radio-button";
            let p_input = document.createElement("p");
            p_input.innerText = type;
            p_input.className = "radio-text";
            radios.appendChild(radio_input);
            radios.appendChild(p_input);
            dish_buttons.style.marginTop = "10px";
        });
        radios.firstChild.setAttribute("checked", "true");
    } else {
        dish_buttons.style.marginTop = "50px";
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function displayChoice(dispVal) {
    let block = document.getElementById("fill-page");
    let dish = document.getElementById("dish-extended");
    console.log(dispVal);
    block.style.display = dispVal;
    dish.style.display = (dispVal != "none")? "table": "none";
    let order = document.getElementById("order-div");
    order.style.display = "none";
}

function reportWindowSize() {
    const dish_content = document.querySelector("#dish-extended");
    if (window.innerWidth <=1000) {
        dish_content.style.top = "10%";
    }
    else {
        dish_content.style.top = "50%";
    }
}

// function setAddCancelButtons() {
//     let add = document.getElementById("add-dish");
//     //let cancel = document.getElementById("cancel-dish");
//     add.onclick = function() {
//         //add to order
//         displayChoice("none");
//     };
// }

document.addEventListener("click", dishByMousePos);
const shekel = "\u20AA";
let info=[];
getDishes();
//setAddCancelButtons();
window.onresize = reportWindowSize;
reportWindowSize();

