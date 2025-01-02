import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBE1hcyxaid32knHNd2g-afswq-SOIVmkE",
  authDomain: "file-upload-86b99.firebaseapp.com",
  projectId: "file-upload-86b99",
  storageBucket: "file-upload-86b99.firebasestorage.app",
  messagingSenderId: "25412718592",
  appId: "1:25412718592:web:d562b9d3af9a51b4a8c8e5"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
