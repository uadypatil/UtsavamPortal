import React from 'react';
import { QRCode } from 'react-qrcode-logo'; // Or 'qrcode.react'

const ShowQrCode = ({ value = "https://example.com", size = 180 }) => {
    return (
        <div className="text-center py-3">
            <QRCode value={value} size={size} />
        </div>
    );
};

export default ShowQrCode;
