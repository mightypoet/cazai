const fs = require('fs');

const files = [
  'src/pages/Landing.tsx',
  'src/pages/Onboarding.tsx',
  'src/pages/DashboardLayout.tsx',
  'src/pages/MedicalDashboard.tsx',
  'src/pages/RealEstateDashboard.tsx',
  'src/pages/PersonalAssistantDashboard.tsx',
  'src/pages/AdminDashboard.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Backgrounds & Borders
  content = content.replace(/bg-white\/5/g, 'bg-gray-50');
  content = content.replace(/bg-white\/10/g, 'bg-gray-100');
  content = content.replace(/bg-white\/20/g, 'bg-gray-200');
  
  content = content.replace(/border-white\/5/g, 'border-gray-100');
  content = content.replace(/border-white\/10/g, 'border-gray-200');
  content = content.replace(/border-white\/20/g, 'border-gray-300');

  // Hardcoded dark backgrounds
  content = content.replace(/bg-\[#020203\]/g, 'bg-[#F8F9FA]');
  content = content.replace(/bg-\[#050507\]/g, 'bg-white');
  content = content.replace(/bg-\[#09090b\]/g, 'bg-white');
  content = content.replace(/bg-\[#12141c\]/g, 'bg-white');
  content = content.replace(/bg-black\/40/g, 'bg-white/80');

  // Text Colors
  content = content.replace(/(?<!bg-[a-z\-]+ )text-white(?! bg-)/g, 'TEXT_WHITE_PLACEHOLDER');
  
  content = content.replace(/text-slate-200/g, 'text-gray-800');
  content = content.replace(/text-slate-300/g, 'text-gray-700');
  content = content.replace(/text-slate-400/g, 'text-gray-500');
  content = content.replace(/text-gray-400/g, 'text-gray-500');
  content = content.replace(/text-slate-500/g, 'text-gray-400');
  
  content = content.replace(/TEXT_WHITE_PLACEHOLDER/g, 'text-gray-900');
  
  // Revert specific text-gray-900 placeholders where they are inside buttons or badges
  content = content.replace(/text-gray-900 px-5 py-2.5/g, 'text-white px-5 py-2.5'); // Landing button
  content = content.replace(/bg-gradient-to-r from-electric-blue to-accent-purple text-gray-900/g, 'bg-gradient-to-r from-electric-blue to-accent-purple text-white');
  content = content.replace(/bg-electric-blue text-gray-900/g, 'bg-electric-blue text-white'); // General buttons
  content = content.replace(/bg-white text-black/g, 'bg-electric-blue text-white'); // onboarding buttons
  content = content.replace(/bg-electric-blue text-white px-8 py-4/g, 'bg-electric-blue text-white px-8 py-4 border border-electric-blue/30 shadow-lg shadow-electric-blue/20 hover:bg-electric-blue/90 hover:shadow-electric-blue/40');
  content = content.replace(/shadow-inner flex items-center justify-center text-sm font-bold text-gray-900/g, 'shadow-inner flex items-center justify-center text-sm font-bold text-white');
  content = content.replace(/bg-black\/20/g, 'bg-gray-100'); // Table headers

  // Tooltips in Recharts
  content = content.replace(/backgroundColor: '#0f111a', border: '1px solid rgba\(255,255,255,0.1\)'/g, "backgroundColor: '#ffffff', border: '1px solid #e5e7eb'");
  content = content.replace(/itemStyle={{ color: '#fff' }}/g, "itemStyle={{ color: '#111827' }}");
  content = content.replace(/stroke="#475569"/g, 'stroke="#9ca3af"'); // Lighter axis lines
  
  // Fix gradients
  content = content.replace(/from-blue-900\/10 via-transparent/g, 'from-blue-100/50 via-transparent');

  fs.writeFileSync(file, content, 'utf8');
});
