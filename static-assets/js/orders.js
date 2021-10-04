function getOrders(details) {
    db.collection("orders").get().then(snapshot => {
        if(details.option == "manager") {
            info = [];
            debug = snapshot;
            snapshot.docs.forEach(doc => {
                if(doc.id != "0000000000") {
                    info.unshift({
                        id: doc.id,
                        name: doc.data().name,
                        phone: doc.data().phone,
                        address: doc.data().address,
                        dishes: doc.data().dishes,
                        time: doc.data().time
                    })
                }
            })
        } else {//permission.option == "client"
            snapshot.docs.forEach(doc => {
                info = [];
                details.phone = details.phone.replace('-', '');
                if( doc.id != "0000000000") {
                    if(comparePhone(doc.data().phone, details.phone)) {
                        info.unshift({
                            id: doc.id,
                            name: doc.data().name,
                            phone: doc.data().phone,
                            address: doc.data().address,
                            dishes: doc.data().dishes,
                            time: doc.data().time.toDate()
                        })
                    }
                }
            })
        }

    }).then( () => {
        renderOrders();
    })
}


function renderOrders() {
    let bg = document.getElementById("bg");
    info.forEach(order => {
        let order_div = document.createElement("div");
        order_div.id = order.id;
        order_div.className = "order-div";
        let dishes = document.createElement("div");
        let sump = document.createElement("p");
        let client_div = renderClient(order);
        order_div.appendChild(client_div);
        console.log(order.id);
        dishes = renderDishes(order.dishes, order.id);
        order_div.appendChild(dishes.details);
        let sum_row = document.createElement("div");
        sum_row.className = "d-flex justify-content-center";
        sump.innerText = "סכום: " + dishes.sum + shekel;
        sum_row.appendChild(sump);
        order_div.appendChild(sum_row);
        bg.appendChild(order_div);
    });
}

function renderClient(order) {
    let client_container = document.createElement("div");
    client_container.className = "row flex-wrap justify-content-center";
    let client_div = document.createElement("div");
    let left = document.createElement("div");
    insertDeleteOrderButton(left);
    left.className = "col-4";
    let right = document.createElement("div");
    right.className = "col-4";
    client_div.className = "client-div col-4";

    let namep = document.createElement("p");
    let phonep = document.createElement("p");
    let addressp = document.createElement("p");
    let timep = document.createElement("p");
    namep.innerText = "שם: " + order.name;
    phonep.innerText = "טלפון: " + order.phone;
    addressp.innerText = "כתובת: " + order.address;
    timep.innerText = "שעת ביצוע הזמנה: " + convertTime(order.time);

    client_div.appendChild(namep);
    client_div.appendChild(phonep);
    client_div.appendChild(addressp);
    client_div.appendChild(timep);

    client_container.appendChild(right);
    client_container.appendChild(client_div);
    client_container.appendChild(left);
    return client_container;
}

function renderDishes(order_array, order_id) {
    let sum = 0;
    let details = document.createElement("div");
    let index = 0;
    order_array.forEach(element => {
        let row = document.createElement("div");
        row.id = index;
        row.className = "row flex-wrap justify-content-center";
        row.style.color = "whitesmoke";
        let name = document.createElement("p");
        name.className = "col-3";
        let category = document.createElement("p");
        category.className = "col-3";
        let price = document.createElement("p");
        price.className = "col-3";
        name.innerText = element.name;
        category.innerText = element.category!=null? element.category: "";
        price.innerText = element.price + shekel;
        sum += element.price;
        row.appendChild(setDeleteDish(order_id, index, order_array)); //124
        index++;
        row.appendChild(name);
        row.appendChild(category);
        row.appendChild(price);
        details.appendChild(row);
    });
    return {details: details, sum: sum};
}

function setDeleteDish(order_id, dish_id, order_array){
    let button = document.createElement("a");
    button.className = "col-1";
    button.style.color = "whitesmoke";
    button.style.backgroundColor = "black";
    button.innerText = 'X';
    button.onclick = () => {
        console.log(order_id);
        order_array.splice(dish_id, 1);
        if(order_array.length > 0)
        {
            db.collection("orders").doc(order_id).update( 
            {
                dishes: order_array
            });
        } else {
            db.collection("orders").doc(order_id).delete();
        }
        bg.innerHTML = "";
        getOrders(details);
    }
    return button;
}

function insertDeleteOrderButton(container) {
    container.style.textAlign = "left";
    let button = document.createElement("a");
    button.style.color = "whitesmoke";
    button.style.backgroundColor = "black";
    button.innerText = 'X';
    button.onclick = () => {
        //get parent id
        let id = container.parentElement.parentElement.id;
        console.log(id);
        db.collection("orders").doc(id).delete().then( () =>
        {
            let bg = document.getElementById("bg");
            bg.innerHTML = "";
            getOrders(details);
        })
    }
    container.appendChild(button);
}

function convertTime(timestamp){
    console.log(timestamp);
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(timestamp * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = date.getMinutes();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear(); //bugged for unknown reason
    if(minutes.length < 2)
        minutes = "0" + minutes;
        console.log(year);
    return hours + ":" + minutes;
    // + " " + day + "/" + month + "/" + year;
}


let details = JSON.parse(sessionStorage.getItem("details"));
sessionStorage.clear();
let info = [];
let debug;
getOrders(details);
const shekel = "\u20AA";