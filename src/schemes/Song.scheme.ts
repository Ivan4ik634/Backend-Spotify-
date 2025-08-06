import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema({ timestamps: true }) // timestamps добавит createdAt/updatedAt
export class Song {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  songUrl: string;

  @Prop({ required: true })
  coverUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Ссылка на исполнителя

  @Prop({ type: Types.ObjectId, ref: 'Album' })
  album?: Types.ObjectId; // Опционально альбом

  @Prop({ default: 0 })
  views: number;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({ required: true })
  duration: number; // в секундах
}

export const SongSchema = SchemaFactory.createForClass(Song);
