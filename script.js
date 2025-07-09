document.addEventListener("DOMContentLoaded", function () {
    checkIfAlreadyGenerated();
});

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

let availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999'];

function checkLogin() {
    const correctID = "boonkongmag_00@hotmail.com";
    const enteredID = document.getElementById('idInput').value;

    if (enteredID === correctID) {
        document.getElementById('idInput').style.display = 'none';
        document.getElementById('loginMessage').innerHTML = "<h2>เข้าสู่ระบบสำเร็จ</h2>";
        document.getElementById('resetButton').disabled = false;
    } else {
        alert('ID ไม่ถูกต้อง');
    }
}

function checkIfAlreadyGenerated() {
    const storedNumber = localStorage.getItem("generatedNumber");

    if (storedNumber) {
        document.getElementById('randomNumberResult').innerText = 'ไอดีทดสอบที่คุณได้: ' + storedNumber;
        const genBtn = document.getElementById('generateButton');
        if (genBtn) {
            genBtn.disabled = true;
            genBtn.classList.add('disabled');
        }
    }
}

function generateRandomNumber() {
    const usedNumbersRef = database.ref('usedNumbers');

    if (localStorage.getItem("generatedNumber")) {
        checkIfAlreadyGenerated();
        return;
    }

    usedNumbersRef.once('value').then((snapshot) => {
        const usedNumbers = snapshot.val() || [];

        if (availableNumbers.length === 0) {
            document.getElementById('randomNumberResult').innerText = 'ไม่มีตัวเลขให้สุ่มแล้ว';
            return;
        }

        let randomNumber;
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * availableNumbers.length);
            randomNumber = availableNumbers[randomIndex];
        } while (usedNumbers.includes(randomNumber));

        document.getElementById('randomNumberResult').innerText = 'ไอดีทดสอบที่คุณได้: ' + randomNumber;

        localStorage.setItem("generatedNumber", randomNumber);

        usedNumbers.push(randomNumber);
        usedNumbersRef.set(usedNumbers);

        availableNumbers.splice(randomIndex, 1);

        document.getElementById('generateButton').disabled = true;
        document.getElementById('generateButton').classList.add('disabled');
    });
}

function resetGame() {
    availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999'];

    const usedNumbersRef = database.ref('usedNumbers');
    usedNumbersRef.set([]);

    document.getElementById('generateButton').disabled = false;
    document.getElementById('generateButton').classList.remove('disabled');
    document.getElementById('randomNumberResult').innerText = '';

    localStorage.removeItem("generatedNumber");
}
