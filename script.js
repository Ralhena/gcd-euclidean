
/**
 * Variabel untuk menyimpan state kalkulator,
 * agar bisa diakses oleh berbagai fungsi.
 */
let calculatorState = {
  a: 0,
  b: 0,
  gcd: 0,
  steps: [],
};

/** Hitung gcd dan langkah Euclid.
 * Mengembalikan object { gcd: number, steps: Array<{a,b,q,r}> }
 */
function euclideanSteps(aInput, bInput) {
  // pakai nilai absolut supaya -12 dan 12 konsisten
  let a = Math.abs(aInput);
  let b = Math.abs(bInput);

  // kasus special: kedua angka 0
  if (a === 0 && b === 0) {
    return { gcd: 0, steps: [] };
  }

  const steps = [];
  // jika b == 0 langsung gcd = a (tidak ada langkah)
  if (b === 0) {
    return { gcd: a, steps: [] };
  }

  while (b !== 0) {
    const q = Math.floor(a / b);
    const r = a % b;
    steps.push({ a: a, b: b, q: q, r: r });
    a = b;
    b = r;
  }

  // setelah loop, a adalah gcd
  return { gcd: a, steps: steps };
}

/** Menampilkan ringkasan hasil GCD (dipakai untuk Enter).
 * Menampilkan hanya garis hasil (tanpa langkah), menyembunyikan kotak langkah.
 */
function showResultOnly() {
  const n1 = document.getElementById("num1").value;
  const n2 = document.getElementById("num2").value;
  const a = parseInt(n1, 10);
  const b = parseInt(n2, 10);

  if (isNaN(a) || isNaN(b)) {
    alert("Masukkan dua bilangan bulat!");
    return;
  }

  if (a < b) {
    alert("Bilangan pertama harus lebih besar atau sama dengan bilangan kedua!");
    // Kosongkan hasil sebelumnya jika ada
    document.getElementById("result").innerHTML = "";
    document.getElementById("steps").style.display = "none";
    document.getElementById("steps").innerHTML = "";
    return;
  }

  const { gcd } = euclideanSteps(a, b);
  // ikon centang kecil (SVG inline)
  const checkSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#28a745" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  document.getElementById("result").innerHTML = `${checkSVG} GCD(${a}, ${b}) = ${gcd}`;
  // sembunyikan langkah saat hanya menampilkan hasil ringkas
  document.getElementById("steps").style.display = "none";
  document.getElementById("steps").innerText = "";

  document.getElementById("btnKombinasi").style.display = "none";
  document.getElementById("kombinasi-steps").style.display = "none";
}

/**
 * Menampilkan hasil + semua langkah
 */
