import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export default function StyledQRCode({ qrData }) {
  const ref = useRef(null);
  const qrCode = useRef(
    new QRCodeStyling({
      width: 300,
      height: 300,
      data: qrData, // will be updated dynamically
      dotsOptions: {
        color: "#33CCCC",
        type: "dots",
        scale: 0.4,
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      image: "/calendar.gif",
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8,
      },
    })
  );

  useEffect(() => {
    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    if (qrData) {
      qrCode.current.update({ data: qrData });
    }
  }, [qrData]);

  return (
    <div
      className="d-flex justify-content-center border border-1 p-3 rounded-3"
      ref={ref}
    />
  );
}
