import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../utils/axios';
import { WithContext as ReactTags } from 'react-tag-input';
import Swal from 'sweetalert2';
import { 
  StringValidationCheck,
  DangerousContentCheck,
  UrlValidationCheck,
} from "../../utils/custom-validation/CustomValidation";
import { useEffect, useState } from 'react';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);

    const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    trigger,
    setError,
    clearErrors,
    control,
    formState: {
      errors,
      isDirty,
      isValid,
      isValidating,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      touchedFields,
      dirtyFields,
    }
  } = useForm({
    mode: "onChange",
    shouldUnregister: true,
    criteriaMode: "all",
    defaultValues: {
    },
  });

  const handleDelete = i => {
  const newTags = tags.filter((tag, index) => index !== i);
  setTags(newTags);
  setValue("tags", newTags,{ shouldValidate: true }); // update form value
  trigger("tags"); // re-validate
};

const handleAddition = tag => {
  const newTags = [...tags, tag];
  setTags(newTags);
  setValue("tags", newTags,{ shouldValidate: true }); // update form value
  trigger("tags"); // re-validate
};



  // Fetch product details
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/private/single-product/${id}`);
      return data;
    },
      enabled: !!id,
      refetchOnMount: true,
      staleTime: 0,
      onSuccess: (data) => {
        console.log("✅ useQuery onSuccess fired");
        // Optional: move this to useEffect
      }
  });

  useEffect(() => {
  if (data) {
    console.log("🔥 Data available:", data);
    reset(data);
    const formattedTags = (data?.tags || []).map((tag, i) => ({ id: `${i}`, text: tag }));
    setTags(formattedTags);
    setValue("tags", formattedTags);
  }
}, [data]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await axiosInstance.patch(`/api/private/update-product/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProducts']);
      Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully.',
        icon: 'success',
        confirmButtonColor: '#22c55e'
      }).then(() => {
        navigate('/dashboard/my Products');
      });
    },
    onError: () => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update the product.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  });

  const onSubmit = (data) => {
      // convert tags to plain array
      const plainTags = tags.map(tag => tag.text);
      data.tags = plainTags;
      updateMutation.mutate(data);
  };

useEffect(() => {
  register("tags",{
    validate: async(v)=>{
       if( v===null || v===undefined){
        return "require at least one tag"
       }
       const combined = v.map(tag => tag.text).join(" ");
       return await DangerousContentCheck.validate(combined);
      
    } 
  });
}, [register]);

  if (isLoading) return <p className="text-xl text-center text-blue-500">Loading product...</p>;
  if (isError) return <p className="text-xl text-center text-red-500">Failed to load product.</p>;

  return (
     <div className="product-form">
      <h2 className="text-2xl text-center font-bold mb-4">Update Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
      <div> 
            <input
              {...register("product_name",{
                required:"require product name",
                ...StringValidationCheck,...DangerousContentCheck
              } )
              }
              placeholder="Product Name"
              className="w-full p-2 border rounded"
            />
            {errors.product_name && (
              <p className="text-red-600 text-sm">{errors.product_name.message}</p>  
            )}
        </div> 

        {/* Product Image */}
        <div>
            <input
              {...register("product_image",{
                required:"Require Product Image URL",
                ...UrlValidationCheck
              } )
              }
          placeholder="Product Image URL"
          className="w-full p-2 border rounded"
        />
        {errors.product_image && (
              <p className="text-red-600 text-sm">{errors.product_image.message}</p>  
            )}
        </div>
        {/* Description */}
        <div>
            <textarea
              {...register("product_description",{
                required:"Require Product Description",
                ...StringValidationCheck,...DangerousContentCheck
              } )
              }
          placeholder="Product Description"
          className="w-full p-2 border rounded"
        />
        {errors.product_description && (
              <p className="text-red-600 text-sm">{errors.product_description.message}</p>  
            )}
        </div>


        {/* Tags Input */}
        <div>
          <label className="block mb-1 font-medium">Tags</label>
          <ReactTags
            tags={tags}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            inputFieldPosition="bottom"
            placeholder="tags and press enter"

              classNames={{
                    tags: 'w-full border rounded p-2  flex flex-wrap gap-2',
                    tagInput: 'inline-block',
                    tagInputField: 'outline-none px-2  w-full border-none focus:ring-0',
                    selected: 'flex  gap-2 flex-wrap',
                    tag: 'bg-blue-100 text-blue-700 px-2 py-1 rounded',
                    remove: 'ml-1 text-red-500 cursor-pointer',
                }}
          />
          {errors.tags && (
            <p className="text-red-600 text-sm">{errors.tags.message}</p>
          )}
        </div>

        {/* External Links */}
        <div>
            <input
              {...register("product_links",{
                required:"Require Product Links",
                ...UrlValidationCheck
              } )
              }
          placeholder="External Website / Landing Page Link"
          className="w-full p-2 border rounded"
        />
        {errors.product_links && (
              <p className="text-red-600 text-sm">{errors.product_links.message}</p>  
            )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
           disabled={!isValid || isSubmitting }
           className={` text-white px-4 py-2 rounded ${
             isValid  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer" : "bg-gray-500 opacity-35"
        }`}
        >
          {isSubmitting  ? `Updatting` : `Update`}

        </button>
      </form>

     {/* Owner Info (Read Only) */}
      <div className="  p-4 mt-8 border-1 border-blue-700 rounded-md  space-y-1 flex flex-nwrap justify-between items-center">
        <div><img src={data?.owner_profile} 
          referrerPolicy='no-referrer'
          alt="Owner" className="w-20 h-20 rounded-md" />
        </div>
        <div>
         <div><strong>Owner:</strong> {data?.owner}</div>
          <div><strong>Email:</strong> {data?.owner_mail}</div>
        </div>    
     </div>
  </div>
  );
};

export default UpdateProduct;
