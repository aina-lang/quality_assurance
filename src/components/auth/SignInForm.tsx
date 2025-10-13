"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function SignInForm() {
  const router = useRouter();
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "L'email est obligatoire." }));
      setLoading(false);
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Le mot de passe est obligatoire." }));
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error.includes("Email")) {
        setErrors({ email: res.error });
      } else if (res.error.includes("Mot de passe")) {
        setErrors({ password: res.error });
      } else {
        setErrors({ email: "Identifiants incorrects." });
      }
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-1/2 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Titre */}
      <div className="text-center w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Connexion Administrateur
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Veuillez vous connecter pour accéder à votre tableau de bord
        </p>
      </div>
      <div className="max-w-md w-full space-y-8 p-10 ">


        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                error={!!errors.email}
                hint={errors.email ? errors.email : "Entrez votre adresse email administrateur"}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                error={!!errors.password}
                hint={errors.password ? errors.password : "Entrez votre mot de passe administrateur"}
              />
            </div>
          </div>

          <Button className="w-full py-3 mt-4" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
