document.addEventListener("DOMContentLoaded", function () {
    initializeAppWithResetCheck();
});
firebase.auth().signInWithEmailAndPassword(email, password)
  .then(userCredential => {
    const user = userCredential.user;
    console.log("เข้าสู่ระบบสำเร็จ:", user.email);
    // ดึงข้อมูล user.uid เพื่อเช็กหรือบันทึกเลขสุ่ม
  })
  .catch(error => {
    alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
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

let availableNumbers = ['0129', '0248', '0208', '0339', '0679', '0910', '0832', '0745', '0074', '0896', '0011', '0012', '0013', '0014', '0015', '0016', '0564', '0578', '0989', '1290', '3321', '4365', '1123', '3456', '3214', '1423', '9876', '0869', '1222', '3457'];

function initializeAppWithResetCheck() {
    const resetVersionRef = database.ref('resetVersion');

    resetVersionRef.on('value', (snapshot) => {
        const currentVersion = snapshot.val() || "0";
        const localVersion = localStorage.getItem("resetVersion");

        if (localVersion !== String(currentVersion)) {
            // ⚠️ reset localStorage ทันทีเมื่อ resetVersion เปลี่ยน
            localStorage.removeItem("generatedNumber");
            localStorage.setItem("resetVersion", String(currentVersion));

            // รีโหลดหน้า (optional) หรือรีเซ็ต UI
            location.reload(); // ← reload เพื่อให้หน้าเว็บ sync กับ reset
        }
    });

    checkIfAlreadyGenerated(); // ตรวจสอบว่าปุ่มควรปิดไหม
}


// ✅ ตรวจสอบการเข้าสู่ระบบแอดมิน
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

// ✅ แสดงเลขเดิมที่สุ่มไว้ และปิดปุ่ม
function checkIfAlreadyGenerated() {
    const storedNumber = localStorage.getItem("generatedNumber");

    if (storedNumber) {
        document.getElementById('randomNumberResult').innerHTML =
  'ไอดีทดสอบของคุณคือ : <span style="color: green;">' + storedNumber + '</span>';
        const genBtn = document.getElementById('generateButton');
        if (genBtn) {
            genBtn.disabled = true;
            genBtn.classList.add('disabled');
        }
    }
}

// ✅ ฟังก์ชันสุ่มตัวเลข (ตรวจ resetVersion และจำเลขไว้)
function generateRandomNumber() {
    const usedNumbersRef = database.ref('usedNumbers');
    const resetVersionRef = database.ref('resetVersion');

    if (localStorage.getItem("generatedNumber")) {
        checkIfAlreadyGenerated();
        return;
    }

    Promise.all([usedNumbersRef.once('value'), resetVersionRef.once('value')]).then(([usedSnap, resetSnap]) => {
        const usedNumbers = usedSnap.val() || [];
        const resetVersion = resetSnap.val() || 0;

        if (availableNumbers.length === 0) {
            document.getElementById('randomNumberResult').innerText = 'ไม่มีตัวเลขให้สุ่มแล้ว';
            return;
        }

        let randomNumber, randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * availableNumbers.length);
            randomNumber = availableNumbers[randomIndex];
        } while (usedNumbers.includes(randomNumber));

document.getElementById('randomNumberResult').innerHTML =
  'ไอดีทดสอบของคุณคือ : <span style="color: green;">' + randomNumber + '</span>';


        // 👉 บันทึกไว้ใน localStorage พร้อม resetVersion
        localStorage.setItem("generatedNumber", randomNumber);
        localStorage.setItem("resetVersion", String(resetVersion));

        usedNumbers.push(randomNumber);
        usedNumbersRef.set(usedNumbers);
        availableNumbers.splice(randomIndex, 1);

        const genBtn = document.getElementById('generateButton');
        genBtn.disabled = true;
        genBtn.classList.add('disabled');
    });
}

// ✅ ฟังก์ชันรีเซ็ต (admin ใช้งานเท่านั้น)
function resetGame() {
    availableNumbers = ['0129', '0248', '0208', '0339', '0679', '0910', '0832', '0745', '0074', '0896', '0011', '0012', '0013', '0014', '0015', '0016', '0564', '0578', '0989', '1290', '3321', '4365', '1123', '3456', '3214', '1423', '9876', '0869', '1222', '3457'];

    // 🔄 ล้าง usedNumbers + ตั้ง resetVersion ใหม่ (timestamp)
    const usedNumbersRef = database.ref('usedNumbers');
    usedNumbersRef.set([]);

    const newResetVersion = Date.now();
    database.ref('resetVersion').set(newResetVersion);

    // 🔄 ล้าง localStorage เครื่อง admin เองด้วย
    document.getElementById('generateButton').disabled = false;
    document.getElementById('generateButton').classList.remove('disabled');
    document.getElementById('randomNumberResult').innerHTML = '';

    localStorage.removeItem("generatedNumber");
    localStorage.setItem("resetVersion", String(newResetVersion));
}
