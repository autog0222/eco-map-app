import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car, Truck, Zap, Check, Mic, Navigation, Layers, ShieldCheck,
    Clock, TrendingUp, DollarSign, Leaf, Gauge, ArrowRight,
    Trophy, Medal, MapPin, Users, Award, Menu, User, Map as MapIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- COLORS (Naver Style) ---
const NAVER_GREEN = "bg-[#03C75A]";
const NAVER_GREEN_TEXT = "text-[#03C75A]";
const NAVER_BORDER = "border-[#03C75A]";
const NAVER_HOVER = "hover:bg-[#02b351]";

// --- CONSTANTS ---
const VEHICLE_TYPES = [
    {
        id: 'eco',
        name: '친환경/전기차 (Eco/EV)',
        multiplier: 0.5,
        description: '상징적 참여 (저공해)',
        icon: 'Leaf'
    },
    {
        id: 'sedan',
        name: '일반 승용차 (Sedan)',
        multiplier: 1.0,
        description: '정책 기준점',
        icon: 'Car'
    },
    {
        id: 'commercial',
        name: '소형 상용차 (1톤)',
        multiplier: 2.0,
        description: '생계형 물류 차량',
        icon: 'Truck'
    },
    {
        id: 'heavy',
        name: '대형 화물차 (Heavy)',
        multiplier: 3.0,
        description: '배출가스 저감 핵심 타겟',
        icon: 'Container'
    }
];

const ROUTES = [
    {
        type: 'fastest',
        label: '최단 경로 (Fastest)',
        time: 30, // minutes
        fuel: 3.0, // Liters
        distance: 15.2,
        trafficLevel: 'high',
        color: 'gray',
        rewards: {
            entry: 0,
            opportunity: 0,
            social: 0
        }
    },
    {
        type: 'eco',
        label: '탄소 절감 경로 (Eco)',
        time: 34, // minutes - 4 min delay
        fuel: 2.4, // Liters - 20% savings
        distance: 16.5,
        trafficLevel: 'low',
        color: 'green',
        slopeScore: 95,
        idleTime: 2,
        rewards: {
            entry: 50, // 참여 인센티브
            opportunity: 120, // 기회비용 보상
            social: 80 // 사회적 비용 환원
        }
    }
];

const RANKING_DATA = [
    { rank: 1, name: 'EcoWarrior_99', points: 12500, region: '서울 강남구' },
    { rank: 2, name: 'GreenTrucker', points: 11200, region: '부산 해운대구' },
    { rank: 3, name: 'NatureLover', points: 9800, region: '인천 연수구' },
];

const ICONS = {
    Leaf: Zap,
    Car: Car,
    Truck: Truck,
    Container: Truck,
};

// --- COMPONENTS ---

const MobileLayout = ({ children, className }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start overflow-hidden font-sans">
            <div className={cn(
                "w-full max-w-md h-screen bg-white relative overflow-hidden flex flex-col shadow-2xl",
                className
            )}>
                {children}
            </div>
        </div>
    );
};

