import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from 'src/schemes/Album.scheme';
import { PlayLists } from 'src/schemes/Playlist.scheme';
import { Song } from 'src/schemes/Song.scheme';
import { User } from 'src/schemes/User.scheme';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongService {
  constructor(
    @InjectModel('User') private readonly user: Model<User>,
    @InjectModel('Song') private readonly song: Model<Song>,
    @InjectModel('Album') private readonly album: Model<Album>,
    @InjectModel(PlayLists.name) private readonly playlist: Model<PlayLists>,
  ) {}
  async create(createSongDto: CreateSongDto, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const newSong = await this.song.create({
      ...createSongDto,
      userId: user._id,
    });
    if (createSongDto.album) {
      const album = await this.album.findById(createSongDto.album);
      if (!album) return 'Album not defined';
      const updateAlbum = await this.album.updateOne(
        { _id: createSongDto.album },
        { $push: { songs: newSong._id } },
      );
    }
    return newSong;
  }
  async findLikes(userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';
    const songsLikes = await this.song.find({ likes: userId });
    return songsLikes;
  }
  async findAll() {
    const songs = await this.song.find().sort({ createdAt: -1 });
    return songs;
  }
  async like(userId: string, id: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';
    const song = await this.song.findById(id);
    if (!song) return 'Song not defined';
    if (song.likes.includes(userId)) {
      const updateSong = await this.song.updateOne(
        { _id: id },
        { $pull: { likes: userId } },
      );
      return updateSong;
    }
    const updateSong = await this.song.updateOne(
      { _id: id },
      { $push: { likes: String(user._id) } },
    );
    return updateSong;
  }

  async findOne(id: number) {
    const song = await this.song.findOneAndUpdate(
      { _id: id },
      { $inc: { views: 1 } },
    );
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const song = await this.song.findById(id);
    if (!song) return 'Song not defined';
    if (song.userId !== user._id) return 'You can not update your song';

    const updatedSong = await this.song.findOneAndUpdate(
      { _id: id },
      {
        ...updateSongDto,
        userId: user._id,
      },
    );
    return updatedSong;
  }
  async addSongToPlaylist(
    dto: { songId: string; playlistId: string },
    userId: string,
  ) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const playlist = await this.playlist.findOne({ _id: dto.playlistId });
    if (!playlist) return 'Playlist not found';
    if (String(playlist.userId) !== userId)
      return 'You can not add song to your playlist';

    if (playlist.songs.some((song) => String(song) === dto.songId)) {
      const updatedPlaylist = await this.playlist.findOneAndUpdate(
        { _id: dto.playlistId },
        { $pull: { songs: dto.songId } },
      );
      return updatedPlaylist;
    }
    const updatedPlaylist = await this.playlist.findOneAndUpdate(
      { _id: dto.playlistId },
      { $push: { songs: dto.songId } },
    );
    return updatedPlaylist;
  }
  async remove(id: string, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const song = await this.song.findById(id);
    if (!song) return 'Song not defined';
    if (String(song.userId) === String(user._id))
      return 'You can not update your song';

    await this.song.deleteOne({ _id: id });
    return 'Song deleted';
  }
}
