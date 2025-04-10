export interface MessageType {
  msgId: number,
  content: string,
  sentAt: string,
  isRead: string,
  chatId: string,
  senderId: number,
  emojiReaction:string,
  repliedToMsgId?: number
  repliedToMsgContent?:string
}

export interface EmojiReactionsType{
  msgId: number,
  emoji:string
}

export interface RepliedToMessageType{
  chatID:number|undefined,
  repliedToMsgId: number,
  repliedToMsgContent:string
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