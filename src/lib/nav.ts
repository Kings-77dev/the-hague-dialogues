// Navigation — faithful to the prototype (6-item header nav; About is not linked
// in the prototype header). Hash routes → real Next routes.
export const HEADER_NAV = [
  {label: 'Home', href: '/'},
  {label: 'About', href: '/about'},
  {label: 'Events', href: '/events'},
  {label: 'News', href: '/news'},
  {label: 'Media', href: '/media'},
  {label: 'Get Involved', href: '/get-involved'},
  {label: 'Contact', href: '/contact'},
] as const

// Footer link order from the prototype footer.
export const FOOTER_NAV = [
  {label: 'Home', href: '/'},
  {label: 'Events', href: '/events'},
  {label: 'Media', href: '/media'},
  {label: 'Get Involved', href: '/get-involved'},
  {label: 'News', href: '/news'},
  {label: 'Contact', href: '/contact'},
] as const

export type NavItem = {label: string; href: string}
