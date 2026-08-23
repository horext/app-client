export interface IOrganizationTypeResponse {
  id: number
  name: string
}

export interface IOrganizationReferenceResponse {
  id: number
}

export interface IOrganizationResponse extends IOrganizationReferenceResponse {
  parentOrganizationUnit: IOrganizationReferenceResponse
  code: string
  name: string
  type: IOrganizationTypeResponse
}
