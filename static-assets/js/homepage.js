function getDishes() {
    db.collection("dishes").get().then(snapshot => {
        info = [];
        snapshot.docs.forEach(doc => {

            info.unshift({
                name: doc.data().name,
                id: doc.id,
                price: doc.data().price,
                type: doc.data().type
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
        menudiv.setAttribute("class", "row");
        let namep = document.createElement("p");
        namep.className = "col-8";
        namep.innerText = element.name;
        let pricep = document.createElement("p");
        pricep.className = "col-2";
        let marg = document.createElement("div");
        marg.className = "col-1";
        pricep.innerText = element.price + shekel;
        menudiv.appendChild(marg);
        menudiv.appendChild(namep);
        menudiv.appendChild(pricep);
        if(element.type=="dish")
            dishes.appendChild(menudiv);
        else
            drinks.appendChild(menudiv);            
    });
}

// function addDish(name, price, type) {
//     db.collection("dishes").add({
//         "name": name,
//         "price": price,
//         "type": type
//     })
//     return `name {name} price {price} type {type}`
// }




function reportWindowSize() {
    const menu = document.querySelector("#menu");
    const dishes = document.querySelector("#dishes");
    const drinks = document.querySelector("#drinks");
    const navs = document.querySelectorAll("a");
    const header = document.querySelector("#header-div");
    if(window.innerWidth <= 500) {
        menu.classList.add("menu-shrinked");
        menu.classList.remove("menu-expanded");
        menu.classList.remove("menu-middled");
        dishes.classList = "menu-column col-12";
        drinks.classList = "menu-column col-12";
        header.className = "header-right";
        navs.forEach( element => {
            element.classList.add("nav-side");
            element.classList.remove("nav-top");
        })
    } else if (window.innerWidth <=970) {
        menu.classList.add("menu-middled");
        menu.classList.remove("menu-shrinked");
        menu.classList.remove("menu-shrinked");
        dishes.classList = "menu-column col-m";
        drinks.classList = "menu-column col-m";
        header.className = "header-top";
        navs.forEach( element => {
            element.classList.add("nav-top");
            element.classList.remove("nav-side");
        })
    }
    else {
        menu.classList.add("menu-expanded");
        menu.classList.remove("menu-shrinked");
        menu.classList.remove("menu-middled");
        dishes.classList = "menu-column col-m";
        drinks.classList = "menu-column col-m";
        header.className = "header-top";
        navs.forEach( element => {
            element.classList.add("nav-top");
            element.classList.remove("nav-side");
        })
    }
}

document.getElementById("close-popup").onclick = function() {
    let popup = document.getElementById("popup-div");
    popup.style.display = "none";
    signin.option = null;
}

document.getElementById('order').onclick = function() {
    window.location.href = '/order/';
}

let signin = {option: null};


document.getElementById("details").onclick = function() {
    //TODO: ask for phone
    let popup = document.getElementById("popup-div");
    let manager = document.getElementById("manager-form");
    let order = document.getElementById("order-form");
    popup.style.display = "inline";
    order.style.display = "inline-grid";
    manager.style.display = "none";
    signin.option = "client";
}

document.getElementById("manager").onclick = function() {
    //TODO: ask for manager
    let popup = document.getElementById("popup-div");
    let manager = document.getElementById("manager-form");
    let order = document.getElementById("order-form");
    popup.style.display = "inline";
    manager.style.display = "inline-grid";
    order.style.display = "none";
    signin.option = "manager";
}

document.getElementById("submit").onclick = function() {
    let success = false;
    switch(signin.option){
        case "client":
            let phone = document.getElementById("phone-order").value;
            if(!isPhoneValid(phone)){
                alert("מס' הטלפון אינו תקין");
            } else {
                clientPhoneInDB(phone);
            }
            break;
        case "manager":
            let email = document.getElementById("manager-email").value;
            let pw = document.getElementById("manager-pw").value;
            managerInDB(email, pw);
    }
}

function clientPhoneInDB(phone) {
    let success = false;
    db.collection("orders").get().then( snapshot => {
        snapshot.docs.forEach(doc => {
            if(doc.id != "0000000000") {
                if (comparePhone(doc.data().phone, phone.replace('-', '')))
                {
                    signin.phone = phone;
                    sessionStorage.setItem("details", JSON.stringify(signin));
                    success = true;
                    window.location.href = "/view-orders/";
                }
            }
        });
        if (!success)
            alert("מס' הטלפון אינו משוייך לאף הזמנה");
    })
}

function managerInDB(email, pw) {
    let query = db.collection("managers").where("email","==", email);
    let manager = null;
    let password;
    debug = query;
    query.get().then(snapshot => 
        {
            snapshot.forEach( res => {
            password = res.data().password;
                if(pw == decrypt(password, res.id) || pw == decrypt(password, "telhai") ) {
                    manager = res;
                }
            });
        }).then( () => {
            sessionStorage.setItem("details", JSON.stringify(signin));
            if(manager != null)
                window.location.href = "/view-orders/";
            else {
                alert("פרטי התחברות כמנהל שגויים");
            }
        });
}

let debug;
//main (run instantly)
const shekel = "\u20AA";
let info = [];
getDishes();
reportWindowSize();
window.onresize = reportWindowSize;

