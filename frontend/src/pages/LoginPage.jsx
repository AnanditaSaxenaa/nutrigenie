import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

 // needed to extract user info

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuth();

  async function login(ev) {
    ev.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(data.message);

      setIsLoggedIn(true);
      const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
        credentials: 'include',
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
        navigate('/dashboard');
      }
    } else {
      toast.error('Login failed');

    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const googleEmail = decoded.email;
      const googleName = decoded.name;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: googleEmail, username: googleName }),
      });

      if (res.ok) {
        const profile = await res.json();
        setUser(profile);
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        toast.error('Google login failed');
        console.error('Google login failed');
      }
    } catch (err) {
      toast.error('Google login failed');

      console.error('Google login error', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Card className="w-full max-w-md pt-6 px-6">
        <form onSubmit={login} className="space-y-5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription className="text-base">
              Enter your email and password to login or continue with Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={ev => setEmail(ev.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={ev => setPassword(ev.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
              <div className="text-center text-muted-foreground">or</div>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.error("Google login error")}
              />
            </div>
          </CardContent>
        </form>
        <div className="text-center text-sm text-muted-foreground mt-2">
        Don’t have an account? <Link to="/register" className="text-primary underline">Register</Link>
      </div>

      </Card>
    </div>
  );
}

export default LoginPage;
