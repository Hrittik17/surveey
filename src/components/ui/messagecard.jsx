import axios from "axios";
import toast from "react-hot-toast";

export default function MessageCard(){
    
    async function deleteMessages(messageId){
        try {
            const response = await axios.delete(`/api/delete-message/${messageId}`)
            toast.success(response.data?.message || "Successfully delete the message")
            
        } catch (error) {
            toast.error(error.response.data?.message)
        }
    }

    return(
        <div>

        </div>
    )
    
}