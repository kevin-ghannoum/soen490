import { Table, Column, Model, PrimaryKey, BelongsTo, ForeignKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { Account } from './Account';

@Table({ timestamps: false })
export class Call extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  date!: Date;

  @Column
  receiverName!: string;

  @Column
  phoneNumber!: string;

  @Column
  description!: string;

  @Column(
    DataType.ENUM(
      'CALLED',
      'NO ANSWER',
      'LEFT VOICEMAIL',
      'EMAIL SENT',
      'FOLLOW UP',
      'CALL BACK',
      'WILL CALL BACK',
      'ESTIMATE BOOKED'
    )
  )
  action!:
    | 'CALLED'
    | 'NO ANSWER'
    | 'LEFT VOICEMAIL'
    | 'EMAIL SENT'
    | 'FOLLOW UP'
    | 'CALL BACK'
    | 'WILL CALL BACK'
    | 'ESTIMATE BOOKED';

  @Column
  followUp!: boolean;

  @Column
  neverCallBack!: boolean;

  @ForeignKey(() => Account)
  @Column
  callerEmail!: string;

  @BelongsTo(() => Account, 'callerEmail')
  callerAccount!: Account;

  @ForeignKey(() => Account)
  @Column
  receiverEmail!: string;

  @BelongsTo(() => Account, 'receiverEmail')
  receiverAccount!: Account;
}
