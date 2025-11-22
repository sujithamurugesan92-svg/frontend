import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Sparkles, 
  Menu, 
  X, 
  Search, 
  Bell, 
  Plus, 
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  LogOut,
  HelpCircle,
  Command,
  MoreHorizontal,
  Calendar,
  ArrowUpRight,
  Filter,
  Building2,
  FolderOpen,
  BarChart3,
  Settings,
  Target,
  Download,
  MoreVertical,
  MapPin,
  Shield,
  File
} from 'lucide-react';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, RadialBarChart, RadialBar
} from 'recharts';

import { MOCK_LEADS, MOCK_DEALS, RECENT_ACTIVITIES, MOCK_TASKS, MOCK_CONTACTS, MOCK_COMPANIES, MOCK_DOCUMENTS } from './constants';
import { DealStage, LeadStatus, Priority, Deal, Lead, Task } from './types';
import PipelineBoard from './components/PipelineBoard';
import AIAssistant from './components/AIAssistant';
import LoginPage from './components/LoginPage';

// --- Constants ---

const COLORS = ['#7C3AED', '#A78BFA', '#C4B5FD', '#E9D5FF'];
const BAR_COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444'];

// --- Components ---

const HeroStatCard = ({ title, value, trend, sub }: any) => (
  <div className="bg-[#18181b] text-white p-6 rounded-2xl shadow-xl shadow-gray-900/10 relative overflow-hidden group transition-all hover:translate-y-[-2px]">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
      <Briefcase size={100} />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
          <Briefcase size={20} className="text-white" />
        </div>
        <button className="text-white/40 hover:text-white transition-colors">
           <MoreHorizontal size={20} />
        </button>
      </div>
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <div className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{value}</div>
      <div className="flex items-center gap-3 text-xs">
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg font-medium flex items-center gap-1 border border-emerald-500/20">
          <TrendingUp size={14} /> {trend}
        </span>
        <span className="text-gray-500 font-medium">{sub}</span>
      </div>
    </div>
  </div>
);

