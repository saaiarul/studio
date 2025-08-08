"use client";

import { useState } from "react";
import { CustomerDetailsForm } from "./CustomerDetailsForm";
import { ReviewForm } from "./ReviewForm";
import { CouponForm } from "./CouponForm";
import { CardTitle } from "../ui/card";

type Business = {
    id: string;
    name: string;
    googleReviewLink: string;
};

type Customer = {
    name: string;
    phone?: string;
    email?: string;
};

type ReviewFlowProps = {
    business: Business;
};

type FlowStep = "details" | "review" | "coupon";

export function ReviewFlow({ business }: ReviewFlowProps) {
    const [step, setStep] = useState<FlowStep>("details");
    const [customer, setCustomer] = useState<Customer | null>(null);

    const handleDetailsSubmitted = (customerDetails: Customer) => {
        setCustomer(customerDetails);
        setStep("review");
    };

    const handleReviewSubmitted = () => {
        setStep("coupon");
    };

    const renderStep = () => {
        switch (step) {
            case "details":
                return <CustomerDetailsForm businessId={business.id} onDetailsSubmitted={handleDetailsSubmitted} />;
            case "review":
                return customer && <ReviewForm businessId={business.id} googleReviewLink={business.googleReviewLink} onReviewSubmitted={handleReviewSubmitted} customerName={customer.name} />;
            case "coupon":
                return (
                    <div className="text-center p-8 space-y-6 animate-in fade-in-50 duration-500">
                        <div>
                            <CardTitle className="text-xl mb-2 text-white">Thank you!</CardTitle>
                            <p className="text-white/70">Your feedback has been submitted.</p>
                        </div>
                        {customer?.phone && <CouponForm customer={customer} />}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderStep()}
        </div>
    );
}
