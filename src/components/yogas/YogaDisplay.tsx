'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GRAHAS } from '@/lib/constants/grahas';
import type { DetectedYoga } from '@/lib/types/chart';

interface Props {
  yogas: DetectedYoga[];
}

const CATEGORY_STYLES: Record<string, { icon: string; bg: string; border: string }> = {
  mahapurusha: { icon: '👑', bg: 'rgba(255, 215, 0, 0.08)', border: 'rgba(255, 215, 0, 0.25)' },
  raja: { icon: '🏛️', bg: 'rgba(160, 33, 61, 0.08)', border: 'rgba(160, 33, 61, 0.25)' },
  dhana: { icon: '💰', bg: 'rgba(74, 222, 128, 0.08)', border: 'rgba(74, 222, 128, 0.25)' },
  chandra: { icon: '🌙', bg: 'rgba(147, 197, 253, 0.08)', border: 'rgba(147, 197, 253, 0.25)' },
  surya: { icon: '☀️', bg: 'rgba(251, 146, 60, 0.08)', border: 'rgba(251, 146, 60, 0.25)' },
  neechaBhanga: { icon: '🔄', bg: 'rgba(192, 132, 252, 0.08)', border: 'rgba(192, 132, 252, 0.25)' },
  viparita: { icon: '⚡', bg: 'rgba(248, 113, 113, 0.08)', border: 'rgba(248, 113, 113, 0.25)' },
  specific: { icon: '⭐', bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.15)' },
  nabhasa: { icon: '🌌', bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.25)' },
};

const STRENGTH_BADGE: Record<string, { label: { en: string; ne: string }; color: string }> = {
  strong: { label: { en: 'Strong', ne: 'प्रबल' }, color: '#4ADE80' },
  moderate: { label: { en: 'Moderate', ne: 'मध्यम' }, color: '#FACC15' },
  weak: { label: { en: 'Weak', ne: 'दुर्बल' }, color: '#FB923C' },
};

export default function YogaDisplay({ yogas }: Props) {
  const { tObj, locale } = useLanguage();

  if (!yogas || yogas.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
        <span className="text-4xl block mb-4">🔮</span>
        {locale === 'ne' ? 'कुनै विशेष योग पाइएन' : 'No significant yogas detected'}
      </div>
    );
  }

  // Group by category
  const grouped = yogas.reduce((acc, y) => {
    const cat = y.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(y);
    return acc;
  }, {} as Record<string, DetectedYoga[]>);

  const categoryLabel: Record<string, { en: string; ne: string }> = {
    mahapurusha: { en: 'Pancha Mahapurusha Yoga', ne: 'पञ्चमहापुरुष योग' },
    raja: { en: 'Raja Yoga', ne: 'राजयोग' },
    dhana: { en: 'Dhana Yoga', ne: 'धनयोग' },
    chandra: { en: 'Chandra Yoga', ne: 'चन्द्र योग' },
    surya: { en: 'Surya Yoga', ne: 'सूर्य योग' },
    neechaBhanga: { en: 'Neecha Bhanga Yoga', ne: 'नीचभङ्ग योग' },
    viparita: { en: 'Viparita Raja Yoga', ne: 'विपरीत राजयोग' },
    nabhasa: { en: 'Nabhasa Yoga', ne: 'नभस योग' },
    specific: { en: 'Other Yogas', ne: 'अन्य योग' },
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--gold-400)' }}>
          {locale === 'ne' ? `🔮 ${yogas.length} योग पत्ता लागे` : `🔮 ${yogas.length} Yogas Detected`}
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(grouped).map(([cat, items]) => {
            const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.specific;
            return (
              <span key={cat} className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: style.bg, border: `1px solid ${style.border}`, color: 'var(--text-primary)' }}>
                {style.icon} {categoryLabel[cat]?.[locale] || cat} ({items.length})
              </span>
            );
          })}
        </div>
      </div>

      {/* Yoga Cards */}
      {Object.entries(grouped).map(([cat, items]) => {
        const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.specific;
        return (
          <div key={cat}>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--gold-400)' }}>
              {style.icon} {categoryLabel[cat]?.[locale] || cat}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(yoga => {
                const badge = STRENGTH_BADGE[yoga.strength];
                return (
                  <div key={yoga.id} className="glass-card p-4"
                    style={{ borderLeft: `3px solid ${style.border}` }}>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold" style={{ color: 'var(--gold-400)' }}>
                        {tObj(yoga.name)}
                      </h5>
                      <span className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: `${badge.color}15`, color: badge.color }}>
                        {badge.label[locale]}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {tObj(yoga.formation)}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--saffron-400)' }}>
                      ➤ {tObj(yoga.result)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {yoga.involvedGrahas.map(gid => (
                        <span key={gid} className="px-1.5 py-0.5 rounded text-xs"
                          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                          {GRAHAS[gid]?.name[locale === 'ne' ? 'ne' : 'en'] || gid}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
