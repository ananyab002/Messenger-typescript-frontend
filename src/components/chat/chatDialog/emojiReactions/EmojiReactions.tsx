import { useState } from "react";
import { MessageType } from "../../../../types/type";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import AddReactionIcon from '@mui/icons-material/AddReaction';


type MessagePropType = {
    message: MessageType
    reactions: (msgId: number, emoji: string) => void
}
export const EmojiReactions = ({ message, reactions }: MessagePropType) => {
    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [selectedMsgId, setselectedMsgId] = useState<number>();
    const token = localStorage.getItem("authToken");

    const handleEmojiPicker = (msgId: number): React.MouseEventHandler<SVGSVGElement | HTMLDivElement> => () => {
        console.log(msgId);
        setselectedMsgId(msgId);
        setOpenEmojiPicker(!openEmojiPicker);
    }

    const handleEmojiReactions = async (e: EmojiClickData, msgId: number) => {
        if (!token) return;
        console.log(e.emoji, msgId);
        reactions(msgId, e.emoji);
        setOpenEmojiPicker(false)
    }

    return (
        <div>
            {message.emojiReaction ? (< div className="reaction" onClick={handleEmojiPicker(message.msgId)}>
                {message.emojiReaction}
            </div>) : (
                < div className="addReaction">
                    <AddReactionIcon onClick={handleEmojiPicker(message.msgId)} sx={{ color: "white", fontSize: "20px" }} />
                </div>)
            }
            <div className="emojiPick">
                {openEmojiPicker && message.msgId === selectedMsgId && <EmojiPicker reactionsDefaultOpen={true}
                    onReactionClick={(e) => handleEmojiReactions(e, message.msgId)} />}
            </div>
        </div>
    )
}
