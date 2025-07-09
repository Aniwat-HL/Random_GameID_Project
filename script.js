        // อาเรย์ของตัวเลขที่เราตั้งค่าไว้ล่วงหน้า
        let availableNumbers = ['0001', '0219', '0293', '0345', '0567', '0999']; // ตัวเลขที่ตั้งค่าไว้

        // ฟังก์ชันสุ่มตัวเลข
        function generateRandomNumber() {
            if (availableNumbers.length === 0) {
                document.getElementById('randomNumberResult').innerText = 'ไม่มีตัวเลขให้สุ่มแล้ว';
                return;
            }

            // สุ่มตัวเลขจากอาเรย์
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const randomNumber = availableNumbers[randomIndex];

            // แสดงตัวเลขที่สุ่มได้
            document.getElementById('randomNumberResult').innerText = 'ตัวเลขที่สุ่มได้: ' + randomNumber;

            // ลบตัวเลขที่สุ่มแล้วออกจากอาเรย์
            availableNumbers.splice(randomIndex, 1);

            // ปิดปุ่มสุ่มตัวเลข
            document.getElementById('generateButton').disabled = true;
            document.getElementById('generateButton').classList.add('disabled'); // เพิ่มคลาส disabled เพื่อให้ปุ่มดูเหมือนถูกปิด
        }
