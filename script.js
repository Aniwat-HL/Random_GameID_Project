window.onload = function () {
    checkIfAlreadyGenerated();
};

// Firebase Configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// อาเรย์ของตัวเลขที่เราตั้งค่าไว้ล่วงหน้า
let availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999'];

// ฟังก์ชันตรวจสอบ ID สำหรับ Admin
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

// ฟังก์ชันตรวจสอบว่ามีการสุ่มไปแล้วหรือยัง
function checkIfAlreadyGenerated() {
    const storedNumber = localStorage.getItem("generatedNumber");

    if (storedNumber) {
        document.getElementById('randomNumberResult').innerText = 'ไอดีทดสอบที่คุณได้: ' + storedNumber;
        document.getElementById('generateButton').disabled = true;
        document.getElementById('generateButton').classList.add('disabled');
    }
}

// ฟังก์ชันสุ่มตัวเลข
function generateRandomNumber() {
    const usedNumbersRef = database.ref('usedNumbers');

    // ถ้าเครื่องนี้สุ่มไปแล้ว
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

        // บันทึกลง localStorage
        localStorage.setItem("alreadyGenerated", "true");
        localStorage.setItem("generatedNumber", randomNumber);

        usedNumbers.push(randomNumber);
        usedNumbersRef.set(usedNumbers);

        availableNumbers.splice(randomIndex, 1);

        document.getElementById('generateButton').disabled = true;
        document.getElementById('generateButton').classList.add('disabled');
    });
}

// ฟังก์ชันรีเซ็ตการใช้งาน
function resetGame() {
    availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999'];

    const usedNumbersRef = database.ref('usedNumbers');
    usedNumbersRef.set([]);

    document.getElementById('generateButton').disabled = false;
    document.getElementById('generateButton').classList.remove('disabled');
    document.getElementById('randomNumberResult').innerText = '';

    // เคลียร์ localStorage
    localStorage.removeItem("alreadyGenerated");
    localStorage.removeItem("generatedNumber");
}
