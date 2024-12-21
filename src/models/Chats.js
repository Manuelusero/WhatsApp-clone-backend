import mongoose from "mongoose";

const chatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Contact" }, 
  name: { type: String, required: true },
  thumbnail: { type: String , required: false, },       
  contactId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Contact" },
  messages: [
    {
      author: { type: String, required: true },
      content: { type: String, required: true },
      hour: { type: String, required: true },
      status: { type: String, default: "enviado" },
    },
  ],
});

const Chats = mongoose.model("Chats", chatsSchema);
export default Chats;
