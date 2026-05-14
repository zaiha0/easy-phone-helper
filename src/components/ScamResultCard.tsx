import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldX, XCircle, ArrowRight } from 'lucide-react';
import type { ScamCheckResult } from '../types';

interface Props {
  result: ScamCheckResult;
}

const levelConfig = {
  safe: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    badge: 'bg-emerald-600 text-white',
    icon: ShieldCheck,
    iconColor: 'text-emerald-600',
    label: '안전해 보여요',
    doNotBg: 'bg-emerald-100',
    doNotText: 'text-emerald-800',
    nextBg: 'bg-blue-50',
    nextText: 'text-blue-800',
  },
  caution: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    badge: 'bg-amber-500 text-white',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    label: '주의가 필요해요',
    doNotBg: 'bg-red-50',
    doNotText: 'text-red-700',
    nextBg: 'bg-blue-50',
    nextText: 'text-blue-800',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    badge: 'bg-red-600 text-white',
    icon: ShieldX,
    iconColor: 'text-red-600',
    label: '위험할 수 있어요',
    doNotBg: 'bg-red-100',
    doNotText: 'text-red-800',
    nextBg: 'bg-blue-50',
    nextText: 'text-blue-800',
  },
};

export default function ScamResultCard({ result }: Props) {
  const cfg = levelConfig[result.level];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`rounded-3xl border-2 p-6 space-y-5 ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={36} className={cfg.iconColor} strokeWidth={2} />
        <span className={`font-bold rounded-full px-4 py-1 ${cfg.badge}`} style={{ fontSize: '19px' }}>
          {cfg.label}
        </span>
      </div>

      <p className="font-bold text-gray-900 leading-relaxed" style={{ fontSize: '22px' }}>
        {result.summary}
      </p>

      {result.reasons.length > 0 && (
        <div>
          <p className="font-bold text-gray-700 mb-2" style={{ fontSize: '19px' }}>이유</p>
          <ul className="space-y-2">
            {result.reasons.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-2 text-gray-700 leading-relaxed"
                style={{ fontSize: '18px' }}
              >
                <span className="mt-1 flex-shrink-0">•</span>
                {r}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {result.doNot.length > 0 && (
        <div className={`rounded-2xl p-4 ${cfg.doNotBg}`}>
          <p className={`font-bold mb-2 ${cfg.doNotText}`} style={{ fontSize: '19px' }}>
            하지 마세요
          </p>
          <ul className="space-y-2">
            {result.doNot.map((d, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`flex items-start gap-2 font-semibold leading-relaxed ${cfg.doNotText}`}
                style={{ fontSize: '18px' }}
              >
                <XCircle size={20} className="mt-0.5 flex-shrink-0" />
                {d}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className={`rounded-2xl p-4 ${cfg.nextBg}`}>
        <p className={`font-bold ${cfg.nextText}`} style={{ fontSize: '19px' }}>
          다음 행동
        </p>
        <div className={`flex items-start gap-2 mt-1 ${cfg.nextText}`} style={{ fontSize: '18px' }}>
          <ArrowRight size={20} className="mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">{result.nextAction}</span>
        </div>
      </div>

      <p className="text-gray-400 text-center" style={{ fontSize: '15px' }}>
        이 결과는 참고용입니다. 확실하지 않으면 가족이나 공식 고객센터에 먼저 확인하세요.
      </p>
    </motion.div>
  );
}
