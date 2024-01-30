'use client'
// Must use an AuthProvider for 
// client components to useSession
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import UserCard from '@/components/UserCard'

export default function ClientPage() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin?callbackUrl=/client')
        }
    })

    return (
        <section className="flex flex-col gap-6">
            <UserCard user={session?.user} pagetype={"Client"} />
        </section>
    )
}