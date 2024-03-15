import type { ISubjectStudyPlan } from '~/interfaces/subject'

export const groupByCycle = (subjects: ISubjectStudyPlan[]) => {
  const subjectsByCycle: Record<string, ISubjectStudyPlan[]> = {}
  subjects.forEach((subject) => {
    if (!subjectsByCycle[subject.cycle]) {
      subjectsByCycle[subject.cycle] = []
    }
    subjectsByCycle[subject.cycle].push(subject)
  })
  return subjectsByCycle
}

export const generateStudyPlanDigramState = (subjects: ISubjectStudyPlan[]) => {
  const subjectsByCycle = groupByCycle(subjects)
  return `
stateDiagram-v2

${Object.entries(subjectsByCycle)
  .map(
    ([cycle, subjects], index, elements) => `
  state  "Ciclo ${cycle}" as ciclo${cycle} {
${subjects
  .map(
    (subject) =>
      `    state "${subject.course.id}<br>${subject.course.name.replaceAll(' ', '<br>')}<br>" as ${subject.id}`,
  )
  .join('\n')}
  } 
  ${index === 0 ? '' : `ciclo${elements[index - 1][0]} --> ciclo${cycle}`}
  `,
  )
  .join('')}
${subjects
  .map((subject) =>
    subject.relationships
      .map(
        (relationship) => `${relationship.relatedSubjectId} --> ${subject.id}
`,
      )
      .join(''),
  )
  .join('')}
`
}

export const generateStudyPlanDigramBlock = (subjects: ISubjectStudyPlan[]) => {
  const subjectsByCycle = groupByCycle(subjects)
  return `
block-beta
  columns 1
${Object.entries(subjectsByCycle)
  .map(
    ([cycle, subjects]) => `
  block:group${cycle}:1
    columns ${subjects.length}
${subjects
  .map(
    (subject) => `    ${subject.id}["
      ${subject.course.id}<br>
      ${
        // remove repeating spaces and replace with <br> to break line
        subject.course.name.replaceAll(' ', '<br>')
      }<br>"]`,
  )
  .join('\n')}
  end`,
  )
  .join('\n')}
  space
${subjects
  .map((subject) =>
    subject.relationships
      .map(
        (relationship) => `${relationship.relatedSubjectId} --> ${subject.id}
`,
      )
      .join(''),
  )
  .join('')}
`
}

export const generateStudyPlanDiagramFlowChart = (
  subjects: ISubjectStudyPlan[],
) => {
  const subjectsByCycle = groupByCycle(subjects)
  return `
  flowchart LR
  ${Object.entries(subjectsByCycle)
    .map(
      ([cycle, subjects]) => `
    subgraph group${cycle} ["Ciclo ${cycle}"]
  ${subjects
    .map(
      (subject) => `    ${subject.id}["
        ${subject.course.id}<br>
        ${
          // remove repeating spaces and replace with <br> to break line
          subject.course.name.replaceAll(' ', '<br>')
        }<br>"]`,
    )
    .join('\n')}
    end`,
    )
    .join('\n')}

${subjects
.map((subject) =>
    subject.relationships
    .map(
        (relationship) => `${relationship.relatedSubjectId} -.-> ${subject.id}
`,
    )
    .join(''),
)
.join('')}
`
}
