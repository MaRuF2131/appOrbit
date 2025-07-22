import axiosInstance from "../axios.jsx";
import CheckActionHeaderForAuthorization from "./CheckActionHeaderForAuthorization";

const ActionOnForm = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // ✅ Parse tags from JSON string
    console.log("parsed",data.tags);
    
    // ✅ Token check
    const token = formData.get("auth_token");
    if (!token) {
      throw new Response("Unauthorized", { status: 401 });
    }
    CheckActionHeaderForAuthorization(token);

    // ✅ Save to DB
    const res = await axiosInstance.post("/api/private/add-product", data);

    if (res.status === 201) {
      return { success: true };
    }

    return {
      success: false,
      error: "Could not add product. Please try again.",
    };

  } catch (error) {
    console.log("ActionOnForm Error:", error.response);
    return {
      success: false,
      error: `${error.response.data.message}`,
    };

/*     throw new Error("Server crashed or unauthorized", {
      status: 500,
      statusText: error.message || "Internal Server Error",
    }); */
  }
};

export default ActionOnForm;
