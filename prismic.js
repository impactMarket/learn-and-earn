import * as prismic from '@prismicio/client'
// Fill in your repository name
export const repositoryName = import.meta.env.VITE_REPO_NAME

export const client = prismic.createClient(repositoryName, {
  // If your repository is private, add an access token
  accessToken: import.meta.env.VITE_PRISMIC_KEY,

  // This defines how you will structure URL paths in your project.
  // Update the types to match the custom types in your project, and edit
  // the paths to match the routing in your project.
  //
  // If you are not using a router in your project, you can change this
  // to an empty array or remove the option entirely.
  routes: [],
})