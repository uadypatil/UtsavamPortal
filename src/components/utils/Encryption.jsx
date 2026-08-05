import CryptoJS from "crypto-js";

// Base62 character set
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Base62 encode
function base62Encode(wordArray) {
    let hex = wordArray.toString(CryptoJS.enc.Hex);
    let num = BigInt("0x" + hex);
    let result = "";
    while (num > 0) {
        result = BASE62[Number(num % 62n)] + result;
        num = num / 62n;
    }
    return result || "0";
}

// Base62 decode
function base62Decode(str) {
    let num = 0n;
    for (let char of str) {
        num = num * 62n + BigInt(BASE62.indexOf(char));
    }
    let hex = num.toString(16);
    if (hex.length % 2) hex = "0" + hex;
    return CryptoJS.enc.Hex.parse(hex);
}

// Encrypt
function encryptData(data) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.SHA256(iv);

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const combined = iv.concat(encrypted.ciphertext);

    let base62 = base62Encode(combined);

    // Random length between 20–25 by padding random chars at end
    const targetLength = Math.floor(Math.random() * 6) + 20;
    while (base62.length < targetLength) {
        base62 += BASE62[Math.floor(Math.random() * 62)];
    }
    return base62;
}

// Decrypt
function decryptData(base62) {
    // Remove any padding (ignore extra characters after original data length)
    // To do this, decode directly — extra random chars won't decode properly so we trim
    // We'll assume original length is multiple of 32 hex chars (AES block size)
    let decoded = base62Decode(base62);

    // IV (16 bytes) + ciphertext
    const iv = CryptoJS.lib.WordArray.create(decoded.words.slice(0, 4), 16);
    const encryptedData = CryptoJS.lib.WordArray.create(decoded.words.slice(4));

    const key = CryptoJS.SHA256(iv);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedData },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}

export { encryptData, decryptData };
