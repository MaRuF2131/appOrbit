import useAuth  from "../hooks/UseAuth";
import { WithContext as ReactTags } from 'react-tag-input';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axios";
import { useEffect, useState } from "react";
import { useFetcher,Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  StringValidationCheck,
  DangerousContentCheck,
  UrlValidationCheck,
} from "../utils/custom-validation/CustomValidation";
import { useMutation ,useQuery,useQueryClient } from "@tanstack/react-query";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];



const ProductFrom = ({title,type}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient=useQueryClient();

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


  const [tags, setTags] = useState([]);
  const fetcher=useFetcher();

  useEffect(() => {
  register("tags",{
    validate: async(v)=>{
       if( v===null || v===undefined || v.length===0){

        return "require at least one tag"
       }
       const combined = v.map(tag => tag.text).join(" ");
       return await DangerousContentCheck.validate(combined);
      
    } 
  });
}, [register,tags]);


const handleDelete = i => {
  const newTags = tags.filter((tag, index) => index !== i);
  console.log(newTags);
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

useEffect(() => {
  if (fetcher.state === "submitting") {
    console.log("Submitting...");
  }

  if (fetcher.state === "idle" && fetcher.data?.success) {
    queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    queryClient.invalidateQueries({ queryKey: ["disableForm"] });
    console.log('added');
    setTags([]);

Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Product added successfully.',
  confirmButtonColor: '#22c55e',
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: 'Add another?',
      text: 'Do you want to add more products?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add more!',
      cancelButtonText: 'No, go to My Products',
    }).then((secondResult) => {
      if (secondResult.isConfirmed) {
        reset(); // clear form
        setTags([]); // clear tags
      } else {
        navigate('/dashboard/My Products');
      }
    });
  }
});

  }

  if (fetcher.state === "idle" && !fetcher.data?.success && fetcher.data?.error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: fetcher.data.error || 'Something went wrong',
      confirmButtonColor: '#ef4444',
    });
  }
}, [fetcher.state, fetcher.data, navigate, queryClient]);


const mutationFunction=async(data)=>{
  try{
     const formdata=new FormData();
    // Convert all form data to FormData object
      Object.entries(data).forEach(([key, value]) => {
           if (key === "tags") {
              // Convert [{id, text}] => ["React", "AI"]
              const plainTags = value.map(tag => tag.text);
              console.log("plain",plainTags);
              formdata.append("tags", JSON.stringify(plainTags));
              console.log("🧪 Final tags before submit:",getValues("tags"));
            } else {
              formdata.append(key, value);
            }
            console.log("key",key);
      });
     
    formdata.append("auth_token", import.meta.env.VITE_ACCESS_TOKEN );
    formdata.append('owner_mail',user?.email);
    formdata.append("owner",user?.displayName);
    formdata.append("owner_profile",user?.photoURL)
    /* const postpath=await FormAction(data); */
    await fetcher.submit(formdata,{
      method: "post",
      action: "/save",
      encType: "multipart/form-data",
    });
  }catch(error){
          throw new Error("Submission failed");
  }
}

  const mutation=useMutation({
        mutationFn:mutationFunction
})

  const onSubmit = async (data) => {
     mutation.mutate(data);   
  };

 const [disabled,setDisabled]=useState(false);

 const disableForm=async()=>{
    try{
       const res=await axiosInstance.get("/api/private/disable-product-form");
       return checkForm(res);
    }catch(error){
      console.error('Error fetching form status:', error);
      return checkForm(error.response);
    }
  }
  const { data:check, isLoading, isError } = useQuery({
    queryKey: ['disableForm'],
    queryFn: disableForm,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.email,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: 1000,
  });


  const checkForm=(data)=>{
        console.log("form check",data)
        if(data.status!=200){
        return data.data.message
       }else{
        return 'ok';
       }
    };

 useEffect(()=>{
  if(check!='ok'){
    setDisabled(check);
  }else setDisabled(false); 
},[check]) 



  return (
    <div className="product-form">
      <h2 className="text-2xl text-center font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
      <div> 
            <input
              {...register("product_name",{
                required:"require product name",
                ...StringValidationCheck,...DangerousContentCheck
              } )
              }
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
                    tagInput: disabled ? 'hidden' :'inline-block',
                    tagInputField: 'outline-none px-2  w-full border-none focus:ring-0',
                    selected: 'flex  gap-2 flex-wrap',
                    tag: 'bg-blue-100 text-blue-700 px-2 py-1 rounded',
                    remove: disabled ? 'hidden' : 'ml-1 text-red-500 cursor-pointer',
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
              disabled={disabled}
          placeholder="External Website / Landing Page Link"
          className="w-full p-2 border rounded"
        />
        {errors.product_links && (
              <p className="text-red-600 text-sm">{errors.product_links.message}</p>  
            )}
        </div>

        {/* Submit Button */}
       {(!disabled)?<button

          type="submit"
           disabled={!isValid || disabled || isSubmitting || fetcher.state ===   "submitting"}
           className={` text-white px-4 py-2 rounded ${
             isValid && !isSubmitting && fetcher.state !== "submitting" ? "bg-blue-600 hover:bg-blue-700 cursor-pointer" : "bg-gray-500 opacity-35"
        }`}
        >
          {isSubmitting || fetcher.state === "submitting" ? `${type}ing` : `${type}`}

        </button>
        :
          <div>
          <span className="text-rose-500">{disabled}</span>
            <Link to="/dashboard/My Profile" className='text-lg dark:text-green-400 text-blue-700'> Take Plan</Link>
          </div>
        }
      </form>

     {/* Owner Info (Read Only) */}
      <div className="  p-4 mt-8 border-1 border-blue-700 rounded-md  space-y-1 flex flex-nwrap justify-between items-center">
        <div><img src={user?.photoURL} 
          referrerPolicy='no-referrer'
          alt="Owner" className="w-20 h-20 rounded-md" />
        </div>
        <div>
         <div><strong>Owner:</strong> {user?.displayName}</div>
          <div><strong>Email:</strong> {user?.email}</div>
        </div>    
     </div>
  </div>
  );
}

export default ProductFrom

