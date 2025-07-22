 const FormAction = async (data) => {
    console.log("Form Data:", data);
    const formdata=new FormData();
    // Convert all form data to FormData object
      Object.entries(data).forEach(([key, value]) => {
          formdata.append(key, value);
      });
     
    formdata.append("auth_token", import.meta.env.VITE_ACCESS_TOKEN );

    return({
      method: "post",
      action: "/save",
      encType: "multipart/form-data",
    });
  };

  export default FormAction;
