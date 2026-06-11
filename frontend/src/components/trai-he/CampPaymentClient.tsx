"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type RegistrationData = {
  registrant: {
    name: string;
    phone: string;
    email: string;
    departureDate: string;
    numPeople: number;
  };
  participants: Array<{ name: string; useSamePhone: boolean; phone: string; email: string; isSelf?: boolean }>;
};

type Voucher = {
  code: string;
  label: string;
  description: string;
  discountPercent: number;
  isPrivate?: boolean;
};

const PUBLIC_VOUCHERS: Voucher[] = [
  { code: "NEWBIE10", label: "Giảm 10% cho thành viên mới", description: "Áp dụng lần đầu tham gia", discountPercent: 10 },
  { code: "VEO2025", label: "Ưu đãi 5% mùa hè 2025", description: "Hạn dùng đến 31/08/2025", discountPercent: 5 },
];

const PRIVATE_VOUCHER_DB: Record<string, Voucher> = {
  "VIP20": { code: "VIP20", label: "Giảm 20% – Thành viên VIP", description: "Dành riêng cho đối tác và alumni VEO", discountPercent: 20, isPrivate: true },
  "CORP15": { code: "CORP15", label: "Giảm 15% – Doanh nghiệp", description: "Dành cho nhóm đặt từ công ty", discountPercent: 15, isPrivate: true },
};

type Props = {
  slug: string;
  title: string;
  price: string;
  priceNumber: number;
  dateRange: string;
};

