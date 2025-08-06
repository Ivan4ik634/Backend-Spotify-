import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayLists } from 'src/schemes/Playlist.scheme';
import { User } from 'src/schemes/User.scheme';
import { CreatePlayListDto, UpdatePlayListDto } from './dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(PlayLists.name) private readonly playlist: Model<PlayLists>,
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async create(dto: CreatePlayListDto, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const newPlaylist = await this.playlist.create({
      ...dto,
      userId: user._id,
    });
    return newPlaylist;
  }
  async find() {
    const playlists = await this.playlist
      .find()
      .populate('userId')
      .populate({
        path: 'songs',
        populate: [{ path: 'userId' }, { path: 'album' }],
      });
    return playlists;
  }
  async update(dto: UpdatePlayListDto, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const playlist = await this.playlist.findById(dto.playlistId);
    if (!playlist) return 'Playlist not defined';

    if (String(user._id) !== String(playlist.userId))
      return 'You can not update your playlist';

    const updatePlaylist = await this.playlist.updateOne(
      { _id: dto.playlistId },
      { coverUrl: dto.coverUrl, name: dto.name, userId: user._id },
    );
    return updatePlaylist;
  }

  async delete(dto: { playlistId: string }, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const playlist = await this.playlist.findById(dto.playlistId);
    if (!playlist) return 'Playlist not defined';

    if (String(user._id) !== String(playlist.userId))
      return 'You can not delete your playlist';

    const updatePlaylist = await this.playlist.deleteOne({
      _id: dto.playlistId,
    });
    return updatePlaylist;
  }

  async findOne(dto: { playlistId: string }) {
    const playlist = await this.playlist
      .findById(dto.playlistId)
      .populate({
        path: 'songs',
        populate: [{ path: 'userId' }, { path: 'album' }],
      })
      .populate('userId');
    if (!playlist) return 'Playlist not defined';

    return playlist;
  }
  async getProfilePlaylist(id: string) {
    const user = await this.user.findById(id);
    if (!user) return 'User not defined';
    const playlists = await this.playlist
      .find()
      .populate('userId')
      .populate({
        path: 'songs',
        populate: [{ path: 'userId' }, { path: 'album' }],
      });
    return playlists;
  }
  async findLikes(userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const playlists = await this.playlist
      .find({ likes: user._id })
      .populate('userId')
      .populate({
        path: 'songs',
        populate: [{ path: 'userId' }, { path: 'album' }],
      });
    return playlists;
  }

  async like(dto: { playlistId: string }, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const playlist = await this.playlist.findById(dto.playlistId);
    if (!playlist) return 'Playlist not defined';

    if (playlist.likes.includes(userId)) {
      const updatePlaylist = await this.playlist.updateOne(
        { _id: dto.playlistId },
        { $pull: { likes: userId } },
      );
      return updatePlaylist;
    }
    const updatePlaylist = await this.playlist.updateOne(
      { _id: dto.playlistId },
      { $push: { likes: String(user._id) } },
    );
    return updatePlaylist;
  }
}
