import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <Button className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 