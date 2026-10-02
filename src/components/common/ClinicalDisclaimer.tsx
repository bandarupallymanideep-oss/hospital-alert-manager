import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  className?: string;
  variant?: 'banner' | 'card';
}

export const ClinicalDisclaimer: React.FC<Props> = ({ className = '', variant = 'banner' }) => {
  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-xl border border-teal-500/20 bg-teal-950/20 text-teal-200/90 text-xs flex items-start space-x-3 ${className}`}>
        <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-teal-300">Clinical Decision Support Prototype</span>
          <p className="mt-0.5 text-teal-200/70 leading-relaxed">
            Alerts, calculated risk scores, and trend vectors are for healthcare clinical decision-support and demonstration purposes only. They must not replace professional clinical diagnosis or physician judgment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-amber-950/40 border-y border-amber-500/20 px-4 py-2 text-amber-300/90 text-xs flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong className="font-semibold text-amber-300">Clinical Decision Support Prototype:</strong> Alerts and risk scores are demonstration values and must not replace professional medical assessment.
        </span>
      </div>
      <span className="hidden md:inline-block text-[11px] text-amber-400/60 font-mono">
        Sanjeevani Multispeciality Hospital • AI Telemetry v2.4
      </span>
    </div>
  );
};
