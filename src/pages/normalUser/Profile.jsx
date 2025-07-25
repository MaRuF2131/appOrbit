// src/pages/MyProfile.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import { FaCrown, FaUserCircle } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import PaymentForm from "../../components/PaymentForm";
import toast from "react-hot-toast";
import AxiosInstance from "../../utils/axios";
import { useState } from "react";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// ✅ Replace with your Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);


const MyProfile = () => {
  const { user } = useAuth();
  const [payment,setpayment]=useState(false);

  // ✅ Fetch user info
  const { data: subscriberInfo = {}, isLoading } = useQuery({
    queryKey: ["subscriberInfo", user?.email],
    queryFn: async () => {
      const res = await AxiosInstance.get(`/api/private/subscriber`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.email,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: 1000,
  });

  // ✅ Membership subscribe mutation
/*   const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await AxiosInstance.patch(`/api/private/sendsubscribe`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Membership Activated ✅");
      queryClient.invalidateQueries(["subscriberInfo"]);
    },
    onError: () => toast.error("Failed to subscribe!"),
  }); */
  const { ok,message, subscription } = subscriberInfo;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-dots loading-lg text-lime-500"></span>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto  space-y-8">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img
            src={user?.photoURL}
            alt="User"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-lime-500 shadow-md"
          />
          {ok && (
            <FaCrown className="absolute -top-2 -right-4 text-yellow-400 text-3xl drop-shadow-xl" title="Verified Member" />
          )}
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
            <FaUserCircle className="text-lime-500" />
            {subscription?.name || user?.displayName}
          </h2>

          <div className="block w-fit bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-lg text-sm text-gray-700 dark:text-gray-300 break-words">
            {user?.email}
          </div>

          {ok ? (
            <div className="flex items-center justify-center md:justify-start gap-2 text-green-600 mt-3">
              <BsPatchCheckFill className="text-xl" />
              <span className="font-semibold text-md">Status: Subscribed Member</span>
            </div>
          ) : (
            <button
              onClick={() =>setpayment(true)}
              disabled={subscription}
              className="bg-gradient-to-r from-lime-500 to-green-600 text-white px-5 py-2 mt-4 rounded-full hover:scale-105 transition-all duration-200 font-semibold shadow-md"
            >
              {`${!subscription?'Subscribe for $10':'Your subscription is on pending'}` }
            </button>
          )}
        </div>
      </div>

      {/* Membership Benefits */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <FaCrown className="text-yellow-400" /> Membership Benefits
        </h3>
        <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>You can add unlimited products.</li>
          <li>Unlock premium features on all tech products.</li>
          <li>Get early access to upcoming product launches.</li>
          <li>Boost your visibility and credibility in the community.</li>
          <li>Get a verified badge and priority support.</li>
          <li>Enjoy a better experience with no ads or limitations.</li>
        </ul>
      </div>

      {payment && <Elements stripe={stripePromise}>
                      <PaymentForm onClose={()=>setpayment(false)} />
                    </Elements>
                  }
  </div>
  );
};

export default MyProfile;