export default function CampPaymentClient({ slug, title, price, priceNumber, dateRange }: Props) {
  const [regData, setRegData] = useState<RegistrationData | null>(null);
  const [bookingCode, setBookingCode] = useState("");
  const [payMethod, setPayMethod] = useState<"office" | "transfer" | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const [voucherOpen, setVoucherOpen] = useState(false);
  const [visibleVouchers, setVisibleVouchers] = useState<Voucher[]>(PUBLIC_VOUCHERS);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [privateCode, setPrivateCode] = useState("");
  const [privateError, setPrivateError] = useState("");

  const [copyAccount, setCopyAccount] = useState(false);
  const [copyContent, setCopyContent] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored = sessionStorage.getItem("veo_registration");
      if (stored) setRegData(JSON.parse(stored));
      const prefix = slug.split("-")[0].toUpperCase().slice(0, 4);
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      setBookingCode(`VEO-${prefix}-${random}`);
    }, 0);
    return () => window.clearTimeout(id);
  }, [slug]);

  const numPeople = regData?.registrant.numPeople ?? 1;
  const baseTotal = priceNumber * numPeople;
  const discount = selectedVoucher ? Math.round(baseTotal * selectedVoucher.discountPercent / 100) : 0;
  const finalTotal = baseTotal - discount;
  const phone = regData?.registrant.phone?.replace(/\s/g, "") ?? "";
  const transferContent = `${phone} thanh toan ${bookingCode}`;

  function fmt(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + "đ";
  }

  function handlePrivateCode() {
    const code = privateCode.trim().toUpperCase();
    if (!code) return;
    const voucher = PRIVATE_VOUCHER_DB[code];
    if (!voucher) { setPrivateError("Mã không hợp lệ hoặc đã hết hạn."); return; }
    if (visibleVouchers.some((v) => v.code === code)) { setPrivateError("Mã này đã được hiển thị trong danh sách."); return; }
    setVisibleVouchers((prev) => [...prev, voucher]);
    setSelectedVoucher(voucher);
    setPrivateError("");
    setPrivateCode("");
  }

  function copy(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  }

  if (confirmed) {
    const isOffice = payMethod === "office";
    return (
      <div>
        <div className={`rounded-2xl p-6 mb-5 text-center ${isOffice ? "bg-primary/5 border border-primary/20" : "bg-green-50 border border-green-200"}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${isOffice ? "bg-primary/10" : "bg-green-100"}`}>
            <span className={`material-symbols-outlined text-4xl ${isOffice ? "text-primary" : "text-green-600"}`}>
              {isOffice ? "event_available" : "check_circle"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-1">
            {isOffice ? "Đăng ký thành công!" : "Cảm ơn bạn đã thanh toán!"}
          </h2>
          <p className="text-xs text-on-surface-variant">
            Mã đặt chỗ:{" "}
            <span className="font-bold text-primary tracking-wider">{bookingCode}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 mb-5">
          <h3 className="text-sm font-bold text-on-surface mb-3">Thông tin đặt chỗ</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Chương trình", value: title },
              { label: "Ngày khởi hành", value: regData?.registrant.departureDate || dateRange },
              { label: "Số người", value: `${numPeople} người` },
              { label: "Người đăng ký", value: regData?.registrant.name ?? "" },
              { label: "Số điện thoại", value: regData?.registrant.phone ?? "" },
              { label: "Email", value: regData?.registrant.email ?? "" },
              { label: "Tổng tiền", value: fmt(finalTotal) },
            ].map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <span className="text-on-surface-variant shrink-0">{row.label}</span>
                <span className="font-semibold text-right">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-1">
              <span className="text-on-surface-variant">Trạng thái thanh toán</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isOffice ? "bg-solar-orange/15 text-solar-orange" : "bg-blue-100 text-blue-700"}`}>
                {isOffice ? "Chờ thanh toán" : "Chờ xác nhận"}
              </span>
            </div>
          </div>
        </div>

        {isOffice ? (
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-4 bg-solar-orange/10 rounded-xl border border-solar-orange/20">
              <span className="material-symbols-outlined text-solar-orange shrink-0" style={{ fontSize: 20 }}>warning</span>
              <p className="text-sm text-on-surface">
                Booking sẽ tự động bị <span className="font-bold">hủy sau 24h</span> nếu bạn chưa đến văn phòng thanh toán.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-outline-variant/30">
              <p className="text-xs font-bold text-on-surface mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>store</span>
                Thông tin văn phòng VEO
              </p>
              <div className="space-y-2 text-xs text-on-surface-variant">
                <p className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 14 }}>location_on</span>
                  Tầng 3, Tòa nhà D12 Giảng Võ, Ba Đình, Hà Nội
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 14 }}>schedule</span>
                  Thứ 2 đến Thứ 6: 9:00 đến 18h00
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 14 }}>phone</span>
                  0901 234 567
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant">
              Chúng tôi sẽ kiểm tra và xác nhận thanh toán của bạn trong vòng <span className="font-semibold text-on-surface">24 giờ</span>.
            </div>
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/15">
              <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 20 }}>tips_and_updates</span>
              <p className="text-sm text-on-surface-variant">
                Muốn xác nhận nhanh hơn? Gửi ảnh chụp màn hình giao dịch qua{" "}
                <a href="https://facebook.com/veo" target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline">
                  Facebook VEO
                </a>.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-solar-orange/10 rounded-xl border border-solar-orange/20">
              <span className="material-symbols-outlined text-solar-orange shrink-0" style={{ fontSize: 20 }}>warning</span>
              <p className="text-sm text-on-surface">
                Booking sẽ tự động bị <span className="font-bold">hủy sau 24h</span> nếu thanh toán chưa được xác nhận.
              </p>
            </div>
          </div>
        )}

        <Link
          href="/trai-he-tinh-nguyen"
          className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
          Xem các trại hè khác
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Voucher */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 mb-5 overflow-hidden">
        <button
          type="button"
          onClick={() => setVoucherOpen((o) => !o)}
          className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-solar-orange">local_offer</span>
            <span className="text-sm font-bold text-on-surface">Mã khuyến mại</span>
            {selectedVoucher && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                {selectedVoucher.code}
              </span>
            )}
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${voucherOpen ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>

        {voucherOpen && (
          <div className="px-5 pb-5 border-t border-outline-variant/30">
            <div className="space-y-2 mt-4">
              {visibleVouchers.map((v) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => setSelectedVoucher(selectedVoucher?.code === v.code ? null : v)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    selectedVoucher?.code === v.code ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedVoucher?.code === v.code ? "border-primary bg-primary" : "border-outline"}`}>
                    {selectedVoucher?.code === v.code && (
                      <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>check</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-on-surface">{v.label}</span>
                      {v.isPrivate && (
                        <span className="text-xs bg-deep-amethyst/10 text-deep-amethyst px-1.5 py-0.5 rounded font-semibold">VIP</span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{v.description}</p>
                  </div>
                  <span className="text-sm font-bold text-green-700 shrink-0">−{v.discountPercent}%</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant/30">
              <p className="text-xs font-semibold text-on-surface-variant mb-2">Nhập mã riêng tư</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã khuyến mại..."
                  value={privateCode}
                  onChange={(e) => { setPrivateCode(e.target.value.toUpperCase()); setPrivateError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePrivateCode()}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={handlePrivateCode}
                  className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
                >
                  Xác nhận
                </button>
              </div>
              {privateError && <p className="text-xs text-error mt-1">{privateError}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 mb-5">
        <h2 className="text-base font-bold text-on-surface mb-4">Tóm tắt đặt chỗ</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Chương trình</span>
            <span className="font-semibold text-right max-w-[60%]">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Ngày khởi hành</span>
            <span className="font-semibold">{regData?.registrant.departureDate || dateRange}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Số người</span>
            <span className="font-semibold">{numPeople} người</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Đơn giá</span>
            <span className="font-semibold">{price} / người</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Tổng giá</span>
            <span className="font-semibold">{fmt(baseTotal)}</span>
          </div>
          {selectedVoucher && (
            <div className="flex justify-between text-green-700">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>local_offer</span>
                Giảm giá ({selectedVoucher.discountPercent}%)
              </span>
              <span className="font-semibold">− {fmt(discount)}</span>
            </div>
          )}
          <div className="h-px bg-outline-variant my-1" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-on-surface">Tổng cộng</span>
            <div className="text-right">
              {selectedVoucher && (
                <p className="text-xs text-on-surface-variant line-through">{fmt(baseTotal)}</p>
              )}
              <p className="font-bold text-solar-orange text-lg">{fmt(finalTotal)}</p>
            </div>
          </div>
        </div>

        {regData && (
          <>
            <div className="h-px bg-outline-variant/50 my-4" />
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-3">Thông tin người đặt &amp; tham gia</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 18, marginTop: 1 }}>person</span>
                <div className="min-w-0">
                  <p className="text-xs text-on-surface-variant font-medium">Người đăng ký</p>
                  <p className="font-semibold text-on-surface truncate">{regData.registrant.name}</p>
                  <p className="text-xs text-on-surface-variant">{regData.registrant.phone} · {regData.registrant.email}</p>
                </div>
              </div>
              {regData.participants.map((p, i) => {
                const displayName = p.isSelf ? regData.registrant.name : p.name;
                const displayPhone = p.isSelf ? regData.registrant.phone : p.useSamePhone ? regData.registrant.phone : p.phone;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: 18, marginTop: 1 }}>person_outline</span>
                    <div className="min-w-0">
                      <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                        Người tham gia {i + 1}
                        {p.isSelf && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">Người đăng ký</span>}
                      </p>
                      <p className="font-semibold text-on-surface truncate">{displayName}</p>
                      <p className="text-xs text-on-surface-variant">{displayPhone}{p.email && ` · ${p.email}`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 mb-5">
        <h2 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
          Phương thức thanh toán
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPayMethod("office")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${payMethod === "office" ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50"}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-primary">store</span>
              <span className="font-bold text-sm text-on-surface">Tại văn phòng</span>
            </div>
            <p className="text-xs text-on-surface-variant">Đến văn phòng VEO thanh toán trực tiếp trong giờ hành chính.</p>
            {payMethod === "office" && (
              <div className="mt-3 p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant space-y-1.5">
                <p className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>location_on</span>
                  Tầng 3, Tòa nhà D12 Giảng Võ, Ba Đình, Hà Nội
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>schedule</span>
                  Thứ 2 đến Thứ 6: 9:00 đến 18h00
                </p>
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setPayMethod("transfer")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${payMethod === "transfer" ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50"}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-primary">qr_code_2</span>
              <span className="font-bold text-sm text-on-surface">Chuyển khoản</span>
            </div>
            <p className="text-xs text-on-surface-variant">Quét mã QR hoặc chuyển khoản theo thông tin bên dưới.</p>
          </button>
        </div>

        {payMethod === "transfer" && (
          <div className="mt-4 p-4 bg-surface-container-low rounded-xl">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              <div className="shrink-0 text-center">
                <div className="w-40 h-40 bg-white rounded-xl border-2 border-outline-variant flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=BIDV%7C9876543210%7CCONG%20TY%20VEO%7C${finalTotal}%7C${encodeURIComponent(transferContent)}`}
                    alt="QR chuyển khoản"
                    width={160}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-1.5">Quét để chuyển khoản</p>
              </div>
              <div className="flex-1 space-y-3 text-sm w-full">
                <div>
                  <p className="text-xs text-on-surface-variant mb-0.5">Ngân hàng</p>
                  <p className="font-bold text-on-surface">BIDV – Chi nhánh TP.HCM</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-0.5">Số tài khoản</p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-on-surface tracking-wider">9876 5432 10</p>
                    <button type="button" onClick={() => copy("9876543210", setCopyAccount)} className="text-primary hover:text-primary/70 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{copyAccount ? "check" : "content_copy"}</span>
                      {copyAccount && <span className="text-xs">Đã sao chép</span>}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-0.5">Chủ tài khoản</p>
                  <p className="font-bold text-on-surface">CONG TY VEO VOLUNTEER</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-0.5">Số tiền</p>
                  <p className="font-bold text-solar-orange">{fmt(finalTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-0.5">Nội dung chuyển khoản</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-on-surface text-xs bg-white px-2 py-1.5 rounded border border-outline-variant font-mono tracking-wide">
                      {transferContent}
                    </p>
                    <button type="button" onClick={() => copy(transferContent, setCopyContent)} className="text-primary hover:text-primary/70 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{copyContent ? "check" : "content_copy"}</span>
                      {copyContent && <span className="text-xs">Đã sao chép</span>}
                    </button>
                  </div>
                  <p className="text-xs text-solar-orange mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>info</span>
                    Nhập đúng nội dung để được xác nhận nhanh nhất.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!payMethod}
        onClick={() => {
          if (payMethod) {
            sessionStorage.removeItem("veo_registration");
            setConfirmed(true);
          }
        }}
        className="w-full bg-solar-orange hover:bg-action-hover disabled:opacity-40 disabled:cursor-not-allowed text-pure-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
      >
        <span className="material-symbols-outlined">check_circle</span>
        {payMethod === "transfer" ? "Xác nhận đã thanh toán" : payMethod === "office" ? "Xác nhận đăng ký" : "Chọn phương thức thanh toán"}
      </button>
    </div>
  );
}
