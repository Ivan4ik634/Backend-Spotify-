import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/schemes/User.scheme';
import { editProfileDto, LoginDto, RegisterDto } from './dto/user';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}
  async register(dto: RegisterDto) {
    const user = await this.user.findOne({
      username: dto.username,
    });
    const userEmail = await this.user.findOne({
      email: dto.email,
    });
    if (user || userEmail)
      return {
        message: 'A user with this name or email already exists',
      };

    const newUser = await this.user.create({ ...dto });
    const emailVerifyToken = await this.jwt.signAsync(
      { _id: newUser._id },
      { secret: 'secret', expiresIn: '1h' },
    );
    const link = `<a href=https://white-spotify.vercel.app/verify?token=${emailVerifyToken}>Will confirm mail</a>`;
    const textEmail = `Thank you for registering! To activate your account, confirm your email using this link ${link}`;
    await this.email.sendEmail(
      newUser.email,
      'Mail confirmation',
      textEmail,
      textEmail,
    );

    return { message: 'A letter has appeared in the mail, check it!' };
  }
  async login(dto: LoginDto) {
    const userUserName = await this.user.findOne({ username: dto.username });
    console.log(userUserName, dto);
    if (userUserName) {
      if (userUserName.password === dto.password) {
        const emailVerifyToken = await this.jwt.signAsync(
          { _id: userUserName._id },
          { secret: 'secret', expiresIn: '1h' },
        );
        const link = `<a href=https://white-spotify.vercel.app/verify?token=${emailVerifyToken}>Will confirm mail</a>`;
        const textEmail = `Thank you for returning to our platform! To activate your account, confirm your email using this link ${link}`;
        await this.email.sendEmail(
          userUserName.email,
          'Mail confirmation',
          textEmail,
          textEmail,
        );
        return { message: 'A letter has appeared in the mail, check it!' };
      }
    }

    return { message: 'Incorrect login or password' };
  }

  async verifyEmail(token: string) {
    const user = await this.jwt.verify(token, { secret: 'secret' });
    const userVerify = await this.user.findById(user._id);
    if (!userVerify) return { message: 'User not found' };
    const newToken = await this.jwt.signAsync(
      { _id: user._id },
      { secret: 'secret', expiresIn: '30d' },
    );

    return { token: newToken, userId: String(user._id) };
  }

  async editProfile(userId: string, dto: editProfileDto) {
    const userUserName = await this.user.findOne({ username: dto.username });
    const userEmail = await this.user.findOne({ email: dto.email });
    if (userUserName && userEmail) return { message: 'Name not found' };
    const user = await this.user.findById(userId);
    if (!user) return { message: 'User not found' };
    const data = {
      ...dto,
      email: dto.email === '' ? user.email : dto.email,
      username: dto.username === '' ? user.username : dto.username,
    };
    const userUpdate = await this.user.findByIdAndUpdate(userId, {
      ...data,
    });

    return { userUpdate };
  }

  async profile(userId: string) {
    const profile = await this.user.findById(userId);
    return profile;
  }
  async profileUserName(id: string) {
    const profile = await this.user.findById(id);
    if (!profile) return 'User not defined';

    return profile;
  }
}
