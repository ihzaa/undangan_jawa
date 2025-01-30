// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getFirestore,
    getDoc, // Menambahkan impor getDoc untuk membaca dokumen tunggal
    setDoc, // Menambahkan impor setDoc untuk menulis data ke dokumen tunggal
    doc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBkn-AHaDaw0fiSfhoTJyufNDir5CJD3o",
    authDomain: "ayu-ihza.firebaseapp.com",
    projectId: "ayu-ihza",
    storageBucket: "ayu-ihza.firebasestorage.app",
    messagingSenderId: "833970633121",
    appId: "1:833970633121:web:51afafd055ba2ddbf8b3e0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to get data from the "ucapan" collection
const getDataUcapan = async () => {
    try {
        $("#wishes-box").html(`<div class="spinner-container" style="height:35vh">
                                                      <span class="wish-spinner"></span>
                                                      <span>Loading...</span>
                                                    </div> `);
        const docRef = doc(db, "ucapan", "1"); // Mendapatkan referensi ke dokumen dengan ID '1'
        const docSnap = await getDoc(docRef); // Membaca dokumen

        if (docSnap.exists()) {
            const data = docSnap.data();

            let row_ucapan = "";

            // Loop melalui array ucapan
            (data.ucapan || []).forEach((ucapanItem) => {
                const createdAt = ucapanItem.created_at;
                let formattedDate = createdAt;

                if (createdAt && createdAt.toDate) {
                    const date = createdAt.toDate();
                    formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
                        date.getMonth() + 1
                    )
                        .toString()
                        .padStart(2, "0")}/${date.getFullYear()} ${date
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`;
                }

                row_ucapan = `
            <div class="wish-item">
                <div class="wish-avatar">
                    <svg viewBox="0 0 566.67 560" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px">
                    <defs>
                        <style>
                        .cls-1 {
                            fill: none;
                        }

                        .cls-2 {
                            fill: #fff;
                        }
                        </style>
                    </defs>
                    <circle class="cls-1" cx="286.67" cy="280" r="280"></circle>
                    <circle cx="280" cy="280" r="280" class="avatar_color"></circle>
                    <path d="M 377.52 203.31 C 377.52 257.169 333.859 300.83 280 300.83 C 226.141 300.83 182.48 257.169 182.48 203.31 C 182.48 149.451 226.141 105.79 280 105.79 C 333.859 105.79 377.52 149.451 377.52 203.31 Z M 474.19 464.61 C 368.21 574.877 191.79 574.877 85.81 464.61 C 102.17 372.2 182.89 302 280 302 C 377.11 302 457.83 372.17 474.19 464.61 Z" class="cls-2"></path>
                    </svg>
                </div>
                <div class="wish-data">
                    <div class="data-name">
                    <span>${ucapanItem.nama}</span>
                    <span class="attend-status">
                        <img src="https://cdn.jsdelivr.net/gh/ihzaa/undangan_jawa@e69bad81cfd3dfa0979042ae45354e0edf52b8c3/wp-content/assets/icon/${ucapanItem.kehadiran == 1 ? '' : 'tidak'}hadir.svg">
                    </span>
                    </div>
                    <div class="data-date">${formattedDate}</div>
                    <div class="data-content">${ucapanItem.ucapan}</div>
                </div>
            </div>` + row_ucapan;
            });

            $("#wishes-box").html(row_ucapan);
        } else {
            console.log("No document found!");
        }
    } catch (e) {
        console.error("Error reading document: ", e);
    }
};

getDataUcapan();

const storeUcapan = async (nama, ucapan, kehadiran) => {
    try {
        // Referensi ke dokumen dengan ID '1'
        const docRef = doc(db, "ucapan", "1");

        // Mengambil data dokumen saat ini
        const docSnap = await getDoc(docRef);
        let data = docSnap.exists()
            ? docSnap.data()
            : { ucapan: [] };

        // Pastikan `ucapan` adalah array, inisialisasi jika belum ada
        data.ucapan = data.ucapan || [];

        // Mendapatkan waktu server terlebih dahulu
        const timestamp = serverTimestamp();

        // Membuat data ucapan baru dengan timestamp
        const newUcapan = {
            nama: nama,
            ucapan: ucapan,
            kehadiran: kehadiran,
            created_at: new Date(), // Menggunakan waktu lokal untuk sementara
        };

        // Update array ucapan dan total hadir
        data.ucapan.push(newUcapan);

        // Menyimpan pembaruan data ke Firestore tanpa menggunakan serverTimestamp dalam array
        await setDoc(docRef, {
            ...data,
            last_updated: timestamp, // Menyimpan waktu server di luar array
        });

        // Notifikasi pengguna
        if (kehadiran == 1) {
            Swal.fire({
                imageUrl:
                    "https://cdn.jsdelivr.net/gh/ihzaa/undangan-biru@07d3e4c789e2651b342f276c1dcadffaa259049b/public/images/valentines-day.gif",
                title: "Terima kasih ucapannya!",
                text: "Kami tunggu kehadiranmu ya " + nama,
            });
        } else {
            Swal.fire({
                imageUrl:
                    "https://cdn.jsdelivr.net/gh/ihzaa/undangan-biru@07d3e4c789e2651b342f276c1dcadffaa259049b/public/images/pray.gif",
                title: "Terima kasih ucapannya!",
                text: `Semoga kita dapat bertemu di lain kesempatan`,
            });
        }

        // Update tampilan di halaman tanpa reload
        $("#wishes-box").prepend(`
            <div class="wish-item">
                <div class="wish-avatar">
                    <svg viewBox="0 0 566.67 560" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px">
                    <defs>
                        <style>
                        .cls-1 {
                            fill: none;
                        }

                        .cls-2 {
                            fill: #fff;
                        }
                        </style>
                    </defs>
                    <circle class="cls-1" cx="286.67" cy="280" r="280"></circle>
                    <circle cx="280" cy="280" r="280" class="avatar_color"></circle>
                    <path d="M 377.52 203.31 C 377.52 257.169 333.859 300.83 280 300.83 C 226.141 300.83 182.48 257.169 182.48 203.31 C 182.48 149.451 226.141 105.79 280 105.79 C 333.859 105.79 377.52 149.451 377.52 203.31 Z M 474.19 464.61 C 368.21 574.877 191.79 574.877 85.81 464.61 C 102.17 372.2 182.89 302 280 302 C 377.11 302 457.83 372.17 474.19 464.61 Z" class="cls-2"></path>
                    </svg>
                </div>
                <div class="wish-data">
                    <div class="data-name">
                    <span>${nama}</span>
                    <span class="attend-status">
                        <img src="https://cdn.jsdelivr.net/gh/ihzaa/undangan_jawa@e69bad81cfd3dfa0979042ae45354e0edf52b8c3/wp-content/assets/icon/${kehadiran == 1 ? '' : 'tidak'}hadir.svg">
                    </span>
                    </div>
                    <div class="data-date">${formatDate()}</div>
                    <div class="data-content">${ucapan}</div>
                </div>
            </div>`);

        return true;
    } catch (e) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menyimpan ucapan!" + e,
        });
        return false;
    }
};

const formatDate = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB"); // "en-GB" untuk format dd/mm/yyyy
    const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
};

$("#form_ucapan").submit(async function (e) {
    e.preventDefault();
    const nama = DOMPurify.sanitize($("[name='form_ucapan_nama']").val());
    const ucapan = DOMPurify.sanitize($("[name='form_ucapan_ucapan']").val());
    const kehadiran = parseInt($("[name='form_ucapan_kehadiran']:checked").val());

    if (nama === "" || ucapan.length < 1 || kehadiran === "") {
        Swal.fire({
            icon: "error",
            title: "Duhh...",
            text: "Semua field harus diisi!",
        });
        return;
    }
    if (ucapan.length > 500) {
        Swal.fire({
            icon: "error",
            title: "Duhh...",
            text: "Maap, ucapan kamu maksimal 500 karakter!",
        });
        return;
    }
    showLoader();
    const resp = await storeUcapan(nama, ucapan, kehadiran);
    hideLoader();
    if (resp) {
        $("[name='form_ucapan_nama']").val("");
        $("[name='form_ucapan_ucapan']").val("");
        $("[name='form_ucapan_kehadiran']").prop("checked", false);
    }
});

function showLoader() {
    $("body").prepend(`   <div class="loader" id="page-loader"
      style="position: fixed; top: 0; left: 0; bottom: 0; width: 100%; height: 100%; z-index: 999999999; background: #ffffff; display: flex; align-items: center; justify-content: center; flex-direction: column; transition: opacity .3s ease-in; opacity: 1;overflow: hidden;">
      <svg class="loaders" x="0px" y="0px" viewBox="0 0 40 40" height="40" width="40"
         preserveAspectRatio="xMidYMid meet">
         <path class="track" fill="none" stroke-width="4" pathLength="100"
            d="M29.760000000000005 18.72 c0 7.28 -3.9200000000000004 13.600000000000001 -9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.840000000000002 2.64 c -3.6 0 -6.88 -0.96 -9.76 -2.64 c0 -7.28 3.9200000000000004 -13.52 9.840000000000002 -16.96 c2.8800000000000003 -1.6800000000000002 6.24 -2.64 9.76 -2.64 S26.880000000000003 17.040000000000003 29.760000000000005 18.72 c5.84 3.3600000000000003 9.76 9.68 9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.76 2.64 c -3.6 0 -6.88 -0.96 -9.840000000000002 -2.64 c -5.84 -3.3600000000000003 -9.76 -9.68 -9.76 -16.96 c0 -7.28 3.9200000000000004 -13.600000000000001 9.76 -16.96 C25.84 5.120000000000001 29.760000000000005 11.440000000000001 29.760000000000005 18.72z">
         </path>
         <path class="car" fill="none" stroke-width="4" pathLength="100"
            d="M29.760000000000005 18.72 c0 7.28 -3.9200000000000004 13.600000000000001 -9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.840000000000002 2.64 c -3.6 0 -6.88 -0.96 -9.76 -2.64 c0 -7.28 3.9200000000000004 -13.52 9.840000000000002 -16.96 c2.8800000000000003 -1.6800000000000002 6.24 -2.64 9.76 -2.64 S26.880000000000003 17.040000000000003 29.760000000000005 18.72 c5.84 3.3600000000000003 9.76 9.68 9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.76 2.64 c -3.6 0 -6.88 -0.96 -9.840000000000002 -2.64 c -5.84 -3.3600000000000003 -9.76 -9.68 -9.76 -16.96 c0 -7.28 3.9200000000000004 -13.600000000000001 9.76 -16.96 C25.84 5.120000000000001 29.760000000000005 11.440000000000001 29.760000000000005 18.72z">
         </path>
      </svg>
   </div>`);
}

function hideLoader() {
    $("#page-loader").remove();
}

$(document).ready(function () {
    // Ambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const namaOrang = urlParams.get("kepada");

    // Jika ada nilai di parameter "kenapa", masukkan ke dalam elemen
    if (namaOrang) {
        $(".nama_tamu").text(namaOrang);
        $("[name='form_ucapan_nama']").val(namaOrang);
    }
    $("[name='form_ucapan_ucapan']").emojioneArea({
        pickerPosition: "bottom",
        filtersPosition: "bottom",
        tonesStyle: "bullet",
    });
});