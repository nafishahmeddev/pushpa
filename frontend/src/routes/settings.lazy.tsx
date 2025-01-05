import { SideMenuList } from '@app/components/SideMenuList'
import {
  createLazyFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/settings')({
  component: RouteComponent,
})

export default function RouteComponent() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (pathname == '/settings') {
      navigate({ to: '/settings/details' })
    }
  }, [pathname])
  return (
    <div className="h-full grid grid-cols-[auto_1fr]">
      <div className="bg-white border-e w-[200px]">
        <SideMenuList
          items={[
            {
              label: 'Details',
              icon: 'solar:info-square-linear',
              route: '/settings/details',
            },
            {
              label: 'Categories',
              icon: 'clarity:file-group-line',
              route: '/settings/categories',
            },

            {
              label: 'Products',
              icon: 'bytesize:book',
              route: '/settings/products',
            },

            {
              label: 'Locations',
              icon: 'hugeicons:floor-plan',
              route: '/settings/locations',
            },

            {
              label: 'Tables',
              icon: 'solar:armchair-outline',
              route: '/settings/tables',
            },
          ]}
        />
      </div>
      <div className="h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
