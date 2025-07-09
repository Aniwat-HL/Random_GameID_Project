function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 100) + 1; // สุ่มตัวเลขระหว่าง 1 ถึง 100
    document.getElementById('randomNumberResult').innerText = 'ตัวเลขที่สุ่มได้: ' + randomNumber; // แสดงผล
}
