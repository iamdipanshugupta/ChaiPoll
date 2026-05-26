// Export poll analytics as PDF using browser's print dialog
// No external library needed — works everywhere

const exportAnalyticsPDF = (analytics) => {
  const { pollTitle, totalResponses, pollCode, questions } = analytics;

  const now = new Date().toLocaleString();

  const questionsHTML = questions.map((q, i) => {
    const entries = Object.entries(q.optionCounts);
    const total = q.answered || totalResponses;
    const winner = entries.reduce((a, b) => (b[1] > a[1] ? b : a), entries[0] || ["", 0]);

    const barsHTML = entries.map(([key, value]) => {
      const pct = total > 0 ? Math.round((value / total) * 100) : 0;
      const isWinner = key === winner[0] && value > 0;
      return `
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px;">
            <span style="color:${isWinner ? "#f97316" : "#333"};font-weight:${isWinner ? "600" : "400"};">
              ${isWinner ? "🏆 " : ""}${key}
            </span>
            <span style="color:#666;">${value} (${pct}%)</span>
          </div>
          <div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${isWinner ? "linear-gradient(90deg,#f97316,#fbbf24)" : "linear-gradient(90deg,#94a3b8,#cbd5e1)"};border-radius:4px;"></div>
          </div>
        </div>`;
    }).join("");

    return `
      <div style="margin-bottom:24px;padding:20px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
          <div>
            <div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">Q${i + 1} · ${q.required ? "Required" : "Optional"}</div>
            <div style="font-size:15px;font-weight:600;color:#111;">${q.question}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:22px;font-weight:800;color:#f97316;">${q.answered}</div>
            <div style="font-size:11px;color:#9ca3af;">${q.skipped > 0 ? q.skipped + " skipped" : "answered"}</div>
          </div>
        </div>
        ${barsHTML}
      </div>`;
  }).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>ChaiPoll Analytics - ${pollTitle}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI',sans-serif; background:#f9fafb; padding:32px; }
        @media print {
          body { padding:16px; }
          .no-print { display:none !important; }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:28px 32px;border-radius:16px;margin-bottom:24px;color:white;">
        <div style="font-size:28px;margin-bottom:4px;">☕</div>
        <div style="font-size:11px;opacity:0.8;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">ChaiPoll Analytics Report</div>
        <div style="font-size:24px;font-weight:800;">${pollTitle}</div>
        <div style="font-size:12px;opacity:0.7;margin-top:4px;">Generated: ${now} · Code: ${pollCode}</div>
      </div>

      <!-- Summary stats -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;">
        <div style="padding:16px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;text-align:center;">
          <div style="font-size:32px;font-weight:800;color:#f97316;">${totalResponses}</div>
          <div style="font-size:12px;color:#6b7280;">Total Responses</div>
        </div>
        <div style="padding:16px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;text-align:center;">
          <div style="font-size:32px;font-weight:800;color:#3b82f6;">${questions.length}</div>
          <div style="font-size:12px;color:#6b7280;">Questions</div>
        </div>
        <div style="padding:16px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;text-align:center;">
          <div style="font-size:32px;font-weight:800;color:#10b981;">
            ${totalResponses > 0 ? Math.round((questions.reduce((a, q) => a + q.answered / totalResponses, 0) / questions.length) * 100) : 0}%
          </div>
          <div style="font-size:12px;color:#6b7280;">Completion Rate</div>
        </div>
      </div>

      <!-- Questions -->
      ${questionsHTML}

      <!-- Footer -->
      <div style="text-align:center;padding:20px;color:#9ca3af;font-size:11px;border-top:1px solid #e5e7eb;margin-top:8px;">
        ☕ ChaiPoll · chaipoll-n3ti.onrender.com · Report exported ${now}
      </div>

      <script>window.onload = () => window.print();</script>
    </body>
    </html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
};

export default exportAnalyticsPDF;