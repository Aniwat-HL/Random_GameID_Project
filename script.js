const firebaseConfig = {
  apiKey: "AIzaSyAQO9rmSTXCLLTS35RKqoB3WfBG_y0-b7Q",
  authDomain: "gamerandomid-90c54.firebaseapp.com",
  databaseURL: "https://gamerandomid-90c54-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gamerandomid-90c54",
  storageBucket: "gamerandomid-90c54.firebasestorage.app",
  messagingSenderId: "391713152656",
  appId: "1:391713152656:web:da4d659a3700ca6c814215",
  measurementId: "G-Q75WSFLQBC"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let availableNumbers = [
  '0129', '0248', '0208', '0339', '0679', '0910', '0832',
  '0745', '0074', '0896', '0011', '0012', '0013', '0014',
  '0015', '0016', '0564', '0578', '0989', '1290', '3321',
  '4365', '1123', '3456', '3214', '1423', '9876', '0869',
  '1222', '3457'
];

// 🔐 เช็คสถานะผู้ใช้
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    initializeApp(user);
  }
});

// 🔑 Login
function login() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      // Success
    })
    .catch(error => {
      alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
    });
}

function initializeApp(user) {
  const resetVersionRef = database.ref('resetVersion');
  resetVersionRef.on('value', snapshot => {
    const currentVersion = snapshot.val() || "0";
    checkIfAlreadyGenerated(user.uid, currentVersion);

    // ถ้า email เป็น admin
    if (user.email === "boonkongmag_00@hotmail.com") {
      document.getElementById('resetButton').disabled = false;
    }
  });
}

function checkIfAlreadyGenerated(uid, version) {
  const userRef = database.ref("userNumbers/" + uid);
  userRef.once("value").then(snapshot => {
    const data = snapshot.val();
    if (data && data.version === version) {
      showResult(data.number);
      disableGenerateButton();
    }
  });
}

function generateRandomNumber() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const uid = user.uid;
  const userRef = database.ref("userNumbers/" + uid);
  const usedNumbersRef = database.ref("usedNumbers");
  const resetVersionRef = database.ref("resetVersion");

  userRef.once('value').then(snapshot => {
    if (snapshot.exists()) {
      alert("คุณเคยสุ่มไปแล้ว");
      return;
    }

    Promise.all([
      usedNumbersRef.once('value'),
      resetVersionRef.once('value')
    ]).then(([usedSnap, resetSnap]) => {
      const usedNumbers = usedSnap.val() || [];
      const resetVersion = resetSnap.val() || 0;

      if (availableNumbers.length ===
