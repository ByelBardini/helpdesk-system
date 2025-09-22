export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white z-[200]">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute w-20 h-20 border-4 border-white/10 rounded-full"></div>
        <div className="absolute w-20 h-20 border-4 border-t-[#6bb7ff] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-xl font-semibold tracking-wide bg-gradient-to-r from-[#ffb86b] via-[#ff6b98] to-[#6bb7ff] bg-clip-text text-transparent animate-pulse">
          Carregando...
        </p>
        <p className="mt-2 text-sm text-white/70">
          Logo tudo estará pronto!
        </p>
      </div>
    </div>
  );
}