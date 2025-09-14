"use client"; 

import * as React from "react";
import Script from "next/script";
import { set } from "react-hook-form";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

declare global { 
    interface Window {
        Razorpay : any; 
    }
}

const PaymentContent = () => {
    const { t } = useLanguage();
    const AMOUNT = 100; 
    const [isProcessing, setIsProcessing] = React.useState(false)

    const handlePayment = async () => {

        setIsProcessing(true);

        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
            });

            const data = await response.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: AMOUNT * 100,
                currency: "INR",
                name: "Mandli Cooperative Bank",
                description: "Test Transaction",
                order_id: data.orderId,
                handler: function (response: any) {
                    alert(`Payment successful: ${response.razorpay_payment_id}`);
                },
                prefill: {
                    name: "DHRUV PATEL",
                    email: "dhruv@example.com",
                    contact: "9589482345",
                },
                theme: {
                    color: "#F37254",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="flex min-h-dvh flex-col premium-gradient">
            <Navbar />
            <section className="mx-auto w-full max-w-5xl px-4 py-8 space-y-6">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Script src="https://checkout.razorpay.com/v1/checkout.js" />
                <div className="p-8 bg-gradient-to-br from-white to-purple-50/50 rounded-2xl shadow-2xl border-2 border-purple-200 max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("paymentPortal")}</h1>
                <div className="text-center mb-6">
                    <p className="text-purple-600 mb-2 text-lg">{t("amountToPay")}</p>
                    <p className="text-4xl font-bold text-purple-800">₹{AMOUNT}</p>
                </div>
                    <button onClick={handlePayment} disabled={isProcessing}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:hover:translate-y-0">
                        {isProcessing ? t("processing") : t("payNow")}
                    </button>
                </div>
            </div>
            </section>
        </main>
    );
};

const PaymentPage = () => { 

    return (
        <>
            <LanguageProvider>
                <PaymentContent />
                <Toaster />
            </LanguageProvider>
        </>
    )
}

export default PaymentPage;