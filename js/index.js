var database;
var firebase;
var loggedUser;
window.onload = function () {
    var firebaseConfig = {
        apiKey: "AIzaSyBXGS5O1_XsWvZKBOJ9UmQgQF_AvkVj8mA",
        authDomain: "note-6946f.firebaseapp.com",
        databaseURL: "https://note-6946f.firebaseio.com",
        projectId: "note-6946f",
        storageBucket: "note-6946f.appspot.com",
        messagingSenderId: "224963616074",
        appId: "1:224963616074:web:72131493c5a23f524075b3",
        measurementId: "G-EB8HKXW76C"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    login();

};

function login() {
    function newLoginHappened(user) {
        if (user) {

        } else {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        }
        loggedUser = user;
        console.log(user);
        console.log(user.email);
        console.log(user.uid);
        document.getElementById('loginUser').innerText = user.displayName[0].toUpperCase();

        database = firebase.database();
        showNotes();
    }
    firebase.auth().onAuthStateChanged(newLoginHappened);
}

document.getElementById('loginUser').addEventListener('click', function () {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
});

let addButton = document.getElementById('addButton');

addButton.addEventListener('click', function () {
    console.log(loggedUser);
    let addText = document.getElementById('addText');
    let noteTitle = document.getElementById('title');

    firebase.database().ref('Notes/' + loggedUser.uid).push().update({
        Title:noteTitle.value,
        Description: addText.value,
        Status:"false"
    });
    addText.value = "";
    noteTitle.value="";
    showNotes();
});

function showNotes() {
    var str = ``;
    var star;

    firebase.database().ref('Notes/' + loggedUser.uid).once('value', function (snapshot) {
        snapshot.forEach(function (child) {
            console.log("child Name"+child.key);
            console.log("Title : " + child.val().Title);
            console.log("Description : " + child.val().Description);
            console.log("Status : " + child.val().Status);

            if(child.val().Status=="false"){
                star=`<svg width="1em" height="1em" viewBox="0 0 16 16" onclick="changeStatus('${child.key}')" class="bi bi-star float-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                    </svg>`;
            }else{
                star=`<svg width="1em" height="1em" viewBox="0 0 16 16" onclick="changeStatus('${child.key}')" class="bi bi-star-fill float-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>`;
            }

            str +=
            `<div class="noteCard card my-2 mx-2" style="width: 18rem;">
                <div class="card-body">
                        <div class="row">
                            <div class="col">
                                <h5 class="card-title">${child.val().Title}</h5>  
                            </div>
                            <div class="col">                          
                               ${star}
                            </div>
                        </div>
                    <p class="card-text">${child.val().Description}</p>
                    <button class="btn btn-primary" onclick="deleteNote('${child.key}')">Delete Note</button>
                </div>
            </div>`
        });
        // console.log("str" + str);
        if (str == ``) {
            document.getElementById('notes').innerHTML = `Nothing to show ! Use "Add a Note" section above to add notes.`;
        } else {
            document.getElementById('notes').innerHTML = str;
        }
    });
}

function deleteNote(keyValue) {
    console.log("inside"+ keyValue);
    var query = firebase.database().ref('/Notes/' + loggedUser.uid + '/').child(keyValue);
    console.log(query);
    query.remove();
    showNotes();
}

function changeStatus(childV) {
    // console.log(childV);
    firebase.database().ref('Notes/' + loggedUser.uid+'/').child(childV).once('value', function (snapshot) {
        // console.log("unique id"+snapshot.key);
        // console.log("Status "+snapshot.val().Status);
        if(snapshot.val().Status=="false"){
            firebase.database().ref('Notes/' + loggedUser.uid+'/').child(childV).update({"Status":"true"});
        }else{
            firebase.database().ref('Notes/' + loggedUser.uid+'/').child(childV).update({"Status":"false"});   
        }
    });
    showNotes();
}

let serach = document.getElementById('search');
serach.addEventListener('input', function () {
    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function (element) {
        let cardText = element.getElementsByTagName("p")[0].innerText;
        if (cardText.includes(serach.value.toLowerCase())) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    });
});


