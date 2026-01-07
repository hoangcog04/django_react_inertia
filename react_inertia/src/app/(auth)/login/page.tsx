"use client"

import { ROUTES } from "@/constants"
import AuthLayout from "@/layouts/auth-layout"
import { useLogin } from "@/services/useAuth"
import { FormPageConfig } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next13-progressbar"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import TextLink from "@/components/text-link"

const loginSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập là bắt buộc" }),
  password: z.string().min(1, { message: "Mật khẩu là bắt buộc" }),
  remember: z.boolean().optional(),
})
type TLogin = z.infer<typeof loginSchema>

const formPageConfig: FormPageConfig<TLogin> = {
  defaultValues: {
    username: "",
    password: "",
    remember: false,
  },
}

export default function Login() {
  const canResetPassword = true
  const canRegister = true
  const status = ""

  const router = useRouter()
  const { mutate: login, isPending } = useLogin()

  const form = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: formPageConfig.defaultValues,
  })

  const handleSubmit = form.handleSubmit((data) => {
    login(data, {
      onSuccess: () => {
        toast.success("Login successful")
        router.push(ROUTES.dashboard)
      },
    })
  })

  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <Form {...form}>
        <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel htmlFor="username">Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="username"
                        type="text"
                        name="username"
                        autoFocus
                        tabIndex={1}
                        autoComplete="username"
                        placeholder="Tên đăng nhập"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      {canResetPassword && (
                        <TextLink
                          href={ROUTES.forgot_password}
                          className="ml-auto text-sm"
                          tabIndex={5}
                        >
                          Forgot password?
                        </TextLink>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        name="password"
                        tabIndex={2}
                        autoComplete="current-password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        id="remember"
                        name="remember"
                        tabIndex={3}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="remember" className="!mt-0">
                      Remember me
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4 w-full"
              tabIndex={4}
              // disabled={processing}
              data-test="login-button"
            >
              {/* {processing && <Spinner />} */}
              Log in
            </Button>
          </div>

          {canRegister && (
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <TextLink href={ROUTES.register} tabIndex={5}>
                Sign up
              </TextLink>
            </div>
          )}
        </form>
      </Form>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}
    </AuthLayout>
  )
}
