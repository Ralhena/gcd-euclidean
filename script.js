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

  const { gcd } = euclideanSteps(a, b);
  // ikon centang kecil (SVG inline)
  const checkSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#28a745" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  document.getElementById("result").innerHTML = `${checkSVG} GCD(${a}, ${b}) = ${gcd}`;
  // sembunyikan langkah saat hanya menampilkan hasil ringkas
  document.getElementById("steps").style.display = "none";
  document.getElementById("steps").innerText = "";
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

    const { gcd, steps } = euclideanSteps(a, b);

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
    stepsEl.innerHTML = html; // Set HTML agar browser menggambarnya

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
        svgPaths += `<path d="M${b_current_midX},${startY} V${midY_1} H${a_next_midX} V${endY}" stroke="#888" stroke-width="1.5" fill="none" marker-end="url(#arrow)" />`;

        // Buat path panah r -> b
        svgPaths += `<path d="M${r_current_midX},${startY} V${midY_2} H${b_next_midX} V${endY}" stroke="#888" stroke-width="1.5" fill="none" marker-end="url(#arrow)" />`;
    }

    // Buat elemen SVG dan gabungkan dengan path yang sudah dihitung
    const svgFinal = `
      <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="0">
            <path d="M 0 0 L 5 10 L 10 0 z" fill="#888"></path>
          </marker>
        </defs>
        ${svgPaths}
      </svg>
    `;
    
    // Tambahkan SVG ke dalam container
    stepsEl.innerHTML += svgFinal;
}

document.getElementById("btnProses").addEventListener("click", lihatProses);


/* -------------------------
   Event binding
   ------------------------- */

// Tombol "Lihat Proses"
document.getElementById("btnProses").addEventListener("click", lihatProses);

// Tombol Enter di input -> tampilkan ringkasan hasil (tanpa langkah)
document.getElementById("num1").addEventListener("keydown", function (ev) {
  if (ev.key === "Enter") { showResultOnly(); }
});
document.getElementById("num2").addEventListener("keydown", function (ev) {
  if (ev.key === "Enter") { showResultOnly(); }
});

