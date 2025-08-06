import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PlayListsDocument = HydratedDocument<PlayLists>;
@Schema()
export class PlayLists {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Song', default: [] })
  songs: Types.ObjectId[];

  @Prop({ required: true })
  coverUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({ default: 'Playlist' })
  type: string;
}

export const PlayListsSchema = SchemaFactory.createForClass(PlayLists);
