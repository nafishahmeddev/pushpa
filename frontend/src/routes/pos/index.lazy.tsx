import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/pos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Please create new order!</div>
}
