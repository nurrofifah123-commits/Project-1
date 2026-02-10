
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BarChart3, 
  Wallet, 
  Sparkles, 
  MessageSquare, 
  Mic, 
  Plus, 
  LayoutDashboard, 
  Settings, 
  TrendingUp, 
  Calendar,
  Image as ImageIcon,
  Video,
  Search,
  MapPin,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { AppView, Transaction, MarketingAsset } from './types';
import * as geminiService from './services/geminiService';

// Mock Initial Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-20', amount: 1200000, category: 'Food', description: 'Catering event' },
  { id: '2', date: '2023-10-21', amount: 800000, category: 'Beverage', description: 'Walk-in sales' },
  { id: '3', date: '2023-10-22', amount: 1500000, category: 'Food', description: 'Online orders' },
  { id: '4', date: '2023-10-23', amount: 2000000, category: 'Merchandise', description: 'New release' },
  { id: '5', date: '2023-10-24', amount: 950000, category: 'Food', description: 'Lunch special' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [analysis, setAnalysis] = useState<string>('Menganalisis data...');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Stats
  const totalOmzet = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const avgOmzet = totalOmzet / (transactions.length || 1);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const result = await geminiService.analyzeRevenue(transactions);
        setAnalysis(result || 'Gagal memuat analisis.');
      } catch (e) {
        setAnalysis('Error memuat analisis bisnis.');
      }
    };
    fetchAnalysis();
  }, [transactions]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <BarChart3 size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">BizTrack AI</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeView === AppView.DASHBOARD} 
            onClick={() => setActiveView(AppView.DASHBOARD)} 
            isOpen={isSidebarOpen} 
          />
          <NavItem 
            icon={<Wallet size={20} />} 
            label="Transaksi" 
            active={activeView === AppView.TRANSACTIONS} 
            onClick={() => setActiveView(AppView.TRANSACTIONS)} 
            isOpen={isSidebarOpen} 
          />
          <NavItem 
            icon={<Sparkles size={20} />} 
            label="Creative Studio" 
            active={activeView === AppView.CREATIVE} 
            onClick={() => setActiveView(AppView.CREATIVE)} 
            isOpen={isSidebarOpen} 
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="Market Insight" 
            active={activeView === AppView.INSIGHTS} 
            onClick={() => setActiveView(AppView.INSIGHTS)} 
            isOpen={isSidebarOpen} 
          />
          <NavItem 
            icon={<Mic size={20} />} 
            label="Voice Assistant" 
            active={activeView === AppView.VOICE} 
            onClick={() => setActiveView(AppView.VOICE)} 
            isOpen={isSidebarOpen} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 text-slate-500"
          >
            <Settings size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-semibold text-lg text-slate-700 capitalize">
            {activeView === AppView.INSIGHTS ? 'Market Insights & Strategy' : activeView}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
              IDR {totalOmzet.toLocaleString()}
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeView === AppView.DASHBOARD && (
            <DashboardView transactions={transactions} totalOmzet={totalOmzet} analysis={analysis} />
          )}
          {activeView === AppView.TRANSACTIONS && (
            <TransactionsView transactions={transactions} setTransactions={setTransactions} />
          )}
          {activeView === AppView.CREATIVE && (
            <CreativeStudioView />
          )}
          {activeView === AppView.INSIGHTS && (
            <InsightsView />
          )}
          {activeView === AppView.VOICE && (
            <VoiceView />
          )}
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components ---

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isOpen: boolean }> = ({ icon, label, active, onClick, isOpen }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}
  >
    <div className={active ? 'text-white' : 'text-slate-400'}>{icon}</div>
    {isOpen && <span className="font-medium text-sm">{label}</span>}
  </button>
);

