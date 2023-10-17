import { BadRequestException, Injectable, UseInterceptors } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { UsersModel } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFollowersModel } from './entity/user-followers.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        @InjectRepository(UserFollowersModel)
        private readonly userFollowersRepository: Repository<UserFollowersModel>,
    ) { }

    async getAllUsers() {
        return this.usersRepository.find();
    }

    async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
        // 1) nickname 중복이 없는지 확인
        // exist() -> 만약에 조건에 해당되는 값이 있으면 true 반환
        const nicknameExists = await this.usersRepository.exist({
            where: {
                nickname: user.nickname,
            }
        });

        if (nicknameExists) {
            throw new BadRequestException('이미 존재하는 nickname 입니다!');
        }

        const emailExists = await this.usersRepository.exist({
            where: {
                email: user.email,
            }
        });

        if (emailExists) {
            throw new BadRequestException('이미 가입한 이메일입니다!');
        }

        const userObject = this.usersRepository.create({
            nickname: user.nickname,
            email: user.email,
            password: user.password,
        });

        const newUser = await this.usersRepository.save(userObject);

        return newUser;
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
            },
        });
    }

    async followUser(followerId: number, followeeId: number, qr?: QueryRunner) {
        const userFollowRepository = this.getUserFollowRepository(qr);

        const existingFollow = await userFollowRepository.findOne({
            where: {
                follower: {
                    id: followerId,
                },
                followee: {
                    id: followeeId,
                },
            },
        });

        if (existingFollow) {
            throw new BadRequestException(
                '이미 팔로우 중입니다.',
            );
        }

        const result = await userFollowRepository.save({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            },
        });

        return result;
    }

    getUsersRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<UsersModel>(UsersModel) : this.usersRepository;
    }

    getUserFollowRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<UserFollowersModel>(UserFollowersModel) : this.userFollowersRepository;
    }

    async confirmFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
        const existing = await this.userFollowersRepository.findOne({
            where: {
                follower: {
                    id: followerId,
                },
                followee: {
                    id: followeeId,
                },
            },
        });

        if (!existing) {
            throw new BadRequestException(
                '존재하지 않는 팔로우 요청입니다.',
            );
        }

        await this.userFollowersRepository.save({
            ...existing,
            isConfirmed: true,
        });
    }

    async incrementFollowCount(userId: number, qr?: QueryRunner) {
        const userRepository = this.getUsersRepository(qr);

        await userRepository.increment({
            id: userId,
        }, 'followerCount', 1);
    }

    async decrementFollowCount(userId: number, qr?: QueryRunner){
        const userRepository = this.getUsersRepository(qr);

        await userRepository.decrement({
            id: userId,
        }, 'followerCount', 1);
    }

    async cancelFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
        const userFollowerRepository = this.getUserFollowRepository(qr);

        const existing = await userFollowerRepository.findOne({
            where: {
                follower: {
                    id: followerId,
                },
                followee: {
                    id: followeeId,
                },
            },
        });

        if (!existing) {
            throw new BadRequestException(
                '존재하지 않는 팔로우 요청입니다.',
            );
        }

        const result = await userFollowerRepository.delete({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            },
        });

        return result;
    }
}
