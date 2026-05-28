import toast from "react-hot-toast";

// Lightweight QR using qrcode.react via CDN-style dynamic import workaround
// We use a QR API service (no npm package needed)
const QRShare = ({ pollCode, title, onClose }) => {
  const link = `${window.location.origin}/poll/${pollCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}&bgcolor=ffffff&color=1a1a1a&margin=10`;

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => toast.success("Link copied!"));
  };

  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `chaipoll-${pollCode}.png`;
    a.target = "_blank";
    a.click();
    toast.success("QR downloaded!");
  };

  return (
    <div className="qr-modal-backdrop" onClick={onClose}>
      <div className="qr-modal animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
            📱 Share Poll
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition"
            style={{ background: "var(--surface)", color: "var(--text2)" }}>✕</button>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--text3)" }}>
          Scan this QR code to open the poll
        </p>

        {/* QR Code */}
        <div className="flex justify-center mb-5">
          <div className="p-3 rounded-2xl bg-white inline-block shadow-lg">
            <img
              src={qrUrl}
              alt="QR Code"
              width={180}
              height={180}
              className="block rounded-lg"
            />
          </div>
        </div>

        <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text3)" }}>
          {title}
        </p>

        {/* Link box */}
        <div className="cp-link-box mb-4">
          <span className="text-xs font-mono truncate flex-1" style={{ color: "#fb923c" }}>
            {link}
          </span>
          <button onClick={copyLink} className="btn btn-ghost btn-sm text-xs flex-shrink-0">Copy</button>
        </div>

        <div className="flex gap-2">
          <button onClick={copyLink} className="btn btn-secondary flex-1 text-sm">🔗 Copy Link</button>
          <button onClick={downloadQR} className="btn btn-primary flex-1 text-sm">⬇️ Download QR</button>
        </div>
      </div>
    </div>
  );
};

export default QRShare;
