import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Something went wrong. Please try again.');
      } else {
        toast.success(data.message);
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/login');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Card className="w-full max-w-md pt-6 px-6">
        <form onSubmit={register} className="space-y-5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Register</CardTitle>
            <CardDescription className="text-base">
              Create an account to start building your personalized meal plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={ev => setUsername(ev.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={ev => setEmail(ev.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={ev => setPassword(ev.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;
