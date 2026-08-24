import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const runtime = join(import.meta.dirname, '..')

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory() && entry.name === '__tests__') return []
    return entry.isDirectory()
      ? sourceFiles(path)
      : entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')
        ? [path]
        : []
  })
}

const TYPE_ONLY_FILES = new Set([
  'application/ports/anonymous-data-migration.ts',
  'application/ports/anonymous-data.repository.ts',
  'application/ports/aggregate-sync-use-case.ts',
  'application/ports/cloud-change-applier.ts',
  'application/ports/cloud-changes-gateway.ts',
  'application/ports/collection-resource-snapshot.gateway.ts',
  'application/ports/individual-resource-snapshot.gateway.ts',
  'application/ports/replica-repository.ts',
  'application/ports/sync-operation-gateway.ts',
  'application/ports/sync-state.repository.ts',
  'domain/models/initial-sync-strategy.ts',
  'domain/models/remote-change.ts',
  'infrastructure/http/sync-api.contracts.ts',
  'infrastructure/http/sync-mutation-api.gateway.ts',
  'index.ts',
])

describe('synchronization architecture', () => {
  it('Given synchronization domain sources, when imports are inspected, then no application or infrastructure dependency exists', () => {
    for (const file of sourceFiles(join(runtime, 'domain'))) {
      const source = readFileSync(file, 'utf8')
      expect(source, file).not.toMatch(
        /(?:application|infrastructure|plugins)\//,
      )
      expect(source, file).not.toMatch(
        /\b(?:defineNuxtPlugin|\$fetch|indexedDB)\b/,
      )
    }
  })

  it('Given synchronization application sources, when imports are inspected, then no infrastructure or Nuxt dependency exists', () => {
    for (const file of sourceFiles(join(runtime, 'application'))) {
      const source = readFileSync(file, 'utf8')
      expect(source, file).not.toMatch(/infrastructure\//)
      expect(source, file).not.toMatch(
        /\b(?:defineNuxtPlugin|\$fetch|indexedDB)\b/,
      )
    }
  })

  it('Given executable synchronization sources, when test structure is inspected, then every source has a matching specification', () => {
    const executable = sourceFiles(runtime).filter(
      (file) => !TYPE_ONLY_FILES.has(relative(runtime, file)),
    )
    for (const file of executable) {
      const specification = join(
        dirname(file),
        '__tests__',
        `${basename(file, '.ts')}.spec.ts`,
      )
      expect(existsSync(specification), relative(runtime, file)).toBe(true)
    }
    expect(
      existsSync(join(runtime, '..', '__tests__', 'index.spec.ts')),
      'modules/synchronization/index.ts',
    ).toBe(true)
  })
})
