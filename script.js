// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLBpdYKS5YUoMvY6eENWlupnOXUP6qCnE",
  authDomain: "randomgameid-39683.firebaseapp.com",
  projectId: "randomgameid-39683",
  storageBucket: "randomgameid-39683.firebasestorage.app",
  messagingSenderId: "789303941529",
  appId: "1:789303941529:web:2c7b66a38868a914f59b08",
  measurementId: "G-WCQRRXBMGN"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// อาเรย์ของตัวเลขที่เราตั้งค่าไว้ล่วงหน้า
let availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999']; // ตัวเลขที่ตั้งค่าไว้

// ฟังก์ชันตรวจสอบ ID สำหรับ Admin
function checkLogin() {
    const correctID = "boonkongmag_00@hotmail.com"; // กำหนด ID ที่ถูกต้อง
    const enteredID = document.getElementById('idInput').value;

    // ตรวจสอบ ID ที่กรอก
    if (enteredID === correctID) {
        // ซ่อนฟอร์มกรอกรหัส และแสดงข้อความ "เข้าสู่ระบบสำเร็จ"
        document.getElementById('idInput').style.display = 'none'; // ซ่อนช่องกรอกรหัส
        document.getElementById('loginMessage').innerHTML = "<h2>เข้าสู่ระบบสำเร็จ</h2>"; // เปลี่ยนข้อความในช่องกรอก

        // เปิดปุ่มรีเซ็ต
        document.getElementById('resetButton').disabled = false; // เปิดปุ่มรีเซ็ต
    } else {
        alert('ID ไม่ถูกต้อง');
    }
}

// ฟังก์ชันสุ่มตัวเลข
function generateRandomNumber() {
    // ดึงข้อมูลที่ใช้แล้วจาก Firebase
    const usedNumbersRef = ref(database, 'usedNumbers');
    
    get(usedNumbersRef).then((snapshot) => {
        const usedNumbers = snapshot.val() || [];

        // หากไม่มีตัวเลขให้สุ่มแล้ว
        if (availableNumbers.length === 0) {
            document.getElementById('randomNumberResult').innerText = 'ไม่มีตัวเลขให้สุ่มแล้ว';
            return;
        }

        let randomNumber;
        let randomIndex;

        // ตรวจสอบการสุ่มจนกว่าจะเจอไอดีที่ยังไม่ถูกใช้
        do {
            randomIndex = Math.floor(Math.random() * availableNumbers.length);
            randomNumber = availableNumbers[randomIndex];
        } while (usedNumbers.includes(randomNumber)); // ลูปสุ่มใหม่หากไอดีถูกใช้แล้ว

        // แสดงตัวเลขที่สุ่มได้
        document.getElementById('randomNumberResult').innerText = 'ไอดีทดสอบที่คุณได้: ' + randomNumber;

        // เพิ่มไอดีที่สุ่มแล้วลงใน usedNumbers
        usedNumbers.push(randomNumber);

        // บันทึกข้อมูล usedNumbers ใน Firebase
        set(usedNumbersRef, usedNumbers);

        // ลบตัวเลขที่สุ่มแล้วออกจากอาเรย์
        availableNumbers.splice(randomIndex, 1);

        // ปิดปุ่มสุ่มตัวเลข
        document.getElementById('generateButton').disabled = true;
        document.getElementById('generateButton').classList.add('disabled');
    });
}

// ฟังก์ชันรีเซ็ตการใช้งาน
function resetGame() {
    availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999'];

    // ล้างข้อมูล usedNumbers ใน Firebase
    const usedNumbersRef = ref(database, 'usedNumbers');
    set(usedNumbersRef, []);

    // เปิดปุ่มสุ่มตัวเลขและปิดปุ่มรีเซ็ต
    document.getElementById('generateButton').disabled = false;
    document.getElementById('generateButton').classList.remove('disabled');
    document.getElementById('randomNumberResult').innerText = ''; // ล้างผลลัพธ์ที่แสดง
}
