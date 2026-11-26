import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_DIR = dirname(fileURLToPath(import.meta.url));
const ENTRY_OUT = join(REPO_DIR, 'entry.png');
const THUMB_OUT = join(REPO_DIR, '..', 'preview-300.png');

const REGIONS = [
  { id: 'asia', name: 'ASIA', color: '#B45309' },
  { id: 'europe', name: 'EUROPE', color: '#1F4B7A' },
  { id: 'americas', name: 'AMERICAS', color: '#5A3D82' },
  { id: 'africa', name: 'AFRICA', color: '#276749' },
  { id: 'mideast', name: 'M. EAST', color: '#9D2B22' },
  { id: 'oceania', name: 'OCEANIA', color: '#0E7490' },
  { id: 'antarctica', name: 'ANTARCTICA', color: '#475569' },
];

const UTC_STRIP = [
  { time: '00:18 UTC', label: 'Shenzhou-24 liftoff' },
  { time: '03:56 UTC', label: 'Tiangong docking' },
  { time: '06:30 UTC', label: 'Kospi closes -6.2%' },
  { time: '09:00 UTC', label: 'Canberra pact signed' },
  { time: '14:00 UTC', label: 'USTR 14-nation tariffs' },
  { time: '21:00 UTC', label: 'Dow +164, tech dips' },
];

const KPI_STRIP = [
  { num: '14', label: 'Tariff targets' },
  { num: '-6.2%', label: 'Kospi rout' },
  { num: '31+', label: 'Cairo dead' },
  { num: '490,334', label: 'Russian dead' },
  { num: 'AU$740M', label: 'Pacific pact' },
  { num: '~2,000', label: 'El Hierro' },
];

