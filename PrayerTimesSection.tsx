import React, { useState, useEffect } from 'react';
import { CityLocation } from '../types';
import { calculatePrayerTimes, calculateQiblaBearing, CALCULATION_METHODS } from '../utils/prayerTimes';
import { Clock, Compass, CheckCircle2, Circle, Volume2, ShieldCheck, Settings } from 'lucide-react';

interface PrayerTimesSectionProps {
  location: CityLocation;
}

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({ location }) => {
  const [calculationMethod, setCalculationMethod] = useState('MWL');
  const [completedPrayers, setCompletedPrayers] = useState<{ [key: string]: boolean }>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load completed prayers for today
  const todayKey = new Date().toISOString().split('T')[0];
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`prayers_${todayKey}`);
      if (saved) setCompletedPrayers(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, [todayKey]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePrayerCompleted = (prayer: string) => {
    const next = { ...completedPrayers, [prayer]: !completedPrayers[prayer] };
    setCompletedPrayers(next);
    try {
      localStorage.setItem(`prayers_${todayKey}`, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const rawTimes = calculatePrayerTimes(currentTime, location, calculationMethod);
  const qiblaBearing = calculateQiblaBearing(location.lat, location.lng);

  const prayerList = [
    { id: 'Fajr', name: 'Fajr (Dawn)', arabic: 'الفجر', time: rawTimes.Fajr },
    { id: 'Sunrise', name: 'Sunrise (Shuruq)', arabic: 'الشروق', time: rawTimes.Sunrise, isSunrise: true },
    { id: 'Dhuhr', name: 'Dhuhr (Noon)', arabic: 'الظهر', time: rawTimes.Dhuhr },
    { id: 'Asr', name: 'Asr (Afternoon)', arabic: 'العصر', time: rawTimes.Asr },
    { id: 'Maghrib', name: 'Maghrib (Sunset)', arabic: 'المغرب', time: rawTimes.Maghrib },
    { id: 'Isha', name: 'Isha (Night)', arabic: 'العشاء', time: rawTimes.Isha },
  ];

  // Helper to determine next prayer and remaining countdown
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  let nextPrayerId = 'Fajr';
  let diffMinutes = 0;

  for (const p of prayerList) {
    if (p.isSunrise) continue;
    const [h, m] = p.time.split(':').map(Number);
    const pMinutes = h * 60 + m;
    if (pMinutes > currentMinutes) {
      nextPrayerId = p.id;
      diffMinutes = pMinutes - currentMinutes;
      break;
    }
  }

  // If after Isha, next is Fajr tomorrow
  if (diffMinutes === 0) {
    const [h, m] = rawTimes.Fajr.split(':').map(Number);
    const fajrMinutes = h * 60 + m;
    diffMinutes = 24 * 60 - currentMinutes + fajrMinutes;
    nextPrayerId = 'Fajr';
  }

  const hoursRemaining = Math.floor(diffMinutes / 60);
  const minsRemaining = diffMinutes % 60;

  const playAdhanPreview = () => {
    const audio = new Audio('https://cdn.aladhan.com/audio/adhans/makkah.mp3');
    audio.play().catch(() => {
      // If blocked by browser autoplay policy
      console.log('Audio playback prevented by browser');
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Next Prayer & Countdown */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Next Prescribed Prayer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              {nextPrayerId}
              <span className="text-sm font-normal text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                in {hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}{minsRemaining}m
              </span>
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Location: <span className="text-emerald-400 font-medium">{location.city}, {location.country}</span> • Calculated time: <span className="font-semibold text-white">{rawTimes[nextPrayerId]}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={playAdhanPreview}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer active:scale-95"
              title="Play Makkah Adhan call to prayer sample"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hear Adhan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prayer Time Cards & Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Today's Daily Prayers</span>
              <span className="text-xs text-slate-400 font-normal">
                (Click circle to mark completed)
              </span>
            </h3>

            {/* Method selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <select
                aria-label="Calculation Method"
                value={calculationMethod}
                onChange={(e) => setCalculationMethod(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none cursor-pointer"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} Method
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {prayerList.map((prayer) => {
              const isNext = prayer.id === nextPrayerId && !prayer.isSunrise;
              const isCompleted = completedPrayers[prayer.id];

              return (
                <div
                  key={prayer.id}
                  className={`p-4 rounded-xl border transition-all duration-200 relative ${
                    isNext
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">
                      {prayer.name}
                    </span>
                    <span className="text-sm font-arabic text-emerald-400/90 font-bold">
                      {prayer.arabic}
                    </span>
                  </div>

                  <div className="text-2xl font-bold tracking-tight text-white mb-3">
                    {prayer.time}
                  </div>

                  {!prayer.isSunrise ? (
                    <button
                      onClick={() => togglePrayerCompleted(prayer.id)}
                      className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Prayed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-slate-500" />
                          <span>Mark Prayed</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-xs text-slate-500 py-1.5 text-center">
                      Sunrise prohibition ends
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick tracker stats */}
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Daily Prayer Completion:
            </span>
            <span className="font-semibold text-emerald-400">
              {Object.values(completedPrayers).filter(Boolean).length} of 5 Fardh prayers
            </span>
          </div>
        </div>

        {/* Qibla Direction Compass Card */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-between">
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Qibla Direction</span>
            </div>
            <h4 className="text-xl font-bold text-white">Towards Makkah</h4>
            <p className="text-xs text-slate-400 mt-1">
              Ka'bah direction from {location.city}: <span className="font-bold text-emerald-400">{qiblaBearing}°</span>
            </p>
          </div>

          {/* Graphical Compass */}
          <div className="my-6 relative w-48 h-48 flex items-center justify-center">
            {/* Outer Compass Ring */}
            <div className="w-48 h-48 rounded-full border-2 border-slate-700 bg-slate-950/70 flex items-center justify-center relative shadow-inner">
              <span className="absolute top-2 text-xs font-bold text-red-400">N</span>
              <span className="absolute bottom-2 text-xs font-bold text-slate-400">S</span>
              <span className="absolute right-2 text-xs font-bold text-slate-400">E</span>
              <span className="absolute left-2 text-xs font-bold text-slate-400">W</span>

              {/* Degrees markings */}
              <div className="w-36 h-36 rounded-full border border-dashed border-slate-800 flex items-center justify-center">
                {/* Rotating Qibla Needle */}
                <div
                  className="w-full h-full relative transition-transform duration-700 ease-out flex items-center justify-center"
                  style={{ transform: `rotate(${qiblaBearing}deg)` }}
                >
                  {/* Arrow Pointing to Qibla */}
                  <div className="absolute top-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[24px] border-b-emerald-400 filter drop-shadow(0 0 4px rgba(52,211,153,0.8))" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-md ring-2 ring-emerald-500/50" />
                  <div className="absolute bottom-3 w-1.5 h-10 bg-slate-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-emerald-950/30 rounded-xl p-3 border border-emerald-900/40 text-center">
            <span className="text-xs text-emerald-300 font-medium">
              Bearing: <span className="text-white font-bold">{qiblaBearing}°</span> from True North
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Face this direction during your Salah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
