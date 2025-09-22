import React from "react";
import Logo from "../assets/logo-empresa.png";

export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          backgroundPosition: "0 0, 0 0",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.08,
          background:
            "radial-gradient(600px 300px at 15% 20%, rgba(255,255,255,.18), transparent 60%), radial-gradient(520px 260px at 85% 80%, rgba(255,255,255,.10), transparent 60%)",
        }}
      />

      <div className="lg:col-span-2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 shadow-xl rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-center text-white">
              Acesso ao Sistema de Chamados
            </h2>
            <p className="mt-1 text-sm text-center text-white/70">
              Entre com suas credenciais para continuar
            </p>

            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-white/80">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:ring-4 focus:ring-[#6bb7ff]/30 focus:border-white/20 placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-white/80">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:ring-4 focus:ring-[#ff6b98]/30 focus:border-white/20 placeholder:text-white/50"
                />
              </div>

              <button className="cursor-pointer w-full rounded-xl py-3 font-semibold shadow-lg transition active:scale-[.99] bg-gradient-to-r from-[#ffb86b] via-[#ff6b98] to-[#6bb7ff] hover:opacity-95">
                Entrar
              </button>

              <p className="text-center text-sm text-white/60">
                Para conseguir seu login, fale com o seu supervisor
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 hidden lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#201f55]/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <img
            src={Logo}
            alt="Logo SubmIT"
            className="h-60 mb-8 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-bold text-white">Bem-vindo ao SubmIT</h1>
          <p className="mt-4 text-white/70 max-w-md">
            Sistema de chamados de TI
          </p>
        </div>
      </div>
    </div>
  );
}