import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  PiggyBank, 
  Sparkles, 
  Laptop, 
  Coins, 
  Bike, 
  Plus, 
  Trash2, 
  Check, 
  Percent,
  Coffee,
  Car,
  ShoppingBag,
  Cigarette,
  Utensils,
  Smartphone,
  Gamepad2,
  Headphones,
  Dumbbell,
  BookOpen,
  Fuel,
  Camera,
  Music,
  Banknote,
  Wallet,
  Ticket,
  Plane,
  Shirt
} from 'lucide-react';

// ==========================================
// 1. TIPE DATA & INTERFACES
// ==========================================
export interface HabitItem {
  id: string;
  name: string;
  amount: number;
  frequencyPerWeek: number;
  enabled: boolean;
}

export interface DreamItem {
  id: string;
  name: string;
  price: number;
}

export interface YearProjection {
  year: number;
  totalSpent: number;
}

// Contoh inspirasi target barang (opsional jika user ingin contoh ide)
const INSPIRATION_DREAM_ITEMS: DreamItem[] = [
  { id: '1', name: 'Kamera Mirrorless / Laptop Baru', price: 9_500_000 },
  { id: '2', name: 'Emas Logam Mulia 10 Gram', price: 14_500_000 },
  { id: '3', name: 'Motor Matik Baru (Beli Tunai)', price: 21_000_000 }
];

// Target 3 Barang Impian Awal (Bersih 100% Kosong Tanpa Data Dummy)
const INITIAL_BLANK_DREAM_ITEMS: DreamItem[] = [
  { id: '1', name: '', price: 0 },
  { id: '2', name: '', price: 0 },
  { id: '3', name: '', price: 0 }
];

// Formatter Rupiah yang rapi
const formatIDR = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

// Formatter angka ribuan dengan titik untuk input teks
const formatThousandNumber = (val: number): string => {
  if (!val || val <= 0) return '';
  return new Intl.NumberFormat('id-ID').format(val);
};

const STORAGE_KEY = 'habitcost_user_data_v1';

