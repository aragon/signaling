import axios from 'axios'

const GITHUB_API_ROOT = 'https://api.github.com'

const githubEndpoints = {
  issues: () => (
    `${GITHUB_API_ROOT}/repos/aragon/governance/issues`
  )
}

export const listProposals = async () => {
  const res = await axios.get(githubEndpoints.issues())
  return res.data.map(({ title, url }) => ({ title, url }))
}
