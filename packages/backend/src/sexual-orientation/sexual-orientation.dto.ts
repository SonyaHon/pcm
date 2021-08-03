export class CreateSexualOrientationDTO {
  name: string;
}

export class GetSexualOrientationDTO {
  id: string;
}

export type CreateOrGetSexualOrientationDTO =
  | CreateSexualOrientationDTO
  | GetSexualOrientationDTO;
