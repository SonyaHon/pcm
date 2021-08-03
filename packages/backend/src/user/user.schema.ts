import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { omit } from 'lodash';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

export interface UserSession {
  loggedIn: boolean;
  user: {
    id: string;
  };
}

@Schema()
export class User {
  @Prop({
    unique: true,
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  role: UserRole;

  removeSensitiveData: () => Partial<UserDocument>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.removeSensitiveData = function (): Partial<UserDocument> {
  return omit(JSON.parse(JSON.stringify(this)), ['password']);
};
