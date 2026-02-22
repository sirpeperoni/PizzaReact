const admin = require("firebase-admin");
const serviceAccount = require("./pizza-d94f0-firebase-adminsdk-fbsvc-9e4337165c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pizza-d94f0.firebaseio.com/"
});

const uid = "4uED3bVjLwTAizhTgh7nnS4spIW2"; 

admin.auth().setCustomUserClaims(uid, { role: "admin" })
.then(() => {
  console.log(`Роль admin добавлена пользователю ${uid}`);
})
.catch(error => {
  console.error("Ошибка:", error);
});