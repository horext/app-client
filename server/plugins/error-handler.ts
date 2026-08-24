import {
  MissingMetadataError,
  MissingReferenceError,
  ResourceNotFoundError,
} from '../application/use-cases/shared/errors'
import { isError, setResponseHeader, setResponseStatus } from 'h3'

interface HttpError extends Error {
  data?: unknown
  statusCode?: number
  statusMessage?: string
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    if (!event || !(error instanceof Error)) return

    const httpError = error as HttpError
    const requestId = event.context.requestId
    if (typeof requestId === 'string')
      setResponseHeader(event, 'x-request-id', requestId)

    if (httpError instanceof ResourceNotFoundError)
      mapError(httpError, 404, 'Not Found', httpError.message, {
        code: httpError.code,
        requestId,
      })
    else if (httpError instanceof MissingReferenceError)
      mapError(httpError, 409, 'Conflict', httpError.message, {
        code: 'missing-schedule',
        requestId,
      })
    else if (httpError.name === 'RepositoryRevisionConflictError')
      mapError(httpError, 412, 'Precondition Failed', httpError.message, {
        code: 'stale-revision',
        requestId,
      })
    else if (httpError instanceof MissingMetadataError)
      maskInternalError(httpError, requestId)
    else if (isError(httpError))
      httpError.data = withRequestId(httpError.data, requestId)
    else maskInternalError(httpError, requestId)

    setResponseStatus(event, httpError.statusCode ?? 500)
    if ((httpError.statusCode ?? 500) >= 500)
      console.error('[server error]', {
        requestId,
        method: event.method,
        path: event.path,
        error,
      })
  })
})

function mapError(
  error: HttpError,
  statusCode: number,
  statusMessage: string,
  message: string,
  data: Record<string, unknown>,
): void {
  Object.assign(error, { statusCode, statusMessage, message, data })
}

function maskInternalError(error: HttpError, requestId: unknown): void {
  mapError(
    error,
    500,
    'Internal Server Error',
    'An unexpected error occurred.',
    typeof requestId === 'string' ? { requestId } : {},
  )
}

function withRequestId(data: unknown, requestId: unknown): unknown {
  if (typeof requestId !== 'string') return data
  if (data && typeof data === 'object' && !Array.isArray(data))
    return { ...data, requestId }
  return { requestId }
}
