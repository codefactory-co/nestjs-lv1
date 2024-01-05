import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = 'is_public';

export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);