async function lihatProses() {
    const n1 = document.getElementById("num1").value;
    const n2 = document.getElementById("num2").value;
    const a = parseInt(n1, 10);
    const b = parseInt(n2, 10);

    if (isNaN(a) || isNaN(b)) {
        alert("Masukkan dua bilangan bulat!");
        return;
    }

    if (a < b) {
      alert("Bilangan pertama harus lebih besar atau sama dengan bilangan kedua!");
      // Kosongkan hasil sebelumnya jika ada
      document.getElementById("result").innerHTML = "";
      document.getElementById("steps").style.display = "none";
      document.getElementById("steps").innerHTML = "";
      return;
    }

    const { gcd, steps } = euclideanSteps(a, b);

  // Simpan hasil ke state global
    calculatorState = { a: Math.abs(n1), b: Math.abs(n2), gcd, steps };

    // Tampilkan hasil ringkas
    const checkSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="#28a745" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    document.getElementById("result").innerHTML = `${checkSVG} GCD(${a}, ${b}) = ${gcd}`;

    const stepsEl = document.getElementById("steps");
    stepsEl.style.display = "block"; // Tampilkan kotak langkah

    let html = `<div style="font-weight:700; margin-bottom:10px">Langkah-langkah:</div>`;
    steps.forEach((step, i) => {
        // Beri ID unik untuk setiap span yang akan kita ukur
        html += `
          <div class="step-row">
            <span id="a-${i}" class="col-a">${step.a}</span><span class="col-eq">=</span>
            <span id="q-${i}" class="col-q">${step.q}</span><span class="col-mul">×</span>
            <span id="b-${i}" class="col-b">${step.b}</span><span class="col-plus">+</span>
            <span id="r-${i}" class="col-r">${step.r}</span>
          </div>
        `;
    });
    stepsEl.innerHTML = html;

    // Sembunyikan dulu hasil kombinasi linear & tampilkan tombolnya
    document.getElementById("kombinasi-steps").style.display = "none";
    if (steps.length > 0) { // Hanya tampilkan tombol jika ada proses yg bisa di-reverse
       document.getElementById("btnKombinasi").style.display = "inline-block";
    } else {
       document.getElementById("btnKombinasi").style.display = "none";
    }

    stepsEl.innerHTML = `<div class="steps-content-wrapper">${html}</div>`;
    await new Promise(r => setTimeout(r, 0));

    let svgPaths = '';
    const containerRect = stepsEl.getBoundingClientRect(); // Posisi kotak kontainer

    for (let i = 0; i < steps.length - 1; i++) {
        // Ambil elemen dari DOM
        const el_b_current = document.getElementById(`b-${i}`);
        const el_r_current = document.getElementById(`r-${i}`);
        const el_a_next = document.getElementById(`a-${i + 1}`);
        const el_b_next = document.getElementById(`b-${i + 1}`);

        // Ukur posisi dan ukurannya
        const rect_b_current = el_b_current.getBoundingClientRect();
        const rect_r_current = el_r_current.getBoundingClientRect();
        const rect_a_next = el_a_next.getBoundingClientRect();
        const rect_b_next = el_b_next.getBoundingClientRect();

        // Hitung titik tengah horizontal dari setiap angka
        const b_current_midX = rect_b_current.x - containerRect.x + (rect_b_current.width / 2);
        const r_current_midX = rect_r_current.x - containerRect.x + (rect_r_current.width / 2)-30;
        const a_next_midX = rect_a_next.x - containerRect.x + (rect_a_next.width / 2)+30;
        const b_next_midX = rect_b_next.x - containerRect.x + (rect_b_next.width / 2);
        
        // Hitung posisi Y (vertikal)
        const startY = rect_b_current.y - containerRect.y + rect_b_current.height ;
        const endY = rect_a_next.y - containerRect.y - 4; // Beri celah 4px di atas angka

        const midY_1 = startY + 18; // Ketinggian belok panah pertama
        const midY_2 = startY + 25; // Ketinggian belok panah kedua

        // Buat path panah b -> a
        svgPaths += `<path d="M${b_current_midX},${startY} V${midY_1} H${a_next_midX} V${endY}" stroke="#000000ff" stroke-width="1.5" fill="none" marker-end="url(#arrow)" />`;

        // Buat path panah r -> b
        svgPaths += `<path d="M${r_current_midX},${startY} V${midY_2} H${b_next_midX} V${endY}" stroke="#000000ff" stroke-width="1.5" fill="none" marker-end="url(#arrow)" />`;
    }

    // Buat elemen SVG dan gabungkan dengan path yang sudah dihitung
    const svgFinal = `
      <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="0">
            <path d="M 0 0 L 5 10 L 10 0 z" fill="#000000ff"></path>
          </marker>
        </defs>
        ${svgPaths}
      </svg>
    `;
    
    // Tambahkan SVG ke dalam container
    stepsEl.innerHTML += svgFinal;
}

document.getElementById("btnProses").addEventListener("click", lihatProses);

/**
 * =======================================================
 * FUNGSI BARU: Logika untuk Kombinasi Linear
 * =======================================================
 */
