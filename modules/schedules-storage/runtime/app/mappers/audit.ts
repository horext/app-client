export const toAuditRecord = (audit: {
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}) => ({
  createdAt: audit.createdAt,
  updatedAt: audit.updatedAt,
  createdBy: audit.createdBy,
  updatedBy: audit.updatedBy,
})
