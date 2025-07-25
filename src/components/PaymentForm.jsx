import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import useAuth from '../hooks/UseAuth';
import ComponentLoader from '../components/ComponentLoader'
import {StringValidationCheck} from '../utils/custom-validation/CustomValidation'
import axiosInstance from '../utils/axios';

const PaymentForm = ({onClose}) => {
  const {user}  =useAuth()
  const stripe = useStripe();
  const elements = useElements();
  const client=useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const[couponerror,setcouponerror]=useState(false)
  const[coupondata,setCouponData]=useState('')
  const[isLoading,setLoading]=useState(false);
  const[amount,setamount]=useState(10)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
         errors,
         isValid
       },
  } = useForm({
    criteriaMode: 'all',
    shouldUnregister: true,
    mode: 'onChange',
  });

const watchedCoupon = watch('coupon');

console.log(watchedCoupon);


const couponMutation = useMutation({
  mutationFn: async (code) => {
    const res = await axiosInstance.get(`/api/private/useCoupon/${code}`);
    return res.data;
  },
  onSuccess: (data) => {
    console.log('✅ Coupon valid:', data);
    setcouponerror('')
    setCouponData(data); // set it in state, for example
  },
  onError: (error) => {
    setCouponData('')
    setcouponerror(error.response?.data.error)
    console.error('Coupon error:', error.response?.data);
  },
});


useEffect(()=>{
  if(!watchedCoupon){ setcouponerror(false);setCouponData('');return}
  if(watchedCoupon && isValid){
      setLoading(true)
      couponMutation.mutateAsync(watchedCoupon)

      setTimeout(()=>{
          setLoading(false)
      },500)
   }
},[watchedCoupon,isValid])

useEffect(()=>{
  if(coupondata && coupondata.ok){
    const disAmonut =((100-(parseFloat(coupondata.coupon.discount)))/100)*10;
    setamount(disAmonut)
  }else{
    setamount(10)
  }

},[coupondata])


  // ⛳ Stripe Payment Mutation
  const paymentMutation = useMutation({
    mutationFn: async ({ email, coupon, cardElement }) => {
      // 1️⃣ Send email and coupon to backend to create PaymentIntent
      const { data } = await axiosInstance.post('/api/private/create-payment-intent', { email, coupon });
      const clientSecret = data.clientSecret;

      // 2️⃣ Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card: cardElement,
          billing_details: { email },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    },
    onSuccess: async(paymentIntent) => {
      setSuccess(`✅ Payment successful!`);
      await axiosInstance.patch(`/api/private/sendsubscribe/${paymentIntent.id}`)
      await client.invalidateQueries(["subscriberInfo", user?.email])
      onClose()
      setError('');
    },
    onError: (err) => {
      setError(err.message || '❌ Payment failed');
      setSuccess('');
    },
  });

  const onSubmit = async (formData) => {
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    paymentMutation.mutate({ ...formData, cardElement });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="fixed left-[50%] top-[50%] overflow-auto max-h-screen transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 md:p-8 p-2 rounded-2xl shadow-xl w-full max-w-lg mx-auto border border-blue-700 dark:border-blue-600 z-[1000] space-y-4">
         {!user&&<ComponentLoader/>}
        { user && <>
           { /* Close Button */}
            <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 dark:text-gray-300 text-black hover:text-red-600 text-xl"
            aria-label="Close"
          >
            <X/>
            </button>
            <div className=" border border-blue-900 text-black dark:text-white text-sm p-4 rounded mb-6 mt-2">
                <p className="font-semibold mb-1">💳 Test Card:</p>
                <p>
                Card: <span className="font-mono">4242 4242 4242 4242</span>
                <br />
                Exp: <span className="font-mono">12 / 34</span> &nbsp; CVC:{' '}
                <span className="font-mono">123</span>
                </p>
            </div>

            <div>
                <label className="block font-medium mb-1 text-black dark:text-white ">Email</label>
                <input
                type="email"
                disabled={true}
                value={user.email}
                {...register('email', { required: 'Email is required' })}
                className="dark:text-white text-black border-1 border-blue-900 w-full  px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
                placeholder="you@example.com"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block font-medium mb-1 text-black dark:text-white">Coupon Code</label>
                <input
                type="text"
                {...register('coupon',{
                  ...StringValidationCheck
                })}
                className="text-black dark:text-white w-full border-1 border-blue-900 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
                placeholder="Optional coupon code"
                />
                {errors.coupon && <p className="text-sm text-red-600">{errors.coupon.message}</p>}
                {(couponerror && !isLoading) && <p className="text-sm text-red-600">{couponerror}</p>}
                {isLoading && <p className="text-sm text-purple-600">Checking...</p>}
                {(coupondata && !isLoading) && <p className="text-sm text-purple-600">You got {coupondata.coupon.discount}% off</p>}
            </div>

            {/* ✅ Stripe Card Element */}
            <div className="p-4  border rounded bg-gray-50 focus:ring-1 focus:ring-lime-400">
                <CardElement
                options={{
                    style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': { color: '#aab7c4' },
                    },
                    invalid: {
                        color: '#e3342f',
                        iconColor: '#e3342f',
                    },
                    },
                }}
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600 font-semibold">{success}</p>}

            <button
                type="submit"
                disabled={!stripe || paymentMutation.isLoading}
                className="bg-lime-600 hover:bg-lime-700 text-white py-2 px-6 rounded disabled:opacity-60"
            >
                {paymentMutation.isLoading ? 'Processing...' : `Pay Now $${amount}`}
            </button>
        </>  
      }
    </form>
  );
};

export default PaymentForm;
