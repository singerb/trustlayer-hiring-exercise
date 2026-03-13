import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('events/:id', 'routes/events.$id.tsx'),
  route('events/:id/add-feedback', 'routes/events.$id.add-feedback.tsx'),
] satisfies RouteConfig
