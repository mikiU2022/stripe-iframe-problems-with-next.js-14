'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ clientSecret, amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error(error);
    } else {
      onPaymentSuccess();
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={processing}>
        {processing ? 'Processing...' : `Pay ${amount}`}
      </button>
    </form>
  );
};

const MinimalStripeDemo = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    // 模擬獲取clientSecret的API調用
    const fetchClientSecret = async () => {
      // 在實際應用中,這裡應該是一個API調用
      setClientSecret('fake_client_secret');
      setPaymentAmount(1000); // 假設金額為10.00
    };
    fetchClientSecret();
  }, []);

  const handlePaymentSuccess = () => {
    console.log('Payment successful');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2>Payment Items</h2>
          {/* 這裡可以添加支付項目的列表 */}
        </div>
        <div>
          <h2>Payment History</h2>
          {/* 這裡可以添加支付歷史的列表 */}
        </div>
      </div>
      {clientSecret && (
        <div>
          <h2>Complete Your Payment</h2>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm 
              clientSecret={clientSecret} 
              amount={`$${(paymentAmount / 100).toFixed(2)}`}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default MinimalStripeDemo;