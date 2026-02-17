import { QuickSend } from "@/components/payments/QuickSend";
import { AcceptPayments } from "@/components/payments/AcceptPayments";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { AIPaymentBar } from "@/components/payments/AIPaymentBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexus Payments | NexusAI",
  description: "Send and receive crypto payments securely focused on NEAR Protocol.",
};

export default function PaymentsPage() {
  return (
    <main className="min-h-full text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Payments
          </h1>
          <p className="text-muted-foreground mt-2">
            Securely send assets and accept payments via HOT Pay & PingPay.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Actions */}
            <div className="lg:col-span-7 space-y-8">
                {/* Send Section */}
                <section>
                    <QuickSend />
                </section>
                
                {/* Accept Section */}
                <section>
                    <AcceptPayments />
                </section>
            </div>

            {/* Right Column - History */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                <PaymentHistory />
                <div className="hidden lg:block">
                     <div className="card-origin p-6">
                        <h3 className="font-semibold text-white mb-2">Nexus Premium</h3>
                        <p className="text-sm text-muted-foreground mb-4">Unlock advanced analytics and lower transaction fees with Nexus Premium.</p>
                        <button className="text-sm font-medium text-accent hover:text-accent/80">Upgrade Now →</button>
                     </div>
                </div>
            </div>
        </div>

        {/* Bottom - AI Assistant */}
        <section className="sticky bottom-4 z-50">
            <AIPaymentBar />
        </section>
      </div>
    </main>
  );
}
