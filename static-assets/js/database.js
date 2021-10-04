// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1Jb5YEzpsZNSKknk4ICHUqGFRQydojAo",
  authDomain: "asian-restaurant.firebaseapp.com",
  projectId: "asian-restaurant",
  storageBucket: "asian-restaurant.appspot.com",
  messagingSenderId: "1009981587635",
  appId: "1:1009981587635:web:a26b3ff93b0d823cf430c6",
  measurementId: "G-FS29W3PLN8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
              firebase.analytics();
              const db = firebase.firestore();
            db.settings({timesnapsInSnapshots: true});

function encrypt(message, key) {
    var ciphertext = CryptoJS.AES.encrypt(message, key);
    return ciphertext.toString();
}

function decrypt(message, key) {
    var bytes = CryptoJS.AES.decrypt(message, key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}


//to insert or update a manager.
//to insert a manager you must fill the key given by the owners.
function upsertManager(name, email, pw) {
      let key = encrypt("telhai", "hgsushibar");
      email = email.toLowerCase();
      if(!checkEmail(email)) {
        alert("כתובת מייל לא תקינה");
      }
      db.collection("managers").where("name", "==", name).where("email", "==", email)
      .get()
      .then(querySnapshot => {
        if(querySnapshot.docs.length == 0) {
          throw new exception();
        }
        let check = prompt("Insert the right key to change password properly:");
        if(check == decrypt(key, "hgsushibar")) {
          querySnapshot.docs.forEach( res => {
            console.log("res" + res);
            debug = res;
              db.collection("managers").doc(res.id).update({
                password: encrypt(pw.toString(), res.id)
              });
          });
          alert("You've successfully updated your password!");
        } else {
          alert("You don't have the right key.");
        }
      })
      .catch(() => {
        let check = prompt("You're unauthorized.\n Insert the right key to sign up properly:");
        if(check == decrypt(key, "hgsushibar")) {
          db.collection("managers").add({
            name: name,
            email: email,
            password: encrypt(pw.toString(), key)
          });
          alert("You've successfully signed up!\n However, it is recommended for you to update your password");
        } else {
          alert("You don't have the right key.");
        }
    });
}

function checkEmail() {
  const email = $('#email');
  const email_error = $('#email-error');
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email.val()).toLowerCase()) ) {
      email_error.show();
      return false;
  }
  email_error.hide();
  return true;  
}

function isEmptyOrSpaces(str){
  return str == null || str.match(/^ *$/) != null;
}

function isPhoneValid(str) {
  return str.match(/^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
}

function comparePhone(requestPhone, clientPhone) {
  clientPhone = clientPhone.replace('-','');
  requestPhone = requestPhone.replace('-','');
  return requestPhone === clientPhone;
}