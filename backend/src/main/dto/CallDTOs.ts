export interface CallUpdateDTO {
    receiverName?: string,
    date?: Date,
    phoneNumber?: string,
    description?: string,
    email?: string
}

export interface CallCreationDTO {
    receiverName: string,
    date: Date,
    phoneNumber: string,
    description: string,
    email: string
}