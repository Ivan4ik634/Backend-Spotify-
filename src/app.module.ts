import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumModule } from './album/album.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SongModule } from './song/song.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:wwwwww@db.fv61aqt.mongodb.net/?retryWrites=true&w=majority&appName=DB',
    ),
    AlbumModule,
    UserModule,
    UploadModule,
    SongModule,
    PlaylistModule,
    PingModule,
  ],
})
export class AppModule {}
