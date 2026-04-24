'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface ManagerProfileData {
  nickname: string
  managerName: string
  companyName: string
  contactPhone: string
  businessNumber: string
}

export function ManagerProfileForm({ userId }: { userId: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const form = useForm<ManagerProfileData>({
    defaultValues: {
      nickname: '',
      managerName: '',
      companyName: '',
      contactPhone: '',
      businessNumber: '',
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return
      setIsLoading(true)

      try {
        const response = await fetch(`http://localhost:8000/api/manager/${userId}`)
        if (!response.ok) throw new Error('Failed to load manager profile')

        const data = await response.json()
        form.reset({
          nickname: data.nickname || data.username || '',
          managerName: data.managerName || '',
          companyName: data.companyName || '',
          contactPhone: data.contactPhone || '',
          businessNumber: data.businessNumber || '',
        })
      } catch (error) {
        console.error('Fetch Error:', error)
        setErrorMessage('현재 매니저 프로필 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userId, form])

  const handleSuccessConfirm = () => {
    setIsSuccessOpen(false)
    router.refresh()
    window.location.reload()
  }

  const onSubmit = async (data: ManagerProfileData) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`http://localhost:8000/api/manager/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update manager profile')

      localStorage.setItem('nickname', data.nickname)
      setIsSuccessOpen(true)
    } catch (error) {
      console.error('Update Error:', error)
      setErrorMessage('변경 사항을 저장하던 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="border border-border p-6 shadow-none">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">프로필 설정</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            매니저 계정의 기본 정보와 회사 정보를 수정할 수 있습니다.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {errorMessage}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>표시 이름</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>담당자 이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="담당자 이름"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사명</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="회사명"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>연락처</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="010-0000-0000"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사업자 번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000-00-00000"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                초기화
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                {isLoading ? '저장 중...' : '변경사항 저장'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md rounded-[28px] border border-[#A78BFA]/25 bg-white p-0 shadow-[0_30px_80px_-36px_rgba(109,40,217,0.35)]">
          <div className="px-8 pb-8 pt-9">
            <DialogHeader className="items-center text-center">
              <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#6D28D9]/8 ring-8 ring-[#A78BFA]/10">
                <CheckCircle2 className="h-10 w-10 text-[#6D28D9]" strokeWidth={2.2} />
              </div>
              <DialogTitle className="text-center text-[28px] font-bold tracking-[-0.03em] text-foreground">
                프로필이 업데이트되었습니다.
              </DialogTitle>
              <DialogDescription className="max-w-[260px] pt-2 text-center text-sm leading-6 text-foreground-muted">
                확인을 누르면 화면을 새로고침합니다.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-8 sm:justify-center">
              <Button
                type="button"
                onClick={handleSuccessConfirm}
                className="min-w-28 rounded-xl bg-[#6D28D9] px-6 text-white shadow-[0_14px_30px_-14px_rgba(109,40,217,0.65)] hover:bg-[#5B21B6]"
              >
                확인
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
