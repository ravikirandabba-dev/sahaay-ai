"use client";

import React, { useState } from "react";
import { DEMO_ORDERS, DemoOrder, SAMPLE_QUERIES } from "@/lib/demoOrders";
import { Database, Clock, Truck, RotateCcw, CheckCircle2, ChevronRight, PlayCircle, ShieldAlert } from "lucide-react";

interface DemoOrdersTableProps {
  onSelectSampleQuery: (sample: (typeof SAMPLE_QUERIES)[0]) => void;
  highlightedOrderId?: string | null;
}

export const DemoOrdersTable: React.FC<DemoOrdersTableProps> = ({
  onSelectSampleQuery,
  highlightedOrderId,
}) => {
  const [selectedOrderKey, setSelectedOrderKey] = useState<string>("ORD-7821");
  const orders = Object.values(DEMO_ORDERS);

  const getStatusBadge = (status: DemoOrder["status"]) => {
    switch (status) {
      case "Delayed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#812637] text-[#FFF0C7] border border-[#D4AF37]">
            <Clock className="w-3 h-3 mr-1 text-[#FFF0C7]" />
            Delayed
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F4E3B2] text-[#812637] border border-[#D4AF37]">
            <Truck className="w-3 h-3 mr-1 text-[#812637]" />
            In Transit
          </span>
        );
      case "Refund Processed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
            <RotateCcw className="w-3 h-3 mr-1" />
            Refund Processed
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF8E7] text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full gold-3d-card rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#D4AF37]/40 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-[#F4E3B2] border border-[#D4AF37] flex items-center justify-center text-[#812637]">
              <Database className="w-4 h-4 text-[#812637]" />
            </span>
            <h2 className="text-xl font-black text-[#812637]">
              Synthetic Customer Logistics Database
            </h2>
            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#F3E7D3] text-[#812637] border-2 border-[#D4AF37]">
              Demo Records
            </span>
          </div>
          <p className="text-xs text-[#812637]/75 mt-1.5 max-w-2xl font-bold">
            Clearly labeled demonstration records used for deterministic resolution testing. Sahaay AI looks up these verified records when customers inquire in Telugu, Hindi, or English.
          </p>
        </div>

        {/* Quick Test Prompt Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-[#812637]">Quick Test Scenarios:</span>
          {SAMPLE_QUERIES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSampleQuery(sample)}
              className="inline-flex items-center space-x-1.5 text-xs font-black px-3.5 py-1.5 rounded-xl bg-[#F3E7D3] hover:bg-[#F4E3B2] text-[#812637] border-2 border-[#D4AF37] transition-all cursor-pointer shadow-xs"
            >
              <PlayCircle className="w-3.5 h-3.5 text-[#812637]" />
              <span>{sample.language.split(" ")[0]} ({sample.intent.split(" ")[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Left side: Order list buttons */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-black text-[#812637] uppercase tracking-wider px-1">
            Active Synthetic Orders
          </div>
          {orders.map((ord) => {
            const isSelected = selectedOrderKey === ord.orderId;
            const isHighlighted = highlightedOrderId === ord.orderId;

            return (
              <button
                key={ord.orderId}
                onClick={() => setSelectedOrderKey(ord.orderId)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isHighlighted
                    ? "bg-[#F3E7D3] border-2 border-[#812637] shadow-md ring-2 ring-[#D4AF37]"
                    : isSelected
                    ? "bg-[#FFF8E7] border-2 border-[#D4AF37] shadow-xs"
                    : "bg-[#FFF8E7] hover:bg-[#F3E7D3] border border-[#D4AF37]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-black text-[#812637]">
                      {ord.orderId}
                    </span>
                    {getStatusBadge(ord.status)}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-[#812637] transition-transform ${
                      isSelected ? "rotate-90" : ""
                    }`}
                  />
                </div>

                <div className="mt-2 text-xs font-bold text-[#1E293B]">
                  {ord.customerName}
                </div>
                <div className="text-[11px] text-[#812637]/80 mt-0.5 truncate font-semibold">
                  {ord.items.join(", ")}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right side: Detailed View of Selected Order */}
        {DEMO_ORDERS[selectedOrderKey] && (
          <div className="lg:col-span-7 bg-[#FFF8E7] rounded-2xl border-2 border-[#D4AF37]/60 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/40">
              <div>
                <span className="font-mono text-xs font-black text-[#812637]">
                  Order Details
                </span>
                <h3 className="text-lg font-black text-[#812637]">
                  {DEMO_ORDERS[selectedOrderKey].orderId}
                </h3>
              </div>
              <div>{getStatusBadge(DEMO_ORDERS[selectedOrderKey].status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FFF0C7] rounded-xl border border-[#D4AF37]/50 shadow-2xs">
                <span className="text-[10px] text-[#812637]/75 font-black block">Customer</span>
                <span className="font-bold text-[#1E293B] block mt-0.5">
                  {DEMO_ORDERS[selectedOrderKey].customerName}
                </span>
                <span className="text-[11px] text-[#812637] font-mono font-bold">
                  {DEMO_ORDERS[selectedOrderKey].phone}
                </span>
              </div>

              <div className="p-3 bg-[#FFF0C7] rounded-xl border border-[#D4AF37]/50 shadow-2xs">
                <span className="text-[10px] text-[#812637]/75 font-black block">Logistics Partner</span>
                <span className="font-bold text-[#1E293B] block mt-0.5">
                  {DEMO_ORDERS[selectedOrderKey].carrier}
                </span>
                <span className="text-[11px] text-[#812637] font-mono font-bold">
                  AWB: {DEMO_ORDERS[selectedOrderKey].trackingNumber}
                </span>
              </div>

              <div className="p-3 bg-[#FFF0C7] rounded-xl border border-[#D4AF37]/50 shadow-2xs">
                <span className="text-[10px] text-[#812637]/75 font-black block">Expected Delivery</span>
                <span className="font-bold text-[#1E293B] block mt-0.5">
                  {DEMO_ORDERS[selectedOrderKey].expectedDelivery}
                </span>
              </div>

              <div className="p-3 bg-[#FFF0C7] rounded-xl border border-[#D4AF37]/50 shadow-2xs">
                <span className="text-[10px] text-[#812637]/75 font-black block">Current Location</span>
                <span className="font-bold text-[#1E293B] block mt-0.5 truncate">
                  {DEMO_ORDERS[selectedOrderKey].currentLocation}
                </span>
              </div>
            </div>

            {DEMO_ORDERS[selectedOrderKey].delayReason && (
              <div className="p-3.5 rounded-xl bg-[#FFF2F2] border-2 border-[#812637] flex items-start space-x-2 text-xs">
                <ShieldAlert className="w-4 h-4 text-[#812637] shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-[#812637]">Logged Delay Factor:</span>
                  <p className="text-[#812637] mt-0.5 font-bold">
                    {DEMO_ORDERS[selectedOrderKey].delayReason}
                  </p>
                </div>
              </div>
            )}

            {/* Multilingual Status Notes */}
            <div className="p-4 bg-[#FFF0C7] rounded-xl border-2 border-[#D4AF37]/60 space-y-2.5 shadow-2xs">
              <span className="text-[10px] text-[#812637] font-black uppercase tracking-wider block">
                Localized Resolution Notice
              </span>
              <div className="space-y-1.5 text-xs text-[#1E293B]">
                <p>
                  <strong className="text-[#812637] font-black">తెలుగు:</strong>{" "}
                  {DEMO_ORDERS[selectedOrderKey].notes.te}
                </p>
                <p>
                  <strong className="text-[#812637] font-black">हिन्दी:</strong>{" "}
                  {DEMO_ORDERS[selectedOrderKey].notes.hi}
                </p>
                <p>
                  <strong className="text-[#812637] font-black">English:</strong>{" "}
                  {DEMO_ORDERS[selectedOrderKey].notes.en}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
