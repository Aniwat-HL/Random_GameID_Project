document.addEventListener("DOMContentLoaded", function () {
  // ✅ ตั้งค่า Firebase
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

  // ✅ เมื่อผู้ใช้ login สำเร็จ
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      initializeApp(user);
    }
  });

  // 🔐 ฟังก์ชัน login
  window.login = function () {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        // Success — onAuthStateChanged จะทำงานต่อ
      })
      .catch(error => {
        alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
      });
  };

  // ✅ เช็คและโหลดข้อมูลหลัง login
  function initializeApp(user) {
    const resetVersionRef = database.ref('resetVersion');
    resetVersionRef.on('value', snapshot => {
      const currentVersion = snapshot.val() || "0";
      checkIfAlreadyGenerated(user.uid, currentVersion);

      // ✅ ปลดล็อกปุ่ม reset ถ้าเป็น admin
      if (user.email === "boonkongmag_00@hotmail.com") {
        document.getElementById('resetButton').disabled = false;
      }
    });
  }

  // ✅ ตรวจสอบว่าผู้ใช้คนนี้เคยสุ่มแล้วหรือยัง
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

  // ✅ กดปุ่มเพื่อสุ่มเลข
  window.generateRandomNumber = function () {
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

        if (availableNumbers.length === 0) {
          document.getElementById('randomNumberResult').innerText = 'ไม่มีตัวเลขให้สุ่มแล้ว';
          return;
        }

        let randomNumber, randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * availableNumbers.length);
          randomNumber = availableNumbers[randomIndex];
        } while (usedNumbers.includes(randomNumber));

        usedNumbers.push(randomNumber);
        usedNumbersRef.set(usedNumbers);
        userRef.set({ number: randomNumber, version: resetVersion });

        showResult(randomNumber);
        disableGenerateButton();
      });
    });
  };

  // ✅ แสดงผลลัพธ์
  function showResult(number) {
    document.getElementById('randomNumberResult').innerHTML =
      'ไอดีทดสอบของคุณคือ : <span style="color: green;">' + number + '</span>';
  }

  // ✅ ปิดปุ่มสุ่ม
  function disableGenerateButton() {
    const btn = document.getElementById("generateButton");
    btn.disabled = true;
    btn.classList.add("disabled");
  }

  // 🔁 สำหรับ admin: reset ระบบ
  window.resetGame = function () {
    const user = firebase.auth().currentUser;
    if (!user || user.email !== "boonkongmag_00@hotmail.com") {
      alert("คุณไม่มีสิทธิ์รีเซ็ต");
      return;
    }

    database.ref("usedNumbers").set([]);
    database.ref("userNumbers").remove();

    const newVersion = Date.now();
    database.ref("resetVersion").set(newVersion);

    document.getElementById("randomNumberResult").innerHTML = '';
    const genBtn = document.getElementById("generateButton");
    genBtn.disabled = false;
    genBtn.classList.remove("disabled");
  };
});
