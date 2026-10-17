"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { 
  Bot, 
  BrainCircuit, 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  Clock,
  Calendar,
  Lock,
  Zap,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function PricingClient({
  user,
  initialSubscription,
  hasActiveSubscription,
  plans,
  requestedFeature
}) {
  // Default to the 30-day plan (Most Popular)
  const [selectedPlanId, setSelectedPlanId] = useState("plan_30_days");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'failed' | 'cancelled'
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const featureLabels = {
    mentor: "AI Mentor",
    quiz: "Quiz Mode",
    interview: "Mock Interview Mode"
  };

  const loadRazorpayScriptManually = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedToPayment = async () => {
    try {
      setPaymentStatus("loading");
      setErrorMessage("");

      // Ensure Razorpay SDK is loaded
      let ready = isScriptLoaded || (typeof window !== "undefined" && !!window.Razorpay);
      if (!ready) {
        ready = await loadRazorpayScriptManually();
      }

      if (!ready || typeof window.Razorpay === "undefined") {
        throw new Error("Unable to load Razorpay payment gateway. Please check your network connection.");
      }

      // Step 1: Create Order on the server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan.id })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      // Step 2: Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "WebDev Mentor AI",
        description: `${selectedPlan.name} (Test Mode)`,
        image: "https://api.dicebear.com/9.x/bottts/svg?seed=WebDevMentor",
        order_id: orderData.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || ""
        },
        theme: {
          color: "#06b6d4",
          backdrop_color: "rgba(15, 19, 29, 0.9)"
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("cancelled");
          }
        },
        handler: async function (response) {
          try {
            setPaymentStatus("loading");
            // Step 3: Server-side cryptographic signature & order verification
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setSuccessData(verifyData);
            setPaymentStatus("success");
          } catch (err) {
            console.error("Verification error:", err);
            setErrorMessage(err.message || "Failed to verify payment with server.");
            setPaymentStatus("failed");
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on("payment.failed", function (failResponse) {
        console.error("Razorpay payment failed:", failResponse);
        setErrorMessage(failResponse.error?.description || "Payment was rejected by gateway.");
        setPaymentStatus("failed");
      });

      rzpInstance.open();

    } catch (err) {
      console.error("Payment initiation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred while initiating payment.");
      setPaymentStatus("failed");
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
      />

      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Developer Intelligence Terminal</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-on-surface tracking-tight">
            Supercharge Your <span className="bg-gradient-to-r from-primary via-cyan-300 to-blue-400 bg-clip-text text-transparent">Full-Stack Career</span>
          </h1>

          <p className="text-on-surface-variant text-base sm:text-lg font-sans leading-relaxed">
            Gain unlimited access to AI Mentor guidance, AI-graded flashcards & quizzes, and hyper-realistic mock technical interviews.
          </p>

          {/* Test Mode Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <strong>Razorpay Test Mode:</strong> No real money will be charged. Use test credentials or dummy cards.
          </div>

          {/* Requested Feature Callout */}
          {requestedFeature && featureLabels[requestedFeature] && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-on-surface text-sm flex items-center justify-center gap-2">
              <Lock size={16} className="text-primary" />
              <span>
                <strong>{featureLabels[requestedFeature]}</strong> is a premium feature. Select any plan below to unlock immediate access.
              </span>
            </div>
          )}

          {/* Existing Subscription Notice */}
          {hasActiveSubscription && initialSubscription && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left sm:text-center text-sm space-y-1">
              <div className="flex items-center justify-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 size={18} />
                <span>Active Subscription: {initialSubscription.planName}</span>
              </div>
              <p className="text-on-surface-variant text-xs">
                Your access expires on{" "}
                <strong className="text-on-surface">
                  {new Date(initialSubscription.expiresAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </strong>{" "}
                ({initialSubscription.daysRemaining} days remaining). Any new plan purchased will extend from this date.
              </p>
            </div>
          )}
        </div>

        {/* Payment Status Banners */}
        {paymentStatus === "success" && (
          <div className="p-6 md:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 max-w-2xl mx-auto shadow-[0_0_32px_rgba(16,185,129,0.2)]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface">
              Payment Verified & Access Granted!
            </h2>
            <p className="text-on-surface-variant text-sm sm:text-base">
              {successData?.extended
                ? "Your existing subscription has been successfully extended!"
                : "Your subscription has been activated with full premium entitlements."}
            </p>
            {successData?.expiresAt && (
              <p className="text-xs font-mono text-primary bg-primary/10 py-1.5 px-3 rounded-lg inline-block">
                Valid until: {new Date(successData.expiresAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/mentor">
                <Button variant="primary" className="gap-2">
                  <Bot size={16} /> Open AI Mentor
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="secondary" className="gap-2">
                  <BrainCircuit size={16} /> Take a Quiz
                </Button>
              </Link>
              <Link href="/interview">
                <Button variant="secondary" className="gap-2">
                  <Video size={16} /> Mock Interview
                </Button>
              </Link>
            </div>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-3 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-heading font-bold text-on-surface">
              Payment Incomplete or Failed
            </h3>
            <p className="text-sm text-red-300">
              {errorMessage || "We could not complete your payment. Please try again."}
            </p>
            <Button onClick={() => setPaymentStatus("idle")} variant="secondary" size="sm" className="gap-2">
              <RefreshCw size={14} /> Try Again
            </Button>
          </div>
        )}

        {paymentStatus === "cancelled" && (
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 text-center space-y-2 max-w-md mx-auto">
            <p className="text-sm text-on-surface-variant">
              Checkout window was closed. You have not been charged.
            </p>
            <Button onClick={() => setPaymentStatus("idle")} variant="ghost" size="sm">
              Dismiss
            </Button>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "glass-card border-primary/60 shadow-[0_0_30px_rgba(6,182,212,0.25)] scale-[1.02]"
                    : "glass-card border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container/40"
                }`}
              >
                {/* Plan Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-blue-500 text-[#060911] font-bold text-xs uppercase px-3 py-1 rounded-full shadow-lg font-mono tracking-wider">
                      ★ {plan.badge}
                    </span>
                  </div>
                )}
                {!plan.popular && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-surface-bright border border-outline-variant/50 text-on-surface font-medium text-[11px] uppercase px-3 py-0.5 rounded-full font-mono">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Radio / Selection Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? "border-primary bg-primary text-[#060911]" : "border-outline-variant"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#060911]" />}
                      </div>
                      <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                        {plan.durationDays} Days Duration
                      </span>
                    </div>
                  </div>

                  {/* Plan Name & Price */}
                  <div>
                    <h3 className="font-heading text-xl font-bold text-on-surface">{plan.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{plan.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-b border-outline-variant/30 pb-4">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-on-surface">
                      ₹{plan.price}
                    </span>
                    <span className="text-on-surface-variant text-sm font-mono">
                      / {plan.durationDays === 365 ? "year" : `${plan.durationDays} days`}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-primary">
                      What&apos;s Included:
                    </p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                        <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-6 mt-6 border-t border-outline-variant/20">
                  <div className={`text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isSelected 
                      ? "bg-primary/20 text-primary border border-primary/40 font-mono"
                      : "bg-surface-bright/50 text-on-surface-variant hover:text-on-surface"
                  }`}>
                    {isSelected ? "Selected Plan" : "Click to Select"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating / Sticky Checkout Summary Dock */}
        <div className="glass-card rounded-2xl p-6 border-outline-variant/40 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <span className="font-heading font-bold text-on-surface text-lg">
                {selectedPlan.name}
              </span>
              <span className="text-xs font-mono bg-surface-bright px-2 py-0.5 rounded text-on-surface-variant">
                ₹{selectedPlan.price}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center justify-center sm:justify-start gap-1">
              <Clock size={13} />
              Full access for {selectedPlan.durationDays} days • Instant activation in Razorpay Test Mode
            </p>
          </div>

          <Button
            onClick={handleProceedToPayment}
            disabled={paymentStatus === "loading"}
            className="w-full sm:w-auto min-w-[240px] py-6 text-base font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] gap-2"
          >
            {paymentStatus === "loading" ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Connecting Gateway...
              </>
            ) : (
              <>
                <Zap size={18} />
                Pay ₹{selectedPlan.price} with Razorpay
              </>
            )}
          </Button>
        </div>

        {/* Trust Badges & FAQ Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-4xl mx-auto text-center">
          <div className="p-4 rounded-xl bg-surface-container/30 border border-outline-variant/20 space-y-1">
            <ShieldCheck size={20} className="text-primary mx-auto" />
            <h4 className="text-sm font-semibold text-on-surface">Secure Test Checkout</h4>
            <p className="text-xs text-on-surface-variant">HMAC SHA-256 server-verified signatures on all transactions.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/30 border border-outline-variant/20 space-y-1">
            <Calendar size={20} className="text-primary mx-auto" />
            <h4 className="text-sm font-semibold text-on-surface">Continuous Expiry</h4>
            <p className="text-xs text-on-surface-variant">Repeat purchases stack and extend your active subscription automatically.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/30 border border-outline-variant/20 space-y-1">
            <Lock size={20} className="text-primary mx-auto" />
            <h4 className="text-sm font-semibold text-on-surface">Zero Data Loss</h4>
            <p className="text-xs text-on-surface-variant">Learning modules, revision, and projects remain 100% free forever.</p>
          </div>
        </div>

      </div>
    </>
  );
}