const VehicleSelector = ({ selectedVehicle, onSelect, onConfirm }) => {
    return (
        <div className="absolute inset-0 z-50 bg-white p-6 flex flex-col">
            <div className="mb-8 mt-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">차량 정보 설정</h1>
                <p className="text-gray-500">
                    차량 종류와 배기량에 따라 <br/>
                    <span className="text-[#03C75A] font-bold">탄소 포인트 가중치</span>가 달라집니다.
                </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pb-24">
                {VEHICLE_TYPES.map((type) => {
                    const Icon = ICONS[type.icon] || Car;
                    const isSelected = selectedVehicle?.id === type.id;

                    return (
                        <motion.button
                            key={type.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(type)}
                            className={`w-full p-4 rounded-xl border-2 text-left flex items-center transition-all ${isSelected
                                    ? `border-[#03C75A] bg-green-50`
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className={`p-3 rounded-full mr-4 ${isSelected ? 'bg-[#03C75A] text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-900">{type.name}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${isSelected ? 'bg-[#03C75A]/20 text-[#03C75A]' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        x{type.multiplier.toFixed(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{type.description}</p>
                            </div>
                            {isSelected && <Check className="text-[#03C75A] ml-2" size={20} />}
                        </motion.button>
                    );
                })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
                <button
                    onClick={onConfirm}
                    disabled={!selectedVehicle}
                    className={`w-full text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg ${NAVER_GREEN} ${NAVER_HOVER}`}
                >
                    설정 완료 및 시작
                </button>
            </div>
        </div>
    );
};

const MapInterface = () => {
    return (
        <div className="absolute inset-0 bg-gray-100 z-0">
            {/* Fake Map SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{backgroundColor: '#ebf0f0'}}>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                     <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#dce3e3" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M-10 100 Q 150 50 300 200 T 500 400" stroke="#cbd5e0" strokeWidth="20" fill="none" />
                <path d="M-10 100 Q 150 50 300 200 T 500 400" stroke="white" strokeWidth="16" fill="none" />
                
                <path d="M50 800 Q 200 600 350 400 T 500 100" stroke="#cbd5e0" strokeWidth="15" fill="none" />
                <path d="M50 800 Q 200 600 350 400 T 500 100" stroke="white" strokeWidth="11" fill="none" />
            </svg>

            {/* Current Location Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-blue-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            </div>

            {/* Top Bar (Search) */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
                <div className="flex-1 bg-white rounded-lg shadow-md p-3 flex items-center gap-3">
                    <Navigation className="text-[#03C75A]" size={20} />
                    <span className="text-gray-400 font-medium">목적지 검색...</span>
                </div>
                <button className="bg-white p-3 rounded-lg shadow-md text-[#03C75A] hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <Mic size={24} />
                </button>
            </div>

            {/* Anti-Fraud Indicator */}
            <div className="absolute top-20 left-4 z-10">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-green-100 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#03C75A]" />
                    <span className="text-[10px] font-bold text-[#03C75A] uppercase tracking-wide">
                        AI 패턴 분석 중 (부정수급 방지)
                    </span>
                </div>
            </div>

            {/* Map Tools */}
            <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
                <button className="bg-white p-2 rounded shadow text-gray-600">
                    <Layers size={20} />
                </button>
            </div>
        </div>
    );
};

const RouteBottomSheet = ({ onSelectRoute, vehicleMultiplier }) => {
    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20 max-h-[80vh] overflow-y-auto"
        >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-6" />

            <div className="px-6 pb-8 space-y-4">
                {ROUTES.map((route) => {
                    const isEco = route.type === 'eco';
                    const savedFuelCost = isEco ? ((3.0 - 2.4) * 1600).toFixed(0) : 0;
                    
                    // calculate rewards safely
                    const totalRewards = route.rewards 
                        ? (Object.values(route.rewards).reduce((a, b) => a + b, 0) * vehicleMultiplier).toFixed(0)
                        : 0;

                    return (
                        <button
                            key={route.type}
                            onClick={() => onSelectRoute(route)}
                            className={`w-full relative overflow-hidden rounded-2xl border-2 transition-all p-4 text-left ${isEco
                                    ? `border-[#03C75A] bg-green-50/50 hover:bg-green-50`
                                    : 'border-gray-100 bg-white hover:bg-gray-50'
                                }`}
                        >
                            {isEco && (
                                <div className="absolute top-0 right-0 bg-[#03C75A] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    추천 (Eco)
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className={`font-bold text-lg flex items-center gap-2 ${isEco ? 'text-[#03C75A]' : 'text-gray-900'
                                        }`}>
                                        {route.label}
                                        {isEco && <Leaf size={16} className="fill-current" />}
                                    </h3>
                                    <div className="text-3xl font-extrabold flex items-baseline gap-1 my-1 text-gray-800">
                                        {route.time} <span className="text-sm font-normal text-gray-500">분</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500 mb-1">예상 연료</div>
                                    <div className="font-bold text-gray-900">{route.fuel}L</div>
                                </div>
                            </div>

                            {isEco ? (
                                <div className="bg-white/80 rounded-xl p-3 border border-green-100 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 flex items-center gap-1.5">
                                            <DollarSign size={14} /> 연료비 절감
                                        </span>
                                        <span className="font-bold text-green-600">
                                            약 {savedFuelCost}원 절약
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 flex items-center gap-1.5">
                                            <Gauge size={14} /> 교통 흐름
                                        </span>
                                        <span className="font-bold text-blue-600">원활함</span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-dashed border-green-200">
                                        <p className="text-xs text-[#03C75A] font-semibold text-center">
                                            지금 출발 시 {totalRewards} 포인트 적립 예정!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-gray-50 rounded px-2 py-1 text-xs text-gray-500 flex items-center justify-center gap-1">
                                        <TrendingUp size={12} /> 경사도 높음
                                    </div>
                                    <div className="bg-red-50 rounded px-2 py-1 text-xs text-red-500 flex items-center justify-center gap-1">
                                        정체 구간 포함
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

const RewardBreakdown = ({ route, vehicleMultiplier, onContinue }) => {
    // FIX: Default to empty object if rewards is undefined (e.g., fastest route)
    const { entry = 0, opportunity = 0, social = 0 } = route.rewards || {};
    const totalBase = entry + opportunity + social;
    const finalPoints = Math.round(totalBase * vehicleMultiplier);

    const steps = [
        {
            id: 1,
            title: "참여 인센티브 (Entry)",
            desc: "탄소 경로 선택 기본 보상",
            points: entry,
            icon: Check,
            color: "text-blue-500",
            bg: "bg-blue-100"
        },
        {
            id: 2,
            title: "기회비용 보상",
            desc: "지연 시간(4분) x 최저임금 환산",
            points: opportunity,
            icon: TrendingUp,
            color: "text-amber-500",
            bg: "bg-amber-100"
        },
        {
            id: 3,
            title: "사회적 비용 환원",
            desc: "연료 절감액 + 탄소 배출 감축분",
            points: social,
            icon: Leaf,
            color: "text-green-500",
            bg: "bg-green-100"
        }
    ];

    return (
        <div className="absolute inset-0 bg-white z-30 flex flex-col">
            <div className={`p-6 ${totalBase > 0 ? NAVER_GREEN : 'bg-gray-800'} text-white pb-12 rounded-b-[2.5rem] shadow-lg transition-colors`}>
                <h2 className="text-xl font-bold mb-1 opacity-90">운행 완료!</h2>
                <div className="text-4xl font-extrabold flex items-baseline gap-2">
                    +{finalPoints} <span className="text-lg font-medium opacity-80">Points</span>
                </div>
                {totalBase > 0 ? (
                     <p className="text-sm opacity-80 mt-2">
                        차량 가중치: <strong>x{vehicleMultiplier.toFixed(1)}</strong> 적용됨
                    </p>
                ) : (
                    <p className="text-sm opacity-80 mt-2 text-gray-300">
                        탄소 경로를 선택하지 않아 보상이 없습니다.
                    </p>
                )}
               
            </div>

            <div className="-mt-8 px-6 flex-1 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">3단계 정밀 보상 내역</h3>

                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className={`flex items-start gap-4 ${totalBase === 0 ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-full ${step.bg} ${step.color} flex items-center justify-center shrink-0`}>
                                    <step.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="font-bold text-gray-800 text-sm">Step {step.id}: {step.title}</span>
                                        <span className="font-bold text-gray-900">+{step.points}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-snug">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500 text-sm">기본 산정액</span>
                        <span className="font-bold text-gray-400">{totalBase} pts</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onContinue}
                        className="bg-gray-900 text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 px-8"
                    >
                        <span className="font-bold">메인으로</span> <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Gamification = () => {
    const [activeTab, setActiveTab] = useState('ranking');

    return (
        <div className="absolute inset-0 bg-gray-50 z-20 flex flex-col pt-4">
            <div className="px-6 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Eco-Hub</h2>
                <p className="text-xs text-gray-500">에코 챔피언스 리그 & 인증</p>
            </div>

            {/* Tabs */}
            <div className="flex px-6 mb-6">
                <button
                    onClick={() => setActiveTab('ranking')}
                    className={`flex-1 py-3 text-sm font-bold rounded-l-xl border-y border-l transition-colors ${activeTab === 'ranking'
                            ? `bg-[#03C75A] border-[#03C75A] text-white`
                            : 'bg-white border-gray-200 text-gray-500'
                        }`}
                >
                    랭킹 (League)
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-3 text-sm font-bold rounded-r-xl border-y border-r transition-colors ${activeTab === 'profile'
                            ? `bg-[#03C75A] border-[#03C75A] text-white`
                            : 'bg-white border-gray-200 text-gray-500'
                        }`}
                >
                    나의 인증서
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">
                {activeTab === 'ranking' ? (
                    <div className="space-y-4">
                        {/* Region Battle */}
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg mb-6">
                            <div className="flex items-center gap-2 mb-2 text-white/80 text-xs font-bold uppercase tracking-wider">
                                <Users size={12} /> 지역 대항전 (Live)
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xl font-bold">서울 강남</div>
                                    <div className="text-sm opacity-90">현재 1위</div>
                                </div>
                                <div className="text-2xl font-extrabold opacity-50">VS</div>
                                <div className="text-right">
                                    <div className="text-xl font-bold opacity-90">부산 해운대</div>
                                    <div className="text-xs opacity-80">4,000점 차이</div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2">주간 베스트 드라이버</h3>
                        {RANKING_DATA.map((user, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                                            'bg-orange-50 text-orange-600'
                                    }`}>
                                    {user.rank}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <MapPin size={10} /> {user.region}
                                    </div>
                                </div>
                                <div className={`font-bold ${NAVER_GREEN_TEXT}`}>
                                    {user.points.toLocaleString()} pts
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transform transition-all hover:scale-[1.02]">
                            <div className={`h-32 ${NAVER_GREEN} relative`}>
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 p-1 bg-white rounded-full">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
                                        🌿
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-8 px-6 text-center">
                                <h2 className="text-xl font-bold text-gray-900">국민 그린 드라이버 인증서</h2>
                                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold mt-2 mb-6">
                                    GOLD TIER (상위 5%)
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 mb-1">총 절감액</div>
                                        <div className="font-bold text-gray-900">₩145,000</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 mb-1">CO2 감축량</div>
                                        <div className="font-bold text-gray-900">-450 kg</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 border-t border-gray-100 text-center text-xs text-gray-400">
                                Verified by Eco-Route Master AI
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP ---

function App() {
    const [appState, setAppState] = useState('setup');
    const [vehicle, setVehicle] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [showGamification, setShowGamification] = useState(false);

    const handleVehicleSelect = (type) => setVehicle(type);

    const handleVehicleConfirm = () => {
        setAppState('idle');
        setTimeout(() => {
            setAppState('planning');
        }, 1500);
    };

    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
        setAppState('navigating');
        setTimeout(() => {
            setAppState('summary');
        }, 2500);
    };

    const handleRestart = () => {
        setAppState('idle');
        setSelectedRoute(null);
        setTimeout(() => {
            setAppState('planning');
        }, 1000);
    };

    return (
        <MobileLayout>
            {appState !== 'setup' && <MapInterface />}

            {appState === 'idle' && !showGamification && (
                <div className="absolute bottom-10 right-4 flex flex-col gap-4 z-10">
                    <button
                        onClick={() => setShowGamification(true)}
                        className={`w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center ${NAVER_GREEN_TEXT}`}
                    >
                        <User size={28} />
                    </button>
                    <button
                        onClick={() => setAppState('planning')}
                        className={`w-14 h-14 ${NAVER_GREEN} rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform`}
                    >
                        <MapIcon size={28} />
                    </button>
                </div>
            )}

            <AnimatePresence>
                {showGamification && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30 }}
                        className="absolute inset-0 z-20 flex flex-col"
                    >
                        <div
                            className="absolute inset-0 bg-black/20"
                            onClick={() => setShowGamification(false)}
                        />
                        <div className="absolute inset-x-0 bottom-0 top-20 bg-white rounded-t-3xl overflow-hidden shadow-2xl flex flex-col">
                            <Gamification />
                            <button
                                onClick={() => setShowGamification(false)}
                                className="absolute top-4 right-4 z-30 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                                <ArrowRight className="rotate-90" size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {appState === 'setup' && (
                    <motion.div key="setup" exit={{ opacity: 0 }} className="absolute inset-0 z-50">
                        <VehicleSelector
                            selectedVehicle={vehicle}
                            onSelect={handleVehicleSelect}
                            onConfirm={handleVehicleConfirm}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {appState === 'planning' && (
                    <RouteBottomSheet
                        key="planning"
                        onSelectRoute={handleRouteSelect}
                        vehicleMultiplier={vehicle?.multiplier || 1}
                    />
                )}
            </AnimatePresence>

            {appState === 'navigating' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="text-center text-white">
                        <div className={`w-16 h-16 border-4 ${NAVER_BORDER} border-t-transparent rounded-full animate-spin mx-auto mb-4`} />
                        <h3 className="text-xl font-bold">목적지로 안내 중...</h3>
                        <p className="opacity-80 mt-2">연비를 절약하는 Eco 주행 모드</p>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {appState === 'summary' && selectedRoute && (
                    <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50">
                        <RewardBreakdown
                            route={selectedRoute}
                            vehicleMultiplier={vehicle?.multiplier || 1}
                            onContinue={handleRestart}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </MobileLayout>
    );
}

export default App;
