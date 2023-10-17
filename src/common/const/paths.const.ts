import { join } from "path";
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from "./env-keys.const";

// 프로젝트가 시작된 위치 (프로젝트 루트)
export const PROJECT_ROOT_PATH = process.cwd();
// 외부에서 접근 가능한 파일들을 모아둘 폴더
export const PUBLIC_FOLDER_NAME = 'public';
// 포스트 이미지들을 저장할 폴더 이름
export const POSTS_FOLDER_NAME = 'posts';
// 임시 폴더 이름
export const TEMP_FOLDER_NAME = 'temp';
// 실제 공개폴더의 전체 위치
// /{프로젝트 위치}/public
export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH,
    PUBLIC_FOLDER_NAME,
);
// 실제 임시 파일을 저장할 위치
// /{프로젝트 위치}/public/posts/xxx.jpg
export const POST_IMAGE_PATH = join(
    PUBLIC_FOLDER_PATH,
    POSTS_FOLDER_NAME,
);
// 임시 파일들을 저장할 폴더
export const TEMP_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    TEMP_FOLDER_NAME,
);
// /public/posts/ -> GET 요청에서 image 위치 반환할때 사용
export const POST_PUBLIC_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    POSTS_FOLDER_NAME,
)