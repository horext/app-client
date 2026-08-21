export interface IOrganizationTypeResponse {
  id: number
  name: string
}

export interface IOrganizationReferenceResponse {
  id: number
}

export type IOrganizationSummaryResponse =
  | (IOrganizationReferenceResponse & { name: null; code: null })
  | Pick<IOrganizationResponse, 'id' | 'name' | 'code'>

export interface IOrganizationResponse extends IOrganizationReferenceResponse {
  parentOrganizationUnit: IOrganizationReferenceResponse
  code: string
  name: string
  type: IOrganizationTypeResponse
}
