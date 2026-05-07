const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key' // Biarkan inisialisasi jalan meski key tidak valid saat demo
});

exports.analyzeCV = async (cvText, appliedPosition) => {
    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
            throw new Error('API Key tidak diset. Menggunakan fallback dummy.');
        }

        const prompt = `
        Anda adalah HRD ahli di bidang Food & Beverage (F&B) restoran. 
        Analisis teks CV pelamar ini dan tentukan kecocokannya untuk posisi di restoran.
        Pelamar melamar untuk posisi: ${appliedPosition}

        Pertimbangkan pengalaman kerja, skill (hard & soft), dan riwayat pendidikan.
        Rekomendasikan salah satu dari posisi ini: Waiter, Kasir, Barista, Kitchen Staff, Supervisor.
        
        Teks CV:
        "${cvText.substring(0, 3500)}" // Batasi token
        
        Output harus MURNI JSON tanpa markdown, tanpa teks apapun selain JSON, dengan format:
        {
            "recommendedPosition": "Nama Posisi Terbaik",
            "matchScore": 85,
            "strengths": ["kekuatan1", "kekuatan2"],
            "weaknesses": ["kelemahan1", "kelemahan2"],
            "alternativePositions": ["Posisi Alternatif 1", "Posisi Alternatif 2"]
        }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.log("AI Analysis Fallback (Menggunakan Simulasi):", error.message);
        // Fallback dummy (Simulasi AI Jika tidak ada API Key / Error)
        const textLower = cvText.toLowerCase();
        let recommended = appliedPosition || "Waiter";
        let score = Math.floor(Math.random() * 20) + 60; // 60-80

        if (textLower.includes('masak') || textLower.includes('chef') || textLower.includes('kitchen')) {
            recommended = "Kitchen Staff";
            score += 15;
        } else if (textLower.includes('kopi') || textLower.includes('barista')) {
            recommended = "Barista";
            score += 15;
        }

        return {
            recommendedPosition: recommended,
            matchScore: Math.min(100, score),
            strengths: ["Pengalaman dasar terdeteksi", "Kemauan belajar"],
            weaknesses: ["Detail pengalaman kurang terstruktur (Simulasi AI)"],
            alternativePositions: ["Waiter", "Kasir"]
        };
    }
};
