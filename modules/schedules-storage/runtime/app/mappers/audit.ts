export const toAuditRecord = (entity: {
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}) => ({
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  createdBy: entity.createdBy,
  updatedBy: entity.updatedBy,
})
