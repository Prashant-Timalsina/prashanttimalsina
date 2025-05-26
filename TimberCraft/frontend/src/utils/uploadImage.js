import axios from "axios";
import { toast } from "react-toastify";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "timbercraft"); // Actual preset name
  // Optional: formData.append("folder", "timbercraft"); // Uncomment if you want to store in a specific folder

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dznx3aore/image/upload", // Your Cloudinary cloud name
      formData
    );
    return response.data.secure_url; // Or .url if preferred
  } catch (err) {
    console.error("Image upload failed:", err);
    toast.error("Image upload failed");
    return null;
  }
};

export default uploadImage;
