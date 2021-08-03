export class CreateSexualRoleDTO {
  name: string;
}

export class GetSexualRoleDTO {
  id: string;
}

export type CreateOrGetSexualRoleDTO = CreateSexualRoleDTO | GetSexualRoleDTO;
