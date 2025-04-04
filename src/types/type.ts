export interface MessageType {
  msgId: number,
  content: string,
  sentAt: string,
  isRead: string,
  chatId: string,
  senderId:number,
  repliedToMsgId?: number
  repliedToMessage?:string
}

export interface EmojiReactions{
  msgId: number,
  emoji:string
}

export interface RepliedToMessageType{
  chatID:string|undefined,
  msgId: number,
  message:string
}


export interface LoginDataType {
  userId:number,
  email: string,
  password: string,
  confirmPass: string,
  dob: Date,
  gender: string,
  country: string,
  image: string,
  name:string

}

export interface ContactListType {
  contactId: string,
  contactName: string,
  image: string,
  status: string,
  chatId: string
}

export interface SearchResultType {
    userId: string,
    image: string,
    name: string,
    email: string,
    phoneNumber: string
}