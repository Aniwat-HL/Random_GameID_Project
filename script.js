document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAQO9rmSTXCLLTS35RKqoB3WfBG_y0-b7Q",
    authDomain: "gamerandomid-90c54.firebaseapp.com",
    databaseURL: "https://gamerandomid-90c54-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gamerandomid-90c54",
    storageBucket: "gamerandomid-90c54.appspot.com",
    messagingSenderId: "391713152656",
    appId: "1:391713152656:web:da4d659a3700ca6c814215"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  const availableNumbers = [
    '0129', '0248', '0208', '0339', '0679', '0910', '0832',
    '0745', '0074', '0896', '0011', '0012', '0013', '0014',
    '0015', '0016', '0564', '0578', '0989', '1290', '3321',
    '4365', '1123', '3456', '3214', '1423', '9876', '0869',
    '1222', '3457'
  ];

  // ✅ ตรวจสอบผู้ใช้ที่ล็อกอิน
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // แสดง userHeader และข้อมูลอีเมลของผู้ใช้
      document.getElementById("userHeader").style.display = "flex";
      document.getElementById("userEmail").innerText = user.email;
      document.querySelector(".left").style.display = "none";
      document.querySelector(".right").style.display = "block";
      initializeApp(user);
    }
  });

  // ✅ ระบบล็อกอินด้วย Google
  window.googleLogin = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log("Login successful", result);
      })
      .catch(err => {
        console.error("เข้าสู่ระบบล้มเหลว:", err.message);
        alert("เข้าสู่ระบบล้มเหลว: " + err.message);
      });
  };

  // ✅ ปุ่ม Logout
  window.logout = function () {
    firebase.auth().signOut().then(() => {
      location.reload(); // รีโหลดหน้าเพื่อให้แสดงผลหลังจาก Logout
    });
  };

  // ✅ เริ่มใช้งานแอป
  function initializeApp(user) {
    const resetVersionRef = database.ref("resetVersion");
    resetVersionRef.on("value", snapshot => {
      const version = snapshot.val() || "0";
      checkIfAlreadyGenerated(user.uid, version);

      // เปิดปุ่มรีเซ็ตเฉพาะแอดมิน
      const adminEmails = ["aniwat.hl.b@gmail.com", "boonkongmag_00@hotmail.com"];
      if (adminEmails.includes(user.email.toLowerCase())) {
        document.getElementById("resetButton").disabled = false;
      }
    });
  }

  // ✅ เช็คว่าเคยสุ่มไปแล้ว
  function checkIfAlreadyGenerated(uid, version) {
    const ref = database.ref("userNumbers/" + uid);
    ref.once("value").then(snapshot => {
      const data = snapshot.val();
      if (data && data.version === version) {
        showResult(data.number);
        disableGenerate();
      }
    });
  }

  // ✅ ฟังก์ชันสุ่มเลข
  window.generateRandomNumber = function () {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const uid = user.uid;
    const userRef = database.ref("userNumbers/" + uid);
    const usedRef = database.ref("usedNumbers");
    const versionRef = database.ref("resetVersion");

    userRef.once("value").then(snapshot => {
      if (snapshot.exists()) {
        alert("คุณสุ่มไปแล้ว");
        return;
      }

      Promise.all([usedRef.once("value"), versionRef.once("value")]).then(([usedSnap, versionSnap]) => {
        const usedNumbers = usedSnap.val() || [];
        const version = versionSnap.val() || 0;

        let randomNumber, index;
        do {
          index = Math.floor(Math.random() * availableNumbers.length);
          randomNumber = availableNumbers[index];
        } while (usedNumbers.includes(randomNumber));

        usedNumbers.push(randomNumber);
        usedRef.set(usedNumbers);
        userRef.set({ number: randomNumber, version });

        showResult(randomNumber);
        disableGenerate();
      });
    });
  };

  // ✅ แสดงผลสุ่ม
  function showResult(num) {
    document.getElementById("randomNumberResult").innerHTML =
      'ไอดีทดสอบของคุณคือ : <span style="color: green;">' + num + '</span>';
  }

  // ✅ ปิดปุ่มสุ่ม
  function disableGenerate() {
    const btn = document.getElementById("generateButton");
    btn.disabled = true;
    btn.classList.add("disabled");
  }

  // ✅ ฟังก์ชันรีเซ็ต
  window.resetGame = function () {
    const user = firebase.auth().currentUser;
    if (!user || !["aniwat.hl.b@gmail.com", "boonkongmag_00@hotmail.com"].includes(user.email.toLowerCase())) {
      alert("คุณไม่มีสิทธิ์รีเซ็ต");
      return;
    }

    database.ref("usedNumbers").set([]);
    database.ref("userNumbers").remove();
    const newVersion = Date.now();
    database.ref("resetVersion").set(newVersion);

    document.getElementById("randomNumberResult").innerHTML = '';
    const btn = document.getElementById("generateButton");
    btn.disabled = false;
    btn.classList.remove("disabled");
  };
});
