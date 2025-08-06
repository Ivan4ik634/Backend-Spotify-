import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayLists } from 'src/schemes/Playlist.scheme';
import { UserSchema } from 'src/schemes/User.scheme';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'PlayLists', schema: PlayLists }]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, JwtService],
})
export class PlaylistModule {}
