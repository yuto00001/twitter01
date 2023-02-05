import firebase from "firebase/app";

const signOut = function() {
  firebase.auth().signOut().then(() => {
    alert('ログアウトしました');
  }).catch((error) => {
    console.error('ログアウトエラー: ', error);
  });
}

export {
  signOut,
};
