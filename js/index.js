var database;
var firebase;
var loggedUser;
window.onload=function () {
    var firebaseConfig={
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
        if(user){

        }else{
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        }
        loggedUser=user;
        console.log(user);
        console.log(user.email);
        console.log(user.uid);
        document.getElementById('loginUser').innerText=user.displayName[0].toUpperCase();

        database = firebase.database();
        showNotes();
    }
    firebase.auth().onAuthStateChanged(newLoginHappened);
}

document.getElementById('loginUser').addEventListener('click',function () {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
});

let addButton = document.getElementById('addButton');

addButton.addEventListener('click', function () {
    console.log(loggedUser);
    let addText = document.getElementById('addText');
    let noteTitle=document.getElementById('title');
    
    firebase.database().ref('Notes/' + loggedUser.uid).update({
        [noteTitle.value] : addText.value,
      });
    addText.value = "";
    showNotes();
});

function showNotes() {
    var str=``;
    firebase.database().ref('Notes/' + loggedUser.uid).once('value',function (snapshot) {
        snapshot.forEach(function (child) {
            console.log(child.key+" : "+child.val());
            str +=
            `<div class="noteCard card my-2 mx-2" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${child.key}</h5>
                    <p class="card-text">${child.val()}</p>
                    <button class="btn btn-primary" onclick="deleteNote('${child.key}')">Delete Note</button>
                </div>
            </div>`
        });
        console.log("str"+str);
        if(str==``){
            document.getElementById('notes').innerHTML=`Nothing to show ! Use "Add a Note" section above to add notes.`;
        }else{
            document.getElementById('notes').innerHTML=str;
        }
    });
}

function deleteNote(titleKey) {
    var query=firebase.database().ref('/Notes/'+loggedUser.uid+'/').child(titleKey);
    console.log(query);
    query.remove();
    showNotes();
}

let serach=document.getElementById('search');
serach.addEventListener('input',function() {
    let noteCards=document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function(element){
        let cardText=element.getElementsByTagName("p")[0].innerText;
        if(cardText.includes(serach.value.toLowerCase())){
            element.style.display="block";
        }else{
            element.style.display="none";
        }
    });
});