const DashboardView: React.FC<{ transactions: Transaction[], totalOmzet: number, analysis: string }> = ({ transactions, totalOmzet, analysis }) => (
  <div className="space-y-6">
    {/* Key Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Omzet" value={`IDR ${totalOmzet.toLocaleString()}`} icon={<Wallet className="text-indigo-600" />} trend="+12.5%" />
      <StatCard title="Rata-rata Harian" value={`IDR ${(totalOmzet / transactions.length).toLocaleString()}`} icon={<TrendingUp className="text-emerald-600" />} trend="+5.2%" />
      <StatCard title="Total Transaksi" value={transactions.length.toString()} icon={<Calendar className="text-amber-600" />} trend="Stabil" />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-700 mb-4">Grafik Penjualan</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transactions}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="amount" stroke="#4f46e5" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={18} />
          Analisis AI BizTrack
        </h3>
        <div className="prose prose-sm text-slate-600 max-h-64 overflow-y-auto pr-2">
          {analysis.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    </div>
  </div>
);

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
        {trend}
      </span>
    </div>
    <h4 className="text-slate-500 text-sm mb-1">{title}</h4>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const TransactionsView: React.FC<{ transactions: Transaction[], setTransactions: any }> = ({ transactions, setTransactions }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    };
    setTransactions([newTx, ...transactions]);
    setIsAdding(false);
    setFormData({ amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Riwayat Transaksi</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Tambah Transaksi
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Nominal</label>
              <input 
                type="number" 
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Kategori</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>Food</option>
                <option>Beverage</option>
                <option>Merchandise</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Keterangan</label>
              <input 
                type="text" 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Tanggal</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-700 px-4 py-2">Batal</button>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">Simpan</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Keterangan</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{tx.date}</td>
                <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{tx.description}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${tx.category === 'Food' ? 'bg-orange-50 text-orange-600' : tx.category === 'Beverage' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">IDR {tx.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CreativeStudioView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'video'>('edit');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile || !prompt) return;
    setIsProcessing(true);
    try {
      const base64Data = selectedFile.split(',')[1];
      if (mode === 'edit') {
        const edited = await geminiService.editProductImage(base64Data, prompt);
        setResult(edited);
      } else {
        // Requires billing key selection logic
        const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio?.openSelectKey();
        }
        const videoUrl = await geminiService.generateMarketingVideo(base64Data, prompt, aspectRatio);
        setResult(videoUrl);
      }
    } catch (e) {
      alert("Error processing creative asset: " + (e as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="text-indigo-600" size={20} />
            Input Aset Produk
          </h3>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            {selectedFile ? (
              <div className="relative w-full group">
                <img src={selectedFile} className="max-h-64 mx-auto rounded-lg shadow-md" alt="Preview" />
                <button 
                  onClick={() => setSelectedFile(null)} 
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="rotate-45" size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Plus className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">Klik untuk upload foto produk</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setMode('edit')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'edit' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Image Edit
            </button>
            <button 
              onClick={() => setMode('video')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'video' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Animate (Veo)
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Instruksi AI</label>
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={mode === 'edit' ? "Contoh: 'Berikan filter retro dan cerahkan warnanya'" : "Contoh: 'Animasikan mobil ini sedang melaju di jalanan neon'"}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-32 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {mode === 'video' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aspect Ratio</label>
              <div className="flex gap-2">
                <button onClick={() => setAspectRatio('16:9')} className={`px-4 py-1 rounded text-xs ${aspectRatio === '16:9' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100'}`}>16:9</button>
                <button onClick={() => setAspectRatio('9:16')} className={`px-4 py-1 rounded text-xs ${aspectRatio === '9:16' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100'}`}>9:16</button>
              </div>
            </div>
          )}

          <button 
            disabled={isProcessing || !selectedFile || !prompt}
            onClick={handleProcess}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Memproses...</> : 'Proses dengan AI'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          {mode === 'edit' ? <ImageIcon className="text-amber-500" size={20} /> : <Video className="text-red-500" size={20} />}
          Hasil Generasi AI
        </h3>
        <div className="flex-1 border-2 border-slate-100 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden relative">
          {result ? (
            mode === 'edit' ? (
              <img src={result} className="max-w-full max-h-full object-contain" alt="Result" />
            ) : (
              <video src={result} controls className="max-w-full max-h-full" />
            )
          ) : (
            <div className="text-center text-slate-400">
              <Sparkles size={48} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">Hasil akan muncul di sini</p>
            </div>
          )}
        </div>
        {result && (
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = result;
              link.download = `biztrack_${mode}_${Date.now()}`;
              link.click();
            }}
            className="mt-4 bg-slate-900 text-white py-2 rounded-lg font-bold text-sm"
          >
            Download Hasil
          </button>
        )}
      </div>
    </div>
  );
};

const InsightsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, sources?: any[] }[]>([]);
  const [mode, setMode] = useState<'search' | 'maps' | 'chat'>('chat');

  const handleSend = async () => {
    if (!query) return;
    setLoading(true);
    const userMsg = { role: 'user' as const, content: query };
    setMessages([...messages, userMsg]);
    const currentQuery = query;
    setQuery('');

    try {
      let result;
      if (mode === 'search') {
        result = await geminiService.getMarketInsights(currentQuery);
        setMessages(prev => [...prev, { role: 'ai', content: result.text, sources: result.sources }]);
      } else if (mode === 'maps') {
        let loc;
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
          loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch (e) { console.warn("Location denied"); }
        result = await geminiService.findBusinessLocations(currentQuery, loc);
        setMessages(prev => [...prev, { role: 'ai', content: result.text, sources: result.sources }]);
      } else {
        const text = await geminiService.chatWithBusinessConsultant([], currentQuery);
        setMessages(prev => [...prev, { role: 'ai', content: text || 'Gagal memproses.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "Maaf, terjadi kesalahan teknis." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex gap-2">
        <button onClick={() => setMode('chat')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'chat' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Chat Konsultan</button>
        <button onClick={() => setMode('search')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'search' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Cari Tren Pasar</button>
        <button onClick={() => setMode('maps')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'maps' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Cari Kompetitor/Supllier</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <MessageSquare size={48} className="mb-2 opacity-20" />
            <p>Tanyakan apa saja seputar bisnismu...</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none shadow-sm'}`}>
              <div className="prose prose-sm prose-slate dark:prose-invert">
                {m.content}
              </div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                  {m.sources.map((s: any, idx: number) => (
                    <a key={idx} href={s.web?.uri || s.maps?.uri} target="_blank" className="text-[10px] bg-white px-2 py-1 rounded border border-slate-200 text-indigo-600 hover:bg-indigo-50 font-bold truncate max-w-[150px]">
                      {s.web?.title || s.maps?.title || 'Link'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl animate-pulse">
              <Loader2 className="animate-spin text-indigo-600" size={20} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
        <input 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder={`Gunakan AI untuk ${mode === 'chat' ? 'berdiskusi strategi' : mode === 'search' ? 'mencari data terbaru' : 'mencari lokasi'}`}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100"
        >
          <TrendingUp size={24} />
        </button>
      </div>
    </div>
  );
};

const VoiceView: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const nextStartTimeRef = useRef(0);
  const audioContextsRef = useRef<{ input?: AudioContext, output?: AudioContext }>({});
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startLive = async () => {
    try {
      const ai = new (window as any).GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: geminiService.encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then((session: any) => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
            setIsLive(true);
          },
          onmessage: async (msg: any) => {
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev.slice(-10), `BizTrack: ${msg.serverContent.outputTranscription.text}`]);
            }
            if (msg.serverContent?.inputTranscription) {
              setTranscription(prev => [...prev.slice(-10), `Anda: ${msg.serverContent.inputTranscription.text}`]);
            }

            const base64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await geminiService.decodeAudioData(geminiService.decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNode);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => console.error("Live Error", e),
          onclose: () => setIsLive(false),
        },
        config: {
          responseModalities: ['AUDIO' as any],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: "Anda adalah asisten suara pintar BizTrack. Bantu pengguna menganalisis omzet, mencatat transaksi, atau memberikan saran bisnis cepat lewat percakapan suara yang natural dalam bahasa Indonesia."
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      alert("Gagal mengaktifkan Voice Assistant: " + (err as Error).message);
    }
  };

  const stopLive = () => {
    sessionRef.current?.close();
    audioContextsRef.current.input?.close();
    audioContextsRef.current.output?.close();
    setIsLive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 relative ${isLive ? 'bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.5)]' : 'bg-slate-200'}`}>
        {isLive && (
          <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-20" />
        )}
        <Mic size={64} className={isLive ? 'text-white' : 'text-slate-400'} />
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {isLive ? 'Mendengarkan...' : 'Percakapan AI Suara'}
        </h3>
        <p className="text-slate-500 max-w-sm">
          {isLive ? 'Tanyakan tren hari ini atau catat penjualan lewat suara.' : 'Klik tombol di bawah untuk mulai mengobrol dengan asisten bisnismu.'}
        </p>
      </div>

      <button 
        onClick={isLive ? stopLive : startLive}
        className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${isLive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {isLive ? 'Matikan Voice' : 'Aktifkan Voice AI'}
      </button>

      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 p-6 min-h-[150px] shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Live Transkrip</h4>
        <div className="space-y-2">
          {transcription.length === 0 && <p className="text-slate-300 italic text-sm">Belum ada percakapan...</p>}
          {transcription.map((t, i) => (
            <p key={i} className={`text-sm ${t.startsWith('Anda:') ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}>
              {t}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