// ========================================================
// KATALOG 29 MOTIF UNIK: MATA UANG & KEGIATAN SEHARI-HARI
// (BILANGAN PRIMA 29 MENJAMIN TIDAK ADA BENTUK SAMA BERSEBELAHAN)
// ========================================================
const BACKGROUND_MOTIFS = [
  // 0: Kopi Cafe (Cokelat)
  {
    content: <Coffee className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 1: Cap Rupiah Bulat (Merah Marun)
  {
    content: <span className="font-serif font-black text-sm sm:text-base leading-none">Rp</span>,
    color: 'text-[#800020] border-[#800020]/75 bg-[#FDF2F4]/60',
    shape: 'rounded-full border-2 border-dashed'
  },
  // 2: Ojol & Mobil (Hitam Cerah)
  {
    content: <Car className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#1E242B] border-[#1E242B]/70 bg-[#F4F6F8]/60',
    shape: 'rounded-2xl border-2'
  },
  // 3: Uang Kertas Tunai (Cokelat)
  {
    content: <Banknote className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 4: Belanja Online Impulsif (Merah Marun)
  {
    content: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#800020] border-[#800020]/70 bg-[#FDF2F4]/60',
    shape: 'rounded-2xl border-2'
  },
  // 5: Cap Valuta IDR Kotak (Hitam Cerah)
  {
    content: <span className="font-mono font-black text-xs leading-none">IDR</span>,
    color: 'text-[#1E242B] border-[#1E242B]/75 bg-[#F4F6F8]/60',
    shape: 'rounded-xl border-2 border-dotted'
  },
  // 6: Rokok & Santai (Cokelat)
  {
    content: <Cigarette className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 7: Koin Emas Logam Mulia (Merah Marun)
  {
    content: <Coins className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#800020] border-[#800020]/70 bg-[#FDF2F4]/60',
    shape: 'rounded-full border-2'
  },
  // 8: Jajan Kuliner & Boba (Hitam Cerah)
  {
    content: <Utensils className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#1E242B] border-[#1E242B]/70 bg-[#F4F6F8]/60',
    shape: 'rounded-2xl border-2'
  },
  // 9: MacBook & Laptop Kerja (Cokelat)
  {
    content: <Laptop className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 10: Cap Nominal 100K (Merah Marun)
  {
    content: <span className="font-mono font-black text-[11px] sm:text-xs leading-none">100K</span>,
    color: 'text-[#800020] border-[#800020]/75 bg-[#FDF2F4]/60',
    shape: 'rounded-xl border-2 border-dashed'
  },
  // 11: Smartphone & Kuota (Hitam Cerah)
  {
    content: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#1E242B] border-[#1E242B]/70 bg-[#F4F6F8]/60',
    shape: 'rounded-2xl border-2'
  },
  // 12: Motor Matik Baru (Cokelat)
  {
    content: <Bike className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 13: Bensin & BBM Pertamax (Merah Marun)
  {
    content: <Fuel className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#800020] border-[#800020]/70 bg-[#FDF2F4]/60',
    shape: 'rounded-2xl border-2'
  },
  // 14: Dompet Tabungan Kas (Hitam Cerah)
  {
    content: <Wallet className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#1E242B] border-[#1E242B]/70 bg-[#F4F6F8]/60',
    shape: 'rounded-2xl border-2'
  },
  // 15: Game Online & Top Up (Cokelat)
  {
    content: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 16: Cap Nominal 50K (Merah Marun)
  {
    content: <span className="font-mono font-black text-[11px] sm:text-xs leading-none">50K</span>,
    color: 'text-[#800020] border-[#800020]/75 bg-[#FDF2F4]/60',
    shape: 'rounded-xl border-2 border-dashed'
  },
  // 17: Olahraga & Gym Bugar (Hitam Cerah)
  {
    content: <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#1E242B] border-[#1E242B]/70 bg-[#F4F6F8]/60',
    shape: 'rounded-2xl border-2'
  },
  // 18: Kamera Foto & Konten (Cokelat)
  {
    content: <Camera className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 19: Buku & Belajar Skill (Merah Marun)
  {
    content: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#800020] border-[#800020]/70 bg-[#FDF2F4]/60',
    shape: 'rounded-2xl border-2'
  },
  // 20: Cap Nominal 20K (Hitam Cerah)
  {
    content: <span className="font-mono font-black text-[11px] sm:text-xs leading-none">20K</span>,
    color: 'text-[#1E242B] border-[#1E242B]/75 bg-[#F4F6F8]/60',
    shape: 'rounded-xl border-2 border-dashed'
  },
  // 21: Investasi Majemuk SBN (Cokelat)
  {
    content: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 22: Headphone Santai (Merah Marun)
  {
    content: <Headphones className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#800020] border-[#800020]/70 bg-[#FDF2F4]/60',
    shape: 'rounded-2xl border-2'
  },
  // 23: Busana & Outfit (Hitam Cerah)
  {
    content: <Shirt className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#1E242B] border-[#1E242B]/70 bg-[#F4F6F8]/60',
    shape: 'rounded-2xl border-2'
  },
  // 24: Cap Nominal 10K (Cokelat)
  {
    content: <span className="font-mono font-black text-[11px] sm:text-xs leading-none">10K</span>,
    color: 'text-[#783D19] border-[#783D19]/75 bg-[#FAF3EB]/60',
    shape: 'rounded-xl border-2 border-dashed'
  },
  // 25: Bioskop & Tiket Nonton (Merah Marun)
  {
    content: <Ticket className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#800020] border-[#800020]/70 bg-[#FDF2F4]/60',
    shape: 'rounded-2xl border-2'
  },
  // 26: Liburan & Traveling (Hitam Cerah)
  {
    content: <Plane className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#1E242B] border-[#1E242B]/70 bg-[#F4F6F8]/60',
    shape: 'rounded-2xl border-2'
  },
  // 27: Musik & Streaming (Cokelat)
  {
    content: <Music className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />,
    color: 'text-[#783D19] border-[#783D19]/70 bg-[#FAF3EB]/60',
    shape: 'rounded-2xl border-2'
  },
  // 28: Cap Segi Rupiah BI (Merah Marun)
  {
    content: <span className="font-serif font-black text-xs sm:text-sm leading-none tracking-widest">RP</span>,
    color: 'text-[#800020] border-[#800020]/75 bg-[#FDF2F4]/60',
    shape: 'rounded-lg border-2'
  }
];

// Helper deterministik untuk pergeseran organik abstrak (anti-grid, bebas tabrakan)
function getAbstractJitter(r: number, c: number) {
  const seed = (r * 19 + c * 37 + 11) % 100;
  // Pergeseran posisi X (-22px s/d +22px) dan Y (-20px s/d +20px)
  const offsetX = ((seed * 7) % 45) - 22;
  const offsetY = ((seed * 13) % 41) - 20;
  // Sudut rotasi miring alami (-18deg s/d +18deg)
  const rotation = ((seed * 11) % 37) - 18;
  // Variasi skala lembut (0.88x s/d 1.12x)
  const scale = 0.88 + (((seed * 3) % 25) / 100);
  return { offsetX, offsetY, rotation, scale };
}

// ========================================================
// KOMPONEN BACKGROUND ABSTRAK: TERSEBAR ALAMI DARI ATAS KE BAWAH
// - Putih di atas: Warna dipudarkan (opacity lembut ~16-20%)
// - Cokelat di bawah: Warna diperjelas (opacity tajam ~55-65%)
// - Peletakan abstrak bergeser alami tanpa tabrakan & tanpa bentuk sama bersebelahan
// ========================================================
function AbstractBackgroundMotif() {
  const TOTAL_ROWS = 32;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="w-full flex flex-col justify-start py-6 space-y-7 sm:space-y-10">
        {Array.from({ length: TOTAL_ROWS }).map((_, r) => {
          // Gradien opasitas: Atas putih pudar (~0.16) -> Bawah cokelat jelas (~0.64)
          const progress = r / (TOTAL_ROWS - 1);
          const rowOpacity = 0.16 + Math.pow(progress, 1.25) * 0.48;

          // Pergeseran zig-zag baris ganjil & genap agar tidak berbaris kaku
          const indentClass = r % 2 === 1 ? 'pl-6 sm:pl-16 pr-3' : 'pr-6 sm:pr-16 pl-3';

          return (
            <div
              key={r}
              className={`flex justify-around items-center w-full ${indentClass}`}
              style={{ opacity: Number(rowOpacity.toFixed(3)) }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => {
                // Modulus prima 29 menjamin tidak ada bentuk sama bersebelahan (horizontal, vertikal, diagonal)
                const motifIndex = (r * 11 + c * 3) % BACKGROUND_MOTIFS.length;
                const item = BACKGROUND_MOTIFS[motifIndex];
                const { offsetX, offsetY, rotation, scale } = getAbstractJitter(r, c);

                // Responsif jumlah kolom: 4 di HP, 6 di Tablet, 8 di Layar Besar
                const responsiveVisibility =
                  c >= 6 ? 'hidden lg:flex' : c >= 4 ? 'hidden sm:flex' : 'flex';

                return (
                  <div
                    key={c}
                    className={`${responsiveVisibility} w-11 h-11 sm:w-12 sm:h-12 items-center justify-center shadow-2xs ${item.shape} ${item.color} shrink-0`}
                    style={{
                      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`
                    }}
                  >
                    {item.content}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 3. KOMPONEN UTAMA
// ==========================================
export default function HabitCostCalculator() {
  // Inisialisasi State dari LocalStorage (Bersih 100% Tanpa Data Dummy)
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.habits)) {
          return parsed.habits;
        }
      }
    } catch {}
    return [];
  });

  const [activeHabitId, setActiveHabitId] = useState<string>('');

  // Mode Pengurangan (100% = stop total, 50% = kurangi separuh, 30% = kurangi sebagian)
  const [reductionPercent, setReductionPercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.reductionPercent === 'number') return parsed.reductionPercent;
      }
    } catch {}
    return 100;
  });

  // 3 Target Barang Impian Pengguna (Awalnya Bersih Kosong Tanpa Dummy)
  const [dreamItems, setDreamItems] = useState<DreamItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.dreamItems) && parsed.dreamItems.length === 3) {
          return parsed.dreamItems;
        }
      }
    } catch {}
    return INITIAL_BLANK_DREAM_ITEMS;
  });

  const handleNameChange = (id: string, newName: string) => {
    setDreamItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const handlePriceChange = (id: string, rawVal: string) => {
    const digits = rawVal.replace(/\D/g, '');
    const parsed = parseInt(digits, 10);
    const newPrice = isNaN(parsed) ? 0 : parsed;
    setDreamItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  // Muat contoh ide target jika user menginginkan inspirasi
  const loadInspirationItems = () => {
    setDreamItems(INSPIRATION_DREAM_ITEMS);
  };

  // Kosongkan kembali 3 barang impian
  const clearDreamItems = () => {
    setDreamItems(INITIAL_BLANK_DREAM_ITEMS);
  };

  // Horizon Acuan Tabungan (1, 3, 5 Tahun)
  const [benchmarkHorizon, setBenchmarkHorizon] = useState<1 | 3 | 5>(3);

  // Notifikasi Bagikan / Salin
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Simpan perubahan ke LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          habits,
          reductionPercent,
          dreamItems
        })
      );
    } catch {}
  }, [habits, reductionPercent, dreamItems]);

  // Habit aktif yang sedang diedit
  const activeHabit = useMemo(() => {
    return habits.find((h) => h.id === activeHabitId) || habits[0] || null;
  }, [habits, activeHabitId]);

  // Update habit aktif
  const updateActiveHabit = (updates: Partial<HabitItem>) => {
    if (!activeHabit) return;
    setHabits((prev) =>
      prev.map((h) => (h.id === activeHabit.id ? { ...h, ...updates } : h))
    );
  };

  // Tambah habit baru (Bersih Kosong Siap Diketik Sendiri)
  const addNewHabit = () => {
    const newId = Date.now().toString();
    const newHabit: HabitItem = {
      id: newId,
      name: '',
      amount: 0,
      frequencyPerWeek: 1,
      enabled: true
    };
    setHabits((prev) => [...prev, newHabit]);
    setActiveHabitId(newId);
  };

  // Hapus habit
  const removeHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = habits.filter((h) => h.id !== id);
    setHabits(remaining);
    if (activeHabitId === id && remaining.length > 0) {
      setActiveHabitId(remaining[0].id);
    } else if (remaining.length === 0) {
      setActiveHabitId('');
    }
  };

  // Toggle habit aktif/nonaktif
  const toggleHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h))
    );
  };

  // Perhitungan Keuangan
  const weeklyGrossSpent = useMemo(() => {
    return habits
      .filter((h) => h.enabled)
      .reduce((sum, h) => sum + h.amount * h.frequencyPerWeek, 0);
  }, [habits]);

  const weeklySavedAmount = useMemo(() => {
    return Math.round((weeklyGrossSpent * reductionPercent) / 100);
  }, [weeklyGrossSpent, reductionPercent]);

  const monthlySavedDeposit = useMemo(() => {
    return (weeklySavedAmount * 52) / 12;
  }, [weeklySavedAmount]);

  // Proyeksi 5 Tahun
  const projections: YearProjection[] = useMemo(() => {
    return [1, 2, 3, 4, 5].map((year) => ({
      year,
      totalSpent: Math.round(monthlySavedDeposit * year * 12),
    }));
  }, [monthlySavedDeposit]);

  const year1 = projections[0];
  const year3 = projections[2];
  const year5 = projections[4];

  // Target Dana Tersimpan Berdasarkan Horizon Terpilih
  const targetSavedFund = useMemo(() => {
    if (benchmarkHorizon === 1) return year1.totalSpent;
    if (benchmarkHorizon === 5) return year5.totalSpent;
    return year3.totalSpent;
  }, [benchmarkHorizon, year1.totalSpent, year3.totalSpent, year5.totalSpent]);

  // Helper estimasi waktu capai barang impian
  const calculateTimeNeeded = (price: number, monthlyRate: number) => {
    if (price <= 0 || monthlyRate <= 0) return 'Belum terhitung';
    const months = Math.ceil(price / monthlyRate);
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    if (yrs > 0 && mos > 0) return `${yrs} Thn ${mos} Bln`;
    if (yrs > 0) return `${yrs} Tahun`;
    return `${mos} Bulan`;
  };

  // SVG Chart Coordinates
  const chartWidth = 600;
  const chartHeight = 160;
  const maxChartVal = (year5?.totalSpent || 100_000) * 1.15;

  const pointsSpent = projections
    .map((p, i) => {
      const x = (i / (projections.length - 1)) * chartWidth;
      const y = chartHeight - (p.totalSpent / maxChartVal) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = [
    `0,${chartHeight}`,
    ...projections.map((p, i) => {
      const x = (i / (projections.length - 1)) * chartWidth;
      const y = chartHeight - (p.totalSpent / maxChartVal) * chartHeight;
      return `${x},${y}`;
    }),
    `${chartWidth},${chartHeight}`
  ].join(' ');

  // Handler Bagikan Langsung ke WhatsApp
  const handleShareWhatsApp = () => {
    const activeHabits = habits.filter((h) => h.enabled && h.amount > 0);
    const activeHabitsList = activeHabits.length > 0
      ? activeHabits.map((h) => `• ${h.name || 'Pengeluaran'}: ${formatIDR(h.amount)} (${h.frequencyPerWeek}x/minggu)`).join('\n')
      : '• Belum ada kebiasaan aktif';

    const filledDreamItems = dreamItems.filter((i) => (i.name && i.name.trim() !== '') || i.price > 0);
    const dreamItemsSummary = filledDreamItems.length > 0
      ? filledDreamItems.map((item, idx) => {
          const timeNeeded = item.price > 0 && monthlySavedDeposit > 0 ? calculateTimeNeeded(item.price, monthlySavedDeposit) : 'Belum ditentukan';
          const progress = item.price > 0 ? Math.min(100, Math.round((targetSavedFund / item.price) * 100)) : 0;
          const status = targetSavedFund >= item.price && item.price > 0
            ? '✅ Sudah Terbeli Tunai!'
            : `⏳ Kurang ${formatIDR(Math.max(0, item.price - targetSavedFund))} (dlm ~${timeNeeded})`;
          return `${idx + 1}. *${item.name || 'Target Impian'}*\n   Target Harga: ${formatIDR(item.price)}\n   Progres (${benchmarkHorizon} Thn): ${progress}% | ${status}`;
        }).join('\n\n')
      : '• Belum ada target barang impian';

    const text = `*💰 HabitCost — Ringkasan Tabungan Kebiasaan*

*Daftar Kebiasaan yang Dihemat:*
${activeHabitsList || '• Belum ada kebiasaan aktif'}

*Komitmen Penghematan:* ${reductionPercent}%
*Total Diselamatkan:* *${formatIDR(monthlySavedDeposit)} / bulan*

📊 *Akumulasi Kas Tabungan:*
• 1 Tahun: ${formatIDR(year1.totalSpent)}
• 3 Tahun: ${formatIDR(year3.totalSpent)} (Patokan Utama)
• 5 Tahun: ${formatIDR(year5.totalSpent)}

🎯 *Target 3 Barang Impian:*
${dreamItemsSummary}

_Dihitung otomatis via HabitCost Simulator_ 🚀`;

    try {
      navigator.clipboard.writeText(text);
    } catch {}

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    // CONTAINER DENGAN BACKGROUND BERTEKSTUR WATERMARK & IKON ABSTRAK
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-[#FCFAF7] via-[#F4E9DC] to-[#DECBB4] text-[#1E242B] py-6 sm:py-12 px-3 sm:px-6 lg:px-10 font-sans antialiased selection:bg-[#EBD8C3] selection:text-[#1E242B]">
      
      {/* LAPISAN BACKGROUND ABSTRAK: WATERMARK MATA UANG & IKON KEGIATAN SEHARI-HARI */}
      <AbstractBackgroundMotif />

      <div className="max-w-5xl mx-auto space-y-7 sm:space-y-11 relative z-10">

        {/* ======================================================== */}
        {/* HEADER APLIKASI: JUDUL DITENGAH & TAMPILAN BERSIH        */}
        {/* ======================================================== */}
        <header className="text-center space-y-4 sm:space-y-6 pt-2 sm:pt-4">
          {/* Badge Atas */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E242B] text-[#FAF7F2] text-xs sm:text-sm font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E5B588]" />
            Kalkulator Alih Pengeluaran Mikro ke Aset Nyata
          </div>

          {/* Judul Utama di Tengah */}
          <div className="space-y-2 max-w-3xl mx-auto px-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1E242B] leading-tight">
              HabitCost
            </h1>
            <p className="text-sm sm:text-xl text-[#5A4535] font-semibold leading-relaxed">
              Konversikan pengeluaran harian kecilmu menjadi wujud aset nyata dan impian produktif.
            </p>
          </div>

          {/* Ringkasan Cepat & Tombol Bagikan WhatsApp */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md border-2 border-[#D5C1AE] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[0_8px_30px_-6px_rgba(80,50,20,0.1)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-base text-[#5A4535]">
              <span className="font-semibold">Diselamatkan:</span>
              <span className="font-mono font-extrabold text-[#783D19] bg-[#FAF3EB] px-3.5 py-1 rounded-full border border-[#DEC5B3] text-sm sm:text-base">
                {formatIDR(monthlySavedDeposit)} / bulan
              </span>
            </div>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95"
            >
              {copiedNotification ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              )}
              <span>{copiedNotification ? 'Membuka WA...' : 'Bagikan ke WhatsApp'}</span>
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* BAGIAN 1: PENGATURAN KEBIASAAN (TABEL 1)                 */}
        {/* ======================================================== */}
        <section className="bg-white/95 backdrop-blur-md border-2 border-[#D5C1AE] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_4px_24px_-4px_rgba(80,50,20,0.08)] space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-[#EAE1D5] pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1E242B] text-white text-sm sm:text-base font-black flex items-center justify-center shadow-xs shrink-0 mt-0.5 sm:mt-0">
                01
              </span>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-[#1E242B]">Daftar Kebiasaan Pengeluaranmu</h2>
                <p className="text-xs sm:text-sm text-[#6B5A4E] mt-0.5">Ketik nama dan nominal pengeluaran sendiri sesuai rutinitas harian</p>
              </div>
            </div>

            {/* Tombol Tambah: Cokelat Elegan */}
            <button
              type="button"
              onClick={addNewHabit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-[#783D19] hover:bg-[#612E11] px-4 py-2.5 rounded-xl sm:rounded-2xl transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Kebiasaan Baru
            </button>
          </div>

          {/* Kartu Kebiasaan yang Sudah Ada / Tampilan Kosong Awal */}
          {habits.length === 0 ? (
            <div className="text-center py-10 sm:py-14 px-6 bg-[#FAF6F0] rounded-3xl border-2 border-dashed border-[#D5C1AE] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF3EB] border-2 border-[#783D19]/30 flex items-center justify-center text-[#783D19] shadow-xs">
                <PiggyBank className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-[#1E242B]">Belum Ada Pengeluaran yang Dicatat</h3>
                <p className="text-sm sm:text-base text-[#6B5A4E] max-w-md mx-auto">
                  Mulai catat kebiasaan pengeluaran rutinmu (seperti jajan kopi, rokok, ojol, atau belanja mingguan).
                </p>
              </div>
              <button
                type="button"
                onClick={addNewHabit}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold text-white bg-[#783D19] hover:bg-[#612E11] px-6 py-3 rounded-2xl transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Tambah Kebiasaan Pertama
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <span className="block text-sm font-extrabold text-[#5A4535] uppercase tracking-wider">
                  Pilih kebiasaan untuk diedit:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {habits.map((h) => {
                    const isSelected = activeHabit && h.id === activeHabit.id;
                    return (
                      <div
                        key={h.id}
                        onClick={() => setActiveHabitId(h.id)}
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#FAF3EB] border-[#783D19] ring-2 ring-[#783D19]/40 shadow-sm'
                            : 'bg-[#FCFAF7] border-[#D8C7B5] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={h.enabled}
                            onChange={(e) => toggleHabit(h.id, e as any)}
                            title="Aktifkan / nonaktifkan kebiasaan ini"
                            className="w-5 h-5 rounded text-[#783D19] focus:ring-[#783D19] border-[#D1C0AF] accent-[#783D19] cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className={`text-base sm:text-lg font-bold truncate ${h.enabled ? 'text-[#1E242B]' : 'text-stone-400 line-through'}`}>
                              {h.name.trim() !== '' ? h.name : '(Belum diberi nama)'}
                            </div>
                            <div className="text-xs sm:text-sm text-[#783D19] font-mono font-bold mt-0.5">
                              {formatIDR(h.amount)} &bull; {h.frequencyPerWeek}x/mgg
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => removeHabit(h.id, e)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#800020] hover:bg-[#FDF2F4] transition-colors cursor-pointer"
                          title="Hapus kebiasaan ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Detail Edit Kebiasaan Aktif */}
              {activeHabit && (
                <div className="bg-[#FAF6F0] border-2 border-[#DECBB8] rounded-3xl p-5 sm:p-7 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#E8D8C7] pb-3.5">
                    <span className="text-sm sm:text-base font-bold text-[#1E242B] uppercase tracking-wide">
                      Sedang Mengatur: <span className="text-[#783D19] font-black">{activeHabit.name.trim() !== '' ? activeHabit.name : '(Baru)'}</span>
                    </span>
                    <span className="text-xs sm:text-sm text-[#6B5A4E]">
                      Ketik langsung nama &amp; nominal di bawah
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nama Kebiasaan */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-[#4E392B] uppercase tracking-wide mb-2">
                        Nama Pengeluaran / Kebiasaan
                      </label>
                      <input
                        type="text"
                        value={activeHabit.name}
                        onChange={(e) => updateActiveHabit({ name: e.target.value })}
                        placeholder="Misal: Kopi Americano, Rokok, GoFood, Top Up..."
                        className="w-full bg-white border-2 border-[#D5C1AE] rounded-2xl px-4 py-3 text-base sm:text-lg font-bold text-[#1E242B] focus:outline-none focus:ring-2 focus:ring-[#783D19]/30 focus:border-[#783D19] transition-all"
                      />
                    </div>

                    {/* Nominal Ketik Sendiri */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm sm:text-base">
                        <span className="font-bold text-[#4E392B] uppercase tracking-wide">Nominal per Transaksi</span>
                        <span className="text-[#783D19] font-black font-mono text-base sm:text-lg">{formatIDR(activeHabit.amount)}</span>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7D6B5C] font-black text-sm sm:text-base">
                          Rp
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatThousandNumber(activeHabit.amount)}
                          placeholder="0"
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            const val = raw === '' ? 0 : parseInt(raw, 10);
                            updateActiveHabit({ amount: val });
                          }}
                          className="w-full bg-white border-2 border-[#D5C1AE] rounded-xl sm:rounded-2xl pl-12 pr-4 py-2.5 text-base sm:text-lg font-black text-[#1E242B] focus:outline-none focus:ring-2 focus:ring-[#783D19]/30 focus:border-[#783D19] font-mono"
                        />
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={Math.max(250000, activeHabit.amount)}
                        step={2500}
                        value={activeHabit.amount}
                        onChange={(e) => updateActiveHabit({ amount: Number(e.target.value) })}
                        className="w-full h-2.5 bg-[#E2D2C0] rounded-lg appearance-none cursor-pointer accent-[#783D19]"
                      />
                    </div>

                    {/* Frekuensi Mingguan */}
                    <div className="md:col-span-2 space-y-2 pt-3 border-t border-[#E8D8C7]">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-base">
                        <span className="font-bold text-[#4E392B] uppercase tracking-wide">
                          Frekuensi: <strong className="text-[#1E242B] font-mono font-black">{activeHabit.frequencyPerWeek}x / mgg</strong>
                        </span>
                        <span className="text-[#6B5A4E] font-mono text-xs sm:text-base font-bold">
                          Total: {formatIDR(activeHabit.amount * activeHabit.frequencyPerWeek)} / mgg
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={14}
                        step={1}
                        value={activeHabit.frequencyPerWeek}
                        onChange={(e) => updateActiveHabit({ frequencyPerWeek: Number(e.target.value) })}
                        className="w-full h-2.5 bg-[#E2D2C0] rounded-lg appearance-none cursor-pointer accent-[#800020]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* OPSI PENGURANGAN: HITAM CERAH, MERAH MARUN, COKELAT */}
          <div className="pt-2">
            <div className="bg-[#FAF6F0] border-2 border-[#DECBB8] rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-base font-bold text-[#4E392B] uppercase tracking-wide flex items-center gap-1.5 sm:gap-2">
                  <Percent className="w-4 h-4 text-[#783D19]" />
                  Komitmen Penghematan
                </span>
                <span className="text-xs sm:text-sm font-black text-[#1E242B] bg-white px-2.5 py-1 rounded-full border border-[#DECBB8] font-mono">
                  {reductionPercent}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                {[
                  { pct: 100, title: 'Stop Total', sub: '100%', activeClass: 'bg-[#1E242B] text-white border-[#1E242B]' },
                  { pct: 50, title: 'Kurangi', sub: '50%', activeClass: 'bg-[#800020] text-white border-[#800020]' },
                  { pct: 30, title: 'Kurangi', sub: '30%', activeClass: 'bg-[#783D19] text-white border-[#783D19]' }
                ].map((item) => (
                  <button
                    key={item.pct}
                    type="button"
                    onClick={() => setReductionPercent(item.pct)}
                    className={`py-2 sm:py-3 px-1 sm:px-2 rounded-xl border-2 transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
                      reductionPercent === item.pct
                        ? `${item.activeClass} shadow-md`
                        : 'bg-white border-[#D5C1AE] text-[#4E392B] hover:border-[#1E242B]'
                    }`}
                  >
                    <span className="text-xs sm:text-base font-black leading-tight">{item.title}</span>
                    <span className="text-[10px] sm:text-xs font-semibold opacity-80 mt-0.5">({item.sub})</span>
                  </button>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed">
                {reductionPercent < 100
                  ? `Kamu tetap menikmati kebiasaanmu, tapi menyisihkan ${reductionPercent}% anggarannya ke tabungan tunai.`
                  : 'Berhenti total: Seluruh uang dialihkan langsung ke tabungan aset.'}
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PEMISAH BAGIAN 1 & 2                                     */}
        {/* ======================================================== */}
        <div className="relative flex items-center justify-center">
          <div className="border-t-2 border-[#D5C1AE] w-full"></div>
          <span className="absolute bg-[#F4E9DC] px-4 py-0.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#5A4535] border-2 border-[#D5C1AE] shadow-xs">
            Ringkasan Akumulasi
          </span>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN 2: RINGKASAN AKUMULASI (TABEL 2)                   */}
        {/* ======================================================== */}
        <section className="bg-white/95 backdrop-blur-md border-2 border-[#D5C1AE] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-6">
          <div className="flex items-start sm:items-center gap-3 border-b border-[#EAE1D5] pb-3.5 sm:pb-4">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#800020] text-white text-sm sm:text-base font-black flex items-center justify-center shadow-xs shrink-0 mt-0.5 sm:mt-0">
              02
            </span>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-[#1E242B]">Total Akumulasi Dana Terselamatkan</h2>
              <p className="text-xs sm:text-sm text-[#6B5A4E] mt-0.5">
                {habits.filter((h) => h.enabled).length} kebiasaan aktif &bull; Menghemat {formatIDR(monthlySavedDeposit)} / bulan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
            {/* KARTU 1 TAHUN: MERAH MARUN */}
            <div className="bg-[#FAF6F0] border-2 border-[#800020] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-2.5 sm:space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs sm:text-sm font-black text-[#800020] uppercase tracking-wider">
                <span>Akumulasi 1 Tahun</span>
                <div className="p-1.5 rounded-xl bg-[#FDF2F4] text-[#800020]">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#800020] tracking-tight font-mono truncate">
                {formatIDR(year1.totalSpent)}
              </div>
              <p className="text-xs sm:text-sm text-[#6B5A4E] font-medium">Uang tunai terkumpul (12 bulan)</p>
            </div>

            {/* KARTU 3 TAHUN: COKELAT (PATOKAN UTAMA) */}
            <div className="bg-[#FAF3EB] border-2 border-[#783D19] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-2.5 sm:space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-black text-[#783D19] uppercase tracking-wider">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate">Akumulasi 3 Tahun</span>
                  <span className="text-[10px] font-black bg-[#783D19] text-white px-2 py-0.5 rounded-md shrink-0">Utama</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white text-[#783D19] shrink-0 shadow-xs">
                  <PiggyBank className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#783D19] tracking-tight font-mono truncate">
                {formatIDR(year3.totalSpent)}
              </div>
              <p className="text-xs sm:text-sm text-[#6B5A4E] font-medium">Dapat dibelikan aset besar secara tunai</p>
            </div>

            {/* KARTU 5 TAHUN: HITAM CERAH */}
            <div className="bg-[#FAF6F0] border-2 border-[#1E242B] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-2.5 sm:space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs sm:text-sm font-black text-[#1E242B] uppercase tracking-wider">
                <span>Akumulasi 5 Tahun</span>
                <div className="p-1.5 rounded-xl bg-[#F4F6F8] text-[#1E242B]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E242B] tracking-tight font-mono truncate">
                {formatIDR(year5.totalSpent)}
              </div>
              <p className="text-xs sm:text-sm text-[#6B5A4E] font-medium">Disiplin tabungan jangka panjang (60 bulan)</p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PEMISAH BAGIAN 2 & 3                                     */}
        {/* ======================================================== */}
        <div className="relative flex items-center justify-center">
          <div className="border-t-2 border-[#D5C1AE] w-full"></div>
          <span className="absolute bg-[#F4E9DC] px-4 py-0.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#5A4535] border-2 border-[#D5C1AE] shadow-xs">
            Grafik Proyeksi
          </span>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN 3: GRAFIK PROYEKSI TABUNGAN                       */}
        {/* ======================================================== */}
        <section className="bg-white/95 backdrop-blur-md border-2 border-[#D5C1AE] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE1D5] pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#783D19] text-white text-sm sm:text-base font-black flex items-center justify-center shadow-xs shrink-0 mt-0.5 sm:mt-0">
                03
              </span>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-[#1E242B]">
                  Grafik Pertumbuhan Tabungan <span className="whitespace-nowrap">(5 Tahun)</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5A4E] mt-0.5">Pertumbuhan akumulasi uang kas yang berhasil kamu selamatkan</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm font-bold self-start sm:self-center">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 sm:w-4 sm:h-2 bg-[#783D19] rounded-sm"></span>
                <span className="text-[#783D19] font-black">Pertumbuhan Kas Tunai</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#FAF6F0] border-2 border-[#DECBB8] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-36 sm:h-52 overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#783D19" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#783D19" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = chartHeight * pct;
                return (
                  <line
                    key={idx}
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#E2D2C0"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Area shading halus di bawah garis */}
              <polygon fill="url(#chartGradient)" points={areaPoints} />

              {/* Garis Tabungan Kas: Cokelat */}
              <polyline
                fill="none"
                stroke="#783D19"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsSpent}
              />

              {/* Titik data tiap tahun */}
              {projections.map((p, i) => {
                const cx = (i / (projections.length - 1)) * chartWidth;
                const cy = chartHeight - (p.totalSpent / maxChartVal) * chartHeight;
                return (
                  <circle
                    key={p.year}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    className="fill-[#783D19] stroke-white stroke-2"
                  />
                );
              })}
            </svg>

            <div className="flex justify-between text-xs sm:text-sm font-mono font-bold text-[#6B5A4E] mt-4 pt-3 border-t border-[#E8D8C7]">
              {projections.map((p) => (
                <div key={p.year} className="text-center">
                  <div className="text-[#6B5A4E]">Thn {p.year}</div>
                  <div className="text-[#783D19] font-black text-xs sm:text-sm">
                    <span className="sm:hidden">
                      {p.totalSpent >= 1_000_000
                        ? `${(p.totalSpent / 1_000_000).toFixed(1).replace('.', ',')} jt`
                        : formatIDR(p.totalSpent)}
                    </span>
                    <span className="hidden sm:inline">
                      {formatIDR(p.totalSpent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PEMISAH BAGIAN 3 & 4                                     */}
        {/* ======================================================== */}
        <div className="relative flex items-center justify-center">
          <div className="border-t-2 border-[#D5C1AE] w-full"></div>
          <span className="absolute bg-[#F4E9DC] px-4 py-0.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#5A4535] border-2 border-[#D5C1AE] shadow-xs">
            Target 3 Barang Impian
          </span>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN 4: TARGET 3 BARANG IMPIAN (BEBAS DIATUR OLEH USER)*/}
        {/* ======================================================== */}
        <section className="bg-white/95 backdrop-blur-md border-2 border-[#D5C1AE] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs space-y-5 sm:space-y-6">
          <div className="flex flex-col gap-3.5 border-b border-[#EAE1D5] pb-4">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1E242B] text-white text-sm sm:text-base font-black flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                04
              </span>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-[#1E242B]">Target 3 Barang Impianmu</h2>
                <p className="text-xs sm:text-sm text-[#6B5A4E] mt-0.5">
                  Tentukan sendiri 3 barang atau impian yang ingin kamu capai. Jika harga naik atau turun, kamu bisa langsung mengubah harganya di sini.
                </p>
              </div>
            </div>

            {/* Pemilih Periode Acuan (1, 3, 5 Tahun) & Inspirasi Ide */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full pt-1">
              {/* Tombol Aksi Kiri */}
              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadInspirationItems}
                  className="text-xs sm:text-sm px-3 py-2 rounded-xl font-bold text-[#783D19] hover:bg-[#FAF3EB] bg-[#FAF6F0] border-2 border-[#DECBB8] transition-all cursor-pointer text-center"
                  title="Isi dengan contoh barang impian populer"
                >
                  💡 Contoh Ide
                </button>
                <button
                  type="button"
                  onClick={clearDreamItems}
                  className="text-xs sm:text-sm px-3 py-2 rounded-xl font-bold text-[#6B5A4E] hover:text-[#800020] hover:bg-[#FDF2F4] bg-[#FAF6F0] border-2 border-[#DECBB8] transition-all cursor-pointer text-center"
                  title="Kosongkan semua target"
                >
                  Kosongkan
                </button>
              </div>

              {/* Pemilih Periode Bandingkan Kanan */}
              <div className="flex items-center justify-between sm:justify-start gap-1 bg-[#FAF6F0] p-1 rounded-2xl border-2 border-[#DECBB8] w-full sm:w-auto">
                <span className="text-xs sm:text-sm font-bold text-[#6B5A4E] px-2 whitespace-nowrap">Bandingkan:</span>
                <div className="grid grid-cols-3 gap-1 flex-1 sm:flex-none">
                  {([1, 3, 5] as const).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setBenchmarkHorizon(yr)}
                      className={`text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold transition-all text-center cursor-pointer ${
                        benchmarkHorizon === yr
                          ? 'bg-[#1E242B] text-white shadow-xs'
                          : 'text-[#5A4535] hover:text-[#1E242B]'
                      }`}
                    >
                      {yr} Tahun
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3 KARTU BARANG IMPIAN: COKELAT, MERAH MARUN, HITAM CERAH */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {dreamItems.map((item, index) => {
              const isAffordable = targetSavedFund >= item.price && item.price > 0;
              const surplus = isAffordable ? targetSavedFund - item.price : 0;
              const deficit = !isAffordable && item.price > 0 ? item.price - targetSavedFund : 0;
              const progressPercent = item.price > 0
                ? Math.min(100, Math.round((targetSavedFund / item.price) * 100))
                : 0;
              const timeNeeded = item.price > 0 && monthlySavedDeposit > 0
                ? calculateTimeNeeded(item.price, monthlySavedDeposit)
                : (item.price === 0 ? 'Belum ditentukan' : 'Perlu tabungan aktif');

              const theme = [
                {
                  badgeBg: 'bg-[#783D19]',
                  borderColor: 'border-[#783D19]',
                  progressBg: 'bg-[#783D19]',
                  lightBg: 'bg-[#FAF3EB]',
                  textColor: 'text-[#783D19]',
                  accentBorder: 'border-[#DEC5B3]'
                },
                {
                  badgeBg: 'bg-[#800020]',
                  borderColor: 'border-[#800020]',
                  progressBg: 'bg-[#800020]',
                  lightBg: 'bg-[#FDF2F4]',
                  textColor: 'text-[#800020]',
                  accentBorder: 'border-[#EAB8C1]'
                },
                {
                  badgeBg: 'bg-[#1E242B]',
                  borderColor: 'border-[#1E242B]',
                  progressBg: 'bg-[#1E242B]',
                  lightBg: 'bg-[#F4F6F8]',
                  textColor: 'text-[#1E242B]',
                  accentBorder: 'border-[#D1D7DE]'
                }
              ][index] || {
                badgeBg: 'bg-[#783D19]',
                borderColor: 'border-[#783D19]',
                progressBg: 'bg-[#783D19]',
                lightBg: 'bg-[#FAF3EB]',
                textColor: 'text-[#783D19]',
                accentBorder: 'border-[#DEC5B3]'
              };

              return (
                <div
                  key={item.id}
                  className={`bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 ${theme.borderColor} shadow-xs flex flex-col justify-between space-y-4 sm:space-y-5 hover:shadow-lg transition-all relative overflow-hidden`}
                >
                  {/* Header Kartu */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#EAE1D5] pb-3 sm:pb-3.5">
                    <span className={`px-3 py-1 rounded-xl text-white text-xs sm:text-sm font-black uppercase tracking-wider ${theme.badgeBg}`}>
                      Target Impian #{index + 1}
                    </span>
                    {item.price <= 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl bg-[#FAF6F0] border border-[#DECBB8] text-[#6B5A4E] text-xs sm:text-sm font-bold">
                        Belum Diisi
                      </span>
                    ) : isAffordable ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl bg-[#FAF3EB] border border-[#DEC5B3] text-[#783D19] text-xs sm:text-sm font-black">
                        <Check className="w-3.5 h-3.5 text-[#783D19]" />
                        Tercapai Tunai!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl bg-[#FAF6F0] border border-[#DECBB8] text-[#800020] text-xs sm:text-sm font-bold font-mono">
                        {progressPercent}%
                      </span>
                    )}
                  </div>

                  {/* Form Edit Nama & Harga Barang */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#4E392B] uppercase tracking-wide mb-1.5">
                        Nama Barang Impian
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleNameChange(item.id, e.target.value)}
                        placeholder={`Ketik barang impian #${index + 1}...`}
                        className="w-full bg-[#FAF6F0] border-2 border-[#D5C1AE] rounded-xl sm:rounded-2xl px-3.5 py-2 text-sm sm:text-base font-black text-[#1E242B] focus:outline-none focus:ring-2 focus:ring-[#783D19]/30 focus:border-[#783D19] transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
                        <label className="text-xs sm:text-sm font-bold text-[#4E392B] uppercase tracking-wide">
                          Target Harga (Rp)
                        </label>
                        <span className="text-[11px] text-[#783D19]/70 font-semibold">
                          (Bisa diubah kapan saja)
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D6B5C] font-black text-sm sm:text-base">
                          Rp
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatThousandNumber(item.price)}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          placeholder="0"
                          className="w-full bg-[#FAF6F0] border-2 border-[#D5C1AE] rounded-xl sm:rounded-2xl pl-11 pr-3.5 py-2 text-base sm:text-lg font-black text-[#1E242B] font-mono focus:outline-none focus:ring-2 focus:ring-[#783D19]/30 focus:border-[#783D19] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Progress & Estimasi Waktu */}
                  <div className="pt-2 border-t border-[#EAE1D5] space-y-2.5">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#5A4535] mb-1">
                        <span className="truncate pr-1">Tabungan {benchmarkHorizon} Thn ({formatIDR(targetSavedFund)}):</span>
                        <span className={`font-mono font-black ${theme.textColor} shrink-0`}>
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E8D8C7] h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`${theme.progressBg} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Ringkasan Waktu & Status */}
                    <div className={`p-3 rounded-xl sm:rounded-2xl ${theme.lightBg} border ${theme.accentBorder} space-y-1.5`}>
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-[#6B5A4E] font-bold">Estimasi Terbeli Tunai:</span>
                        <span className={`font-black font-mono text-xs sm:text-sm ${theme.textColor} shrink-0 text-right`}>
                          {timeNeeded}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-[#6B5A4E] font-medium">Status ({benchmarkHorizon} Thn):</span>
                        {item.price <= 0 ? (
                          <span className="font-mono font-medium text-[#6B5A4E] shrink-0 text-right">
                            Masukkan target harga
                          </span>
                        ) : isAffordable ? (
                          <span className="font-mono font-extrabold text-[#783D19] shrink-0 text-right">
                            Sisa Kas: +{formatIDR(surplus)}
                          </span>
                        ) : (
                          <span className="font-mono font-extrabold text-[#800020] shrink-0 text-right">
                            Kurang {formatIDR(deficit)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* FOOTER                                                   */}
        {/* ======================================================== */}
        <footer className="text-center text-sm text-[#6B5A4E] pt-4 pb-12 space-y-1.5">
          <p className="font-black text-[#1E242B] text-base">HabitCost &bull; Kalkulator Alih Biaya Kebiasaan ke Aset Riil</p>
          <p className="text-xs sm:text-sm text-[#7D6B5C]">100% Client-Side Engine &bull; Data tersimpan otomatis di browser</p>
        </footer>

      </div>
    </div>
  );
}
