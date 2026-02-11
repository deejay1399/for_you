"use client";

import { motion } from "framer-motion";

type ThreeRoseBouquetProps = {
  explodeStart: number;
};

type RoseHead = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  mode: "bud" | "bloom";
};

const ROSES: RoseHead[] = [
  { x: 58, y: 92, scale: 0.9, rotate: -8, mode: "bud" },
  { x: 110, y: 84, scale: 1.02, rotate: 0, mode: "bloom" },
  { x: 164, y: 92, scale: 0.96, rotate: 8, mode: "bloom" }
];

function RoseBloom({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 19} ${y + 10} C${x - 10} ${y + 2} ${x + 9} ${y + 2} ${x + 19} ${y + 10} C${x + 11} ${y + 18} ${x - 11} ${y + 18} ${x - 19} ${y + 10} Z`} fill="#3f9723" stroke="#102807" strokeWidth="1.7" />
      <path d={`M${x} ${y + 10} C${x - 26} ${y + 3} ${x - 26} ${y - 24} ${x - 8} ${y - 38} C${x + 11} ${y - 47} ${x + 29} ${y - 24} ${x + 24} ${y + 6} C${x + 13} ${y + 12} ${x + 3} ${y + 13} ${x} ${y + 10} Z`} fill="url(#roseMain)" stroke="#3f0308" strokeWidth="1.9" />
      <path d={`M${x - 19} ${y - 8} C${x - 14} ${y - 31} ${x + 14} ${y - 31} ${x + 20} ${y - 10}`} fill="url(#roseMain)" stroke="#3f0308" strokeWidth="1.8" />
      <path d={`M${x - 8} ${y - 9} C${x - 1} ${y - 24} ${x + 11} ${y - 24} ${x + 10} ${y - 9} C${x + 5} ${y - 4} ${x - 2} ${y - 4} ${x - 8} ${y - 9} Z`} fill="url(#roseDark)" stroke="#3f0308" strokeWidth="1.5" />
      <path d={`M${x - 4} ${y - 16} C${x} ${y - 20} ${x + 5} ${y - 20} ${x + 7} ${y - 14} C${x + 5} ${y - 11} ${x + 1} ${y - 11} ${x - 4} ${y - 16} Z`} fill="#b90614" stroke="#3f0308" strokeWidth="1.2" />
      <path d={`M${x - 15} ${y - 19} C${x - 10} ${y - 28} ${x - 2} ${y - 31} ${x + 5} ${y - 31}`} stroke="#ff6b76" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
      <ellipse cx={x - 10} cy={y - 10} rx="2.3" ry="4.2" fill="#ff8793" opacity="0.75" />
      <ellipse cx={x + 12} cy={y - 2} rx="1.8" ry="3.4" fill="#ff9aa3" opacity="0.55" />
    </g>
  );
}

function RoseBud({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 15} ${y + 9} C${x - 8} ${y + 1} ${x + 8} ${y + 1} ${x + 15} ${y + 9} C${x + 9} ${y + 16} ${x - 9} ${y + 16} ${x - 15} ${y + 9} Z`} fill="#3f9723" stroke="#102807" strokeWidth="1.7" />
      <path d={`M${x} ${y + 8} C${x - 17} ${y - 7} ${x - 15} ${y - 33} ${x} ${y - 40} C${x + 15} ${y - 33} ${x + 17} ${y - 7} ${x} ${y + 8} Z`} fill="url(#roseMain)" stroke="#3f0308" strokeWidth="1.9" />
      <path d={`M${x - 6} ${y - 34} C${x - 2} ${y - 45} ${x + 4} ${y - 45} ${x + 9} ${y - 34}`} stroke="#3f0308" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d={`M${x - 3} ${y + 6} C${x} ${y - 10} ${x} ${y - 25} ${x - 3} ${y - 35}`} stroke="url(#roseDark)" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <ellipse cx={x - 6} cy={y - 13} rx="1.9" ry="3.2" fill="#ff8793" opacity="0.7" />
    </g>
  );
}

export default function ThreeRoseBouquet({ explodeStart }: ThreeRoseBouquetProps) {
  return (
    <motion.svg
      viewBox="0 0 220 320"
      className="h-[360px] w-[260px]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: explodeStart, times: [0, 0.92, 1], ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="roseMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff1d27" />
          <stop offset="52%" stopColor="#d20e1a" />
          <stop offset="100%" stopColor="#9a070e" />
        </linearGradient>
        <linearGradient id="roseDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bb0713" />
          <stop offset="100%" stopColor="#6a0208" />
        </linearGradient>
        <linearGradient id="stemGreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4cae2a" />
          <stop offset="100%" stopColor="#2d7a16" />
        </linearGradient>
        <linearGradient id="leafGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#45a722" />
          <stop offset="100%" stopColor="#2a6f12" />
        </linearGradient>
      </defs>

      <motion.path
        d="M48 292 C62 260 50 223 56 186 C62 148 61 122 59 96"
        stroke="url(#stemGreen)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M110 294 C104 260 112 224 118 186 C124 146 124 120 122 88"
        stroke="url(#stemGreen)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M172 292 C158 260 171 222 167 184 C163 145 163 119 165 96"
        stroke="url(#stemGreen)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />

      {[
        { d: "M46 206 C34 195 25 198 15 208 C27 214 35 214 48 211", v: "M20 208 C29 207 37 209 46 211" },
        { d: "M68 182 C79 171 90 175 95 186 C84 191 76 191 66 187", v: "M90 185 C82 184 76 185 68 187" },
        { d: "M102 178 C90 166 80 169 73 179 C85 184 93 184 104 181", v: "M77 178 C85 178 93 179 102 181" },
        { d: "M133 194 C143 183 152 186 159 197 C149 202 141 202 132 199", v: "M154 196 C147 195 141 197 133 199" },
        { d: "M186 184 C197 173 208 176 214 188 C203 193 195 193 185 189", v: "M210 187 C202 186 194 187 186 189" },
        { d: "M158 210 C146 198 136 201 128 212 C139 216 148 216 160 213", v: "M132 211 C141 210 149 211 158 213" }
      ].map((leaf, i) => (
        <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.95 + i * 0.08, duration: 0.8 }}>
          <path d={leaf.d} fill="url(#leafGreen)" stroke="#0f2807" strokeWidth="1.5" />
          <path d={leaf.v} stroke="#183d0a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </motion.g>
      ))}

      {ROSES.map((rose) => (
        <motion.g
          key={rose.x}
          initial={{ opacity: 0, y: 24, scale: 0.18 }}
          animate={{ opacity: 1, y: 0, scale: rose.scale, rotate: rose.rotate }}
          transition={{ delay: 1.1, duration: 1.85, ease: "easeOut" }}
          style={{ transformOrigin: `${rose.x}px ${rose.y}px` }}
        >
          {rose.mode === "bud" ? <RoseBud x={rose.x} y={rose.y} /> : <RoseBloom x={rose.x} y={rose.y} />}
        </motion.g>
      ))}
    </motion.svg>
  );
}

