document.addEventListener("DOMContentLoaded", function () {
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

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      document.querySelector(".left").style.display = "none";
      document.querySelector(".right").style.display = "block";
      initializeApp(user);
    }
  });

  window.googleLogin = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .catch(error => alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message));
  };

  window.logout = function () {
    firebase.auth().signOut().then(() => location.reload());
  };

  function initializeApp(user) {
    const resetVersionRef = database.ref('resetVersion');
    resetVersionRef.on('value', snapshot => {
      const currentVersion = snapshot.val() || "0";
      checkIfAlreadyGenerated(user.uid, currentVersion);

      if (user.email === "aniwat.hl.b@gmail.com") {
        document.getElementById('resetButton').disabled = false;
      }
    });
  }

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

  function showResult(number) {
    document.getElementById('randomNumberResult').innerHTML =
      'ไอดีทดสอบของคุณคือ : <span style="color: green;">' + number + '</span>';
  }

  function disableGenerateButton() {
    const btn = document.getElementById("generateButton");
    btn.disabled = true;
    btn.classList.add("disabled");
  }

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
