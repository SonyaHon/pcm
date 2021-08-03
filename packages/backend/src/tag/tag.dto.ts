export class CreateTagDTO {
  name: string;
}

export class GetTagDTO {
  id: string;
}

export type CreateOrGetTagDTO = CreateTagDTO | GetTagDTO;
