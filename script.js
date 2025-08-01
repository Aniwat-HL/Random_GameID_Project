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
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // ✅ กำหนด availableNumbers ในระดับ global
const availableNumbers = [
  '2427', '7504', '8382', '5215', '5793', '3125', '5329', '2866', '1202', '8452',
  '4927', '7398', '6330', '8345', '7410', '9381', '2435', '8129', '6912', '5653',
  '8174', '3250', '5026', '3074', '1624', '8729', '6942', '2317', '3583', '5824',
  '9246', '4329', '1390', '6105', '1132', '7570', '1284', '2256', '5154', '7910',
  '8579', '3490', '5918', '6359', '9275', '4082', '7168', '2985', '5431', '6408',
'3731'
];

/*  '3731', '5084', '3852', '2957', '6814', '1073', '1762', '7351', '4920', '5467',
  '3518', '6953', '6024', '4210', '3498', '1704', '5302', '9173', '5860', '8235',
  '6945', '8381', '9460', '5364', '7243', '6147', '5312', '3497', '8049', '6480',
  '2387', '5691', '2713', '9587', '2719', '3461', '1938', '3082', '5435', '6353',
  '4517', '4938', '6310', '1942', '8184', '3075', '5319', '2498', '1728', '2167',
  '4501', '6907', '4356', '9283', '7136', '3067', '5938', '4853', '3715', '3947',
  '2410', '7159', '2673', '4101', '6349', '2159', '4837', '6274', '1850', '9203'*/
  // เมื่อผู้ใช้ทำการล็อกอิน
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // ตรวจสอบว่าผู้ใช้เคยล็อกอินครั้งแรกหรือไม่
      const userRef = database.ref("users/" + user.uid);
      userRef.once("value").then(snapshot => {
        if (!snapshot.exists()) {
          // ถ้าผู้ใช้ยังไม่เคยล็อกอินมาก่อน ให้บันทึกเวลาล็อกอินครั้งแรกในเวลาของประเทศไทย
          const currentTime = new Date();
          const thailandTime = currentTime.toLocaleString("en-GB", { timeZone: "Asia/Bangkok" }); // เวลาของประเทศไทย
          
          userRef.set({
            firstLoginTime: thailandTime
          }).then(() => {
            console.log("First login time saved to Firebase in Thailand time.");
          }).catch(err => {
            console.error("Error saving first login time: ", err.message);
          });
        }
      });

      // แสดง userHeader และข้อมูลอีเมลของผู้ใช้
      document.getElementById("userHeader").style.display = "flex";
      document.getElementById("userEmail").innerText = user.email;

      // ซ่อนหน้าเข้าสู่ระบบและแสดงหน้าสุ่ม
      document.querySelector(".login-form").style.display = "none";
      document.querySelector(".generate-form").style.display = "block";

      // เริ่มต้นการใช้งานแอป
      initializeApp(user);
    } else {
      // ถ้าไม่ได้ล็อกอิน, แสดงหน้าเข้าสู่ระบบ
      document.querySelector(".login-form").style.display = "block";
      document.querySelector(".generate-form").style.display = "none";
    }
  });

  // ฟังก์ชันล็อกอินด้วย Google
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

  // ฟังก์ชัน Logout
  window.logout = function () {
    firebase.auth().signOut().then(() => {
      location.reload(); // รีโหลดหน้าเพื่อให้แสดงผลหลังจาก Logout
    });
  };

  // เริ่มใช้งานแอป
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

  // ตรวจสอบว่าเคยสุ่มไปแล้ว
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

  // ฟังก์ชันสุ่มเลข
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

  // แสดงผลสุ่ม
  function showResult(num) {
    document.getElementById("randomNumberResult").innerHTML =
      'ไอดีทดสอบของคุณคือ : <span style="color: green;">' + num + '</span>';
  }

  // ปิดปุ่มสุ่ม
  function disableGenerate() {
    const btn = document.getElementById("generateButton");
    btn.disabled = true;
    btn.classList.add("disabled");
  }

  // ฟังก์ชันรีเซ็ต
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
