import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from 'src/schemes/Album.scheme';
import { User } from 'src/schemes/User.scheme';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private readonly album: Model<Album>,
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async create(dto: CreateAlbumDto, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const newAlbum = await this.album.create({ ...dto, userId: user._id });
    return newAlbum;
  }
  async find() {
    const albums = await this.album
      .find()
      .populate('userId')
      .populate({
        path: 'songs',
        populate: [{ path: 'userId' }, { path: 'album' }],
      });
    return albums;
  }
  async update(dto: UpdateAlbumDto, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const album = await this.album.findById(dto.albumId);
    if (!album) return 'Album not defined';

    if (String(user._id) !== String(album.userId))
      return 'You can not update your album';

    const updateAlbum = await this.album.updateOne(
      { _id: dto.albumId },
      { coverUrl: dto.coverUrl, name: dto.name, userId: user._id },
    );
    return updateAlbum;
  }

  async delete(dto: { albumId: string }, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const album = await this.album.findById(dto.albumId);
    if (!album) return 'Album not defined';

    if (String(user._id) !== String(album.userId))
      return 'You can not delete your album';

    const updateAlbum = await this.album.deleteOne({ _id: dto.albumId });
    return updateAlbum;
  }

  async findOne(dto: { albumId: string }) {
    const album = await this.album
      .findById(dto.albumId)
      .populate({
        path: 'songs',
        populate: [{ path: 'userId' }, { path: 'album' }],
      })
      .populate('userId');
    if (!album) return 'Album not defined';

    return album;
  }
  async getProfileAlbum(id: string) {
    const user = await this.user.findById(id);
    if (!user) return 'User not defined';
    const playlists = await this.album
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

    const albums = await this.album
      .find({ likes: user._id })
      .populate('userId')
      .populate({
        path: 'songs',
        populate: [{ path: 'userId' }, { path: 'album' }],
      });
    return albums;
  }

  async like(dto: { albumId: string }, userId: string) {
    const user = await this.user.findById(userId);
    if (!user) return 'User not defined';

    const album = await this.album.findById(dto.albumId);
    if (!album) return 'Album not defined';

    if (album.likes.includes(userId)) {
      const updateAlbum = await this.album.updateOne(
        { _id: dto.albumId },
        { $pull: { likes: userId } },
      );
      return updateAlbum;
    }
    const updateAlbum = await this.album.updateOne(
      { _id: dto.albumId },
      { $push: { likes: String(user._id) } },
    );
    return updateAlbum;
  }
}
