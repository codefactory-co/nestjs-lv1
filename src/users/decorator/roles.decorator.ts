import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "../const/roles.const";

// Role Enum 메타데이터 저장할 키값
export const ROLES_KEY = 'roles';

// Roles Annotation 정의
// 몇개의 Role들이 입력되든 갯수 만큼 Meta 데이터로 저장함
export const Roles = (role: RolesEnum) =>
    SetMetadata(ROLES_KEY, role);