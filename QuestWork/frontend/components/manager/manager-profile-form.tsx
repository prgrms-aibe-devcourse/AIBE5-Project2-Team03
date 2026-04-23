'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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

  const onSubmit = async (data: ManagerProfileData) => {
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch(`http://localhost:8000/api/manager/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update manager profile')

      setSuccessMessage('매니저 프로필이 업데이트되었습니다.')
      localStorage.setItem('nickname', data.nickname)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Update Error:', error)
      setErrorMessage('변경 사항을 저장하는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-border p-6 shadow-none">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">프로필 설정</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          매니저 계정의 기본 정보와 회사 정보를 수정할 수 있습니다.
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          {successMessage}
        </div>
      )}

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
              {isLoading ? '저장 중...' : '변경 사항 저장'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
