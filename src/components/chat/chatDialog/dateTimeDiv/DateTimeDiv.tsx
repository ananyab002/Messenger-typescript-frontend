import { MessageType } from "../../../../types/type";
import { formatTime, getDate, getFormattedDate } from "../../../../utils/date"

type DateTimeProp = {
    message: MessageType
}
export const DateTimeDiv = ({ message }: DateTimeProp) => {
    const todayDate = new Date();
    return (
        <div className="dateTime">
            <span>
                {getDate(message.sentAt) === getDate(todayDate)
                    ? ""
                    : getFormattedDate(message.sentAt)}
            </span>
            <span> {formatTime(message.sentAt)}</span>
        </div>
    )
}