function tampilkanKombinasiLinear() {
    const { a: originalA, b: originalB, gcd, steps } = calculatorState;

    if (steps.length === 0 || steps[steps.length - 1].r !== 0) {
        document.getElementById("kombinasi-steps").style.display = "none";
        return;
    }

    const kombStepsEl = document.getElementById("kombinasi-steps");
    kombStepsEl.style.display = "block";
    let html = `<div class="step-title">Proses Substitusi Balik:</div>`;

    // 1. Siapkan persamaan dalam bentuk numerik
    const equations = steps.slice(0, -1).map(step => ({
        r: step.r, a: step.a, b: step.b, q: step.q,
        text: `${step.r} = ${step.a} - ${step.q} × ${step.b}`
    }));

    html += `<p style="margin-bottom: 12px;">Pertama, susun ulang setiap baris menjadi bentuk <strong>sisa = ...</strong></p>`;
    equations.forEach(eq => {
        html += `<p style="font-family: monospace; color: #000000ff;">${eq.text}</p>`;
    });
    html += `<hr style="margin: 15px 0;">`;

    // Helper function baru untuk memformat dari array yang terurut
    const formatFromTerms = (termsArray, result = gcd) => {
        const termStrings = termsArray.map(term => `(${term.coeff}) × ${term.num}`);
        return `${result} = ${termStrings.join(' + ').replace(/\+ \(-/g, '- (')}`;
    };

    if (equations.length === 0) return;

    // 2. Mulai proses dari persamaan terakhir
    const lastEq = equations[equations.length - 1];
    
    // Objek untuk perhitungan numerik
    let coeffs = {};
    coeffs[lastEq.a] = 1;
    coeffs[lastEq.b] = -lastEq.q;
    
    // Array untuk menjaga urutan tampilan
    let orderedTerms = [
        { coeff: 1, num: lastEq.a },
        { coeff: -lastEq.q, num: lastEq.b }
    ];
    
    html += `<p>Mulai dari baris terakhir:</p>`;
    html += `<p style="font-weight: bold;">${formatFromTerms(orderedTerms)}</p>`;

    // 3. Loop mundur untuk substitusi
    for (let i = equations.length - 2; i >= 0; i--) {
        const eqToSub = equations[i];
        const numToReplace = eqToSub.r;

        if (!coeffs[numToReplace]) continue;

        html += `<p style="margin-top:15px;">Kemudian, substitusikan <span style="font-family: monospace; color: #d63384;">${eqToSub.text}</span>:</p>`;
        
        const multiplier = coeffs[numToReplace];

        // TAHAP 1: Tampilkan substitusi, jaga urutan
        let subDisplayString = orderedTerms.map(term => {
            if (term.num === numToReplace) {
                return `(${multiplier}) × (${eqToSub.a} - ${eqToSub.q} × ${eqToSub.b})`;
            }
            return `(${term.coeff}) × ${term.num}`;
        }).join(' + ').replace(/\+ \(-/g, '- (');
        html += `<p>${gcd} = ${subDisplayString}</p>`;

        // TAHAP 2: Tampilkan ekspansi, ganti suku di posisinya
        let expandedTerms = [];
        orderedTerms.forEach(term => {
            if (term.num === numToReplace) {
                expandedTerms.push({ coeff: multiplier * 1, num: eqToSub.a });
                expandedTerms.push({ coeff: multiplier * (-eqToSub.q), num: eqToSub.b });
            } else {
                expandedTerms.push(term);
            }
        });
        html += `<p>${formatFromTerms(expandedTerms)}</p>`;

        // Lakukan pembaruan numerik di 'coeffs'
        delete coeffs[numToReplace];
        coeffs[eqToSub.a] = (coeffs[eqToSub.a] || 0) + (multiplier * 1);
        coeffs[eqToSub.b] = (coeffs[eqToSub.b] || 0) + (multiplier * -eqToSub.q);

        // TAHAP 3: Tampilkan penyederhanaan, bangun ulang urutan dari ekspansi
        let simplifiedTerms = [];
        let seenNums = new Set();
        expandedTerms.forEach(term => {
            if (!seenNums.has(term.num)) {
                if(coeffs[term.num]) { // Hanya tambahkan jika koefisiennya tidak nol
                    simplifiedTerms.push({ coeff: coeffs[term.num], num: term.num });
                }
                seenNums.add(term.num);
            }
        });
        orderedTerms = simplifiedTerms; // Perbarui urutan untuk iterasi berikutnya

        html += `<p style="font-weight: bold;">${formatFromTerms(orderedTerms)}</p>`;
    }

    // 4. Tampilkan hasil akhir
    const x = coeffs[originalA] || 0;
    const y = coeffs[originalB] || 0;

    html += `<hr style="margin: 15px 0;">`;
    html += `<p>Jadi, hasil akhirnya adalah:</p><p><strong>(${x}) × ${originalA} + (${y}) × ${originalB} = ${gcd}</strong></p>`;

    kombStepsEl.innerHTML = html;
}

/* -------------------------
   Event binding
   ------------------------- */

// Tombol "Lihat Proses"
document.getElementById("btnProses").addEventListener("click", lihatProses);

// Tombol kombinasi linear
document.getElementById("btnKombinasi").addEventListener("click", tampilkanKombinasiLinear);

// Tombol Enter di input -> tampilkan ringkasan hasil (tanpa langkah)
document.getElementById("num1").addEventListener("keydown", function (ev) {
  if (ev.key === "Enter") { showResultOnly(); }
});
document.getElementById("num2").addEventListener("keydown", function (ev) {
  if (ev.key === "Enter") { showResultOnly(); }
});
