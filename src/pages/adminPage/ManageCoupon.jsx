import { useCoupons } from "../../hooks/useCoupon";
import CouponForm from "../../components/CouponForm";
import CouponCard from "../../components/CoupCard";
import ComponentLoader from '../../components/ComponentLoader'
/* import TextOrCardLoader from '../../components/TextOrcardLoader' */
import { useState } from "react";
import CouponUpdate from "../../components/CouponUpdate";
import CouponView from "../../components/CouponView";

const ManageCoupons = () => {
  const { coupons, isLoading, deleteCoupon } = useCoupons();


  const handleDelete = async (id) => {
    await deleteCoupon.mutateAsync(id);
  };

  const [showForm, setShowForm] = useState(false);
  const [editCouponData, setEditCouponData] = useState(null);
  const [ViewCouponData, setViewCouponData] = useState(null);


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-white dark:text-black mb-6">
        🎟️ Manage Coupons
      </h1>
    <div className="max-w-xl mx-auto my-8 px-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition duration-300 mb-4"
      >
        {showForm ? "Close Form" : "Add New Coupon"}
      </button>

      {/* Animated container */}
      <div
        className={`transition-all duration-700 overflow-hidden ${
          showForm ? "max-h-[1000px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
        }`}
      >
        <CouponForm setShowForm={setShowForm} />
      </div>
    </div>
     
         {(coupons.length===0 && !isLoading) && <div> 
            <h1 className="text-3xl font-bold text-center text-white dark:text-black mb-6">
             🎟️ Coupons is not  available add coupons
            </h1>
          </div>
          }
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

        {isLoading ? (
          <p className="text-center col-span-full text-gray-500"><ComponentLoader></ComponentLoader></p>
        ) : (
          coupons.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              onDelete={handleDelete}
              onEdit={(coupon) =>{setViewCouponData(null);setEditCouponData(coupon)}}
              onView={(coupon)=>{setEditCouponData(null);setViewCouponData(coupon)}}
            />
          ))
        )}
      </div>

         {editCouponData && (
            <CouponUpdate coupon={editCouponData} onClose={() => setEditCouponData(null)} />
            )}
         {ViewCouponData && (
            <CouponView coupon={ViewCouponData} onClose={() => setViewCouponData(null)} />
            )}
    </div>
  );
};

export default ManageCoupons;
