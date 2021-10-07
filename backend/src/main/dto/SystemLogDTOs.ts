export interface SystemLogCreationDTO {
    description: string,
    date: Date,
    type: SystemLogType,
}

export interface SystemLogUpdateDTO {
    description?: string,
    date?: Date,
    type?: SystemLogType,
}

export enum SystemLogType {
    NEW = 'SYSTEM',
    ACTIVE = 'APP',
    RESOLVED = 'OTHER',
}