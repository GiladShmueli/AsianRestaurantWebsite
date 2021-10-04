

document.getElementById("accept-btn").onclick = () => {
    let name = document.getElementById("username").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let home = document.getElementById("home");

    let success = true;
    if (isEmptyOrSpaces(name)){
        document.getElementById("name-error").style.display = "block";
        success = false;
    }
    if(!isPhoneValid(phone)){
        document.getElementById("phone-error").style.display = "block";
        success = false;
    }
    if (isEmptyOrSpaces(address) && home.checked){
        document.getElementById("address-error").style.display = "block";
        success = false;
    }
    if(!success)
        return;
    let order = JSON.parse(sessionStorage.getItem("dishes"));
    let now = firebase.firestore.Timestamp.fromDate(new Date());
    sessionStorage.clear();
    db.collection("orders").add({
        name: name,
        phone: phone,
        address: home.checked ? address : "איסוף מהסניף",
        dishes: order,
        time: now
    }).then(() => {
        alert("ההזמנה בדרך אליכם! בתיאבון! 😄");
        window.location.href = '/';
    })
}

document.getElementById("decline-btn").onclick = () => {
    window.location.href = '/';
}

function reportWindowSize() {
    let radios = document.getElementById("radios-row");
    let bg = document.getElementById("bg");
    
    if(window.innerWidth <= 1000) {
        radios.style = "width: 150px";
        bg.style.bottom = "10%";
    }
    else {
        radios.style = "width: initial";
        bg.style.bottom = "20%";
    }
}


window.onresize = reportWindowSize;
reportWindowSize();