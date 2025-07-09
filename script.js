// อาเรย์ของตัวเลขที่เราตั้งค่าไว้ล่วงหน้า
let availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999']; // ตัวเลขที่ตั้งค่าไว้

// ฟังก์ชันตรวจสอบ ID ผู้ดูแล
function checkLogin() {
    const correctID = "admin123"; // กำหนด ID ที่ถูกต้อง
    const enteredID = document.getElementById('idInput').value;

    // ตรวจสอบ ID ที่กรอก
    if (enteredID === correctID) {
        // ซ่อนฟอร์มกรอก ID และแสดงข้อความ "เข้าสู่ระบบสำเร็จ"
        document.getElementById('idInput').style.display = 'none'; // ซ่อนช่องกรอกรหัส
        document.getElementById('idInput').placeholder = "เข้าสู่ระบบสำเร็จ"; // เปลี่ยนข้อความในช่องกรอก

        // แสดงปุ่มสุ่มตัวเลขและการควบคุมสำหรับผู้ดูแล
        document.getElementById('generateButton').disabled = false; // เปิดปุ่มสุ่ม
        document.getElementById('resetButton').disabled = false; // เปิดปุ่มรีเซ็ต
    } else {
        alert('ID ไม่ถูกต้อง');
    }
}

// ฟังก์ชันสุ่มตัวเลข
function generateRandomNumber() {
    // ตรวจสอบว่าเคยสุ่มไอดีแล้วหรือยัง
    const usedNumbers = JSON.parse(localStorage.getItem('usedNumbers')) || [];

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
    document.getElementById('randomNumberResult').innerText = 'ตัวเลขที่สุ่มได้: ' + randomNumber;

    // เพิ่มไอดีที่สุ่มแล้วลงใน usedNumbers
    usedNumbers.push(randomNumber);

    // บันทึกข้อมูล usedNumbers ใน localStorage
    localStorage.setItem('usedNumbers', JSON.stringify(usedNumbers));

    // ลบตัวเลขที่สุ่มแล้วออกจากอาเรย์
    availableNumbers.splice(randomIndex, 1);

    // ปิดปุ่มสุ่มตัวเลข
    document.getElementById('generateButton').disabled = true;
    document.getElementById('generateButton').classList.add('disabled'); // เพิ่มคลาส disabled เพื่อให้ปุ่มดูเหมือนถูกปิด
}

// ฟังก์ชันรีเซ็ตการใช้งาน
function resetGame() {
    // คืนค่าอาเรย์ตัวเลขที่ใช้ได้ใหม่
    availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999'];

    // ล้างข้อมูล usedNumbers ใน localStorage
    localStorage.removeItem('usedNumbers');

    // เปิดปุ่มสุ่มตัวเลขและปิดปุ่มรีเซ็ต
    document.getElementById('generateButton').disabled = false;
    document.getElementById('generateButton').classList.remove('disabled'); // เปิดปุ่มสุ่ม
    document.getElementById('randomNumberResult').innerText = ''; // ล้างผลลัพธ์ที่แสดง
}
