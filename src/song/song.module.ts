import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema } from 'src/schemes/Album.scheme';
import { PlayLists, PlayListsSchema } from 'src/schemes/Playlist.scheme';
import { SongSchema } from 'src/schemes/Song.scheme';
import { UserSchema } from 'src/schemes/User.scheme';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Song', schema: SongSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Album', schema: AlbumSchema }]),
    MongooseModule.forFeature([
      { name: PlayLists.name, schema: PlayListsSchema },
    ]),
  ],
  controllers: [SongController],
  providers: [SongService, JwtService],
})
export class SongModule {}