const LEAD_STORIES = [
  {
    id: 1,
    region: 'americas',
    loc: 'WASHINGTON / GLOBAL',
    beat: 'TRADE',
    pill: 'CONFIRMED · USTR, REUTERS',
    headline: 'US unveils Section 301 tariffs targeting 14 economies',
    summary:
      'USTR cites excess capacity, proposing up to 20% on China (40% if truce lapses) and 15% caps on EU, Japan, S. Korea & 10 more; Beijing & Brussels reject claim.',
    lat: 38.9,
    lon: -77.0,
    art: `<svg viewBox="0 0 322 118" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="322" height="118" fill="#E6ECF2"/>
      <rect y="82" width="322" height="36" fill="#D5C8B2"/>
      <!-- US Flag mini with stars -->
      <rect x="14" y="12" width="54" height="32" fill="#FFF" stroke="#111" stroke-width="1.3"/>
      <rect x="14" y="16" width="54" height="4" fill="#B91C1C"/><rect x="14" y="24" width="54" height="4" fill="#B91C1C"/>
      <rect x="14" y="32" width="54" height="4" fill="#B91C1C"/><rect x="14" y="40" width="54" height="4" fill="#B91C1C"/>
      <rect x="14" y="12" width="25" height="18" fill="#1E3A8A"/>
      <circle cx="19" cy="17" r="1.2" fill="#FFF"/><circle cx="26" cy="17" r="1.2" fill="#FFF"/><circle cx="33" cy="17" r="1.2" fill="#FFF"/>
      <circle cx="22.5" cy="21" r="1.2" fill="#FFF"/><circle cx="29.5" cy="21" r="1.2" fill="#FFF"/>
      <circle cx="19" cy="25" r="1.2" fill="#FFF"/><circle cx="26" cy="25" r="1.2" fill="#FFF"/><circle cx="33" cy="25" r="1.2" fill="#FFF"/>
      <!-- Tariff Ledger Document -->
      <rect x="86" y="10" width="150" height="72" rx="2" fill="#FFFDF7" stroke="#181818" stroke-width="1.6"/>
      <rect x="86" y="10" width="150" height="16" fill="#1F2937"/>
      <text x="161" y="21" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#FFF">SECTION 301 SCHEDULE</text>
      <text x="94" y="39" font-family="Arial,sans-serif" font-size="9.5" font-weight="800" fill="#111">CHINA</text>
      <rect x="176" y="30" width="52" height="12" rx="2" fill="#A81D1D"/>
      <text x="202" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#FFF">20%-40%</text>
      <text x="94" y="55" font-family="Arial,sans-serif" font-size="9.5" font-weight="800" fill="#111">EU / JP / KR</text>
      <rect x="176" y="46" width="52" height="12" rx="2" fill="#1F4B7A"/>
      <text x="202" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#FFF">≤15% CAP</text>
      <text x="94" y="71" font-family="Arial,sans-serif" font-size="8.8" font-weight="800" fill="#444">+ 10 ASIAN PARTNERS</text>
      <!-- China & EU flags right -->
      <rect x="254" y="12" width="54" height="32" fill="#DE2910" stroke="#111" stroke-width="1.3"/>
      <polygon points="264,22 266,28 272,28 267,31 269,37 264,33 259,37 261,31 256,28 262,28" fill="#FFDE00"/>
      <rect x="254" y="48" width="54" height="30" fill="#003399" stroke="#111" stroke-width="1.3"/>
      <circle cx="281" cy="63" r="9" fill="none" stroke="#FFCC00" stroke-width="2.2" stroke-dasharray="2,3"/>
      <!-- Shipping crates left -->
      <rect x="14" y="54" width="32" height="24" fill="#92400E" stroke="#111" stroke-width="1.2"/>
      <line x1="14" y1="62" x2="46" y2="62" stroke="#FDE68A" stroke-width="1"/>
      <rect x="48" y="58" width="30" height="20" fill="#B45309" stroke="#111" stroke-width="1.2"/>
      <!-- Big Thumbnail Stamp -->
      <rect x="34" y="88" width="254" height="24" rx="2" fill="#A81D1D"/>
      <text x="161" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="900" fill="#FFF" letter-spacing="0.4">14 ECONOMIES · 20%</text>
    </svg>`,
  },
  {
    id: 2,
    region: 'asia',
    loc: 'SEOUL / TAIPEI',
    beat: 'MARKETS',
    pill: 'CONFIRMED · KRX, REUTERS',
    headline: 'Asian chip rout sinks Kospi 6.16%; SK Hynix -11%',
    summary:
      'Kospi closes at 4,697.51 as SK Hynix (-11.05%) and Samsung (-9.87%) slide on AI memory downgrades & tariff jitters; Taiex -4.8%, Nikkei -2.8%.',
    lat: 37.57,
    lon: 126.98,
    art: `<svg viewBox="0 0 322 118" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="322" height="118" fill="#F8EFEA"/>
      <line x1="16" y1="24" x2="306" y2="24" stroke="#E0D4C8" stroke-width="1"/>
      <line x1="16" y1="46" x2="306" y2="46" stroke="#E0D4C8" stroke-width="1"/>
      <line x1="16" y1="68" x2="306" y2="68" stroke="#E0D4C8" stroke-width="1"/>
      <!-- Silicon chip icon with pins -->
      <g stroke="#475569" stroke-width="1.5">
        <line x1="252" y1="8" x2="252" y2="54"/><line x1="262" y1="8" x2="262" y2="54"/>
        <line x1="274" y1="8" x2="274" y2="54"/><line x1="284" y1="8" x2="284" y2="54"/>
        <line x1="294" y1="8" x2="294" y2="54"/>
        <line x1="236" y1="22" x2="310" y2="22"/><line x1="236" y1="31" x2="310" y2="31"/><line x1="236" y1="40" x2="310" y2="40"/>
      </g>
      <rect x="242" y="13" width="62" height="36" rx="3" fill="#1E293B" stroke="#111" stroke-width="1.3"/>
      <rect x="251" y="19" width="44" height="24" fill="#334155" stroke="#94A3B8" stroke-width="1"/>
      <text x="273" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#F8FAFC">DRAM/AI</text>
      <!-- Plunge Area & Line -->
      <polygon points="18,22 72,26 118,34 162,50 206,66 234,76 234,84 18,84" fill="#FCA5A5" opacity="0.5"/>
      <polyline points="18,22 72,26 118,34 162,50 206,66 234,76" fill="none" stroke="#B91C1C" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="234" cy="76" r="4.5" fill="#B91C1C"/>
      <text x="150" y="21" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#7F1D1D">CLOSE 4,697.51</text>
      <!-- Stock badges -->
      <rect x="16" y="42" width="96" height="16" rx="2" fill="#111"/>
      <text x="64" y="53" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#FCA5A5">HYNIX -11.05%</text>
      <rect x="16" y="61" width="96" height="16" rx="2" fill="#374151"/>
      <text x="64" y="72" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#FDE68A">SAMSUNG -9.87%</text>
      <rect x="240" y="57" width="66" height="19" rx="2" fill="#475569"/>
      <text x="273" y="70" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="800" fill="#FFF">TAIEX -4.8%</text>
      <!-- Big Thumbnail Stamp -->
      <rect x="34" y="88" width="254" height="24" rx="2" fill="#991B1B"/>
      <text x="161" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="900" fill="#FFF" letter-spacing="0.4">KOSPI -6.2%</text>
    </svg>`,
  },
  {
    id: 3,
    region: 'asia',
    loc: 'JIUQUAN / ORBIT',
    beat: 'SPACE',
    pill: 'CONFIRMED · CMSA, AP',
    headline: "Pakistan's first astronaut launches on Shenzhou-24",
    summary:
      "Payload specialist Muhammad Zeeshan Ali launches 00:18 UTC with Tang Hongbo & Wu Yi, docking 03:56 UTC as first foreign visitor aboard China's Tiangong.",
    lat: 40.96,
    lon: 100.28,
    art: `<svg viewBox="0 0 322 118" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="322" height="118" fill="#132238"/>
      <!-- Earth curvature -->
      <path d="M0,104 Q161,76 322,104 L322,118 L0,118 Z" fill="#1E4E79" stroke="#60A5FA" stroke-width="2"/>
      <!-- Stars -->
      <circle cx="28" cy="18" r="1.4" fill="#FFF"/><circle cx="74" cy="14" r="1.2" fill="#FDE68A"/>
      <circle cx="248" cy="16" r="1.3" fill="#FFF"/><circle cx="294" cy="28" r="1.5" fill="#FFF"/>
      <!-- Pakistan Flag left -->
      <rect x="14" y="14" width="46" height="30" fill="#01411C" stroke="#E2E8F0" stroke-width="1.2"/>
      <rect x="14" y="14" width="12" height="30" fill="#FFF"/>
      <circle cx="41" cy="29" r="7.5" fill="#FFF"/><circle cx="43.5" cy="27.5" r="6" fill="#01411C"/>
      <!-- China Flag right -->
      <rect x="262" y="14" width="46" height="30" fill="#DE2910" stroke="#E2E8F0" stroke-width="1.2"/>
      <polygon points="271,21 273,26 278,26 274,29 275,34 271,31 267,34 268,29 264,26 269,26" fill="#FFDE00"/>
      <!-- Tiangong Station & Solar Wings -->
      <rect x="88" y="24" width="44" height="12" fill="#2563EB" stroke="#93C5FD" stroke-width="1"/>
      <rect x="88" y="54" width="44" height="12" fill="#2563EB" stroke="#93C5FD" stroke-width="1"/>
      <rect x="190" y="24" width="44" height="12" fill="#2563EB" stroke="#93C5FD" stroke-width="1"/>
      <rect x="190" y="54" width="44" height="12" fill="#2563EB" stroke="#93C5FD" stroke-width="1"/>
      <rect x="128" y="38" width="66" height="14" rx="3" fill="#F1F5F9" stroke="#334155" stroke-width="1.4"/>
      <rect x="152" y="22" width="18" height="46" rx="2" fill="#CBD5E1" stroke="#334155" stroke-width="1.2"/>
      <!-- Shenzhou-24 capsule docking -->
      <polygon points="104,45 124,40 124,50" fill="#FACC15" stroke="#111" stroke-width="1"/>
      <text x="161" y="79" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="800" fill="#BAE6FD">SHENZHOU-24 · M. ZEESHAN ALI</text>
      <!-- Big Thumbnail Stamp -->
      <rect x="34" y="88" width="254" height="24" rx="2" fill="#B45309"/>
      <text x="161" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="900" fill="#FFF" letter-spacing="0.4">TIANGONG · 03:56 UTC</text>
    </svg>`,
  },
];

