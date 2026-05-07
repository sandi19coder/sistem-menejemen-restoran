const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

exports.evaluatePerformance = async (kpiMetrics, supervisorNotes) => {
    // If no real API key, simulate AI response
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        const rawScore = (kpiMetrics.attendance * 0.4) + (kpiMetrics.discipline * 0.2) + (kpiMetrics.teamwork * 0.2) + (kpiMetrics.attitude * 0.2);
        let bonusScore = 0;
        if (supervisorNotes && supervisorNotes.length > 10) bonusScore = 5;
        const finalScore = Math.min(100, Math.round(rawScore + bonusScore));
        
        return {
            aiScore: finalScore,
            aiFeedback: `(Simulasi AI) Kinerja dinilai cukup baik dengan skor awal ${rawScore.toFixed(1)}. ${supervisorNotes ? "Catatan supervisor memberikan nilai tambah." : ""}`
        };
    }

    try {
        const prompt = `Anda adalah AI HRD Restoran. Evaluasi kinerja karyawan berikut.
Metrik KPI:
- Kehadiran: ${kpiMetrics.attendance}/100 (Bobot 40%)
- Disiplin: ${kpiMetrics.discipline}/100 (Bobot 20%)
- Kerjasama Tim: ${kpiMetrics.teamwork}/100 (Bobot 20%)
- Sikap: ${kpiMetrics.attitude}/100 (Bobot 20%)

Catatan Supervisor: "${supervisorNotes || 'Tidak ada catatan khusus'}"

Berikan hasil dalam format JSON yang valid:
{
  "aiScore": <angka 0-100 berdasarkan perhitungan metrik dan sentimen catatan supervisor>,
  "aiFeedback": "<1-2 kalimat feedback konstruktif>"
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (err) {
        console.error("AI Error:", err);
        // Fallback calculation
        return {
            aiScore: (kpiMetrics.attendance * 0.4) + (kpiMetrics.discipline * 0.2) + (kpiMetrics.teamwork * 0.2) + (kpiMetrics.attitude * 0.2),
            aiFeedback: "Gagal menghubungi AI, menggunakan skor kalkulasi standar."
        };
    }
};
