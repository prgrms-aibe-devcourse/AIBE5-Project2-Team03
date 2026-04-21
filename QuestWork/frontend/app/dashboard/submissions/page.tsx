import { redirect } from 'next/navigation'

export default function DashboardSubmissionsRedirect() {
  redirect('/dashboard/my-submissions')
}
