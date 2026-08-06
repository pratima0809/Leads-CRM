'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Building2, 
  Database,
  Search,
  Check
} from 'lucide-react';

export default function DocumentIntelligenceView() {
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  const handleUploadSim = () => {
    setIsUploading(true);
    setExtractedData(null);
    
    // Simulate OCR delay
    setTimeout(() => {
      setIsUploading(false);
      setExtractedData({
        classification: 'Commercial Supply Contract (ASTM-A36)',
        confidenceRate: 98.4,
        extractedFields: [
          { key: 'Buyer Entity', value: 'ABC Metals LLC', confidence: 99 },
          { key: 'Seller Entity', value: 'Acme Manufacturing Corp', confidence: 99 },
          { key: 'Contract Value', value: '$45,000 USD', confidence: 97 },
          { key: 'Delivery Date', value: 'July 28, 2026', confidence: 95 },
          { key: 'Material Spec', value: 'ASTM A36 Carbon Steel (50 Tons)', confidence: 98 },
          { key: 'Governing Law', value: 'State of Delaware', confidence: 99 },
        ]
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Description Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-card p-4 border border-border-default rounded-xl shadow-card">
        <div>
          <h3 className="font-bold text-lg text-text-primary">AI Document Parser & OCR</h3>
          <p className="text-xs text-text-secondary">Automatically extract structured metadata tables from agreements, invoice bills, and proposals</p>
        </div>
      </div>

      {/* Grid: Upload pane & Extracted key-values */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Drag & Drop upload container */}
        <div className="premium-card p-6 flex flex-col justify-center items-center text-center border-dashed border-2 border-border-default min-h-[350px]">
          <div className="space-y-4 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            
            <div>
              <h4 className="font-extrabold text-sm text-text-primary">Upload proposal, agreement, or invoice</h4>
              <p className="text-[11px] text-text-secondary mt-1 font-semibold leading-relaxed">
                PDF, JPG, PNG formats supported. Our OCR engine runs automated field mapping, invoice parsing, and entity extraction.
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleUploadSim}
                disabled={isUploading}
                className="inline-flex items-center gap-2 bg-surface-card dark:bg-sidebar hover:bg-surface-bg-alt dark:hover:bg-sidebar-hover disabled:bg-surface-bg-alt text-text-primary dark:text-text-inverse px-4 py-2.5 rounded-lg text-xs font-bold shadow-card transition-all"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Document...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Upload Document File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Parsed schema table */}
        <div className="premium-card p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border-default pb-3">
            <h4 className="font-bold text-sm text-text-primary">AI Entity Extraction Results</h4>
            {extractedData && (
              <span className="text-[10px] bg-success-light text-success font-extrabold px-2 py-0.5 rounded border border-success-border flex items-center gap-1">
                <Check className="w-3 h-3" /> Extracted ({extractedData.confidenceRate}% confidence)
              </span>
            )}
          </div>

          {extractedData ? (
            <div className="space-y-4 text-xs">
              <div className="bg-surface-bg-alt p-3 rounded-lg border border-border-default space-y-1">
                <span className="text-text-muted font-bold text-[9px] uppercase tracking-wider">Classification</span>
                <p className="text-text-primary font-extrabold text-sm">{extractedData.classification}</p>
              </div>

              <div className="divide-y divide-border-default">
                {extractedData.extractedFields.map((field: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="text-text-secondary font-bold block">{field.key}</span>
                      <span className="text-text-primary font-extrabold mt-0.5 block">{field.value}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-bold">Conf: {field.confidence}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => alert("Extracted entity saved directly to ABC Metals profile timeline!")}
                  className="flex-1 bg-surface-card hover:bg-surface-bg-alt border border-border-default text-text-primary font-extrabold py-2 rounded-lg shadow-card transition-all"
                >
                  Verify & Sync to CRM
                </button>
              </div>
            </div>
          ) : (
            <div className="h-60 flex flex-col justify-center items-center text-center text-text-muted text-xs font-semibold">
              <Database className="w-8 h-8 text-text-muted mb-2" />
              Awaiting file upload pipeline execution.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
