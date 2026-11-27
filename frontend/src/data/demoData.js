export const demoProfile = {
  age: '22',
  gender: 'female',
  state: 'Exemplia',
  category: 'general',
  occupation: 'student',
  income: '180000',
  education: 'undergraduate',
  purpose: 'education',
  citizenship: 'citizen',
  academicStanding: 'passed',
  academicScore: '62',
  otherGrant: 'no',
}

export function evaluateDemoScheme(profile) {
  const criteria = [
    { key: 'age', passed: Number(profile.age) >= 17 && Number(profile.age) <= 30, known: Boolean(profile.age) },
    { key: 'education', passed: ['undergraduate', 'vocational'].includes(profile.education), known: Boolean(profile.education && profile.education !== 'unknown') },
    { key: 'income', passed: Number(profile.income) <= 250000, known: Boolean(profile.income) },
    { key: 'citizenship', passed: profile.citizenship === 'citizen', known: profile.citizenship !== 'unknown' },
    { key: 'academicStanding', passed: profile.academicStanding === 'passed' && Number(profile.academicScore) >= 50, known: profile.academicStanding !== 'unknown' && Boolean(profile.academicScore) },
    { key: 'otherGrant', passed: profile.otherGrant === 'no', known: profile.otherGrant !== 'unknown' },
  ].map((criterion) => ({ ...criterion, status: !criterion.known ? 'unknown' : criterion.passed ? 'matched' : 'not_matched' }))

  const status = criteria.some((item) => item.status === 'notMatched')
    ? 'not_relevant'
    : criteria.some((item) => item.status === 'unknown')
      ? 'requires_more_information'
      : 'highly_relevant'

  return {
    id: 'efgp',
    nameKey: 'demoSchemeName',
    summaryKey: 'demoSchemeSummary',
    category: 'education',
    status,
    criteria,
    benefits: ['demoBenefitTuition', 'demoBenefitLiving', 'demoBenefitMaterials', 'demoBenefitExam'],
    documents: ['demoDocumentAge', 'demoDocumentEnrollment', 'demoDocumentIncome', 'demoDocumentGrades', 'demoDocumentCitizenship'],
    isDemo: true,
  }
}