const LightStatCard = ({ title, value, trend, icon: Icon, trendDown }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-5">
      <div className="p-3 bg-gray-50 rounded-xl text-gray-500 border border-gray-100 group-hover:scale-110 transition-transform duration-300">
        <Icon size={20} strokeWidth={2} />
      </div>
      <button className="text-gray-300 hover:text-gray-600 transition-colors">
          <ArrowUpRight size={20} />
      </button>
    </div>
    <div className="space-y-1">
       <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
       <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>
    <div className="mt-5 flex items-center gap-2 text-xs">
      {trendDown ? (
         <span className="text-red-600 flex items-center font-bold bg-red-50 px-2 py-1 rounded-md">
           <TrendingDown size={14} className="mr-1" /> {trend}
         </span>
      ) : (
        <span className="text-emerald-600 flex items-center font-bold bg-emerald-50 px-2 py-1 rounded-md">
           <TrendingUp size={14} className="mr-1" /> {trend}
        </span>
      )}
      <span className="text-gray-400 font-medium">vs last month</span>
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium group relative mb-1
      ${active 
        ? 'bg-white text-black shadow-lg shadow-black/5' 
        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
    }`}
  >
    <div className="flex items-center gap-3.5">
      <Icon size={18} strokeWidth={active ? 2.5 : 2} className={`transition-colors ${active ? 'text-accent' : 'text-gray-500 group-hover:text-gray-300'}`} />
      {label}
    </div>
    {badge && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-gray-100 text-gray-900' : 'bg-white/10 text-white'}`}>
        {badge}
      </span>
    )}
  </button>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // App State
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [userProfile, setUserProfile] = useState({ firstName: 'Matthew', lastName: 'Parker', email: 'matthew@nexus.com' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'deal' | 'lead' | 'task'>('deal');
  
  // Form State (Temporary)
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  
  // Derived Data for Charts (REALTIME)
  const pipelineValue = useMemo(() => deals.reduce((acc, curr) => acc + curr.value, 0), [deals]);
  const lostDealsCount = useMemo(() => deals.filter(d => d.stage === DealStage.ClosedLost).length, [deals]);
  const tasksCount = useMemo(() => tasks.filter(t => !t.completed).length, [tasks]);

  const pipelineChartData = useMemo(() => {
    const stages = Object.values(DealStage);
    return stages.map(stage => ({
      name: stage.split(' ')[0], // Shorten name
      value: deals.filter(d => d.stage === stage).length
    }));
  }, [deals]);

  const leadSourceChartData = useMemo(() => {
    const sources = ['Website', 'Referral', 'LinkedIn', 'Ads', 'Other'];
    return sources.map(source => ({
      name: source,
      value: leads.filter(l => l.source === source).length || 0 // Fallback to 0
    })).filter(d => d.value > 0); // Only show active sources
  }, [leads]);

  const salesPerformanceData = useMemo(() => {
    // Mock calculation based on deals value
    const base = 2000;
    return [
      { name: 'Mon', current: base + Math.random() * 1000, previous: base - 200 },
      { name: 'Tue', current: base + Math.random() * 2000, previous: base + 100 },
      { name: 'Wed', current: pipelineValue / 10, previous: base + 500 }, // Dynamic based on total value
      { name: 'Thu', current: base + Math.random() * 1500, previous: base + 800 },
      { name: 'Fri', current: base + Math.random() * 2500, previous: base - 500 },
      { name: 'Sat', current: base + 800, previous: base + 200 },
      { name: 'Sun', current: base + 1200, previous: base + 400 },
    ];
  }, [pipelineValue]); // Updates when pipeline value changes

  const handleStageChange = (dealId: string, newStage: DealStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleOpenModal = (type: 'deal' | 'lead' | 'task') => {
    setModalType(type);
    setNewItemTitle('');
    setNewItemValue('');
    setIsModalOpen(true);
  };

  const handleSaveNewItem = () => {
    if (!newItemTitle) return;

    if (modalType === 'deal') {
      const newDeal: Deal = {
        id: `d${Date.now()}`,
        title: newItemTitle,
        value: Number(newItemValue) || 0,
        stage: DealStage.Discovery,
        contactId: 'c1', // Default to first contact for demo
        expectedCloseDate: new Date().toISOString(),
        probability: 20
      };
      setDeals([...deals, newDeal]);
    } else if (modalType === 'lead') {
      const newLead: Lead = {
        id: `l${Date.now()}`,
        contact: { ...MOCK_CONTACTS[0], name: newItemTitle }, // Mock contact creation
        status: LeadStatus.New,
        source: 'Manual',
        createdAt: new Date().toISOString().split('T')[0],
        tags: ['New']
      };
      setLeads([...leads, newLead]);
    } else if (modalType === 'task') {
      const newTask: Task = {
        id: `t${Date.now()}`,
        title: newItemTitle,
        dueDate: 'Tomorrow',
        completed: false,
        priority: Priority.Medium
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn pb-20">
            {/* Welcome Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100/80">
               <div className="space-y-1">
                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {userProfile.firstName} 👋</h1>
                 <p className="text-gray-500 text-sm lg:text-base">Here's what's happening with your store today.</p>
               </div>
               <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="flex-1 lg:flex-none flex items-center bg-gray-50 border border-gray-100/50 rounded-full px-5 py-3 w-full lg:w-72 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100 transition-all shadow-sm">
                    <Search size={18} className="text-gray-400 mr-3" />
                    <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400" />
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HeroStatCard title="Total Pipeline" value={`$${pipelineValue.toLocaleString()}`} trend="+15.6%" sub="active deals" />
              <LightStatCard title="Active Leads" value={leads.length.toString()} trend="+12.7%" icon={Users} />
              <LightStatCard title="Lost Deals" value={lostDealsCount.toString()} trend="-2.3%" icon={TrendingDown} trendDown />
              <LightStatCard title="Pending Tasks" value={tasksCount.toString()} trend="+5" icon={CheckSquare} />
            </div>

            {/* Graphs Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Sales Performance */}
              <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Sales Performance</h3>
                    <p className="text-sm text-gray-500 mt-1">Revenue vs Previous Period</p>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9CA3AF" fontSize={12} dy={10} />
                        <YAxis axisLine={false} tickLine={false} stroke="#9CA3AF" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', padding: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                          itemStyle={{ color: '#fff' }}
                          cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                        />
                        <Line type="monotone" dataKey="current" name="Current Period" stroke="#101010" strokeWidth={3} dot={{ r: 4, fill: '#101010', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
                        <Line type="monotone" dataKey="previous" name="Previous Period" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>

              {/* Lead Sources */}
              <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <div className="mb-6 flex justify-between items-center">
                   <h3 className="font-bold text-gray-900 text-lg">Lead Sources</h3>
                </div>
                <div className="flex-1 relative min-h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourceChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {leadSourceChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#18181B', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">Total Leads</div>
                  </div>
                </div>
                <div className="space-y-3 mt-2">
                   {leadSourceChartData.slice(0, 4).map((item, idx) => (
                     <div key={item.name} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                          <span className="text-gray-600 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Graphs Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
               {/* Pipeline Stage */}
               <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base mb-8">Deals by Stage</h3>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pipelineChartData} barSize={36}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9CA3AF" fontSize={11} dy={10} />
                        <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ backgroundColor: '#18181B', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {pipelineChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Visitors */}
               <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base mb-8">Traffic Trend</h3>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                          { name: 'Mon', visitors: 240 },
                          { name: 'Tue', visitors: 139 },
                          { name: 'Wed', visitors: 980 },
                          { name: 'Thu', visitors: 390 },
                          { name: 'Fri', visitors: 480 },
                          { name: 'Sat', visitors: 380 },
                          { name: 'Sun', visitors: 430 },
                      ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9CA3AF" fontSize={11} dy={10} />
                        <YAxis axisLine={false} tickLine={false} stroke="#9CA3AF" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181B', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Recent Activity */}
               <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-base">Recent Activity</h3>
                    <button className="text-xs font-semibold text-accent hover:text-purple-700">View All</button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                    {RECENT_ACTIVITIES.map((act, idx) => (
                      <div key={act.id} className="flex gap-4 relative group">
                        <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-gray-100 last:hidden"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white text-gray-500 border border-gray-200 group-hover:border-accent group-hover:text-accent transition-all z-10 shadow-sm`}>
                           {act.type === 'call' ? <Phone size={14} /> : act.type === 'email' ? <Mail size={14} /> : <FileText size={14} />}
                        </div>
                        <div className="pb-1 pt-0.5">
                          <p className="text-sm text-gray-800 font-semibold leading-snug group-hover:text-accent transition-colors cursor-pointer">{act.description}</p>
                          <p className="text-xs text-gray-400 mt-1 font-medium">{act.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 'leads':
        return (
          <div className="space-y-6 animate-fadeIn h-full flex flex-col pb-10">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leads</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage and track your potential customers.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Filter size={18} /> Filter
                  </button>
                  <button 
                    onClick={() => handleOpenModal('lead')}
                    className="flex-1 sm:flex-none bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-black/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> New Lead
                  </button>
                </div>
             </div>
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
               <div className="overflow-x-auto flex-1">
                 <table className="w-full text-left text-sm min-w-[800px]">
                   <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider text-[11px]">
                     <tr>
                       <th className="py-5 px-6 pl-8 font-bold text-gray-400">Contact</th>
                       <th className="py-5 px-6 font-bold text-gray-400">Company</th>
                       <th className="py-5 px-6 font-bold text-gray-400">Status</th>
                       <th className="py-5 px-6 font-bold text-gray-400">Source</th>
                       <th className="py-5 px-6 font-bold text-gray-400">Tags</th>
                       <th className="py-5 px-6"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {leads.map(lead => (
                       <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                         <td className="py-4 px-6 pl-8">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs border border-gray-200 shadow-sm">
                                {lead.contact.name.charAt(0)}
                             </div>
                             <div>
                               <div className="font-bold text-gray-900 text-sm group-hover:text-accent transition-colors">{lead.contact.name}</div>
                               <div className="text-xs text-gray-500 font-medium">{lead.contact.email}</div>
                             </div>
                           </div>
                         </td>
                         <td className="py-4 px-6 text-gray-600 font-medium text-sm">{lead.contact.company}</td>
                         <td className="py-4 px-6">
                           <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide border shadow-sm
                             ${lead.status === LeadStatus.New ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                               lead.status === LeadStatus.Contacted ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                               'bg-gray-100 text-gray-600 border-gray-200'}`}>
                             {lead.status}
                           </span>
                         </td>
                         <td className="py-4 px-6 text-gray-500 text-sm font-medium">{lead.source}</td>
                         <td className="py-4 px-6">
                           <div className="flex flex-wrap gap-1.5">
                             {lead.tags.map(tag => (
                               <span key={tag} className="px-2.5 py-1 bg-white text-gray-600 text-[10px] font-semibold rounded-md border border-gray-200 shadow-sm">{tag}</span>
                             ))}
                           </div>
                         </td>
                         <td className="py-4 px-6 text-right">
                           <button className="text-gray-300 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-full">
                             <ChevronRight size={18} />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="space-y-6 animate-fadeIn h-full flex flex-col pb-10">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contacts</h1>
                  <p className="text-sm text-gray-500 mt-1">View and manage your network.</p>
                </div>
                <button className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-black/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                  <Plus size={18} /> Add Contact
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_CONTACTS.map(contact => (
                  <div key={contact.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group relative">
                     <button className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors"><MoreHorizontal size={20} /></button>
                     <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center text-xl font-bold text-gray-500 border border-gray-200 shadow-inner overflow-hidden">
                        <img src={contact.avatar} alt="" className="w-full h-full object-cover opacity-90" />
                     </div>
                     <div className="text-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                        <p className="text-xs text-accent font-semibold mt-1 bg-purple-50 inline-block px-2 py-0.5 rounded-md border border-purple-100">{contact.role}</p>
                        <p className="text-sm text-gray-500 mt-2">{contact.company}</p>
                     </div>
                     <div className="space-y-3 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Mail size={16} className="text-gray-400" /> 
                           <span className="truncate">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Phone size={16} className="text-gray-400" /> 
                           <span>{contact.phone}</span>
                        </div>
                     </div>
                     <button className="w-full mt-5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-100 transition-colors">
                        View Profile
                     </button>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'companies':
        return (
          <div className="space-y-6 animate-fadeIn h-full flex flex-col pb-10">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
              <button className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">New Company</button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider text-[11px]">
                       <tr>
                          <th className="py-4 px-6 pl-8">Company</th>
                          <th className="py-4 px-6">Industry</th>
                          <th className="py-4 px-6">Location</th>
                          <th className="py-4 px-6">Size</th>
                          <th className="py-4 px-6">Website</th>
                          <th className="py-4 px-6"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {MOCK_COMPANIES.map(comp => (
                          <tr key={comp.id} className="hover:bg-gray-50/80 transition-colors">
                             <td className="py-4 px-6 pl-8">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                                      <img src={comp.logo} className="w-full h-full object-contain rounded" />
                                   </div>
                                   <span className="font-bold text-gray-900">{comp.name}</span>
                                </div>
                             </td>
                             <td className="py-4 px-6 text-gray-600">{comp.industry}</td>
                             <td className="py-4 px-6 text-gray-600 flex items-center gap-1"><MapPin size={14} className="text-gray-400"/> {comp.location}</td>
                             <td className="py-4 px-6 text-gray-600">{comp.employees}</td>
                             <td className="py-4 px-6 text-accent font-medium hover:underline cursor-pointer">{comp.website}</td>
                             <td className="py-4 px-6 text-right"><MoreHorizontal size={18} className="text-gray-400 cursor-pointer"/></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        );
      case 'deals':
        return (
          <div className="h-[calc(100vh-5rem)] flex flex-col animate-fadeIn pb-4 lg:pb-0">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pipeline</h1>
                </div>
                <div className="flex gap-3 items-center w-full sm:w-auto">
                   <div className="hidden md:flex text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl items-center gap-2">
                      Total Value: <span className="text-gray-900 text-sm">${pipelineValue.toLocaleString()}</span>
                   </div>
                   <button 
                    onClick={() => handleOpenModal('deal')}
                    className="flex-1 sm:flex-none bg-black text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-black/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                   >
                      <Plus size={16} /> Add Deal
                   </button>
                </div>
             </div>
             <div className="flex-1 min-h-0 bg-white/40 rounded-3xl border border-gray-200/60 p-4 backdrop-blur-sm overflow-hidden">
               <PipelineBoard deals={deals} onStageChange={handleStageChange} />
             </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-6 animate-fadeIn h-full flex flex-col pb-10">
             <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage your to-do list and priorities.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal('task')}
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2"
                >
                   <Plus size={16} /> New Task
                </button>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                   {tasks.map(task => (
                      <div key={task.id} className={`bg-white p-5 rounded-xl border shadow-sm flex items-start gap-4 transition-all group hover:shadow-md ${task.completed ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}>
                         <div 
                            onClick={() => handleToggleTask(task.id)}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-accent'}`}
                         >
                            {task.completed && <CheckSquare size={14} strokeWidth={3} />}
                         </div>
                         <div className="flex-1">
                            <h4 className={`font-bold text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                            {task.relatedTo && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Briefcase size={12}/> {task.relatedTo}</p>}
                            <div className="flex items-center gap-3 mt-3">
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  task.priority === Priority.High ? 'bg-red-50 text-red-600 border-red-100' :
                                  task.priority === Priority.Medium ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                  'bg-gray-100 text-gray-600 border-gray-200'
                               }`}>
                                  {task.priority.toUpperCase()}
                               </span>
                               <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> {task.dueDate}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
                   <h3 className="font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex flex-col items-center justify-center border border-purple-100">
                            <span className="text-[10px] font-bold uppercase">Oct</span>
                            <span className="text-sm font-bold leading-none">24</span>
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">Client Meeting</p>
                            <p className="text-xs text-gray-500">2:00 PM • Zoom</p>
                         </div>
                      </div>
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center border border-blue-100">
                            <span className="text-[10px] font-bold uppercase">Oct</span>
                            <span className="text-sm font-bold leading-none">25</span>
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">Proposal Due</p>
                            <p className="text-xs text-gray-500">5:00 PM • DesignCo</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'documents':
         return (
            <div className="space-y-6 animate-fadeIn h-full flex flex-col pb-10">
               <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                  <button className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2"><Plus size={16}/> Upload File</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MOCK_DOCUMENTS.map(doc => (
                     <div key={doc.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              doc.type === 'PDF' ? 'bg-red-50 text-red-500' :
                              doc.type === 'XLS' ? 'bg-green-50 text-green-600' :
                              doc.type === 'IMG' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-600'
                           }`}>
                              <File size={20} />
                           </div>
                           <button className="text-gray-300 hover:text-black"><MoreVertical size={16}/></button>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm truncate mb-1" title={doc.name}>{doc.name}</h4>
                        <p className="text-xs text-gray-400 mb-4">{doc.size} • {doc.date}</p>
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                           <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white text-[10px] flex items-center justify-center font-bold text-gray-500">MP</div>
                           </div>
                           <button className="text-gray-400 hover:text-accent"><Download size={16}/></button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         );
      case 'reports':
         return (
            <div className="space-y-6 animate-fadeIn h-full flex flex-col pb-10">
               <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                  <div className="flex gap-2">
                     <select className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-lg px-3 py-2 outline-none"><option>Last 30 Days</option></select>
                     <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Export CSV</button>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-6">Conversion Funnel</h3>
                     <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={[
                              { name: 'Leads', value: leads.length, fill: '#7C3AED' },
                              { name: 'Qualified', value: leads.filter(l => l.status === LeadStatus.Qualified).length, fill: '#8B5CF6' },
                              { name: 'Deals', value: deals.length, fill: '#A78BFA' },
                              { name: 'Closed', value: deals.filter(d => d.stage === DealStage.ClosedWon).length, fill: '#C4B5FD' },
                           ]} layout="vertical" margin={{left: 20}}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6"/>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} />
                              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                              <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]}>
                                 {/* Cells are mapped in data */}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-6">Revenue Goals</h3>
                      <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={[
                              {name: 'Target', value: 100, fill: '#F3F4F6'},
                              {name: 'Achieved', value: 75, fill: '#7C3AED'}
                           ]}>
                              <RadialBar background dataKey="value" cornerRadius={10}/>
                              <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
                              <Tooltip />
                           </RadialBarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
         );
      case 'settings':
         return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
               <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
               
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                     <h3 className="font-bold text-lg text-gray-900">Profile Information</h3>
                     <p className="text-sm text-gray-500">Update your photo and personal details.</p>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-400">
                           {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                        </div>
                        <div>
                           <button type="button" className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Change Photo</button>
                           <p className="text-xs text-gray-400 mt-2">JPG or PNG. Max 1MB.</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-gray-700">First Name</label>
                           <input 
                            type="text" 
                            value={userProfile.firstName}
                            onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-gray-700">Last Name</label>
                           <input 
                             type="text" 
                             value={userProfile.lastName}
                             onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                             className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                           />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                           <label className="text-sm font-bold text-gray-700">Email Address</label>
                           <input 
                             type="email" 
                             value={userProfile.email}
                             onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                             className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                           />
                        </div>
                     </div>
                     <div className="pt-4 text-right border-t border-gray-100 -mx-8 px-8 -mb-8 pb-8 bg-gray-50">
                       <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:opacity-90">Save Changes</button>
                     </div>
                  </form>
               </div>
               
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Bell size={18}/></div>
                           <div>
                              <p className="font-bold text-sm text-gray-900">Email Notifications</p>
                              <p className="text-xs text-gray-500">Receive emails about new leads</p>
                           </div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"/>
                     </div>
                  </div>
               </div>
            </div>
         );
      case 'ai':
        return (
          <div className="h-[calc(100vh-6rem)] animate-fadeIn flex flex-col pb-4">
             <div className="mb-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-gradient-to-br from-violet-600 to-purple-500 rounded-xl text-white shadow-lg shadow-purple-500/30">
                  <Sparkles size={24} strokeWidth={1.5} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Studio</h1>
                  <p className="text-sm text-gray-500 font-medium">Powered by Gemini 2.5 • Intelligent automation</p>
               </div>
             </div>
             <div className="flex-1 min-h-0">
               <AIAssistant />
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fadeIn" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      {/* Global Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {modalType === 'lead' ? 'Contact Name' : 'Title'}
            </label>
            <input 
              type="text" 
              value={newItemTitle} 
              onChange={e => setNewItemTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
              placeholder={modalType === 'lead' ? 'e.g. John Doe' : 'e.g. Big Sale'}
              autoFocus
            />
          </div>
          {modalType === 'deal' && (
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Value ($)</label>
                <input 
                  type="number" 
                  value={newItemValue} 
                  onChange={e => setNewItemValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  placeholder="5000"
                />
             </div>
          )}
          <button 
            onClick={handleSaveNewItem}
            className="w-full bg-black text-white py-3 rounded-lg font-bold shadow-lg mt-2 hover:bg-gray-800"
          >
            Save {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
          </button>
        </div>
      </Modal>

      {/* Dark Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[#18181b] border-r border-gray-800 transform transition-transform duration-300 ease-out flex flex-col p-4 shadow-2xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="h-20 flex items-center px-4 mb-2">
          <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
              <Command size={20} strokeWidth={3} />
            </div>
            Nexus CRM
          </div>
          <button className="lg:hidden ml-auto text-gray-400 hover:text-white p-2" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto pr-2">
          <div className="px-4 mb-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-4">Overview</div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }} />
          <SidebarItem icon={Target} label="Leads" active={activeView === 'leads'} onClick={() => { setActiveView('leads'); setSidebarOpen(false); }} badge={leads.length} />
          <SidebarItem icon={Briefcase} label="Pipeline" active={activeView === 'deals'} onClick={() => { setActiveView('deals'); setSidebarOpen(false); }} />
          <SidebarItem icon={CheckSquare} label="Tasks" active={activeView === 'tasks'} onClick={() => { setActiveView('tasks'); setSidebarOpen(false); }} badge={tasksCount > 0 ? tasksCount : undefined} />
          
          <div className="my-6 mx-4 border-t border-gray-800/50"></div>
          
          <div className="px-4 mb-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Database</div>
          <SidebarItem icon={Users} label="Contacts" active={activeView === 'contacts'} onClick={() => { setActiveView('contacts'); setSidebarOpen(false); }} />
          <SidebarItem icon={Building2} label="Companies" active={activeView === 'companies'} onClick={() => { setActiveView('companies'); setSidebarOpen(false); }} />
          <SidebarItem icon={FolderOpen} label="Documents" active={activeView === 'documents'} onClick={() => { setActiveView('documents'); setSidebarOpen(false); }} />

          <div className="my-6 mx-4 border-t border-gray-800/50"></div>

          <div className="px-4 mb-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Intelligence</div>
          <SidebarItem icon={BarChart3} label="Reports" active={activeView === 'reports'} onClick={() => { setActiveView('reports'); setSidebarOpen(false); }} />
          <SidebarItem icon={Sparkles} label="AI Generator" active={activeView === 'ai'} onClick={() => { setActiveView('ai'); setSidebarOpen(false); }} />
          
          <div className="px-4 mb-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-8">Settings</div>
           <SidebarItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => { setActiveView('settings'); setSidebarOpen(false); }} />
        </div>

        <div className="mt-auto pt-6 border-t border-gray-800/50">
            <div 
              onClick={() => { setActiveView('settings'); setSidebarOpen(false); }}
              className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-black">
                  {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-gray-100">{userProfile.firstName} {userProfile.lastName}</p>
                  <p className="text-[10px] text-gray-500 truncate group-hover:text-gray-400">Pro Plan • Admin</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsAuthenticated(false); }}
                  className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
                >
                  <LogOut size={16} />
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Mobile Header (Sticky) */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/80 h-16 px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-black p-2 -ml-2" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg tracking-tight">Nexus</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
              {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden scroll-smooth bg-[#F9FAFB]">
          <div className="max-w-[1600px] mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;