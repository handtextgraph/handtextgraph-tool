import{AdminShell}from"@/components/admin/AdminShell";import{requireUser}from"@/lib/cms/auth";
export default async function PanelLayout({children}:{children:React.ReactNode}){const user=await requireUser();return <AdminShell user={user}>{children}</AdminShell>}
