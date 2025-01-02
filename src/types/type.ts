export interface Message {
  id: string|number,
  message: string,
  time: string,
  date: string,
  msgId: number,
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