// อาเรย์ของตัวเลขที่เราตั้งค่าไว้ล่วงหน้า
let availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999']; // ตัวเลขที่ตั้งค่าไว้

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
