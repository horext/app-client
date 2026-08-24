import type { UseCase } from '../shared/contracts'

export class ProjectValueQuery<Input, Output> implements UseCase<
  Input,
  Output
> {
  constructor(private readonly project: (input: Input) => Output) {}

  async execute(input: Input): Promise<Output> {
    return this.project(input)
  }
}