const MID_STORIES = [
  {
    id: 4,
    region: 'africa',
    loc: 'GIZA, EGYPT',
    pill: 'OFFICIALS · AP',
    headline: 'Ring Road fuel tanker blaze kills 31 in Cairo',
    summary: 'Tanker overturns at Al-Warraq Tunnel 10, burning 27 vehicles & bus; 21 hurt.',
    lat: 30.1,
    lon: 31.21,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#2B1D1A"/>
      <rect y="36" width="188" height="26" fill="#3F3B37"/>
      <rect x="20" y="24" width="68" height="16" rx="6" fill="#9CA3AF" stroke="#111" stroke-width="1.2" transform="rotate(-8 54 32)"/>
      <path d="M52,32 Q62,8 74,26 Q86,4 98,28 Q106,12 114,32 Z" fill="#F97316"/>
      <path d="M62,32 Q72,14 82,28 Q90,14 98,32 Z" fill="#FACC15"/>
      <rect x="114" y="20" width="64" height="22" rx="2" fill="#B91C1C"/>
      <text x="146" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="900" fill="#FFF">31 DEAD</text>
      <text x="94" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="800" fill="#FDE68A">27 VEHICLES · 21 INJURED</text>
    </svg>`,
  },
  {
    id: 5,
    region: 'oceania',
    loc: 'CANBERRA / HONIARA',
    pill: 'CONFIRMED · DFAT',
    headline: 'Australia & Solomons sign AU$740m security pact',
    summary: 'PMs Albanese & Wale bar foreign military bases under 10-year treaty.',
    lat: -9.43,
    lon: 159.95,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#DCEEF3"/>
      <!-- Australia flag with Union Jack & Southern Cross -->
      <rect x="10" y="9" width="46" height="27" fill="#012169" stroke="#111" stroke-width="1"/>
      <rect x="10" y="9" width="21" height="13" fill="#012169"/>
      <line x1="10" y1="9" x2="31" y2="22" stroke="#FFF" stroke-width="2.2"/><line x1="31" y1="9" x2="10" y2="22" stroke="#FFF" stroke-width="2.2"/>
      <line x1="20.5" y1="9" x2="20.5" y2="22" stroke="#C8102E" stroke-width="2.4"/><line x1="10" y1="15.5" x2="31" y2="15.5" stroke="#C8102E" stroke-width="2.4"/>
      <circle cx="20" cy="29" r="2.1" fill="#FFF"/><circle cx="43" cy="14" r="1.4" fill="#FFF"/>
      <circle cx="47" cy="21" r="1.4" fill="#FFF"/><circle cx="41" cy="26" r="1.4" fill="#FFF"/>
      <!-- Solomon Islands flag -->
      <rect x="132" y="9" width="46" height="27" fill="#0051BA" stroke="#111" stroke-width="1"/>
      <polygon points="132,36 178,9 178,36" fill="#215B33"/>
      <line x1="132" y1="36" x2="178" y2="9" stroke="#FCD116" stroke-width="3"/>
      <circle cx="139" cy="15" r="1.1" fill="#FFF"/><circle cx="145" cy="15" r="1.1" fill="#FFF"/><circle cx="142" cy="19" r="1.1" fill="#FFF"/>
      <!-- Treaty scroll -->
      <rect x="64" y="9" width="60" height="26" rx="2" fill="#FFFDF7" stroke="#111" stroke-width="1.2"/>
      <text x="94" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#0E7490">TREATY</text>
      <rect x="18" y="38" width="152" height="20" rx="2" fill="#0E7490"/>
      <text x="94" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="900" fill="#FFF">AU$740M PACT</text>
    </svg>`,
  },
  {
    id: 6,
    region: 'europe',
    loc: 'BERLIN / MOSCOW',
    pill: 'REPORTED · BBC',
    headline: 'Leaked files tally 490,334 Russian war dead',
    summary: 'BBC verifies state leak as Merz warns Bundestag Russia threatens Europe.',
    lat: 52.52,
    lon: 13.4,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#E3E9F0"/>
      <rect x="12" y="10" width="48" height="40" fill="#FFFDF7" stroke="#1E293B" stroke-width="1.3"/>
      <line x1="18" y1="18" x2="54" y2="18" stroke="#64748B" stroke-width="2"/>
      <line x1="18" y1="26" x2="50" y2="26" stroke="#64748B" stroke-width="2"/>
      <line x1="18" y1="34" x2="54" y2="34" stroke="#B91C1C" stroke-width="2"/>
      <line x1="18" y1="42" x2="46" y2="42" stroke="#64748B" stroke-width="2"/>
      <rect x="68" y="8" width="110" height="24" rx="2" fill="#1F4B7A"/>
      <text x="123" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-size="14.5" font-weight="900" fill="#FFF">490,334</text>
      <text x="123" y="45" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#991B1B">MERZ WARNS EU</text>
    </svg>`,
  },
  {
    id: 7,
    region: 'europe',
    loc: 'LONDON, UK',
    pill: 'CONFIRMED · BBC',
    headline: 'UK orders inquiry for 22,000 nuclear test vets',
    summary: 'Probe examines health impact of 1952–67 tests after 40-year campaign.',
    lat: 51.51,
    lon: -0.13,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#E8ECEF"/>
      <circle cx="34" cy="31" r="19" fill="#FACC15" stroke="#111" stroke-width="1.4"/>
      <circle cx="34" cy="31" r="4" fill="#111"/>
      <path d="M34,31 L24,16 A17,17 0 0,1 44,16 Z" fill="#111"/>
      <path d="M34,31 L48,38 A17,17 0 0,1 37,48 Z" fill="#111"/>
      <path d="M34,31 L18,38 A17,17 0 0,1 21,23 Z" fill="#111"/>
      <rect x="64" y="10" width="114" height="24" rx="2" fill="#1F4B7A"/>
      <text x="121" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-size="13.5" font-weight="900" fill="#FFF">22,000 VETS</text>
      <text x="121" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#111">40-YR FIGHT · INQUIRY</text>
    </svg>`,
  },
  {
    id: 8,
    region: 'africa',
    loc: 'LAUSANNE / DAKAR',
    pill: 'CONFIRMED · CAS',
    headline: 'CAS restores Senegal as 2025 AFCON champion',
    summary: 'Sports court overturns CAF award to Morocco; Rabat protests contact.',
    lat: 14.72,
    lon: -17.47,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#E7F3EC"/>
      <polygon points="22,12 52,12 46,32 28,32" fill="#F59E0B" stroke="#111" stroke-width="1.3"/>
      <rect x="33" y="32" width="8" height="10" fill="#D97706"/>
      <rect x="24" y="42" width="26" height="7" fill="#78350F"/>
      <rect x="64" y="10" width="114" height="24" rx="2" fill="#276749"/>
      <text x="121" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-size="13.5" font-weight="900" fill="#FFF">SENEGAL</text>
      <text x="121" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#111">AFCON 2025 · CAS</text>
    </svg>`,
  },
  {
    id: 9,
    region: 'americas',
    loc: 'WASHINGTON, US',
    pill: 'CONFIRMED · FCC',
    headline: "FCC clears 1M SpaceX 'Starmind' space servers",
    summary: 'Regulator OKs orbital compute as SpaceX & Musk match 2 shares/US child.',
    lat: 34.0,
    lon: -118.2,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#1E1B4B"/>
      <circle cx="14" cy="14" r="1.2" fill="#FFF"/><circle cx="52" cy="10" r="1" fill="#FDE68A"/><circle cx="176" cy="52" r="1.1" fill="#FFF"/>
      <!-- Orbital satellite + solar wings -->
      <rect x="10" y="25" width="16" height="10" fill="#2563EB" stroke="#93C5FD" stroke-width="0.9"/>
      <rect x="46" y="25" width="16" height="10" fill="#2563EB" stroke="#93C5FD" stroke-width="0.9"/>
      <rect x="27" y="19" width="18" height="22" rx="2" fill="#E2E8F0" stroke="#111" stroke-width="1"/>
      <rect x="30" y="23" width="12" height="4" fill="#0EA5E9"/><rect x="30" y="30" width="12" height="4" fill="#0EA5E9"/>
      <rect x="68" y="10" width="110" height="24" rx="2" fill="#5A3D82"/>
      <text x="123" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#FFF">1M SATS</text>
      <text x="123" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="800" fill="#E0E7FF">+ 2 SHARES/KID PLEDGE</text>
    </svg>`,
  },
  {
    id: 10,
    region: 'europe',
    loc: 'EL HIERRO, SPAIN',
    pill: 'OFFICIALS · AP',
    headline: 'Canary Islands hit record ~2,000 arrivals in day',
    summary: 'Atlantic boat surge into El Hierro forces Level-2 PLATECA emergency.',
    lat: 27.74,
    lon: -18.01,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#DCE9F5"/>
      <rect y="38" width="188" height="24" fill="#1D4ED8"/>
      <polygon points="14,38 56,38 48,46 18,46" fill="#92400E" stroke="#111" stroke-width="1"/>
      <circle cx="24" cy="33" r="3" fill="#111"/><circle cx="33" cy="33" r="3" fill="#111"/><circle cx="42" cy="33" r="3" fill="#111"/>
      <rect x="66" y="9" width="112" height="23" rx="2" fill="#1F4B7A"/>
      <text x="122" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#FFF">~2,000/DAY</text>
      <text x="122" y="53" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#FFF">LEVEL-2 EMERGENCY</text>
    </svg>`,
  },
  {
    id: 11,
    region: 'oceania',
    loc: 'SYDNEY, AUSTRALIA',
    pill: 'CONFIRMED · ABS',
    headline: 'Australia inflation jumps to 4.9%, curbing cuts',
    summary: 'Oct CPI rises from 4.3% on housing, power & fuel, complicating RBA path.',
    lat: -33.87,
    lon: 151.21,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#F7EFE4"/>
      <rect x="14" y="34" width="12" height="18" fill="#94A3B8"/>
      <rect x="30" y="26" width="12" height="26" fill="#64748B"/>
      <rect x="46" y="14" width="12" height="38" fill="#B91C1C"/>
      <rect x="68" y="10" width="110" height="24" rx="2" fill="#0E7490"/>
      <text x="123" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#FFF">4.9% CPI</text>
      <text x="123" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#111">UP FROM 4.3% (OCT)</text>
    </svg>`,
  },
  {
    id: 12,
    region: 'asia',
    loc: 'DHAKA, BANGLADESH',
    pill: 'CONFIRMED · CNA',
    headline: 'Garment minimum wage hiked 36% to ৳17,000',
    summary: '4–2 board vote takes effect Dec 1; unions protest below ৳18,000 demand.',
    lat: 23.81,
    lon: 90.41,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#F2EBE0"/>
      <rect x="12" y="16" width="44" height="30" fill="#006A4E" stroke="#111" stroke-width="1"/>
      <circle cx="32" cy="31" r="9" fill="#F42A41"/>
      <rect x="66" y="10" width="112" height="24" rx="2" fill="#B45309"/>
      <text x="122" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#FFF">৳17,000</text>
      <text x="122" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#111">+36% · UNIONS OBJECT</text>
    </svg>`,
  },
  {
    id: 13,
    region: 'africa',
    loc: 'BLUE NILE, SUDAN',
    pill: 'REPORTED · CFR',
    headline: 'RSF drone strikes kill 19, wound 20 in Blue Nile',
    summary: 'Civilian toll mounts as Ethiopia urges inclusive Sudanese peace talks.',
    lat: 11.79,
    lon: 34.35,
    art: `<svg viewBox="0 0 188 62" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="188" height="62" fill="#ECEAE4"/>
      <rect y="48" width="188" height="14" fill="#C8BFA8"/>
      <rect x="12" y="35" width="16" height="13" fill="#78716C"/><rect x="34" y="38" width="18" height="10" fill="#57534E"/>
      <!-- Drone delta silhouette + blast -->
      <polygon points="15,19 56,11 43,23 49,29" fill="#1E293B" stroke="#111" stroke-width="1"/>
      <polygon points="22,42 29,28 36,42 42,33 46,45 18,45" fill="#DC2626"/>
      <polygon points="26,44 31,34 37,44" fill="#FACC15"/>
      <rect x="66" y="10" width="112" height="24" rx="2" fill="#9D2B22"/>
      <text x="122" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-size="13.5" font-weight="900" fill="#FFF">19 KILLED</text>
      <text x="122" y="45" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.3" font-weight="900" fill="#111">20 HURT · DRONE RAID</text>
    </svg>`,
  },
];

const WIRE_BRIEFS = [
  // Middle East (5)
  { id: 14, region: 'mideast', city: 'Ras Tanura, Saudi', text: 'Houthis claim drone/missile strike sparking oil refinery fire', src: 'CLAIM · Reuters', lat: 26.64, lon: 50.16 },
  { id: 15, region: 'mideast', city: 'Gaza City', text: 'Israeli airstrike on Al-Shati camp kills Hamas officer & family', src: 'AP', lat: 31.53, lon: 34.45 },
  { id: 16, region: 'mideast', city: 'Hasakah, Syria', text: 'ISIS motorcycle bomb kills 2 security staff, wounds 5', src: 'SANA', lat: 36.5, lon: 40.75 },
  { id: 17, region: 'mideast', city: 'Ajman, UAE', text: "Sri Lanka beats Ireland by 6 wkts in Women's Emerging final", src: 'ICC', lat: 25.41, lon: 55.44 },
  { id: 18, region: 'mideast', city: 'Vienna / Gulf', text: 'OPEC chief Al Ghais defends producers after COP31 deadlock', src: 'OPEC', lat: 48.2, lon: 16.37 },
  // Americas (6)
  { id: 19, region: 'americas', city: 'Cartagena, Colombia', text: 'Police storm supermarket after 17h siege, freeing 76 hostages', src: 'CBS', lat: 10.39, lon: -75.48 },
  { id: 20, region: 'americas', city: 'New York / US East', text: 'Holiday storm threatens 250M; Gov. Hochul calls NY emergency', src: 'AP', lat: 40.71, lon: -74.01 },
  { id: 21, region: 'americas', city: 'Middletown, Iowa', text: 'US Army blasts 9,500 lb lead azide; initial EPA air tests clear', src: 'CNN', lat: 40.82, lon: -91.26 },
  { id: 22, region: 'americas', city: 'Wall St, NY', text: 'Dow +0.33% (50,183), S&P -0.25%, Nasdaq -0.62% on PCE & tech', src: 'Reuters', lat: 40.7, lon: -74.01 },
  { id: 23, region: 'americas', city: 'Pacifica, CA', text: 'High king tides & surf destroy northern California pier spans', src: 'AP', lat: 37.61, lon: -122.49 },
  { id: 24, region: 'americas', city: 'Ottawa, Canada', text: 'Finance sets canned-veg tariff quota; Bell-Vector renew AI', src: 'Govt', lat: 45.42, lon: -75.7 },
  // Asia (6)
  { id: 25, region: 'asia', city: 'Bogor, Indonesia', text: 'Flooded illegal Pongkor gold mine kills 9+, traps ~17 miners', src: 'AJ', lat: -6.6, lon: 106.56 },
  { id: 26, region: 'asia', city: 'Tokyo, Japan', text: 'Govt drafts top-3 AI powerhouse strategy; Nikkei tumbles 2.8%', src: 'JT', lat: 35.68, lon: 139.69 },
  { id: 27, region: 'asia', city: 'New Delhi, India', text: 'World Bank clears financing for green infrastructure bonds', src: 'WB', lat: 28.61, lon: 77.21 },
  { id: 28, region: 'asia', city: 'Surabaya, Indonesia', text: 'US 7th Fleet & TNI-AL launch CARAT 2026 maritime drills', src: 'PACOM', lat: -7.25, lon: 112.75 },
  { id: 29, region: 'asia', city: 'Jakarta, Indonesia', text: "Kadin & Italy's CDP sign ASEAN–Italy investment MOU", src: 'Antara', lat: -6.2, lon: 106.82 },
  { id: 30, region: 'asia', city: 'Beijing, China', text: 'Foreign Ministry rejects US Section 301 excess-capacity claim', src: 'AJ', lat: 39.9, lon: 116.4 },
  // Europe (5)
  { id: 31, region: 'europe', city: 'Frankfurt / London', text: 'DAX drops 1.26% (24,702) & FTSE -0.38% on autos & tariffs', src: 'Reuters', lat: 50.11, lon: 8.68 },
  { id: 32, region: 'europe', city: 'Europe (UEFA CL)', text: 'Lille upsets Bayern 2–1; Barça 4–1 Sabah, Liverpool 3–0 Brugge', src: 'UEFA', lat: 50.63, lon: 3.06 },
  { id: 33, region: 'europe', city: 'Brussels, EU', text: 'Bloc rejects US tariff framing, urges joint talks over duties', src: 'Reuters', lat: 50.85, lon: 4.35 },
  { id: 34, region: 'europe', city: 'London, UK', text: "Chef Gordon Ramsay named to host BBC's Top Gear revival", src: 'AP', lat: 51.5, lon: -0.14 },
  { id: 35, region: 'europe', city: 'Vatican / Geneva', text: 'Pope Leo XIV warns on COP31 split; UN opens 16 Days GBV drive', src: 'UN', lat: 41.9, lon: 12.45 },
  // Africa (3)
  { id: 36, region: 'africa', city: 'Pretoria, S. Africa', text: 'Court blocks opposition impeachment push over Ramaphosa farm', src: 'AJ', lat: -25.75, lon: 28.23 },
  { id: 37, region: 'africa', city: 'Abuja, Nigeria', text: 'Pres. Tinubu pledges border security drive amid holiday alerts', src: 'AJ', lat: 9.07, lon: 7.4 },
  { id: 38, region: 'africa', city: 'Centurion, S. Africa', text: 'Mulder & Ackerman (150) put Proteas 403 up on Bangladesh', src: 'Cricket', lat: -25.86, lon: 28.19 },
  // Oceania (2)
  { id: 39, region: 'oceania', city: 'Auckland, NZ', text: "RBNZ's Karen Silk urges retail payments modernization push", src: 'RBNZ', lat: -36.85, lon: 174.76 },
  { id: 40, region: 'oceania', city: 'Gold Coast, Aust.', text: 'England chases 184 to beat Australia in 2nd T20I, tying 1–1', src: 'Cricket', lat: -28.02, lon: 153.4 },
  // Antarctica (2)
  { id: 41, region: 'antarctica', city: 'West Antarctica', text: '75-person team deploys COVID-era air samplers to trace winds', src: 'JT', lat: -75.0, lon: -100.0 },
  { id: 42, region: 'antarctica', city: 'Amundsen Coast', text: 'Study shows bedrock rebound slows ice grounding-line retreat', src: 'Scienmag', lat: -73.5, lon: -110.0 },
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function validateStories() {
  const all = [...LEAD_STORIES, ...MID_STORIES, ...WIRE_BRIEFS];
  const ids = new Set();
  const counts = Object.fromEntries(REGIONS.map(r => [r.id, 0]));
  for (const item of all) {
    if (ids.has(item.id)) throw new Error(`Duplicate story id: ${item.id}`);
    ids.add(item.id);
    if (!(item.region in counts)) throw new Error(`Unknown region: ${item.region}`);
    counts[item.region] += 1;
  }
  for (const r of REGIONS) {
    if (counts[r.id] < 1) throw new Error(`Region missing stories: ${r.id}`);
  }
  return { total: all.length, counts, all };
}

function projectPin(lat, lon) {
  const x = Math.max(8, Math.min(252, ((lon + 180) / 360) * 260));
  const y = Math.max(8, Math.min(148, ((85 - lat) / 165) * 154));
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
}

function buildWorldMapSvg(allStories) {
  const colorByRegion = Object.fromEntries(REGIONS.map(r => [r.id, r.color]));
  const dots = WIRE_BRIEFS.map(s => {
    const p = projectPin(s.lat, s.lon);
    return `<circle cx="${p.x}" cy="${p.y}" r="2.2" fill="${colorByRegion[s.region]}" stroke="#FFFDF7" stroke-width="0.6"/>`;
  }).join('');
  const pins = [...LEAD_STORIES, ...MID_STORIES].map(s => {
    const p = projectPin(s.lat, s.lon);
    return `<g>
      <circle cx="${p.x}" cy="${p.y}" r="5.4" fill="${colorByRegion[s.region]}" stroke="#FFF" stroke-width="0.9"/>
      <text x="${p.x}" y="${p.y + 2.2}" text-anchor="middle" font-family="Arial,sans-serif" font-size="6.2" font-weight="900" fill="#FFF">${s.id}</text>
    </g>`;
  }).join('');

  // Authentic simplified continental coastlines on 260x154 equirectangular canvas
  return `<svg viewBox="0 0 260 154" width="100%" height="158" xmlns="http://www.w3.org/2000/svg" style="display:block;border:1px solid #B5ACA0;background:#DCE8F0;">
    <g stroke="#C6D6E2" stroke-width="0.5" stroke-dasharray="2,2">
      <line x1="0" y1="79" x2="260" y2="79"/>
      <line x1="130" y1="0" x2="130" y2="154"/>
    </g>
    <g fill="#D8CEBE" stroke="#A79B88" stroke-width="0.7" stroke-linejoin="round">
      <!-- North America -->
      <path d="M12,24 L36,16 L66,18 L86,28 L82,42 L74,50 L62,56 L58,64 L66,70 L60,74 L52,66 L44,58 L38,44 L22,38 Z"/>
      <!-- Greenland -->
      <path d="M90,8 L112,7 L108,22 L92,20 Z"/>
      <!-- South America -->
      <path d="M64,74 L82,76 L96,86 L94,102 L82,118 L74,132 L68,128 L68,104 L60,86 Z"/>
      <!-- Europe & UK & Scandinavia -->
      <path d="M120,44 L126,31 L136,22 L144,24 L156,28 L155,42 L144,47 L126,48 Z"/>
      <path d="M118,35 L122,34 L122,41 L117,41 Z"/>
      <!-- Africa & Madagascar -->
      <path d="M120,52 L144,52 L152,60 L156,64 L164,76 L154,98 L142,114 L132,112 L128,92 L116,74 Z"/>
      <path d="M161,96 L165,94 L163,106 L159,106 Z"/>
      <!-- Middle East & Asia & India & SE Asia & Japan & Indonesia -->
      <path d="M150,51 L160,52 L166,64 L158,66 Z"/>
      <path d="M156,28 L194,20 L236,24 L244,36 L224,44 L218,56 L208,68 L196,64 L188,78 L180,68 L170,68 L160,56 L152,50 Z"/>
      <path d="M228,44 L235,40 L233,52 L226,52 Z"/>
      <path d="M198,74 L218,76 L220,84 L198,84 Z"/>
      <!-- Australia & New Zealand -->
      <path d="M206,96 L228,94 L238,106 L232,118 L212,116 L204,106 Z"/>
      <path d="M244,114 L250,110 L248,124 L242,122 Z"/>
      <!-- Antarctica -->
      <path d="M4,142 L48,136 L108,140 L176,138 L244,136 L256,144 L256,154 L4,154 Z"/>
    </g>
    ${dots}
    ${pins}
  </svg>`;
}

function buildHtml(meta) {
  const colorByRegion = Object.fromEntries(REGIONS.map(r => [r.id, r.color]));
  const regionBars = REGIONS.map(r => {
    const count = meta.counts[r.id];
    const flexVal = Math.max(count, 4.6);
    return `<div style="flex:${flexVal};background:${r.color};color:#FFF;font-weight:900;font-size:8.6px;display:flex;align-items:center;justify-content:center;letter-spacing:0.2px;white-space:nowrap;border-right:1px solid #F6F2E8;">${r.name} ${count}</div>`;
  }).join('');

  const utcHtml = UTC_STRIP.map(u => `
    <div style="flex:1;padding:0 6px;border-left:1px solid #C8C0B0;display:flex;flex-direction:column;justify-content:center;">
      <div style="font-size:8.8px;font-weight:900;color:#A81D1D;line-height:1.05;">${escapeHtml(u.time)}</div>
      <div style="font-size:8.4px;font-weight:700;color:#1F2937;line-height:1.1;white-space:nowrap;">${escapeHtml(u.label)}</div>
    </div>`).join('');

  const kpiHtml = KPI_STRIP.map((k, idx) => `
    <div style="flex:1;${idx > 0 ? 'border-left:1px solid #C8C0B0;' : ''}padding:1px 5px;display:flex;align-items:baseline;justify-content:center;gap:4px;white-space:nowrap;">
      <span style="font-family:Georgia,serif;font-size:15px;font-weight:900;color:#111;line-height:1;">${escapeHtml(k.num)}</span>
      <span style="font-size:8.3px;font-weight:700;color:#444;line-height:1;">${escapeHtml(k.label)}</span>
    </div>`).join('');

  const leadsHtml = LEAD_STORIES.map((s, i) => `
    <article class="lead-card" style="${i > 0 ? 'border-left:1px solid #C8C0B0;padding-left:9px;' : ''}display:flex;flex-direction:column;gap:4px;">
      <div style="height:118px;border:1px solid #B5ACA0;overflow:hidden;">${s.art}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
        <div style="display:flex;align-items:center;gap:4px;">
          <span style="width:14px;height:14px;border-radius:50%;background:${colorByRegion[s.region]};color:#FFF;font-size:8.5px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;">${s.id}</span>
          <span style="font-size:8.3px;font-weight:900;color:#222;letter-spacing:0.2px;">${escapeHtml(s.loc)} · ${escapeHtml(s.beat)}</span>
        </div>
        <span style="font-size:7.6px;font-weight:800;color:#333;border:1px solid #999;padding:1px 4px;background:#EFE8DB;white-space:nowrap;">${escapeHtml(s.pill)}</span>
      </div>
      <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16.5px;font-weight:700;line-height:1.12;color:#111;">${escapeHtml(s.headline)}</h2>
      <p style="margin:0;font-size:9.8px;line-height:1.24;color:#262626;">${escapeHtml(s.summary)}</p>
    </article>`).join('');

  const midRowsHtml = [MID_STORIES.slice(0, 5), MID_STORIES.slice(5, 10)].map((row, rIdx) => `
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;${rIdx > 0 ? 'border-top:1px solid #C8C0B0;padding-top:6px;margin-top:6px;' : ''}">
      ${row.map((s, cIdx) => `
        <article class="mid-card" style="${cIdx > 0 ? 'border-left:1px solid #D3CBC0;padding-left:7px;' : ''}display:flex;flex-direction:column;gap:3px;">
          <div style="height:62px;border:1px solid #B5ACA0;overflow:hidden;">${s.art}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:2px;">
            <div style="display:flex;align-items:center;gap:3px;min-width:0;">
              <span style="width:12px;height:12px;border-radius:50%;background:${colorByRegion[s.region]};color:#FFF;font-size:7.6px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${s.id}</span>
              <span style="font-size:7.6px;font-weight:900;color:#222;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(s.loc)}</span>
            </div>
            <span style="font-size:6.9px;font-weight:800;color:#444;border:1px solid #AAA;padding:0 3px;background:#EFE8DB;white-space:nowrap;">${escapeHtml(s.pill)}</span>
          </div>
          <h3 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:12.2px;font-weight:700;line-height:1.12;color:#111;">${escapeHtml(s.headline)}</h3>
          <p style="margin:0;font-size:8.9px;line-height:1.19;color:#262626;">${escapeHtml(s.summary)}</p>
        </article>`).join('')}
    </div>`).join('');

  const cols = [WIRE_BRIEFS.slice(0, 10), WIRE_BRIEFS.slice(10, 20), WIRE_BRIEFS.slice(20, 29)];
  const briefsColsHtml = cols.map((col, idx) => `
    <div style="${idx > 0 ? 'border-left:1px solid #D3CBC0;padding-left:7px;' : ''}display:flex;flex-direction:column;gap:2.5px;">
      ${col.map(b => `
        <div class="brief" style="font-size:8.9px;line-height:1.17;color:#1F2937;display:flex;align-items:flex-start;gap:4px;">
          <span style="min-width:13px;height:13px;border-radius:2px;background:${colorByRegion[b.region]};color:#FFF;font-size:7.6px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;margin-top:1px;">${b.id}</span>
          <span><strong style="color:#111;">${escapeHtml(b.city)}:</strong> ${escapeHtml(b.text)} <em style="color:#555;">(${escapeHtml(b.src)})</em></span>
        </div>`).join('')}
    </div>`).join('');

  const legendHtml = REGIONS.map(r => `
    <span style="display:inline-flex;align-items:center;gap:3px;font-size:7.9px;font-weight:800;color:#222;">
      <i style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${r.color};"></i>${r.name} ${meta.counts[r.id]}
    </span>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 1024px; height: 1024px; background: #F6F2E8; color: #111; font-family: Arial, Helvetica, sans-serif; overflow: hidden; }
  .page { width: 1024px; height: 1024px; padding: 9px 14px 8px 14px; display: flex; flex-direction: column; justify-content: space-between; }
</style>
</head>
<body>
  <main class="page">
    <!-- TIER 1: OVERLINE -->
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:9.5px;font-weight:900;letter-spacing:0.6px;padding-bottom:3px;border-bottom:2px solid #181818;">
      <span style="color:#A81D1D;">THE WORLD ON ONE PAGE</span>
      <span style="color:#111;">${meta.total} STORIES · ALL 7 CONTINENTS · 18 FIELDS · EVERY ONE FROM WEDNESDAY 25 NOVEMBER 2026</span>
    </div>

    <!-- TIER 2: MASTHEAD & SUB-DECK -->
    <header style="text-align:center;padding:3px 0 4px 0;border-bottom:1.5px solid #181818;">
      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:50px;font-weight:700;line-height:0.98;letter-spacing:-0.8px;color:#111;">Wednesday 25 November 2026</h1>
      <div style="margin-top:3px;font-size:9.8px;font-weight:900;color:#8E1B1B;letter-spacing:0.25px;">US TARIFFS TARGET 14 ECONOMIES · KOSPI SINKS 6.2% IN CHIP ROUT · PAKISTAN'S FIRST ASTRONAUT BOARDS TIANGONG · CAIRO TANKER FIRE KILLS 31</div>
    </header>

    <!-- TIER 3: REGION BAR + UTC TIMELINE + KPI STRIP -->
    <section style="border-bottom:1.5px solid #181818;padding-bottom:4px;display:flex;flex-direction:column;gap:4px;">
      <div style="height:17px;display:flex;overflow:hidden;border:1px solid #333;">${regionBars}</div>
      <div style="display:flex;align-items:stretch;border:1px solid #C8C0B0;background:#EFE8DB;height:24px;">
        <div style="background:#A81D1D;color:#FFF;font-size:8.6px;font-weight:900;padding:0 7px;display:flex;align-items:center;letter-spacing:0.4px;white-space:nowrap;">THE DAY IN UTC</div>
        ${utcHtml}
      </div>
      <div style="display:flex;align-items:center;background:#F1EAE0;border:1px solid #C8C0B0;height:25px;">
        <div style="background:#1F2937;color:#FFF;font-size:8.1px;font-weight:900;padding:0 7px;height:100%;display:flex;align-items:center;white-space:nowrap;">KEY NUMBERS</div>
        ${kpiHtml}
      </div>
    </section>

    <!-- TIER 4: 3 HERO LEAD STORIES -->
    <section style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:4px 0 5px 0;border-bottom:1.5px solid #181818;">
      ${leadsHtml}
    </section>

    <!-- TIER 5: 10 MID-TIER ILLUSTRATED STORIES (5x2) -->
    <section style="padding:5px 0 6px 0;border-bottom:1.5px solid #181818;">
      ${midRowsHtml}
    </section>

    <!-- TIER 6: WORLD MAP + 29 WIRE BRIEFS -->
    <section style="display:grid;grid-template-columns:260px 1fr;gap:10px;padding:5px 0;">
      <div style="display:flex;flex-direction:column;gap:4px;">
        <div style="font-size:9.3px;font-weight:900;color:#A81D1D;letter-spacing:0.4px;">WHERE IT HAPPENED (ALL 7 CONTINENTS)</div>
        ${buildWorldMapSvg(meta.all)}
        <div style="display:flex;flex-wrap:wrap;gap:4px 7px;padding-top:1px;">${legendHtml}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;border-left:1px solid #C8C0B0;padding-left:9px;">
        <div style="font-size:9.3px;font-weight:900;color:#A81D1D;letter-spacing:0.4px;">ALSO ON WEDNESDAY 25 NOVEMBER 2026 — 29 GLOBAL WIRE BRIEFS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 0.94fr;gap:8px;flex:1;">
          ${briefsColsHtml}
        </div>
      </div>
    </section>

    <!-- TIER 7: DATE CHECK BOX -->
    <section class="date-check" style="background:#EFE6D8;border:1.5px solid #A81D1D;padding:4px 8px;display:flex;align-items:center;gap:9px;">
      <div style="background:#A81D1D;color:#FFF;font-size:9.5px;font-weight:900;padding:8px 8px;text-align:center;line-height:1.1;letter-spacing:0.4px;white-space:nowrap;">DATE<br/>CHECK</div>
      <div style="font-size:8.8px;line-height:1.22;color:#111;">
        <div><strong>Included:</strong> Every event above happened, or was first reported, on <strong>Wednesday 25 November 2026</strong>.</div>
        <div><strong>Left out as earlier news (Tue 24 Nov &amp; prior):</strong> Strait of Hormuz 3-tanker mine blasts, Gaza strike killing Naeem Abu Nahel, UNSC shipping clash, Vance/Rubio–Qatar talks, WHO $2M Cuba vaccine aid, COP31 Antalya summit collapse (23 Nov).</div>
        <div><strong>Not yet (Thu 26 Nov+):</strong> US Thanksgiving federal &amp; market holiday (26 Nov), OPEC+ 2027 quota ministerial (29 Nov), USTR Section 301 hearings (Jan 2027).</div>
      </div>
    </section>

    <!-- TIER 8: EPISTEMOLOGY & SOURCES FOOTER -->
    <footer class="footer" style="border-top:1px solid #C8C0B0;padding-top:3px;display:flex;justify-content:space-between;align-items:center;font-size:8.2px;color:#333;font-weight:700;">
      <span>All stories first reported 25 Nov 2026; claims attributed, not stated as fact.</span>
      <span>[CONFIRMED] record · [OFFICIALS] agency · [REPORTED] press · [CLAIM] one-sided</span>
      <span>Sources: AP, Reuters, BBC, AJ, ABS, USTR, CMSA, CAS, UEFA. Original vector art.</span>
    </footer>
  </main>
</body>
</html>`;
}

function findChrome() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const hit = candidates.find(p => existsSync(p));
  if (!hit) throw new Error('No headless Chromium/Edge binary found');
  return hit;
}

async function renderPng(htmlPath) {
  const chromePath = findChrome();
  const profileDir = mkdtempSync(join(tmpdir(), 'news25-chrome-'));
  const port = 9325;
  const proc = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  try {
    let target = null;
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/list`);
        const pages = await res.json();
        target = pages.find(p => p.type === 'page') ?? pages[0];
        if (target?.webSocketDebuggerUrl) break;
      } catch {
        // retry until DevTools opens
      }
      await new Promise(r => setTimeout(r, 150));
    }
    if (!target?.webSocketDebuggerUrl) {
      throw new Error('Headless browser DevTools did not respond');
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });

    let seq = 0;
    const cdp = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++seq;
        const onMsg = ev => {
          const msg = JSON.parse(ev.data);
          if (msg.id === id) {
            ws.removeEventListener('message', onMsg);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id, method, params }));
      });

    await cdp('Page.enable');
    await cdp('Runtime.enable');
    await cdp('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp('Page.navigate', { url: 'file:///' + htmlPath.replace(/\\/g, '/') });
    await new Promise(r => setTimeout(r, 350));

    const layoutEval = await cdp('Runtime.evaluate', {
      expression: `(() => {
        const page = document.querySelector('.page');
        const footer = document.querySelector('.footer');
        const pRect = page.getBoundingClientRect();
        const fRect = footer.getBoundingClientRect();
        const clipped = [];
        for (const el of document.querySelectorAll('.lead-card, .mid-card, .brief, .date-check, .footer')) {
          if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
            clipped.push((el.className || el.tagName) + ':' + el.scrollHeight + '>' + el.clientHeight + '/' + el.scrollWidth + '>' + el.clientWidth);
          }
        }
        return {
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          pageBottom: Math.round(pRect.bottom),
          footerBottom: Math.round(fRect.bottom),
          clipped
        };
      })()`,
      returnByValue: true,
    });

    const layout = layoutEval.result.value;
    if (layout.scrollWidth > 1024 || layout.footerBottom > 1023 || layout.clipped.length > 0) {
      throw new Error('Layout overflow/clipping detected: ' + JSON.stringify(layout));
    }

    const fullShot = await cdp('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1024, height: 1024, scale: 1 },
      captureBeyondViewport: true,
    });
    const fullBytes = Buffer.from(fullShot.data, 'base64');
    writeFileSync(ENTRY_OUT, fullBytes);

    await cdp('Emulation.setDeviceMetricsOverride', {
      width: 300,
      height: 300,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp('Page.navigate', {
      url:
        'data:text/html,' +
        encodeURIComponent(
          `<!doctype html><body style="margin:0;width:300px;height:300px;overflow:hidden;"><img src="data:image/png;base64,${fullShot.data}" style="width:300px;height:300px;display:block;"/></body>`,
        ),
    });
    await new Promise(r => setTimeout(r, 200));
    const thumbShot = await cdp('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 300, height: 300, scale: 1 },
    });
    mkdirSync(dirname(THUMB_OUT), { recursive: true });
    writeFileSync(THUMB_OUT, Buffer.from(thumbShot.data, 'base64'));

    ws.close();
    return { bytes: fullBytes.byteLength, layout };
  } finally {
    proc.kill();
    await new Promise(r => setTimeout(r, 150));
    try {
      rmSync(profileDir, { recursive: true, force: true });
    } catch {
      // ignore temp cleanup lock on Windows
    }
  }
}

async function main() {
  const meta = validateStories();
  const html = buildHtml(meta);
  const tmpHtml = join(tmpdir(), 'news-image-20261125-render.html');
  writeFileSync(tmpHtml, html, 'utf8');
  const res = await renderPng(tmpHtml);
  const png = readFileSync(ENTRY_OUT);
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  console.log(JSON.stringify({ entry: ENTRY_OUT, width, height, bytes: res.bytes, counts: meta.counts, layout: res.layout }, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
