import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>;
@Schema()
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  coverUrl: string;

  @Prop({ type: [Types.ObjectId], ref: 'Song', default: [] })
  songs: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({ default: 'Album' })
  type: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
